export type Scores = {
  kaufpotenzial: number;
  einfachheit: number;
  skalierbarkeit: number;
  ergebnis: number;
};

export type Idee = {
  name: string;
  kurzbeschreibung: string;
  scores: Scores;
  gesamt: number;
  gewinner: boolean;
  warum_nicht?: string;
};

export type GewinnerAnalyse = {
  stark: string;
  schwach: string;
  schaerfen: string[];
  versprechen: string;
  preis: string;
  preis_begruendung: string;
};

export type ErgebnisOk = {
  gueltig: true;
  ideen: Idee[];
  gewinner_analyse: GewinnerAnalyse;
};

export type ErgebnisUngueltig = {
  gueltig: false;
  hinweis: string;
};

export type Ergebnis = ErgebnisOk | ErgebnisUngueltig;

export const ACHSEN: { key: keyof Scores; label: string }[] = [
  { key: "kaufpotenzial", label: "Kaufpotenzial" },
  { key: "einfachheit", label: "Einfachheit" },
  { key: "skalierbarkeit", label: "Skalierbarkeit" },
  { key: "ergebnis", label: "Ergebnis" },
];

/**
 * Prueft grob, ob die Antwort des Modells der erwarteten Struktur entspricht.
 * Schuetzt das Frontend davor, auf halbfertigem JSON zu rendern.
 */
export function istErgebnis(wert: unknown): wert is Ergebnis {
  if (typeof wert !== "object" || wert === null) return false;
  const o = wert as Record<string, unknown>;

  if (o.gueltig === false) {
    return typeof o.hinweis === "string";
  }
  if (o.gueltig !== true) return false;
  if (!Array.isArray(o.ideen) || o.ideen.length === 0) return false;

  const ideenOk = o.ideen.every((i) => {
    if (typeof i !== "object" || i === null) return false;
    const idee = i as Record<string, unknown>;
    const s = idee.scores as Record<string, unknown> | undefined;
    return (
      typeof idee.name === "string" &&
      typeof idee.gesamt === "number" &&
      typeof s === "object" &&
      s !== null &&
      typeof s.kaufpotenzial === "number" &&
      typeof s.einfachheit === "number" &&
      typeof s.skalierbarkeit === "number" &&
      typeof s.ergebnis === "number"
    );
  });
  if (!ideenOk) return false;

  const g = o.gewinner_analyse as Record<string, unknown> | undefined;
  return (
    typeof g === "object" &&
    g !== null &&
    typeof g.stark === "string" &&
    typeof g.schwach === "string" &&
    Array.isArray(g.schaerfen)
  );
}
