"use client";

import { useUyelik } from "./UyelikSaglayici";

/** Kâğıt düğmesinin içinde: giriş yapan öğrenci bu kâğıdı bitirdiyse ✓. */
export function KagitIsareti({ kagit }: { kagit: string }) {
  const { ilerleme } = useUyelik();
  if (ilerleme.get(kagit)?.durum !== "tamamlandi") return null;
  return (
    <span className="ml-1.5" aria-label="tamamlandı" title="Tamamlandı">
      ✓
    </span>
  );
}
