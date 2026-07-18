import React, { useState } from "react";
import { TopBar } from "./TopBar.jsx";

const AVATARS = ["🙂", "😊", "🥰", "😎", "🧑", "👩", "👨", "🧕", "👦", "👧", "🧔", "👴", "👵", "🐱", "🐶", "🌸"];

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

  function handleSave() {
    if (!canContinue) return;
    setUserName(nameInput.trim());
    setProfileBio(bioInput.trim());
    setProfileBirthdate(birthInput.trim());
    if (isOnboarding) {
      onFinishOnboarding && onFinishOnboarding();
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title={isOnboarding ? "Tanishib olaylik" : "Profil"} onOpenMenu={onOpenMenu} hideMenuButton={isOnboarding} />
      <div className="flex-1 overflow-y-auto amora-scroll px-6 py-5">

        {isOnboarding && (
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Amora'dan foydalanishdan oldin ismingizni va avataringizni tanlang — shundan keyin suhbat va boshqa bo'limlar ochiladi.
          </p>
        )}

        <div className="flex flex-col items-center mb-6">
          <button onClick={() => setShowAvatars(!showAvatars)} className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2"
            style={{ background: "var(--surface)", border: "2px solid var(--accent)" }}>
            {profileAvatar || "🙂"}
          </button>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Avatarni o'zgartirish uchun bosing</span>
          {showAvatars && (
            <div className="grid grid-cols-8 gap-2 mt-3 p-3 rounded-xl" style={{ background: "var(--surface)" }}>
              {AVATARS.map((a) => (
                <button key={a} onClick={() => { setProfileAvatar(a); setShowAvatars(false); }} className="text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:scale-110 transition-transform">
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Ism {isOnboarding && <span style={{ color: "var(--accent)" }}>*</span>}</label>
        <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Ismingizni kiriting" autoFocus={isOnboarding}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-5" style={{ background: "var(--surface)", color: "var(--text)" }} />

        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Bio</label>
        <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} placeholder="O'zingiz haqingizda qisqacha... (ixtiyoriy)" rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-5 resize-none" style={{ background: "var(--surface)", color: "var(--text)" }} />

        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Tug'ilgan sana</label>
        <input value={birthInput} onChange={(e) => setBirthInput(e.target.value)} type="date"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-5" style={{ background: "var(--surface)", color: "var(--text)" }} />

        {!isOnboarding && (
          <>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Til</label>
            <div className="w-full px-4 py-3 rounded-xl text-sm mb-6 flex items-center justify-between" style={{ background: "var(--surface)", color: "var(--muted)" }}>
              <span>O'zbekcha</span>
              <span className="text-xs">boshqa tillar tez orada</span>
            </div>
          </>
        )}

        <button onClick={handleSave} disabled={!canContinue} className="w-full py-4 rounded-2xl font-medium text-sm mb-3 disabled:opacity-40" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>
          {isOnboarding ? "Davom etish →" : saved ? "✓ Saqlandi" : "Saqlash"}
        </button>

        {!isOnboarding && (
          <button onClick={onGoTheme} className="w-full py-3 rounded-2xl font-medium text-sm" style={{ background: "var(--surface)", color: "var(--text)" }}>
            🎨 Mavzuni o'zgartirish
          </button>
        )}
      </div>
    </div>
  );
}
