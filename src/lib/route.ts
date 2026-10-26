import { getDers, getYazili, sinifNo, tumYazililar } from "./data";

/** /dersler/[ders]/[sinif]/[yazili] parametrelerini veriye çevirir; bulunamazsa null. */
export async function yaziliCozumle(params: Promise<{ ders: string; sinif: string; yazili: string }>) {
  const p = await params;
  const ders = getDers(p.ders);
  const sinif = ders?.siniflar.find((s) => s.slug === p.sinif);
  const yazili = ders && sinif ? getYazili(ders.slug, sinif.slug, p.yazili) : undefined;
  if (!ders || !sinif || !yazili) return null;
  const n = sinifNo(sinif.slug);
  const taban = `/dersler/${ders.slug}/${sinif.slug}/${yazili.slug}/`;
  const kirintilar = [
    { ad: `${n}. sınıf ${ders.ad.toLocaleLowerCase("tr")}`, href: `/dersler/${ders.slug}/${sinif.slug}/` },
    { ad: yazili.ad, href: taban },
  ];
  return { ders, sinif, yazili, n, taban, kirintilar };
}

export function yaziliParams() {
  return tumYazililar().map(({ ders, sinif, yazili }) => ({ ders: ders.slug, sinif: sinif.slug, yazili: yazili.slug }));
}
