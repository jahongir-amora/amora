import React from "react";
import { Menu } from "lucide-react";
import { AmoraOrb } from "./AmoraOrb.jsx";

export function TopBar({ title, subtitle, onOpenMenu, showOrb, orbPulse, rightSlot }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-14 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={onOpenMenu} className="w-8 h-8 flex items-center justify-center flex-shrink-0 -ml-1">
        <Menu size={20} color="var(--muted)" />
      </button>
      {showOrb && <div style={{ width: 34, height: 34, overflow: "hidden", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><AmoraOrb size={22} showStars={false} pulse={orbPulse} /></div>}
      <div className="flex-1 min-w-0">
        <div className="amora-display text-lg truncate" style={{ color: "var(--text)" }}>{title}</div>
        {subtitle && <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{subtitle}</div>}
      </div>
      {rightSlot}
    </div>
  );
}
