import React, { useEffect, useState } from "react";
import { AmoraOrb } from "./AmoraOrb.jsx";
import { AMORA_CHARACTER_IMG } from "../constants/character.js";

export function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(0); // 0: osmon, 1: oy chiqadi, 2: yurak porlaydi, 3: AMORA yozuvi

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 450),
      setTimeout(() => setStage(2), 1250),
      setTimeout(() => setStage(3), 2050),
      setTimeout(() => onFinish(), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="flex flex-col flex-1 min-h-screen items-center justify-center gap-7"
      style={{ background: "radial-gradient(circle at 50% 32%, #14183A 0%, #0B1026 70%)", cursor: "pointer", position: "relative", overflow: "hidden" }}
    >
      <img
        src={AMORA_CHARACTER_IMG}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
          width: "78%", maxWidth: 420, opacity: stage >= 1 ? 0.4 : 0,
          transition: "opacity 1.6s ease", pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 40%, #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 40%, #000 55%, transparent 100%)",
        }}
      />

      <div style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? "translateY(0) scale(1)" : "translateY(10px) scale(0.94)", transition: "all 0.9s cubic-bezier(.2,.8,.2,1)", position: "relative" }}>
        <AmoraOrb size={112} showStars={stage >= 0} thinking={false} ring={stage >= 1} />
      </div>

      <div style={{ opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? "translateY(0)" : "translateY(8px)", transition: "all 0.7s ease", textAlign: "center", position: "relative" }}>
        <div className="amora-display" style={{ fontSize: 34, letterSpacing: 4, color: "#FFFFFF" }}>AMORA</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#FF4D6D", marginTop: 6, fontWeight: 600 }}>AI WITH HEART</div>
        <div style={{ fontSize: 12, marginTop: 22, color: "#B8AED1" }}>
          Human First. <span style={{ color: "#FF4D6D", fontWeight: 700 }}>Always.</span>
        </div>
      </div>
    </div>
  );
}
