import Link from "next/link";
import { Container, H2 } from "@/components/ui";
import { site } from "@/config/site";
import { getDersler, getTakvim, getYazililar, sinifNo } from "@/lib/data";

const adimlar = [
  { baslik: "Sınıfını seç", metin: "5, 6 veya 7. sınıf." },
  { baslik: "Senaryonu seç", metin: "Okulunun seçtiği senaryoyu öğretmenine sor. Bilmiyorsan Senaryo 1 · Kolay ile başla." },
  { baslik: "Çöz", metin: "Süre tutup ekranda çöz ya da kâğıdı yazdır." },
];

const rehberler = [
  { ad: "OYSS nedir?", href: "/oyss-nedir/" },
  { ad: "Senaryo nedir?", href: "/oyss-senaryo-nedir/" },
  { ad: "Öğrenci rehberi", href: "/oyss-ogrenci-rehberi/" },
  { ad: "Veli rehberi", href: "/oyss-veli-rehberi/" },
  { ad: "Öğretmen rehberi", href: "/oyss-ogretmen-rehberi/" },
  { ad: "Sık sorulanlar", href: "/oyss-sss/" },
];

export default function Home() {
  const siniflar = getDersler().flatMap((d) =>
    d.siniflar.map((s) => {
      const kagitlar = getYazililar(d.slug, s.slug).flatMap((y) => y.kagitlar);
      return {
        href: `/dersler/${d.slug}/${s.slug}/`,
        n: sinifNo(s.slug),
        ders: d.ad,
        kagitSayisi: kagitlar.length,
        prova: kagitlar[0]?.tur === "prova",
      };
    }),
  );
  const takvim = getTakvim();
  const okulGeneli = takvim.okulGeneli.sinavlar.filter((s) => s.kademe.startsWith("Ortaokul") && s.ders === "Matematik");
  const ulkeGeneli = takvim.ulkeGeneli.filter((t) => t.ders === "Matematik" && t.sinif <= 7);

  return (
    <>
      <section className="hero-grid border-b border-line">
        <Container className="space-y-8 py-12 sm:py-16">
          <div className="max-w-[760px] space-y-4">
            <p className="text-sm font-extrabold tracking-wide text-turq uppercase">
              Ortak yazılı sınava hazırlık · {site.egitimYili}
            </p>
            <h1 className="text-[34px] sm:text-[46px]">Matematik yazılı soruları</h1>
            <p className="text-lg text-ink-soft">
              MEB senaryolarına uygun, gerçek sınav formatında yazılı kâğıtları. Sınıfını seç, kâğıdını aç, çöz.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {siniflar.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-[22px] bg-white p-6 shadow-[0_14px_40px_-16px_rgb(19_26_51/0.22)] transition hover:-translate-y-0.5"
              >
                <p className="text-5xl font-extrabold text-navy">{s.n}.</p>
                <p className="mt-1 text-lg font-extrabold text-navy">Sınıf {s.ders.toLocaleLowerCase("tr")}</p>
                <p className="mt-2 text-sm text-ink-soft">
                  {s.kagitSayisi > 0 ? `1. yazılı · ${s.kagitSayisi} ${s.prova ? "prova" : "kâğıt"}` : "Kâğıtlar hazırlanıyor"}
                </p>
                <span className="mt-4 inline-flex rounded-full bg-navy px-4 py-2 text-sm font-extrabold text-white group-hover:bg-navy-2">
                  Kâğıtları aç →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Container className="space-y-14 py-12">
        <section className="space-y-5">
          <H2>Nasıl kullanılır?</H2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {adimlar.map((a, i) => (
              <li key={a.baslik} className="rounded-[22px] bg-soft p-5">
                <span className="grid size-9 place-items-center rounded-full bg-navy font-extrabold text-white">{i + 1}</span>
                <p className="mt-3 font-extrabold text-navy">{a.baslik}</p>
                <p className="mt-1 text-sm text-ink-soft">{a.metin}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <H2>Matematik yazılısı ne zaman?</H2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {okulGeneli.map((s) => (
              <li key={s.kademe} className="rounded-[18px] border border-line bg-white p-4">
                <p className="font-extrabold text-navy">{s.tarih}</p>
                <p className="text-sm text-ink-soft">5 ve 7. sınıf · 1. dönem 1. yazılı (okul geneli)</p>
              </li>
            ))}
            {ulkeGeneli.slice(0, 1).map((t) => (
              <li key={t.tarih} className="rounded-[18px] border border-line bg-white p-4">
                <p className="font-extrabold text-navy">{t.tarih}</p>
                <p className="text-sm text-ink-soft">
                  {t.sinif}. sınıf · {t.donem} {t.yazili} (ülke geneli)
                </p>
              </li>
            ))}
          </ul>
          <Link href="/ortak-yazili-takvimi/" className="inline-block text-sm font-semibold text-turq hover:underline">
            Tüm takvimi gör →
          </Link>
        </section>

        <section className="space-y-4">
          <H2>OYSS hakkında</H2>
          <p className="max-w-[720px] text-ink-soft">
            Ortak Yazılı Sınav Sistemi (OYSS) ile yazılılar MEB&apos;in senaryolarına göre hazırlanıyor. Sistemi merak
            ediyorsan:
          </p>
          <div className="flex flex-wrap gap-2">
            {rehberler.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft shadow-[inset_0_0_0_1px_var(--color-line)] hover:text-navy"
              >
                {r.ad}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
