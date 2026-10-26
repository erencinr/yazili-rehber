# 3. Sayfa şablonları

Her sayfa: Header → Breadcrumb → içerik → Footer.

## A. Ana sayfa `/`
1. Hero: eyebrow + h1 ("X nedir? … rehberi") + kısa açıklama + iki buton (Nedir / Dersler)
2. CTA şeridi: "Yazılı Sorularını Görmek için Tıkla" → /dersler/
3. "Kim için hangi sayfa?" – 3 kart: Sınavı nasıl kurarım? (öğretmen) · Sınavda ne çıkar? (öğrenci) · Rapor ne anlatır? (veli)
4. "Sistem üç evrede işler" – 3 numaralı kart: Hazırlık / Uygulama / Değerlendirme
5. "Tüm dersler" – Ortaokul ve Lise başlıkları altında ders chip'leri

## B. Rehber/makale sayfası (`/oyss-nedir/` vb. tüm sabit içerik sayfaları)
- Hero: eyebrow + h1 + özet paragraf + "Son güncelleme: tarih" | sağda "Bir bakışta" kartı
- Gövde (sol) + sticky "Bu sayfada" TOC (sağ)
- Gövde bölümleri h2 ile; içinde madde listeleri, ders/sınıf ızgarası (ders adı + "5, 6 ve 7. sınıf" + gerekirse uyarı notu)
- SSS akordeonu (FAQPage schema)
- Hedef kitle kartları (Öğretmenim / Öğrenciyim / Veliyim)
- "Sırada ne var?" linkleri
- İçerikler MDX dosyalarından gelsin: `content/sayfalar/oyss-nedir.mdx` (frontmatter: title, description, eyebrow, updated, glance[], faq[], toc otomatik).

## C. Dersler `/dersler/`
- h1 + CTA şeridi
- "Ortaokul dersleri (5, 6, 7. sınıf)" ve "Lise dersleri (9, 10, 11. sınıf)" – her ders kartı: "OYSS {Ders}" + sınıf linkleri
- Altta SSS (4 soru)

## D. Ders sayfası `/dersler/{ders}/`
- h1: "{Ders}: 9, 10 ve 11. Sınıf 1. Yazılı Senaryoları"
- "{Ders} sınıfa göre" – her sınıf için kart (senaryo sayısı, yazılı linkleri)
- "{Ders} yazılılarında hangi üniteler var?" – ünite listesi
- SSS (3 soru, veriden şablonla üretilir)
- "Diğer lise/ortaokul dersleri" chip listesi

## E. Ders-sınıf sayfası `/dersler/{ders}/{sinif}/`
- h1: "{n}. Sınıf {Ders} 1. Yazılı Senaryoları 2026-2027"
- Her yazılı için (1. dönem 1. yazılı, 1. dönem 2. yazılı…) **senaryo dağılım tablosu**
  - Üstte filtre chip'leri: Tümü / Senaryo 1 … Senaryo N (client component; seçilen sütunu vurgular/diğerlerini gizler)
  - Satır: öğrenme çıktısı ("1. ünite: … · çıktı metni"), hücre: soru sayısı veya "—"
  - Son satır: Toplam soru
- "Bu tablo nasıl okunur?" açıklama kutusu
- SSS (5 soru – şablon: kaç soru, kaçını öğretmen yazar, kaç puan, hangi senaryo, ne zaman)
- "{Ders} dersinin diğer sınıfları" + "{n}. sınıfın diğer dersleri" chip listeleri

## F. Yazılı soruları hub'ı `/dersler/{ders}/{sinif}/{yazili}/`
- h1: "{n}. Sınıf {Ders} 1. Dönem 1. Yazılı Soruları"
- "Nasıl çalışır?" (3 adımlı kısa anlatım)
- "Senaryolar neyi soruyor?" – tablo: senaryo → konular → toplam puan, her satır senaryo sayfasına link
- "Konuya göre çalış" – konu kartları → konu sayfasına
- SSS (5 soru)

## G. Senaryo sınav kâğıdı `/dersler/{ders}/{sinif}/{yazili}/senaryo-{n}/` ⭐ en önemli sayfa
Ayrıntı: `05-interaktif-sinav.md`
- h1 + "Bu kâğıtta neler var?" (soru sayısı, süre, toplam 100 puan, konu dağılımı)
- "Nasıl ilerlenir?" (3 adım)
- Butonlar: **Sınava başla** · **Kâğıdı yazdır** · **Cevap anahtarını yazdır**
- Soru gezgini: numaralı butonlar (no + konu + puan)
- Her soru: kaynak metinler (Kaynak A, Kaynak B…) + alt maddeler (1.1, 1.2… her biri puanlı) + "Çözüm ve puanlama" (rubrik)
- "Kâğıdı bitir" → "Puanın" ekranı: Konulara göre / Sorulara göre puan tabloları
- "Diğer senaryolar" chip'leri, "Bu kâğıt hakkında" notu

## H. Konu sayfası `/dersler/{ders}/{sinif}/{yazili}/{konu}/`
- h1: "… Yazılı: {Konu} Soruları"
- O konuya ait sorular (tüm senaryolardan toplanmış), her biri çözüm/rubrik ile
- "Bu konunun geçtiği senaryo kâğıtları" + "Diğer konular"

## I. Takvim `/ortak-yazili-takvimi/`
- Tablolar: dönem/yazılı → tarih aralığı; ülke geneli ortak sınav tarihleri (sınıf + ders + tarih)
- Her yazılı için "X. sınıf Y ne zaman?" SSS'leri (SEO için)

## J. Hesabım `/hesap/` (client-only)
- localStorage'dan: çözülen kâğıtlar listesi, tarih, puan, en zayıf konu
- "Verileri temizle" butonu. Giriş/şifre yok (v1).
