import React, { useState } from "react";
import {
  Menu, MessageCircle, BookOpen, Settings as SettingsIcon, Phone, User as UserIcon, Lock, Trash2,
  X, Plus, Smile, Square, Send, Mic, Paperclip, MapPin,
} from "lucide-react";
import { PresenceOrb } from "./PresenceOrb.jsx";
import { ErrorBanner } from "./ErrorBanner.jsx";
import { MessageBubble } from "./MessageBubble.jsx";
import { MenuRow } from "./MenuRow.jsx";
import { STICKERS } from "../constants/stickers.js";

export function ChatScreen({
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
