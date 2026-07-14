import React from "react";
import { MessageCircle, BookOpen, Settings as SettingsIcon } from "lucide-react";

export function BottomNav({ screen, setScreen }) {
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
