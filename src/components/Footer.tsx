import Link from "next/link";
import { site } from "@/config/site";
import { sayfalar } from "@/content/sayfalar";
import { getDersler } from "@/lib/data";

export function Footer() {
  const dersler = getDersler();
  const rehberler = sayfalar.filter((s) => !s.yasal);
  const yasal = sayfalar.filter((s) => s.yasal);
  const kademeAdi = (k: string) => (k === "ortaokul" ? "Ortaokul" : "Lise");

  return (
    <footer className="site-footer mt-20 border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <p className="font-serif text-xl">{site.marka}</p>
          <p className="text-sm text-muted">{site.aciklama}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-forest">Sayfalar</p>
          <ul className="space-y-1.5 text-sm">
            {rehberler.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}/`} className="hover:text-forest hover:underline">
                  {s.menuAdi}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ortak-yazili-takvimi/" className="hover:text-forest hover:underline">
                Takvim
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-forest">Dersler</p>
          <ul className="space-y-1.5 text-sm">
            {dersler.map((d) => (
              <li key={d.slug}>
                <Link href={`/dersler/${d.slug}/`} className="hover:text-forest hover:underline">
                  {d.ad} <span className="text-muted">({kademeAdi(d.kademe)})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-forest">Resmî bağlantılar</p>
          <ul className="space-y-1.5 text-sm">
            {site.resmiLinkler.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-forest hover:underline">
                  {l.ad} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-5 text-xs text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            Bu site Millî Eğitim Bakanlığı&apos;nın resmî sitesi değildir. Sınavla ilgili resmî bilgiler için MEB ve EBA
            duyurularını takip edin.
          </p>
          <ul className="flex flex-wrap gap-4">
            {yasal.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}/`} className="hover:text-forest hover:underline">
                  {s.menuAdi}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
