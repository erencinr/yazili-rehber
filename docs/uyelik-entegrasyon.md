# Üyelik: Atomica hesabıyla giriş ve ilerleme kaydı

Bu belge, yazılı sayfalarındaki (atomica.com.tr/yazili) üyelik özelliğini tamamlayacak yazılımcı içindir.
**Ön yüz hazır**; Atomica sunucusuna 3 küçük API ve giriş/çıkış yönlendirmesi eklenmesi gerekiyor.

## Karar özeti

- Ayrı üyelik yok: öğrenci **mevcut Atomica hesabıyla** girer (`/login`, `/register/student`).
- **Kâğıtlar herkese açık.** Üyelik yalnızca ilerlemeyi kaydeder: hangi kâğıda başladı, hangisini bitirdi, ne kadar sürede.
- Site statik HTML'dir (`npm run build:atomica` → `out/`) ve aynı alan adında (`atomica.com.tr/yazili/`) yayınlanır.
  Bu yüzden Atomica'nın oturum çerezi API isteklerine **kendiliğinden** gider; CORS veya token gerekmez.

## Ön yüzde hazır olanlar

| Parça | Dosya |
|---|---|
| API istemcisi (Atomica + demo modu) | `src/lib/uyelik.ts` |
| Oturum/ilerleme durumu (React context) | `src/components/uyelik/UyelikSaglayici.tsx` |
| Menüdeki "Giriş yap" / öğrenci adı menüsü | `src/components/uyelik/UyelikDugmesi.tsx` |
| Kâğıt sayfası: süre başlat → "başlandı", "Bitirdim" → "tamamlandı" | `src/components/KagitAraclari.tsx` |
| Kâğıt düğmelerinde ✓ işareti | `src/components/uyelik/KagitIsareti.tsx` |
| "Çalışmalarım" sayfası (`/yazili/hesap/`) | `src/components/uyelik/Calismalarim.tsx` |

Mod, derleme sırasında `NEXT_PUBLIC_UYELIK_MODU` ile seçilir:

- `atomica` → aşağıdaki API'ler kullanılır (`npm run build:atomica` bunu ayarlar).
- `demo` → sunucu olmadan sahte "Demo Öğrenci" ile çalışır; veriler tarayıcıda tutulur (GitHub Pages önizlemesi ve `npm run dev`).

API'ye ulaşılamazsa (404, ağ hatası) site **misafir olarak çalışmaya devam eder**; kâğıtlar etkilenmez.

## 1. API sözleşmesi

Taban adres: `https://atomica.com.tr/api/yazili` (farklıysa derlemede `NEXT_PUBLIC_ATOMICA_API` ile önek verilebilir).
Tüm uçlar Atomica'nın mevcut oturum çerezini kullanır. Oturum yoksa **401** döner (gövde önemsiz).

### `GET /api/yazili/oturum`

```json
200 { "kullanici": { "id": "u_123", "ad": "Elif", "rol": "ogrenci" } }
401
```

- `ad`: menüde gösterilen ad (yalnızca ad yeterli; soyad göndermeyin).
- `rol`: `"ogrenci" | "ogretmen" | "veli"`.

### `GET /api/yazili/ilerleme`

```json
200 {
  "kayitlar": [
    { "kagit": "ortaokul-matematik/5-sinif/1-yazili-sorulari/senaryo-1-kolay",
      "durum": "tamamlandi", "sureSn": 1840, "tarih": "2026-11-02T18:30:00.000Z" }
  ]
}
401
```

### `PUT /api/yazili/ilerleme/:kagit`

`:kagit` URL-encode edilmiş kâğıt anahtarıdır (ör. `ortaokul-matematik%2F5-sinif%2F1-yazili-sorulari%2Fsenaryo-1-kolay`).

```json
İstek:  { "durum": "baslandi" | "tamamlandi", "sureSn": 1840 }   // sureSn isteğe bağlı
Yanıt:  204 | 400 (geçersiz gövde/anahtar) | 401 | 403 (Origin hatalı)
```

**Kurallar**

1. Kâğıt anahtarı biçimi: `^[a-z0-9-]+/[0-9]+-sinif/[0-9]+-yazili-sorulari/(senaryo|prova)-[0-9]+-(kolay|orta|zor)$` — uymayanı 400 ile reddedin.
2. `tamamlandi` olan kayıt, sonradan gelen `baslandi` ile **geri alınmaz** (öğrenci bitirdiği kâğıdı tekrar açıp süre başlatabilir; istekler sırasız da gelebilir).
3. `sureSn` 0–14400 arası tam sayı olmalı; yoksa önceki değer korunur.
4. `tarih` sunucu saatiyle yazılır.

## 2. Giriş, kayıt ve çıkış yönlendirmesi

Ön yüz şu adreslere yönlendirir (`src/config/site.ts` → `atomica`):

| İşlem | Adres |
|---|---|
| Giriş | `https://atomica.com.tr/login?next=/yazili/…` |
| Kayıt | `https://atomica.com.tr/register/student?next=/yazili/…` |
| Çıkış | `https://atomica.com.tr/logout?next=/yazili/…` |

Yapılacaklar:

- `/login` ve `/register/student` başarılı olunca `next` parametresine geri dönsün.
- `/logout` uç noktası yoksa eklensin (oturumu kapatıp `next`'e dönsün).
- **Açık yönlendirme açığına dikkat:** `next` yalnızca `/yazili/` ile başlayan **göreli** bir yol olabilir.
  `//evil.com`, `https://…`, `\` içeren değerleri reddedin; geçersizse `/yazili/`'ye dönün.

## 3. Veri tablosu (öneri)

```sql
CREATE TABLE yazili_ilerleme (
  kullanici_id  VARCHAR(64)  NOT NULL,
  kagit         VARCHAR(160) NOT NULL,
  durum         VARCHAR(16)  NOT NULL CHECK (durum IN ('baslandi', 'tamamlandi')),
  sure_sn       INTEGER      NULL,
  olusturma     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  guncelleme    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kullanici_id, kagit)
);
```

## 4. Express örneği

Atomica'nın oturum katmanını bilmiyoruz; `oturumKullanicisi(req)` ve `db` kısmını mevcut yapıya bağlayın.

```js
const KAGIT = /^[a-z0-9-]+\/[0-9]+-sinif\/[0-9]+-yazili-sorulari\/(senaryo|prova)-[0-9]+-(kolay|orta|zor)$/;
const router = express.Router();
router.use(express.json({ limit: "2kb" }));

// Oturum zorunlu
router.use((req, res, next) => {
  const kullanici = oturumKullanicisi(req); // ← Atomica'nın mevcut oturumu
  if (!kullanici) return res.sendStatus(401);
  req.yaziliKullanici = kullanici;
  next();
});

// Yazma isteklerinde basit CSRF koruması: yalnızca kendi sitemizden gelen istekler
router.use((req, res, next) => {
  if (req.method === "GET") return next();
  if (req.get("Origin") !== "https://atomica.com.tr") return res.sendStatus(403);
  next();
});

router.get("/oturum", (req, res) => {
  const k = req.yaziliKullanici;
  res.set("Cache-Control", "no-store").json({ kullanici: { id: String(k.id), ad: k.ad, rol: k.rol } });
});

router.get("/ilerleme", async (req, res) => {
  const satirlar = await db.ilerlemeListele(req.yaziliKullanici.id);
  res.set("Cache-Control", "no-store").json({
    kayitlar: satirlar.map((s) => ({ kagit: s.kagit, durum: s.durum, sureSn: s.sure_sn ?? undefined, tarih: s.guncelleme })),
  });
});

router.put("/ilerleme/:kagit", async (req, res) => {
  const { kagit } = req.params; // Express URL çözümünü yapar
  const { durum, sureSn } = req.body ?? {};
  if (!KAGIT.test(kagit) || !["baslandi", "tamamlandi"].includes(durum)) return res.sendStatus(400);
  if (sureSn !== undefined && !(Number.isInteger(sureSn) && sureSn >= 0 && sureSn <= 14400)) return res.sendStatus(400);
  await db.ilerlemeYaz(req.yaziliKullanici.id, kagit, durum, sureSn); // kural 2 ve 3'ü uygulayan upsert
  res.sendStatus(204);
});

app.use("/api/yazili", router); // express.static("/yazili", …) satırından önce veya sonra fark etmez
```

`ilerlemeYaz` için upsert mantığı:

```sql
INSERT INTO yazili_ilerleme (kullanici_id, kagit, durum, sure_sn) VALUES ($1, $2, $3, $4)
ON CONFLICT (kullanici_id, kagit) DO UPDATE SET
  durum = CASE WHEN yazili_ilerleme.durum = 'tamamlandi' THEN 'tamamlandi' ELSE EXCLUDED.durum END,
  sure_sn = COALESCE(EXCLUDED.sure_sn, yazili_ilerleme.sure_sn),
  guncelleme = CURRENT_TIMESTAMP;
```

## 5. Güvenlik ve KVKK

- Kullanıcıların çoğu reşit değil. Yeni toplanan veri (kâğıt ilerlemesi ve süre) **Atomica'nın aydınlatma metnine** eklenmeli;
  saklama süresi ve veli erişimi belirlenmeli. Bu karar hukuki tarafındır.
- API yalnızca giriş yapan kullanıcının **kendi** kayıtlarını döndürmeli; `kullanici_id` hiçbir zaman istemciden alınmamalı.
- Oturum çerezi `HttpOnly`, `Secure`, `SameSite=Lax` olmalı.
- PUT ucuna kullanıcı başına makul bir hız sınırı (ör. dakikada 60) eklenmesi önerilir.

## 6. Derleme ve test

```bash
npm run build:atomica      # NEXT_PUBLIC_UYELIK_MODU=atomica ile out/ üretir
```

Test listesi (atomica.com.tr/yazili veya test ortamında):

- [ ] Misafir: menüde "Giriş yap" görünür; kâğıtlar açılır; "Bitirdim" giriş önerisi gösterir.
- [ ] "Giriş yap" → Atomica girişi → aynı kâğıt sayfasına geri dönülür, menüde öğrencinin adı görünür.
- [ ] Süre başlat → `PUT … {"durum":"baslandi"}`; "Bitirdim" → `{"durum":"tamamlandi","sureSn":…}`.
- [ ] Sınıf sayfasında bitirilen kâğıdın düğmesinde ✓ görünür.
- [ ] `/yazili/hesap/` (Çalışmalarım): "x / 42 kâğıt bitti" ve sıradaki kâğıt doğru.
- [ ] Çıkış → misafire döner. Başka kullanıcıyla girildiğinde önceki kullanıcının kayıtları görünmez.
- [ ] `next=https://evil.com` ile giriş denendiğinde dış siteye yönlendirilmez.
- [ ] API kapalıyken site misafir olarak sorunsuz çalışır.

## Sonraki adımlar (isteğe bağlı)

- Atomica giriş sayfasına **Google ile giriş** eklenirse yazılı sayfaları otomatik olarak yararlanır; burada değişiklik gerekmez.
- Öğretmen/veli rolleri için öğrencilerin ilerlemesini gösteren panel, aynı `yazili_ilerleme` tablosundan beslenebilir.
