import React, { useState, useRef, useEffect } from "react";
import {
  Sun, Moon, Compass, Feather, MessageCircle, BookOpen, Settings as SettingsIcon,
  ChevronRight, Send, Plus, Trash2, ShieldCheck, Mic, Image as ImageIcon, Smile,
  Square, Paperclip, MapPin, User as UserIcon, X, Menu, Download, FileText, FileSpreadsheet, Phone, Lock,
} from "lucide-react";
import * as XLSX from "xlsx";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&display=swap');`;

const STICKERS = [
  { emoji: "🤗", label: "Quchoq" },
  { emoji: "🌞", label: "Kayfiyat" },
  { emoji: "👏", label: "Barakalla" },
  { emoji: "🍵", label: "Tin ol" },
  { emoji: "🌱", label: "Davom et" },
  { emoji: "🙏", label: "Yoningdaman" },
  { emoji: "💪", label: "Kuchli bo'l" },
  { emoji: "✨", label: "Ajoyibsan" },
];

const REACTIONS = ["❤️", "😂", "👍", "🥹", "😍", "😢", "🔥", "⭐"];

const THEMES = {
  dark: { label: "Tun", emoji: "🌙", bg: "#241A2E", surface: "#33283F", text: "#FBF3EA", muted: "#A79BB3", accent: "#E2984A", accentText: "#241A2E", border: "#4A3F57" },
  light: { label: "Kun", emoji: "☀️", bg: "#FAF6F1", surface: "#FFFFFF", text: "#2B2230", muted: "#7A6F82", accent: "#D97757", accentText: "#FFFFFF", border: "#E7DDD3" },
  ocean: { label: "Ummon", emoji: "💙", bg: "#0F2438", surface: "#16324F", text: "#EAF4FB", muted: "#8FB0C8", accent: "#3FA9DC", accentText: "#06121C", border: "#234666" },
  lavender: { label: "Lavanda", emoji: "💜", bg: "#241B36", surface: "#332747", text: "#F3EEFB", muted: "#B6A8CC", accent: "#9C7FD1", accentText: "#1A1226", border: "#463A5C" },
  nature: { label: "Tabiat", emoji: "🌿", bg: "#16241B", surface: "#1F3327", text: "#EAF3EC", muted: "#93B39B", accent: "#5FA372", accentText: "#0D1A11", border: "#2C4433" },
  sunset: { label: "Shom", emoji: "🌅", bg: "#2E1A24", surface: "#43222E", text: "#FBEEE8", muted: "#C99B9E", accent: "#E86A4E", accentText: "#2E1006", border: "#5A2E38" },
  romantic: { label: "Nafis", emoji: "❤️", bg: "#2A1620", surface: "#3E1F2E", text: "#FBE9F0", muted: "#C98FA9", accent: "#D65C86", accentText: "#2A0F18", border: "#54293C" },
  amoled: { label: "AMOLED", emoji: "⚫", bg: "#000000", surface: "#121212", text: "#F5F5F5", muted: "#8A8A8A", accent: "#E2984A", accentText: "#000000", border: "#1E1E1E" },
};

const CHARACTERS = [
  { id: "quvnoq", name: "Quvnoq", tagline: "Har kuni kayfiyatingni ko'targan do'st", icon: Sun, color: "#E2984A", mood: "😊",
    system: "Sen 'Quvnoq' ismli AI hamrohsan. Ohangdoring yengil, iliq va quvnoq. Kalta, samimiy gaplar bilan javob berasan, ortiqcha uzun ma'ruza qilmaysan." },
  { id: "xotirjam", name: "Xotirjam", tagline: "Sokin va donishmand maslahatchi", icon: Moon, color: "#7C6B99", mood: "😌",
    system: "Sen 'Xotirjam' ismli AI hamrohsan. Ohangdoring sokin, mulohazali va donishmand. Savol berib, insonning his-tuyg'ularini tinglashga e'tibor qaratasan." },
  { id: "hamroh", name: "Hamroh", tagline: "Kundalik yo'ldosh, doim yoningda", icon: Feather, color: "#C1587B", mood: "🤗",
    system: "Sen 'Hamroh' ismli AI hamrohsan. Ohangdoring mehribon va e'tiborli, lekin haddan tashqari his-hayajonli emas. Insonni kundalik hayotida qo'llab-quvvatlaysan." },
  { id: "murabbiy", name: "Murabbiy", tagline: "Har qanday savolga javob beruvchi bilimdon hamroh", icon: Compass, color: "#6F8F72", mood: "💪",
    system: "Sen 'Murabbiy' ismli AI yordamchisan. Sen nihoyatda keng bilimga egasan — fan, tarix, texnologiya, dasturlash, matematika, tibbiyot, san'at va boshqa istalgan mavzu bo'yicha aniq, chuqur va foydali javob bera olasan, xuddi umumiy maqsadli AI kabi. Foydalanuvchi har qanday savol bersa yoki har qanday vazifada yordam so'rasa (masalan kod yozish, matn tarjima qilish, hisob-kitob, tushuntirish), to'liq va aniq yordam berasan. Shu bilan birga motivatsiya va maqsad qo'yishda ham yordam berasan. Ohangdoring ishonchli, aniq va tushunarli." },
];

const SAFETY_RULE =
  "Muhim qoidalar: Sen haqiqiy odam emassan va buni hech qachon yashirmaysan yoki inkor etmaysan. Foydalanuvchining sevgan yoki yo'qotgan odamining o'rnini bosishga urinmaysan. Tibbiy, huquqiy yoki psixologik tashxis qo'ymaysin. Agar foydalanuvchi og'ir hissiy holatda yoki o'ziga zarar berish haqida gapirsa, unga xotirjamlik bilan javob ber va ishonchli odam yoki mutaxassisga murojaat qilishni maslahat ber — hech qachon o'zing 'qutqaruvchi' rolini o'ynama va uchinchi shaxsga avtomatik xabar yubormaysan (bunday imkoniyating yo'q). Sen o'zing rasm generatsiya qila olmaysan, lekin ilovada '📚 Ensiklopediya' funksiyasi bor — u orqali foydalanuvchi istalgan mavzu haqida haqiqiy rasm va ma'lumot topa oladi ('+' tugmasi ostida). Agar foydalanuvchi rasm so'rasa yoki biror narsani ko'rsatishni so'rasa va bu ensiklopedik mavzu bo'lsa, shu funksiyadan foydalanishni tavsiya qil. Javoblaring o'zbek tilida, qisqa va samimiy bo'lsin (odatda 2-5 gap).";

function buildApiMessages(msgs) {
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

async function fetchClaudeReply(system, apiMessages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: apiMessages }),
  });
  const data = await response.json();
  const block = (data.content || []).find((b) => b.type === "text");
  return block ? block.text : "";
}

function isEmojiOnly(text) {
  const t = (text || "").trim();
  if (!t || t.length > 14) return false;
  try {
    return /^[\p{Extended_Pictographic}\s\u200d\ufe0f]+$/u.test(t);
  } catch (e) {
    return false;
  }
}

function pickEmojiReply(text) {
  if (/❤️|😍/.test(text)) return "🥰";
  if (/😂|🤣/.test(text)) return "😂";
  if (/😢|🥹/.test(text)) return "🤗";
  if (/🔥/.test(text)) return "🔥";
  if (/👍/.test(text)) return "👍";
  return "😊";
}

function exportAsDoc(title, extract, pageUrl) {
  const html = `<html><head><meta charset='utf-8'></head><body><h1>${title}</h1><p>${extract}</p><p><a href="${pageUrl || ""}">${pageUrl || ""}</a></p></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAsExcel(title, extract) {
  try {
    const ws = XLSX.utils.aoa_to_sheet([["Mavzu", "Ma'lumot"], [title, extract]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Malumot");
    XLSX.writeFile(wb, `${title}.xlsx`);
  } catch (e) {}
}

function exportAsPdf(title, extract, pageUrl) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>${title}</title></head><body><h1>${title}</h1><p style="line-height:1.6">${extract}</p><p>${pageUrl || ""}</p></body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function exportImage(thumbnail, title) {
  const a = document.createElement("a");
  a.href = thumbnail;
  a.download = `${title}.jpg`;
  a.target = "_blank";
  a.click();
}

function PresenceOrb({ color = "#E2984A", size = 56, pulse = true }) {
  const ringSize = size * 1.7;
  return (
    <div style={{ width: ringSize, height: ringSize, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from 0deg, ${color}00, ${color}55, ${color}00 40%)`, animation: pulse ? "amora-spin 6s linear infinite" : "none", opacity: 0.8 }} />
      <div style={{ position: "absolute", width: size * 1.3, height: size * 1.3, borderRadius: "50%", border: `1px solid ${color}33`, animation: pulse ? "amora-ring 3.2s ease-out infinite" : "none" }} />
      <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${color}ff, ${color}77 55%, transparent 75%)`, boxShadow: `0 0 ${size * 0.7}px ${color}77, inset 0 0 ${size * 0.2}px ${color}aa`, animation: pulse ? "amora-breathe 3.2s ease-in-out infinite" : "none" }} />
    </div>
  );
}

function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="mx-4 mb-2 px-4 py-3 rounded-xl text-xs flex items-start gap-2" style={{ background: "#3D2830", color: "#F3C6D0", border: "1px solid #5A3A45" }}>
      <span className="flex-1 leading-relaxed">{message}</span>
      <button onClick={onDismiss} className="font-semibold flex-shrink-0">✕</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [onboardStep, setOnboardStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [dailyCheckin, setDailyCheckin] = useState(true);
  const [healthyUsage, setHealthyUsage] = useState(true);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [themeId, setThemeId] = useState("dark");
  const [showStickers, setShowStickers] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showEncyForm, setShowEncyForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [aiMood, setAiMood] = useState("😊");
  const [reactionPickerFor, setReactionPickerFor] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [callStatus, setCallStatus] = useState("idle");
  const [callTranscript, setCallTranscript] = useState("");
  const [callReply, setCallReply] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [sosLog, setSosLog] = useState(null);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [locked, setLocked] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [weatherTint, setWeatherTint] = useState("");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const callAudioCtxRef = useRef(null);
  const callAnalyserRef = useRef(null);
  const callRafRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
              const code = data && data.current_weather && data.current_weather.weathercode;
              if (code === undefined || code === null) return;
              if (code === 0 || code === 1) setWeatherTint("clear");
              else if (code >= 2 && code <= 3) setWeatherTint("cloudy");
              else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) setWeatherTint("rain");
              else if (code >= 71 && code <= 77) setWeatherTint("snow");
              else if (code >= 95) setWeatherTint("storm");
            })
            .catch(() => {});
        },
        () => {},
        { timeout: 5000 }
      );
    } catch (e) {}
  }, []);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const voiceRecognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const callActiveRef = useRef(false);
  const callRecognitionRef = useRef(null);

  const theme = THEMES[themeId];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (character) setAiMood(character.mood);
  }, [character]);

  function speak(text, onEnd) {
    if (!text) { if (onEnd) onEnd(); return; }
    try {
      const synth = window.speechSynthesis;
      if (!synth) { if (onEnd) onEnd(); return; }
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "uz-UZ";
      utter.rate = 1;
      if (onEnd) { utter.onend = onEnd; utter.onerror = onEnd; }
      synth.speak(utter);
    } catch (e) {
      if (onEnd) onEnd();
    }
  }

  function updateMood(text) {
    const t = (text || "").toLowerCase();
    if (/yomon|charchad|qiyin|g'amgin|xafa|stress|qattiq/.test(t)) setAiMood("🤗");
    else if (/zor|ajoyib|xursand|rahmat|yaxshi|super/.test(t)) setAiMood("🎉");
    else setAiMood(character ? character.mood : "😊");
  }

  function maybeAutoReact(text, index) {
    const t = (text || "").toLowerCase();
    const positive = ["zor", "ajoyib", "yaxshi", "rahmat", "tashakkur", "super"];
    const hit = positive.some((k) => t.includes(k)) || text.includes("!");
    if (!hit) return;
    const emoji = text.includes("!") ? "🔥" : "❤️";
    setTimeout(() => {
      setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, reaction: emoji } : m)));
    }, 700);
  }

  async function sendTurn(userMessageObj, textForAPI, opts = {}) {
    const newMessages = [...messages, userMessageObj];
    const userIndex = newMessages.length - 1;
    setMessages(newMessages);
    setLoading(true);
    updateMood(textForAPI);

    if (isEmojiOnly(textForAPI) && !opts.voiceTurn) {
      setTimeout(() => {
        setMessages((prev) => prev.map((m, i) => (i === userIndex ? { ...m, reaction: pickEmojiReply(textForAPI) } : m)));
        setLoading(false);
      }, 350);
      return;
    }

    maybeAutoReact(textForAPI, userIndex);

    const memoryContext = notes.length > 0 ? `Foydalanuvchi haqida eslab qolgan narsalar: ${notes.join("; ")}.` : "";
    const system = `${character.system}\n\n${SAFETY_RULE}\n\n${memoryContext}`;
    const assistantIndex = newMessages.length;
    setMessages([...newMessages, { role: "assistant", type: "text", content: "" }]);

    const setAssistantText = (text) => {
      setMessages((prev) => prev.map((m, i) => (i === assistantIndex ? { ...m, content: text } : m)));
    };

    const finish = (text) => {
      opts.onReplyReady && opts.onReplyReady(text);
      if (opts.voiceTurn || voiceReplies) {
        opts.onSpeakStart && opts.onSpeakStart();
        speak(text, () => { opts.onSpeakEnd && opts.onSpeakEnd(); });
      } else if (opts.onSpeakEnd) {
        opts.onSpeakEnd();
      }
    };

    let fullText = "";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, stream: true, system, messages: buildApiMessages(newMessages) }),
      });
      clearTimeout(timeoutId);
      if (!response.ok || !response.body) throw new Error("bad-response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          const line = part.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const evt = JSON.parse(jsonStr);
            if (evt.type === "content_block_delta" && evt.delta && evt.delta.type === "text_delta") {
              fullText += evt.delta.text;
              setAssistantText(fullText);
            }
          } catch (e) {}
        }
      }

      if (!fullText.trim()) {
        // Streaming produced nothing usable — fall back to a plain request so a reply is never missing.
        fullText = await fetchClaudeReply(system, buildApiMessages(newMessages));
        setAssistantText(fullText || "Kechirasan, javob topilmadi. Qayta urinib ko'ring.");
      }

      finish(fullText);
    } catch (e) {
      try {
        fullText = await fetchClaudeReply(system, buildApiMessages(newMessages));
        setAssistantText(fullText || "Kechirasan, hozir bog'lanib bo'lmadi. Birozdan so'ng qayta urinib ko'r.");
        finish(fullText);
      } catch (e2) {
        setAssistantText("Kechirasan, hozir bog'lanib bo'lmadi. Birozdan so'ng qayta urinib ko'r.");
        finish("");
      }
    } finally {
      setLoading(false);
    }
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || loading || recording) return;
    if (editingIndex !== null) {
      setMessages((prev) => prev.map((m, i) => (i === editingIndex ? { ...m, content: text, edited: true } : m)));
      setEditingIndex(null);
      setInput("");
      return;
    }
    setInput("");
    sendTurn({ role: "user", type: "text", content: text }, text);
  }

  function startEditMessage(index) {
    const m = messages[index];
    if (!m || m.role !== "user" || m.type !== "text") return;
    setEditingIndex(index);
    setInput(m.content);
    setReactionPickerFor(null);
  }

  function cancelEditMessage() {
    setEditingIndex(null);
    setInput("");
  }

  function deleteMessage(index) {
    setMessages((prev) => prev.filter((_, i) => i !== index));
    setReactionPickerFor(null);
    if (editingIndex === index) cancelEditMessage();
  }

  function sendSticker(emoji) {
    setMessages((prev) => [...prev, { role: "user", type: "sticker", content: emoji }]);
    setShowStickers(false);
  }

  function reactToMessage(index, emoji) {
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m)));
    setReactionPickerFor(null);
  }

  function handleFilePick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = () => {
        let type = "file";
        if (file.type.startsWith("image/")) type = "image";
        else if (file.type.startsWith("video/")) type = "video";
        else if (file.type.startsWith("audio/")) type = "audiofile";
        setMessages((prev) => [...prev, { role: "user", type, content: reader.result, fileName: file.name, fileSize: file.size }]);
      };
      reader.onerror = () => setErrorMsg("Faylni o'qib bo'lmadi. Boshqasini sinab ko'ring.");
      reader.readAsDataURL(file);
    } catch (e) {
      setErrorMsg("Fayl yuklashda xatolik yuz berdi.");
    }
    e.target.value = "";
    setShowAttach(false);
  }

  function openFilePicker() {
    try {
      fileInputRef.current && fileInputRef.current.click();
    } catch (e) {
      setErrorMsg("Fayl tanlash oynasini ochib bo'lmadi. Bu ehtimol shu ko'rish oynasi cheklovi — ilova alohida saytga joylashtirilganda ishlaydi.");
    }
  }

  function shareLocation() {
    if (!navigator.geolocation) {
      setErrorMsg("Bu qurilma/brauzer geolokatsiyani qo'llab-quvvatlamaydi.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMessages((prev) => [...prev, { role: "user", type: "location", lat: pos.coords.latitude, lng: pos.coords.longitude }]);
        setShowAttach(false);
      },
      () => setErrorMsg("Joylashuvga ruxsat berilmadi.")
    );
  }

  function shareContact(name, phone) {
    if (!name.trim()) return;
    setMessages((prev) => [...prev, { role: "user", type: "contact", name, phone }]);
    setShowContactForm(false);
    setShowAttach(false);
  }

  async function searchEncyclopedia(term) {
    const t = term.trim();
    if (!t) return;
    setShowEncyForm(false);
    setShowAttach(false);
    setMessages((prev) => [...prev, { role: "user", type: "text", content: `🔎 ${t}` }]);
    setLoading(true);
    const tryLang = async (lang) => {
      try {
        const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`);
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        return null;
      }
    };
    try {
      let data = await tryLang("uz");
      if (!data || data.type === "disambiguation") data = (await tryLang("en")) || data;
      if (!data) {
        setErrorMsg("Bu mavzu bo'yicha ma'lumot topilmadi. Boshqacharoq so'z bilan sinab ko'ring.");
        setLoading(false);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "encyclopedia",
          title: data.title,
          extract: (data.extract || "").slice(0, 900),
          thumbnail: data.thumbnail && data.thumbnail.source,
          pageUrl: data.content_urls && data.content_urls.desktop && data.content_urls.desktop.page,
        },
      ]);
    } catch (e) {
      setErrorMsg("Qidirishda xatolik yuz berdi. Internet aloqasini tekshiring.");
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    if (!window.isSecureContext) {
      setErrorMsg("Ovozli xabar faqat xavfsiz (https) sahifada ishlaydi.");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg("Bu ko'rish oynasi mikrofonga kirishni qo'llab-quvvatlamaydi.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      transcriptRef.current = "";
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.start();
      mediaRecorderRef.current = { recorder, stream };

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const recognition = new SR();
        recognition.lang = "uz-UZ";
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = (e) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            transcriptRef.current += e.results[i][0].transcript + " ";
          }
        };
        recognition.onerror = () => {};
        voiceRecognitionRef.current = recognition;
        try { recognition.start(); } catch (err) {}
      }

      setRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch (e) {
      setErrorMsg("Mikrofonga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering yoki ilovani alohida saytga joylashtirib qayta urinib ko'ring.");
    }
  }

  function stopRecording() {
    clearInterval(recordTimerRef.current);
    setRecording(false);
    const rec = mediaRecorderRef.current;
    if (!rec) return;
    try { voiceRecognitionRef.current && voiceRecognitionRef.current.stop(); } catch (e) {}
    const seconds = recordSeconds;
    rec.recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onload = () => {
        const transcript = transcriptRef.current.trim() || "[Ovozli xabar, matnga aylantirib bo'lmadi]";
        const userMsg = { role: "user", type: "voice", content: reader.result, duration: seconds, transcript };
        sendTurn(userMsg, transcript, { voiceTurn: true });
      };
      reader.onerror = () => setErrorMsg("Ovozli xabarni saqlab bo'lmadi.");
      reader.readAsDataURL(blob);
      rec.stream.getTracks().forEach((t) => t.stop());
    };
    try { rec.recorder.stop(); } catch (e) {}
  }

  function addNote() {
    const t = noteInput.trim();
    if (!t) return;
    setNotes((prev) => [...prev, t]);
    setNoteInput("");
  }

  function openCall() {
    setCallTranscript("");
    setCallReply("");
    callActiveRef.current = true;
    setScreen("call");
    runCallListen();
    startVoiceLevelMeter();
  }

  function startVoiceLevelMeter() {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        if (!callActiveRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        callAudioCtxRef.current = { ctx, stream };
        callAnalyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!callActiveRef.current || !callAnalyserRef.current) return;
          callAnalyserRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          setVoiceLevel(Math.min(1, avg / 90));
          callRafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }).catch(() => {});
    } catch (e) {}
  }

  function stopVoiceLevelMeter() {
    if (callRafRef.current) cancelAnimationFrame(callRafRef.current);
    callAnalyserRef.current = null;
    if (callAudioCtxRef.current) {
      try { callAudioCtxRef.current.stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
      try { callAudioCtxRef.current.ctx.close(); } catch (e) {}
      callAudioCtxRef.current = null;
    }
    setVoiceLevel(0);
  }

  function closeCall() {
    callActiveRef.current = false;
    try { callRecognitionRef.current && callRecognitionRef.current.stop(); } catch (e) {}
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    stopVoiceLevelMeter();
    setCallStatus("idle");
    setScreen("chat");
  }

  function runCallListen() {
    if (!callActiveRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !window.isSecureContext) {
      setErrorMsg("Ovozli qo'ng'iroq bu ko'rish oynasida yoki brauzerda qo'llab-quvvatlanmaydi.");
      closeCall();
      return;
    }
    try {
      const recognition = new SR();
      recognition.lang = "uz-UZ";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setCallTranscript(text);
        handleCallTurn(text);
      };
      recognition.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          setErrorMsg("Mikrofonga ruxsat berilmadi.");
          closeCall();
          return;
        }
        if (callActiveRef.current) setTimeout(() => callActiveRef.current && runCallListen(), 600);
      };
      callRecognitionRef.current = recognition;
      recognition.start();
      setCallStatus("listening");
    } catch (e) {
      if (callActiveRef.current) setTimeout(() => callActiveRef.current && runCallListen(), 600);
    }
  }

  async function handleCallTurn(text) {
    setCallStatus("thinking");
    await sendTurn({ role: "user", type: "text", content: text }, text, {
      voiceTurn: true,
      onReplyReady: (reply) => setCallReply(reply),
      onSpeakStart: () => setCallStatus("speaking"),
      onSpeakEnd: () => { if (callActiveRef.current) runCallListen(); },
    });
  }

  function addFamilyMember(name, relation) {
    if (!name.trim()) return;
    setFamilyMembers((prev) => [...prev, { name: name.trim(), relation: relation.trim() || "oila a'zosi" }]);
  }

  function removeFamilyMember(i) {
    setFamilyMembers((prev) => prev.filter((_, idx) => idx !== i));
  }

  function confirmSos() {
    const notified = familyMembers.map((f) => `${f.name} (${f.relation})`);
    setSosLog({ time: new Date().toLocaleTimeString(), notified });
    setShowSosConfirm(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        type: "text",
        content:
          familyMembers.length > 0
            ? `🆘 SOS signali qabul qilindi. ${notified.join(", ")}ga xabar yuborildi (agar ular ham Amora ilovasidan foydalansa). Bu — demo simulyatsiyasi; haqiqiy tarmoq uchun server kerak.`
            : "🆘 SOS bosildi, lekin hali oila a'zosi qo'shilmagan. Sozlamalar → Oila bo'limidan qo'shing.",
      },
    ]);
  }

  function lockNow() {
    if (pinEnabled && pinCode) setLocked(true);
  }

  function confirmResetAll() {
    setShowResetConfirm(false);
    resetAll();
  }

  function resetAll() {
    setMessages([]);
    setNotes([]);
    setCharacter(null);
    setScreen("onboarding");
    setOnboardStep(0);
  }

  function startChat(char) {
    setCharacter(char);
    setMessages([{ role: "assistant", type: "text", content: `Assalomu alaykum${userName ? ", " + userName : ""}! Men ${char.name}man. Bugun kayfiyating qanday?` }]);
    setScreen("chat");
  }

  const onboardingSlides = [
    { title: "Amora — hissiy salomatlik hamrohi", body: "Har kuni kimdir seni eshitayotganini his qil. Amora doim yoningda — lekin haqiqiy odamlar o'rnini bosmaydi." },
    { title: "Sen nazorat qilasan", body: "Ma'lumotlaring faqat senga tegishli. Amora hech kimga xabar yubormaydi, hech narsani kuzatmaydi — faqat sen so'rasang harakat qiladi." },
    { title: "Ochiq va halol", body: "Amora — sun'iy intellekt ekanini hech qachon yashirmaydi. Og'ir kunlarda u seni tinglaydi va kerak bo'lsa, haqiqiy yordamga yo'naltiradi." },
  ];

  const WEATHER_COLORS = { clear: "#F4C868", cloudy: "#8C97A6", rain: "#4A7FB5", snow: "#DCEBF5", storm: "#5A4A7A" };
  const rootVars = {
    "--bg": theme.bg, "--surface": theme.surface, "--text": theme.text,
    "--muted": theme.muted, "--accent": theme.accent, "--accent-text": theme.accentText, "--border": theme.border,
    "--weather": WEATHER_COLORS[weatherTint] || "transparent",
    fontFamily: "'Manrope', system-ui, sans-serif",
  };

  return (
    <div className="w-full min-h-screen flex justify-center amora-bg relative" style={rootVars}>
      <div className="amora-grain" />
      <style>{`
        ${FONT_IMPORT}
        @keyframes amora-breathe { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.12); opacity: 1; } }
        @keyframes amora-ring { 0% { transform: scale(0.85); opacity: 0.9; } 100% { transform: scale(1.45); opacity: 0; } }
        @keyframes amora-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes amora-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes amora-pulse-rec { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .amora-display { font-family: 'Fraunces', Georgia, serif; }
        .amora-fade { animation: amora-fade-up 0.4s ease both; }
        .amora-scroll::-webkit-scrollbar { width: 4px; }
        .amora-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .amora-bg {
          background:
            radial-gradient(circle at 50% -10%, color-mix(in srgb, var(--weather) 20%, transparent), transparent 55%),
            radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 45%),
            radial-gradient(circle at 90% 15%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 40%),
            radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 50%),
            var(--bg);
        }
        .amora-grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .amora-typing::after { content: '...'; display: inline-block; width: 1em; }
        .amora-rec-dot { animation: amora-pulse-rec 1s ease-in-out infinite; }
      `}</style>

      <div className="w-full max-w-md min-h-screen flex flex-col relative" style={{ background: "transparent", color: "var(--text)" }}>
        {pinEnabled && locked ? (
          <LockScreen pinCode={pinCode} onUnlock={() => setLocked(false)} />
        ) : (
        <>
        {screen === "onboarding" && (
          <Onboarding slides={onboardingSlides} step={onboardStep} setStep={setOnboardStep} onFinish={() => setScreen("name")} />
        )}
        {screen === "name" && <NameScreen userName={userName} setUserName={setUserName} onNext={() => setScreen("select")} />}
        {screen === "select" && <CharacterSelect characters={CHARACTERS} onSelect={startChat} onSos={() => setShowSosConfirm(true)} />}
        {screen === "call" && character && (
          <CallScreen character={character} callStatus={callStatus} callTranscript={callTranscript} callReply={callReply} onEnd={closeCall} voiceLevel={voiceLevel} />
        )}
        {(screen === "chat" || screen === "memory" || screen === "settings") && character && (
          <div className="flex flex-col flex-1 min-h-screen">
            <div className="flex-1 overflow-hidden flex flex-col">
              {screen === "chat" && (
                <ChatScreen
                  character={character} messages={messages} input={input} setInput={setInput}
                  loading={loading} onSend={sendMessage} scrollRef={scrollRef}
                  showStickers={showStickers} setShowStickers={setShowStickers} onSticker={sendSticker}
                  showAttach={showAttach} setShowAttach={setShowAttach}
                  onFilePick={openFilePicker} fileInputRef={fileInputRef} onFileChange={handleFilePick}
                  onShareLocation={shareLocation}
                  showContactForm={showContactForm} setShowContactForm={setShowContactForm} onShareContact={shareContact}
                  showEncyForm={showEncyForm} setShowEncyForm={setShowEncyForm} onSearchEncyclopedia={searchEncyclopedia}
                  voiceReplies={voiceReplies} errorMsg={errorMsg} onDismissError={() => setErrorMsg("")}
                  aiMood={aiMood} reactionPickerFor={reactionPickerFor} setReactionPickerFor={setReactionPickerFor}
                  onReact={reactToMessage}
                  editingIndex={editingIndex} onStartEdit={startEditMessage} onCancelEdit={cancelEditMessage} onDeleteMessage={deleteMessage}
                  recording={recording} recordSeconds={recordSeconds} onStartRecording={startRecording} onStopRecording={stopRecording}
                  onNavigate={setScreen} onSwitchCharacter={() => { setCharacter(null); setScreen("select"); }}
                  onOpenCall={openCall}
                  onLockNow={lockNow} pinEnabled={pinEnabled} onDeleteAll={() => setShowResetConfirm(true)}
                />
              )}
              {screen === "memory" && (
                <MemoryScreen notes={notes} noteInput={noteInput} setNoteInput={setNoteInput} onAdd={addNote}
                  onRemove={(i) => setNotes((prev) => prev.filter((_, idx) => idx !== i))} />
              )}
              {screen === "settings" && (
                <SettingsScreen
                  dailyCheckin={dailyCheckin} setDailyCheckin={setDailyCheckin}
                  healthyUsage={healthyUsage} setHealthyUsage={setHealthyUsage}
                  voiceReplies={voiceReplies} setVoiceReplies={setVoiceReplies}
                  themeId={themeId} setThemeId={setThemeId} onReset={() => setShowResetConfirm(true)}
                  pinEnabled={pinEnabled} setPinEnabled={setPinEnabled} pinCode={pinCode} setPinCode={setPinCode}
                  familyMembers={familyMembers} onAddFamily={addFamilyMember} onRemoveFamily={removeFamilyMember}
                />
              )}
            </div>
            <BottomNav screen={screen} setScreen={setScreen} />
          </div>
        )}
        </>
        )}
        {showResetConfirm && (
          <div className="absolute inset-0 z-40 flex items-center justify-center px-6" style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="w-full rounded-2xl p-5" style={{ background: "var(--surface)" }}>
              <div className="amora-display text-lg mb-2" style={{ color: "var(--text)" }}>Rostdan ham o'chirilsinmi?</div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
                Barcha yozishmalar, eslatmalar va tanlangan hamroh butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div className="flex gap-2">
                <button onClick={confirmResetAll} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: "#D65C86", color: "#fff" }}>Ha, o'chirilsin</button>
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-3 rounded-xl text-sm" style={{ background: "var(--bg)", color: "var(--muted)" }}>Bekor qilish</button>
              </div>
            </div>
          </div>
        )}
        {showSosConfirm && (
          <div className="absolute inset-0 z-40 flex items-center justify-center px-6" style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="w-full rounded-2xl p-5" style={{ background: "var(--surface)" }}>
              <div className="amora-display text-lg mb-2" style={{ color: "var(--text)" }}>Yordam so'ralsinmi?</div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
                {familyMembers.length > 0
                  ? `Quyidagi ${familyMembers.length} ta oila a'zosiga xabar yuboriladi (agar ular ham Amora'dan foydalansa): ${familyMembers.map((f) => f.name).join(", ")}.`
                  : "Hali oila a'zosi qo'shilmagan. Sozlamalar → Oila bo'limidan qo'shishingiz mumkin."}
              </p>
              <div className="flex gap-2">
                <button onClick={confirmSos} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: "#D65C86", color: "#fff" }}>Tasdiqlash</button>
                <button onClick={() => setShowSosConfirm(false)} className="px-4 py-3 rounded-xl text-sm" style={{ background: "var(--bg)", color: "var(--muted)" }}>Bekor qilish</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Onboarding({ slides, step, setStep, onFinish }) {
  const slide = slides[step];
  const isLast = step === slides.length - 1;
  const dotColors = ["#E2984A", "#C1587B", "#7C6B99"];
  return (
    <div className="flex flex-col flex-1 min-h-screen px-8 pt-16 pb-10">
      <div key={step} className="amora-fade flex-1 flex flex-col items-center justify-center text-center gap-8">
        <PresenceOrb color={dotColors[step]} size={88} />
        <div>
          <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "var(--muted)" }}>
            {String(step + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
          <h1 className="amora-display text-4xl leading-tight mb-4" style={{ color: "var(--text)" }}>{slide.title}</h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>{slide.body}</p>
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === step ? 24 : 6, height: 6, background: i === step ? "var(--accent)" : "var(--border)" }} />
        ))}
      </div>
      <button onClick={() => (isLast ? onFinish() : setStep(step + 1))} className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
        style={{ background: "var(--accent)", color: "var(--accent-text)" }}>
        {isLast ? "Boshlash" : "Davom etish"} <ChevronRight size={18} />
      </button>
    </div>
  );
}

function NameScreen({ userName, setUserName, onNext }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen px-8 pt-20 pb-10 justify-between">
      <div>
        <h2 className="amora-display text-2xl mb-3" style={{ color: "var(--text)" }}>Ismingiz nima?</h2>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Amora seni shu ism bilan chaqiradi.</p>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Ismingizni kiriting"
          className="w-full px-5 py-4 rounded-2xl text-base outline-none" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} />
      </div>
      <button onClick={onNext} disabled={!userName.trim()} className="w-full py-4 rounded-2xl font-semibold text-base disabled:opacity-40"
        style={{ background: "var(--accent)", color: "var(--accent-text)" }}>Davom etish</button>
    </div>
  );
}

function CharacterSelect({ characters, onSelect, onSos }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen px-6 pt-16 pb-10">
      <h2 className="amora-display text-3xl mb-2 px-2" style={{ color: "var(--text)" }}>Hamrohingizni tanlang</h2>
      <p className="text-sm mb-6 px-2" style={{ color: "var(--muted)" }}>Keyinroq xohlagan vaqt almashtirishingiz mumkin.</p>
      <div className="flex flex-col gap-3">
        {characters.map((c, idx) => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => onSelect(c)} className="amora-fade flex items-center gap-4 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
              style={{ background: "var(--surface)", border: `1px solid ${c.color}22`, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", animationDelay: `${idx * 60}ms` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}22`, boxShadow: `0 0 20px ${c.color}33` }}>
                <Icon size={22} color={c.color} />
              </div>
              <div className="flex-1">
                <div className="amora-display text-lg" style={{ color: "var(--text)" }}>{c.name}</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{c.tagline}</div>
              </div>
              <ChevronRight size={18} color="var(--muted)" />
            </button>
          );
        })}
        <button onClick={onSos} className="amora-fade flex items-center gap-4 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
          style={{ background: "var(--surface)", border: "1px solid #D65C8655", boxShadow: "0 6px 20px rgba(0,0,0,0.25)", animationDelay: `${characters.length * 60}ms` }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#D65C8622", boxShadow: "0 0 20px #D65C8633" }}>
            <span className="text-lg">🆘</span>
          </div>
          <div className="flex-1">
            <div className="amora-display text-lg" style={{ color: "#D65C86" }}>SOS</div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>Yordam kerak bo'lsa, shu yerdan bosing</div>
          </div>
          <ChevronRight size={18} color="var(--muted)" />
        </button>
      </div>
    </div>
  );
}

function ReactionPicker({ onPick, canEdit, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 rounded-full mb-1 flex-wrap" style={{ background: "var(--surface)", border: "1px solid var(--border)", maxWidth: 260 }}>
      {REACTIONS.map((r) => (
        <button key={r} onClick={() => onPick(r)} className="text-lg px-1 hover:scale-125 transition-transform">{r}</button>
      ))}
      <span style={{ width: 1, height: 18, background: "var(--border)" }} />
      {canEdit && (
        <button onClick={onEdit} className="text-xs px-2 py-1" style={{ color: "var(--accent)" }}>✏️ Tahrirlash</button>
      )}
      <button onClick={onDelete} className="text-xs px-2 py-1" style={{ color: "#E38A9C" }}>🗑️ O'chirish</button>
    </div>
  );
}

function MessageBubble({ m, index, character, isLast, hasLaterAssistant, onReactRequest, reactionPickerFor, onReact, onStartEdit, onDeleteMessage }) {
  const isUser = m.role === "user";
  const showPicker = reactionPickerFor === index;
  const canEdit = isUser && m.type === "text";

  const wrapperStyle = { alignSelf: isUser ? "flex-end" : "flex-start", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", maxWidth: "82%", position: "relative" };

  let bodyNode = null;
  if (m.type === "sticker") {
    bodyNode = <div className="text-4xl">{m.content}</div>;
  } else if (m.type === "image") {
    bodyNode = <img src={m.content} alt="rasm" className="max-w-full rounded-2xl" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }} />;
  } else if (m.type === "video") {
    bodyNode = <video src={m.content} controls className="max-w-full rounded-2xl" style={{ maxHeight: 240 }} />;
  } else if (m.type === "audiofile") {
    bodyNode = (
      <div className="px-3 py-2 rounded-2xl" style={{ background: "var(--surface)" }}>
        <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{m.fileName}</div>
        <audio src={m.content} controls style={{ width: 220 }} />
      </div>
    );
  } else if (m.type === "voice") {
    bodyNode = (
      <div className="px-4 py-3 rounded-2xl flex items-center gap-3" style={{ background: isUser ? "var(--accent)" : "var(--surface)" }}>
        <Mic size={16} color={isUser ? "var(--accent-text)" : "var(--text)"} />
        <audio src={m.content} controls style={{ width: 180 }} />
        <span className="text-xs" style={{ color: isUser ? "var(--accent-text)" : "var(--muted)" }}>{m.duration || 0}s</span>
      </div>
    );
  } else if (m.type === "file") {
    bodyNode = (
      <div className="px-4 py-3 rounded-2xl flex items-center gap-3" style={{ background: "var(--surface)" }}>
        <Paperclip size={18} color="var(--muted)" />
        <div className="text-sm" style={{ color: "var(--text)" }}>
          <div>{m.fileName}</div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>{Math.round((m.fileSize || 0) / 1024)} KB</div>
        </div>
      </div>
    );
  } else if (m.type === "location") {
    bodyNode = (
      <a href={`https://maps.google.com/?q=${m.lat},${m.lng}`} target="_blank" rel="noreferrer"
        className="px-4 py-3 rounded-2xl flex items-center gap-2 no-underline" style={{ background: "var(--surface)" }}>
        <MapPin size={18} color="var(--accent)" />
        <span className="text-sm" style={{ color: "var(--text)" }}>Joylashuv ulashildi</span>
      </a>
    );
  } else if (m.type === "contact") {
    bodyNode = (
      <div className="px-4 py-3 rounded-2xl flex items-center gap-3" style={{ background: "var(--surface)" }}>
        <UserIcon size={18} color="var(--accent)" />
        <div className="text-sm" style={{ color: "var(--text)" }}>
          <div>{m.name}</div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>{m.phone}</div>
        </div>
      </div>
    );
  } else if (m.type === "encyclopedia") {
    bodyNode = (
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", maxWidth: 280 }}>
        {m.thumbnail && <img src={m.thumbnail} alt={m.title} className="w-full" style={{ maxHeight: 160, objectFit: "cover" }} />}
        <div className="px-4 py-3">
          <div className="amora-display text-base mb-1" style={{ color: "var(--text)" }}>{m.title}</div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>{m.extract}</p>
          {m.pageUrl && (
            <a href={m.pageUrl} target="_blank" rel="noreferrer" className="text-xs font-medium block mb-2" style={{ color: "var(--accent)" }}>
              To'liq maqolani Vikipediyada o'qish →
            </a>
          )}
          <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>Yuklab olish:</span>
            <button onClick={() => exportAsPdf(m.title, m.extract, m.pageUrl)} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{ background: "var(--bg)", color: "var(--text)" }}>PDF</button>
            <button onClick={() => exportAsDoc(m.title, m.extract, m.pageUrl)} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{ background: "var(--bg)", color: "var(--text)" }}>DOC</button>
            <button onClick={() => exportAsExcel(m.title, m.extract)} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{ background: "var(--bg)", color: "var(--text)" }}>Excel</button>
            {m.thumbnail && (
              <button onClick={() => exportImage(m.thumbnail, m.title)} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{ background: "var(--bg)", color: "var(--text)" }}>JPG</button>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    bodyNode = (
      <div
        className="px-4 py-3 text-sm leading-relaxed"
        style={{
          background: isUser ? "var(--accent)" : "var(--surface)",
          color: isUser ? "var(--accent-text)" : "var(--text)",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          boxShadow: isUser ? "0 6px 18px rgba(0,0,0,0.2)" : "0 4px 14px rgba(0,0,0,0.25)",
          minHeight: m.content === "" ? 20 : undefined,
        }}
      >
        {m.content === "" ? <span className="amora-typing" style={{ color: "var(--muted)" }} /> : m.content}
      </div>
    );
  }

  return (
    <div className="amora-fade" style={wrapperStyle}>
      {showPicker && (
        <ReactionPicker
          onPick={(e) => onReact(index, e)}
          canEdit={canEdit}
          onEdit={() => onStartEdit(index)}
          onDelete={() => onDeleteMessage(index)}
        />
      )}
      <div onClick={() => onReactRequest(showPicker ? null : index)} style={{ cursor: "pointer", position: "relative" }}>
        {bodyNode}
        {m.reaction && (
          <div className="absolute -bottom-2 flex items-center justify-center text-xs rounded-full"
            style={{ [isUser ? "left" : "right"]: -6, width: 20, height: 20, background: "var(--surface)", border: "1px solid var(--border)" }}>
            {m.reaction}
          </div>
        )}
      </div>
      {isUser && m.type !== "sticker" && (
        <span className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
          {m.edited ? "tahrirlangan · " : ""}{hasLaterAssistant ? "✓✓ ko'rildi" : "✓ yuborildi"}
        </span>
      )}
    </div>
  );
}

function MenuRow({ it, setShowMenu }) {
  const Icon = it.icon;
  return (
    <button
      onClick={() => { it.action && it.action(); setShowMenu(false); }}
      className="w-full flex items-center gap-3 text-left py-3 text-sm"
      style={{ color: it.danger ? "#E38A9C" : "var(--text)", borderBottom: "1px solid var(--border)" }}
    >
      <Icon size={16} color={it.danger ? "#E38A9C" : "var(--muted)"} />
      {it.label}
    </button>
  );
}

function ChatScreen({
  character, messages, input, setInput, loading, onSend, scrollRef,
  showStickers, setShowStickers, onSticker,
  showAttach, setShowAttach, onFilePick, fileInputRef, onFileChange, onShareLocation,
  showContactForm, setShowContactForm, onShareContact,
  showEncyForm, setShowEncyForm, onSearchEncyclopedia,
  voiceReplies, errorMsg, onDismissError, aiMood,
  reactionPickerFor, setReactionPickerFor, onReact,
  editingIndex, onStartEdit, onCancelEdit, onDeleteMessage,
  recording, recordSeconds, onStartRecording, onStopRecording,
  onNavigate, onSwitchCharacter, onOpenCall,
  onLockNow, pinEnabled, onDeleteAll,
}) {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [encyTerm, setEncyTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const lastAssistantIdx = messages.reduce((acc, m, i) => (m.role === "assistant" ? i : acc), -1);

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => setShowMenu(true)} className="w-8 h-8 flex items-center justify-center flex-shrink-0 -ml-1">
          <Menu size={20} color="var(--muted)" />
        </button>
        <PresenceOrb color={character.color} size={34} pulse={loading || recording} />
        <div className="flex-1">
          <div className="amora-display text-lg flex items-center gap-2" style={{ color: "var(--text)" }}>
            {character.name} <span className="text-sm">{aiMood}</span>
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {recording ? "🎤 Ovoz yozilmoqda..." : loading ? `${character.name} yozmoqda` : `AI hamroh · haqiqiy odam emas${voiceReplies ? " · ovoz yoqilgan" : ""}`}
          </div>
        </div>
        <button onClick={onOpenCall} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface)" }}>
          <Phone size={16} color="var(--accent)" />
        </button>
      </div>

      {showMenu && (
        <div className="absolute inset-0 z-20 flex" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setShowMenu(false)}>
          <div className="w-72 h-full amora-fade flex flex-col p-5 overflow-y-auto amora-scroll" style={{ background: "var(--surface)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <span className="amora-display text-xl" style={{ color: "var(--text)" }}>Amora</span>
              <button onClick={() => setShowMenu(false)}><X size={20} color="var(--muted)" /></button>
            </div>

            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>Navigatsiya</div>
            {[
              { label: "Suhbat", icon: MessageCircle, action: () => onNavigate("chat") },
              { label: "Xotira", icon: BookOpen, action: () => onNavigate("memory") },
              { label: "Sozlamalar", icon: SettingsIcon, action: () => onNavigate("settings") },
              { label: "Ovozli qo'ng'iroq", icon: Phone, action: onOpenCall },
            ].map((it) => (
              <MenuRow key={it.label} it={it} setShowMenu={setShowMenu} />
            ))}

            <div className="text-[10px] uppercase tracking-wider mt-5 mb-2" style={{ color: "var(--muted)" }}>Hamroh</div>
            <MenuRow it={{ label: "Hamrohni almashtirish", icon: UserIcon, action: onSwitchCharacter }} setShowMenu={setShowMenu} />

            <div className="text-[10px] uppercase tracking-wider mt-5 mb-2" style={{ color: "var(--muted)" }}>Xavfsizlik</div>
            {pinEnabled && <MenuRow it={{ label: "Ilovani hozir qulflash", icon: Lock, action: onLockNow }} setShowMenu={setShowMenu} />}
            <MenuRow it={{ label: "Barcha yozishmalarni o'chirish", icon: Trash2, action: onDeleteAll, danger: true }} setShowMenu={setShowMenu} />
          </div>
        </div>
      )}

      <ErrorBanner message={errorMsg} onDismiss={onDismissError} />

      <div ref={scrollRef} className="amora-scroll flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} m={m} index={i} character={character} hasLaterAssistant={i < lastAssistantIdx || (m.role === "user" && i < messages.length - 1)}
            onReactRequest={setReactionPickerFor} reactionPickerFor={reactionPickerFor} onReact={onReact}
            onStartEdit={onStartEdit} onDeleteMessage={onDeleteMessage} />
        ))}
      </div>

      {showContactForm && (
        <div className="px-4 pb-3 flex flex-col gap-2">
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Ism" className="px-4 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--surface)", color: "var(--text)" }} />
          <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Telefon raqami" className="px-4 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--surface)", color: "var(--text)" }} />
          <div className="flex gap-2">
            <button onClick={() => { onShareContact(contactName, contactPhone); setContactName(""); setContactPhone(""); }} className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>Yubor</button>
            <button onClick={() => setShowContactForm(false)} className="px-4 py-2 rounded-xl text-sm" style={{ background: "var(--surface)", color: "var(--muted)" }}>Bekor qilish</button>
          </div>
        </div>
      )}

      {showEncyForm && (
        <div className="px-4 pb-3 flex gap-2">
          <input value={encyTerm} onChange={(e) => setEncyTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearchEncyclopedia(encyTerm)}
            placeholder="Mavzuni yozing (masalan: Amir Temur)" className="flex-1 px-4 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--surface)", color: "var(--text)" }} />
          <button onClick={() => onSearchEncyclopedia(encyTerm)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>Qidir</button>
        </div>
      )}

      {showAttach && !showContactForm && !showEncyForm && (
        <div className="px-4 pb-3 grid grid-cols-4 gap-2">
          <button onClick={onFilePick} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <Paperclip size={18} color="var(--muted)" /><span className="text-[10px]" style={{ color: "var(--muted)" }}>Fayl</span>
          </button>
          <button onClick={onShareLocation} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <MapPin size={18} color="var(--muted)" /><span className="text-[10px]" style={{ color: "var(--muted)" }}>Joylashuv</span>
          </button>
          <button onClick={() => setShowContactForm(true)} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <UserIcon size={18} color="var(--muted)" /><span className="text-[10px]" style={{ color: "var(--muted)" }}>Kontakt</span>
          </button>
          <button onClick={() => setShowEncyForm(true)} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <span className="text-lg leading-none">📚</span><span className="text-[10px]" style={{ color: "var(--muted)" }}>Ensiklopediya</span>
          </button>
        </div>
      )}

      {showStickers && (
        <div className="px-4 pb-2 grid grid-cols-4 gap-2">
          {STICKERS.map((s) => (
            <button key={s.emoji} onClick={() => onSticker(s.emoji)} className="flex flex-col items-center gap-1 py-2 rounded-xl" style={{ background: "var(--surface)" }}>
              <span className="text-2xl">{s.emoji}</span><span className="text-[10px]" style={{ color: "var(--muted)" }}>{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {editingIndex !== null && (
        <div className="mx-4 mb-2 px-4 py-2 rounded-xl flex items-center justify-between" style={{ background: "var(--surface)", border: "1px solid var(--accent)" }}>
          <span className="text-xs" style={{ color: "var(--accent)" }}>✏️ Xabar tahrirlanmoqda</span>
          <button onClick={onCancelEdit}><X size={16} color="var(--muted)" /></button>
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
        <input type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" ref={fileInputRef} onChange={onFileChange} className="hidden" />
        {recording ? (
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-full" style={{ background: "var(--surface)" }}>
            <span className="amora-rec-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#D65C86" }} />
            <span className="text-sm" style={{ color: "var(--text)" }}>Ovoz yozilmoqda... {recordSeconds}s</span>
          </div>
        ) : (
          <>
            <button onClick={() => { setShowAttach(!showAttach); setShowStickers(false); }} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: showAttach ? character.color : "var(--surface)" }}>
              <Plus size={18} color={showAttach ? "#241A2E" : "var(--muted)"} />
            </button>
            <button onClick={() => { setShowStickers(!showStickers); setShowAttach(false); }} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: showStickers ? character.color : "var(--surface)" }}>
              <Smile size={18} color={showStickers ? "#241A2E" : "var(--muted)"} />
            </button>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="Xabar yozing..."
              className="flex-1 px-4 py-3 rounded-full text-sm outline-none min-w-0" style={{ background: "var(--surface)", color: "var(--text)" }} />
          </>
        )}
        <button onClick={recording ? onStopRecording : (input.trim() ? onSend : onStartRecording)} disabled={loading && !recording}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
          style={{ background: recording ? "#D65C86" : "var(--accent)", boxShadow: "0 6px 16px rgba(0,0,0,0.25)" }}>
          {recording ? <Square size={16} color="#fff" /> : input.trim() ? <Send size={18} color="var(--accent-text)" /> : <Mic size={18} color="var(--accent-text)" />}
        </button>
      </div>
    </div>
  );
}

function MemoryScreen({ notes, noteInput, setNoteInput, onAdd, onRemove }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pt-14 pb-4">
      <h2 className="amora-display text-2xl mb-2" style={{ color: "var(--text)" }}>Xotira</h2>
      <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>Amora shu narsalarni eslab, suhbatda hisobga oladi. Xohlagan yozuvni o'chirishingiz mumkin.</p>
      <div className="flex gap-2 mb-5">
        <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAdd()} placeholder="Masalan: har kuni 22:00 da uxlayman"
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--surface)", color: "var(--text)" }} />
        <button onClick={onAdd} className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)" }}>
          <Plus size={20} color="var(--accent-text)" />
        </button>
      </div>
      <div className="amora-scroll flex-1 overflow-y-auto flex flex-col gap-2">
        {notes.length === 0 && <div className="text-sm text-center mt-10" style={{ color: "var(--muted)" }}>Hali hech narsa saqlanmagan.</div>}
        {notes.map((n, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl text-sm" style={{ background: "var(--surface)", color: "var(--text)" }}>
            <span>{n}</span>
            <button onClick={() => onRemove(i)}><Trash2 size={16} color="var(--muted)" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ dailyCheckin, setDailyCheckin, healthyUsage, setHealthyUsage, voiceReplies, setVoiceReplies, themeId, setThemeId, onReset, familyMembers, onAddFamily, onRemoveFamily, pinEnabled, setPinEnabled, pinCode, setPinCode }) {
  const [famName, setFamName] = useState("");
  const [famRelation, setFamRelation] = useState("");
  const [pinInput, setPinInput] = useState("");

  function handlePinToggle(next) {
    if (next && !pinCode) {
      // will show inline setup below; don't enable until a 4-digit code is set
      setPinEnabled(true);
    } else {
      setPinEnabled(next);
    }
  }

  function savePin() {
    if (pinInput.length === 4) {
      setPinCode(pinInput);
      setPinInput("");
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pt-14 pb-4 overflow-y-auto amora-scroll">
      <h2 className="amora-display text-2xl mb-6" style={{ color: "var(--text)" }}>Sozlamalar</h2>

      <div className="mb-6">
        <div className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>Mavzu</div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(THEMES).map(([id, t]) => (
            <button key={id} onClick={() => setThemeId(id)} className="flex flex-col items-center gap-1 py-3 rounded-xl"
              style={{ background: t.surface, border: themeId === id ? `2px solid ${t.accent}` : "1px solid transparent" }}>
              <span className="text-xl">{t.emoji}</span>
              <span className="text-[10px]" style={{ color: t.muted }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <ToggleRow label="Kunlik salomlashuv" desc="Amora kuniga bir marta hol-ahvol so'raydi" value={dailyCheckin} onChange={setDailyCheckin} />
      <ToggleRow label="Sog'lom foydalanish eslatmasi" desc="Uzoq vaqt gaplashsangiz, yumshoq eslatma beradi" value={healthyUsage} onChange={setHealthyUsage} />
      <ToggleRow label="Har doim ovozli javob" desc="Yozma xabarlarga ham ovoz bilan javob beradi" value={voiceReplies} onChange={setVoiceReplies} />
      <ToggleRow label="🔒 Maxfiy rejim" desc="Ilovani ochish uchun 4 xonali kod so'raladi" value={pinEnabled} onChange={handlePinToggle} />

      {pinEnabled && (
        <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--surface)" }}>
          {pinCode ? (
            <div className="text-xs" style={{ color: "var(--muted)" }}>Kod o'rnatilgan. Ilova qulflanganda shu 4 xonali kodni so'raydi.</div>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="4 xonali kod o'rnating"
                inputMode="numeric"
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none tracking-widest"
                style={{ background: "var(--bg)", color: "var(--text)" }}
              />
              <button onClick={savePin} disabled={pinInput.length !== 4} className="px-3 py-2 rounded-xl text-sm font-medium disabled:opacity-40" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>
                Saqlash
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <div className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>🆘 Oila (SOS uchun)</div>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          SOS tugmasi bosilganda shu ro'yxatdagilar "xabardor qilindi" deb ko'rsatiladi. Eslatma: bu hozircha demo — ularning haqiqiy telefoniga xabar borishi uchun alohida server va ular ham shu ilovada ro'yxatdan o'tgan bo'lishi kerak.
        </p>
        <div className="flex gap-2 mb-3">
          <input value={famName} onChange={(e) => setFamName(e.target.value)} placeholder="Ism" className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--surface)", color: "var(--text)" }} />
          <input value={famRelation} onChange={(e) => setFamRelation(e.target.value)} placeholder="Qarindoshlik" className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--surface)", color: "var(--text)" }} />
          <button onClick={() => { onAddFamily(famName, famRelation); setFamName(""); setFamRelation(""); }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)" }}>
            <Plus size={18} color="var(--accent-text)" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {familyMembers.map((f, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl text-sm" style={{ background: "var(--surface)", color: "var(--text)" }}>
              <span>{f.name} <span style={{ color: "var(--muted)" }}>· {f.relation}</span></span>
              <button onClick={() => onRemoveFamily(i)}><Trash2 size={14} color="var(--muted)" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-2xl flex gap-3" style={{ background: "#2E3A2F", border: "1px solid #4A5F4C" }}>
        <ShieldCheck size={20} color="#8FB892" className="flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed" style={{ color: "#C6D9C7" }}>
          Amora sun'iy intellekt bo'lib, professional psixologik yordam yoki haqiqiy insoniy munosabatlar o'rnini bosolmaydi. Og'ir hissiy holatda bo'lsangiz, iltimos, yaqiningiz yoki mutaxassis bilan bog'laning. SOS faqat siz tugmani bosganingizda ishlaydi — hech qachon avtomatik ishlamaydi.
        </p>
      </div>

      <button onClick={onReset} className="mt-8 w-full py-4 rounded-2xl font-medium text-sm" style={{ background: "#3D2830", color: "#E38A9C" }}>
        Barcha ma'lumotlarni tozalash
      </button>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="pr-4">
        <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} className="w-11 h-6 rounded-full flex-shrink-0 relative transition-colors" style={{ background: value ? "var(--accent)" : "var(--border)" }}>
        <div className="w-5 h-5 rounded-full absolute top-0.5 transition-all" style={{ background: "#FFFFFF", left: value ? 22 : 2 }} />
      </button>
    </div>
  );
}

function LockScreen({ pinCode, onUnlock }) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);

  function press(d) {
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);
    setError(false);
    if (next.length === 4) {
      if (next === pinCode) {
        setTimeout(onUnlock, 150);
      } else {
        setError(true);
        setTimeout(() => setEntered(""), 500);
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center justify-center px-8 gap-8">
      <PresenceOrb color="#E2984A" size={80} />
      <div className="text-center">
        <div className="amora-display text-xl mb-1" style={{ color: "var(--text)" }}>Amora qulflangan</div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>{error ? "Noto'g'ri kod" : "Kodni kiriting"}</div>
      </div>
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-3 h-3 rounded-full" style={{ background: i < entered.length ? "var(--accent)" : "var(--border)" }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d, i) =>
          d === "" ? <div key={i} /> : (
            <button key={i} onClick={() => (d === "⌫" ? setEntered((s) => s.slice(0, -1)) : press(d))}
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg" style={{ background: "var(--surface)", color: "var(--text)" }}>
              {d}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function CallScreen({ character, callStatus, callTranscript, callReply, onEnd, voiceLevel }) {
  const statusLabel = {
    listening: "Tinglamoqda...",
    thinking: "O'ylamoqda...",
    speaking: `${character.name} gapirmoqda...`,
    idle: "Ulanmoqda...",
  }[callStatus] || "Ulanmoqda...";
  const boost = callStatus === "listening" ? 1 + voiceLevel * 0.35 : 1;
  return (
    <div className="flex flex-col flex-1 min-h-screen px-8 py-16 items-center justify-between amora-fade" style={{ color: "var(--text)" }}>
      <div className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>Ovozli qo'ng'iroq</div>
      <div className="flex flex-col items-center gap-6">
        <div style={{ transform: `scale(${boost})`, transition: "transform 80ms linear" }}>
          <PresenceOrb color={character.color} size={120} pulse={true} />
        </div>
        <div className="amora-display text-2xl">{character.name}</div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>{statusLabel}</div>
        <div className="text-center px-4 min-h-[60px]">
          {callTranscript && <div className="text-sm mb-2" style={{ color: "var(--text)" }}>"{callTranscript}"</div>}
          {callReply && <div className="text-xs" style={{ color: "var(--muted)" }}>{callReply}</div>}
        </div>
      </div>
      <button onClick={onEnd} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#D65C86", boxShadow: "0 10px 28px rgba(214,92,134,0.4)" }}>
        <Square size={22} color="#fff" />
      </button>
      <div className="text-xs" style={{ color: "var(--muted)" }}>Tugatish uchun bosing</div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "chat", label: "Suhbat", icon: MessageCircle },
    { id: "memory", label: "Xotira", icon: BookOpen },
    { id: "settings", label: "Sozlama", icon: SettingsIcon },
  ];
  return (
    <div className="flex items-center justify-around py-2 flex-shrink-0" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      {items.map((it) => {
        const Icon = it.icon;
        const active = screen === it.id;
        return (
          <button key={it.id} onClick={() => setScreen(it.id)} className="flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-colors" style={{ background: active ? "var(--bg)" : "transparent" }}>
            <Icon size={20} color={active ? "var(--accent)" : "var(--muted)"} />
            <span className="text-[10px]" style={{ color: active ? "var(--accent)" : "var(--muted)" }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
