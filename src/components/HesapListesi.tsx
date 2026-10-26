"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sil, tumSinavKayitlari, type SinavKaydi } from "@/lib/depo";

const FAZ_ADI: Record<SinavKaydi["faz"], string> = {
  hazir: "Başlanmadı",
  cozuluyor: "Çözülüyor",
  puanlama: "Puanlanıyor",
  sonuc: "Tamamlandı",
};

export function HesapListesi() {
  const [kayitlar, setKayitlar] = useState<ReturnType<typeof tumSinavKayitlari> | null>(null);

  // localStorage yalnızca tarayıcıda okunabildiği için effect içinde.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKayitlar(tumSinavKayitlari().sort((a, b) => (b.kayit.tarih ?? "").localeCompare(a.kayit.tarih ?? "")));
  }, []);

  if (kayitlar === null) return <p className="text-muted">Yükleniyor…</p>;

  if (kayitlar.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <p className="font-serif text-xl">Henüz kâğıt çözmedin</p>
        <p className="mt-1 text-ink/80">
          <Link href="/dersler/" className="font-semibold text-forest underline">
            Dersler
          </Link>{" "}
          sayfasından bir kâğıt seçip başlayabilirsin.
        </p>
      </div>
    );
  }

  const temizle = () => {
    if (!window.confirm("Bu tarayıcıdaki tüm kâğıt kayıtların silinecek. Emin misin?")) return;
    kayitlar.forEach((k) => sil(k.anahtar));
    setKayitlar([]);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-forest-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Kâğıt</th>
              <th className="px-4 py-3 font-semibold">Durum</th>
              <th className="px-4 py-3 font-semibold">Tarih</th>
              <th className="px-4 py-3 font-semibold">Puan</th>
              <th className="px-4 py-3 font-semibold">En zayıf konu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {kayitlar.map(({ anahtar, kayit }) => (
              <tr key={anahtar}>
                <td className="px-4 py-3">
                  <Link href={kayit.url} className="font-medium text-forest hover:underline">
                    {kayit.baslik}
                  </Link>
                </td>
                <td className="px-4 py-3">{FAZ_ADI[kayit.faz]}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {kayit.tarih ? new Date(kayit.tarih).toLocaleDateString("tr-TR") : "—"}
                </td>
                <td className="px-4 py-3 font-semibold tabular-nums">{kayit.puan ?? "—"}</td>
                <td className="px-4 py-3">
                  {kayit.enZayif ? (
                    <Link href={kayit.enZayif.href} className="hover:text-forest hover:underline">
                      {kayit.enZayif.ad} (%{kayit.enZayif.yuzde})
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={temizle} className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-red-300 hover:text-red-700">
        Verileri temizle
      </button>
    </div>
  );
}
