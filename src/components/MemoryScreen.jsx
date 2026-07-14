import React from "react";
import { Plus, Trash2 } from "lucide-react";

export function MemoryScreen({ notes, noteInput, setNoteInput, onAdd, onRemove }) {
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
