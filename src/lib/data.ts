import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { DersSchema, TakvimSchema, YaziliSchema, type Ders, type Yazili } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function okuJson<T>(dosya: string, sema: z.ZodType<T>): T {
  const tam = path.join(DATA_DIR, dosya);
  const sonuc = sema.safeParse(JSON.parse(fs.readFileSync(tam, "utf8")));
  if (!sonuc.success) {
    throw new Error(`Geçersiz veri: data/${dosya}\n${z.prettifyError(sonuc.error)}`);
  }
  return sonuc.data;
}

// Puanların tutarlı olduğunu build sırasında kontrol eder; tutarsızsa build durur.
function puanlariKontrolEt(dosya: string, yazili: Yazili) {
  const konuSluglari = new Set(yazili.konular.map((k) => k.slug));
  for (const s of yazili.senaryolar) {
    const yer = `data/${dosya} · senaryo ${s.no}`;
    const toplam = s.sorular.reduce((t, q) => t + q.puan, 0);
    if (toplam !== 100) throw new Error(`${yer}: toplam puan ${toplam}, 100 olmalı`);
    for (const q of s.sorular) {
      if (!konuSluglari.has(q.konuSlug)) throw new Error(`${yer} · soru ${q.no}: bilinmeyen konu "${q.konuSlug}"`);
      const maddeToplami = q.maddeler.reduce((t, m) => t + m.puan, 0);
      if (maddeToplami !== q.puan)
        throw new Error(`${yer} · soru ${q.no}: maddelerin toplamı ${maddeToplami}, soru puanı ${q.puan}`);
      for (const m of q.maddeler) {
        const rubrikToplami = m.rubrik.reduce((t, r) => t + r.puan, 0);
        if (rubrikToplami !== m.puan)
          throw new Error(`${yer} · madde ${m.no}: rubrik toplamı ${rubrikToplami}, madde puanı ${m.puan}`);
      }
    }
  }
}

let derslerOnbellek: Ders[] | undefined;
export function getDersler(): Ders[] {
  derslerOnbellek ??= okuJson("dersler.json", z.array(DersSchema));
  return derslerOnbellek;
}

export function getDers(slug: string) {
  return getDersler().find((d) => d.slug === slug);
}

const yaziliOnbellek = new Map<string, Yazili[]>();
export function getYazililar(ders: string, sinif: string): Yazili[] {
  const anahtar = `${ders}/${sinif}`;
  const onceki = yaziliOnbellek.get(anahtar);
  if (onceki) return onceki;
  const klasor = path.join(DATA_DIR, ders, sinif);
  const liste = fs.existsSync(klasor)
    ? fs
        .readdirSync(klasor)
        .filter((f) => f.endsWith(".json"))
        .map((f) => {
          const dosya = `${anahtar}/${f}`;
          const y = okuJson(dosya, YaziliSchema);
          puanlariKontrolEt(dosya, y);
          return y;
        })
        .sort((a, b) => a.sira - b.sira)
    : [];
  yaziliOnbellek.set(anahtar, liste);
  return liste;
}

export function getYazili(ders: string, sinif: string, yazili: string) {
  return getYazililar(ders, sinif).find((y) => y.slug === yazili);
}

export function getTakvim() {
  return okuJson("takvim.json", TakvimSchema);
}

/** Verisi olan tüm (ders, sınıf, yazılı) üçlüleri. */
export function tumYazililar() {
  return getDersler().flatMap((d) =>
    d.siniflar.flatMap((s) => getYazililar(d.slug, s.slug).map((y) => ({ ders: d, sinif: s, yazili: y }))),
  );
}

export function sinifNo(sinifSlug: string) {
  return sinifSlug.split("-")[0];
}

/** "1. dönem 1. yazılı" → "1. Dönem 1. Yazılı" */
export function baslikYap(metin: string) {
  return metin.replace(/(^|\s)(\p{Ll})/gu, (_, bosluk: string, harf: string) => bosluk + harf.toLocaleUpperCase("tr"));
}

export function senaryoSlug(no: number) {
  return `senaryo-${no}`;
}

export function senaryoKonuPuanlari(yazili: Yazili, no: number) {
  const s = yazili.senaryolar.find((x) => x.no === no);
  if (!s) return [];
  return yazili.konular
    .map((k) => ({ konu: k, puan: s.sorular.filter((q) => q.konuSlug === k.slug).reduce((t, q) => t + q.puan, 0) }))
    .filter((x) => x.puan > 0);
}
