const KRITERIEN = [
  "Du kannst das Ergebnis nicht in einem Satz sagen, ohne \u201eund\u201c zu benutzen.",
  "Das Problem ist keins, das jemand nachts googelt.",
  "Der K\u00e4ufer m\u00fcsste erst etwas lernen, bevor er ein Ergebnis sieht.",
  "Du k\u00f6nntest die Antwort auch in einem kostenlosen Post geben.",
  "Ohne dich funktioniert es nicht.",
];

export default function KillerCriteria() {
  return (
    <section className="print-block rounded-lg border border-warmgrau bg-white p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl">
        Woran du erkennst, dass eine Idee tot ist
      </h2>

      <ol className="mt-4 space-y-3">
        {KRITERIEN.map((kriterium, i) => (
          <li key={kriterium} className="flex gap-3">
            <span className="w-5 shrink-0 tabular-nums text-braun">{i + 1}.</span>
            <span className="text-black/80">{kriterium}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 border-t border-warmgrau pt-4 text-black/70">
        Wenn zwei davon zutreffen, nimm die n&auml;chste Idee.
      </p>
    </section>
  );
}
