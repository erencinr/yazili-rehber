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

const SenaryoSchema = z.object({
  no: z.number().int().positive(),
  sureDk: z.number().int().positive(),
  dagilim: z.record(z.string(), z.number().int().nullable()),
  sorular: z.array(SoruSchema).min(1),
});

export const YaziliSchema = z.object({
  slug: z.string(),
  ad: z.string(),
  sira: z.number().int().default(1),
  tarihAraligi: z.string().optional(),
  not: z.string().optional(),
  ciktilar: z.array(z.object({ id: z.string(), unite: z.string(), metin: z.string() })),
  senaryolar: z.array(SenaryoSchema).min(1),
  konular: z.array(
    z.object({ slug: z.string(), ad: z.string(), kisaAd: z.string(), ciktiId: z.string().optional() }),
  ),
});

export const TakvimSchema = z.object({
  okulGeneli: z.array(
    z.object({ donem: z.string(), yazili: z.string(), baslangic: z.string(), bitis: z.string() }),
  ),
  ulkeGeneli: z.array(
    z.object({ sinif: z.number(), ders: z.string(), donem: z.string(), yazili: z.string(), tarih: z.string() }),
  ),
});

export type Ders = z.infer<typeof DersSchema>;
export type Yazili = z.infer<typeof YaziliSchema>;
export type Senaryo = Yazili["senaryolar"][number];
export type Soru = Senaryo["sorular"][number];
export type Madde = Soru["maddeler"][number];
export type Konu = Yazili["konular"][number];
export type Takvim = z.infer<typeof TakvimSchema>;
