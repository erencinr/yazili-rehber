import type { Metadata } from "next";
import { HesapListesi } from "@/components/HesapListesi";
import { Breadcrumb, Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Hesabım: Çözdüğüm kâğıtlar ve puanlarım",
  description: "Bu tarayıcıda çözdüğün yazılı kâğıtları, puanlarını ve en zayıf konularını gör.",
  robots: { index: false },
};

export default function HesapPage() {
  return (
    <>
      <Breadcrumb items={[{ ad: "Hesabım", href: "/hesap/" }]} />
      <PageHero eyebrow="Hesabım" baslik="Çözdüğüm kâğıtlar">
        <p className="text-lg text-ink/80">
          Üyelik yok: puanların yalnızca bu tarayıcıda saklanır. Başka cihazda veya gizli pencerede görünmez.
        </p>
      </PageHero>
      <Container className="py-10">
        <HesapListesi />
      </Container>
    </>
  );
}
