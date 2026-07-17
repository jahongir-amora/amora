import * as XLSX from "xlsx";

export function exportAsDoc(title, extract, pageUrl) {
  const html = `<html><head><meta charset='utf-8'></head><body><h1>${title}</h1><p>${extract}</p><p><a href="${pageUrl || ""}">${pageUrl || ""}</a></p></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsExcel(title, extract) {
  try {
    const ws = XLSX.utils.aoa_to_sheet([["Mavzu", "Ma'lumot"], [title, extract]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Malumot");
    XLSX.writeFile(wb, `${title}.xlsx`);
  } catch (e) {}
}

export function exportAsPdf(title, extract, pageUrl) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<html><head><title>${title}</title></head><body><h1>${title}</h1><p style="line-height:1.6">${extract}</p><p>${pageUrl || ""}</p></body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

export function exportImage(thumbnail, title) {
  const a = document.createElement("a");
  a.href = thumbnail;
  a.download = `${title}.jpg`;
  a.target = "_blank";
  a.click();
}
