import Link from "next/link";

export function UlkeGeneliKutusu({ duyuru, kagitVar = false }: { duyuru?: string; kagitVar?: boolean }) {
  return (
    <div className="rounded-[18px] bg-yellow-tint p-4 text-sm text-ink">
      <p className="font-extrabold">Bu yazılı ülke geneli ortak sınav olarak yapılacak.</p>
      <p className="mt-1 text-ink-soft">
        {kagitVar
          ? "Sorular MEB tarafından hazırlanır; aşağıdaki provalar sınav formatında hazırlık içindir."
          : (duyuru ?? "MEB konu-soru dağılım tablosunu sınav öncesinde yayımlayacak.")}{" "}
        <Link href="/ortak-yazili-takvimi/" className="font-semibold text-turq hover:underline">
          Sınav tarihini gör →
        </Link>
      </p>
    </div>
  );
}
