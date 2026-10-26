import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamShell } from "@/components/exam/ExamShell";
import { KagitAraclari } from "@/components/KagitAraclari";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { Breadcrumb, Card, Chip, Container, H2, JsonLd, PageHero } from "@/components/ui";
import { mutlakUrl, site } from "@/config/site";
import { SINAV_ONEK } from "@/lib/depo";
import { baslikYap, cozulebilirKonular, konuSorulari, senaryoKonuPuanlari, tumYazililar } from "@/lib/data";
import { yaziliCozumle } from "@/lib/route";
import { kagitAdi, kagitAnahtari, SEVIYE_ADI, SEVIYELER, sonrakiKagit, varlik } from "@/lib/kagit";
import type { Yazili } from "@/lib/types";

// Yalnızca generateStaticParams'taki adresler üretilir; diğerleri 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return tumYazililar().flatMap(({ ders, sinif, yazili }) => {
    const ortak = { ders: ders.slug, sinif: sinif.slug, yazili: yazili.slug };
    return [
      ...yazili.kagitlar.map((k) => ({ ...ortak, slug: k.slug })),
      ...yazili.senaryolar.filter((s) => s.hazir).map((s) => ({ ...ortak, slug: `senaryo-${s.no}` })),
      ...cozulebilirKonular(yazili).map((k) => ({ ...ortak, slug: k.slug })),
    ];
  });
}

type Params = PageProps<"/dersler/[ders]/[sinif]/[yazili]/[slug]">["params"];

async function cozumle(params: Params) {
  const r = await yaziliCozumle(params);
  if (!r) return null;
  const { slug } = await params;
  const kagit = r.yazili.kagitlar.find((k) => k.slug === slug);
  if (kagit) return { ...r, tur: "kagit" as const, kagit };
  const eslesme = /^senaryo-(\d+)$/.exec(slug);
  if (eslesme) {
    const senaryo = r.yazili.senaryolar.find((s) => s.no === Number(eslesme[1]) && s.hazir);
    return senaryo ? { ...r, tur: "senaryo" as const, senaryo } : null;
  }
  const konu = cozulebilirKonular(r.yazili).find((k) => k.slug === slug);
  return konu ? { ...r, tur: "konu" as const, konu } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const r = await cozumle(params);
  if (!r) return {};
  const onEk = `${r.n}. Sınıf ${r.ders.ad} ${baslikYap(r.yazili.ad)}`;
  if (r.tur === "kagit") {
    return {
      title: `${onEk} ${kagitAdi(r.kagit)} Soruları`,
      description: `${r.n}. sınıf matematik ${r.yazili.ad} için ${kagitAdi(r.kagit)} kâğıdı: ${r.kagit.sorular.length} açık uçlu soru, 40 dakika, 100 puan. Ekranda çöz veya yazdır.`,
      alternates: { canonical: `${r.taban}${r.kagit.slug}/` },
    };
  }
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
  if (r.tur === "kagit") return <AtomicaKagidi r={r} />;
  return r.tur === "senaryo" ? <SenaryoKagidi r={r} /> : <KonuSayfasi r={r} />;
}

type Cozulmus = NonNullable<Awaited<ReturnType<typeof cozumle>>>;

function DigerSenaryolar({ yazili, taban, haric }: { yazili: Yazili; taban: string; haric?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {yazili.senaryolar.filter((s) => s.hazir).map((s) => (
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
                <div key={x.e} className="rounded-xl bg-soft p-3">
                  <dt className="text-xs text-muted">{x.e}</dt>
                  <dd className="font-serif text-xl font-semibold">{x.d}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 space-y-1 text-sm">
              {konuDagilimi.map((k) => (
                <li key={k.konu.slug} className="flex justify-between border-b border-line py-1.5 last:border-0">
                  <span>{k.konu.ad}</span>
                  <span className="font-semibold text-navy">{k.puan} puan</span>
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

        <Card className="no-print bg-navy-tint">
          <h3 className="font-serif text-lg">Bu kâğıt hakkında</h3>
          <p className="mt-1 text-sm text-ink/80">
            Soru sayıları ve öğrenme çıktıları {yazili.kaynak.ad} içindeki Senaryo {senaryo.no} sütununa göredir. Sorular
            özgün çalışma sorularıdır, resmî sınav sorusu değildir.
          </p>
          {yazili.not && <p className="mt-2 text-sm text-ink/80">{yazili.not}</p>}
        </Card>
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
  const sorular = konuSorulari(yazili, konu.slug);
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
            {cozulebilirKonular(yazili)
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

function AtomicaKagidi({ r }: { r: Extract<Cozulmus, { tur: "kagit" }> }) {
  const { yazili, kagit, n, taban, kirintilar } = r;
  const yol = `${taban}${kagit.slug}/`;
  const baslik = `${n}. Sınıf Matematik ${baslikYap(yazili.ad)} · ${kagitAdi(kagit)}`;
  const ayniNo = yazili.kagitlar.filter((k) => k.no === kagit.no || (kagit.tur === "prova" && k.seviye === kagit.seviye));
  const sonraki = sonrakiKagit(yazili, kagit);
  const chip = (aktif: boolean) =>
    `rounded-full px-4 py-2 text-sm font-extrabold ${aktif ? "bg-navy text-white" : "bg-white text-ink-soft shadow-[inset_0_0_0_1px_var(--color-line)] hover:text-navy"}`;

  return (
    <>
      <Breadcrumb items={[...kirintilar, { ad: kagitAdi(kagit), href: yol }]} />
      <Container className="space-y-6 py-8">
        <div className="no-print space-y-3">
          <h1 className="text-[28px] sm:text-[36px]">{baslik}</h1>
          <p className="text-ink-soft">
            {kagit.sorular.length} soru · 40 dakika · 100 puan · Cevaplarını kâğıda veya defterine yaz.
          </p>
          <nav aria-label="Seviye ve kâğıt seçimi" className="flex flex-wrap gap-2">
            {kagit.tur === "senaryo"
              ? SEVIYELER.map((sv) => {
                  const k = ayniNo.find((x) => x.seviye === sv);
                  return k ? (
                    <Link key={sv} href={`${taban}${k.slug}/`} className={chip(k.slug === kagit.slug)}>
                      {SEVIYE_ADI[sv]}
                    </Link>
                  ) : null;
                })
              : ayniNo.map((k) => (
                  <Link key={k.slug} href={`${taban}${k.slug}/`} className={chip(k.slug === kagit.slug)}>
                    Prova {k.no}
                  </Link>
                ))}
          </nav>
        </div>

        <KagitAraclari kagit={kagitAnahtari(taban, kagit.slug)} />

        <div className="mx-auto max-w-[860px] space-y-6">
          {kagit.sayfalar.map((s, i) => (
            <figure key={s.src} className="kagit-sayfa overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_14px_40px_-16px_rgb(19_26_51/0.22)]">
              {/* Sayfa görseli Atomica kitapçığından; çizim ve şekiller için görsel olarak gösterilir. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={varlik(s.src)}
                width={s.genislik}
                height={s.yukseklik}
                alt={`${baslik}, sayfa ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-auto w-full"
              />
              <figcaption className="sr-only">{s.metin}</figcaption>
            </figure>
          ))}
        </div>

        <div className="no-print mx-auto flex max-w-[860px] flex-wrap items-center justify-between gap-3 rounded-[18px] bg-soft p-5">
          <p className="text-sm text-ink-soft">Bu kâğıdın cevap anahtarı henüz eklenmedi; cevaplarını öğretmeninle kontrol edebilirsin.</p>
          {sonraki ? (
            <Link href={`${taban}${sonraki.slug}/`} className="rounded-full bg-navy px-5 py-2.5 text-sm font-extrabold text-white hover:bg-navy-2">
              Sıradaki: {kagitAdi(sonraki)} →
            </Link>
          ) : (
            <Link href={taban} className="rounded-full bg-navy px-5 py-2.5 text-sm font-extrabold text-white hover:bg-navy-2">
              Tüm kâğıtlar →
            </Link>
          )}
        </div>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: baslik,
          url: mutlakUrl(yol),
          inLanguage: "tr",
          educationalLevel: `${n}. sınıf`,
          timeRequired: "PT40M",
          isAccessibleForFree: true,
          provider: { "@type": "Organization", name: "Atomica", url: site.atomica.anaSayfa },
        }}
      />
    </>
  );
}
