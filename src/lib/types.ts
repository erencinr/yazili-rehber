import { z } from "zod";

export const DersSchema = z.object({
  slug: z.string(),
  ad: z.string(),
  kademe: z.enum(["ortaokul", "lise"]),
  siniflar: z.array(z.object({ slug: z.string(), ad: z.string(), not: z.string().optional() })),
  uniteler: z.array(z.string()),
  not: z.string().optional(),
});

const RubrikSchema = z.object({ aciklama: z.string(), puan: z.number().positive() });

const MaddeSchema = z.object({
  no: z.string(),
  puan: z.number().positive(),
  soru: z.string(),
  cevapOrnegi: z.string(),
  rubrik: z.array(RubrikSchema).min(1),
});

const SoruSchema = z.object({
  no: z.number().int(),
  konuSlug: z.string(),
  baslik: z.string(),
  puan: z.number().positive(),
  kaynaklar: z.array(
    z.object({
      etiket: z.string(),
      metin: z.string(),
      dipnot: z.string().optional(),
      gorsel: z.string().optional(),
    }),
  ),
  maddeler: z.array(MaddeSchema).min(1),
});

/** data/<ders>/<sinif>/<yazili>.json — ÖDSGM tablosundan scripts/tablo-aktar.mjs ile üretilir. */
export const TabloSchema = z.object({
  slug: z.string(),
  ad: z.string(),
  sira: z.number().int(),
  /** Ülke geneli sınav: tablo sınav öncesi yayımlanır, şimdilik senaryo yok. */
  ulkeGeneli: z.boolean().optional(),
  duyuru: z.string().optional(),
  kaynak: z.object({ ad: z.string(), url: z.string().optional(), dosya: z.string(), alindi: z.string() }),
  ciktilar: z.array(
    z.object({ id: z.string(), unite: z.string(), konu: z.string(), konuSlug: z.string(), metin: z.string() }),
  ),
  senaryolar: z.array(z.object({ no: z.number().int().positive(), dagilim: z.record(z.string(), z.number().int().nullable()) })),
});

/** data/<ders>/<sinif>/<yazili>.sorular.json — elle (veya yardımla) yazılan sorular. */
export const SorularSchema = z.object({
  tarihAraligi: z.string().optional(),
  not: z.string().optional(),
  konuKisaAdlari: z.record(z.string(), z.string()).optional(),
  senaryolar: z.array(
    z.object({
      no: z.number().int().positive(),
      sureDk: z.number().int().positive().default(40),
      sorular: z.array(SoruSchema).min(1),
    }),
  ),
});

export const TakvimSchema = z.object({
  okulGeneli: z.object({
    baslik: z.string(),
    not: z.string(),
    sinavlar: z.array(z.object({ kademe: z.string(), ders: z.string(), tarih: z.string() })),
  }),
  ulkeGeneli: z.array(
    z.object({ sinif: z.number(), ders: z.string(), donem: z.string(), yazili: z.string(), tarih: z.string() }),
  ),
});

export type Ders = z.infer<typeof DersSchema>;
export type Soru = z.infer<typeof SoruSchema>;
export type Madde = Soru["maddeler"][number];
export type Takvim = z.infer<typeof TakvimSchema>;
export type Konu = { slug: string; ad: string; kisaAd: string; ciktiId: string };

export type Senaryo = {
  no: number;
  dagilim: Record<string, number | null>;
  /** Soruları yazılmışsa true; değilse kâğıt sayfası üretilmez. */
  hazir: boolean;
  sureDk: number;
  sorular: Soru[];
};

/** Tablo ve sorular dosyalarının birleşimi; sayfalar bunu kullanır. */
export type Yazili = {
  slug: string;
  ad: string;
  sira: number;
  ulkeGeneli?: boolean;
  duyuru?: string;
  tarihAraligi?: string;
  not?: string;
  kaynak: z.infer<typeof TabloSchema>["kaynak"];
  ciktilar: { id: string; unite: string; metin: string }[];
  konular: Konu[];
  senaryolar: Senaryo[];
};
