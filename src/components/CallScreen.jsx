import React from "react";
import { Square } from "lucide-react";
import { PresenceOrb } from "./PresenceOrb.jsx";

export function CallScreen({ character, callStatus, callTranscript, callReply, onEnd, voiceLevel }) {
  const statusLabel = {
    listening: "Tinglamoqda...",
    thinking: "O'ylamoqda...",
    speaking: `${character.name} gapirmoqda...`,
    idle: "Ulanmoqda...",
  }[callStatus] || "Ulanmoqda...";
  const boost = callStatus === "listening" ? 1 + voiceLevel * 0.35 : 1;
  return (
    <div className="flex flex-col flex-1 min-h-screen px-8 py-16 items-center justify-between amora-fade" style={{ color: "var(--text)" }}>
      <div className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>Ovozli qo'ng'iroq</div>
      <div className="flex flex-col items-center gap-6">
        <div style={{ transform: `scale(${boost})`, transition: "transform 80ms linear" }}>
          <PresenceOrb color={character.color} size={120} pulse={true} />
        </div>
        <div className="amora-display text-2xl">{character.name}</div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>{statusLabel}</div>
        <div className="text-center px-4 min-h-[60px]">
          {callTranscript && <div className="text-sm mb-2" style={{ color: "var(--text)" }}>"{callTranscript}"</div>}
          {callReply && <div className="text-xs" style={{ color: "var(--muted)" }}>{callReply}</div>}
        </div>
      </div>
      <button onClick={onEnd} className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#D65C86", boxShadow: "0 10px 28px rgba(214,92,134,0.4)" }}>
        <Square size={22} color="#fff" />
      </button>
      <div className="text-xs" style={{ color: "var(--muted)" }}>Tugatish uchun bosing</div>
    </div>
  );
}
