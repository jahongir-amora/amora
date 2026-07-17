export function buildApiMessages(msgs) {
  return msgs.map((m) => ({
    role: m.role,
    content:
      m.type === "sticker" ? `[stiker: ${m.content}]`
      : m.type === "image" ? "[foydalanuvchi rasm yubordi]"
      : m.type === "video" ? "[foydalanuvchi video yubordi]"
      : m.type === "audiofile" ? "[foydalanuvchi audio fayl yubordi]"
      : m.type === "file" ? `[foydalanuvchi fayl yubordi: ${m.fileName || ""}]`
      : m.type === "location" ? "[foydalanuvchi joylashuvini yubordi]"
      : m.type === "contact" ? `[foydalanuvchi kontakt yubordi: ${m.name || ""}]`
      : m.type === "encyclopedia" ? `[Vikipediyadan topilgan ma'lumot: ${m.title || ""} — ${m.extract || ""}]`
      : m.type === "voice" ? (m.transcript || "[ovozli xabar]")
      : (m.content || ""),
  }));
}

export async function fetchClaudeReply(system, apiMessages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: apiMessages }),
  });
  const data = await response.json();
  const block = (data.content || []).find((b) => b.type === "text");
  return block ? block.text : "";
}
