import React from "react";
import { MessageCircle, Users, Search, Brain, Settings as SettingsIcon, User, X } from "lucide-react";

const ITEMS = [
  { id: "chat", label: "Suhbat", icon: MessageCircle },
  { id: "profile", label: "Profil", icon: User },
  { id: "oila", label: "Oila", icon: Users },
  { id: "qidiruv", label: "AI Qidiruv", icon: Search },
  { id: "memory", label: "Xotira", icon: Brain },
  { id: "settings", label: "Sozlamalar", icon: SettingsIcon },
];

export function SideMenu({ open, onClose, screen, onNavigate, onOpenSos }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-30 flex" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="w-72 h-full amora-fade flex flex-col p-5" style={{ background: "var(--surface)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <span className="amora-display text-xl" style={{ color: "var(--text)" }}>Amora</span>
          <button onClick={onClose}><X size={20} color="var(--muted)" /></button>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            const active = screen === it.id;
            return (
              <button
                key={it.id}
                onClick={() => { onNavigate(it.id); onClose(); }}
                className="w-full flex items-center gap-3 text-left px-3 py-3 rounded-xl transition-colors"
                style={{ background: active ? "var(--bg)" : "transparent", color: active ? "var(--accent)" : "var(--text)" }}
              >
                <Icon size={18} color={active ? "var(--accent)" : "var(--muted)"} />
                <span className="text-sm font-medium">{it.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => { onOpenSos(); onClose(); }}
          className="w-full flex items-center gap-3 text-left px-3 py-3 rounded-xl mt-2"
          style={{ background: "#D65C8622", color: "#D65C86" }}
        >
          <span className="w-[18px] h-[18px] rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: "#D65C86", color: "#fff" }}>!</span>
          <span className="text-sm font-bold">SOS</span>
        </button>
      </div>
    </div>
  );
}
