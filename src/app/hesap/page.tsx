import type { Metadata } from "next";
import { Calismalarim, type KatalogKagidi } from "@/components/uyelik/Calismalarim";
import { Breadcrumb, Container, PageHero } from "@/components/ui";
import { baslikYap, getDersler, getYazililar, sinifNo } from "@/lib/data";
import { kagitAdi, kagitAnahtari } from "@/lib/kagit";

export const metadata: Metadata = {
  title: "Çalışmalarım",
  description: "Atomica hesabınla çözdüğün matematik yazılı kâğıtları ve süreleri.",
  robots: { index: false },
};

export default function HesapPage() {
  // Tüm kâğıtların listesi; öğrencinin ilerlemesi tarayıcıda bununla eşleştirilir.
  const katalog: KatalogKagidi[] = getDersler().flatMap((d) =>
    d.siniflar.flatMap((s) =>
      getYazililar(d.slug, s.slug).flatMap((y) => {
        const taban = `/dersler/${d.slug}/${s.slug}/${y.slug}/`;
        return y.kagitlar.map((k) => ({
          anahtar: kagitAnahtari(taban, k.slug),
          href: `${taban}${k.slug}/`,
          grup: `${sinifNo(s.slug)}. sınıf ${d.ad.toLocaleLowerCase("tr")} · ${baslikYap(y.ad)}`,
          ad: kagitAdi(k),
        }));
      }),
    ),
  );

  return (
    <>
      <Breadcrumb items={[{ ad: "Çalışmalarım", href: "/hesap/" }]} />
      <PageHero eyebrow="Atomica hesabın" baslik="Çalışmalarım">
        <p className="text-lg text-ink-soft">Bitirdiğin kâğıtlar ve süren burada. Sıradaki kâğıdına buradan devam edebilirsin.</p>
      </PageHero>
      <Container className="py-10">
        <Calismalarim katalog={katalog} />
      </Container>
    </>
  );
}
