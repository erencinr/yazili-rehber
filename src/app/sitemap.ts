import type { MetadataRoute } from "next";
import { mutlakUrl } from "@/config/site";
import { sayfalar } from "@/content/sayfalar";
import { cozulebilirKonular, getDersler, tumYazililar } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const yollar = [
    "/",
    "/dersler/",
    "/ortak-yazili-takvimi/",
    ...sayfalar.map((s) => `/${s.slug}/`),
    ...getDersler().flatMap((d) => [`/dersler/${d.slug}/`, ...d.siniflar.map((s) => `/dersler/${d.slug}/${s.slug}/`)]),
    ...tumYazililar().flatMap(({ ders, sinif, yazili }) => {
      const taban = `/dersler/${ders.slug}/${sinif.slug}/${yazili.slug}/`;
      return [
        taban,
        ...yazili.senaryolar.filter((s) => s.hazir).map((s) => `${taban}senaryo-${s.no}/`),
        ...cozulebilirKonular(yazili).map((k) => `${taban}${k.slug}/`),
      ];
    }),
  ];
  return yollar.map((y) => ({ url: mutlakUrl(y) }));
}
