"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  ciktilar: { id: string; unite: string; metin: string }[];
  senaryolar: { no: number; dagilim: Record<string, number | null> }[];
  hrefOnEk: string;
};

export function ScenarioTable({ ciktilar, senaryolar, hrefOnEk }: Props) {
  const [secili, setSecili] = useState<number | null>(null);
  const gorunen = secili === null ? senaryolar : senaryolar.filter((s) => s.no === secili);
  const chip = (aktif: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium ${aktif ? "border-forest bg-forest text-white" : "border-line bg-white hover:border-forest/40"}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Senaryo filtresi">
        <button type="button" className={chip(secili === null)} onClick={() => setSecili(null)}>
          Tümü
        </button>
        {senaryolar.map((s) => (
          <button key={s.no} type="button" className={chip(secili === s.no)} onClick={() => setSecili(s.no)}>
            Senaryo {s.no}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-forest-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Öğrenme çıktısı</th>
              {gorunen.map((s) => (
                <th key={s.no} className="px-4 py-3 text-center font-semibold whitespace-nowrap">
                  <Link href={`${hrefOnEk}senaryo-${s.no}/`} className="text-forest hover:underline">
                    Senaryo {s.no}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ciktilar.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <span className="text-muted">{c.unite} · </span>
                  {c.metin}
                </td>
                {gorunen.map((s) => (
                  <td key={s.no} className="px-4 py-3 text-center tabular-nums">
                    {s.dagilim[c.id] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-paper font-semibold">
              <td className="px-4 py-3">Toplam soru</td>
              {gorunen.map((s) => (
                <td key={s.no} className="px-4 py-3 text-center tabular-nums">
                  {Object.values(s.dagilim).reduce<number>((t, v) => t + (v ?? 0), 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
