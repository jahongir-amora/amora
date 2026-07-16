import React from "react";

const STAR_POSITIONS = [
  { x: 8, y: 15, s: 3 }, { x: 22, y: 8, s: 2 }, { x: 88, y: 20, s: 3 },
  { x: 78, y: 10, s: 2 }, { x: 92, y: 55, s: 2 }, { x: 6, y: 60, s: 2 },
  { x: 15, y: 85, s: 3 }, { x: 85, y: 82, s: 2 }, { x: 50, y: 5, s: 2 },
  { x: 60, y: 92, s: 3 }, { x: 30, y: 95, s: 2 }, { x: 95, y: 40, s: 2 },
];

export function AmoraOrb({ size = 96, showStars = true, pulse = true }) {
  const cream = "#FFD9A6";
  const heart = "#FF4D6D";

  return (
    <div style={{ position: "relative", width: size * 1.9, height: size * 1.9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {showStars && (
        <div style={{ position: "absolute", inset: 0 }}>
          {STAR_POSITIONS.map((s, i) => (
            <span
              key={i}
              className="amora-star"
              style={{
                position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
                width: s.s, height: s.s, borderRadius: "50%",
                background: "#FFFFFF", opacity: 0.8,
                animationDelay: `${(i % 6) * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        style={{
          position: "absolute", width: size * 1.5, height: size * 1.5, borderRadius: "50%",
          background: `radial-gradient(circle, ${heart}33, transparent 70%)`,
          animation: pulse ? "amora-glow 3.4s ease-in-out infinite" : "none",
        }}
      />

      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "relative", animation: pulse ? "amora-breathe 4s ease-in-out infinite" : "none" }}>
        <defs>
          <mask id="amora-moon-mask">
            <rect width="100" height="100" fill="white" />
            <circle cx="62" cy="50" r="34" fill="black" />
          </mask>
        </defs>
        <circle cx="50" cy="50" r="38" fill={cream} mask="url(#amora-moon-mask)" />
      </svg>

      <div
        className="amora-heartbeat"
        style={{
          position: "absolute", width: size * 0.34, height: size * 0.34,
          left: "50%", top: "50%", transform: "translate(-58%, -50%)",
        }}
      >
        <svg viewBox="0 0 32 29" width="100%" height="100%">
          <path
            d="M16 28 C16 28 2 18.5 2 9.8 C2 4.4 6.2 1 10.6 1 C13.4 1 15.4 2.4 16 4.4 C16.6 2.4 18.6 1 21.4 1 C25.8 1 30 4.4 30 9.8 C30 18.5 16 28 16 28 Z"
            fill={heart}
            style={{ filter: `drop-shadow(0 0 6px ${heart}aa)` }}
          />
        </svg>
      </div>
    </div>
  );
}
