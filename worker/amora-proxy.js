/**
 * Amora uchun Cloudflare Worker proksi.
 *
 * Vazifasi: brauzerdan kelgan so'rovni qabul qilib, unga maxfiy
 * ANTHROPIC_API_KEY'ni qo'shadi va api.anthropic.com'ga uzatadi.
 * Shu tufayli API kaliti hech qachon frontend kodida yoki
 * foydalanuvchi brauzerida ko'rinmaydi.
 *
 * Deploy qilish yo'riqnomasi: worker/README.md faylida.
 */

const ALLOWED_ORIGIN = "https://YOUR-GITHUB-USERNAME.github.io"; // <-- o'zgartiring
const ANTHROPIC_VERSION = "2023-06-01";

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return jsonError("Server sozlanmagan: ANTHROPIC_API_KEY o'rnatilmagan.", 500);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonError("Noto'g'ri so'rov formati.", 400);
    }

    // Oddiy himoya: xabar sonini va uzunligini cheklab, kalitning suiiste'mol
    // qilinishini qiyinlashtiramiz. Ehtiyojga qarab moslashtiring.
    if (Array.isArray(body.messages) && body.messages.length > 60) {
      return jsonError("Suhbat juda uzun.", 400);
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
    });

    // Stream bo'lsa ham, oddiy javob bo'lsa ham xuddi shu tanani qaytaramiz.
    const headers = new Headers(corsHeaders());
    headers.set("Content-Type", upstream.headers.get("Content-Type") || "application/json");
    return new Response(upstream.body, { status: upstream.status, headers });
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
