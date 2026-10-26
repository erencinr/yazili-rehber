// Marka ve site geneli ayarlar. Marka adı değişince yalnızca burayı düzenle.
export const site = {
  marka: "Yazılı Rehber",
  altBaslik: "Ortak yazılı sınav",
  aciklama:
    "Ortak Yazılı Sınav Sistemi (OYSS) için öğrenci, öğretmen ve veli rehberi; gerçek formatta yazılı kâğıtlarını çöz ve kendini puanla.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yazilirehber.example",
  egitimYili: "2026-2027",
  nav: [
    { ad: "OYSS nedir", href: "/oyss-nedir/" },
    { ad: "Nasıl çalışır", href: "/oyss-nasil-calisir/" },
    { ad: "Kılavuz", href: "/oyss-kilavuzu/" },
    { ad: "Takvim", href: "/ortak-yazili-takvimi/" },
    { ad: "Dersler", href: "/dersler/" },
  ],
  kimlerIcin: [
    { ad: "Öğretmen", kart: "Öğretmenim", href: "/oyss-ogretmen-rehberi/", soru: "Sınavı nasıl kurarım?" },
    { ad: "Öğrenci", kart: "Öğrenciyim", href: "/oyss-ogrenci-rehberi/", soru: "Sınavda ne çıkar?" },
    { ad: "Veli", kart: "Veliyim", href: "/oyss-veli-rehberi/", soru: "Rapor ne anlatır?" },
  ],
  resmiLinkler: [
    { ad: "EBA", href: "https://www.eba.gov.tr/" },
    { ad: "Millî Eğitim Bakanlığı", href: "https://www.meb.gov.tr/" },
    { ad: "MEB Ölçme, Değerlendirme ve Sınav Hizmetleri", href: "https://odsgm.meb.gov.tr/" },
  ],
} as const;

export function mutlakUrl(yol: string) {
  return new URL(yol, site.url).toString();
}
