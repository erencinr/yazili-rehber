import Link from "next/link";
import type { ReactNode } from "react";
import { mutlakUrl, site } from "@/config/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-extrabold tracking-wide text-turq uppercase">{children}</p>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[22px] border border-line bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Chip({ href, children, active = false }: { href: string; children: ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-navy/40"
      }`}
    >
      {children}
    </Link>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "bg-navy text-white shadow-[0_18px_44px_-16px_rgb(0_20_110/0.4)] hover:bg-navy-2"
      : "bg-white text-turq shadow-[inset_0_0_0_2px_var(--color-turq)] hover:bg-turq-tint";
  return (
    <Link href={href} className={`inline-flex items-center rounded-full px-5 py-3 text-[14.5px] font-extrabold ${cls}`}>
      {children}
    </Link>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-[24px] sm:text-[28px]">
      {children}
    </h2>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export type Kirinti = { ad: string; href: string };

export function Breadcrumb({ items }: { items: Kirinti[] }) {
  const tum = [{ ad: "Ana sayfa", href: "/" }, ...items];
  return (
    <nav aria-label="Sayfa yolu" className="breadcrumb border-b border-line bg-soft">
      <Container className="py-2.5">
        <ol className="flex flex-wrap items-center gap-x-1.5 text-[13px] text-ink/70 sm:text-sm">
          {tum.map((k, i) => (
            <li key={k.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>›</span>}
              {i === tum.length - 1 ? (
                <span aria-current="page" className="text-ink">
                  {k.ad}
                </span>
              ) : (
                <Link href={k.href} className="hover:text-navy hover:underline">
                  {k.ad}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: tum.map((k, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: k.ad,
            item: mutlakUrl(k.href),
          })),
        }}
      />
    </nav>
  );
}

export function FaqAccordion({ items, baslik = "Sık sorulan sorular" }: { items: { soru: string; cevap: string }[]; baslik?: string }) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-4">
      <H2 id="sss">{baslik}</H2>
      <div className="space-y-2">
        {items.map((s) => (
          <details key={s.soru} className="group rounded-xl border border-line bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
              <h3 className="font-medium">{s.soru}</h3>
              <span className="faq-isaret text-xl leading-none text-navy" aria-hidden />
            </summary>
            <p className="px-5 pb-4 text-ink/80">{s.cevap}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((s) => ({
            "@type": "Question",
            name: s.soru,
            acceptedAnswer: { "@type": "Answer", text: s.cevap },
          })),
        }}
      />
    </section>
  );
}

export function CtaStrip({ href = "/dersler/", children = "Yazılı sorularını görmek için tıkla" }: { href?: string; children?: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-[22px] bg-gradient-to-r from-navy to-purple px-6 py-6 text-white shadow-[0_18px_44px_-16px_rgb(0_20_110/0.4)] hover:opacity-95"
    >
      <span className="font-serif text-xl sm:text-2xl">{children}</span>
      <span aria-hidden className="text-2xl">
        →
      </span>
    </Link>
  );
}

export function AudienceCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {site.kimlerIcin.map((k) => (
        <Link key={k.href} href={k.href} className="group rounded-[22px] border border-line bg-white p-5 shadow-sm hover:border-navy/40">
          <p className="text-sm font-semibold text-navy">{k.kart}</p>
          <p className="mt-1 font-serif text-xl group-hover:text-navy">{k.soru}</p>
        </Link>
      ))}
    </div>
  );
}

export function NextLinks({ items }: { items: { baslik: string; aciklama: string; href: string }[] }) {
  return (
    <section className="space-y-4">
      <H2>Sırada ne var?</H2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((l) => (
          <Link key={l.href} href={l.href} className="group rounded-[22px] border border-line bg-white p-5 shadow-sm hover:border-navy/40">
            <p className="font-serif text-lg group-hover:text-navy">{l.baslik} →</p>
            <p className="mt-1 text-sm text-muted">{l.aciklama}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function GlanceBox({ items, baslik = "Bir bakışta" }: { items: { etiket: string; deger: string }[]; baslik?: string }) {
  return (
    <Card className="w-full">
      <p className="text-sm font-semibold text-navy">{baslik}</p>
      <dl className="mt-2 divide-y divide-line">
        {items.map((i) => (
          <div key={i.etiket} className="py-3">
            <dt className="text-xs text-muted">{i.etiket}</dt>
            <dd className="font-serif text-lg font-semibold">{i.deger}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function PageHero({
  eyebrow,
  baslik,
  children,
  yan,
  className = "",
}: {
  eyebrow: string;
  baslik: string;
  children?: ReactNode;
  yan?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`hero-grid border-b border-line ${className}`}>
      <Container className={`grid gap-8 py-10 sm:py-14 ${yan ? "lg:grid-cols-[1fr_320px]" : ""}`}>
        <div className="max-w-[760px] space-y-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-[34px] sm:text-[48px]">{baslik}</h1>
          {children}
        </div>
        {yan}
      </Container>
    </section>
  );
}

export function ResponsiveTable({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-[22px] border border-line bg-white shadow-sm">{children}</div>;
}

export function tarihYaz(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}
