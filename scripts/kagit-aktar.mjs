// Atomica yazılı kitapçıklarını (PDF) kâğıt kâğıt ayırıp siteye aktarır.
//
// Kullanım:  node scripts/kagit-aktar.mjs        (data/kitapciklar/kitapciklar.json'daki tüm kitapçıklar)
// Gerekenler: poppler (pdftotext, pdftoppm, pdfinfo) ve cwebp — macOS: brew install poppler webp
//
// Her kitapçıkta kapaktan sonra kâğıtlar art arda gelir; her sayfanın başlığında
// "N. SENARYO · KOLAY" (veya "N. PROVA · ORTA") yazar. Komut sayfaları bu başlığa göre gruplar ve şunları üretir:
//   public/kagitlar/<ders>/<sinif>/<yazili>/<kagit>/sayfa-<n>.webp   ekranda gösterilen sayfa görselleri
//   public/kagitlar/<ders>/<sinif>/<yazili>/kitapcik.pdf             tüm kitapçık (indirme bağlantısı)
//   data/<ders>/<sinif>/<yazili>.kagitlar.json                      kâğıt listesi, sorular (no, puan, çıktı), sayfa metinleri

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const KOK = path.join(import.meta.dirname, "..");
const KITAPCIK_DIR = path.join(KOK, "data/kitapciklar");
const SEVIYELER = { KOLAY: "kolay", ORTA: "orta", ZOR: "zor" };
const COZUNURLUK = 150; // dpi; A4 için 1240 × 1754 px
const pikselBoyut = (pt) => Math.round((pt / 72) * COZUNURLUK);

const calistir = (komut, argumanlar) => execFileSync(komut, argumanlar, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

function sayfaMetni(pdf, sayfa) {
  return calistir("pdftotext", ["-f", String(sayfa), "-l", String(sayfa), "-enc", "UTF-8", pdf, "-"]);
}

// Ekranda okunan metin: üst/alt bilgi ve tek harflik şekil etiketleri ayıklanır (arama motoru ve ekran okuyucu için).
function temizMetin(metin) {
  return metin
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 2)
    .filter((s) => !/www\.atomica\.com\.tr|QR'ı tarat|Matematik Atölyeleri'ni deneyimlemek|^Adı Soyadı$|^Sınıfı \/ No$/.test(s))
    .join("\n");
}

function kitapcikAktar({ ders, sinif, yazili, dosya }) {
  const pdf = path.join(KITAPCIK_DIR, dosya);
  const bilgi = calistir("pdfinfo", [pdf]);
  const sayfaSayisi = Number(bilgi.match(/Pages:\s+(\d+)/)[1]);
  const [, wPt, hPt] = bilgi.match(/Page size:\s+([\d.]+) x ([\d.]+)/);
  const gecici = fs.mkdtempSync(path.join(os.tmpdir(), "kagit-"));
  const hedefDir = path.join(KOK, "public/kagitlar", ders, sinif, yazili);
  fs.rmSync(hedefDir, { recursive: true, force: true });
  fs.mkdirSync(hedefDir, { recursive: true });

  // 1) Sayfaları kâğıtlara grupla
  const kagitlar = [];
  let tur;
  for (let s = 1; s <= sayfaSayisi; s++) {
    const metin = sayfaMetni(pdf, s);
    const baslik = metin.match(/(\d+)\.\s*(SENARYO|PROVA)\s*·\s*(KOLAY|ORTA|ZOR)/);
    if (!baslik) continue; // kapak
    tur ??= baslik[2] === "SENARYO" ? "senaryo" : "prova";
    const no = Number(baslik[1]);
    const seviye = SEVIYELER[baslik[3]];
    const slug = `${tur}-${no}-${seviye}`;
    let kagit = kagitlar.at(-1);
    if (kagit?.slug !== slug) {
      kagit = { slug, tur, no, seviye, sayfaNolari: [], metinler: [] };
      kagitlar.push(kagit);
    }
    kagit.sayfaNolari.push(s);
    kagit.metinler.push(metin);
  }

  // 2) Her kâğıt için görseller, PDF ve soru bilgisi
  const cikti = [];
  for (const k of kagitlar) {
    const kagitDir = path.join(hedefDir, k.slug);
    fs.mkdirSync(kagitDir, { recursive: true });
    const sayfalar = k.sayfaNolari.map((s, i) => {
      const onEk = path.join(gecici, `${k.slug}-${i + 1}`);
      calistir("pdftoppm", ["-f", String(s), "-l", String(s), "-r", String(COZUNURLUK), "-png", "-singlefile", pdf, onEk]);
      const webp = path.join(kagitDir, `sayfa-${i + 1}.webp`);
      calistir("cwebp", ["-quiet", "-q", "78", `${onEk}.png`, "-o", webp]);
      return {
        src: `/kagitlar/${ders}/${sinif}/${yazili}/${k.slug}/sayfa-${i + 1}.webp`,
        genislik: pikselBoyut(Number(wPt)),
        yukseklik: pikselBoyut(Number(hPt)),
        metin: temizMetin(k.metinler[i]),
      };
    });

    // Sorular: her sorunun yanında "NN puan", üstünde çıktı kodu ("5.3.1." / "MAT.6.1.1.") yazar.
    const tumMetin = k.metinler.join("\n");
    // Etiket satır başında yazar ("16 puan …"); soru metnindeki "+5 puan", "0 puan" gibi ifadeler sayılmaz.
    const puanlar = [...tumMetin.matchAll(/^(\d+)\s*puan\b/gm)].map((m) => Number(m[1])).filter((p) => p > 0 && p < 100);
    const ciktilar = [...tumMetin.matchAll(/^(?:MAT\.)?(\d+\.\d+\.\d+)\.?$/gm)].map((m) => `MAT.${m[1]}`);
    const sorular = puanlar.map((puan, i) => ({ no: i + 1, puan, cikti: ciktilar[i] ?? null }));

    cikti.push({
      slug: k.slug,
      tur: k.tur,
      no: k.no,
      seviye: k.seviye,
      sorular,
      sayfalar,
    });
    const toplam = sorular.reduce((t, q) => t + q.puan, 0);
    console.log(
      `  ${k.slug.padEnd(18)} ${String(sayfalar.length).padStart(2)} sayfa  ${sorular.length} soru  ${toplam} puan  ${ciktilar.length === sorular.length ? "" : `⚠ ${ciktilar.length} çıktı kodu`}`,
    );
  }

  fs.rmSync(gecici, { recursive: true, force: true });
  fs.copyFileSync(pdf, path.join(hedefDir, "kitapcik.pdf"));
  const veri = {
    $aciklama: "scripts/kagit-aktar.mjs ile Atomica kitapçığından üretilir; elle düzenleme.",
    kaynak: dosya,
    kitapcik: `/kagitlar/${ders}/${sinif}/${yazili}/kitapcik.pdf`,
    tur,
    kagitlar: cikti,
  };
  fs.writeFileSync(path.join(KOK, "data", ders, sinif, `${yazili}.kagitlar.json`), JSON.stringify(veri, null, 2) + "\n");
}

const liste = JSON.parse(fs.readFileSync(path.join(KITAPCIK_DIR, "kitapciklar.json"), "utf8"));
for (const k of liste) {
  console.log(`### ${k.ders}/${k.sinif}/${k.yazili}  (${k.dosya})`);
  kitapcikAktar(k);
}
