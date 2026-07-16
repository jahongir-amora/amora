import React, { useState } from "react";
import {
  User as UserIcon, X, Plus, Smile, Square, Send, Mic, Paperclip, MapPin,
} from "lucide-react";
import { TopBar } from "./TopBar.jsx";
import { ErrorBanner } from "./ErrorBanner.jsx";
import { MessageBubble } from "./MessageBubble.jsx";
import { STICKERS } from "../constants/stickers.js";

export function ChatScreen({
  persona, messages, input, setInput, loading, onSend, scrollRef,
  showStickers, setShowStickers, onSticker,
  showAttach, setShowAttach, onFilePick, fileInputRef, onFileChange, onShareLocation,
  showContactForm, setShowContactForm, onShareContact,
  errorMsg, onDismissError, aiMood,
  reactionPickerFor, setReactionPickerFor, onReact,
  editingIndex, onStartEdit, onCancelEdit, onDeleteMessage,
  recording, recordSeconds, onStartRecording, onStopRecording,
  onOpenMenu, onOpenCall,
}) {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const lastAssistantIdx = messages.reduce((acc, m, i) => (m.role === "assistant" ? i : acc), -1);

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <TopBar
        title={`${persona.name} ${aiMood}`}
        subtitle={recording ? "🎤 Ovoz yozilmoqda..." : loading ? "yozmoqda..." : "AI hamroh · haqiqiy odam emas"}
        onOpenMenu={onOpenMenu}
        showOrb orbColor={persona.color} orbPulse={loading || recording}
        rightSlot={
          <button onClick={onOpenCall} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface)" }}>
            📞
          </button>
        }
      />

      <ErrorBanner message={errorMsg} onDismiss={onDismissError} />

      <div ref={scrollRef} className="amora-scroll flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} m={m} index={i} character={persona} hasLaterAssistant={i < lastAssistantIdx || (m.role === "user" && i < messages.length - 1)}
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

      {showAttach && !showContactForm && (
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          <button onClick={onFilePick} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <Paperclip size={18} color="var(--muted)" /><span className="text-[10px]" style={{ color: "var(--muted)" }}>Fayl</span>
          </button>
          <button onClick={onShareLocation} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <MapPin size={18} color="var(--muted)" /><span className="text-[10px]" style={{ color: "var(--muted)" }}>Joylashuv</span>
          </button>
          <button onClick={() => setShowContactForm(true)} className="flex flex-col items-center gap-1 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
            <UserIcon size={18} color="var(--muted)" /><span className="text-[10px]" style={{ color: "var(--muted)" }}>Kontakt</span>
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
            <button onClick={() => { setShowAttach(!showAttach); setShowStickers(false); }} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: showAttach ? persona.color : "var(--surface)" }}>
              <Plus size={18} color={showAttach ? "#241A2E" : "var(--muted)"} />
            </button>
            <button onClick={() => { setShowStickers(!showStickers); setShowAttach(false); }} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: showStickers ? persona.color : "var(--surface)" }}>
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
