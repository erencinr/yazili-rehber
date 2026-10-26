"use client";

import Link from "next/link";
import { useUyelik } from "./UyelikSaglayici";

export type KatalogKagidi = { anahtar: string; href: string; grup: string; ad: string };

export function Calismalarim({ katalog }: { katalog: KatalogKagidi[] }) {
  const { kullanici, ilerleme, girisYap, kayitOl, demo } = useUyelik();

  if (kullanici === undefined) return <p className="text-muted">Yükleniyor…</p>;

  if (!kullanici) {
    return (
      <div className="max-w-[640px] space-y-4 rounded-[22px] bg-purple-tint p-6">
        <p className="text-xl font-extrabold text-navy">Çalışmalarını kaydetmek için giriş yap</p>
        <p className="text-ink-soft">
          Kâğıtları üye olmadan da çözebilirsin. Atomica hesabınla giriş yaparsan bitirdiğin kâğıtlar ve sürelerin
          kaydedilir; telefondan da bilgisayardan da görürsün.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={girisYap} className="rounded-full bg-navy px-5 py-2.5 text-sm font-extrabold text-white">
            Giriş yap
          </button>
          <button
            type="button"
            onClick={kayitOl}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-navy shadow-[inset_0_0_0_2px_var(--color-navy)]"
          >
            Ücretsiz üye ol
          </button>
        </div>
        {demo && <p className="text-xs text-muted">Demo modu: giriş, sahte bir öğrenciyle bu tarayıcıda yapılır.</p>}
      </div>
    );
  }

  const gruplar = [...new Set(katalog.map((k) => k.grup))];
  const sonraki = katalog.find((k) => ilerleme.get(k.anahtar)?.durum !== "tamamlandi");
  const toplamBiten = katalog.filter((k) => ilerleme.get(k.anahtar)?.durum === "tamamlandi").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-soft p-6">
        <div>
          <p className="text-sm text-ink-soft">Merhaba {kullanici.ad},</p>
          <p className="text-2xl font-extrabold text-navy">
            {toplamBiten} / {katalog.length} kâğıt bitti
          </p>
        </div>
        {sonraki && (
          <Link href={sonraki.href} className="rounded-full bg-navy px-5 py-2.5 text-sm font-extrabold text-white hover:bg-navy-2">
            Sıradaki: {sonraki.ad} →
          </Link>
        )}
      </div>

      {gruplar.map((g) => {
        const liste = katalog.filter((k) => k.grup === g);
        const biten = liste.filter((k) => ilerleme.get(k.anahtar)?.durum === "tamamlandi").length;
        return (
          <section key={g} className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[22px]">{g}</h2>
              <p className="text-sm font-semibold text-muted">
                {biten} / {liste.length} bitti
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${(biten / liste.length) * 100}%` }} />
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {liste.map((k) => {
                const kayit = ilerleme.get(k.anahtar);
                return (
                  <li key={k.anahtar}>
                    <Link
                      href={k.href}
                      prefetch={false}
                      className="flex items-center justify-between gap-2 rounded-[14px] border border-line bg-white px-4 py-3 text-sm hover:border-navy/40"
                    >
                      <span className="font-semibold text-ink">{k.ad}</span>
                      <span
                        className={
                          kayit?.durum === "tamamlandi"
                            ? "font-extrabold text-emerald-700"
                            : kayit
                              ? "font-semibold text-orange-500"
                              : "text-muted"
                        }
                      >
                        {kayit?.durum === "tamamlandi"
                          ? `✓${kayit.sureSn ? ` ${Math.max(1, Math.round(kayit.sureSn / 60))} dk` : ""}`
                          : kayit
                            ? "Başladın"
                            : "—"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
