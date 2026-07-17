import React from "react";

export function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="pr-4">
        <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} className="w-11 h-6 rounded-full flex-shrink-0 relative transition-colors" style={{ background: value ? "var(--accent)" : "var(--border)" }}>
        <div className="w-5 h-5 rounded-full absolute top-0.5 transition-all" style={{ background: "#FFFFFF", left: value ? 22 : 2 }} />
      </button>
    </div>
  );
}
