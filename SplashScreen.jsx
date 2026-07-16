import React from "react";
import { MessageCircle, Users, Search, Brain, Settings as SettingsIcon } from "lucide-react";
import { AmoraOrb } from "./AmoraOrb.jsx";

const ITEMS = [
  { id: "chat", label: "Suhbat", icon: MessageCircle },
  { id: "oila", label: "Oila", icon: Users },
  { id: "qidiruv", label: "AI Qidiruv", icon: Search },
  { id: "memory", label: "Xotira", icon: Brain },
  { id: "settings", label: "Sozlamalar", icon: SettingsIcon },
];

export function HomeScreen({ onNavigate }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen items-center px-6 pt-14 pb-8" style={{ background: "#0B1026" }}>
      <AmoraOrb size={72} />
      <div className="text-center mt-3 mb-8">
        <div className="amora-display" style={{ fontSize: 24, letterSpacing: 3, color: "#FFFFFF" }}>AMORA</div>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#FF4D6D", marginTop: 4, fontWeight: 600 }}>AI WITH HEART</div>
      </div>

      <div className="w-full flex flex-col gap-2 flex-1">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => onNavigate(it.id)}
              className="amora-fade w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left"
              style={{ background: "#4B2E83", animationDelay: `${i * 60}ms` }}
            >
              <Icon size={20} color="#FFD9A6" />
              <span style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 500 }}>{it.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onNavigate("sos")}
        className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl mt-2"
        style={{ background: "#FF4D6D22", border: "1px solid #FF4D6D55" }}
      >
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: "#FF4D6D", color: "#fff" }}>!</span>
        <span style={{ color: "#FF4D6D", fontSize: 15, fontWeight: 700 }}>SOS</span>
      </button>
    </div>
  );
}
