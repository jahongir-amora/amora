import React, { useState, useRef, useEffect } from "react";

import { FONT_IMPORT } from "./constants/fonts.js";
import { THEMES, WEATHER_COLORS } from "./constants/themes.js";
import { PERSONA } from "./constants/persona.js";
import { QIDIRUV_SYSTEM } from "./constants/qidiruv.js";
import { SAFETY_RULE } from "./constants/safety.js";

import { buildApiMessages, fetchClaudeReply } from "./utils/api.js";
import { isEmojiOnly, pickEmojiReply } from "./utils/text.js";

import { LockScreen } from "./components/LockScreen.jsx";
import { Onboarding } from "./components/Onboarding.jsx";
import { NameScreen } from "./components/NameScreen.jsx";
import { CallScreen } from "./components/CallScreen.jsx";
import { ChatScreen } from "./components/ChatScreen.jsx";
import { QidiruvScreen } from "./components/QidiruvScreen.jsx";
import { MemoryScreen } from "./components/MemoryScreen.jsx";
import { SettingsScreen } from "./components/SettingsScreen.jsx";
import { FamilyScreen } from "./components/FamilyScreen.jsx";
import { SosScreen } from "./components/SosScreen.jsx";
import { SideMenu } from "./components/SideMenu.jsx";

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [onboardStep, setOnboardStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchMessages, setSearchMessages] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [dailyCheckin, setDailyCheckin] = useState(true);
  const [healthyUsage, setHealthyUsage] = useState(true);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [themeId, setThemeId] = useState("dark");
  const [showStickers, setShowStickers] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [aiMood, setAiMood] = useState(PERSONA.mood);
  const [reactionPickerFor, setReactionPickerFor] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [callStatus, setCallStatus] = useState("idle");
  const [callTranscript, setCallTranscript] = useState("");
  const [callReply, setCallReply] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [locked, setLocked] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [weatherTint, setWeatherTint] = useState("");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const callAudioCtxRef = useRef(null);
  const callAnalyserRef = useRef(null);
  const callRafRef = useRef(null);
  const recordTargetRef = useRef("chat");

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
  const searchScrollRef = useRef(null);
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
    if (searchScrollRef.current) searchScrollRef.current.scrollTop = searchScrollRef.current.scrollHeight;
  }, [searchMessages, searchLoading]);

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
    else setAiMood(PERSONA.mood);
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

  // Generic assistant turn runner used by both the Suhbat (chat) and Qidiruv (search) threads.
  async function runTurn(thread, userMessageObj, textForAPI, opts = {}) {
    const isChat = thread === "chat";
    const currentMessages = isChat ? messages : searchMessages;
    const setThreadMessages = isChat ? setMessages : setSearchMessages;
    const setThreadLoading = isChat ? setLoading : setSearchLoading;

    const newMessages = [...currentMessages, userMessageObj];
    const userIndex = newMessages.length - 1;
    setThreadMessages(newMessages);
    setThreadLoading(true);
    if (isChat) updateMood(textForAPI);

    if (isChat && isEmojiOnly(textForAPI) && !opts.voiceTurn) {
      setTimeout(() => {
        setThreadMessages((prev) => prev.map((m, i) => (i === userIndex ? { ...m, reaction: pickEmojiReply(textForAPI) } : m)));
        setThreadLoading(false);
      }, 350);
      return;
    }

    if (isChat) maybeAutoReact(textForAPI, userIndex);

    const memoryContext = isChat && notes.length > 0 ? `Foydalanuvchi haqida eslab qolgan narsalar: ${notes.join("; ")}.` : "";
    const system = isChat ? `${PERSONA.system}\n\n${SAFETY_RULE}\n\n${memoryContext}` : QIDIRUV_SYSTEM;
    const assistantIndex = newMessages.length;
    setThreadMessages([...newMessages, { role: "assistant", type: "text", content: "" }]);

    const setAssistantText = (text) => {
      setThreadMessages((prev) => prev.map((m, i) => (i === assistantIndex ? { ...m, content: text } : m)));
    };

    const finish = (text) => {
      opts.onReplyReady && opts.onReplyReady(text);
      if (opts.voiceTurn || (isChat && voiceReplies)) {
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
      setThreadLoading(false);
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
    runTurn("chat", { role: "user", type: "text", content: text }, text);
  }

  function sendSearchMessage() {
    const text = searchInput.trim();
    if (!text || searchLoading || recording) return;
    setSearchInput("");
    runTurn("search", { role: "user", type: "text", content: text }, text);
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
      setErrorMsg("Fayl tanlash oynasini ochib bo'lmadi.");
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
    setSearchMessages((prev) => [...prev, { role: "user", type: "text", content: `🔎 ${t}` }]);
    setSearchLoading(true);
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
        setSearchLoading(false);
        return;
      }
      setSearchMessages((prev) => [
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
      setSearchLoading(false);
    }
  }

  async function startRecording(target) {
    recordTargetRef.current = target || "chat";
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
      setErrorMsg("Mikrofonga ruxsat berilmadi.");
    }
  }

  function stopRecording() {
    clearInterval(recordTimerRef.current);
    setRecording(false);
    const rec = mediaRecorderRef.current;
    if (!rec) return;
    try { voiceRecognitionRef.current && voiceRecognitionRef.current.stop(); } catch (e) {}
    const seconds = recordSeconds;
    const thread = recordTargetRef.current;
    rec.recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onload = () => {
        const transcript = transcriptRef.current.trim() || "[Ovozli xabar, matnga aylantirib bo'lmadi]";
        const userMsg = { role: "user", type: "voice", content: reader.result, duration: seconds, transcript };
        runTurn(thread, userMsg, transcript, { voiceTurn: true });
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
    await runTurn("chat", { role: "user", type: "text", content: text }, text, {
      voiceTurn: true,
      onReplyReady: (reply) => setCallReply(reply),
      onSpeakStart: () => setCallStatus("speaking"),
      onSpeakEnd: () => { if (callActiveRef.current) runCallListen(); },
    });
  }

  function addFamilyMember({ name, phone, category }) {
    setFamilyMembers((prev) => [...prev, { name, phone, category }]);
  }

  function removeFamilyMember(i) {
    setFamilyMembers((prev) => prev.filter((_, idx) => idx !== i));
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
    setSearchMessages([]);
    setNotes([]);
    setScreen("onboarding");
    setOnboardStep(0);
  }

  function finishNameStep() {
    setMessages([{ role: "assistant", type: "text", content: `Assalomu alaykum${userName ? ", " + userName : ""}! Men ${PERSONA.name}man. Bugun kayfiyating qanday?` }]);
    setScreen("chat");
  }

  const onboardingSlides = [
    { title: "Amora — hissiy salomatlik hamrohi", body: "Har kuni kimdir seni eshitayotganini his qil. Amora doim yoningda — lekin haqiqiy odamlar o'rnini bosmaydi." },
    { title: "Sen nazorat qilasan", body: "Ma'lumotlaring faqat senga tegishli. Amora hech kimga xabar yubormaydi, hech narsani kuzatmaydi — faqat sen so'rasang harakat qiladi." },
    { title: "Ochiq va halol", body: "Amora — sun'iy intellekt ekanini hech qachon yashirmaydi. Og'ir kunlarda u seni tinglaydi va kerak bo'lsa, haqiqiy yordamga yo'naltiradi." },
  ];

  const rootVars = {
    "--bg": theme.bg, "--surface": theme.surface, "--text": theme.text,
    "--muted": theme.muted, "--accent": theme.accent, "--accent-text": theme.accentText, "--border": theme.border,
    "--weather": WEATHER_COLORS[weatherTint] || "transparent",
    fontFamily: "'Manrope', system-ui, sans-serif",
  };

  const showSideMenu = ["chat", "oila", "qidiruv", "memory", "settings", "sos"].includes(screen);

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
            radial-gradient(circle at 10% 10%, var(--weather), transparent 45%),
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
        {screen === "name" && <NameScreen userName={userName} setUserName={setUserName} onNext={finishNameStep} />}
        {screen === "call" && (
          <CallScreen character={PERSONA} callStatus={callStatus} callTranscript={callTranscript} callReply={callReply} onEnd={closeCall} voiceLevel={voiceLevel} />
        )}

        {showSideMenu && (
          <div className="flex flex-col flex-1 min-h-screen relative">
            <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} screen={screen} onNavigate={setScreen} onOpenSos={() => setScreen("sos")} />

            {screen === "chat" && (
              <ChatScreen
                persona={PERSONA} messages={messages} input={input} setInput={setInput}
                loading={loading} onSend={sendMessage} scrollRef={scrollRef}
                showStickers={showStickers} setShowStickers={setShowStickers} onSticker={sendSticker}
                showAttach={showAttach} setShowAttach={setShowAttach}
                onFilePick={openFilePicker} fileInputRef={fileInputRef} onFileChange={handleFilePick}
                onShareLocation={shareLocation}
                showContactForm={showContactForm} setShowContactForm={setShowContactForm} onShareContact={shareContact}
                errorMsg={errorMsg} onDismissError={() => setErrorMsg("")}
                aiMood={aiMood} reactionPickerFor={reactionPickerFor} setReactionPickerFor={setReactionPickerFor}
                onReact={reactToMessage}
                editingIndex={editingIndex} onStartEdit={startEditMessage} onCancelEdit={cancelEditMessage} onDeleteMessage={deleteMessage}
                recording={recording} recordSeconds={recordSeconds}
                onStartRecording={() => startRecording("chat")} onStopRecording={stopRecording}
                onOpenMenu={() => setMenuOpen(true)} onOpenCall={openCall}
              />
            )}

            {screen === "qidiruv" && (
              <QidiruvScreen
                onOpenMenu={() => setMenuOpen(true)}
                messages={searchMessages} input={searchInput} setInput={setSearchInput}
                loading={searchLoading} onSend={sendSearchMessage} scrollRef={searchScrollRef}
                errorMsg={errorMsg} onDismissError={() => setErrorMsg("")}
                recording={recording} recordSeconds={recordSeconds}
                onStartRecording={() => startRecording("search")} onStopRecording={stopRecording}
                onQuickEncyclopedia={searchEncyclopedia}
              />
            )}

            {screen === "oila" && (
              <FamilyScreen onOpenMenu={() => setMenuOpen(true)} familyMembers={familyMembers} onAdd={addFamilyMember} onRemove={removeFamilyMember} />
            )}

            {screen === "memory" && (
              <MemoryScreen onOpenMenu={() => setMenuOpen(true)} notes={notes} noteInput={noteInput} setNoteInput={setNoteInput} onAdd={addNote}
                onRemove={(i) => setNotes((prev) => prev.filter((_, idx) => idx !== i))} />
            )}

            {screen === "settings" && (
              <SettingsScreen
                onOpenMenu={() => setMenuOpen(true)}
                dailyCheckin={dailyCheckin} setDailyCheckin={setDailyCheckin}
                healthyUsage={healthyUsage} setHealthyUsage={setHealthyUsage}
                voiceReplies={voiceReplies} setVoiceReplies={setVoiceReplies}
                themeId={themeId} setThemeId={setThemeId} onReset={() => setShowResetConfirm(true)}
                pinEnabled={pinEnabled} setPinEnabled={setPinEnabled} pinCode={pinCode} setPinCode={setPinCode}
              />
            )}

            {screen === "sos" && (
              <SosScreen onOpenMenu={() => setMenuOpen(true)} familyMembers={familyMembers} userName={userName} />
            )}
          </div>
        )}
        </>
        )}
        {showResetConfirm && (
          <div className="absolute inset-0 z-40 flex items-center justify-center px-6" style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="w-full rounded-2xl p-5" style={{ background: "var(--surface)" }}>
              <div className="amora-display text-lg mb-2" style={{ color: "var(--text)" }}>Rostdan ham o'chirilsinmi?</div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
                Barcha yozishmalar va eslatmalar butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div className="flex gap-2">
                <button onClick={confirmResetAll} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: "#D65C86", color: "#fff" }}>Ha, o'chirilsin</button>
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-3 rounded-xl text-sm" style={{ background: "var(--bg)", color: "var(--muted)" }}>Bekor qilish</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
