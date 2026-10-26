# Proje: OYSS Rehber benzeri site (klon değil, benzer yapı)

Bu klasör, oyss.com.tr sitesinin incelenmesiyle hazırlanmış bir **yapım paketidir**.
Amaç: aynı mimariye ve kullanıcı deneyimine sahip, **kendi içeriğimiz ve kendi markamızla** bir site kurmak.

## Kurallar
- Orijinal sitenin metinlerini, sorularını, logosunu birebir KOPYALAMA. Yapıyı ve işleyişi örnek al, içeriği biz üreteceğiz.
- Marka adı şimdilik `{{MARKA}}` (ör. "Yazılı Rehber"). Tek yerden (`src/config/site.ts`) değiştirilebilsin.
- Dil: Türkçe. Tüm URL'ler Türkçe slug, sonda `/` (trailingSlash: true).
- Footer'da "MEB'in resmî sitesi değildir" uyarısı mutlaka olsun.

## Teknoloji (orijinal site ile aynı)
- Next.js (App Router) + TypeScript + Tailwind CSS
- Statik üretim (SSG): tüm ders/sınıf/senaryo sayfaları `generateStaticParams` ile build'de üretilir
- İçerik: `data/` altındaki JSON dosyalarından okunur (veritabanı yok)
- Hesabım + kullanıcı puanları: `localStorage` (giriş sistemi yok, v1)
- Yayın: Vercel
- Fontlar (next/font/google): **Literata** (başlıklar, serif, 400) + **Manrope** (gövde)

## Okuma sırası
1. `docs/01-site-haritasi.md` – tüm sayfalar ve URL yapısı
2. `docs/02-tasarim-sistemi.md` – renkler, fontlar, bileşen stilleri
3. `docs/03-sayfa-sablonlari.md` – her sayfa tipinin bölümleri
4. `docs/04-veri-modeli.md` – JSON şemaları
5. `docs/05-interaktif-sinav.md` – senaryo sayfasındaki "sınav çöz + kendini puanla" özelliği
6. `docs/06-seo.md` – SEO, schema.org, sitemap
7. `docs/07-yapim-plani.md` – adım adım yapım sırası
8. `data/ornek/` – örnek JSON verileri (uydurma örnek içerik)

## İlk komut
`docs/07-yapim-plani.md` dosyasındaki 1. aşamadan başla, her aşama bitince `npm run build` ile kontrol et.

@AGENTS.md

## Mevcut durum (26 Ekim 2026)
- Aşama 1-5 yapıldı: iskelet, bileşenler, veri katmanı (zod + 100 puan kontrolü), tüm üretilen sayfalar, interaktif sınav, /hesap.
- Pilot içerik: `data/tarih/9-sinif/1-yazili-sorulari.json` (2 senaryo, 3 konu). TASLAK: öğretmen onayı gerekli.
- Rehber sayfaları `src/content/sayfalar.ts` içinde yer tutucu metinlerle duruyor (Aşama 6: MDX'e taşınacak).
- Next.js 16.4: Cache Components açık. `dynamicParams` kullanma; bilinmeyen slug için `notFound()`. Kök layout'ta `ensureStatic = "navigation"` var: istek anında sunucu render'ı gerektiren kod build'i kırar.
- `docs/` klasörü yapım paketinin dokümanlarıdır.

## Yeni ders/yazılı eklemek
`data/{ders-slug}/{sinif-slug}/{yazili-slug}.json` dosyası ekle (şema: `src/lib/types.ts`). Sayfalar build'de kendiliğinden üretilir. Rubrik toplamı = madde puanı, madde toplamı = soru puanı, soru toplamı = 100 olmalı; değilse build hata verir.

## Bilinen tuzak: CSS önbelleği
`src/app/globals.css` değişikliği bazen ne dev sunucusuna ne `next build` çıktısına yansıyor (`@tailwindcss/turbopack` önbelleği). Stil değişmiyorsa `rm -rf .next/cache` yapıp yeniden derle / dev sunucusunu yeniden başlat.
