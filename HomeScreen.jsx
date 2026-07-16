import React from "react";

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="mx-4 mb-2 px-4 py-3 rounded-xl text-xs flex items-start gap-2" style={{ background: "#3D2830", color: "#F3C6D0", border: "1px solid #5A3A45" }}>
      <span className="flex-1 leading-relaxed">{message}</span>
      <button onClick={onDismiss} className="font-semibold flex-shrink-0">✕</button>
    </div>
  );
}
