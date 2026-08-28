import { ACHSEN, type Idee } from "@/lib/types";
import ScoreBar from "./ScoreBar";

type Props = {
  idee: Idee;
  hervorgehoben: boolean;
};

export default function IdeaCard({ idee, hervorgehoben }: Props) {
  return (
    <article
      className={`print-block rounded-lg bg-white p-5 sm:p-6 ${
        hervorgehoben ? "border-2 border-braun" : "border border-warmgrau"
      }`}
    >
      {hervorgehoben && (
        <p className="mb-3 inline-block rounded-full bg-braun px-3 py-1 text-xs uppercase tracking-wide text-white">
          Deine Idee
        </p>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg leading-snug sm:text-xl">{idee.name}</h3>
          {idee.kurzbeschreibung && (
            <p className="mt-1 text-sm text-black/70">{idee.kurzbeschreibung}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span className="block text-3xl leading-none tabular-nums text-braun sm:text-4xl">
            {idee.gesamt.toFixed(1)}
          </span>
          <span className="mt-1 block text-xs text-black/50">von 10</span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {ACHSEN.map((achse) => (
          <ScoreBar
            key={achse.key}
            label={achse.label}
            wert={idee.scores[achse.key]}
          />
        ))}
      </div>
    </article>
  );
}
