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
- Font: **Inter** (Atomica ile aynı). Not: paketteki ilk tasarım Literata/Manrope + krem/yeşil idi, Atomica'ya uyum için değiştirildi.

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

## Atomica
Site atomica.com.tr/yazili/ altında yayınlanacak; tasarım Atomica'nın renk/yazı tipi değişkenleriyle aynı (`src/app/globals.css`: navy, turq, purple, yellow, Inter). Derleme ve Express kurulumu: `docs/atomica-entegrasyon.md` (`npm run build:atomica`).

## Mevcut durum (26 Ekim 2026)
- Aşama 1-5 yapıldı: iskelet, bileşenler, veri katmanı (zod + 100 puan kontrolü), tüm üretilen sayfalar, interaktif sınav, /hesap.
- 16 dersin resmî tabloları aktarıldı (`npm run tablolar`, kaynak listesi: `data/resmi/kaynaklar.json`). 4 yazılı ülke geneli (tablo sınav öncesi yayımlanacak).
- Tarih 9-11 resmî tabloları aktarıldı. Sorusu yazılan: 9. sınıf 1. yazılı Senaryo 1 (7 soru) ve Senaryo 2 (6 soru). TASLAK: öğretmen onayı gerekli.
- Rehber sayfaları `src/content/sayfalar.ts` içinde; metinler OYSS Uygulama Kılavuzu (Ekim 2026) ve resmî takvimlerden yazıldı, kaynaklar `KAYNAK` sabitinde. Takvim: `data/takvim.json`. Yeni bilgi eklerken resmî kaynağını da ekle.
- Kılavuza göre 7. ve 11. sınıf İngilizce OYSS kapsamı dışında (dersler.json'da sınıf notu var).
- Next.js 16.4, Cache Components **kapalı** (statik dışa aktarma/PPR ile uyumsuz). Dinamik sayfalarda `generateStaticParams` + `dynamicParams = false`; robots/sitemap `dynamic = "force-static"`. İstek anında sunucu gerektiren özellik (cookies, headers, route handler, server action) ekleme: GitHub Pages derlemesi kırılır.
- Yayın: GitHub Pages, `.github/workflows/pages.yml` main'e her push'ta `BASE_PATH=/yazili-rehber` ile `out/` üretip yayınlar → https://erencinr.github.io/yazili-rehber/ . Yerelde dene: `BASE_PATH=/yazili-rehber npm run build`.
- Repo: github.com/erencinr/yazili-rehber. Bu makinede aktif gh hesabı educat-ai; push için `GH_TOKEN=$(gh auth token --user erencinr)` kullan.
- `docs/` klasörü yapım paketinin dokümanlarıdır.

## İçerik sistemi (yeni ders/yazılı eklemek)
Her yazılı iki dosyadan oluşur:
1. `data/{ders}/{sinif}/{n}-yazili-sorulari.json`: ÖDSGM resmî konu-soru dağılım tablosundan **üretilir**, elle düzenlenmez.
   `npm run tablo -- <ders-slug> data/resmi/<dosya>.xlsx --url <resmî adres>` ile oluşturulur/güncellenir.
   Resmî tablolar: https://odsgm.meb.gov.tr/www/1donem-konu-soru-dagilim-tablolari-2026-2027/icerik/1724 (meb.ai kısa linkleri xlsx'e yönlenir).
2. `data/{ders}/{sinif}/{n}-yazili-sorulari.sorular.json`: elle yazılan sorular (şema: `SorularSchema`, `src/lib/types.ts`). Aktarma komutu bu dosyaya dokunmaz.

Build sırasında kontrol edilenler: her hazır senaryoda çıktı başına soru sayısı = resmî dağılım; rubrik toplamı = madde puanı; madde toplamı = soru puanı; soru toplamı = 100. Uymazsa build durur.
Sorusu yazılmamış senaryo "hazırlanıyor" görünür ve kâğıt sayfası üretilmez. Sorular özgün olmalı; başka sitelerin sorularını kopyalama.

## Bilinen tuzak: CSS önbelleği
`src/app/globals.css` değişikliği bazen ne dev sunucusuna ne `next build` çıktısına yansıyor (`@tailwindcss/turbopack` önbelleği). Stil değişmiyorsa `rm -rf .next/cache` yapıp yeniden derle / dev sunucusunu yeniden başlat.
