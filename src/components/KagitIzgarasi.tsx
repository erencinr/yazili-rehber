import Link from "next/link";
import { kagitAnahtari, SEVIYE_ADI, SEVIYE_RENK, SEVIYELER, senaryoGruplari, varlik } from "@/lib/kagit";
import { KagitIsareti } from "./uyelik/KagitIsareti";
import type { Yazili } from "@/lib/types";

/** Bir yazılının Atomica kâğıtları: senaryo başına Kolay / Orta / Zor ya da seviyeye göre provalar. */
export function KagitIzgarasi({ yazili, taban }: { yazili: Yazili; taban: string }) {
  const dugme = (seviye: keyof typeof SEVIYE_ADI) =>
    `inline-flex min-w-[84px] justify-center rounded-full px-4 py-2 text-sm font-extrabold text-white ${SEVIYE_RENK[seviye]}`;

  return (
    <div className="space-y-3">
      {yazili.kagitTuru === "prova"
        ? SEVIYELER.map((seviye) => {
            const liste = yazili.kagitlar.filter((k) => k.seviye === seviye);
            if (liste.length === 0) return null;
            return (
              <div key={seviye} className="flex flex-wrap items-center gap-3 rounded-[18px] border border-line bg-white p-4">
                <p className="w-24 font-extrabold text-navy">{SEVIYE_ADI[seviye]}</p>
                <div className="flex flex-wrap gap-2">
                  {liste.map((k) => (
                    <Link key={k.slug} href={`${taban}${k.slug}/`} prefetch={false} className={dugme(seviye)}>
                      Prova {k.no}
                      <KagitIsareti kagit={kagitAnahtari(taban, k.slug)} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        : senaryoGruplari(yazili).map(([no, liste]) => (
            <div key={no} className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-line bg-white p-4">
              <div>
                <p className="font-extrabold text-navy">Senaryo {no}</p>
                <p className="text-sm text-muted">{liste[0].sorular.length} soru · 40 dakika · 100 puan</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SEVIYELER.map((seviye) => {
                  const k = liste.find((x) => x.seviye === seviye);
                  return k ? (
                    <Link key={seviye} href={`${taban}${k.slug}/`} prefetch={false} className={dugme(seviye)}>
                      {SEVIYE_ADI[seviye]}
                      <KagitIsareti kagit={kagitAnahtari(taban, k.slug)} />
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          ))}
      {yazili.kitapcik && (
        <p className="text-sm text-muted">
          Tüm kâğıtları tek dosyada istersen:{" "}
          <a href={varlik(yazili.kitapcik)} download className="font-semibold text-turq hover:underline">
            kitapçığı indir (PDF)
          </a>
        </p>
      )}
    </div>
  );
}
