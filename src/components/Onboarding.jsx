import React from "react";
import { ChevronRight } from "lucide-react";
import { PresenceOrb } from "./PresenceOrb.jsx";

export function Onboarding({ slides, step, setStep, onFinish }) {
  const slide = slides[step];
  const isLast = step === slides.length - 1;
  const dotColors = ["#E2984A", "#C1587B", "#7C6B99"];
  return (
    <div className="flex flex-col flex-1 min-h-screen px-8 pt-16 pb-10">
      <div key={step} className="amora-fade flex-1 flex flex-col items-center justify-center text-center gap-8">
        <PresenceOrb color={dotColors[step]} size={88} />
        <div>
          <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "var(--muted)" }}>
            {String(step + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
          <h1 className="amora-display text-4xl leading-tight mb-4" style={{ color: "var(--text)" }}>{slide.title}</h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>{slide.body}</p>
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === step ? 24 : 6, height: 6, background: i === step ? "var(--accent)" : "var(--border)" }} />
        ))}
      </div>
      <button onClick={() => (isLast ? onFinish() : setStep(step + 1))} className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
        style={{ background: "var(--accent)", color: "var(--accent-text)" }}>
        {isLast ? "Boshlash" : "Davom etish"} <ChevronRight size={18} />
      </button>
    </div>
  );
}
