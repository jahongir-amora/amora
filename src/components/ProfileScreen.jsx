import React, { useState } from "react";
import { Camera, Pencil, Palette, Cake } from "lucide-react";
import { TopBar } from "./TopBar.jsx";

const AVATARS = ["🙂", "😊", "🥰", "😎", "🧑", "👩", "👨", "🧕", "👦", "👧", "🧔", "👴", "👵", "🐱", "🐶", "🌸", "🐧", "🦊"];

export function ProfileScreen({
  onOpenMenu, userName, setUserName, profileAvatar, setProfileAvatar,
  profileBio, setProfileBio, profileBirthdate, setProfileBirthdate, onGoTheme,
  isOnboarding, onFinishOnboarding,
}) {
  const [nameInput, setNameInput] = useState(userName || "");
  const [bioInput, setBioInput] = useState(profileBio || "");
  const [birthInput, setBirthInput] = useState(profileBirthdate || "");
  const [showAvatars, setShowAvatars] = useState(isOnboarding);
  const [saved, setSaved] = useState(false);

  const canContinue = !isOnboarding || nameInput.trim().length > 0;

  function commit(nextName, nextBio, nextBirth) {
    setUserName(nextName);
    setProfileBio(nextBio);
    setProfileBirthdate(nextBirth);
  }

  function handleNameBlur() { if (!isOnboarding) commit(nameInput.trim(), bioInput.trim(), birthInput); }
  function handleBioBlur() { if (!isOnboarding) commit(nameInput.trim(), bioInput.trim(), birthInput); }
  function handleBirthChange(v) { setBirthInput(v); if (!isOnboarding) commit(nameInput.trim(), bioInput.trim(), v); }

  function handlePrimaryAction() {
    if (!canContinue) return;
    commit(nameInput.trim(), bioInput.trim(), birthInput);
    if (isOnboarding) { onFinishOnboarding && onFinishOnboarding(); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title={isOnboarding ? "Tanishib olaylik" : "Profil"} onOpenMenu={onOpenMenu} hideMenuButton={isOnboarding} />
      <div className="flex-1 overflow-y-auto amora-scroll px-5 py-6">

        {isOnboarding && (
          <p className="text-sm mb-5 text-center" style={{ color: "var(--muted)" }}>
            Amora'dan foydalanishdan oldin ismingizni va avataringizni tanlang.
          </p>
        )}

        {/* Telegram uslubidagi katta avatar + jonli ism/holat ko'rinishi */}
        <div className="flex flex-col items-center mb-5">
          <button onClick={() => setShowAvatars(!showAvatars)}
            className="w-28 h-28 rounded-full flex items-center justify-center text-6xl mb-3"
            style={{ background: "linear-gradient(155deg, var(--surface), var(--bg))", border: "2.5px solid var(--accent)", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
            {profileAvatar || "🙂"}
          </button>
          <div className="amora-display text-xl" style={{ color: "var(--text)" }}>
            {nameInput.trim() || "Ismingiz"}
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {bioInput.trim() || "Amora bilan tanishtiring"}
          </div>

          <div className="flex items-center gap-8 mt-5">
            <button onClick={() => setShowAvatars(true)} className="flex flex-col items-center gap-1.5">
              <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "var(--surface)" }}>
                <Camera size={17} color="var(--accent)" />
              </span>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>Avatar</span>
            </button>
            {!isOnboarding && (
              <button onClick={onGoTheme} className="flex flex-col items-center gap-1.5">
                <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "var(--surface)" }}>
                  <Palette size={17} color="var(--accent)" />
                </span>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>Mavzu</span>
              </button>
            )}
          </div>

          {showAvatars && (
            <div className="grid grid-cols-6 gap-2.5 mt-5 p-4 rounded-2xl w-full" style={{ background: "var(--surface)" }}>
              {AVATARS.map((a) => (
                <button key={a} onClick={() => { setProfileAvatar(a); setShowAvatars(false); }}
                  className="text-3xl aspect-square flex items-center justify-center rounded-xl hover:scale-110 transition-transform"
                  style={{ background: a === profileAvatar ? "var(--bg)" : "transparent", border: a === profileAvatar ? "1.5px solid var(--accent)" : "1.5px solid transparent" }}>
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ism kartasi */}
        <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "var(--surface)" }}>
          <div className="text-[11px] font-semibold mb-1.5" style={{ color: "var(--accent)" }}>ISM {isOnboarding && "*"}</div>
          <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} onBlur={handleNameBlur}
            placeholder="Ismingizni kiriting" autoFocus={isOnboarding}
            className="w-full bg-transparent text-sm outline-none" style={{ color: "var(--text)" }} />
        </div>

        {/* Bio kartasi — Telegram'dagi kabi belgi hisoblagich bilan */}
        <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "var(--surface)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>BIO</span>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>{bioInput.length}/70</span>
          </div>
          <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value.slice(0, 70))} onBlur={handleBioBlur}
            placeholder="O'zingiz haqingizda qisqacha..." rows={2}
            className="w-full bg-transparent text-sm outline-none resize-none" style={{ color: "var(--text)" }} />
        </div>

        {/* Ma'lumot kartasi — Telegram'dagi ikonkali qatorlar uslubida */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "var(--surface)" }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#4B2E83" }}>
              <Cake size={15} color="#FFD9A6" />
            </span>
            <div className="flex-1">
              <div className="text-[10px]" style={{ color: "var(--muted)" }}>Tug'ilgan sana</div>
              <input value={birthInput} onChange={(e) => handleBirthChange(e.target.value)} type="date"
                className="w-full bg-transparent text-sm outline-none" style={{ color: "var(--text)" }} />
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF4D6D" }}>
              <Pencil size={14} color="#fff" />
            </span>
            <div className="flex-1 text-sm" style={{ color: "var(--muted)" }}>
              Til: <span style={{ color: "var(--text)" }}>O'zbekcha</span> <span className="text-[10px]">(boshqalar tez orada)</span>
            </div>
          </div>
        </div>

        <button onClick={handlePrimaryAction} disabled={!canContinue}
          className="w-full py-4 rounded-2xl font-medium text-sm disabled:opacity-40"
          style={{ background: "var(--accent)", color: "var(--accent-text)" }}>
          {isOnboarding ? "Davom etish →" : saved ? "✓ Saqlandi" : "Saqlash"}
        </button>
      </div>
    </div>
  );
}
