import { getDersler } from "@/lib/data";
import { Chip } from "./ui";

const KADEMELER = [
  { kademe: "ortaokul", baslik: "Ortaokul (5, 6, 7. sınıf)" },
  { kademe: "lise", baslik: "Lise (9, 10, 11. sınıf)" },
] as const;

export function DersChipleri({ haric, kademe }: { haric?: string; kademe?: "ortaokul" | "lise" }) {
  const dersler = getDersler();
  return (
    <div className="space-y-5">
      {KADEMELER.filter((k) => !kademe || k.kademe === kademe).map((k) => (
        <div key={k.kademe} className="space-y-2.5">
          {!kademe && <h3 className="font-medium text-muted">{k.baslik}</h3>}
          <div className="flex flex-wrap gap-2">
            {dersler
              .filter((d) => d.kademe === k.kademe && d.slug !== haric)
              .map((d) => (
                <Chip key={d.slug} href={`/dersler/${d.slug}/`}>
                  {d.ad}
                </Chip>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
