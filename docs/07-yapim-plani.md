# 7. Yapım planı (Claude Code bu sırayla ilerlesin)

**Aşama 1 – İskelet**
`npx create-next-app@latest` (TS, Tailwind, App Router, src/). trailingSlash: true. Fontlar, renk token'ları, `site.ts` config. Header (mobil menü dahil), Breadcrumb, Footer. Boş ana sayfa.

**Aşama 2 – Temel bileşenler**
Card, Chip, Button, Eyebrow, GlanceBox ("Bir bakışta"), FaqAccordion (+JSON-LD), Toc (sticky, scroll-spy), AudienceCards, NextLinks, CtaStrip, ResponsiveTable.

**Aşama 3 – Veri katmanı**
`data/ornek/` dosyalarını `data/` altına taşı. types.ts + zod şemaları + `lib/data.ts` (getDersler, getDers, getYazili…). 100 puan kontrolü.

**Aşama 4 – Üretilen sayfalar**
/dersler, /dersler/[ders], /dersler/[ders]/[sinif], /…/[yazili], /…/[yazili]/[slug] (slug "senaryo-N" ise kâğıt, değilse konu sayfası). generateStaticParams + generateMetadata.

**Aşama 5 – İnteraktif sınav**
05-interaktif-sinav.md'deki state machine, localStorage, yazdırma CSS'i. /hesap sayfası.

**Aşama 6 – Sabit içerik sayfaları**
MDX ile rehber sayfaları (nedir, nasıl çalışır, kılavuz, takvim, kapsam, giriş, senaryo nedir, öğretmen/öğrenci/veli, SSS, kaynaklar, yasal sayfalar). Metinleri placeholder olarak yaz, gerçek içeriği biz dolduracağız.

**Aşama 7 – SEO & yayın**
sitemap, robots, JSON-LD, OG görseli, Lighthouse ≥ 95, Vercel deploy.

Her aşama sonunda: `npm run build` hatasız + mobil (375px) ve masaüstü kontrol.
