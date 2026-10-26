# 5. İnteraktif sınav kâğıdı (senaryo sayfası)

Sitenin en değerli özelliği: öğrenci kâğıdı çözer, sonra rubriğe bakarak **kendi kendini puanlar**.

## Durumlar (state machine)
`hazir` → (Sınava başla) → `cozuluyor` → (Kâğıdı bitir) → `puanlama` → (sonuç) → `sonuc`
- `sonuc` ekranında: "Çözümlere dön" ve "Baştan çöz" butonları.

## Akış
1. **hazir**: Kâğıt özeti görünür. Çözümler gizli.
2. **cozuluyor**: Sayaç (senaryo.sureDk) başlar, üstte sticky. Soru gezgini butonları (`1 · Tarihin faydaları · 16`). Her alt madde altında opsiyonel cevap textarea'sı (öğrenci kendi cevabını yazabilir – zorunlu değil). Çözümler gizli.
3. **puanlama**: Her alt maddenin altında "Çözüm ve puanlama" açılır: örnek cevap + rubrik maddeleri **checkbox** olarak. Öğrenci karşıladığı kriterleri işaretler; puan otomatik toplanır. Gezgin butonlarında "1. soru: 0/16" canlı güncellenir.
4. **sonuc** ("Puanın"): toplam /100 büyük gösterilir + iki tablo:
   - Konulara göre: konu → alınan/toplam → yüzde çubuğu
   - Sorulara göre: soru → alınan/toplam
   - En düşük konu için "Bu konuyu çalış" linki (konu sayfasına).

## Kayıt
- Her şey `localStorage` anahtarı: `sinav:{ders}/{sinif}/{yazili}/senaryo-{n}` → `{cevaplar, isaretler, puan, tarih}`
- Sayfa yenilenince kaldığı yerden devam. `/hesap/` bu kayıtları listeler.
- localStorage erişimini try/catch ile sar.

## Yazdırma
- "Kâğıdı yazdır": `window.print()` + `@media print` ile sadece sorular, sınav kâğıdı formatında (okul/ad-soyad/numara alanı başlıkta, çözümler gizli).
- "Cevap anahtarını yazdır": print öncesi `data-print="anahtar"` sınıfı ekle → sadece örnek cevaplar + rubrik görünür.

## Bileşenler
`ExamShell` (client, state) · `QuestionNav` · `QuestionCard` · `SourceBlock` · `SubItem` · `RubricChecklist` · `ScoreSummary` · `PrintHeader`
Soru içeriği server component olarak render edilsin (SEO için HTML'de olsun), sadece state client'ta.
