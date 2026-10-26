# 2. Tasarım sistemi (orijinal siteden ölçülen değerler)

Genel his: sakin, "resmî rehber" havası; krem zemin, koyu yeşil header, serif başlıklar, yuvarlak hap butonlar, beyaz kartlar.

## Renkler (Tailwind theme'e ekle)
| Token | Değer | Kullanım |
|---|---|---|
| `paper` | `#F6F6F1` (rgb 246,246,241) | Sayfa zemini (krem) |
| `ink` | `#172033` (rgb 23,32,51) | Ana metin, başlıklar |
| `forest` | `#0D4F45` (rgb 13,79,69) | Header zemini, vurgu metni, linkler, "eyebrow" etiketleri |
| `forest-50` | `#E7F0EE` (türetilmiş) | Açık yeşil arka planlar, rozetler |
| `white` | `#FFFFFF` | Kartlar, butonlar |
| `line` | `#E4E4DC` (türetilmiş) | Kart kenarlığı, ayırıcılar |
| `muted` | `#5B6475` (türetilmiş) | "Son güncelleme" gibi ikincil metin |
Hero bölümünde zeminde çok silik bir kareli/ızgara deseni var (CSS `background-image` ile linear-gradient grid, %4 opaklık).

## Tipografi
- Başlıklar: **Literata**, serif, font-weight 400 (ince/zarif)
  - h1: 48px / line-height 1.4 (mobilde ~34px)
  - h2: 30px / 1.4
- Gövde: **Manrope** (sans), 16px / 24px
- h3: Manrope 16px, weight 500
- "Eyebrow" etiket (h1 üstü küçük yazı, ör. "OYSS rehberi"): Manrope 14px, weight 600, renk `forest`
- Nav linkleri: 14px, weight 600, beyaz

## Bileşenler
- **Header**: zemin `forest`, yükseklik ~64px, içerik max-w ~1200px. Sağda "Hesabım" butonu: beyaz ince kenarlıklı, köşeleri yuvarlak (rounded-lg). Aktif menü: `bg-white/15 rounded-full px-3 py-1.5`.
- **Breadcrumb**: header altında ince şerit, 13-14px, `ink/70`.
- **Hap link / chip**: `rounded-full bg-white border border-line px-3 py-1.5 text-sm font-medium` (ör. "Senaryo 1", "Tümü" filtre butonları; seçili olan `bg-forest text-white`).
- **Kart**: `bg-white rounded-2xl border border-line shadow-sm p-5`.
- **"Bir bakışta" kutusu**: hero'nun sağında beyaz kart; satırlar: küçük gri etiket (Açılış, İlk sınav, Kapsam, Giriş) + altında serif kalın değer; satırlar ince çizgiyle ayrılır.
- **Hedef kitle kartları** (Öğretmenim / Öğrenciyim / Veliyim): başlık + tek soru cümlesi, tüm kart tıklanabilir.
- **SSS akordeon**: `<details><summary>` – sağda "+" işareti, açıkken "−". Her soru beyaz kart veya alt çizgili satır.
- **"Bu sayfada" (TOC)**: uzun yazılarda sağ kolonda yapışkan (sticky) içindekiler listesi; masaüstünde görünür.
- **"Sırada ne var?"**: sayfa sonunda sonraki sayfalara 2-3 büyük link kartı.
- **CTA şeridi**: "Yazılı Sorularını Görmek için Tıkla" – belirgin, `forest` zeminli geniş buton/şerit (ana sayfa ve dersler sayfasında).
- **Tablo**: senaryo dağılım tablosu; ilk sütun öğrenme çıktısı (uzun metin), diğerleri sayı; son satır "Toplam soru" kalın. Mobilde yatay kaydırılabilir kapsayıcı.

## Düzen
- İçerik genişliği ~1200px; makale metni ~720px; makale + sağ sidebar (TOC / Bir bakışta) iki kolon.
- Bol beyaz boşluk, bölümler arası ~64-80px.
- Tamamen responsive; mobilde tek kolon.
