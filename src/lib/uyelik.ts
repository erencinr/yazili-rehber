// Üyelik: öğrenci Atomica hesabıyla giriş yapar; çözdüğü kâğıtlar hesabına kaydedilir.
// Kâğıtlar herkese açıktır; üyelik yalnızca ilerlemeyi kaydetmek için gerekir.
//
// İki mod var (NEXT_PUBLIC_UYELIK_MODU):
//   "atomica" → Atomica sunucusundaki API'ler (sözleşme: docs/uyelik-entegrasyon.md)
//   "demo"    → sunucu olmadan akışı denemek için sahte öğrenci; veriler bu tarayıcıda tutulur
// atomica.com.tr/yazili üzerinde site ile API aynı alan adında olduğu için Atomica'nın oturum çerezi kendiliğinden gider.

import { site } from "@/config/site";

export type Kullanici = { id: string; ad: string; rol: "ogrenci" | "ogretmen" | "veli" };
export type IlerlemeDurumu = "baslandi" | "tamamlandi";
export type IlerlemeKaydi = {
  /** "<ders>/<sinif>/<yazili>/<kagit>" ör. "ortaokul-matematik/5-sinif/1-yazili-sorulari/senaryo-1-kolay" */
  kagit: string;
  durum: IlerlemeDurumu;
  /** Süre tutulduysa geçen saniye. */
  sureSn?: number;
  /** ISO tarih (sunucu yazar). */
  tarih: string;
};

export interface UyelikIstemcisi {
  oturum(): Promise<Kullanici | null>;
  ilerleme(): Promise<IlerlemeKaydi[]>;
  kaydet(kagit: string, durum: IlerlemeDurumu, sureSn?: number): Promise<void>;
  /** Giriş sayfasının adresi; giriş bitince `donus` sayfasına geri gelinir. */
  girisAdresi(donus: string): string;
  kayitAdresi(donus: string): string;
  cikis(donus: string): Promise<void>;
}

export const UYELIK_MODU = (process.env.NEXT_PUBLIC_UYELIK_MODU ?? "demo") as "atomica" | "demo";
const API = `${process.env.NEXT_PUBLIC_ATOMICA_API ?? ""}/api/yazili`;

// ---------- Atomica ----------

const atomica: UyelikIstemcisi = {
  async oturum() {
    const yanit = await fetch(`${API}/oturum`, { credentials: "include", cache: "no-store" });
    if (yanit.status === 401) return null;
    if (!yanit.ok) throw new Error(`oturum: ${yanit.status}`);
    return ((await yanit.json()) as { kullanici: Kullanici }).kullanici;
  },
  async ilerleme() {
    const yanit = await fetch(`${API}/ilerleme`, { credentials: "include", cache: "no-store" });
    if (!yanit.ok) return [];
    return ((await yanit.json()) as { kayitlar: IlerlemeKaydi[] }).kayitlar;
  },
  async kaydet(kagit, durum, sureSn) {
    const yanit = await fetch(`${API}/ilerleme/${encodeURIComponent(kagit)}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durum, sureSn }),
    });
    if (!yanit.ok) throw new Error(`kaydet: ${yanit.status}`);
  },
  girisAdresi: (donus) => `${site.atomica.giris}?next=${encodeURIComponent(donus)}`,
  kayitAdresi: (donus) => `${site.atomica.kayit}?next=${encodeURIComponent(donus)}`,
  async cikis(donus) {
    // Atomica'nın kendi çıkış adresi (bu sitenin iç sayfası değil).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `${site.atomica.cikis}?next=${encodeURIComponent(donus)}`;
  },
};

// ---------- Demo (sunucusuz) ----------

const DEMO_OTURUM = "atomica-yazili:demo-oturum";
const DEMO_ILERLEME = "atomica-yazili:demo-ilerleme";

function demoOku<T>(anahtar: string, varsayilan: T): T {
  try {
    const ham = window.localStorage.getItem(anahtar);
    return ham ? (JSON.parse(ham) as T) : varsayilan;
  } catch {
    return varsayilan;
  }
}
function demoYaz(anahtar: string, deger: unknown) {
  try {
    window.localStorage.setItem(anahtar, JSON.stringify(deger));
  } catch {}
}

const demo: UyelikIstemcisi = {
  async oturum() {
    return demoOku<Kullanici | null>(DEMO_OTURUM, null);
  },
  async ilerleme() {
    return demoOku<IlerlemeKaydi[]>(DEMO_ILERLEME, []);
  },
  async kaydet(kagit, durum, sureSn) {
    const liste = demoOku<IlerlemeKaydi[]>(DEMO_ILERLEME, []).filter((k) => k.kagit !== kagit);
    const onceki = demoOku<IlerlemeKaydi[]>(DEMO_ILERLEME, []).find((k) => k.kagit === kagit);
    // Tamamlanmış kâğıt yeniden başlatılınca "tamamlandı" bilgisi kaybolmaz.
    const yeniDurum = onceki?.durum === "tamamlandi" && durum === "baslandi" ? "tamamlandi" : durum;
    demoYaz(DEMO_ILERLEME, [...liste, { kagit, durum: yeniDurum, sureSn: sureSn ?? onceki?.sureSn, tarih: new Date().toISOString() }]);
  },
  // Demo'da giriş sayfası yok: düğme doğrudan sahte öğrenciyle giriş yapar (UyelikSaglayici).
  girisAdresi: () => "#demo-giris",
  kayitAdresi: () => "#demo-giris",
  async cikis() {
    try {
      window.localStorage.removeItem(DEMO_OTURUM);
    } catch {}
  },
};

export function demoGirisYap() {
  demoYaz(DEMO_OTURUM, { id: "demo", ad: "Demo Öğrenci", rol: "ogrenci" } satisfies Kullanici);
}

export const uyelik: UyelikIstemcisi = UYELIK_MODU === "atomica" ? atomica : demo;
