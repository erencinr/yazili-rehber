import type { Metadata } from "next";
import { KaynakListesi } from "@/components/KaynakListesi";
import { Breadcrumb, Container, FaqAccordion, H2, PageHero, ResponsiveTable } from "@/components/ui";
import { site } from "@/config/site";
import { KAYNAK } from "@/content/sayfalar";
import { getTakvim } from "@/lib/data";

export const metadata: Metadata = {
  title: `Ortak yazılı takvimi ${site.egitimYili}: OYSS ve ülke geneli sınav tarihleri`,
  description: "2026-2027 okul geneli OYSS 1. dönem 1. yazılı tarihleri ve 8 ülke geneli ortak yazılı sınavın tarihleri.",
  alternates: { canonical: "/ortak-yazili-takvimi/" },
};

const th = "px-4 py-3 font-semibold";
const td = "px-4 py-3";

export default function TakvimPage() {
  const takvim = getTakvim();
  const kademeler = [...new Set(takvim.okulGeneli.sinavlar.map((s) => s.kademe))];

  return (
    <>
      <Breadcrumb items={[{ ad: "Takvim", href: "/ortak-yazili-takvimi/" }]} />
      <PageHero eyebrow="Takvim" baslik={`Ortak yazılı takvimi ${site.egitimYili}`}>
        <p className="text-lg text-ink/80">
          Okul geneli OYSS sınavlarının ve ülke geneli ortak yazılıların tarihleri. Tarihler MEB ve ÖDSGM takvimlerinden
          alınmıştır; mücbir sebeple değişirse yeni tarihi il millî eğitim müdürlüğü belirler.
        </p>
      </PageHero>
      <Container className="space-y-14 py-12">
        <section className="space-y-4">
          <H2 id="okul-geneli">Okul geneli: {takvim.okulGeneli.baslik}</H2>
          <div className="grid gap-6 lg:grid-cols-2">
            {kademeler.map((k) => (
              <ResponsiveTable key={k}>
                <table className="w-full text-sm">
                  <thead className="bg-navy-tint text-left">
                    <tr>
                      <th className={th}>{k}</th>
                      <th className={th}>Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {takvim.okulGeneli.sinavlar
                      .filter((s) => s.kademe === k)
                      .map((s) => (
                        <tr key={s.ders}>
                          <td className={td}>{s.ders}</td>
                          <td className={`${td} whitespace-nowrap`}>{s.tarih}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </ResponsiveTable>
            ))}
          </div>
          <p className="text-sm text-muted">{takvim.okulGeneli.not}</p>
          <p className="text-sm text-muted">
            6. sınıf Matematik ve 10. sınıf Türk Dili ve Edebiyatı 1. yazılıları okul geneli değil, ülke geneli olarak
            yapılır (aşağıdaki tabloya bakın). Diğer yazılıların okul geneli takvimi henüz yayımlanmadı.
          </p>
        </section>

        <section className="space-y-4">
          <H2 id="ulke-geneli">Ülke geneli ortak yazılı sınavlar</H2>
          <ResponsiveTable>
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-navy-tint text-left">
                <tr>
                  <th className={th}>Sınıf</th>
                  <th className={th}>Ders</th>
                  <th className={th}>Dönem / yazılı</th>
                  <th className={th}>Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {takvim.ulkeGeneli.map((t) => (
                  <tr key={`${t.sinif}-${t.ders}-${t.donem}-${t.yazili}`}>
                    <td className={td}>{t.sinif}. sınıf</td>
                    <td className={td}>{t.ders}</td>
                    <td className={td}>
                      {t.donem} {t.yazili}
                    </td>
                    <td className={`${td} whitespace-nowrap`}>{t.tarih}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTable>
        </section>

        <FaqAccordion
          items={[
            ...takvim.ulkeGeneli.map((t) => ({
              soru: `${t.sinif}. sınıf ${t.ders} ${t.donem} ${t.yazili} ne zaman?`,
              cevap: `${t.tarih}. Bu sınav ülke geneli ortak yazılı olarak yapılır.`,
            })),
            ...takvim.okulGeneli.sinavlar.map((s) => ({
              soru: `${s.kademe.split(" ")[0]} ${s.ders} 1. dönem 1. yazılı ne zaman?`,
              cevap: `${s.tarih}. Sınav süresi 40 dakikadır.`,
            })),
          ]}
        />
        <KaynakListesi kaynaklar={[KAYNAK.okulTakvim, KAYNAK.ulkeTakvim, KAYNAK.kilavuz]} />
      </Container>
    </>
  );
}
