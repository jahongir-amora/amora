import React, { useEffect, useState } from "react";
import { AmoraOrb } from "./AmoraOrb.jsx";

export function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(0); // 0: stars, 1: moon, 2: heart, 3: wordmark

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 1900),
      setTimeout(() => onFinish(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="flex flex-col flex-1 min-h-screen items-center justify-center gap-8"
      style={{ background: "#0B1026", cursor: "pointer" }}
    >
      <div style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <AmoraOrb size={110} showStars={stage >= 0} pulse={stage >= 2} />
      </div>

      <div style={{ opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? "translateY(0)" : "translateY(8px)", transition: "all 0.7s ease", textAlign: "center" }}>
        <div className="amora-display" style={{ fontSize: 34, letterSpacing: 4, color: "#FFFFFF" }}>AMORA</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#FF4D6D", marginTop: 6, fontWeight: 600 }}>AI WITH HEART</div>
      </div>
    </div>
  );
}
