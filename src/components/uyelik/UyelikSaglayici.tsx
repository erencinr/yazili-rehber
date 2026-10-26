"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoGirisYap, uyelik, UYELIK_MODU, type IlerlemeDurumu, type IlerlemeKaydi, type Kullanici } from "@/lib/uyelik";

type Durum = {
  /** undefined: henüz yükleniyor; null: giriş yapılmamış. */
  kullanici: Kullanici | null | undefined;
  ilerleme: Map<string, IlerlemeKaydi>;
  demo: boolean;
  girisYap: () => void;
  kayitOl: () => void;
  cikisYap: () => void;
  kaydet: (kagit: string, durum: IlerlemeDurumu, sureSn?: number) => Promise<void>;
};

const Baglam = createContext<Durum | null>(null);

function buSayfa() {
  return window.location.pathname + window.location.search;
}

export function UyelikSaglayici({ children }: { children: ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null | undefined>(undefined);
  const [kayitlar, setKayitlar] = useState<IlerlemeKaydi[]>([]);

  const yukle = useCallback(async () => {
    try {
      const k = await uyelik.oturum();
      setKullanici(k);
      setKayitlar(k ? await uyelik.ilerleme() : []);
    } catch {
      // Sunucuya ulaşılamazsa site üyeliksiz çalışmaya devam eder.
      setKullanici(null);
    }
  }, []);

  useEffect(() => {
    // Oturum yalnızca tarayıcıda bilinir (çerez/localStorage); statik sayfa önce misafir gibi çizilir.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void yukle();
  }, [yukle]);

  const deger = useMemo<Durum>(
    () => ({
      kullanici,
      ilerleme: new Map(kayitlar.map((k) => [k.kagit, k])),
      demo: UYELIK_MODU === "demo",
      girisYap: () => {
        if (UYELIK_MODU === "demo") {
          demoGirisYap();
          void yukle();
        } else window.location.href = uyelik.girisAdresi(buSayfa());
      },
      kayitOl: () => {
        if (UYELIK_MODU === "demo") {
          demoGirisYap();
          void yukle();
        } else window.location.href = uyelik.kayitAdresi(buSayfa());
      },
      cikisYap: () => {
        void uyelik.cikis(buSayfa()).then(yukle);
      },
      kaydet: async (kagit, durum, sureSn) => {
        if (!kullanici) return;
        await uyelik.kaydet(kagit, durum, sureSn);
        setKayitlar(await uyelik.ilerleme());
      },
    }),
    [kullanici, kayitlar, yukle],
  );

  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export function useUyelik() {
  const d = useContext(Baglam);
  if (!d) throw new Error("useUyelik, UyelikSaglayici içinde kullanılmalı");
  return d;
}
