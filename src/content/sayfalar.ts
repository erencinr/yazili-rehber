// Rehber sayfaları. Bilgiler resmî kaynaklardan (MEB, ÖDSGM, Resmî Gazete) alınmıştır;
// her sayfanın altında kaynak bağlantıları listelenir. Doğrulanmamış bilgi yazma.

export type Kaynak = { ad: string; url: string };

export type Sayfa = {
  slug: string;
  baslik: string;
  menuAdi: string;
  eyebrow: string;
  aciklama: string;
  ozet: string;
  guncelleme: string;
  bakista?: { etiket: string; deger: string }[];
  bolumler: { id: string; baslik: string; paragraflar: string[]; liste?: string[] }[];
  sss?: { soru: string; cevap: string }[];
  kaynaklar?: Kaynak[];
  yasal?: boolean;
};

export const KAYNAK = {
  kilavuz: {
    ad: "MEB, Ortak Yazılı Sınav Sistemi (OYSS) Uygulama Kılavuzu (Ekim 2026)",
    url: "https://www.meb.gov.tr/meb_iys_dosyalar/2026_10/6ad703eb1bb29010473792_Ortak_Yazili_Sinav_Sistemi_OYSS_Uygulama_Kilavuzu.pdf",
  },
  duyuru: {
    ad: "ÖDSGM, OYSS Uygulama Kılavuzu yayımlandı (duyuru)",
    url: "https://odsgm.meb.gov.tr/www/ortak-yazili-sinav-sistemi-uygulama-kilavuzu-yayimlandi/icerik/1748/tr",
  },
  okulTakvim: {
    ad: "MEB, Okul Geneli OYSS Uygulama Takvimi",
    url: "https://www.meb.gov.tr/meb_iys_dosyalar/2026_10/6ad703df743f8654049216_Okul_Geneli_Ortak_Yazili_Sinav_Sistemi_Uygulama_Takvimi.pdf",
  },
  ulkeTakvim: {
    ad: "ÖDSGM, 2026-2027 Ülke Geneli Ortak Yazılı Sınav Takvimi",
    url: "https://odsgm.meb.gov.tr/meb_iys_dosyalar/2026_09/6aa2d6b17db57454479127_Ulke_Geneli_Ortak_Yaz%C4%B1l%C4%B1_S%C4%B1nav_Takvimi.pdf",
  },
  tablolar: {
    ad: "ÖDSGM, 1. Dönem Konu-Soru Dağılım Tabloları (2026-2027)",
    url: "https://odsgm.meb.gov.tr/www/1donem-konu-soru-dagilim-tablolari-2026-2027/icerik/1724",
  },
  yonetmelik: {
    ad: "Ölçme ve Değerlendirme Yönetmeliği (Resmî Gazete, 09.09.2023, sayı 32304)",
    url: "https://www.resmigazete.gov.tr/eskiler/2023/09/20230909-2.htm",
  },
  tanitim: {
    ad: "ÖDSGM, Ortak Yazılı Sınav Sistemi tanıtım programı",
    url: "https://odsgm.meb.gov.tr/www/quotortak-yazili-sinav-sistemiquot-tanitim-programi-duzenlendi/icerik/1746/tr",
  },
} satisfies Record<string, Kaynak>;

const GUNCELLEME = "2026-10-26";

const kimIcinSss = {
  resmiMi: {
    soru: "Bu site MEB'in resmî sitesi mi?",
    cevap: "Hayır. Bu site bağımsız bir rehber ve yazılıya hazırlık sitesidir. Bilgiler resmî kaynaklardan derlenir; her sayfanın altında kaynak bağlantıları vardır.",
  },
  sitedekiSorular: {
    soru: "Sitedeki kâğıtlar gerçek sınav soruları mı?",
    cevap: "Hayır. Soru sayıları ve öğrenme çıktıları resmî konu-soru dağılım tablolarına uygundur; sorular ise çalışma amaçlı hazırlanmış özgün sorulardır.",
  },
};

export const sayfalar: Sayfa[] = [
  {
    slug: "oyss-nedir",
    menuAdi: "OYSS nedir",
    baslik: "OYSS nedir? Ortak Yazılı Sınav Sistemi rehberi",
    eyebrow: "OYSS rehberi",
    aciklama: "Ortak Yazılı Sınav Sistemi'nin ne olduğu, neden kurulduğu, hangi sınıf ve dersleri kapsadığı.",
    ozet: "OYSS, okullardaki ortak yazılı sınavların Bakanlığın dijital sistemi üzerinden, ortak bir standartla hazırlandığı yeni uygulamadır. 2026-2027 eğitim öğretim yılının ilk yazılılarıyla başladı.",
    guncelleme: GUNCELLEME,
    bakista: [
      { etiket: "Sisteme açılış", deger: "26 Ekim 2026" },
      { etiket: "Kademe", deger: "5-7 ve 9-11. sınıflar" },
      { etiket: "Soru türü", deger: "Açık uçlu, toplam 100 puan" },
      { etiket: "Öğretmen girişi", deger: "eba.gov.tr üzerinden" },
    ],
    bolumler: [
      {
        id: "neden",
        baslik: "Sistem neden kuruldu?",
        paragraflar: [
          "Bakanlığa göre amaç, okullardaki ortak yazılıları daha geçerli ve güvenilir hâle getirmek, öğrenme çıktılarıyla uyumlu ve beceri temelli açık uçlu soruların kullanımını yaygınlaştırmak ve okullar arasında ortak bir standart sağlamaktır. Sistem Türkiye Yüzyılı Maarif Modeli'ne dayanır.",
          "Uygulama, 2025-2026 eğitim öğretim yılının 2. döneminde 11 ilde, 9. sınıf Din Kültürü ve Ahlak Bilgisi ile 10. sınıf Felsefe derslerinde pilot olarak denendi.",
        ],
      },
      {
        id: "kapsam",
        baslik: "Kimleri kapsıyor?",
        paragraflar: [
          "OYSS, 2026-2027 1. dönem 1. yazılılardan itibaren resmî ve özel ortaokullarda ve liselerde uygulanıyor.",
        ],
        liste: [
          "Ortaokul (5, 6, 7. sınıf): Türkçe, Matematik, Fen Bilimleri, Sosyal Bilgiler, Din Kültürü ve Ahlak Bilgisi, İngilizce.",
          "Lise (9, 10, 11. sınıf): Türk Dili ve Edebiyatı, Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Din Kültürü ve Ahlak Bilgisi, Felsefe, İngilizce.",
          "7. ve 11. sınıf İngilizce derslerinde OYSS uygulanmıyor.",
        ],
      },
      {
        id: "fark",
        baslik: "Eski yazılılardan farkı ne?",
        paragraflar: [
          "Önceden ortak yazılı kâğıdını okuldaki zümre tamamen kendisi hazırlıyordu. OYSS'de kâğıdın yapısını Bakanlığın yayımladığı konu-soru dağılım tablosu belirliyor: zümre bu tablodaki senaryolardan birini seçiyor.",
          "Seçilen senaryodaki iki öğrenme çıktısı için soruları okulun zümresi yazıyor; diğer sorular Bakanlığın soru havuzundan geliyor. Kâğıt sistem üzerinde oluşturuluyor, yazdırılıyor ve sınıfta uygulanıyor.",
        ],
      },
      {
        id: "ogrenci",
        baslik: "Öğrenci için ne değişiyor?",
        paragraflar: [
          "Sorular açık uçlu. Yani şık işaretlemek yerine cevabını yazarak açıklaman gerekiyor. Kâğıt toplam 100 puan; her sorunun puanı kâğıtta yazıyor.",
          "Sınavdan önce hangi senaryonun seçildiği öğrencilere duyuruluyor. Böylece hangi öğrenme çıktısından kaç soru geleceğini önceden bilebiliyorsun.",
        ],
      },
    ],
    sss: [
      { soru: "OYSS ne zaman başladı?", cevap: "Sistem 26 Ekim 2026'da kullanıma açıldı; ilk sınavlar 2026-2027 1. dönem 1. yazılılardır." },
      { soru: "OYSS hangi sınıflarda uygulanıyor?", cevap: "Ortaokulda 5, 6 ve 7. sınıflarda, lisede 9, 10 ve 11. sınıflarda. 7. ve 11. sınıf İngilizce dersi kapsam dışıdır." },
      { soru: "OYSS'de test sorusu var mı?", cevap: "Hayır. Sorular açık uçlu ya da açık uçlu ve kısa cevaplıdır." },
      kimIcinSss.resmiMi,
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.duyuru, KAYNAK.yonetmelik],
  },
  {
    slug: "oyss-nasil-calisir",
    menuAdi: "Nasıl çalışır",
    baslik: "OYSS nasıl çalışır? Senaryodan e-Okul'a adım adım",
    eyebrow: "Süreç",
    aciklama: "Senaryonun seçilmesinden puanların e-Okul'a girilmesine kadar OYSS'nin tüm adımları.",
    ozet: "Bir OYSS sınavı; senaryonun seçilmesi, soruların hazırlanması, kâğıdın oluşturulması, sınavın uygulanması ve puanların e-Okul'a girilmesi adımlarından oluşur.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "senaryo",
        baslik: "1. Senaryo seçilir",
        paragraflar: [
          "Okuldaki ders zümresi, ÖDSGM'nin yayımladığı konu-soru dağılım tablosundan bir senaryo seçer ve bunu sınavdan önce öğrencilere duyurur. Zümre başkanı aynı senaryoyu sistemde seçer. Senaryo kaydedildikten sonra değiştirilemez.",
        ],
      },
      {
        id: "sorular",
        baslik: "2. Sorular hazırlanır",
        paragraflar: [
          "Senaryodaki iki öğrenme çıktısı için soruları ve puanlama anahtarını okulun zümre öğretmenleri yazar. Kalan sorular Bakanlığın soru havuzundan gelir.",
          "Havuzdaki sorular sınavdan 4 gün önce öğretmenlerin görebileceği şekilde açılır. Zümre, gerekçesini belirterek en fazla iki havuz sorusunu değiştirebilir. Öğretmenler soruların ve cevap anahtarının doğruluğunu kontrol edip sistemde onaylar.",
        ],
      },
      {
        id: "kagit",
        baslik: "3. Kâğıt oluşturulur",
        paragraflar: [
          "Soruların güçlük düzeyi (kolay, orta, zor) ve puanları zümre tarafından belirlenir; toplam 100 puandır. Kâğıt en fazla 4 sayfa olacak şekilde tasarlanır. Kaydedilen kâğıt artık değiştirilemez; indirilir ya da yazdırılır, cevap anahtarının da çıktısı alınır.",
        ],
      },
      {
        id: "uygulama",
        baslik: "4. Sınav uygulanır",
        paragraflar: [
          "Sınavı, o ders saatinde ilgili sınıfta dersi olan öğretmen uygular. İkili öğretim yapan okullarda sabahçı ve öğlenci gruplara farklı sorular sorulur. 1. dönem 1. yazılılarda süre 40 dakikadır.",
        ],
      },
      {
        id: "puanlama",
        baslik: "5. Puanlanır ve e-Okul'a girilir",
        paragraflar: [
          "Kâğıtları dersin öğretmeni cevap anahtarına göre okur. Öğretmen, öğrencinin sınava katılım durumunu ve her sorudan aldığı puanı e-Okul'a girer. OYSS sınavı, o dönemin yazılı notu olarak ders puanına katılır.",
          "Toplu sonuç listeleri yayımlanmaz; okullar ve sınıflar arasında karşılaştırma yapılmaz. Öğretmen sistemde öğrenme çıktısı bazında raporları görebilir.",
        ],
      },
    ],
    sss: [
      { soru: "Kâğıttaki soruların kaçını öğretmen yazar?", cevap: "Seçilen senaryodaki iki öğrenme çıktısı için soruları okulun zümresi yazar; kalan sorular Bakanlığın soru havuzundan gelir." },
      { soru: "Senaryo ne zaman belli olur?", cevap: "Zümre senaryoyu sınavdan önce seçer ve öğrencilere duyurur. Okul müdürlüğü bu duyurunun yapılmasını sağlar." },
      { soru: "Sınavı kim okur?", cevap: "Kâğıtları dersin öğretmeni, sistemdeki cevap anahtarına göre okur." },
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.okulTakvim],
  },
  {
    slug: "oyss-senaryo-nedir",
    menuAdi: "Senaryo nedir",
    baslik: "OYSS'de senaryo nedir? Konu-soru dağılım tablosu nasıl okunur?",
    eyebrow: "Kavramlar",
    aciklama: "Senaryonun ve konu-soru dağılım tablosunun ne olduğu, tablonun nasıl okunduğu.",
    ozet: "Senaryo, bir yazılıda hangi öğrenme çıktısından kaç soru sorulacağını gösteren hazır bir şablondur. Her ders için birkaç senaryo yayımlanır, okul bunlardan birini seçer.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "tablo",
        baslik: "Konu-soru dağılım tablosu",
        paragraflar: [
          "Konu-soru dağılım tablosu, öğretim programındaki konular ve öğrenme çıktıları için bir yazılıda kaçar soru sorulacağını gösterir. 2026-2027 1. dönem tablolarını ÖDSGM yayımladı. ÖDSGM'nin tablo yayımlamadığı derslerde tabloyu il zümreleri hazırlar.",
        ],
      },
      {
        id: "senaryo",
        baslik: "Senaryo",
        paragraflar: [
          "Tablodaki her sütun bir senaryodur. Örneğin bir senaryoda birinci öğrenme çıktısından 3, ikincisinden 2 soru varken başka bir senaryoda bu sayılar farklı olabilir. Senaryolar aynı öğrenme çıktılarını farklı ağırlıklarla ölçer.",
        ],
      },
      {
        id: "okuma",
        baslik: "Tablo nasıl okunur?",
        paragraflar: ["Sitedeki ders sayfalarında her yazılı için resmî tabloyu görebilirsin."],
        liste: [
          "Satırlar öğrenme çıktılarıdır (ör. TAR.9.1.1).",
          "Sütunlar senaryolardır (Senaryo 1, Senaryo 2…).",
          "Hücredeki sayı, o senaryoda o çıktıdan kaç soru sorulacağını gösterir; “—” soru olmadığı anlamına gelir.",
          "En alttaki toplam, kâğıttaki soru sayısıdır.",
        ],
      },
      {
        id: "secim",
        baslik: "Hangi senaryo uygulanır?",
        paragraflar: [
          "Senaryoyu okuldaki ders zümresi seçer ve sınavdan önce öğrencilere duyurur. Bu yüzden öğrenci, kendi okulunda hangi senaryonun seçildiğini öğretmeninden öğrenebilir.",
        ],
      },
    ],
    sss: [
      { soru: "Senaryoyu kim seçer?", cevap: "Okuldaki ders zümresi seçer; zümre başkanı sistemde kaydeder." },
      { soru: "Senaryo sonradan değişebilir mi?", cevap: "Sistemde kaydedildikten sonra senaryo, soru kaynağı ve güçlük seviyeleri değiştirilemez." },
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.tablolar],
  },
  {
    slug: "oyss-kilavuzu",
    menuAdi: "Kılavuz",
    baslik: "OYSS uygulama kılavuzu özeti",
    eyebrow: "Kılavuz",
    aciklama: "Bakanlığın OYSS uygulama kılavuzundaki temel kuralların sade özeti.",
    ozet: "MEB, Ekim 2026'da Ortak Yazılı Sınav Sistemi Uygulama Kılavuzu'nu yayımladı. Aşağıda öğretmen, öğrenci ve veliyi ilgilendiren başlıca kuralları özetledik. Ayrıntılar için kılavuzun kendisine bakın.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "temel",
        baslik: "Temel kurallar",
        paragraflar: [],
        liste: [
          "Sorular açık uçlu; kâğıt toplam 100 puan.",
          "Kâğıt, seçilen senaryoya göre oluşturulur. Senaryodaki iki öğrenme çıktısının sorularını okulun zümresi yazar, kalan sorular Bakanlık soru havuzundan gelir.",
          "Havuz soruları sınavdan 4 gün önce açılır; zümre gerekçe göstererek en fazla 2 soruyu değiştirebilir.",
          "Kâğıt en fazla 4 sayfadır; gerekirse ek kâğıt verilir.",
          "İkili öğretimde sabahçı ve öğlenci gruplara farklı sorular sorulur.",
        ],
      },
      {
        id: "gorevler",
        baslik: "Okul müdürlüğünün görevleri",
        paragraflar: [],
        liste: [
          "Zümre başkanını MEBBİS'e işlemek ve öğretmenlerin EBA erişimini kontrol etmek.",
          "e-Okul'daki öğretim durumu ve şube öğretmen bilgilerinin doğruluğunu kontrol etmek.",
          "Senaryonun öğrencilere duyurulmasını sağlamak.",
          "Kâğıdın oluşturulmasını, basımını ve çoğaltılmasını takip etmek; gizlilik tedbirlerini almak.",
        ],
      },
      {
        id: "ozel",
        baslik: "Özel durumlar",
        paragraflar: [],
        liste: [
          "Kaynaştırma/bütünleştirme öğrencilerinde BEP esas alınır; soruları ve değerlendirmeyi alan öğretmeni yapar.",
          "Az gören öğrenciler için okul gerekli tedbirleri alır.",
          "Evde veya hastanede eğitim alan öğrencilerin sınav sürecinden okul müdürlüğü sorumludur.",
          "Mazeret sınavları okulun planlamasıyla 23-27 Kasım 2026 tarihleri arasında yapılır.",
        ],
      },
      {
        id: "kapsam-disi",
        baslik: "Kapsam dışı okullar",
        paragraflar: [
          "Milletlerarası özel okullar, akşam liseleri, mesleki eğitim merkezleri ve özel eğitim meslek ve uygulama okulları (ve bunların programını uygulayan özel eğitim sınıfları) OYSS kapsamında değildir.",
        ],
      },
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.duyuru],
  },
  {
    slug: "oyss-kapsami",
    menuAdi: "Kapsam",
    baslik: "OYSS kapsamı: Hangi sınıf ve dersler dahil?",
    eyebrow: "Kapsam",
    aciklama: "Ortak Yazılı Sınav Sistemi'nin uygulandığı sınıflar, dersler ve kapsam dışı durumlar.",
    ozet: "OYSS, ortaokulda 5-7, lisede 9-11. sınıflarda toplam 16 derste uygulanıyor. 7. ve 11. sınıf İngilizce ile bazı okul türleri kapsam dışında.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "ortaokul",
        baslik: "Ortaokul (5, 6, 7. sınıf)",
        paragraflar: [],
        liste: [
          "Türkçe",
          "Matematik",
          "Fen Bilimleri",
          "Sosyal Bilgiler",
          "Din Kültürü ve Ahlak Bilgisi",
          "İngilizce (7. sınıfta uygulanmaz)",
        ],
      },
      {
        id: "lise",
        baslik: "Lise (9, 10, 11. sınıf)",
        paragraflar: [],
        liste: [
          "Türk Dili ve Edebiyatı",
          "Matematik",
          "Fizik",
          "Kimya",
          "Biyoloji",
          "Tarih",
          "Coğrafya",
          "Din Kültürü ve Ahlak Bilgisi",
          "Felsefe",
          "İngilizce (11. sınıfta uygulanmaz)",
        ],
      },
      {
        id: "disi",
        baslik: "Kapsam dışı durumlar",
        paragraflar: [],
        liste: [
          "7. ve 11. sınıf İngilizce dersleri.",
          "Azınlık okullarında Din Kültürü ve Ahlak Bilgisi dersi.",
          "Milletlerarası özel okullar, akşam liseleri, mesleki eğitim merkezleri, özel eğitim meslek ve uygulama okulları.",
        ],
      },
      {
        id: "ulke",
        baslik: "Ülke geneli ortak yazılılar",
        paragraflar: [
          "Bazı yazılılar okul geneli değil, ülke geneli ortak sınav olarak yapılır; bunların soru ve cevap anahtarlarını ÖDSGM hazırlar. 2026-2027'de 8 ülke geneli sınav var; tarihler takvim sayfasında.",
        ],
      },
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.ulkeTakvim, KAYNAK.yonetmelik],
  },
  {
    slug: "oyss-giris",
    menuAdi: "Giriş",
    baslik: "OYSS giriş: Sisteme nasıl girilir?",
    eyebrow: "Giriş",
    aciklama: "Öğretmen ve okul yöneticilerinin Ortak Yazılı Sınav Sistemi'ne EBA üzerinden girişi.",
    ozet: "OYSS'ye öğretmenler EBA üzerinden girer. Sistemde kâğıdı oluşturan kişi dersin zümre başkanıdır. Öğrencilerin sisteme girmesi gerekmez.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "kim",
        baslik: "Kimler giriş yapar?",
        paragraflar: [
          "Sınav kâğıdını sistemde zümre başkanı oluşturur; zümre öğretmenleri soruların kontrolüne ve onayına katılır. Öğretmen sisteme giremezse okul yöneticisi EBA üzerinden erişebilir. Öğrenci ve velinin OYSS'ye girişi yoktur; notlar e-Okul'a işlenir.",
        ],
      },
      {
        id: "adimlar",
        baslik: "Giriş adımları",
        paragraflar: [],
        liste: [
          "eba.gov.tr adresine güvenli giriş yöntemlerinden biriyle gir.",
          "Ana sayfadaki “Ortak Yazılı Sınav Sistemi (OYSS)” bağlantısına tıkla.",
          "“Ortak Yazılı Sınav Oluştur” adımıyla sınavı oluşturmaya başla.",
        ],
      },
      {
        id: "sorun",
        baslik: "Giriş yapamıyorsan",
        paragraflar: [
          "Zümre başkanının MEBBİS'e işlenmesi ve öğretmenlerin EBA erişiminin kontrolü okul müdürlüğünün görevidir. Giriş sorunlarında önce okul idarene başvur.",
        ],
      },
    ],
    kaynaklar: [KAYNAK.kilavuz],
  },
  {
    slug: "oyss-ogretmen-rehberi",
    menuAdi: "Öğretmen rehberi",
    baslik: "OYSS öğretmen rehberi: Sınavı nasıl kurarım?",
    eyebrow: "Öğretmenler için",
    aciklama: "Zümre başkanı ve ders öğretmenleri için OYSS'de senaryo seçiminden e-Okul'a not girişine kadar yapılacaklar.",
    ozet: "Bu sayfada zümre başkanının ve ders öğretmenlerinin OYSS'de sırasıyla neler yapacağını özetledik.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "once",
        baslik: "Sınavdan önce",
        paragraflar: [],
        liste: [
          "Zümre olarak ÖDSGM tablosundan senaryoyu seçin ve öğrencilere duyurun.",
          "Zümre başkanı senaryoyu sistemde seçip kaydeder (kayıttan sonra değiştirilemez).",
          "Senaryodaki iki öğrenme çıktısı için açık uçlu soruları ve puanlama anahtarını hazırlayın.",
          "Havuz soruları sınavdan 4 gün önce açılır; gerekçe göstererek en fazla 2 soruyu değiştirebilirsiniz.",
          "Soruların ve anahtarın bilimsel doğruluğunu kontrol edip onaylayın; güçlük düzeylerini ve puanları belirleyin.",
          "Kâğıdı kaydedin, yazdırın ve cevap anahtarının çıktısını alın. Kâğıdın en geç sınavdan 1 gün önce oluşturulmuş olması takip edilir.",
        ],
      },
      {
        id: "gun",
        baslik: "Sınav günü",
        paragraflar: [
          "Sınavı o ders saatinde sınıfta dersi olan öğretmen uygular. 1. dönem 1. yazılılarda süre 40 dakikadır. Sınav listeleri e-Okul'dan alınarak gözetmenlere verilir.",
        ],
      },
      {
        id: "sonra",
        baslik: "Sınavdan sonra",
        paragraflar: [
          "Kâğıtları cevap anahtarına göre okuyun. Öğrencinin katılım durumunu ve her sorudan aldığı puanı, kâğıttaki soru sırasıyla e-Okul'a girin. Sistemde öğrenme çıktısı bazında raporları görebilirsiniz.",
        ],
      },
      {
        id: "site",
        baslik: "Bu siteden nasıl yararlanırsınız?",
        paragraflar: [
          "Ders sayfalarında her yazılının resmî dağılım tablosunu ve senaryolara göre hazırlanmış çalışma kâğıtlarını bulabilirsiniz. Kâğıtlar ve cevap anahtarları yazdırılabilir; öğrencilerinize sınav öncesi alıştırma olarak verebilirsiniz.",
        ],
      },
    ],
    sss: [
      { soru: "Senaryoyu kaydettikten sonra değiştirebilir miyim?", cevap: "Hayır. Senaryo kaydedildikten sonra senaryo, soru kaynağı ve güçlük seviyeleri değiştirilemez." },
      { soru: "Havuzdan gelen soruyu değiştirebilir miyim?", cevap: "Evet, gerekçe göstererek en fazla iki havuz sorusunu değiştirebilirsiniz." },
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.okulTakvim],
  },
  {
    slug: "oyss-ogrenci-rehberi",
    menuAdi: "Öğrenci rehberi",
    baslik: "OYSS öğrenci rehberi: Sınavda ne çıkacak?",
    eyebrow: "Öğrenciler için",
    aciklama: "OYSS yazılısında seni ne bekliyor, nasıl hazırlanırsın, sitedeki kâğıtları nasıl kullanırsın?",
    ozet: "OYSS yazılısında sorular açık uçlu ve hangi konudan kaç soru geleceği önceden belli. Bu sayfada sınava nasıl hazırlanabileceğini anlattık.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "kagit",
        baslik: "Kâğıtta ne var?",
        paragraflar: [
          "Sorular açık uçlu: cevabını yazarak, açıklayarak vereceksin. Kâğıt 100 puan; her sorunun puanı yanında yazar. 1. dönem 1. yazılıda süre 40 dakika.",
          "Okulun, sınavdan önce hangi senaryonun seçildiğini duyurur. Senaryo, hangi öğrenme çıktısından kaç soru geleceğini gösterir.",
        ],
      },
      {
        id: "hazirlik",
        baslik: "Nasıl hazırlanmalı?",
        paragraflar: [],
        liste: [
          "Öğretmenine hangi senaryonun seçildiğini sor.",
          "Ders sayfasındaki tablodan o senaryoda hangi çıktıdan kaç soru olduğuna bak.",
          "Soru sayısı fazla olan çıktılara daha çok zaman ayır.",
          "Açık uçlu sorularda tam cümleyle, gerekçesiyle ve kaynaklardan örnek vererek cevap yazmayı çalış.",
        ],
      },
      {
        id: "site",
        baslik: "Sitede kâğıt nasıl çözülür?",
        paragraflar: [
          "Hazır kâğıtlarda “Sınava başla” ile süre başlar. Bitirince örnek cevaplar ve puanlama ölçütleri açılır; karşıladığın ölçütleri işaretle, puanın hesaplanır. Sonuç ekranında en zayıf konunu görürsün. Puanların yalnızca kendi tarayıcında saklanır.",
        ],
      },
    ],
    sss: [
      { soru: "OYSS'de test sorusu var mı?", cevap: "Hayır, sorular açık uçlu ya da açık uçlu ve kısa cevaplıdır." },
      { soru: "Sınava giremezsem ne olur?", cevap: "1. dönem 1. yazılılar için mazeret sınavları 23-27 Kasım 2026 arasında okulun planlamasıyla yapılır. Mazeretini okuluna bildir." },
      kimIcinSss.sitedekiSorular,
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.okulTakvim],
  },
  {
    slug: "oyss-veli-rehberi",
    menuAdi: "Veli rehberi",
    baslik: "OYSS veli rehberi: Sonuçlar ne anlatıyor?",
    eyebrow: "Veliler için",
    aciklama: "Velilerin OYSS hakkında bilmesi gerekenler: sınav nasıl yapılıyor, not nasıl işleniyor, evde nasıl destek olunur?",
    ozet: "OYSS ile çocuğunuzun yazılıları ortak bir standartla hazırlanıyor. Notlar yine e-Okul'a işleniyor. Bu sayfada süreci ve evde nasıl destek olabileceğinizi anlattık.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "ne",
        baslik: "Kısaca OYSS",
        paragraflar: [
          "Yazılı kâğıdı Bakanlığın sistemi üzerinden, resmî bir konu-soru dağılım tablosuna göre hazırlanıyor. Soruların bir kısmını okulun öğretmenleri, kalanını Bakanlığın soru havuzu sağlıyor. Sorular açık uçlu ve kâğıt 100 puan.",
        ],
      },
      {
        id: "not",
        baslik: "Not nasıl işleniyor?",
        paragraflar: [
          "Kâğıdı dersin öğretmeni okur ve her sorunun puanını e-Okul'a girer. OYSS sınavı, o dönemin yazılı notu olarak ders puanına katılır. Toplu sonuç listeleri yayımlanmaz, okullar arasında karşılaştırma yapılmaz.",
          "Bakanlık, öğrencilerin öğrenme çıktısı bazında güçlü ve gelişmesi gereken yönlerini görebileceğini ve velilere geri bildirim verileceğini açıkladı. Bu raporların hangi kanalla paylaşılacağı henüz netleşmedi; netleşince bu sayfayı güncelleyeceğiz.",
        ],
      },
      {
        id: "destek",
        baslik: "Evde nasıl destek olabilirsiniz?",
        paragraflar: [],
        liste: [
          "Okulun duyurduğu senaryoyu öğrenin; hangi konulardan kaç soru geleceğini birlikte inceleyin.",
          "Açık uçlu sorularda çocuğunuzdan cevabını sözlü olarak açıklamasını isteyin; gerekçe göstermeyi alıştırın.",
          "Sitedeki kâğıtları birlikte çözüp sonuç ekranındaki zayıf konulara odaklanın.",
        ],
      },
    ],
    sss: [
      { soru: "Çocuğumun OYSS notu nerede görünür?", cevap: "Puanlar ders öğretmeni tarafından e-Okul'a girilir; notu e-Okul Veli Bilgilendirme Sistemi'nden takip edebilirsiniz." },
      kimIcinSss.resmiMi,
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.duyuru, KAYNAK.tanitim],
  },
  {
    slug: "oyss-sss",
    menuAdi: "SSS",
    baslik: "OYSS sık sorulan sorular",
    eyebrow: "SSS",
    aciklama: "Ortak Yazılı Sınav Sistemi hakkında en çok sorulan sorular ve resmî kaynaklara dayalı cevapları.",
    ozet: "OYSS hakkında en çok merak edilen soruları kısa cevaplarıyla bir araya getirdik.",
    guncelleme: GUNCELLEME,
    bolumler: [],
    sss: [
      { soru: "OYSS nedir?", cevap: "Okul geneli ortak yazılıların Bakanlığın dijital sistemi üzerinden, resmî konu-soru dağılım tablolarına göre hazırlandığı uygulamadır." },
      { soru: "OYSS ne zaman başladı?", cevap: "Sistem 26 Ekim 2026'da kullanıma açıldı; 2026-2027 1. dönem 1. yazılılardan itibaren uygulanıyor." },
      { soru: "Hangi sınıflar OYSS'ye giriyor?", cevap: "Ortaokulda 5, 6, 7. sınıflar; lisede 9, 10, 11. sınıflar. 7. ve 11. sınıf İngilizce kapsam dışıdır." },
      { soru: "Sorular test mi, klasik mi?", cevap: "Açık uçlu ya da açık uçlu ve kısa cevaplı sorulardır." },
      { soru: "Kâğıt kaç puan?", cevap: "Toplam 100 puan. Soruların puanını, sistemin belirlediği aralıkta zümre belirler." },
      { soru: "Soruları kim hazırlıyor?", cevap: "Senaryodaki iki öğrenme çıktısının sorularını okulun zümresi yazar; kalan sorular Bakanlığın soru havuzundan gelir." },
      { soru: "Senaryo nedir?", cevap: "Bir yazılıda hangi öğrenme çıktısından kaç soru sorulacağını gösteren şablondur. Okul, yayımlanan senaryolardan birini seçer ve öğrencilere duyurur." },
      { soru: "Sınav kaç dakika?", cevap: "1. dönem 1. yazılılarda 40 dakika." },
      { soru: "Mazeret sınavı ne zaman?", cevap: "1. dönem 1. yazılılar için 23-27 Kasım 2026 arasında, okulun planlamasıyla." },
      kimIcinSss.resmiMi,
      kimIcinSss.sitedekiSorular,
      { soru: "Puanlarım nereye kaydediliyor?", cevap: "Yalnızca kendi tarayıcına. Üyelik yoktur, sunucuya veri gönderilmez." },
    ],
    kaynaklar: [KAYNAK.kilavuz, KAYNAK.okulTakvim, KAYNAK.yonetmelik],
  },
  {
    slug: "kaynaklar",
    menuAdi: "Kaynaklar",
    baslik: "Kaynaklar ve resmî bağlantılar",
    eyebrow: "Kaynaklar",
    aciklama: "OYSS ile ilgili resmî kılavuz, takvim, konu-soru dağılım tabloları ve yönetmelik bağlantıları.",
    ozet: "Sitedeki bilgileri aşağıdaki resmî belgelerden derledik. Kesin bilgi için her zaman bu belgelere bakın.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "belgeler",
        baslik: "Resmî belgeler",
        paragraflar: ["Bağlantıların listesi sayfanın altındaki “Kaynaklar” bölümündedir."],
      },
    ],
    kaynaklar: Object.values(KAYNAK),
  },
  {
    slug: "hakkinda",
    menuAdi: "Hakkında",
    baslik: "Hakkında",
    eyebrow: "Hakkında",
    aciklama: "Bu sitenin amacı ve içeriklerin nasıl hazırlandığı.",
    ozet: "Bu site, Ortak Yazılı Sınav Sistemi hakkındaki bilgileri tek yerde sade bir dille toplamak ve öğrencilere resmî tablolara uygun çalışma kâğıtları sunmak için hazırlandı.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "amac",
        baslik: "Nasıl hazırlıyoruz?",
        paragraflar: [
          "Rehber sayfalarındaki bilgiler MEB ve ÖDSGM'nin yayımladığı belgelerden derlenir; kaynaklar her sayfanın altında listelenir. Ders sayfalarındaki soru dağılımları ÖDSGM'nin konu-soru dağılım tablolarından alınır.",
          "Çalışma kâğıtlarındaki sorular sitemiz tarafından özgün olarak hazırlanır; resmî sınav soruları değildir.",
        ],
      },
      {
        id: "iletisim",
        baslik: "İletişim",
        paragraflar: ["İletişim bilgileri yakında eklenecek."],
      },
    ],
    yasal: true,
  },
  {
    slug: "sorumluluk-reddi",
    menuAdi: "Sorumluluk reddi",
    baslik: "Sorumluluk reddi",
    eyebrow: "Yasal",
    aciklama: "Sitedeki bilgilerin niteliği ve kullanımıyla ilgili açıklama.",
    ozet: "Bu site Millî Eğitim Bakanlığı'nın resmî sitesi değildir ve Bakanlıkla bağlantısı yoktur.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "bilgi",
        baslik: "Bilgilerin niteliği",
        paragraflar: [
          "Sitedeki bilgiler resmî kaynaklardan derlenmiştir ancak bilgilendirme amaçlıdır. Tarihler ve kurallar Bakanlık tarafından değiştirilebilir. Kesin bilgi için resmî duyuruları ve okulunuzu esas alın.",
          "Çalışma kâğıtları gerçek sınav soruları değildir; sınavda aynı soruların çıkacağı garanti edilmez.",
        ],
      },
    ],
    yasal: true,
  },
  {
    slug: "kullanim-sartlari",
    menuAdi: "Kullanım şartları",
    baslik: "Kullanım şartları",
    eyebrow: "Yasal",
    aciklama: "Siteyi kullanırken geçerli şartlar.",
    ozet: "Siteyi kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "genel",
        baslik: "Genel şartlar",
        paragraflar: [
          "Çalışma kâğıtları bireysel çalışma ve sınıf içi kullanım için ücretsiz olarak yazdırılabilir. İçeriklerin izin alınmadan ticari amaçla çoğaltılması veya başka sitelerde yayımlanması yasaktır.",
          "Site içeriği önceden haber verilmeden değiştirilebilir.",
        ],
      },
    ],
    yasal: true,
  },
  {
    slug: "gizlilik",
    menuAdi: "Gizlilik",
    baslik: "Gizlilik politikası",
    eyebrow: "Yasal",
    aciklama: "Sitede hangi verilerin nerede tutulduğu.",
    ozet: "Bu sitede üyelik yoktur ve kişisel veri toplanmaz.",
    guncelleme: GUNCELLEME,
    bolumler: [
      {
        id: "tarayici",
        baslik: "Tarayıcıda tutulan veriler",
        paragraflar: [
          "Çözdüğün kâğıtlardaki cevapların, işaretlediğin puanlama ölçütleri ve puanların yalnızca kendi tarayıcında (localStorage) saklanır. Bu veriler sunucumuza gönderilmez. Hesabım sayfasındaki “Verileri temizle” düğmesiyle istediğin zaman silebilirsin.",
        ],
      },
      {
        id: "cerez",
        baslik: "Çerezler",
        paragraflar: [
          "Site şu anda izleme veya reklam çerezi kullanmamaktadır. İleride ziyaret istatistikleri için bir araç eklenirse, bu sayfa güncellenecek ve onayınız istenecektir.",
        ],
      },
    ],
    yasal: true,
  },
];

export function getSayfa(slug: string) {
  return sayfalar.find((s) => s.slug === slug);
}
