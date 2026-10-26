import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DersChipleri } from "@/components/DersChipleri";
import { Breadcrumb, Container, FaqAccordion, H2, PageHero } from "@/components/ui";
import { site } from "@/config/site";
import { getDers, getDersler, getYazililar, sinifNo } from "@/lib/data";

export function generateStaticParams() {
  return getDersler().map((d) => ({ ders: d.slug }));
}

function sinifListesi(siniflar: { slug: string }[]) {
  const n = siniflar.map((s) => sinifNo(s.slug));
  return n.length > 1 ? `${n.slice(0, -1).join(", ")} ve ${n.at(-1)}` : n.join("");
}

export async function generateMetadata({ params }: PageProps<"/dersler/[ders]">): Promise<Metadata> {
  const ders = getDers((await params).ders);
  if (!ders) return {};
  return {
    title: `${ders.ad} ${sinifListesi(ders.siniflar)}. sınıf yazılı soruları ${site.egitimYili}`,
    description: `OYSS ${ders.ad} dersi için sınıf sınıf senaryo kâğıtları, konu dağılımı ve puanlama ölçütleri.`,
    alternates: { canonical: `/dersler/${ders.slug}/` },
  };
}

export default async function DersPage({ params }: PageProps<"/dersler/[ders]">) {
  const ders = getDers((await params).ders);
  if (!ders) notFound();
  const siniflar = sinifListesi(ders.siniflar);

  return (
    <>
      <Breadcrumb items={[{ ad: "Dersler", href: "/dersler/" }, { ad: ders.ad, href: `/dersler/${ders.slug}/` }]} />
      <PageHero eyebrow={`OYSS ${ders.ad}`} baslik={`${ders.ad}: ${siniflar}. sınıf yazılı senaryoları`}>
        <p className="text-lg text-ink/80">Sınıfını seç, yazılıdaki senaryo kâğıtlarını incele ve çöz.</p>
      </PageHero>
      <Container className="space-y-14 py-12">
        <section className="space-y-5">
          <H2>{ders.ad} sınıfa göre</H2>
          <div className="grid gap-4 sm:grid-cols-3">
            {ders.siniflar.map((s) => {
              const yazililar = getYazililar(ders.slug, s.slug);
              const senaryoSayisi = yazililar.reduce((t, y) => t + y.senaryolar.filter((s) => s.hazir).length, 0);
              return (
                <div key={s.slug} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <Link href={`/dersler/${ders.slug}/${s.slug}/`} className="font-serif text-xl hover:text-forest">
                    {sinifNo(s.slug)}. sınıf {ders.ad}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {senaryoSayisi > 0 ? `${senaryoSayisi} çözülebilir kâğıt` : yazililar.length > 0 ? "Resmî dağılım tablosu var, kâğıtlar hazırlanıyor" : "Kâğıtlar hazırlanıyor"}
                  </p>
                  {yazililar.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm">
                      {yazililar.map((y) => (
                        <li key={y.slug}>
                          <Link href={`/dersler/${ders.slug}/${s.slug}/${y.slug}/`} className="font-medium text-forest hover:underline">
                            {y.ad} soruları →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.not && <p className="mt-2 text-xs text-muted">{s.not}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {ders.uniteler.length > 0 && (
          <section className="space-y-4">
            <H2>{ders.ad} yazılılarında hangi üniteler var?</H2>
            <ol className="list-decimal space-y-1 pl-6 text-ink/90">
              {ders.uniteler.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ol>
          </section>
        )}

        <FaqAccordion
          items={[
            { soru: `${ders.ad} ortak yazılısı hangi sınıflarda yapılıyor?`, cevap: `Bu sitede ${ders.ad} için ${siniflar}. sınıf sayfaları bulunuyor. Kesin kapsam için resmî duyuruları takip edin.` },
            { soru: `${ders.ad} yazılısında kaç puanlık soru var?`, cevap: "Her senaryo kâğıdı toplam 100 puan üzerinden hazırlanır; soruların puanı kâğıt sayfasında yazar." },
            { soru: `${ders.ad} yazılısına nasıl çalışmalıyım?`, cevap: "Önce senaryo kâğıdını süre tutarak çöz, sonra puanlama ölçütleriyle kendini puanla ve en düşük çıkan konuya geri dön." },
          ]}
        />

        <section className="space-y-4">
          <H2>Diğer {ders.kademe === "lise" ? "lise" : "ortaokul"} dersleri</H2>
          <DersChipleri kademe={ders.kademe} haric={ders.slug} />
        </section>
      </Container>
    </>
  );
}
