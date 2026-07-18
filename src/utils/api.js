import { API_ENDPOINT } from "../constants/config.js";

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl || "");
  if (!match) return null;
  return { mediaType: match[1], data: match[2] };
}

function messageContent(m) {
  // Rasm, video yoki hujjat bo'lsa — AI aslida ko'rishi/o'qishi (tahlil qila olishi)
  // uchun matn + media bloklaridan iborat massiv qaytaramiz.
  if ((m.type === "image" || m.type === "file" || m.type === "video") && typeof m.content === "string" && m.content.startsWith("data:")) {
    const parsed = parseDataUrl(m.content);
    if (parsed) {
      const label = m.type === "image" ? "rasm" : m.type === "video" ? "video" : `"${m.fileName || "hujjat"}" nomli fayl`;
      return [
        { type: "text", text: `Foydalanuvchi ${label} yubordi. Diqqat bilan ko'rib/o'qib chiqing, nima ekanini va mazmunini tabiiy tilda tushuntiring yoki savoliga shu asosda javob bering.` },
        { type: "media", media_type: parsed.mediaType, data: parsed.data },
      ];
    }
  }
  // Qolgan turlar uchun avvalgidek matnli tavsif.
  if (m.type === "sticker") return `[stiker: ${m.content}]`;
  if (m.type === "image") return "[foydalanuvchi rasm yubordi]";
  if (m.type === "video") return "[foydalanuvchi video yubordi]";
  if (m.type === "audiofile") return "[foydalanuvchi audio fayl yubordi]";
  if (m.type === "file") return `[foydalanuvchi fayl yubordi: ${m.fileName || ""}]`;
  if (m.type === "location") return "[foydalanuvchi joylashuvini yubordi]";
  if (m.type === "contact") return `[foydalanuvchi kontakt yubordi: ${m.name || ""}]`;
  if (m.type === "encyclopedia") return `[Vikipediyadan topilgan ma'lumot: ${m.title || ""} — ${m.extract || ""}]`;
  if (m.type === "voice") return m.transcript || "[ovozli xabar]";
  return m.content || "";
}

export function buildApiMessages(msgs) {
  return msgs.map((m) => ({ role: m.role, content: messageContent(m) }));
}

export async function fetchClaudeReply(system, apiMessages) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: apiMessages }),
  });
  const data = await response.json();
  const block = (data.content || []).find((b) => b.type === "text");
  return block ? block.text : "";
}
