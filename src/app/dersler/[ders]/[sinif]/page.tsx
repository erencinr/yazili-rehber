import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScenarioTable } from "@/components/ScenarioTable";
import { Breadcrumb, Card, Chip, Container, FaqAccordion, H2, PageHero } from "@/components/ui";
import { site } from "@/config/site";
import { getDers, getDersler, getYazililar, sinifNo } from "@/lib/data";

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
    title: `${n}. Sınıf ${r.ders.ad} yazılı senaryoları ${site.egitimYili}`,
    description: `${n}. sınıf ${r.ders.ad} ortak yazılısında hangi senaryoda hangi konudan kaç soru var? Dağılım tablosu ve çözülebilir kâğıtlar.`,
    alternates: { canonical: `/dersler/${r.ders.slug}/${r.sinif.slug}/` },
  };
}

export default async function SinifPage({ params }: PageProps<"/dersler/[ders]/[sinif]">) {
  const r = await cozumle(params);
  if (!r) notFound();
  const { ders, sinif } = r;
  const n = sinifNo(sinif.slug);
  const yazililar = getYazililar(ders.slug, sinif.slug);
  const taban = `/dersler/${ders.slug}/${sinif.slug}/`;
  const ilk = yazililar[0];
  const ayniSinifDersleri = getDersler().filter((d) => d.slug !== ders.slug && d.siniflar.some((s) => s.slug === sinif.slug));

  return (
    <>
      <Breadcrumb
        items={[
          { ad: "Dersler", href: "/dersler/" },
          { ad: ders.ad, href: `/dersler/${ders.slug}/` },
          { ad: `${n}. sınıf`, href: taban },
        ]}
      />
      <PageHero eyebrow={`${n}. sınıf ${ders.ad}`} baslik={`${n}. Sınıf ${ders.ad} yazılı senaryoları ${site.egitimYili}`}>
        <p className="text-lg text-ink/80">
          Her yazılı için senaryoların hangi öğrenme çıktısından kaç soru içerdiğini tabloda gör, kâğıdı aç ve çöz.
        </p>
      </PageHero>
      <Container className="space-y-14 py-12">
        {yazililar.length === 0 ? (
          <Card>
            <p className="font-serif text-xl">Bu sınıfın kâğıtları hazırlanıyor</p>
            <p className="mt-1 text-ink/80">
              Şimdilik örnek olarak <Link href="/dersler/tarih/9-sinif/1-yazili-sorulari/" className="font-semibold text-forest underline">9. sınıf Tarih 1. yazılı</Link> kâğıtlarını inceleyebilirsin.
            </p>
          </Card>
        ) : (
          yazililar.map((y) => (
            <section key={y.slug} className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <H2 id={y.slug}>{y.ad}</H2>
                <Link href={`${taban}${y.slug}/`} className="text-sm font-semibold text-forest hover:underline">
                  {y.ad} sorularına git →
                </Link>
              </div>
              {y.tarihAraligi && <p className="text-sm text-muted">Tarih aralığı: {y.tarihAraligi}</p>}
              <ScenarioTable ciktilar={y.ciktilar} senaryolar={y.senaryolar} hrefOnEk={`${taban}${y.slug}/`} />
            </section>
          ))
        )}

        <Card className="bg-forest-50">
          <h3 className="font-serif text-xl">Bu tablo nasıl okunur?</h3>
          <p className="mt-2 text-ink/80">
            Satırlar öğrenme çıktılarını, sütunlar senaryoları gösterir. Hücredeki sayı o senaryoda o çıktıdan kaç soru
            sorulduğunu, “—” ise hiç soru olmadığını belirtir. Sütun başlığına tıklayarak kâğıdı açabilirsin.
          </p>
        </Card>

        {ilk && (
          <FaqAccordion
            items={[
              { soru: `${n}. sınıf ${ders.ad} ${ilk.ad}sında kaç soru var?`, cevap: `Senaryoya göre değişir: ${ilk.senaryolar.map((s) => `Senaryo ${s.no}'de ${s.sorular.length}`).join(", ")} soru bulunuyor.` },
              { soru: `${n}. sınıf ${ders.ad} yazılısı kaç puan?`, cevap: "Her senaryo kâğıdı toplam 100 puandır. Puanlar soruların alt maddelerine dağıtılmıştır." },
              { soru: "Sınavda hangi senaryo çıkacak?", cevap: "Hangi senaryonun uygulanacağı sınavdan önce belirlenir. Bu yüzden tüm senaryolara çalışmak en güvenli yoldur." },
              { soru: `${n}. sınıf ${ders.ad} yazılısı ne kadar sürer?`, cevap: `Bu sitedeki kâğıtlar ${ilk.senaryolar[0].sureDk} dakikalık süreyle hazırlanmıştır.` },
              { soru: `${n}. sınıf ${ders.ad} ${ilk.ad} ne zaman?`, cevap: ilk.tarihAraligi ? `Planlanan aralık: ${ilk.tarihAraligi}. Kesin tarih için takvim sayfasına bak.` : "Takvim sayfasında güncel tarihleri bulabilirsin." },
            ]}
          />
        )}

        <section className="space-y-4">
          <H2>{ders.ad} dersinin diğer sınıfları</H2>
          <div className="flex flex-wrap gap-2">
            {ders.siniflar
              .filter((s) => s.slug !== sinif.slug)
              .map((s) => (
                <Chip key={s.slug} href={`/dersler/${ders.slug}/${s.slug}/`}>
                  {sinifNo(s.slug)}. sınıf {ders.ad}
                </Chip>
              ))}
          </div>
        </section>
        <section className="space-y-4">
          <H2>{n}. sınıfın diğer dersleri</H2>
          <div className="flex flex-wrap gap-2">
            {ayniSinifDersleri.map((d) => (
              <Chip key={d.slug} href={`/dersler/${d.slug}/${sinif.slug}/`}>
                {d.ad}
              </Chip>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
