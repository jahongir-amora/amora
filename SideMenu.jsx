import React from "react";
import { REACTIONS } from "../constants/stickers.js";

export function ReactionPicker({ onPick, canEdit, onEdit, onDelete }) {
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
