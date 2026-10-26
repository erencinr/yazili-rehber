// localStorage erişimi. Gizli pencere veya engellenmiş depolamada sessizce boş döner.

// atomica.com.tr ana uygulamasıyla aynı origin; anahtarlar çakışmasın diye ön ekli.
export const SINAV_ONEK = "atomica-yazili:sinav:";

export type Faz = "hazir" | "cozuluyor" | "puanlama" | "sonuc";

export type SinavKaydi = {
  faz: Faz;
  baslangic?: number;
  cevaplar: Record<string, string>;
  isaretler: Record<string, number[]>;
  puan?: number;
  tarih?: string;
  baslik: string;
  url: string;
  enZayif?: { ad: string; href: string; yuzde: number };
};

export function oku<T>(anahtar: string): T | null {
  try {
    const ham = window.localStorage.getItem(anahtar);
    return ham ? (JSON.parse(ham) as T) : null;
  } catch {
    return null;
  }
}

export function yaz(anahtar: string, deger: unknown) {
  try {
    window.localStorage.setItem(anahtar, JSON.stringify(deger));
  } catch {
    // depolama kapalı veya dolu
  }
}

export function sil(anahtar: string) {
  try {
    window.localStorage.removeItem(anahtar);
  } catch {}
}

export function tumSinavKayitlari(): { anahtar: string; kayit: SinavKaydi }[] {
  try {
    const sonuc: { anahtar: string; kayit: SinavKaydi }[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const anahtar = window.localStorage.key(i);
      if (!anahtar?.startsWith(SINAV_ONEK)) continue;
      const kayit = oku<SinavKaydi>(anahtar);
      if (kayit) sonuc.push({ anahtar, kayit });
    }
    return sonuc;
  } catch {
    return [];
  }
}
