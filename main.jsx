export function isEmojiOnly(text) {
  const t = (text || "").trim();
  if (!t || t.length > 14) return false;
  try {
    return /^[\p{Extended_Pictographic}\s\u200d\ufe0f]+$/u.test(t);
  } catch (e) {
    return false;
  }
}

export function pickEmojiReply(text) {
  if (/❤️|😍/.test(text)) return "🥰";
  if (/😂|🤣/.test(text)) return "😂";
  if (/😢|🥹/.test(text)) return "🤗";
  if (/🔥/.test(text)) return "🔥";
  if (/👍/.test(text)) return "👍";
  return "😊";
}
