import React from "react";

export function PresenceOrb({ color = "#E2984A", size = 56, pulse = true }) {
  const ringSize = size * 1.7;
  return (
    <div style={{ width: ringSize, height: ringSize, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from 0deg, ${color}00, ${color}55, ${color}00 40%)`, animation: pulse ? "amora-spin 6s linear infinite" : "none", opacity: 0.8 }} />
      <div style={{ position: "absolute", width: size * 1.3, height: size * 1.3, borderRadius: "50%", border: `1px solid ${color}33`, animation: pulse ? "amora-ring 3.2s ease-out infinite" : "none" }} />
      <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${color}ff, ${color}77 55%, transparent 75%)`, boxShadow: `0 0 ${size * 0.7}px ${color}77, inset 0 0 ${size * 0.2}px ${color}aa`, animation: pulse ? "amora-breathe 3.2s ease-in-out infinite" : "none" }} />
    </div>
  );
}
