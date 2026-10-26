# 1. Site haritası

İncelenen sitede ~590 sayfa var. Büyük kısmı veriden otomatik üretilen ders sayfaları.

## Sabit (elle yazılan) sayfalar
| URL | Sayfa | Not |
|---|---|---|
| `/` | Ana sayfa | Hero + "kim için" kartları + 3 evre + ders listesi |
| `/oyss-nedir/` | Sistem nedir? | Uzun rehber yazısı + sağda "Bir bakışta" kutusu + SSS |
| `/oyss-nasil-calisir/` | Nasıl çalışır | "Senaryodan e-Okul'a 9 adım" – numaralı adımlar |
| `/oyss-giris/` | Sisteme giriş | eba.gov.tr giriş anlatımı |
| `/oyss-senaryo-nedir/` | Senaryo nedir | Kavram açıklaması |
| `/oyss-kilavuzu/` | Kılavuz | Resmî kılavuzun özeti |
| `/ortak-yazili-takvimi/` | Takvim | Tablolar + "X. sınıf Y ne zaman?" SSS'leri |
| `/oyss-kapsami/` | Kapsam | Hangi sınıf/ders dahil |
| `/dersler/` | Tüm dersler | Ortaokul / Lise grupları, kart listesi |
| `/oyss-ogretmen-rehberi/` | Öğretmen rehberi | Hedef kitle sayfası |
| `/oyss-ogrenci-rehberi/` | Öğrenci rehberi | Hedef kitle sayfası |
| `/oyss-veli-rehberi/` | Veli rehberi | Hedef kitle sayfası |
| `/oyss-sss/` | SSS | Akordeon liste |
| `/kaynaklar/` | Kaynaklar | Resmî PDF/haber bağlantıları |
| `/hakkinda/` `/sorumluluk-reddi/` `/kullanim-sartlari/` `/gizlilik/` | Yasal | Düz metin |
| `/hesap/` | Hesabım | İstemci tarafı, localStorage'daki çözülen kâğıtlar/puanlar |

## Veriden üretilen sayfalar (asıl hacim burada)
```
/dersler/{ders}/                                  16 ders
/dersler/{ders}/{sinif}/                          ~60  (ör. 9-sinif, 11-sinif-4-saat)
/dersler/{ders}/{sinif}/{yazili}/                 ~60  (ör. 1-yazili-sorulari)
/dersler/{ders}/{sinif}/{yazili}/senaryo-{n}/     ~300 (interaktif sınav kâğıdı)
/dersler/{ders}/{sinif}/{yazili}/{konu-slug}/     ~180 (konuya göre sorular)
```
Örnek: `/dersler/tarih/9-sinif/1-yazili-sorulari/senaryo-1/`

## Ders listesi
Ortaokul (5-7): ortaokul-din-kulturu, fen-bilimleri, ortaokul-matematik, sosyal-bilgiler, turkce, ortaokul-ingilizce
Lise (9-11): biyoloji, cografya, lise-din-kulturu, felsefe, fizik, kimya, lise-matematik, tarih, turk-dili-ve-edebiyati, lise-ingilizce
(Aynı ders adı iki kademede varsa slug'a `ortaokul-` / `lise-` öneki eklenir.)

## Header menüsü
Logo (kare ikon + "Marka" + alt satır "Ortak yazılı sınav") · OYSS nedir · Nasıl çalışır · Kılavuz · Takvim · Dersler · Kimler için ▾ (Öğretmen/Öğrenci/Veli) · [Hesabım] butonu
Aktif sayfa linki yarı saydam beyaz "hap" (pill) arka planlı. Mobilde hamburger menü.

## Footer (4 kolon)
1. Marka + tek cümle açıklama
2. Sayfalar (tüm sabit sayfalar)
3. Dersler (16 ders)
4. Resmî bağlantılar (eba, MEB broşür PDF, MEB haber, kılavuz PDF)
Alt satır: "Bu site MEB'in resmî sitesi değildir…" uyarısı + yasal linkler.
