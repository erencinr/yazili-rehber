import type { Metadata } from "next";
import { Breadcrumb, Container, FaqAccordion, H2, PageHero, ResponsiveTable } from "@/components/ui";
import { site } from "@/config/site";
import { getTakvim } from "@/lib/data";

export const metadata: Metadata = {
  title: `Ortak yazılı takvimi ${site.egitimYili}`,
  description: "Okul geneli ve ülke geneli ortak yazılı sınav tarihleri, dönem ve sınıf bazında.",
  alternates: { canonical: "/ortak-yazili-takvimi/" },
};

export default function TakvimPage() {
  const takvim = getTakvim();
  return (
    <>
      <Breadcrumb items={[{ ad: "Takvim", href: "/ortak-yazili-takvimi/" }]} />
      <PageHero eyebrow="Takvim" baslik={`Ortak yazılı takvimi ${site.egitimYili}`}>
        <p className="text-lg text-ink/80">Yazılıların hangi tarih aralığında yapılacağını dönem ve sınıf bazında gör.</p>
        <p className="text-sm text-muted">Tarihler örnektir; resmî takvim açıklandığında güncellenecek.</p>
      </PageHero>
      <Container className="space-y-14 py-12">
        <section className="space-y-4">
          <H2>Okul geneli yazılı tarihleri</H2>
          <ResponsiveTable>
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-forest-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Dönem</th>
                  <th className="px-4 py-3 font-semibold">Yazılı</th>
                  <th className="px-4 py-3 font-semibold">Başlangıç</th>
                  <th className="px-4 py-3 font-semibold">Bitiş</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {takvim.okulGeneli.map((t) => (
                  <tr key={t.donem + t.yazili}>
                    <td className="px-4 py-3">{t.donem}</td>
                    <td className="px-4 py-3">{t.yazili}</td>
                    <td className="px-4 py-3">{t.baslangic}</td>
                    <td className="px-4 py-3">{t.bitis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTable>
        </section>
        <section className="space-y-4">
          <H2>Ülke geneli ortak sınavlar</H2>
          <ResponsiveTable>
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-forest-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sınıf</th>
                  <th className="px-4 py-3 font-semibold">Ders</th>
                  <th className="px-4 py-3 font-semibold">Dönem / yazılı</th>
                  <th className="px-4 py-3 font-semibold">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {takvim.ulkeGeneli.map((t) => (
                  <tr key={`${t.sinif}-${t.ders}-${t.yazili}`}>
                    <td className="px-4 py-3">{t.sinif}. sınıf</td>
                    <td className="px-4 py-3">{t.ders}</td>
                    <td className="px-4 py-3">
                      {t.donem} {t.yazili}
                    </td>
                    <td className="px-4 py-3">{t.tarih}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTable>
        </section>
        <FaqAccordion
          items={takvim.ulkeGeneli.map((t) => ({
            soru: `${t.sinif}. sınıf ${t.ders} ${t.donem} ${t.yazili} ne zaman?`,
            cevap: `Takvimdeki tarih: ${t.tarih}.`,
          }))}
        />
      </Container>
    </>
  );
}
