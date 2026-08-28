"use client";

import { useState } from "react";

type Props = {
  onFreigabe: (code: string) => void;
};

export default function CodeGate({ onFreigabe }: Props) {
  const [code, setCode] = useState("");
  const [fehler, setFehler] = useState("");
  const [laeuft, setLaeuft] = useState(false);

  async function pruefen() {
    const eingabe = code.trim();
    if (!eingabe) {
      setFehler("Trag bitte deinen Zugangscode ein.");
      return;
    }

    setLaeuft(true);
    setFehler("");

    try {
      const antwort = await fetch("/api/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: eingabe }),
      });
      const daten = await antwort.json();

      if (antwort.ok && daten.ok) {
        onFreigabe(eingabe);
        return;
      }
      setFehler(daten.fehler ?? "Dieser Code passt nicht.");
    } catch {
      setFehler("Die Pr\u00fcfung hat nicht geklappt. Versuch es noch einmal.");
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="rounded-lg border border-warmgrau bg-white p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl">Dein Ideen-Check</h1>
      <p className="mt-2 text-black/70">
        Gib deinen Zugangscode ein. Du findest ihn in der Mail nach deinem Kauf.
      </p>

      <label htmlFor="code" className="mt-6 block text-sm text-black/70">
        Dein Zugangscode
      </label>
      <input
        id="code"
        type="text"
        value={code}
        autoComplete="off"
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") pruefen();
        }}
        className="mt-2 w-full rounded-md border border-warmgrau bg-white px-4 py-3 text-base tracking-wide outline-none focus:border-braun"
        placeholder="z. B. IDEEN-2026-A1"
      />

      {fehler && <p className="mt-3 text-sm text-braun">{fehler}</p>}

      <button
        type="button"
        onClick={pruefen}
        disabled={laeuft}
        className="mt-5 w-full rounded-md bg-braun px-6 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {laeuft ? "Wird gepr\u00fcft" : "Weiter"}
      </button>
    </div>
  );
}
