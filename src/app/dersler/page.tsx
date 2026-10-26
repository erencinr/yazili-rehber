import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Container, CtaStrip, FaqAccordion, H2, PageHero } from "@/components/ui";
import { site } from "@/config/site";
import { getDersler, getYazililar, sinifNo } from "@/lib/data";

export const metadata: Metadata = {
  title: `OYSS dersleri: Ortaokul ve lise yazılı soruları ${site.egitimYili}`,
  description: "Ortak yazılı sınava giren tüm dersler. Sınıfını seç, senaryo kâğıtlarını çöz ve kendini puanla.",
  alternates: { canonical: "/dersler/" },
};

export default function DerslerPage() {
  const dersler = getDersler();
  const gruplar = [
    { kademe: "ortaokul", baslik: "Ortaokul dersleri (5, 6, 7. sınıf)" },
    { kademe: "lise", baslik: "Lise dersleri (9, 10, 11. sınıf)" },
  ] as const;

  return (
    <>
      <Breadcrumb items={[{ ad: "Dersler", href: "/dersler/" }]} />
      <PageHero eyebrow="Dersler" baslik="OYSS dersleri ve yazılı soruları">
        <p className="text-lg text-ink/80">Dersini ve sınıfını seç; senaryo kâğıtlarını çözüp kendini puanla.</p>
      </PageHero>
      <Container className="space-y-14 py-12">
        <CtaStrip href="/dersler/tarih/9-sinif/1-yazili-sorulari/">Örnek kâğıt: 9. sınıf Tarih 1. yazılı</CtaStrip>
        {gruplar.map((g) => (
          <section key={g.kademe} className="space-y-5">
            <H2>{g.baslik}</H2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dersler
                .filter((d) => d.kademe === g.kademe)
                .map((d) => (
                  <div key={d.slug} className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
                    <Link href={`/dersler/${d.slug}/`} className="font-serif text-xl hover:text-navy">
                      OYSS {d.ad}
                    </Link>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {d.siniflar.map((s) => {
                        const hazir = getYazililar(d.slug, s.slug).length > 0;
                        return (
                          <Link
                            key={s.slug}
                            href={`/dersler/${d.slug}/${s.slug}/`}
                            className={`rounded-full border px-3 py-1 text-sm ${
                              hazir ? "border-navy bg-navy-tint font-semibold text-navy" : "border-line text-muted"
                            }`}
                          >
                            {sinifNo(s.slug)}. sınıf
                          </Link>
                        );
                      })}
                    </div>
                    {d.not && <p className="mt-2 text-xs text-muted">{d.not}</p>}
                  </div>
                ))}
            </div>
          </section>
        ))}
        <FaqAccordion
          items={[
            { soru: "Hangi dersler için kâğıt var?", cevap: "Yeşil işaretli sınıflarda çözülebilir kâğıtlar hazır. Diğer dersler sırayla ekleniyor." },
            { soru: "Kâğıtlar gerçek sınav soruları mı?", cevap: "Hayır. Gerçek sınav formatına uygun hazırlanmış özgün çalışma kâğıtlarıdır." },
            { soru: "Puanımı kim hesaplıyor?", cevap: "Sen. Çözdükten sonra örnek cevap ve puanlama ölçütleri açılır, karşıladığın ölçütleri işaretlersin." },
            { soru: "Kâğıdı yazdırabilir miyim?", cevap: "Evet. Her kâğıt ve cevap anahtarı ayrı ayrı yazdırılabilir." },
          ]}
        />
      </Container>
    </>
  );
}
