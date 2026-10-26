// Marka ve site geneli ayarlar. Marka adı değişince yalnızca burayı düzenle.
export const site = {
  marka: "Atomica Yazılıya Hazırlık",
  altBaslik: "Yazılıya Hazırlık",
  aciklama:
    "5, 6 ve 7. sınıf matematik yazılı soruları: MEB senaryolarına uygun, kolay, orta ve zor seviyede kâğıtlar. Ekranda çöz ya da yazdır.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atomica.com.tr/yazili",
  // Ana site: menü, logo ve "Şimdi Oyna / Paketler" bağlantıları buraya gider.
  atomica: {
    anaSayfa: "https://atomica.com.tr/",
    logo: "https://atomica.com.tr/assets/logo.png",
    logoBeyaz: "https://atomica.com.tr/assets/logo-white.png",
    favicon: "https://atomica.com.tr/favicon.png",
    oyna: "https://games.atomica.com.tr/",
    paketler: "https://atomica.com.tr/paketler/",
    // Üyelik Atomica hesabıyla: giriş/kayıt Atomica'nın kendi sayfalarında yapılır (bkz. docs/uyelik-entegrasyon.md).
    giris: "https://atomica.com.tr/login",
    kayit: "https://atomica.com.tr/register/student",
    cikis: "https://atomica.com.tr/logout",
    yasal: [
      { ad: "KVKK", href: "https://atomica.com.tr/yasal/kvkk.html" },
      { ad: "Gizlilik", href: "https://atomica.com.tr/yasal/gizlilik.html" },
      { ad: "Çerez politikası", href: "https://atomica.com.tr/yasal/cerez-politikasi.html" },
      { ad: "Kullanım koşulları", href: "https://atomica.com.tr/yasal/kullanim-kosullari.html" },
    ],
  },
  egitimYili: "2026-2027",
  // Sitede yayınlanan dersler (dersler.json'daki slug'lar). Diğer derslerin verisi data/ altında durur;
  // yayına almak için slug'ı buraya eklemek yeterli.
  yayindakiDersler: ["ortaokul-matematik"],
  // Üst menü: önce sınıflar (kâğıtlara tek tıkla ulaşmak için), sonra takvim ve rehber.
  nav: [
    { ad: "5. Sınıf", href: "/dersler/ortaokul-matematik/5-sinif/" },
    { ad: "6. Sınıf", href: "/dersler/ortaokul-matematik/6-sinif/" },
    { ad: "7. Sınıf", href: "/dersler/ortaokul-matematik/7-sinif/" },
    { ad: "Takvim", href: "/ortak-yazili-takvimi/" },
    { ad: "OYSS nedir", href: "/oyss-nedir/" },
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

/** Site adresi alt yol içerebilir (ör. GitHub Pages: https://kullanici.github.io/repo). */
export function mutlakUrl(yol: string) {
  return site.url.replace(/\/$/, "") + yol;
}
