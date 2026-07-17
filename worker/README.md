# Amora API proksisini deploy qilish

Bu qadam **majburiy** — proksisiz chat ishlamaydi (sabab: bosh sahifadagi tahlilda yozilgan, API kaliti va CORS muammosi).

## Nima uchun kerak?

Anthropic API kaliti hech qachon brauzer kodida (frontendda) turmasligi kerak,
chunki uni sayt manba kodidan istalgan kishi ko'chirib olishi mumkin. Shuning
uchun kalit faqat serverda (bu holda — Cloudflare Worker'da) saqlanadi.

## 1-qadam: Anthropic API kalitini oling

console.anthropic.com'da hisob oching (agar yo'q bo'lsa) va API Keys bo'limidan
yangi kalit yarating. **Bu kalit uchun to'lov Anthropic hisobingizdan yechiladi.**

## 2-qadam: Cloudflare Worker yarating

```bash
npm install -g wrangler
wrangler login
```

Ushbu papkada (`worker/`) quyidagi `wrangler.toml` faylini yarating:

```toml
name = "amora-proxy"
main = "amora-proxy.js"
compatibility_date = "2024-01-01"
```

Kalitni maxfiy o'zgaruvchi sifatida qo'shing (bu terminal so'ragan joyga
kalitni joylashtiring, u hech qayerda faylga yozilmaydi):

```bash
wrangler secret put ANTHROPIC_API_KEY
```

`amora-proxy.js` faylida `ALLOWED_ORIGIN` qatorini o'zingizning GitHub Pages
manzilingizga o'zgartiring, masalan:

```js
const ALLOWED_ORIGIN = "https://jahongir-amora.github.io";
```

Deploy qiling:

```bash
wrangler deploy
```

Terminalda sizga `https://amora-proxy.<sizning-subdomeningiz>.workers.dev`
kabi manzil chiqadi.

## 3-qadam: Frontendni proksiga ulash

`src/constants/config.js` faylida `API_ENDPOINT`ni Worker manzilingiz bilan
almashtiring:

```js
export const API_ENDPOINT = "https://amora-proxy.<sizning-subdomeningiz>.workers.dev/v1/messages";
```

So'ng qaytadan quring va push qiling:

```bash
npm run build
git add -A
git commit -m "API proksi ulandi"
git push
```

## Xarajat haqida eslatma

Har bir xabar Anthropic hisobingizdan pul yechadi (Claude Sonnet narxlari
bo'yicha). Worker ochiq internetga chiqqani uchun, `ALLOWED_ORIGIN` ni to'g'ri
sozlash va xohlasangiz qo'shimcha cheklovlar (masalan, kunlik so'rov soni)
qo'yish tavsiya etiladi, aks holda boshqa birov kalitingiz hisobidan
foydalanib qo'yishi mumkin.
