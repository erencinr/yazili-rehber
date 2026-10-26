# 4. Veri modeli (JSON dosyaları)

Tüm üretilen sayfalar bu dosyalardan beslenir. Klasör yapısı:
```
data/
  dersler.json                         # ders listesi
  takvim.json                          # sınav tarihleri
  {ders}/{sinif}/{yazili}.json         # dağılım tablosu + senaryolar + sorular
```
TypeScript tiplerini `src/lib/types.ts` içinde tanımla, veriyi `zod` ile build sırasında doğrula.

## dersler.json
```ts
type Ders = {
  slug: string;            // "tarih"
  ad: string;              // "Tarih"
  kademe: "ortaokul" | "lise";
  siniflar: { slug: string; ad: string; not?: string }[]; // {slug:"9-sinif", ad:"9. sınıf"}
  uniteler: string[];
  not?: string;            // "7. sınıfta uygulanmaz" gibi
};
```

## {ders}/{sinif}/{yazili}.json
```ts
type Yazili = {
  slug: string;                 // "1-yazili-sorulari"
  ad: string;                   // "1. dönem 1. yazılı"
  tarihAraligi?: string;
  ciktilar: { id: string; unite: string; metin: string }[];   // tablo satırları
  senaryolar: {
    no: number;                               // 1..N
    dagilim: Record<string, number | null>;   // ciktiId -> soru sayısı (null = "—")
    sureDk: number;                           // ör. 40
    sorular: Soru[];
  }[];
  konular: { slug: string; ad: string; kisaAd: string }[];  // konu sayfaları
};

type Soru = {
  no: number;
  konuSlug: string;
  baslik: string;                 // "Tarih Öğrenmenin Bireye ve Topluma Faydaları"
  puan: number;                   // alt maddelerin toplamı
  kaynaklar: { etiket: string; metin: string; dipnot?: string; gorsel?: string }[];
  maddeler: {
    no: string;                   // "1.1"
    puan: number;
    soru: string;
    cevapOrnegi: string;          // örnek doğru cevap
    rubrik: { aciklama: string; puan: number }[];  // kendini puanlama checkbox'ları
  }[];
};
```
Toplam puan her senaryoda 100 olmalı → build sırasında kontrol et, değilse hata ver.

## takvim.json
```ts
type Takvim = {
  okulGeneli: { donem: string; yazili: string; baslangic: string; bitis: string }[];
  ulkeGeneli: { sinif: number; ders: string; donem: string; yazili: string; tarih: string }[];
};
```
Örnekler: `data/ornek/` klasöründe.
