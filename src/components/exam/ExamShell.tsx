"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { oku, sil, yaz, type Faz, type SinavKaydi } from "@/lib/depo";
import type { Konu, Senaryo } from "@/lib/types";
import { maddePuani, QuestionCard } from "./QuestionCard";

type Props = {
  depoAnahtari: string;
  baslik: string;
  url: string;
  kagitBasligi: string;
  senaryo: Senaryo;
  konular: Konu[];
  konuHrefOnEki: string;
};

type Durum = Pick<SinavKaydi, "faz" | "baslangic" | "cevaplar" | "isaretler">;
const BOS: Durum = { faz: "hazir", cevaplar: {}, isaretler: {} };

function sureYaz(saniye: number) {
  const s = Math.max(0, Math.round(saniye));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function ExamShell({ depoAnahtari, baslik, url, kagitBasligi, senaryo, konular, konuHrefOnEki }: Props) {
  const [durum, setDurum] = useState<Durum>(BOS);
  const [yuklendi, setYuklendi] = useState(false);
  const [simdi, setSimdi] = useState(0);
  const [yazdirmaModu, setYazdirmaModu] = useState<"kagit" | "anahtar">("kagit");
  const ustRef = useRef<HTMLDivElement>(null);
  const { faz } = durum;

  // Kaldığı yerden devam. localStorage yalnızca tarayıcıda okunabildiği için effect içinde.
  useEffect(() => {
    const kayit = oku<SinavKaydi>(depoAnahtari);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (kayit) setDurum({ faz: kayit.faz, baslangic: kayit.baslangic, cevaplar: kayit.cevaplar ?? {}, isaretler: kayit.isaretler ?? {} });
    setYuklendi(true);
  }, [depoAnahtari]);

  useEffect(() => {
    if (faz !== "cozuluyor") return;
    const t = setInterval(() => setSimdi(Date.now()), 1000);
    return () => clearInterval(t);
  }, [faz]);

  const sonuc = useMemo(() => {
    const sorular = senaryo.sorular.map((q) => ({
      soru: q,
      alinan: q.maddeler.reduce((t, m) => t + maddePuani(m, durum.isaretler[m.no]), 0),
    }));
    const konuSonuclari = konular
      .map((k) => {
        const ilgili = sorular.filter((s) => s.soru.konuSlug === k.slug);
        const toplam = ilgili.reduce((t, s) => t + s.soru.puan, 0);
        const alinan = ilgili.reduce((t, s) => t + s.alinan, 0);
        return { konu: k, toplam, alinan, yuzde: toplam ? Math.round((alinan / toplam) * 100) : 0 };
      })
      .filter((k) => k.toplam > 0);
    const enZayif = [...konuSonuclari].sort((a, b) => a.yuzde - b.yuzde)[0];
    return { sorular, konuSonuclari, enZayif, toplam: sorular.reduce((t, s) => t + s.alinan, 0) };
  }, [senaryo, konular, durum.isaretler]);

  // Her değişiklikte kaydet
  useEffect(() => {
    if (!yuklendi) return;
    if (durum.faz === "hazir" && !durum.baslangic) {
      sil(depoAnahtari);
      return;
    }
    const kayit: SinavKaydi = {
      ...durum,
      baslik,
      url,
      puan: durum.faz === "sonuc" ? sonuc.toplam : undefined,
      tarih: new Date().toISOString(),
      enZayif:
        durum.faz === "sonuc" && sonuc.enZayif
          ? { ad: sonuc.enZayif.konu.ad, href: `${konuHrefOnEki}${sonuc.enZayif.konu.slug}/`, yuzde: sonuc.enZayif.yuzde }
          : undefined,
    };
    yaz(depoAnahtari, kayit);
  }, [durum, yuklendi, depoAnahtari, baslik, url, sonuc, konuHrefOnEki]);

  const fazaGec = (yeni: Faz, ek: Partial<Durum> = {}) => {
    setDurum((d) => ({ ...d, ...ek, faz: yeni }));
    requestAnimationFrame(() => ustRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const baslat = () => {
    setSimdi(Date.now());
    fazaGec("cozuluyor", { baslangic: Date.now() });
  };

  const bastanCoz = () => {
    if (!window.confirm("Cevapların ve işaretlerin silinecek. Baştan çözmek istiyor musun?")) return;
    fazaGec("hazir", { baslangic: undefined, cevaplar: {}, isaretler: {} });
  };

  const yazdir = (mod: "kagit" | "anahtar") => {
    flushSync(() => setYazdirmaModu(mod));
    const kok = document.documentElement;
    kok.dataset.print = mod;
    const temizle = () => {
      delete kok.dataset.print;
      window.removeEventListener("afterprint", temizle);
    };
    window.addEventListener("afterprint", temizle);
    window.print();
  };

  const cevapYaz = (no: string, metin: string) => setDurum((d) => ({ ...d, cevaplar: { ...d.cevaplar, [no]: metin } }));
  const isaretle = (no: string, i: number) =>
    setDurum((d) => {
      const onceki = d.isaretler[no] ?? [];
      const yeni = onceki.includes(i) ? onceki.filter((x) => x !== i) : [...onceki, i];
      return { ...d, isaretler: { ...d.isaretler, [no]: yeni } };
    });

  const kalan = durum.baslangic && simdi ? senaryo.sureDk * 60 - (simdi - durum.baslangic) / 1000 : senaryo.sureDk * 60;
  const puanlamaAcik = faz === "puanlama" || faz === "sonuc";
  const konuAdi = (slug: string) => konular.find((k) => k.slug === slug)?.kisaAd;

  return (
    <div className="exam space-y-6" data-phase={faz}>
      <div ref={ustRef} className="scroll-mt-24" />

      {/* Yazdırma başlığı */}
      <div className="print-only space-y-3 border-b border-ink pb-3">
        <p className="text-lg font-semibold">
          {kagitBasligi} {yazdirmaModu === "anahtar" ? "· Cevap anahtarı ve puanlama" : ""}
        </p>
        {yazdirmaModu === "kagit" && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <p>Okul: ..................................</p>
            <p>Ad Soyad: ..............................</p>
            <p>Numara / Sınıf: .....................</p>
          </div>
        )}
        <p className="text-xs">Süre: {senaryo.sureDk} dakika · Toplam: 100 puan</p>
      </div>

      {/* Kontroller */}
      <div className="no-print flex flex-wrap gap-3">
        {faz === "hazir" && (
          <button type="button" onClick={baslat} className="rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90">
            {durum.baslangic ? "Sınava devam et" : "Sınava başla"}
          </button>
        )}
        <button type="button" onClick={() => yazdir("kagit")} className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold hover:border-navy/40">
          Kâğıdı yazdır
        </button>
        <button type="button" onClick={() => yazdir("anahtar")} className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold hover:border-navy/40">
          Cevap anahtarını yazdır
        </button>
      </div>

      {faz === "sonuc" && (
        <ScoreSummary
          sonuc={sonuc}
          konuHrefOnEki={konuHrefOnEki}
          onCozumler={() => fazaGec("puanlama")}
          onBastan={bastanCoz}
        />
      )}

      {(faz === "cozuluyor" || faz === "puanlama") && (
        <div className="no-print sticky top-[76px] z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-y border-line bg-soft/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-[22px] sm:border">
          {faz === "cozuluyor" ? (
            <p className="text-sm">
              Kalan süre:{" "}
              <span className={`font-mono text-lg font-semibold tabular-nums ${kalan <= 0 ? "text-red-700" : kalan < 300 ? "text-amber-700" : "text-navy"}`}>
                {!simdi ? "--:--" : kalan <= 0 ? "Süre doldu" : sureYaz(kalan)}
              </span>
            </p>
          ) : (
            <p className="text-sm">
              Puanın: <span className="text-lg font-semibold text-navy tabular-nums">{sonuc.toplam}</span>/100 · Karşıladığın ölçütleri işaretle
            </p>
          )}
          {faz === "cozuluyor" ? (
            <button type="button" onClick={() => fazaGec("puanlama")} className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy/90">
              Kâğıdı bitir
            </button>
          ) : (
            <button type="button" onClick={() => fazaGec("sonuc")} className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy/90">
              Sonucu gör
            </button>
          )}
        </div>
      )}

      <div className="exam-questions space-y-6">
        <nav aria-label="Soru gezgini" className="no-print flex flex-wrap gap-2">
          {sonuc.sorular.map(({ soru, alinan }) => (
            <a
              key={soru.no}
              href={`#soru-${soru.no}`}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium hover:border-navy/40"
            >
              {puanlamaAcik ? (
                <>
                  {soru.no}. soru: <span className="font-semibold text-navy tabular-nums">{alinan}/{soru.puan}</span>
                </>
              ) : (
                <>
                  {soru.no} · {konuAdi(soru.konuSlug)} · <span className="text-navy">{soru.puan}</span>
                </>
              )}
            </a>
          ))}
        </nav>

        {senaryo.sorular.map((q) => (
          <QuestionCard
            key={q.no}
            soru={q}
            konuAdi={konuAdi(q.konuSlug)}
            e={{
              cevaplar: durum.cevaplar,
              isaretler: durum.isaretler,
              cevapYaz,
              isaretle,
              cevapAcik: faz === "cozuluyor" || faz === "hazir",
              puanlamaAcik,
            }}
          />
        ))}

        {faz === "cozuluyor" && (
          <div className="no-print flex justify-end">
            <button type="button" onClick={() => fazaGec("puanlama")} className="rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90">
              Kâğıdı bitir ve puanla
            </button>
          </div>
        )}
        {faz === "puanlama" && (
          <div className="no-print flex justify-end">
            <button type="button" onClick={() => fazaGec("sonuc")} className="rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90">
              Sonucu gör
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type Sonuc = {
  toplam: number;
  sorular: { soru: Senaryo["sorular"][number]; alinan: number }[];
  konuSonuclari: { konu: Konu; toplam: number; alinan: number; yuzde: number }[];
  enZayif?: { konu: Konu; yuzde: number };
};

function ScoreSummary({
  sonuc,
  konuHrefOnEki,
  onCozumler,
  onBastan,
}: {
  sonuc: Sonuc;
  konuHrefOnEki: string;
  onCozumler: () => void;
  onBastan: () => void;
}) {
  return (
    <section className="no-print space-y-6 rounded-[22px] border border-line bg-white p-5 shadow-sm sm:p-8" aria-labelledby="puanin">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="puanin" className="text-[26px]">
            Puanın
          </h2>
          <p className="font-serif text-6xl text-navy tabular-nums">
            {sonuc.toplam}
            <span className="text-2xl text-muted">/100</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onCozumler} className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-navy/40">
            Çözümlere dön
          </button>
          <button type="button" onClick={onBastan} className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-navy/40">
            Baştan çöz
          </button>
        </div>
      </div>

      {sonuc.enZayif && sonuc.enZayif.yuzde < 100 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy-tint p-4">
          <p>
            En çok puan kaybettiğin konu: <strong>{sonuc.enZayif.konu.ad}</strong> (%{sonuc.enZayif.yuzde})
          </p>
          <Link href={`${konuHrefOnEki}${sonuc.enZayif.konu.slug}/`} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90">
            Bu konuyu çalış →
          </Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Konulara göre</h3>
          <ul className="space-y-3">
            {sonuc.konuSonuclari.map((k) => (
              <li key={k.konu.slug}>
                <div className="flex justify-between text-sm">
                  <span>{k.konu.ad}</span>
                  <span className="font-semibold tabular-nums">
                    {k.alinan}/{k.toplam}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-navy" style={{ width: `${k.yuzde}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Sorulara göre</h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line">
              {sonuc.sorular.map(({ soru, alinan }) => (
                <tr key={soru.no}>
                  <td className="py-2">
                    <a href={`#soru-${soru.no}`} className="hover:text-navy hover:underline">
                      {soru.no}. {soru.baslik}
                    </a>
                  </td>
                  <td className="py-2 text-right font-semibold tabular-nums">
                    {alinan}/{soru.puan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
