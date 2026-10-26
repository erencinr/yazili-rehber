import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="space-y-4 py-20">
      <p className="text-sm font-semibold text-forest">404</p>
      <h1 className="text-[34px] sm:text-[48px]">Aradığın sayfa bulunamadı</h1>
      <p className="text-ink/80">Sayfa taşınmış ya da henüz hazırlanmamış olabilir.</p>
      <div className="flex gap-3">
        <ButtonLink href="/">Ana sayfa</ButtonLink>
        <ButtonLink href="/dersler/" variant="secondary">
          Dersler
        </ButtonLink>
      </div>
    </Container>
  );
}
