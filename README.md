# Amora — hissiy salomatlik hamrohi

Bu papka Amora ilovasining to'liq manba kodi va GitHub Pages'ga joylash uchun tayyor qurilishi (build)ni o'z ichiga oladi.

## Papka tuzilishi

```
amora/
├── src/
│   ├── App.jsx        ← ilovaning barcha kodi
│   └── main.jsx        ← ilovani sahifaga ulash
├── docs/
│   ├── index.html      ← GitHub Pages shu papkani ko'rsatadi
│   └── bundle.js        ← npm run build natijasi (avtomatik yaratiladi)
├── package.json
└── README.md
```

## 1-qadam: Kompyuterga tayyorlash

Kompyuteringizda [Node.js](https://nodejs.org) o'rnatilgan bo'lishi kerak (v18 yoki undan yuqori).

```bash
cd amora
npm install
```

## 2-qadam: Qurish (build)

```bash
npm run build
```

Bu buyruq `docs/bundle.js` faylini yaratadi. Har safar `src/App.jsx` ichida o'zgartirish qilsangiz, shu buyruqni qayta ishga tushiring
(yoki development paytida `npm run watch` ni ishga tushirib qo'ying — u o'zgarishlarni avtomatik kuzatib turadi).

## 3-qadam: GitHub'ga yuklash

```bash
git init
git add -A
git commit -m "Amora — birinchi versiya"
git branch -M main
git remote add origin https://github.com/FOYDALANUVCHI_NOMI/amora.git
git push -u origin main
```

(`FOYDALANUVCHI_NOMI` o'rniga o'z GitHub nomingizni yozing. Repository avval GitHub saytida yaratilgan bo'lishi kerak.)

## 4-qadam: GitHub Pages'ni yoqish

1. GitHub'da repository sahifasiga o'ting
2. **Settings → Pages**
3. "Branch" qismida **main** ni tanlang, papka sifatida **/docs** ni tanlang
4. **Save** bosing

Bir necha daqiqadan so'ng ilova shu manzilda ochiladi:
```
https://FOYDALANUVCHI_NOMI.github.io/amora/
```

## Muhim eslatmalar (test qilishdan oldin o'qing)

- **Mikrofon, kamera, geolokatsiya** — bular faqat `https://` orqali ishlaydi. GitHub Pages avtomatik `https` beradi, shuning uchun bu muammo bo'lmaydi (oldingi sinov muhitidagi cheklovlar shu yerda bo'lmaydi).
- **API chaqiruvlari** (`api.anthropic.com`) — bu ilova to'g'ridan-to'g'ri Anthropic API'ga murojaat qiladi. Agar bu maxsus proxy/backend orqali ishlashi kerak bo'lsa (masalan API kalitini yashirish uchun), buni alohida backend loyihasi sifatida qurish tavsiya etiladi — API kalitini hech qachon frontend kodida ochiq qoldirmang.
- **Oila/SOS xabarlari, boshqa foydalanuvchilar bilan aloqa** — bu versiya faqat bitta brauzerda ishlaydi (server yo'q). Buni haqiqiy ko'p foydalanuvchili tizimga aylantirish uchun alohida backend (server + baza + autentifikatsiya) kerak bo'ladi.
- **Aqlli uy / soat / robot integratsiyasi** — bular native ilova yoki maxsus SDK talab qiladi, veb-sahifa sifatida ishlamaydi.

## Keyingi qadamlar (agar davom ettirmoqchi bo'lsangiz)

1. Haqiqiy backend qurish (foydalanuvchi hisoblari, xabarlar bazasi, push-bildirishnomalar)
2. API kalitini backend orqali yashirish
3. Flutter/React Native bilan native mobil ilovaga aylantirish (Play Market uchun)
