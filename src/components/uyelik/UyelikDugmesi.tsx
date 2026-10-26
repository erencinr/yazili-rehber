"use client";

import Link from "next/link";
import { useState } from "react";
import { useUyelik } from "./UyelikSaglayici";

/** Üst menüdeki giriş düğmesi; giriş yapılmışsa öğrencinin adı ve kısa menü. */
export function UyelikDugmesi({ mobil = false }: { mobil?: boolean }) {
  const { kullanici, girisYap, cikisYap } = useUyelik();
  const [acik, setAcik] = useState(false);

  if (kullanici === undefined) return <span className="inline-block h-10 w-24" aria-hidden />;

  if (!kullanici) {
    return (
      <button
        type="button"
        onClick={girisYap}
        className={`${mobil ? "inline-flex" : "hidden md:inline-flex"} items-center rounded-full px-4 py-2.5 text-sm font-extrabold whitespace-nowrap text-navy hover:bg-navy-tint`}
      >
        Giriş yap
      </button>
    );
  }

  const basHarf = kullanici.ad.trim().charAt(0).toLocaleUpperCase("tr");
  if (mobil) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/hesap/" className="rounded-full bg-navy-tint px-4 py-2 text-sm font-extrabold text-navy">
          Çalışmalarım
        </Link>
        <button type="button" onClick={cikisYap} className="px-2 py-2 text-sm font-semibold text-muted hover:text-navy">
          Çıkış yap
        </button>
      </div>
    );
  }

  return (
    <div className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        aria-expanded={acik}
        className="flex items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 hover:bg-navy-tint"
      >
        <span className="grid size-8 place-items-center rounded-full bg-purple text-sm font-extrabold text-white">{basHarf}</span>
        <span className="max-w-[120px] truncate text-sm font-extrabold text-navy">{kullanici.ad}</span>
      </button>
      {acik && (
        <div className="absolute right-0 mt-2 w-48 rounded-[14px] border border-line bg-white p-1.5 shadow-[0_14px_40px_-16px_rgb(19_26_51/0.22)]">
          <Link href="/hesap/" onClick={() => setAcik(false)} className="block rounded-[10px] px-3 py-2 text-sm hover:bg-navy-tint">
            Çalışmalarım
          </Link>
          <button
            type="button"
            onClick={() => {
              setAcik(false);
              cikisYap();
            }}
            className="block w-full rounded-[10px] px-3 py-2 text-left text-sm hover:bg-navy-tint"
          >
            Çıkış yap
          </button>
        </div>
      )}
    </div>
  );
}
