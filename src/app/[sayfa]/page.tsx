import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudienceCards, Breadcrumb, Container, FaqAccordion, GlanceBox, H2, JsonLd, NextLinks, PageHero, tarihYaz } from "@/components/ui";
import { mutlakUrl, site } from "@/config/site";
import { getSayfa, sayfalar } from "@/content/sayfalar";
import { KaynakListesi } from "@/components/KaynakListesi";

// Yalnızca generateStaticParams'taki adresler üretilir; diğerleri 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return sayfalar.map((s) => ({ sayfa: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[sayfa]">): Promise<Metadata> {
  const s = getSayfa((await params).sayfa);
  if (!s) return {};
  return { title: s.baslik, description: s.aciklama, alternates: { canonical: `/${s.slug}/` } };
}

const sonrakiler = [
  { baslik: "Dersler", aciklama: "Sınıfını seç, kâğıtları çöz.", href: "/dersler/" },
  { baslik: "Takvim", aciklama: "Yazılılar ne zaman?", href: "/ortak-yazili-takvimi/" },
  { baslik: "Sık sorulanlar", aciklama: "En çok merak edilenler.", href: "/oyss-sss/" },
];

export default async function SayfaPage({ params }: PageProps<"/[sayfa]">) {
  const s = getSayfa((await params).sayfa);
  if (!s) notFound();
  const yol = `/${s.slug}/`;

  return (
    <>
      <Breadcrumb items={[{ ad: s.menuAdi, href: yol }]} />
      <PageHero eyebrow={s.eyebrow} baslik={s.baslik} yan={s.bakista && <GlanceBox items={s.bakista} />}>
        <p className="text-lg text-ink/80">{s.ozet}</p>
        <p className="text-sm text-muted">Son güncelleme: {tarihYaz(s.guncelleme)}</p>
      </PageHero>
      <Container className="space-y-16 py-12">
        {s.bolumler.length > 0 && (
          <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
            <article className="max-w-[720px] space-y-10">
              {s.bolumler.map((b) => (
                <section key={b.id} className="space-y-3">
                  <H2 id={b.id}>{b.baslik}</H2>
                  {b.paragraflar.map((p, i) => (
                    <p key={i} className="text-ink/85">
                      {p}
                    </p>
                  ))}
                  {b.liste && (
                    <ul className="list-disc space-y-1.5 pl-6 text-ink/85 marker:text-forest">
                      {b.liste.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>
            <aside className="hidden lg:block">
              <nav aria-label="Bu sayfada" className="sticky top-24 rounded-2xl border border-line bg-white p-5 text-sm shadow-sm">
                <p className="mb-2 font-semibold text-forest">Bu sayfada</p>
                <ul className="space-y-1.5">
                  {s.bolumler.map((b) => (
                    <li key={b.id}>
                      <a href={`#${b.id}`} className="hover:text-forest hover:underline">
                        {b.baslik}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        )}
        {s.sss && <FaqAccordion items={s.sss} />}
        {s.kaynaklar && <KaynakListesi kaynaklar={s.kaynaklar} />}
        {!s.yasal && (
          <>
            <section className="space-y-4">
              <H2>Kim için hangi sayfa?</H2>
              <AudienceCards />
            </section>
            <NextLinks items={sonrakiler.filter((l) => l.href !== yol)} />
          </>
        )}
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: s.baslik,
          description: s.aciklama,
          dateModified: s.guncelleme,
          inLanguage: "tr",
          url: mutlakUrl(yol),
          publisher: { "@type": "Organization", name: site.marka },
        }}
      />
    </>
  );
}
