# atomica.com.tr/yazili kurulumu

Bu site, Atomica'nın Express sunucusunda `/yazili/` altında **düz HTML dosyaları** olarak yayınlanır.
Ayrı bir sunucu, veritabanı veya Node süreci gerekmez.

## 1. Derleme

```bash
npm ci
npm run build:atomica
```

Çıktı `out/` klasörüdür (~31 MB, ~190 sayfa). Tüm bağlantılar `/yazili/` ile başlar;
canonical ve sitemap adresleri `https://atomica.com.tr/yazili/...` olur.

## 2. Dosyaları Atomica sunucusuna koyma

`out/` klasörünün **içeriğini** Atomica sunucusunda bir klasöre kopyalayın, örneğin `yazili/`:

```bash
rsync -a --delete out/ <sunucu>:/<atomica-uygulama-klasoru>/yazili/
```

## 3. Express'e eklenecek kod

Atomica'nın Express uygulamasında, **tüm-yakalayan (`app.get("*")`) rotalardan önce** ekleyin:

```js
const path = require("path");

const YAZILI_KLASORU = path.join(__dirname, "yazili"); // 2. adımdaki klasör
app.use("/yazili", express.static(YAZILI_KLASORU, { extensions: ["html"], maxAge: "1h" }));
app.use("/yazili", (req, res) => res.status(404).sendFile(path.join(YAZILI_KLASORU, "404.html")));
```

Bu kod yerelde Express 4 ile test edildi:

| İstek | Sonuç |
|---|---|
| `/yazili` | 301 → `/yazili/` |
| `/yazili/dersler` | 301 → `/yazili/dersler/` |
| `/yazili/dersler/tarih/9-sinif/1-yazili-sorulari/senaryo-1/` | 200 |
| `/yazili/sitemap.xml` | 200 |
| `/yazili/olmayan-sayfa/` | 404 (sitenin kendi 404 sayfası) |
| `/paketler/` | Atomica'nın kendi rotası, etkilenmez |

## 4. Cloudflare

- Ek ayar gerekmez. Her güncellemeden sonra `/yazili/*` için önbelleği temizleyin (Caching → Purge Cache → Custom Purge).
- `robots.txt` ana alan adında olduğu için, Google'a `https://atomica.com.tr/yazili/sitemap.xml` adresini Search Console'dan ayrıca bildirin
  (veya Atomica'nın `robots.txt` dosyasına `Sitemap: https://atomica.com.tr/yazili/sitemap.xml` satırını ekleyin).

## 5. Atomica içinden bağlantı

- Menüye veya `/yaziliya-hazirlik/` sayfasına `/yazili/` bağlantısı verin.
- Sitenin üst menüsündeki Atomica logosu `https://atomica.com.tr/`, "Şimdi Oyna" `games.atomica.com.tr`, "Paketler" `/paketler/` adresine gider
  (ayarlar: `src/config/site.ts` → `atomica`).

## Güncelleme akışı

İçerik değişince (yeni sorular, yeni MEB tablosu): `npm run build:atomica` → 2. adımdaki kopyalama → Cloudflare önbelleğini temizleme.

## Notlar

- Tarayıcıda saklanan sınav kayıtları `atomica-yazili:sinav:` ön ekiyle tutulur; Atomica uygulamasının localStorage anahtarlarıyla çakışmaz.
- Logo ve favicon Atomica'nın kendi adreslerinden yüklenir (`/assets/logo.png`, `/assets/logo-white.png`, `/favicon.png`); bu dosyaların yeri değişirse `src/config/site.ts` güncellenmelidir.
- Aynı içerik GitHub Pages'te de yayınlanıyor (https://erencinr.github.io/yazili-rehber/); canonical adresler atomica.com.tr'yi gösterdiği için Google'da kopya içerik sayılmaz.
