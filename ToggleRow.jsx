import React, { useState } from "react";
import { Send, Mic, Square, BookOpen } from "lucide-react";
import { TopBar } from "./TopBar.jsx";
import { ErrorBanner } from "./ErrorBanner.jsx";
import { MessageBubble } from "./MessageBubble.jsx";

export function QidiruvScreen({
  onOpenMenu, messages, input, setInput, loading, onSend, scrollRef,
  errorMsg, onDismissError, recording, recordSeconds, onStartRecording, onStopRecording,
  onQuickEncyclopedia,
}) {
  const [encyTerm, setEncyTerm] = useState("");
  const [showEncy, setShowEncy] = useState(false);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title="Qidiruv" subtitle="Har qanday savolga javob beruvchi AI" onOpenMenu={onOpenMenu} />
      <ErrorBanner message={errorMsg} onDismiss={onDismissError} />

      <div ref={scrollRef} className="amora-scroll flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center mt-10 px-6">
            <div className="text-3xl mb-3">🔍</div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              Har qanday savol bering — tushuntirish, tarjima, hisob-kitob, test yechish, topshiriq yoki umuman istalgan mavzu.
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={i} m={m} index={i} hasLaterAssistant={false} onReactRequest={() => {}} reactionPickerFor={null} onReact={() => {}} onStartEdit={() => {}} onDeleteMessage={() => {}} />
        ))}
      </div>

      {showEncy && (
        <div className="px-4 pb-3 flex gap-2">
          <input value={encyTerm} onChange={(e) => setEncyTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (onQuickEncyclopedia(encyTerm), setShowEncy(false), setEncyTerm(""))}
            placeholder="Mavzuni yozing (masalan: Amir Temur)" className="flex-1 px-4 py-2 rounded-xl text-sm outline-none" style={{ background: "var(--surface)", color: "var(--text)" }} />
          <button onClick={() => { onQuickEncyclopedia(encyTerm); setShowEncy(false); setEncyTerm(""); }} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>Qidir</button>
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
        {recording ? (
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-full" style={{ background: "var(--surface)" }}>
            <span className="amora-rec-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#D65C86" }} />
            <span className="text-sm" style={{ color: "var(--text)" }}>Ovoz yozilmoqda... {recordSeconds}s</span>
          </div>
        ) : (
          <>
            <button onClick={() => setShowEncy(!showEncy)} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: showEncy ? "var(--accent)" : "var(--surface)" }}>
              <BookOpen size={18} color={showEncy ? "var(--accent-text)" : "var(--muted)"} />
            </button>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="Savolingizni yozing..."
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
