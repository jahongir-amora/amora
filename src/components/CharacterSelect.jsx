import React from "react";
import { ChevronRight } from "lucide-react";

export function CharacterSelect({ characters, onSelect, onSos }) {
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
