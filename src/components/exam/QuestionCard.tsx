import type { Madde, Soru } from "@/lib/types";

export function maddePuani(m: Madde, isaretli: number[] = []) {
  return Math.min(
    m.puan,
    isaretli.reduce((t, i) => t + (m.rubrik[i]?.puan ?? 0), 0),
  );
}

export function SourceBlock({ kaynak }: { kaynak: Soru["kaynaklar"][number] }) {
  return (
    <figure className="rounded-xl border border-line bg-paper p-4">
      <figcaption className="mb-1 text-sm font-semibold text-forest">{kaynak.etiket}</figcaption>
      <blockquote className="text-ink/90">{kaynak.metin}</blockquote>
      {kaynak.dipnot && <p className="mt-2 text-xs text-muted">{kaynak.dipnot}</p>}
    </figure>
  );
}

type Etkilesim = {
  cevaplar: Record<string, string>;
  isaretler: Record<string, number[]>;
  cevapYaz?: (maddeNo: string, metin: string) => void;
  isaretle?: (maddeNo: string, i: number) => void;
  cevapAcik: boolean;
  puanlamaAcik: boolean;
};

function RubricChecklist({ m, isaretli, isaretle, aktif }: { m: Madde; isaretli: number[]; isaretle?: (i: number) => void; aktif: boolean }) {
  return (
    <ul className="space-y-1.5">
      {m.rubrik.map((r, i) => (
        <li key={i}>
          <label className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 ${aktif ? "cursor-pointer hover:bg-white" : ""}`}>
            {aktif ? (
              <input
                type="checkbox"
                className="mt-1 size-4 accent-forest"
                checked={isaretli.includes(i)}
                onChange={() => isaretle?.(i)}
              />
            ) : (
              <span className="mt-0.5 text-forest" aria-hidden>
                •
              </span>
            )}
            <span className="flex-1">{r.aciklama}</span>
            <span className="font-semibold whitespace-nowrap text-forest tabular-nums">{r.puan} puan</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

function SubItem({ m, e }: { m: Madde; e?: Etkilesim }) {
  const isaretli = e?.isaretler[m.no] ?? [];
  const statik = !e;
  return (
    <div className="sub-item space-y-3 border-t border-line pt-4">
      <p>
        <span className="font-semibold">{m.no}.</span> {m.soru}{" "}
        <span className="text-sm font-semibold whitespace-nowrap text-forest">({m.puan} puan)</span>
      </p>
      {e && (
        <div className="answer-area">
          {e.cevapAcik ? (
            <textarea
              aria-label={`${m.no} cevabın`}
              rows={3}
              value={e.cevaplar[m.no] ?? ""}
              onChange={(ev) => e.cevapYaz?.(m.no, ev.target.value)}
              placeholder="Cevabını buraya yazabilirsin (isteğe bağlı)"
              className="w-full rounded-xl border border-line bg-white p-3 text-sm outline-none focus:border-forest"
            />
          ) : (
            e.cevaplar[m.no] && (
              <div className="student-answer rounded-xl border border-dashed border-line bg-white p-3 text-sm whitespace-pre-wrap">
                <p className="mb-1 text-xs font-semibold text-muted">Senin cevabın</p>
                {e.cevaplar[m.no]}
              </div>
            )
          )}
          <div className="answer-lines print-only" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-8 border-b border-dotted border-ink/40" />
            ))}
          </div>
        </div>
      )}
      {statik ? (
        <details className="rounded-xl bg-forest-50">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-forest">
            Çözüm ve puanlama <span className="faq-isaret text-lg" aria-hidden />
          </summary>
          <div className="space-y-3 px-4 pb-4">
            <Cozum m={m} />
            <RubricChecklist m={m} isaretli={[]} aktif={false} />
          </div>
        </details>
      ) : (
        <div className="solution space-y-3 rounded-xl bg-forest-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-forest">Çözüm ve puanlama</p>
            {e.puanlamaAcik && (
              <p className="text-sm font-semibold tabular-nums">
                {maddePuani(m, isaretli)}/{m.puan}
              </p>
            )}
          </div>
          <Cozum m={m} />
          <RubricChecklist m={m} isaretli={isaretli} isaretle={(i) => e.isaretle?.(m.no, i)} aktif={e.puanlamaAcik} />
        </div>
      )}
    </div>
  );
}

function Cozum({ m }: { m: Madde }) {
  return (
    <div className="rounded-lg bg-white p-3 text-sm">
      <p className="mb-1 text-xs font-semibold text-muted">Örnek cevap</p>
      {m.cevapOrnegi}
    </div>
  );
}

export function QuestionCard({ soru, konuAdi, e, baslikEki }: { soru: Soru; konuAdi?: string; e?: Etkilesim; baslikEki?: string }) {
  return (
    <article id={e ? `soru-${soru.no}` : undefined} className="question-card scroll-mt-36 space-y-4 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-xl">
          {soru.no}. {soru.baslik}
          {baslikEki && <span className="ml-2 text-sm font-sans text-muted">{baslikEki}</span>}
        </h3>
        <p className="text-sm text-muted">
          {konuAdi && <span>{konuAdi} · </span>}
          <span className="font-semibold text-forest">{soru.puan} puan</span>
        </p>
      </header>
      {/* Kaynaklar ilk maddeyle birlikte durur; yazdırırken sayfa sonunda yalnız kalmaz. */}
      <div className="sources-with-first space-y-4">
        {soru.kaynaklar.length > 0 && (
          <div className={`grid gap-3 ${soru.kaynaklar.length > 1 ? "md:grid-cols-2" : ""}`}>
            {soru.kaynaklar.map((k) => (
              <SourceBlock key={k.etiket} kaynak={k} />
            ))}
          </div>
        )}
        <SubItem m={soru.maddeler[0]} e={e} />
      </div>
      {soru.maddeler.length > 1 && (
        <div className="space-y-4">
          {soru.maddeler.slice(1).map((m) => (
            <SubItem key={m.no} m={m} e={e} />
          ))}
        </div>
      )}
    </article>
  );
}
