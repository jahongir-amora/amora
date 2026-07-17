// Amora to'g'ridan-to'g'ri api.anthropic.com'ga so'rov yubora olmaydi, chunki
// bu brauzerdan chiqadigan so'rov va API kaliti kerak bo'ladi. API kalitini
// frontend kodida saqlash xavfsiz emas (uni har qanday tashrifchi ko'rishi mumkin).
//
// Shuning uchun so'rovlar shu yerdagi manzilga (o'zingiz deploy qiladigan kichik
// proksi-serverga) yuboriladi. Proksi kalitni yashirib turadi va so'rovni
// Anthropic'ga uzatadi.
//
// Qanday sozlash kerakligi: repo tugida /worker/README.md faylini o'qing.
export const API_ENDPOINT = "https://amora-proxy.rjahongir883.workers.dev/v1/messages";
