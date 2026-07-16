import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { THEMES } from "../constants/themes.js";
import { ToggleRow } from "./ToggleRow.jsx";
import { TopBar } from "./TopBar.jsx";

export function SettingsScreen({ onOpenMenu, dailyCheckin, setDailyCheckin, healthyUsage, setHealthyUsage, voiceReplies, setVoiceReplies, themeId, setThemeId, onReset, pinEnabled, setPinEnabled, pinCode, setPinCode }) {
  const [pinInput, setPinInput] = useState("");

  function handlePinToggle(next) {
    setPinEnabled(next);
  }

  function savePin() {
    if (pinInput.length === 4) {
      setPinCode(pinInput);
      setPinInput("");
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title="Sozlamalar" onOpenMenu={onOpenMenu} />
      <div className="flex-1 overflow-y-auto amora-scroll px-6 py-5">
        <div className="mb-6">
          <div className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>Mavzu</div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(THEMES).map(([id, t]) => (
              <button key={id} onClick={() => setThemeId(id)} className="flex flex-col items-center gap-1 py-3 rounded-xl"
                style={{ background: t.surface, border: themeId === id ? `2px solid ${t.accent}` : "1px solid transparent" }}>
                <span className="text-xl">{t.emoji}</span>
                <span className="text-[10px]" style={{ color: t.muted }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <ToggleRow label="Kunlik salomlashuv" desc="Amora kuniga bir marta hol-ahvol so'raydi" value={dailyCheckin} onChange={setDailyCheckin} />
        <ToggleRow label="Sog'lom foydalanish eslatmasi" desc="Uzoq vaqt gaplashsangiz, yumshoq eslatma beradi" value={healthyUsage} onChange={setHealthyUsage} />
        <ToggleRow label="Har doim ovozli javob" desc="Yozma xabarlarga ham ovoz bilan javob beradi" value={voiceReplies} onChange={setVoiceReplies} />
        <ToggleRow label="🔒 Maxfiy rejim" desc="Ilovani ochish uchun 4 xonali kod so'raladi" value={pinEnabled} onChange={handlePinToggle} />

        {pinEnabled && (
          <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--surface)" }}>
            {pinCode ? (
              <div className="text-xs" style={{ color: "var(--muted)" }}>Kod o'rnatilgan. Ilova qulflanganda shu 4 xonali kodni so'raydi.</div>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="4 xonali kod o'rnating"
                  inputMode="numeric"
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none tracking-widest"
                  style={{ background: "var(--bg)", color: "var(--text)" }}
                />
                <button onClick={savePin} disabled={pinInput.length !== 4} className="px-3 py-2 rounded-xl text-sm font-medium disabled:opacity-40" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>
                  Saqlash
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 rounded-2xl flex gap-3" style={{ background: "#2E3A2F", border: "1px solid #4A5F4C" }}>
          <ShieldCheck size={20} color="#8FB892" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed" style={{ color: "#C6D9C7" }}>
            Amora sun'iy intellekt bo'lib, professional psixologik yordam yoki haqiqiy insoniy munosabatlar o'rnini bosolmaydi. Og'ir hissiy holatda bo'lsangiz, iltimos, yaqiningiz yoki mutaxassis bilan bog'laning. SOS faqat siz o'zingiz tasdiqlaganingizda ishlaydi — hech qachon avtomatik ishlamaydi.
          </p>
        </div>

        <button onClick={onReset} className="mt-8 w-full py-4 rounded-2xl font-medium text-sm" style={{ background: "#3D2830", color: "#E38A9C" }}>
          Barcha ma'lumotlarni tozalash
        </button>
      </div>
    </div>
  );
}
