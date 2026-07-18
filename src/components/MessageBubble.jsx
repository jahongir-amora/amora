import React from "react";
import { Mic, Paperclip, MapPin, User as UserIcon, Share2 } from "lucide-react";
import { ReactionPicker } from "./ReactionPicker.jsx";
import { exportAsDoc, exportAsExcel, exportAsPdf, exportImage, shareDataUrl } from "../utils/export.js";

export function MessageBubble({ m, index, character, isLast, hasLaterAssistant, onReactRequest, reactionPickerFor, onReact, onStartEdit, onDeleteMessage }) {
  const isUser = m.role === "user";
  const showPicker = reactionPickerFor === index;
  const canEdit = isUser && m.type === "text";

  const wrapperStyle = { alignSelf: isUser ? "flex-end" : "flex-start", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", maxWidth: "82%", position: "relative" };

  let bodyNode = null;
  if (m.type === "sticker") {
    bodyNode = <div className="text-4xl">{m.content}</div>;
  } else if (m.type === "image") {
    bodyNode = (
      <div style={{ position: "relative" }}>
        <img src={m.content} alt="rasm" className="max-w-full rounded-2xl" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }} />
        <button onClick={(e) => { e.stopPropagation(); shareDataUrl(m.content, m.fileName || "rasm.jpg", "Amora"); }}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
          <Share2 size={14} color="#fff" />
        </button>
      </div>
    );
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
        <button onClick={(e) => { e.stopPropagation(); shareDataUrl(m.content, m.fileName, "Amora"); }} className="ml-2">
          <Share2 size={16} color="var(--muted)" />
        </button>
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
