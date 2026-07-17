import React, { useState } from "react";
import { TopBar } from "./TopBar.jsx";
import { MessageCircle as WhatsAppIcon, MessageSquare } from "lucide-react";

const CONFIRM_WORD = "TASDIQLAYMAN";

export function SosScreen({ onOpenMenu, familyMembers, userName }) {
  const [step, setStep] = useState(1); // 1: ask, 2: type-to-confirm, 3: contact actions
  const [typed, setTyped] = useState("");

  const message = `🆘 Bu ${userName || "sizga yaqin odam"}dan yuborilgan yordam so'rovi. Iltimos, imkon qadar tezroq bog'laning yoki yetib keling.`;

  function reset() {
    setStep(1);
    setTyped("");
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title="SOS" subtitle="Faqat haqiqiy yordam kerak bo'lganda ishlating" onOpenMenu={onOpenMenu} />
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
        {step === 1 && (
          <div className="flex flex-col items-center text-center gap-4 mt-8">
            <div className="text-4xl">🆘</div>
            <div className="amora-display text-xl" style={{ color: "var(--text)" }}>Yordam kerakmi?</div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Bu tugma faqat siz haqiqatan yordam kerak bo'lganda ishlatilishi uchun mo'ljallangan. Davom etsangiz, keyingi bosqichda tasdiqlashingiz so'raladi.
            </p>
            <button onClick={() => setStep(2)} className="w-full py-3 rounded-2xl font-semibold text-sm mt-4" style={{ background: "#D65C86", color: "#fff" }}>
              Ha, davom etish
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center gap-4 mt-8">
            <div className="amora-display text-xl" style={{ color: "var(--text)" }}>Tasdiqlash</div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Davom etsangiz, oila a'zolaringizga xabar yuborish oynasi ochiladi. Tasdiqlash uchun pastdagi katakchaga <b>{CONFIRM_WORD}</b> so'zini yozing.
            </p>
            <input value={typed} onChange={(e) => setTyped(e.target.value.toUpperCase())} placeholder={CONFIRM_WORD}
              className="w-full px-4 py-3 rounded-xl text-sm text-center outline-none tracking-wider" style={{ background: "var(--surface)", color: "var(--text)" }} />
            <div className="flex gap-2 w-full mt-2">
              <button onClick={reset} className="flex-1 py-3 rounded-2xl text-sm" style={{ background: "var(--surface)", color: "var(--muted)" }}>Bekor qilish</button>
              <button onClick={() => typed.trim() === CONFIRM_WORD && setStep(3)} disabled={typed.trim() !== CONFIRM_WORD}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm disabled:opacity-40" style={{ background: "#D65C86", color: "#fff" }}>
                Tasdiqlash
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="text-center">
              <div className="amora-display text-lg mb-1" style={{ color: "var(--text)" }}>Kimga xabar yuborasiz?</div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Tugmani bosgach, telefoningizdagi SMS yoki WhatsApp ilovasi tayyor xabar bilan ochiladi — yuborish uchun o'sha ilovada "Yuborish"ni bosing.</p>
            </div>
            {familyMembers.filter((f) => f.phone).length === 0 && (
              <div className="text-sm text-center mt-6" style={{ color: "var(--muted)" }}>
                Hech qanday raqam kiritilmagan. Avval "Oila" bo'limidan yaqinlaringizning telefon raqamini qo'shing.
              </div>
            )}
            {familyMembers.filter((f) => f.phone).map((f, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{f.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{f.phone}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`sms:${f.phone}?body=${encodeURIComponent(message)}`} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--bg)" }}>
                    <MessageSquare size={16} color="var(--accent)" />
                  </a>
                  <a href={`https://wa.me/${f.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--bg)" }}>
                    <WhatsAppIcon size={16} color="#3FA95A" />
                  </a>
                </div>
              </div>
            ))}
            <button onClick={reset} className="mt-2 py-3 rounded-2xl text-sm" style={{ background: "var(--surface)", color: "var(--muted)" }}>Yopish</button>
          </div>
        )}
      </div>
    </div>
  );
}
