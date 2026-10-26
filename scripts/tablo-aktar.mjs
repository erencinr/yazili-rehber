// ÖDSGM konu-soru dağılım tablosunu (xlsx) site verisine aktarır.
//
// Kullanım:
//   node scripts/tablo-aktar.mjs --hepsi [--indir]
//       data/resmi/kaynaklar.json'daki tüm dersleri aktarır (--indir: dosyaları yeniden indirir)
//   node scripts/tablo-aktar.mjs <ders-slug> <dosya.xlsx> [--url <resmî indirme adresi>]
//
// Her sayfa (sheet) bir sınıf, her "X. Dönem Y. Ortak Yazılı Sınav" sütun grubu bir yazılıdır.
// Çıktı: data/<ders>/<sinif>/<yazili>.json  (her çalıştırmada baştan yazılır)
// Sorular ayrı dosyada durur (<yazili>.sorular.json) ve bu komut ona dokunmaz.

import fs from "node:fs";
import path from "node:path";
import { strFromU8, unzipSync } from "fflate";

const KOK = path.join(import.meta.dirname, "..");
const RESMI = path.join(KOK, "data/resmi");
const dersler = JSON.parse(fs.readFileSync(path.join(KOK, "data/dersler.json"), "utf8"));

const argv = process.argv.slice(2);
const isler = [];
if (argv[0] === "--hepsi") {
  const kaynaklar = JSON.parse(fs.readFileSync(path.join(RESMI, "kaynaklar.json"), "utf8"));
  for (const [slug, url] of Object.entries(kaynaklar)) {
    const dosya = path.join(RESMI, `${slug}.xlsx`);
    if (argv.includes("--indir") || !fs.existsSync(dosya)) {
      const yanit = await fetch(url);
      if (!yanit.ok) throw new Error(`${slug}: ${url} indirilemedi (${yanit.status})`);
      fs.writeFileSync(dosya, Buffer.from(await yanit.arrayBuffer()));
    }
    isler.push({ dersSlug: slug, dosya, kaynakUrl: url });
  }
} else {
  const [dersSlug, dosya, ...kalan] = argv;
  if (!dersSlug || !dosya) {
    console.error("Kullanım: node scripts/tablo-aktar.mjs --hepsi | <ders-slug> <dosya.xlsx> [--url <adres>]");
    process.exit(1);
  }
  const urlIndex = kalan.indexOf("--url");
  isler.push({ dersSlug, dosya, kaynakUrl: urlIndex >= 0 ? kalan[urlIndex + 1] : undefined });
}

// ---------- xlsx okuma (yalnızca hücre metinleri) ----------

function xmlCoz(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function metinleriBirlestir(xml) {
  return [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => xmlCoz(m[1])).join("");
}

function sutunNo(ref) {
  let n = 0;
  for (const ch of ref.match(/^[A-Z]+/)[0]) n = n * 26 + ch.charCodeAt(0) - 64;
  return n;
}

function xlsxOku(dosyaYolu) {
  const zip = unzipSync(fs.readFileSync(dosyaYolu));
  const oku = (ad) => (zip[ad] ? strFromU8(zip[ad]) : "");
  const paylasilan = [...oku("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    metinleriBirlestir(m[1]),
  );

  const sayfaAdlari = [...oku("xl/workbook.xml").matchAll(/<sheet\b[^>]*name="([^"]*)"[^>]*r:id="([^"]*)"/g)].map(
    (m) => ({
      ad: xmlCoz(m[1]),
      rid: m[2],
    }),
  );
  const iliskiler = Object.fromEntries(
    [...oku("xl/_rels/workbook.xml.rels").matchAll(/<Relationship\b[^>]*Id="([^"]*)"[^>]*Target="([^"]*)"/g)].map(
      (m) => [m[1], m[2]],
    ),
  );

  return sayfaAdlari.map(({ ad, rid }) => {
    const hedef = iliskiler[rid].replace(/^\/?(xl\/)?/, "xl/");
    const satirlar = new Map();
    for (const c of oku(hedef).matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ozellik = c[1];
      const ic = c[2] ?? "";
      const ref = ozellik.match(/\br="([A-Z]+)(\d+)"/);
      if (!ref) continue;
      const tur = ozellik.match(/\bt="([^"]*)"/)?.[1];
      const v = ic.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      let deger;
      if (tur === "inlineStr") deger = metinleriBirlestir(ic);
      else if (v === undefined) continue;
      else if (tur === "s") deger = paylasilan[Number(v)];
      else deger = xmlCoz(v);
      deger = deger.replace(/\s+/g, " ").trim();
      if (!deger) continue;
      const satir = Number(ref[2]);
      if (!satirlar.has(satir)) satirlar.set(satir, new Map());
      satirlar.get(satir).set(sutunNo(ref[1]), deger);
    }
    return { ad, satirlar: [...satirlar.entries()].sort((a, b) => a[0] - b[0]) };
  });
}

// ---------- yardımcılar ----------

function slugYap(metin) {
  const harita = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
  return metin
    .toLocaleLowerCase("tr")
    .replace(/[’'`]/g, "")
    .replace(/[çğıöşüâîû]/g, (h) => harita[h])
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "1. ÜNİTE: GEÇMİŞİN İNŞA SÜRECİNDE TARİH" → "1. ünite: Geçmişin inşa sürecinde tarih"
function uniteAdi(metin) {
  const kucuk = metin.toLocaleLowerCase("tr");
  return kucuk.replace(/:\s*(\p{L})/u, (_, h) => `: ${h.toLocaleUpperCase("tr")}`);
}

// "TAR.9.1.1. …", "T.O.6.5. …", "ENG.9.1.V1. …", "E11.1.R1.Students…", "SB.5.2.3.Yaşadığı…", "TDE2.2. …", "1.1. …"
const ciktiDeseni = /^((?:[A-ZÇĞİÖŞÜ]+\.?)*\d+(?:\.[A-ZÇĞİÖŞÜ]*\d+)+)(?:\.\s*|\s+)(\S.*)$/u;

// Konu sayfası adresi: en fazla 70 karakter, kelime ortasından kesilmez.
function kisaSlug(metin) {
  const tam = slugYap(metin);
  return tam.length <= 70 ? tam : tam.slice(0, 71).replace(/-[^-]*$/, "");
}

// Aynı konu birden çok çıktıda geçebiliyor; her çıktının konu adresi tekil olmalı.
function tekilSluglar(ciktilar) {
  const sayac = new Map();
  return ciktilar.map((c) => {
    const temel = kisaSlug(c.konu);
    const n = (sayac.get(temel) ?? 0) + 1;
    sayac.set(temel, n);
    return n === 1 ? temel : `${temel}-${n}`;
  });
}

// ---------- aktarma ----------

const bugun = new Date().toISOString().slice(0, 10);
let yazilanDosya = 0;

for (const { dersSlug, dosya, kaynakUrl } of isler) {
  const ders = dersler.find((d) => d.slug === dersSlug);
  if (!ders) throw new Error(`dersler.json içinde "${dersSlug}" yok.`);
  console.log(`### ${ders.slug}`);

  for (const sayfa of xlsxOku(dosya)) {
    // Sayfa adları dosyadan dosyaya değişiyor: "9. SINIF", "5. Sınıf", "5.sınıf", "9", "11. Sınıf 4 Saat"
    const sinifEslesme = sayfa.ad.match(/^\s*(\d+)(?:\s*\.|\s*$)/);
    const sinif = sinifEslesme && ders.siniflar.find((s) => s.slug === `${sinifEslesme[1]}-sinif`);
    if (!sinif) {
      console.warn(`· "${sayfa.ad}" atlandı (dersler.json'daki ${ders.ad} sınıfları arasında yok).`);
      continue;
    }

    const baslikIndex = sayfa.satirlar.findIndex(([, h]) =>
      [...h.values()].some((v) => /Öğrenme Çıktı|Kazanım/i.test(v)),
    );
    if (baslikIndex < 0) throw new Error(`"${sayfa.ad}": başlık satırı bulunamadı.`);
    const baslik = sayfa.satirlar[baslikIndex][1];
    const senaryoSatiri = sayfa.satirlar[baslikIndex + 1][1];
    const sutunBul = (desen) => [...baslik.entries()].find(([, v]) => desen.test(v))?.[0];
    const uniteSutun = sutunBul(/Ünite|Tema|Alan Beceri/i);
    const konuSutun = sutunBul(/^Konu/i);
    const ciktiSutun = sutunBul(/Öğrenme Çıktı|Kazanım/i);

    const gruplar = [...baslik.entries()]
      .map(([sutun, v]) => ({ sutun, eslesme: v.match(/(\d+)\.\s*Dönem\s*(\d+)\.\s*Ortak Yazılı/i) }))
      .filter((g) => g.eslesme)
      .map((g) => ({ sutun: g.sutun, donem: Number(g.eslesme[1]), yazili: Number(g.eslesme[2]) }))
      .sort((a, b) => a.sutun - b.sutun);

    const senaryoSutunlari = [...senaryoSatiri.entries()]
      .map(([sutun, v]) => ({ sutun, no: Number(v.match(/Senaryo\s*(\d+)/i)?.[1]) }))
      .filter((s) => s.no)
      .map((s) => ({ ...s, grup: gruplar.filter((g) => g.sutun <= s.sutun).at(-1) }));

    let unite = "";
    const ciktilar = [];
    for (const [, h] of sayfa.satirlar.slice(baslikIndex + 2)) {
      if (uniteSutun && h.get(uniteSutun)) unite = uniteAdi(h.get(uniteSutun));
      const ham = h.get(ciktiSutun);
      if (!ham) continue;
      const e = ham.match(ciktiDeseni);
      const id = e ? e[1] : `${sinifEslesme[1]}.${ciktilar.length + 1}`;
      const metin = e ? e[2] : ham;
      const konu = konuSutun && h.get(konuSutun) ? h.get(konuSutun) : metin;
      const sayilar = new Map(senaryoSutunlari.map((s) => [s, h.has(s.sutun) ? Number(h.get(s.sutun)) : null]));
      ciktilar.push({ id, unite, konu, metin, sayilar });
    }

    for (const g of gruplar) {
      const sira = (g.donem - 1) * 2 + g.yazili;
      const senaryolar = senaryoSutunlari.filter((s) => s.grup === g);
      const ilgili = ciktilar.filter((c) => senaryolar.some((s) => c.sayilar.get(s) !== null));
      // Ülke geneli sınavlarda senaryo yerine "tablo sınav öncesi yayımlanacak" notu bulunur.
      const ulkeGeneliNotu = [senaryoSatiri.get(g.sutun), baslik.get(g.sutun)].find((v) => v && /Ülke Geneli/i.test(v));
      if (ilgili.length === 0 && !ulkeGeneliNotu) continue;

      const cikti = {
        $aciklama:
          "Bu dosya scripts/tablo-aktar.mjs ile ÖDSGM tablosundan üretilir; elle düzenleme. Sorular .sorular.json dosyasında.",
        slug: `${sira}-yazili-sorulari`,
        ad: `${g.donem}. dönem ${g.yazili}. yazılı`,
        sira,
        ...(ulkeGeneliNotu && { ulkeGeneli: true, duyuru: ulkeGeneliNotu }),
        kaynak: {
          ad: `ÖDSGM ${sinifEslesme[1]}. Sınıf ${ders.ad} Konu Soru Dağılım Tablosu`,
          url: kaynakUrl,
          dosya: path.basename(dosya),
          alindi: bugun,
        },
        ciktilar: ilgili.map((c, i, liste) => ({
          id: c.id,
          unite: c.unite,
          konu: c.konu,
          konuSlug: tekilSluglar(liste)[i],
          metin: c.metin,
        })),
        senaryolar: senaryolar.map((s) => ({
          no: s.no,
          dagilim: Object.fromEntries(ilgili.map((c) => [c.id, c.sayilar.get(s)])),
        })),
      };

      const hedef = path.join(KOK, "data", ders.slug, sinif.slug, `${cikti.slug}.json`);
      fs.mkdirSync(path.dirname(hedef), { recursive: true });
      fs.writeFileSync(hedef, JSON.stringify(cikti, null, 2) + "\n");
      yazilanDosya++;
      const toplamlar = cikti.senaryolar.map((s) => Object.values(s.dagilim).reduce((t, v) => t + (v ?? 0), 0));
      console.log(
        cikti.ulkeGeneli
          ? `✓ ${path.relative(KOK, hedef)}  (ülke geneli; tablo henüz yayımlanmadı)`
          : `✓ ${path.relative(KOK, hedef)}  (${ilgili.length} çıktı, ${senaryolar.length} senaryo, soru: ${toplamlar.join("/")})`,
      );
    }
  }
}

console.log(`${yazilanDosya} dosya yazıldı.`);
