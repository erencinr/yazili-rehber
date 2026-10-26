import type { Kagit, Seviye, Yazili } from "./types";

/** public/ altındaki dosyanın adresi; alt yolda yayında (ör. /yazili) başına alt yol eklenir. */
export function varlik(yol: string) {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + yol;
}

export const SEVIYELER: Seviye[] = ["kolay", "orta", "zor"];
export const SEVIYE_ADI: Record<Seviye, string> = { kolay: "Kolay", orta: "Orta", zor: "Zor" };
/** Kitapçıktaki renklerle uyumlu: kolay yeşil, orta turuncu, zor kırmızı. */
export const SEVIYE_RENK: Record<Seviye, string> = {
  kolay: "bg-emerald-600 hover:bg-emerald-700",
  orta: "bg-orange-500 hover:bg-orange-600",
  zor: "bg-rose-600 hover:bg-rose-700",
};

export function kagitAdi(k: Kagit) {
  return `${k.tur === "senaryo" ? "Senaryo" : "Prova"} ${k.no} · ${SEVIYE_ADI[k.seviye]}`;
}

/** Senaryo kâğıtlarını senaryo numarasına göre gruplar: [[no, [kolay, orta, zor]], …] */
export function senaryoGruplari(yazili: Yazili) {
  const gruplar = new Map<number, Kagit[]>();
  for (const k of yazili.kagitlar) gruplar.set(k.no, [...(gruplar.get(k.no) ?? []), k]);
  return [...gruplar.entries()].sort((a, b) => a[0] - b[0]);
}

/** İlerleme kaydının anahtarı: "<ders>/<sinif>/<yazili>/<kagit>". `taban` yazılının adresidir (/dersler/…/). */
export function kagitAnahtari(taban: string, kagitSlug: string) {
  return `${taban.replace(/^\/dersler\//, "").replace(/\/$/, "")}/${kagitSlug}`;
}

/** Öğrenciye nereden başlayacağını söyleyen kısa yönlendirme. */
export function baslangicOnerisi(yazili: Yazili | undefined) {
  if (yazili?.kagitTuru === "prova")
    return "Bu yazılı ülke geneli yapılacak; sorular MEB'den gelir. Prova 1 ile başla, sonra orta ve zor provalara geç.";
  return "Okulunun hangi senaryoyu seçtiğini öğretmenine sor. Bilmiyorsan Senaryo 1 · Kolay ile başla, sonra zorlaştır.";
}

/** Aynı yazılıdaki bir sonraki kâğıt (kitapçıktaki sırayla). */
export function sonrakiKagit(yazili: Yazili, k: Kagit) {
  const i = yazili.kagitlar.findIndex((x) => x.slug === k.slug);
  return yazili.kagitlar[i + 1];
}
