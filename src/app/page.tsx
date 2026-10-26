import { DersChipleri } from "@/components/DersChipleri";
import { AudienceCards, ButtonLink, Card, Container, CtaStrip, H2 } from "@/components/ui";
import { site } from "@/config/site";

const evreler = [
  { baslik: "Hazırlık", metin: "Öğretmen senaryoyu seçer, kâğıt hazırlanır ve sınav günü planlanır." },
  { baslik: "Uygulama", metin: "Öğrenciler aynı formattaki yazılı kâğıdını sınıfta çözer." },
  { baslik: "Değerlendirme", metin: "Kâğıtlar puanlama ölçütlerine göre okunur, sonuçlar sisteme girilir." },
];

export default function Home() {
  return (
    <>
      <section className="hero-grid border-b border-line">
        <Container className="space-y-5 py-14 sm:py-20">
          <p className="text-sm font-semibold text-forest">OYSS rehberi · {site.egitimYili}</p>
          <h1 className="max-w-[820px] text-[34px] sm:text-[48px]">
            Ortak Yazılı Sınav Sistemi nedir? Öğrenci, öğretmen ve veli rehberi
          </h1>
          <p className="max-w-[680px] text-lg text-ink/80">
            Sınavın nasıl işlediğini sade bir dille öğren, gerçek formattaki yazılı kâğıtlarını çöz ve puanlama
            ölçütleriyle kendini puanla.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/oyss-nedir/">OYSS nedir?</ButtonLink>
            <ButtonLink href="/dersler/" variant="secondary">
              Dersler
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="space-y-16 py-12 sm:space-y-20">
        <CtaStrip />

        <section className="space-y-5">
          <H2>Kim için hangi sayfa?</H2>
          <AudienceCards />
        </section>

        <section className="space-y-5">
          <H2>Sistem üç evrede işler</H2>
          <div className="grid gap-4 sm:grid-cols-3">
            {evreler.map((e, i) => (
              <Card key={e.baslik}>
                <span className="grid size-9 place-items-center rounded-full bg-forest-50 font-semibold text-forest">{i + 1}</span>
                <h3 className="mt-3 font-serif text-xl">{e.baslik}</h3>
                <p className="mt-1 text-ink/80">{e.metin}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <H2>Tüm dersler</H2>
          <DersChipleri />
        </section>
      </Container>
    </>
  );
}
