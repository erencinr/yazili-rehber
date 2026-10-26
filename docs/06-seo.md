# 6. SEO (orijinal site SEO'ya çok yatırım yapmış)

- Her sayfada benzersiz `title` + `description` (şablonla üret: "{n}. Sınıf {Ders} 1. Yazılı Soruları ve Senaryoları 2026-2027")
- Canonical URL, sonda `/`
- `sitemap.xml` (next-sitemap veya app/sitemap.ts) – tüm üretilen sayfalar
- `robots.txt`
- JSON-LD:
  - Tüm SSS bölümleri → `FAQPage`
  - Breadcrumb → `BreadcrumbList`
  - Rehber yazıları → `Article` (dateModified = "Son güncelleme")
  - Senaryo kâğıdı → `Quiz` (schema.org/Quiz) veya `LearningResource`
- Uzun kuyruklu soru başlıkları: "X. sınıf Y yazılısında kaç soru olur?" gibi h3'ler SSS'de – veriden otomatik
- Yoğun iç linkleme: her sayfanın altında "diğer sınıflar / diğer dersler / diğer senaryolar / diğer konular"
- Statik üretim + Vercel CDN (orijinal: `x-nextjs-prerender`, ISR ~300 sn)
- Google Analytics (gtag) – çerez onayı ile
- OG görseli: `app/opengraph-image.tsx` ile dinamik (başlık + marka)
