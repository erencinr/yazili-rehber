import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamShell } from "@/components/exam/ExamShell";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { Breadcrumb, Card, Chip, Container, H2, JsonLd, PageHero } from "@/components/ui";
import { mutlakUrl, site } from "@/config/site";
import { SINAV_ONEK } from "@/lib/depo";
import { baslikYap, senaryoKonuPuanlari, tumYazililar } from "@/lib/data";
import { yaziliCozumle } from "@/lib/route";
import type { Yazili } from "@/lib/types";

export function generateStaticParams() {
  return tumYazililar().flatMap(({ ders, sinif, yazili }) => {
    const ortak = { ders: ders.slug, sinif: sinif.slug, yazili: yazili.slug };
    return [
      ...yazili.senaryolar.map((s) => ({ ...ortak, slug: `senaryo-${s.no}` })),
      ...yazili.konular.map((k) => ({ ...ortak, slug: k.slug })),
    ];
  });
}

type Params = PageProps<"/dersler/[ders]/[sinif]/[yazili]/[slug]">["params"];

async function cozumle(params: Params) {
  const r = await yaziliCozumle(params);
  if (!r) return null;
  const { slug } = await params;
  const eslesme = /^senaryo-(\d+)$/.exec(slug);
  if (eslesme) {
    const senaryo = r.yazili.senaryolar.find((s) => s.no === Number(eslesme[1]));
    return senaryo ? { ...r, tur: "senaryo" as const, senaryo } : null;
  }
  const konu = r.yazili.konular.find((k) => k.slug === slug);
  return konu ? { ...r, tur: "konu" as const, konu } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const r = await cozumle(params);
  if (!r) return {};
  const onEk = `${r.n}. Sınıf ${r.ders.ad} ${baslikYap(r.yazili.ad)}`;
  if (r.tur === "senaryo") {
    return {
      title: `${onEk} Senaryo ${r.senaryo.no} Soruları ve Cevapları`,
      description: `${r.senaryo.sorular.length} soru, ${r.senaryo.sureDk} dakika, 100 puan. Kâğıdı çöz, örnek cevaplar ve puanlama ölçütleriyle kendini puanla.`,
      alternates: { canonical: `${r.taban}senaryo-${r.senaryo.no}/` },
    };
  }
  return {
    title: `${onEk}: ${r.konu.ad} Soruları`,
    description: `${r.n}. sınıf ${r.ders.ad} ${r.yazili.ad} ${r.konu.ad} konusundaki tüm senaryo soruları, örnek cevaplar ve puanlama ölçütleri.`,
    alternates: { canonical: `${r.taban}${r.konu.slug}/` },
  };
}

export default async function SlugPage({ params }: { params: Params }) {
  const r = await cozumle(params);
  if (!r) notFound();
  return r.tur === "senaryo" ? <SenaryoKagidi r={r} /> : <KonuSayfasi r={r} />;
}

type Cozulmus = NonNullable<Awaited<ReturnType<typeof cozumle>>>;

function DigerSenaryolar({ yazili, taban, haric }: { yazili: Yazili; taban: string; haric?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {yazili.senaryolar.map((s) => (
        <Chip key={s.no} href={`${taban}senaryo-${s.no}/`} active={s.no === haric}>
          Senaryo {s.no}
        </Chip>
      ))}
    </div>
  );
}

function SenaryoKagidi({ r }: { r: Extract<Cozulmus, { tur: "senaryo" }> }) {
  const { ders, sinif, yazili, senaryo, n, taban, kirintilar } = r;
  const yol = `${taban}senaryo-${senaryo.no}/`;
  const baslik = `${n}. Sınıf ${ders.ad} ${baslikYap(yazili.ad)} Senaryo ${senaryo.no}`;
  const konuDagilimi = senaryoKonuPuanlari(yazili, senaryo.no);

  return (
    <>
      <Breadcrumb items={[...kirintilar, { ad: `Senaryo ${senaryo.no}`, href: yol }]} />
      <PageHero eyebrow="Çöz ve kendini puanla" baslik={`${baslik} Soruları`} className="no-print">
        <p className="text-lg text-ink/80">
          Kâğıdı süre tutarak çöz. Bitirince örnek cevaplar ve puanlama ölçütleri açılır; karşıladığın ölçütleri işaretle,
          puanın kendiliğinden hesaplanır.
        </p>
      </PageHero>
      <Container className="space-y-12 py-10">
        <section className="no-print grid gap-4 md:grid-cols-[1fr_1fr]">
          <Card>
            <h2 className="text-[22px]">Bu kâğıtta neler var?</h2>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[
                { e: "Soru", d: senaryo.sorular.length },
                { e: "Süre", d: `${senaryo.sureDk} dk` },
                { e: "Toplam", d: "100 puan" },
              ].map((x) => (
                <div key={x.e} className="rounded-xl bg-paper p-3">
                  <dt className="text-xs text-muted">{x.e}</dt>
                  <dd className="font-serif text-xl font-semibold">{x.d}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 space-y-1 text-sm">
              {konuDagilimi.map((k) => (
                <li key={k.konu.slug} className="flex justify-between border-b border-line py-1.5 last:border-0">
                  <span>{k.konu.ad}</span>
                  <span className="font-semibold text-forest">{k.puan} puan</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-[22px]">Nasıl ilerlenir?</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink/90">
              <li><strong>Sınava başla:</strong> süre başlar, sorular açılır. Cevabını kutulara yazabilirsin.</li>
              <li><strong>Kâğıdı bitir:</strong> örnek cevaplar ve puanlama ölçütleri görünür.</li>
              <li><strong>Kendini puanla:</strong> karşıladığın ölçütleri işaretle, sonucu ve zayıf konunu gör.</li>
            </ol>
          </Card>
        </section>

        <ExamShell
          depoAnahtari={`${SINAV_ONEK}${ders.slug}/${sinif.slug}/${yazili.slug}/senaryo-${senaryo.no}`}
          baslik={baslik}
          url={yol}
          kagitBasligi={`${baslik} · ${site.egitimYili}`}
          senaryo={senaryo}
          konular={yazili.konular}
          konuHrefOnEki={taban}
        />

        <section className="no-print space-y-4">
          <H2>Diğer senaryolar</H2>
          <DigerSenaryolar yazili={yazili} taban={taban} haric={senaryo.no} />
        </section>

        {yazili.not && (
          <Card className="no-print bg-forest-50">
            <h3 className="font-serif text-lg">Bu kâğıt hakkında</h3>
            <p className="mt-1 text-sm text-ink/80">{yazili.not}</p>
          </Card>
        )}
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: baslik,
          url: mutlakUrl(yol),
          inLanguage: "tr",
          educationalLevel: `${n}. sınıf`,
          about: konuDagilimi.map((k) => ({ "@type": "Thing", name: k.konu.ad })),
          timeRequired: `PT${senaryo.sureDk}M`,
          isAccessibleForFree: true,
        }}
      />
    </>
  );
}

function KonuSayfasi({ r }: { r: Extract<Cozulmus, { tur: "konu" }> }) {
  const { ders, yazili, konu, n, taban, kirintilar } = r;
  const sorular = yazili.senaryolar.flatMap((s) =>
    s.sorular.filter((q) => q.konuSlug === konu.slug).map((q) => ({ senaryo: s.no, soru: q })),
  );
  const senaryolar = [...new Set(sorular.map((s) => s.senaryo))];

  return (
    <>
      <Breadcrumb items={[...kirintilar, { ad: konu.ad, href: `${taban}${konu.slug}/` }]} />
      <PageHero eyebrow="Konuya göre çalış" baslik={`${n}. Sınıf ${ders.ad} ${baslikYap(yazili.ad)}: ${konu.ad} Soruları`}>
        <p className="text-lg text-ink/80">
          Bu konudaki {sorular.length} soru, {senaryolar.length} senaryodan toplandı. Her sorunun altında örnek cevap ve
          puanlama ölçütü var.
        </p>
      </PageHero>
      <Container className="space-y-12 py-10">
        <div className="space-y-6">
          {sorular.map(({ senaryo, soru }) => (
            <QuestionCard key={`${senaryo}-${soru.no}`} soru={soru} baslikEki={`Senaryo ${senaryo}`} />
          ))}
        </div>
        <section className="space-y-4">
          <H2>Bu konunun geçtiği senaryo kâğıtları</H2>
          <div className="flex flex-wrap gap-2">
            {senaryolar.map((no) => (
              <Chip key={no} href={`${taban}senaryo-${no}/`}>
                Senaryo {no}
              </Chip>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <H2>Diğer konular</H2>
          <div className="flex flex-wrap gap-2">
            {yazili.konular
              .filter((k) => k.slug !== konu.slug)
              .map((k) => (
                <Chip key={k.slug} href={`${taban}${k.slug}/`}>
                  {k.ad}
                </Chip>
              ))}
          </div>
        </section>
      </Container>
    </>
  );
}
