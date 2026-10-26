"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/config/site";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <a href={site.atomica.anaSayfa} aria-label="Atomica ana sayfa" className="shrink-0">
        {/* Logo Atomica'nın kendi sunucusundan gelir; next/image optimizasyonu statik dışa aktarmada yok. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.atomica.logo} alt="Atomica" width={150} height={32} className="h-8 w-auto" />
      </a>
      <span aria-hidden className="h-6 w-px bg-line" />
      <Link href="/" className="rounded-full bg-turq-tint px-3 py-1 text-xs font-extrabold whitespace-nowrap text-turq">
        {site.altBaslik}
      </Link>
    </div>
  );
}

function OynaIkonu() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function Header() {
  const yol = usePathname();
  const [acik, setAcik] = useState(false);
  const [kimler, setKimler] = useState(false);
  const aktif = (href: string) => yol === href || (href !== "/" && yol.startsWith(href));
  const linkCls = (href: string) =>
    `rounded-[10px] px-2.5 py-2 text-[13.5px] font-semibold ${aktif(href) ? "bg-navy-tint text-navy" : "text-ink-soft hover:text-navy"}`;
  const kapat = () => {
    setAcik(false);
    setKimler(false);
  };
  const oynaCls =
    "items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-turq shadow-[inset_0_0_0_2px_var(--color-turq)] hover:bg-turq-tint";
  const paketCls =
    "items-center rounded-full bg-navy px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_18px_44px_-16px_rgb(0_20_110/0.4)] hover:bg-navy-2";

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Ana menü">
          {site.nav.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(l.href)}>
              {l.ad}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setKimler((v) => !v)}
              aria-expanded={kimler}
              className="rounded-[10px] px-2.5 py-2 text-[13.5px] font-semibold text-ink-soft hover:text-navy"
            >
              Kimler için ▾
            </button>
            {kimler && (
              <div className="absolute right-0 mt-2 w-56 rounded-[14px] border border-line bg-white p-1.5 shadow-[0_14px_40px_-16px_rgb(19_26_51/0.22)]">
                {site.kimlerIcin.map((k) => (
                  <Link key={k.href} href={k.href} onClick={kapat} className="block rounded-[10px] px-3 py-2 text-sm hover:bg-navy-tint">
                    {k.ad} rehberi
                  </Link>
                ))}
                <Link href="/hesap/" onClick={kapat} className="block rounded-[10px] px-3 py-2 text-sm hover:bg-navy-tint">
                  Çözdüğüm kâğıtlar
                </Link>
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.atomica.oyna} className={`${oynaCls} hidden sm:inline-flex`}>
            <OynaIkonu />
            Şimdi Oyna
          </a>
          <a href={site.atomica.paketler} className={`${paketCls} hidden sm:inline-flex`}>
            Paketler
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-navy hover:bg-navy-tint xl:hidden"
            aria-expanded={acik}
            aria-controls="mobil-menu"
            aria-label={acik ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setAcik((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="size-6" aria-hidden>
              {acik ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>
      {acik && (
        <nav id="mobil-menu" className="border-t border-line bg-white px-4 pb-5 xl:hidden" aria-label="Mobil menü">
          <div className="flex flex-col gap-1 pt-3">
            {[...site.nav, ...site.kimlerIcin.map((k) => ({ ad: `${k.ad} rehberi`, href: k.href })), { ad: "Çözdüğüm kâğıtlar", href: "/hesap/" }].map(
              (l) => (
                <Link key={l.href} href={l.href} onClick={kapat} className={linkCls(l.href)}>
                  {l.ad}
                </Link>
              ),
            )}
          </div>
          <div className="mt-4 flex gap-2 sm:hidden">
            <a href={site.atomica.oyna} className={`${oynaCls} inline-flex`}>
              <OynaIkonu />
              Şimdi Oyna
            </a>
            <a href={site.atomica.paketler} className={`${paketCls} inline-flex`}>
              Paketler
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
