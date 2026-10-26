// Rehber sayfaları. Metinler şimdilik yer tutucudur; gerçek içerik yazılınca burası
// (ileride MDX dosyaları) doldurulacak. Doğrulanmamış bilgi yazma.

export type Sayfa = {
  slug: string;
  baslik: string;
  menuAdi: string;
  eyebrow: string;
  aciklama: string;
  ozet: string;
  guncelleme: string;
  bakista?: { etiket: string; deger: string }[];
  bolumler: { id: string; baslik: string; paragraflar: string[] }[];
  sss?: { soru: string; cevap: string }[];
  yasal?: boolean;
};

const YER_TUTUCU = "Bu bölümün içeriği hazırlanıyor. Resmî kaynaklar doğrulandıktan sonra eklenecek.";

function taslak(
  slug: string,
  menuAdi: string,
  baslik: string,
  eyebrow: string,
  aciklama: string,
  bolumBasliklari: string[],
  ek: Partial<Sayfa> = {},
): Sayfa {
  return {
    slug,
    menuAdi,
    baslik,
    eyebrow,
    aciklama,
    ozet: aciklama,
    guncelleme: "2026-10-26",
    bolumler: bolumBasliklari.map((b, i) => ({ id: `bolum-${i + 1}`, baslik: b, paragraflar: [YER_TUTUCU] })),
    ...ek,
  };
}

export const sayfalar: Sayfa[] = [
  taslak(
    "oyss-nedir",
    "OYSS nedir",
    "OYSS nedir? Ortak Yazılı Sınav Sistemi rehberi",
    "OYSS rehberi",
    "Ortak Yazılı Sınav Sistemi'nin ne olduğu, kimleri kapsadığı ve okuldaki yazılıları nasıl değiştirdiği.",
    ["Sistem neden kuruldu?", "Kimleri kapsıyor?", "Okuldaki yazılılardan farkı", "Öğrenci için ne değişiyor?"],
    {
      bakista: [
        { etiket: "Başlangıç", deger: "26 Ekim 2026" },
        { etiket: "Kademe", deger: "5-7 ve 9-11. sınıflar" },
        { etiket: "Sınav kâğıdı", deger: "Senaryo esaslı, 100 puan" },
        { etiket: "Giriş", deger: "EBA üzerinden" },
      ],
      sss: [
        { soru: "OYSS hangi tarihte başladı?", cevap: "Sistem 26 Ekim 2026'da kullanılmaya başlandı." },
        { soru: "OYSS'de sorular nasıl hazırlanıyor?", cevap: YER_TUTUCU },
      ],
    },
  ),
  taslak("oyss-nasil-calisir", "Nasıl çalışır", "OYSS nasıl çalışır? Senaryodan karneye adım adım", "Süreç", "Sınavın hazırlanmasından puanların sisteme girilmesine kadar tüm adımlar.", ["Hazırlık", "Uygulama", "Değerlendirme", "Sonuçların paylaşılması"]),
  taslak("oyss-senaryo-nedir", "Senaryo nedir", "OYSS'de senaryo nedir?", "Kavramlar", "Senaryo kâğıdının ne olduğu ve aynı yazılının neden birden çok senaryosu bulunduğu.", ["Senaryo kavramı", "Dağılım tablosu nasıl okunur?", "Senaryo nasıl seçilir?"]),
  taslak("oyss-kilavuzu", "Kılavuz", "OYSS kılavuzu özeti", "Kılavuz", "Resmî uygulama kılavuzunun öğretmen, öğrenci ve veli için sade özeti.", ["Kılavuzun amacı", "Öğretmenin görevleri", "Puanlama ilkeleri", "Sık yapılan hatalar"]),
  taslak("oyss-kapsami", "Kapsam", "OYSS kapsamı: Hangi sınıf ve dersler dahil?", "Kapsam", "Ortak yazılı sınava giren sınıflar ve dersler.", ["Ortaokul", "Lise", "Kapsam dışı durumlar"]),
  taslak("oyss-giris", "Giriş", "OYSS giriş: Sisteme nasıl girilir?", "Giriş", "Öğretmen ve öğrencilerin sisteme hangi adımlarla giriş yaptığı.", ["Kimler giriş yapar?", "Giriş adımları", "Sorun yaşarsanız"]),
  taslak("oyss-ogretmen-rehberi", "Öğretmen rehberi", "OYSS öğretmen rehberi", "Öğretmenler için", "Sınavı nasıl kurarsınız, senaryoyu nasıl seçersiniz, kâğıtları nasıl puanlarsınız?", ["Sınavdan önce", "Sınav günü", "Puanlama ve giriş", "Yazdırılabilir kâğıtlar"]),
  taslak("oyss-ogrenci-rehberi", "Öğrenci rehberi", "OYSS öğrenci rehberi: Sınavda ne çıkacak?", "Öğrenciler için", "Yazılıya nasıl hazırlanırsın, kâğıtta ne tür sorular var, kendini nasıl puanlarsın?", ["Kâğıdın yapısı", "Nasıl çalışmalı?", "Sitede kâğıt çözmek"]),
  taslak("oyss-veli-rehberi", "Veli rehberi", "OYSS veli rehberi: Rapor ne anlatıyor?", "Veliler için", "Sonuç raporunu nasıl okursunuz ve evde nasıl destek olabilirsiniz?", ["Rapor nasıl okunur?", "Evde destek", "Öğretmenle iletişim"]),
  taslak("oyss-sss", "SSS", "OYSS sık sorulan sorular", "SSS", "Ortak yazılı sınav sistemi hakkında en çok sorulan sorular.", [], {
    sss: [
      { soru: "Bu site MEB'in resmî sitesi mi?", cevap: "Hayır. Bu site bağımsız bir rehber ve yazılıya hazırlık sitesidir." },
      { soru: "Sitedeki kâğıtlar gerçek sınav soruları mı?", cevap: "Hayır. Kâğıtlar gerçek sınav formatına benzer biçimde hazırlanmış özgün çalışma kâğıtlarıdır." },
      { soru: "Puanlarım nereye kaydediliyor?", cevap: "Yalnızca kendi tarayıcına. Üyelik yoktur, sunucuya veri gönderilmez." },
    ],
  }),
  taslak("kaynaklar", "Kaynaklar", "Kaynaklar ve resmî bağlantılar", "Kaynaklar", "Resmî duyurular, kılavuzlar ve yararlı bağlantılar.", ["Resmî bağlantılar", "Duyurular"]),
  taslak("hakkinda", "Hakkında", "Hakkında", "Hakkında", "Bu sitenin amacı ve kimler tarafından hazırlandığı.", ["Amacımız", "İletişim"], { yasal: true }),
  taslak("sorumluluk-reddi", "Sorumluluk reddi", "Sorumluluk reddi", "Yasal", "Sitedeki bilgilerin kullanımıyla ilgili açıklama.", ["Bilgilerin niteliği"], { yasal: true }),
  taslak("kullanim-sartlari", "Kullanım şartları", "Kullanım şartları", "Yasal", "Siteyi kullanırken geçerli şartlar.", ["Genel şartlar"], { yasal: true }),
  taslak("gizlilik", "Gizlilik", "Gizlilik politikası", "Yasal", "Hangi verilerin nerede tutulduğu.", ["Tarayıcıda tutulan veriler", "Çerezler"], { yasal: true }),
];

export function getSayfa(slug: string) {
  return sayfalar.find((s) => s.slug === slug);
}
