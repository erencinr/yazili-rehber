import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UlkeGeneliKutusu } from "@/components/UlkeGeneliKutusu";
import { Breadcrumb, Card, Container, FaqAccordion, H2, PageHero, ResponsiveTable } from "@/components/ui";
import { site } from "@/config/site";
import { baslikYap, konuSorulari, senaryoKonuPuanlari, senaryoSoruSayisi } from "@/lib/data";
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
    title: `${r.n}. Sınıf ${r.ders.ad} ${baslikYap(r.yazili.ad)} Soruları ve Senaryoları ${site.egitimYili}`,
    description: `${r.n}. sınıf ${r.ders.ad} ${r.yazili.ad} ${r.yazili.senaryolar.length} senaryonun resmî soru dağılımı ve çözülebilir kâğıtlar: örnek cevaplar ve puanlama ölçütleri.`,
    alternates: { canonical: r.taban },
  };
}

const adimlar = [
  { baslik: "Kâğıdı seç", metin: "Aşağıdaki tablodan bir senaryo seç. Her kâğıt 100 puandır." },
  { baslik: "Süre tutarak çöz", metin: "Sınava başla; cevaplarını istersen kutulara yaz." },
  { baslik: "Kendini puanla", metin: "Örnek cevap ve ölçütlere bak, karşıladıklarını işaretle." },
];

export default async function YaziliPage({ params }: PageProps<"/dersler/[ders]/[sinif]/[yazili]">) {
  const r = await yaziliCozumle(params);
  if (!r) notFound();
  const { ders, yazili, n, taban, kirintilar } = r;
  const hazirSayisi = yazili.senaryolar.filter((s) => s.hazir).length;

  return (
    <>
      <Breadcrumb items={kirintilar} />
      <PageHero eyebrow={`${n}. sınıf ${ders.ad}`} baslik={`${n}. Sınıf ${ders.ad} ${baslikYap(yazili.ad)} Soruları`}>
        <p className="text-lg text-ink/80">
          {yazili.ulkeGeneli
            ? "Bu yazılı ülke geneli ortak sınav olarak yapılacak."
            : `${yazili.senaryolar.length} senaryo, ${yazili.konular.length} konu.`}{" "}
          {yazili.ulkeGeneli
            ? ""
            : hazirSayisi > 0
              ? `${hazirSayisi} senaryonun kâğıdı çözülebilir; çöz, ardından puanlama ölçütleriyle kendini puanla.`
              : "Kâğıtlar hazırlanıyor; aşağıda resmî soru dağılımını görebilirsin."}
        </p>
        {yazili.tarihAraligi && <p className="text-sm text-muted">Tarih aralığı: {yazili.tarihAraligi}</p>}
      </PageHero>
      <Container className="space-y-14 py-12">
        {yazili.ulkeGeneli ? (
          <UlkeGeneliKutusu duyuru={yazili.duyuru} />
        ) : (
          <>
            <section className="space-y-5">
              <H2>Nasıl çalışır?</H2>
              <ol className="grid gap-4 sm:grid-cols-3">
                {adimlar.map((a, i) => (
                  <li key={a.baslik}>
                    <Card className="h-full">
                      <span className="grid size-9 place-items-center rounded-full bg-navy-tint font-semibold text-navy">
                        {i + 1}
                      </span>
                      <h3 className="mt-3 font-serif text-lg">{a.baslik}</h3>
                      <p className="mt-1 text-sm text-ink/80">{a.metin}</p>
                    </Card>
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-5">
              <H2>Senaryolar neyi soruyor?</H2>
              <ResponsiveTable>
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-navy-tint text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Senaryo</th>
                      <th className="px-4 py-3 font-semibold">Konular</th>
                      <th className="px-4 py-3 font-semibold">Soru</th>
                      <th className="px-4 py-3 font-semibold">Kâğıt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {yazili.senaryolar.map((s) => (
                      <tr key={s.no}>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">Senaryo {s.no}</td>
                        <td className="px-4 py-3">
                          {s.hazir
                            ? senaryoKonuPuanlari(yazili, s.no)
                                .map((k) => `${k.konu.kisaAd} (${k.puan} puan)`)
                                .join(" · ")
                            : yazili.konular
                                .filter((k) => (s.dagilim[k.ciktiId] ?? 0) > 0)
                                .map((k) => `${k.kisaAd} (${s.dagilim[k.ciktiId]} soru)`)
                                .join(" · ")}
                        </td>
                        <td className="px-4 py-3 tabular-nums">{senaryoSoruSayisi(s)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {s.hazir ? (
                            <Link
                              href={`${taban}senaryo-${s.no}/`}
                              className="font-semibold text-navy hover:underline"
                            >
                              Çöz →
                            </Link>
                          ) : (
                            <span className="text-muted">Hazırlanıyor</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ResponsiveTable>
              <p className="text-sm text-muted">
                Soru sayıları ve öğrenme çıktıları: {yazili.kaynak.ad}
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

            <section className="space-y-5">
              <H2>Konuya göre çalış</H2>
              <div className="grid gap-4 sm:grid-cols-3">
                {yazili.konular.map((k) => {
                  const adet = konuSorulari(yazili, k.slug).length;
                  const icerik = (
                    <>
                      <p className="text-xs font-semibold text-navy">{k.ciktiId}</p>
                      <p className="mt-1 font-serif text-lg group-hover:text-navy">{k.ad}</p>
                      <p className="mt-1 text-sm text-muted">
                        {adet > 0 ? `${adet} soru · tüm senaryolardan` : "Sorular hazırlanıyor"}
                      </p>
                    </>
                  );
                  return adet > 0 ? (
                    <Link
                      key={k.slug}
                      href={`${taban}${k.slug}/`}
                      className="group rounded-[22px] border border-line bg-white p-5 shadow-sm hover:border-navy/40"
                    >
                      {icerik}
                    </Link>
                  ) : (
                    <div key={k.slug} className="rounded-[22px] border border-line bg-white/60 p-5">
                      {icerik}
                    </div>
                  );
                })}
              </div>
            </section>

            <FaqAccordion
              items={[
                {
                  soru: `${n}. sınıf ${ders.ad} ${yazili.ad}sında kaç soru var?`,
                  cevap: `Resmî tabloya göre: ${yazili.senaryolar.map((s) => `Senaryo ${s.no}'de ${senaryoSoruSayisi(s)}`).join(", ")} soru.`,
                },
                {
                  soru: "Bu sorular gerçek sınav soruları mı?",
                  cevap:
                    "Hayır. Soru sayıları ve öğrenme çıktıları resmî tabloya uygundur, ancak sorular çalışma amaçlı özgün sorulardır.",
                },
                { soru: "Kâğıt kaç puan?", cevap: "Her senaryo 100 puandır. Alt maddelerin puanı kâğıtta yazar." },
                {
                  soru: "Hangi senaryoya çalışmalıyım?",
                  cevap:
                    "Hepsine. Senaryolar aynı çıktıları farklı sorularla ölçer; hepsini çözmek konuyu sağlamlaştırır.",
                },
                {
                  soru: "Puanım kaydediliyor mu?",
                  cevap: "Evet, yalnızca kendi tarayıcında. Hesabım sayfasında tüm çözdüğün kâğıtları görebilirsin.",
                },
              ]}
            />
          </>
        )}
      </Container>
    </>
  );
}
