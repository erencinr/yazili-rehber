import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Card, Container, FaqAccordion, H2, PageHero, ResponsiveTable } from "@/components/ui";
import { site } from "@/config/site";
import { baslikYap, senaryoKonuPuanlari } from "@/lib/data";
import { yaziliCozumle, yaziliParams } from "@/lib/route";

export function generateStaticParams() {
  return yaziliParams();
}

export async function generateMetadata({ params }: PageProps<"/dersler/[ders]/[sinif]/[yazili]">): Promise<Metadata> {
  const r = await yaziliCozumle(params);
  if (!r) return {};
  return {
    title: `${r.n}. Sınıf ${r.ders.ad} ${baslikYap(r.yazili.ad)} Soruları ve Senaryoları ${site.egitimYili}`,
    description: `${r.n}. sınıf ${r.ders.ad} ${r.yazili.ad} için ${r.yazili.senaryolar.length} senaryo kâğıdı: çöz, örnek cevaplara bak, puanlama ölçütleriyle kendini puanla.`,
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

  return (
    <>
      <Breadcrumb items={kirintilar} />
      <PageHero eyebrow={`${n}. sınıf ${ders.ad}`} baslik={`${n}. Sınıf ${ders.ad} ${baslikYap(yazili.ad)} Soruları`}>
        <p className="text-lg text-ink/80">
          {yazili.senaryolar.length} senaryo kâğıdı, {yazili.konular.length} konu. Kâğıdı çöz, ardından puanlama
          ölçütleriyle kendini puanla.
        </p>
        {yazili.tarihAraligi && <p className="text-sm text-muted">Tarih aralığı: {yazili.tarihAraligi}</p>}
      </PageHero>
      <Container className="space-y-14 py-12">
        <section className="space-y-5">
          <H2>Nasıl çalışır?</H2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {adimlar.map((a, i) => (
              <li key={a.baslik}>
                <Card className="h-full">
                  <span className="grid size-9 place-items-center rounded-full bg-forest-50 font-semibold text-forest">{i + 1}</span>
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
              <thead className="bg-forest-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Senaryo</th>
                  <th className="px-4 py-3 font-semibold">Konular</th>
                  <th className="px-4 py-3 font-semibold">Soru</th>
                  <th className="px-4 py-3 font-semibold">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {yazili.senaryolar.map((s) => (
                  <tr key={s.no}>
                    <td className="px-4 py-3">
                      <Link href={`${taban}senaryo-${s.no}/`} className="font-semibold whitespace-nowrap text-forest hover:underline">
                        Senaryo {s.no} →
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {senaryoKonuPuanlari(yazili, s.no)
                        .map((k) => `${k.konu.kisaAd} (${k.puan})`)
                        .join(" · ")}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{s.sorular.length}</td>
                    <td className="px-4 py-3 tabular-nums">100 puan</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTable>
        </section>

        <section className="space-y-5">
          <H2>Konuya göre çalış</H2>
          <div className="grid gap-4 sm:grid-cols-3">
            {yazili.konular.map((k) => {
              const adet = yazili.senaryolar.flatMap((s) => s.sorular).filter((q) => q.konuSlug === k.slug).length;
              return (
                <Link key={k.slug} href={`${taban}${k.slug}/`} className="group rounded-2xl border border-line bg-white p-5 shadow-sm hover:border-forest/40">
                  <p className="font-serif text-lg group-hover:text-forest">{k.ad}</p>
                  <p className="mt-1 text-sm text-muted">{adet} soru · tüm senaryolardan</p>
                </Link>
              );
            })}
          </div>
        </section>

        <FaqAccordion
          items={[
            { soru: `${n}. sınıf ${ders.ad} ${yazili.ad}sında kaç soru var?`, cevap: yazili.senaryolar.map((s) => `Senaryo ${s.no}: ${s.sorular.length} soru`).join(", ") + "." },
            { soru: "Soruları öğretmen mi yazıyor?", cevap: "Bu sitedeki kâğıtlar çalışma amaçlı özgün kâğıtlardır. Sınavdaki soruların nasıl hazırlandığını rehber sayfalarında anlatıyoruz." },
            { soru: "Kâğıt kaç puan?", cevap: "Her senaryo 100 puandır. Alt maddelerin puanı kâğıtta yazar." },
            { soru: "Hangi senaryoya çalışmalıyım?", cevap: "Hepsine. Senaryolar aynı çıktıları farklı sorularla ölçer; hepsini çözmek konuyu sağlamlaştırır." },
            { soru: "Puanım kaydediliyor mu?", cevap: "Evet, yalnızca kendi tarayıcında. Hesabım sayfasında tüm çözdüğün kâğıtları görebilirsin." },
          ]}
        />
      </Container>
    </>
  );
}
