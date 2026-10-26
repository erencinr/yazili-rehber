import Link from "next/link";
import { site } from "@/config/site";
import { sayfalar } from "@/content/sayfalar";
import { getDersler } from "@/lib/data";

export function Footer() {
  const dersler = getDersler();
  const rehberler = sayfalar.filter((s) => !s.yasal);
  // Gizlilik ve kullanım koşulları için Atomica'nın kendi yasal sayfaları gösterilir.
  const yasal = sayfalar.filter((s) => s.slug === "hakkinda" || s.slug === "sorumluluk-reddi");
  const kademeAdi = (k: string) => (k === "ortaokul" ? "Ortaokul" : "Lise");
  const link = "text-white/75 hover:text-white";

  return (
    <footer className="site-footer mt-20 bg-navy text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <a href={site.atomica.anaSayfa} aria-label="Atomica ana sayfa">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.atomica.logoBeyaz} alt="Atomica" width={150} height={32} className="h-8 w-auto" />
          </a>
          <p className="text-sm text-white/75">{site.aciklama}</p>
          <div className="flex flex-wrap gap-2">
            <a href={site.atomica.oyna} className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-navy hover:bg-turq-tint">
              Şimdi Oyna
            </a>
            <a href={site.atomica.paketler} className="rounded-full px-4 py-2 text-sm font-extrabold text-white shadow-[inset_0_0_0_2px_rgb(255_255_255/0.5)] hover:bg-white/10">
              Paketler
            </a>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-extrabold text-yellow">Yazılıya hazırlık</p>
          <ul className="space-y-1.5 text-sm">
            {rehberler.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}/`} className={link}>
                  {s.menuAdi}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ortak-yazili-takvimi/" className={link}>
                Takvim
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-extrabold text-yellow">Dersler</p>
          <ul className="space-y-1.5 text-sm">
            {dersler.map((d) => (
              <li key={d.slug}>
                <Link href={`/dersler/${d.slug}/`} className={link}>
                  {d.ad} <span className="text-white/50">({kademeAdi(d.kademe)})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-extrabold text-yellow">Resmî bağlantılar</p>
          <ul className="space-y-1.5 text-sm">
            {site.resmiLinkler.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {l.ad} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-5 text-xs text-white/60 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            Bu sayfalar Millî Eğitim Bakanlığı&apos;nın resmî sitesi değildir. Sınavla ilgili resmî bilgiler için MEB ve
            EBA duyurularını takip edin.
          </p>
          <ul className="flex flex-wrap gap-4">
            {yasal.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}/`} className="hover:text-white">
                  {s.menuAdi}
                </Link>
              </li>
            ))}
            {site.atomica.yasal.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white">
                  {l.ad}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
