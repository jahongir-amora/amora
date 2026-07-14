import React from "react";

export function NameScreen({ userName, setUserName, onNext }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen px-8 pt-20 pb-10 justify-between">
      <div>
        <h2 className="amora-display text-2xl mb-3" style={{ color: "var(--text)" }}>Ismingiz nima?</h2>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Amora seni shu ism bilan chaqiradi.</p>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Ismingizni kiriting"
          className="w-full px-5 py-4 rounded-2xl text-base outline-none" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} />
      </div>
      <button onClick={onNext} disabled={!userName.trim()} className="w-full py-4 rounded-2xl font-semibold text-base disabled:opacity-40"
        style={{ background: "var(--accent)", color: "var(--accent-text)" }}>Davom etish</button>
    </div>
  );
}
