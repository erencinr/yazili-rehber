import type { Kaynak } from "@/content/sayfalar";
import { H2 } from "./ui";

export function KaynakListesi({ kaynaklar }: { kaynaklar: Kaynak[] }) {
  return (
    <section className="space-y-3">
      <H2 id="kaynaklar">Kaynaklar</H2>
      <ul className="space-y-1.5 text-sm">
        {kaynaklar.map((k) => (
          <li key={k.url}>
            <a href={k.url} target="_blank" rel="noopener noreferrer" className="text-navy hover:underline">
              {k.ad} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
