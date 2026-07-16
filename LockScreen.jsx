import React, { useState } from "react";
import { TopBar } from "./TopBar.jsx";
import { Plus, Trash2, User } from "lucide-react";

const CATEGORIES = [
  { id: "ota", label: "Ota", emoji: "👨" },
  { id: "ona", label: "Ona", emoji: "👩" },
  { id: "farzand", label: "Farzand", emoji: "🧒" },
  { id: "keksa", label: "Keksa a'zo", emoji: "👴" },
  { id: "boshqa", label: "Boshqa", emoji: "🧑" },
];

export function FamilyScreen({ onOpenMenu, familyMembers, onAdd, onRemove }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("ota");
  const [showForm, setShowForm] = useState(false);

  function submit() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), phone: phone.trim(), category });
    setName("");
    setPhone("");
    setShowForm(false);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title="Oila" subtitle="Yaqinlaringiz va aloqa raqamlari" onOpenMenu={onOpenMenu} />
      <div className="amora-scroll flex-1 overflow-y-auto px-6 py-5">
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Bu yerga qo'shgan yaqinlaringizning telefon raqami SOS bo'limida foydalaniladi — favqulodda holatda ularga xabar shu raqamlar orqali yuboriladi.
        </p>

        {CATEGORIES.map((cat) => {
          const members = familyMembers.filter((f) => f.category === cat.id);
          if (members.length === 0) return null;
          return (
            <div key={cat.id} className="mb-5">
              <div className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "var(--muted)" }}>
                <span>{cat.emoji}</span> {cat.label}
              </div>
              <div className="flex flex-col gap-2">
                {members.map((f, i) => {
                  const idx = familyMembers.indexOf(f);
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "var(--surface)" }}>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{f.name}</div>
                        {f.phone && <div className="text-xs" style={{ color: "var(--muted)" }}>{f.phone}</div>}
                      </div>
                      <button onClick={() => onRemove(idx)}><Trash2 size={16} color="var(--muted)" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {familyMembers.length === 0 && !showForm && (
          <div className="flex flex-col items-center text-center gap-2 mt-10">
            <User size={32} color="var(--muted)" />
            <div className="text-sm" style={{ color: "var(--muted)" }}>Hali oila a'zosi qo'shilmagan</div>
          </div>
        )}

        {showForm ? (
          <div className="p-4 rounded-2xl flex flex-col gap-3 mt-2" style={{ background: "var(--surface)" }}>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: category === cat.id ? "var(--accent)" : "var(--bg)", color: category === cat.id ? "var(--accent-text)" : "var(--muted)" }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism" className="px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--bg)", color: "var(--text)" }} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon raqami (+998...)" inputMode="tel" className="px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "var(--bg)", color: "var(--text)" }} />
            <div className="flex gap-2">
              <button onClick={submit} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>Saqlash</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-3 rounded-xl text-sm" style={{ background: "var(--bg)", color: "var(--muted)" }}>Bekor qilish</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium mt-2" style={{ background: "var(--accent)", color: "var(--accent-text)" }}>
            <Plus size={16} /> Yangi a'zo qo'shish
          </button>
        )}
      </div>
    </div>
  );
}
