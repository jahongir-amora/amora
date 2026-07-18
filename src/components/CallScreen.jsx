import React, { useState } from "react";
import { Square, Repeat } from "lucide-react";
import { AmoraOrb } from "./AmoraOrb.jsx";
import { AMORA_CHARACTER_IMG } from "../constants/character.js";

export function CallScreen({ character, callStatus, callTranscript, callReply, onEnd, voiceLevel }) {
  const [mode, setMode] = useState("character"); // "character" | "diagram" — foydalanuvchi tanlaydi

  const statusLabel = {
    listening: "Tinglamoqda...",
    thinking: "O'ylamoqda...",
    speaking: `${character.name} gapirmoqda...`,
    idle: "Ulanmoqda...",
  }[callStatus] || "Ulanmoqda...";
  const boost = callStatus === "listening" ? 1 + voiceLevel * 0.35 : 1;

  return (
    <div className="flex flex-col flex-1 min-h-screen px-8 py-16 items-center justify-between amora-fade" style={{ color: "var(--text)" }}>
      <div className="flex items-center gap-3">
        <div className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--muted)" }}>Ovozli qo'ng'iroq</div>
        <button onClick={() => setMode(mode === "character" ? "diagram" : "character")}
          className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--surface)" }}
          title={mode === "character" ? "Ovoz diagrammasiga o'tish" : "Qahramonga o'tish"}>
          <Repeat size={13} color="var(--muted)" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        {mode === "character" ? (
          <div style={{ transform: `scale(${boost})`, transition: "transform 80ms linear" }}>
            <img src={AMORA_CHARACTER_IMG} alt={character.name} style={{ width: 160, borderRadius: "50%", boxShadow: callStatus === "listening" ? "0 0 0 4px #FF4D6D55" : "0 0 0 4px transparent", transition: "box-shadow 150ms ease" }} />
          </div>
        ) : (
          <div style={{ transform: `scale(${boost})`, transition: "transform 80ms linear" }}>
            <AmoraOrb size={90} thinking={true} />
          </div>
        )}
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
