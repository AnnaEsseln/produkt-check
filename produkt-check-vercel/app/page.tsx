"use client";

import { useEffect, useMemo, useState } from "react";
import CodeGate from "@/components/CodeGate";
import InputForm from "@/components/InputForm";
import LoadingState from "@/components/LoadingState";
import IdeaCard from "@/components/IdeaCard";
import WinnerAnalysis from "@/components/WinnerAnalysis";
import KillerCriteria from "@/components/KillerCriteria";
import type { Ergebnis } from "@/lib/types";

const SPEICHER_CODE = "ideencheck_code";
const MAX_LAEUFE = 5;
const MIN_ZEICHEN = 200;

/**
 * Zaehler fuer die Durchlaeufe.
 * Liegt bewusst im localStorage, das reicht fuer ein Produkt zu 27 Euro.
 * Wenn Missbrauch auftritt, wird an genau dieser Stelle auf Vercel KV
 * umgestellt: Zaehler serverseitig pro Code in KV halten und in
 * /api/analyze pruefen und hochzaehlen, bevor das Modell gefragt wird.
 */
function zaehlerSchluessel(code: string) {
  return `ideencheck_laeufe_${code.trim().toUpperCase()}`;
}

function ladeLaeufe(code: string): number {
  const wert = Number(window.localStorage.getItem(zaehlerSchluessel(code)));
  return Number.isFinite(wert) && wert > 0 ? wert : 0;
}

type Zustand = "eingabe" | "laedt" | "ergebnis";

export default function Seite() {
  const [bereit, setBereit] = useState(false);
  const [code, setCode] = useState("");
  const [laeufe, setLaeufe] = useState(0);

  const [zustand, setZustand] = useState<Zustand>("eingabe");
  const [text, setText] = useState("");
  const [extra, setExtra] = useState("");
  const [fehler, setFehler] = useState("");
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);

  useEffect(() => {
    const gespeichert = window.localStorage.getItem(SPEICHER_CODE) ?? "";
    if (gespeichert) {
      setCode(gespeichert);
      setLaeufe(ladeLaeufe(gespeichert));
    }
    setBereit(true);
  }, []);

  function freigeben(neuerCode: string) {
    window.localStorage.setItem(SPEICHER_CODE, neuerCode);
    setCode(neuerCode);
    setLaeufe(ladeLaeufe(neuerCode));
  }

  async function starten() {
    setFehler("");

    if (text.trim().length < MIN_ZEICHEN) {
      setFehler(
        "Das sieht zu kurz aus. Kopier bitte die komplette Antwort von ChatGPT rein.",
      );
      return;
    }

    setZustand("laedt");

    try {
      const antwort = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, text, extra }),
      });
      const daten = await antwort.json();

      if (!antwort.ok) {
        if (antwort.status === 401) {
          window.localStorage.removeItem(SPEICHER_CODE);
          setCode("");
        }
        setFehler(
          daten.fehler ?? "Die Auswertung hat nicht geklappt. Versuch es noch einmal.",
        );
        setZustand("eingabe");
        return;
      }

      const naechster = laeufe + 1;
      window.localStorage.setItem(zaehlerSchluessel(code), String(naechster));
      setLaeufe(naechster);

      setErgebnis(daten as Ergebnis);
      setZustand("ergebnis");
      window.scrollTo({ top: 0 });
    } catch {
      setFehler("Die Auswertung hat nicht geklappt. Versuch es noch einmal.");
      setZustand("eingabe");
    }
  }

  function neuStarten() {
    setErgebnis(null);
    setText("");
    setExtra("");
    setFehler("");
    setZustand("eingabe");
    window.scrollTo({ top: 0 });
  }

  const sortiert = useMemo(() => {
    if (!ergebnis || !ergebnis.gueltig) return [];
    return [...ergebnis.ideen].sort((a, b) => {
      if (b.gesamt !== a.gesamt) return b.gesamt - a.gesamt;
      return b.scores.kaufpotenzial - a.scores.kaufpotenzial;
    });
  }, [ergebnis]);

  if (!bereit) {
    return <main className="min-h-screen bg-beige" />;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-seite px-5 py-10 sm:px-6 sm:py-16">
      {!code ? (
        <CodeGate onFreigabe={freigeben} />
      ) : laeufe >= MAX_LAEUFE && zustand !== "ergebnis" ? (
        <div className="rounded-lg border border-warmgrau bg-white p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl">Deine f&uuml;nf Checks sind durch</h1>
          <p className="mt-3 text-black/80">
            Mehr braucht es meistens auch nicht. Du hast jetzt eine Idee, die
            tr&auml;gt. Der n&auml;chste Schritt ist, sie zu bauen und zu verkaufen.
          </p>
          <a
            href="#"
            className="mt-6 inline-block rounded-md bg-braun px-6 py-3 text-white transition-opacity hover:opacity-90"
          >
            {/* Platzhalter: hier spaeter den Link zum weiterfuehrenden Angebot eintragen */}
            Nimm den n&auml;chsten Schritt
          </a>
        </div>
      ) : zustand === "laedt" ? (
        <LoadingState />
      ) : zustand === "ergebnis" && ergebnis ? (
        !ergebnis.gueltig ? (
          <div className="rounded-lg border border-warmgrau bg-white p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl">Da fehlen mir die Ideen</h1>
            <p className="mt-3 text-black/80">{ergebnis.hinweis}</p>
            <button
              type="button"
              onClick={neuStarten}
              className="mt-6 rounded-md bg-braun px-6 py-3 text-white transition-opacity hover:opacity-90"
            >
              Nochmal einf&uuml;gen
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <header>
              <h1 className="text-3xl leading-tight sm:text-4xl">
                Dein Ergebnis
              </h1>
              <p className="mt-2 text-lg text-black/70">
                Sortiert nach Gesamtscore. Oben steht die Idee, mit der du
                startest.
              </p>
            </header>

            <section className="space-y-4">
              {sortiert.map((idee, i) => (
                <IdeaCard key={idee.name} idee={idee} hervorgehoben={i === 0} />
              ))}
            </section>

            {sortiert.length > 1 && (
              <section className="print-block rounded-lg border border-warmgrau bg-white p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl">Warum die anderen nicht</h2>
                <div className="mt-4 space-y-4">
                  {sortiert.slice(1).map((idee) => (
                    <div
                      key={idee.name}
                      className="border-t border-warmgrau pt-4 first:border-0 first:pt-0"
                    >
                      <h3 className="text-base">{idee.name}</h3>
                      <p className="mt-1 text-black/70">
                        {idee.warum_nicht ??
                          "Der Gesamtscore liegt unter dem der Gewinner-Idee."}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <WinnerAnalysis
              analyse={ergebnis.gewinner_analyse}
              name={sortiert[0]?.name ?? "Deine Idee"}
            />

            <KillerCriteria />

            <div className="no-print flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full rounded-md bg-braun px-6 py-3 text-white transition-opacity hover:opacity-90"
              >
                Ergebnis als PDF sichern
              </button>
              <button
                type="button"
                onClick={neuStarten}
                className="w-full rounded-md border border-warmgrau bg-white px-6 py-3 transition-colors hover:border-braun"
              >
                Neue Ideen checken
              </button>
            </div>
          </div>
        )
      ) : (
        <InputForm
          text={text}
          setText={setText}
          extra={extra}
          setExtra={setExtra}
          fehler={fehler}
          onStart={starten}
          restlaeufe={Math.max(0, MAX_LAEUFE - laeufe)}
        />
      )}
    </main>
  );
}
