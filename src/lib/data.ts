import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { site } from "@/config/site";
import { DersSchema, SorularSchema, TabloSchema, TakvimSchema, type Ders, type Senaryo, type Yazili } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function okuJson<T>(dosya: string, sema: z.ZodType<T>): T {
  const tam = path.join(DATA_DIR, dosya);
  const sonuc = sema.safeParse(JSON.parse(fs.readFileSync(tam, "utf8")));
  if (!sonuc.success) {
    throw new Error(`Geçersiz veri: data/${dosya}\n${z.prettifyError(sonuc.error)}`);
  }
  return sonuc.data;
}

// Soruların resmî dağılıma ve puan kurallarına uyduğunu build sırasında kontrol eder; uymazsa build durur.
function sorulariKontrolEt(dosya: string, yazili: Yazili) {
  const konuCiktisi = new Map(yazili.konular.map((k) => [k.slug, k.ciktiId]));
  for (const s of yazili.senaryolar.filter((x) => x.hazir)) {
    const yer = `data/${dosya} · senaryo ${s.no}`;
    const toplam = s.sorular.reduce((t, q) => t + q.puan, 0);
    if (toplam !== 100) throw new Error(`${yer}: toplam puan ${toplam}, 100 olmalı`);
    const sayac = new Map<string, number>();
    for (const q of s.sorular) {
      const ciktiId = konuCiktisi.get(q.konuSlug);
      if (!ciktiId) throw new Error(`${yer} · soru ${q.no}: bu yazılıda olmayan konu "${q.konuSlug}"`);
      sayac.set(ciktiId, (sayac.get(ciktiId) ?? 0) + 1);
      const maddeToplami = q.maddeler.reduce((t, m) => t + m.puan, 0);
      if (maddeToplami !== q.puan)
        throw new Error(`${yer} · soru ${q.no}: maddelerin toplamı ${maddeToplami}, soru puanı ${q.puan}`);
      for (const m of q.maddeler) {
        const rubrikToplami = m.rubrik.reduce((t, r) => t + r.puan, 0);
        if (rubrikToplami !== m.puan)
          throw new Error(`${yer} · madde ${m.no}: rubrik toplamı ${rubrikToplami}, madde puanı ${m.puan}`);
      }
    }
    for (const c of yazili.ciktilar) {
      const beklenen = s.dagilim[c.id] ?? 0;
      const olan = sayac.get(c.id) ?? 0;
      if (beklenen !== olan) throw new Error(`${yer}: ${c.id} için resmî tabloda ${beklenen} soru var, yazılan ${olan}`);
    }
  }
}

function yaziliOku(klasor: string, dosya: string): Yazili {
  const tablo = okuJson(`${klasor}/${dosya}`, TabloSchema);
  const sorularDosyasi = dosya.replace(/\.json$/, ".sorular.json");
  const sorular = fs.existsSync(path.join(DATA_DIR, klasor, sorularDosyasi))
    ? okuJson(`${klasor}/${sorularDosyasi}`, SorularSchema)
    : undefined;

  for (const s of sorular?.senaryolar ?? []) {
    if (!tablo.senaryolar.some((t) => t.no === s.no))
      throw new Error(`data/${klasor}/${sorularDosyasi}: resmî tabloda senaryo ${s.no} yok`);
  }

  const yazili: Yazili = {
    slug: tablo.slug,
    ad: tablo.ad,
    sira: tablo.sira,
    ulkeGeneli: tablo.ulkeGeneli,
    duyuru: tablo.duyuru,
    tarihAraligi: sorular?.tarihAraligi,
    not: sorular?.not,
    kaynak: tablo.kaynak,
    ciktilar: tablo.ciktilar.map(({ id, unite, metin }) => ({ id, unite, metin })),
    konular: tablo.ciktilar.map((c) => ({
      slug: c.konuSlug,
      ad: c.konu,
      kisaAd: sorular?.konuKisaAdlari?.[c.konuSlug] ?? c.konu,
      ciktiId: c.id,
    })),
    senaryolar: tablo.senaryolar.map((t) => {
      const s = sorular?.senaryolar.find((x) => x.no === t.no);
      return { no: t.no, dagilim: t.dagilim, hazir: !!s, sureDk: s?.sureDk ?? 40, sorular: s?.sorular ?? [] };
    }),
  };
  sorulariKontrolEt(`${klasor}/${sorularDosyasi}`, yazili);
  return yazili;
}

let derslerOnbellek: Ders[] | undefined;
export function getDersler(): Ders[] {
  derslerOnbellek ??= okuJson("dersler.json", z.array(DersSchema)).filter((d) =>
    (site.yayindakiDersler as readonly string[]).includes(d.slug),
  );
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
        .filter((f) => f.endsWith(".json") && !f.endsWith(".sorular.json"))
        .map((f) => yaziliOku(anahtar, f))
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

/** Bir konunun, soruları yazılmış tüm senaryolardaki soruları. */
export function konuSorulari(yazili: Yazili, konuSlug: string) {
  return yazili.senaryolar.flatMap((s) =>
    s.sorular.filter((q) => q.konuSlug === konuSlug).map((q) => ({ senaryo: s.no, soru: q })),
  );
}

/** Sorusu olan konular (konu sayfası yalnızca bunlar için üretilir). */
export function cozulebilirKonular(yazili: Yazili) {
  return yazili.konular.filter((k) => konuSorulari(yazili, k.slug).length > 0);
}

/** Resmî tabloya göre senaryodaki soru sayısı. */
export function senaryoSoruSayisi(s: Senaryo) {
  return Object.values(s.dagilim).reduce<number>((t, v) => t + (v ?? 0), 0);
}

export function senaryoKonuPuanlari(yazili: Yazili, no: number) {
  const s = yazili.senaryolar.find((x) => x.no === no);
  if (!s) return [];
  return yazili.konular
    .map((k) => ({ konu: k, puan: s.sorular.filter((q) => q.konuSlug === k.slug).reduce((t, q) => t + q.puan, 0) }))
    .filter((x) => x.puan > 0);
}
