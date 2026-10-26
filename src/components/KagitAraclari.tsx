"use client";

import { useEffect, useState } from "react";
import { useUyelik } from "./uyelik/UyelikSaglayici";

function sureYaz(saniye: number) {
  const s = Math.max(0, saniye);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function dakikaYaz(saniye: number) {
  const dk = Math.max(1, Math.round(saniye / 60));
  return `${dk} dk`;
}

/** Kâğıt sayfasının üstündeki yapışkan araç çubuğu: süre tut, bitirdim olarak kaydet, yazdır. */
export function KagitAraclari({ kagit, sureDk = 40 }: { kagit: string; sureDk?: number }) {
  const { kullanici, ilerleme, kaydet, girisYap, kayitOl } = useUyelik();
  const [baslangic, setBaslangic] = useState<number | null>(null);
  const [simdi, setSimdi] = useState(0);
  const [girisOnerisi, setGirisOnerisi] = useState(false);
  const kayit = ilerleme.get(kagit);

  useEffect(() => {
    if (baslangic === null) return;
    const t = setInterval(() => setSimdi(Date.now()), 1000);
    return () => clearInterval(t);
  }, [baslangic]);

  const gecen = baslangic !== null && simdi ? Math.round((simdi - baslangic) / 1000) : 0;
  const kalan = sureDk * 60 - gecen;

  const baslat = () => {
    setSimdi(Date.now());
    setBaslangic(Date.now());
    if (kullanici) void kaydet(kagit, "baslandi");
  };

  const bitir = () => {
    if (!kullanici) {
      setGirisOnerisi(true);
      return;
    }
    void kaydet(kagit, "tamamlandi", baslangic !== null ? gecen : undefined);
    setBaslangic(null);
  };

  return (
    <div className="no-print sticky top-[76px] z-30 -mx-4 space-y-3 border-y border-line bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-[18px] sm:border">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {baslangic === null ? (
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
            </p>
          )}
          {kayit?.durum === "tamamlandi" ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-extrabold text-emerald-700">
              ✓ Bitirdin{kayit.sureSn ? ` · ${dakikaYaz(kayit.sureSn)}` : ""}
            </span>
          ) : (
            <button
              type="button"
              onClick={bitir}
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-emerald-700"
            >
              Bitirdim
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-turq shadow-[inset_0_0_0_2px_var(--color-turq)] hover:bg-turq-tint"
        >
          Kâğıdı yazdır
        </button>
      </div>
      {girisOnerisi && !kullanici && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-purple-tint p-3 text-sm">
          <p className="text-ink">
            Tebrikler! Çözdüğün kâğıtların ve sürelerin kaydedilsin istersen Atomica hesabınla giriş yap.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={girisYap} className="rounded-full bg-purple px-4 py-2 font-extrabold text-white">
              Giriş yap
            </button>
            <button type="button" onClick={kayitOl} className="rounded-full bg-white px-4 py-2 font-extrabold text-purple">
              Ücretsiz üye ol
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
