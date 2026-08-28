"use client";

import { useState } from "react";

type Props = {
  text: string;
  setText: (wert: string) => void;
  extra: string;
  setExtra: (wert: string) => void;
  fehler: string;
  onStart: () => void;
  restlaeufe: number;
};

export default function InputForm({
  text,
  setText,
  extra,
  setExtra,
  fehler,
  onStart,
  restlaeufe,
}: Props) {
  const [extraOffen, setExtraOffen] = useState(false);

  return (
    <div>
      <header>
        <h1 className="text-3xl leading-tight sm:text-4xl">Dein Ideen-Check</h1>
        <p className="mt-2 text-lg text-black/70">
          Welche deiner drei Ideen ist wirklich verkaufbar?
        </p>
      </header>

      <p className="mt-5 text-black/80">
        Ich bin Elara, die KI-Assistentin von Anna. Du hast drei Produktideen vor
        dir und keine Ahnung, welche davon sich wirklich verkauft. Kopier die
        komplette Antwort hier rein. Ich bewerte jede Idee nach vier Kriterien
        und sage dir, mit welcher du startest.
      </p>

      <div className="mt-6 rounded-lg border border-warmgrau bg-white p-4 sm:p-5">
        <label htmlFor="ideen" className="sr-only">
          Antwort von ChatGPT
        </label>
        <textarea
          id="ideen"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full resize-y rounded-md border border-warmgrau bg-white p-4 text-base leading-relaxed outline-none focus:border-braun"
          placeholder="Kopier hier die komplette Antwort rein, die ChatGPT dir gegeben hat."
        />

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setExtraOffen(!extraOffen)}
            aria-expanded={extraOffen}
            className="text-sm text-black/60 underline underline-offset-4"
          >
            Noch etwas, das ich wissen sollte?
          </button>

          {extraOffen && (
            <textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              rows={3}
              className="mt-3 w-full resize-y rounded-md border border-warmgrau bg-white p-3 text-base outline-none focus:border-braun"
              placeholder="Optional. Zum Beispiel, welche Idee dir selbst am meisten Spa&szlig; macht."
            />
          )}
        </div>
      </div>

      {fehler && <p className="mt-4 text-braun">{fehler}</p>}

      <button
        type="button"
        onClick={onStart}
        className="mt-5 w-full rounded-md bg-braun px-6 py-4 text-lg text-white transition-opacity hover:opacity-90"
      >
        Ideen checken
      </button>

      <p className="mt-3 text-center text-sm text-black/50">
        Dauert etwa 60 Sekunden. Noch {restlaeufe} von 5 Durchl&auml;ufen frei.
      </p>
    </div>
  );
}
