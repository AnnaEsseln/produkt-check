"use client";

import { useEffect, useState } from "react";

const ZEILEN = [
  "Ideen werden eingelesen",
  "Kaufpotenzial wird gepr\u00fcft",
  "Aufwand wird gesch\u00e4tzt",
  "Ergebnis wird bewertet",
  "Ranking wird erstellt",
];

const TAKT = 3500;

export default function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((alt) => (alt < ZEILEN.length - 1 ? alt + 1 : alt));
    }, TAKT);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-lg border border-warmgrau bg-white p-8 text-center sm:p-10">
      <p aria-live="polite" className="text-xl text-black">
        {ZEILEN[index]}
      </p>

      <div className="mx-auto mt-6 flex max-w-xs gap-1.5">
        {ZEILEN.map((zeile, i) => (
          <div
            key={zeile}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i <= index ? "bg-braun" : "bg-warmgrau"
            }`}
          />
        ))}
      </div>

      <p className="mt-6 text-sm text-black/50">
        Bleib kurz auf der Seite, das dauert etwa eine Minute.
      </p>
    </div>
  );
}
