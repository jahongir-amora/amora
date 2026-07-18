/**
 * Amora uchun Cloudflare Worker proksi — Google Gemini (bepul tarif) uchun.
 *
 * Frontend (App.jsx) hamon "Claude uslubidagi" so'rov yuboradi
 * ({ system, messages, stream }), shuning uchun frontend kodida
 * HECH NARSANI o'zgartirish shart emas — bu Worker so'rovni Gemini
 * formatiga o'zi o'giradi va javobni ham eski formatga qaytarib beradi.
 *
 * Deploy qilish yo'riqnomasi: worker/README.md faylida.
 */

const ALLOWED_ORIGIN = "https://YOUR-GITHUB-USERNAME.github.io"; // <-- o'zgartiring
const GEMINI_MODEL = "gemini-2.0-flash";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }
    if (!env.GEMINI_API_KEY) {
      return jsonError("Server sozlanmagan: GEMINI_API_KEY o'rnatilmagan.", 500);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonError("Noto'g'ri so'rov formati.", 400);
    }

    if (Array.isArray(body.messages) && body.messages.length > 60) {
      return jsonError("Suhbat juda uzun.", 400);
    }

    // Anthropic uslubidagi xabarlarni Gemini uslubiga o'giramiz.
    // content matn ("string") yoki bloklar massivi (matn + rasm/PDF) bo'lishi mumkin.
    function toParts(content) {
      if (Array.isArray(content)) {
        return content.map((block) => {
          if (block.type === "media" && block.data) {
            return { inlineData: { mimeType: block.media_type || "application/octet-stream", data: block.data } };
          }
          return { text: String(block.text || "") };
        });
      }
      return [{ text: String(content || "") }];
    }
    const contents = (body.messages || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: toParts(m.content),
    }));

    const geminiBody = {
      contents,
      systemInstruction: body.system ? { parts: [{ text: body.system }] } : undefined,
      generationConfig: { maxOutputTokens: body.max_tokens || 1000 },
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    let upstream;
    try {
      upstream = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify(geminiBody),
      });
    } catch (e) {
      return jsonError("Gemini serveriga ulanib bo'lmadi.", 502);
    }

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      return jsonError(`Gemini xatosi: ${upstream.status} ${errText}`.slice(0, 300), upstream.status);
    }

    const data = await upstream.json().catch(() => null);
    const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    const text = Array.isArray(parts) ? parts.map((p) => p.text || "").join("") : "";

    // Frontend "stream: true" so'rasa ham, soddalik uchun bitta yaxlit
    // matnni bitta SSE hodisasi sifatida qaytaramiz — App.jsx buni to'g'ri
    // qabul qiladi (faqat so'z-baso'z emas, birdaniga chiqadi).
    if (body.stream) {
      const sseEvent =
        `data: ${JSON.stringify({ type: "content_block_delta", delta: { type: "text_delta", text } })}\n\n` +
        `data: ${JSON.stringify({ type: "message_stop" })}\n\n`;
      const headers = new Headers(corsHeaders());
      headers.set("Content-Type", "text/event-stream");
      return new Response(sseEvent, { status: 200, headers });
    }

    // Oddiy (stream bo'lmagan) so'rov uchun Anthropic uslubidagi JSON qaytaramiz.
    const headers = new Headers(corsHeaders());
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ content: [{ type: "text", text }] }), { status: 200, headers });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
