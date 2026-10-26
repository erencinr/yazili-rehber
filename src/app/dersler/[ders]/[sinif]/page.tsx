import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KagitIzgarasi } from "@/components/KagitIzgarasi";
import { ScenarioTable } from "@/components/ScenarioTable";
import { UlkeGeneliKutusu } from "@/components/UlkeGeneliKutusu";
import { Breadcrumb, Card, Chip, Container, FaqAccordion, H2, PageHero } from "@/components/ui";
import { site } from "@/config/site";
import { baslikYap, getDers, getDersler, getYazililar, sinifNo } from "@/lib/data";
import { baslangicOnerisi } from "@/lib/kagit";
import type { Yazili } from "@/lib/types";

// Yalnızca generateStaticParams'taki adresler üretilir; diğerleri 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getDersler().flatMap((d) => d.siniflar.map((s) => ({ ders: d.slug, sinif: s.slug })));
}

async function cozumle(params: PageProps<"/dersler/[ders]/[sinif]">["params"]) {
  const p = await params;
  const ders = getDers(p.ders);
  const sinif = ders?.siniflar.find((s) => s.slug === p.sinif);
  return ders && sinif ? { ders, sinif } : null;
}

export async function generateMetadata({ params }: PageProps<"/dersler/[ders]/[sinif]">): Promise<Metadata> {
  const r = await cozumle(params);
  if (!r) return {};
  const n = sinifNo(r.sinif.slug);
  return {
    title: `${n}. Sınıf ${r.ders.ad} Yazılı Soruları ${site.egitimYili}`,
    description: `${n}. sınıf ${r.ders.ad.toLocaleLowerCase("tr")} yazılı sınav kâğıtları: MEB senaryolarına uygun, kolay, orta ve zor seviyede. Ekranda çöz veya yazdır.`,
    alternates: { canonical: `/dersler/${r.ders.slug}/${r.sinif.slug}/` },
  };
}

function DagilimTablosu({ yazili, taban }: { yazili: Yazili; taban: string }) {
  if (yazili.ulkeGeneli || yazili.senaryolar.length === 0) return null;
  return (
    <details className="group rounded-[18px] border border-line bg-white">
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink-soft">
        Resmî soru dağılımını gör (MEB konu-soru dağılım tablosu)
        <span className="faq-isaret text-lg text-navy" aria-hidden />
      </summary>
      <div className="space-y-2 px-5 pb-5">
        <ScenarioTable ciktilar={yazili.ciktilar} senaryolar={yazili.senaryolar} hrefOnEk={taban} />
        <p className="text-xs text-muted">Kaynak: {yazili.kaynak.ad}.</p>
      </div>
    </details>
  );
}

export default async function SinifPage({ params }: PageProps<"/dersler/[ders]/[sinif]">) {
  const r = await cozumle(params);
  if (!r) notFound();
  const { ders, sinif } = r;
  const n = sinifNo(sinif.slug);
  const dersAdi = ders.ad.toLocaleLowerCase("tr");
  const yazililar = getYazililar(ders.slug, sinif.slug);
  const taban = `/dersler/${ders.slug}/${sinif.slug}/`;
  const digerSiniflar = ders.siniflar.filter((s) => s.slug !== sinif.slug);

  return (
    <>
      <Breadcrumb items={[{ ad: `${n}. sınıf ${dersAdi}`, href: taban }]} />
      <PageHero eyebrow={`${n}. sınıf ${dersAdi}`} baslik={`${n}. Sınıf ${ders.ad} Yazılı Soruları`}>
        <p className="text-lg text-ink-soft">{baslangicOnerisi(yazililar.find((y) => y.kagitlar.length > 0))}</p>
        {sinif.not && <p className="rounded-xl bg-white/70 p-3 text-sm text-ink-soft">{sinif.not}</p>}
      </PageHero>

      <Container className="space-y-12 py-10">
        {yazililar.map((y) => {
          const yTaban = `${taban}${y.slug}/`;
          return (
            <section key={y.slug} className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <H2 id={y.slug}>{baslikYap(y.ad)}</H2>
                {y.ciktilar[0] && <p className="text-sm text-muted">Konu: {y.ciktilar[0].unite}</p>}
              </div>
              {y.ulkeGeneli && <UlkeGeneliKutusu duyuru={y.duyuru} kagitVar={y.kagitlar.length > 0} />}
              {y.kagitlar.length > 0 ? (
                <KagitIzgarasi yazili={y} taban={yTaban} />
              ) : (
                <Card className="bg-soft">
                  <p className="font-extrabold text-navy">Kâğıtlar hazırlanıyor</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Bu yazılının kâğıtları yakında burada olacak. Sınav tarihini{" "}
                    <Link href="/ortak-yazili-takvimi/" className="font-semibold text-turq hover:underline">
                      takvimde
                    </Link>{" "}
                    görebilirsin.
                  </p>
                </Card>
              )}
              <DagilimTablosu yazili={y} taban={yTaban} />
            </section>
          );
        })}

        <FaqAccordion
          items={[
            {
              soru: "Hangi kâğıdı çözmeliyim?",
              cevap:
                "Okulunun seçtiği senaryoyu öğretmenine sor ve o senaryonun kâğıtlarını çöz. Bilmiyorsan Senaryo 1 · Kolay ile başla; her senaryoda kolay, orta ve zor olmak üzere üç kâğıt var.",
            },
            {
              soru: "Kâğıtlar gerçek sınava benziyor mu?",
              cevap:
                "Evet. Kâğıtlar MEB'in yayımladığı senaryolardaki öğrenme çıktılarına ve soru sayılarına uygun hazırlandı; süre 40 dakika, toplam 100 puan.",
            },
            {
              soru: "Kâğıdı yazdırabilir miyim?",
              cevap:
                "Evet. Kâğıt sayfasındaki “Kâğıdı yazdır” düğmesiyle yazdırabilir ya da tüm kitapçığı PDF olarak indirebilirsin.",
            },
          ]}
        />

        {digerSiniflar.length > 0 && (
          <section className="space-y-4">
            <H2>Diğer sınıflar</H2>
            <div className="flex flex-wrap gap-2">
              {digerSiniflar.map((s) => (
                <Chip key={s.slug} href={`/dersler/${ders.slug}/${s.slug}/`}>
                  {sinifNo(s.slug)}. sınıf {dersAdi}
                </Chip>
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
