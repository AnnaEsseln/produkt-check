import type { GewinnerAnalyse } from "@/lib/types";

type Props = {
  analyse: GewinnerAnalyse;
  name: string;
};

function Abschnitt({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-warmgrau pt-4 first:border-0 first:pt-0">
      <h3 className="text-sm uppercase tracking-wide text-black/50">{titel}</h3>
      <div className="mt-2 text-black/80">{children}</div>
    </div>
  );
}

export default function WinnerAnalysis({ analyse, name }: Props) {
  return (
    <section className="print-block rounded-lg border border-warmgrau bg-white p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl">{name} im Detail</h2>

      <div className="mt-5 space-y-5">
        <Abschnitt titel="Das ist stark daran">
          <p>{analyse.stark}</p>
        </Abschnitt>

        <Abschnitt titel="Das ist noch schwach">
          <p>{analyse.schwach}</p>
        </Abschnitt>

        <Abschnitt titel="So sch&auml;rfst du es">
          <ol className="space-y-2">
            {analyse.schaerfen.map((schritt, i) => (
              <li key={schritt} className="flex gap-3">
                <span className="w-5 shrink-0 tabular-nums text-braun">
                  {i + 1}.
                </span>
                <span>{schritt}</span>
              </li>
            ))}
          </ol>
        </Abschnitt>

        <Abschnitt titel="Dein Versprechen in einem Satz">
          <p className="text-lg leading-snug text-black">{analyse.versprechen}</p>
        </Abschnitt>

        <Abschnitt titel="Realistischer Preis">
          <p className="text-2xl leading-none text-braun">{analyse.preis}</p>
          <p className="mt-2 text-sm text-black/70">
            {analyse.preis_begruendung}
          </p>
        </Abschnitt>
      </div>
    </section>
  );
}
