import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KagitIzgarasi } from "@/components/KagitIzgarasi";
import { ScenarioTable } from "@/components/ScenarioTable";
import { UlkeGeneliKutusu } from "@/components/UlkeGeneliKutusu";
import { Breadcrumb, Card, Container, FaqAccordion, H2, PageHero } from "@/components/ui";
import { site } from "@/config/site";
import { baslikYap } from "@/lib/data";
import { baslangicOnerisi } from "@/lib/kagit";
import { yaziliCozumle, yaziliParams } from "@/lib/route";

// Yalnızca generateStaticParams'taki adresler üretilir; diğerleri 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return yaziliParams();
}

export async function generateMetadata({ params }: PageProps<"/dersler/[ders]/[sinif]/[yazili]">): Promise<Metadata> {
  const r = await yaziliCozumle(params);
  if (!r) return {};
  return {
    title: `${r.n}. Sınıf ${r.ders.ad} ${baslikYap(r.yazili.ad)} Soruları ${site.egitimYili}`,
    description: `${r.n}. sınıf ${r.ders.ad.toLocaleLowerCase("tr")} ${r.yazili.ad} kâğıtları: MEB senaryolarına uygun, kolay, orta ve zor seviyede. Ekranda çöz veya yazdır.`,
    alternates: { canonical: r.taban },
  };
}

export default async function YaziliPage({ params }: PageProps<"/dersler/[ders]/[sinif]/[yazili]">) {
  const r = await yaziliCozumle(params);
  if (!r) notFound();
  const { ders, yazili, n, taban, kirintilar } = r;
  const rubrikliSenaryolar = yazili.senaryolar.filter((s) => s.hazir);

  return (
    <>
      <Breadcrumb items={kirintilar} />
      <PageHero eyebrow={`${n}. sınıf ${ders.ad.toLocaleLowerCase("tr")}`} baslik={`${n}. Sınıf ${ders.ad} ${baslikYap(yazili.ad)} Soruları`}>
        <p className="text-lg text-ink-soft">
          {yazili.ciktilar[0] ? `Konu: ${yazili.ciktilar[0].unite}. ` : ""}
          {baslangicOnerisi(yazili)}
        </p>
      </PageHero>
      <Container className="space-y-12 py-10">
        <section className="space-y-4">
          {yazili.ulkeGeneli && <UlkeGeneliKutusu duyuru={yazili.duyuru} kagitVar={yazili.kagitlar.length > 0} />}
          {yazili.kagitlar.length > 0 ? (
            <KagitIzgarasi yazili={yazili} taban={taban} />
          ) : rubrikliSenaryolar.length === 0 ? (
            <Card className="bg-soft">
              <p className="font-extrabold text-navy">Kâğıtlar hazırlanıyor</p>
              <p className="mt-1 text-sm text-ink-soft">
                Bu yazılının kâğıtları yakında burada olacak.{" "}
                <Link href="/ortak-yazili-takvimi/" className="font-semibold text-turq hover:underline">
                  Sınav tarihini gör →
                </Link>
              </p>
            </Card>
          ) : null}
          {rubrikliSenaryolar.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {rubrikliSenaryolar.map((s) => (
                <Link
                  key={s.no}
                  href={`${taban}senaryo-${s.no}/`}
                  className="rounded-full bg-navy px-4 py-2 text-sm font-extrabold text-white hover:bg-navy-2"
                >
                  Senaryo {s.no} · çöz ve puanla
                </Link>
              ))}
            </div>
          )}
        </section>

        {!yazili.ulkeGeneli && yazili.senaryolar.length > 0 && (
          <section className="space-y-4">
            <H2>Senaryolarda hangi konudan kaç soru var?</H2>
            <ScenarioTable ciktilar={yazili.ciktilar} senaryolar={yazili.senaryolar} hrefOnEk={taban} />
            <p className="text-sm text-muted">
              Satırlar öğrenme çıktıları, sütunlar senaryolardır; hücredeki sayı o çıktıdan kaç soru geleceğini gösterir.
              Kaynak: {yazili.kaynak.ad}
              {yazili.kaynak.url && (
                <>
                  {" "}
                  (
                  <a href={yazili.kaynak.url} className="underline hover:text-navy" rel="noopener noreferrer">
                    resmî dosya
                  </a>
                  )
                </>
              )}
              .
            </p>
          </section>
        )}

        <FaqAccordion
          items={[
            {
              soru: `${n}. sınıf ${ders.ad.toLocaleLowerCase("tr")} ${yazili.ad} kaç dakika?`,
              cevap: "Okul geneli ortak yazılılarda süre 40 dakikadır; kâğıt toplam 100 puandır.",
            },
            {
              soru: "Kolay, orta ve zor kâğıt arasındaki fark ne?",
              cevap: "Üç kâğıt da aynı senaryonun öğrenme çıktılarını ölçer; soruların güçlüğü artar. Kolaydan başlayıp zora doğru ilerlemen önerilir.",
            },
            {
              soru: "Sınavda hangi senaryo çıkacak?",
              cevap: "Senaryoyu okulundaki matematik öğretmenleri seçer ve sınavdan önce duyurur. Öğretmenine sorabilirsin.",
            },
          ]}
        />
      </Container>
    </>
  );
}
