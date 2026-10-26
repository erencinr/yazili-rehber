"use client";

import { useEffect, useState } from "react";

function sureYaz(saniye: number) {
  const s = Math.max(0, saniye);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Kâğıt sayfasının üstündeki yapışkan araç çubuğu: süre tut ve yazdır. */
export function KagitAraclari({ sureDk = 40 }: { sureDk?: number }) {
  const [bitis, setBitis] = useState<number | null>(null);
  const [simdi, setSimdi] = useState(0);

  useEffect(() => {
    if (bitis === null) return;
    const t = setInterval(() => setSimdi(Date.now()), 1000);
    return () => clearInterval(t);
  }, [bitis]);

  const kalan = bitis !== null && simdi ? Math.round((bitis - simdi) / 1000) : sureDk * 60;
  const baslat = () => {
    setSimdi(Date.now());
    setBitis(Date.now() + sureDk * 60 * 1000);
  };

  return (
    <div className="no-print sticky top-[76px] z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-y border-line bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-[18px] sm:border">
      {bitis === null ? (
        <button
          type="button"
          onClick={baslat}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-extrabold text-white hover:bg-navy-2"
        >
          ⏱ {sureDk} dakika süre başlat
        </button>
      ) : (
        <p className="text-sm">
          Kalan süre:{" "}
          <span
            className={`font-mono text-lg font-extrabold tabular-nums ${kalan <= 0 ? "text-rose-600" : kalan < 300 ? "text-orange-500" : "text-navy"}`}
          >
            {kalan <= 0 ? "Süre doldu" : sureYaz(kalan)}
          </span>
          <button type="button" onClick={() => setBitis(null)} className="ml-3 text-sm font-semibold text-muted hover:text-navy">
            Sıfırla
          </button>
        </p>
      )}
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-turq shadow-[inset_0_0_0_2px_var(--color-turq)] hover:bg-turq-tint"
      >
        Kâğıdı yazdır
      </button>
    </div>
  );
}
