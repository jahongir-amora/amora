import React from "react";

export function MenuRow({ it, setShowMenu }) {
  const Icon = it.icon;
  return (
    <button
      onClick={() => { it.action && it.action(); setShowMenu(false); }}
      className="w-full flex items-center gap-3 text-left py-3 text-sm"
      style={{ color: it.danger ? "#E38A9C" : "var(--text)", borderBottom: "1px solid var(--border)" }}
    >
      <Icon size={16} color={it.danger ? "#E38A9C" : "var(--muted)"} />
      {it.label}
    </button>
  );
}
