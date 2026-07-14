import React, { useState } from "react";
import { PresenceOrb } from "./PresenceOrb.jsx";

export function LockScreen({ pinCode, onUnlock }) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);

  function press(d) {
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);
    setError(false);
    if (next.length === 4) {
      if (next === pinCode) {
        setTimeout(onUnlock, 150);
      } else {
        setError(true);
        setTimeout(() => setEntered(""), 500);
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center justify-center px-8 gap-8">
      <PresenceOrb color="#E2984A" size={80} />
      <div className="text-center">
        <div className="amora-display text-xl mb-1" style={{ color: "var(--text)" }}>Amora qulflangan</div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>{error ? "Noto'g'ri kod" : "Kodni kiriting"}</div>
      </div>
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-3 h-3 rounded-full" style={{ background: i < entered.length ? "var(--accent)" : "var(--border)" }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d, i) =>
          d === "" ? <div key={i} /> : (
            <button key={i} onClick={() => (d === "⌫" ? setEntered((s) => s.slice(0, -1)) : press(d))}
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg" style={{ background: "var(--surface)", color: "var(--text)" }}>
              {d}
            </button>
          )
        )}
      </div>
    </div>
  );
}
