import Link from "next/link";
import { Card } from "./ui";

export function UlkeGeneliKutusu({ duyuru }: { duyuru?: string }) {
  return (
    <Card className="bg-forest-50">
      <p className="text-sm font-semibold text-forest">Ülke geneli ortak yazılı</p>
      <p className="mt-1 text-ink/85">
        {duyuru ?? "Bu yazılı ülke geneli ortak sınav olarak yapılacak."} Tablo yayımlandığında senaryolar burada
        görünecek.
      </p>
      <Link href="/ortak-yazili-takvimi/" className="mt-2 inline-block text-sm font-semibold text-forest hover:underline">
        Sınav tarihini takvimde gör →
      </Link>
    </Card>
  );
}
