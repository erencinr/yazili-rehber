"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/config/site";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-white">
      <span className="grid size-9 place-items-center rounded-lg bg-white font-serif text-lg text-forest">Y</span>
      <span className="leading-tight">
        <span className="block font-serif text-lg">{site.marka}</span>
        <span className="block text-xs text-white/70">{site.altBaslik}</span>
      </span>
    </Link>
  );
}

export function Header() {
  const yol = usePathname();
  const [acik, setAcik] = useState(false);
  const [kimler, setKimler] = useState(false);
  const aktif = (href: string) => yol === href || (href !== "/" && yol.startsWith(href));
  const linkCls = (href: string) =>
    `rounded-full px-3 py-1.5 text-sm font-semibold text-white ${aktif(href) ? "bg-white/15" : "hover:bg-white/10"}`;
  const kapat = () => {
    setAcik(false);
    setKimler(false);
  };

  return (
    <header className="site-header sticky top-0 z-40 bg-forest">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
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
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Kimler için ▾
            </button>
            {kimler && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-line bg-white p-1.5 shadow-lg">
                {site.kimlerIcin.map((k) => (
                  <Link key={k.href} href={k.href} onClick={kapat} className="block rounded-lg px-3 py-2 text-sm hover:bg-forest-50">
                    {k.ad} rehberi
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/hesap/" className="ml-2 rounded-lg border border-white/60 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10">
            Hesabım
          </Link>
        </nav>
        <button
          type="button"
          className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold text-white lg:hidden"
          aria-expanded={acik}
          aria-controls="mobil-menu"
          onClick={() => setAcik((v) => !v)}
        >
          {acik ? "Kapat" : "Menü"}
        </button>
      </div>
      {acik && (
        <nav id="mobil-menu" className="border-t border-white/15 px-4 pb-4 lg:hidden" aria-label="Mobil menü">
          <div className="flex flex-col gap-1 pt-3">
            {[...site.nav, ...site.kimlerIcin.map((k) => ({ ad: `${k.ad} rehberi`, href: k.href })), { ad: "Hesabım", href: "/hesap/" }].map(
              (l) => (
                <Link key={l.href} href={l.href} onClick={kapat} className={linkCls(l.href)}>
                  {l.ad}
                </Link>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
