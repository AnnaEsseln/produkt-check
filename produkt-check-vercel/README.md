# Ideen-Check

Web-App, die Produktideen von Dienstleistern bewertet und sagt, welche davon verkaufbar ist.
Der Nutzer fuegt die komplette ChatGPT-Antwort in ein Feld ein und bekommt ein Ranking,
eine Detailanalyse der Gewinner-Idee und die Killer-Kriterien.

## Umgebungsvariablen

Zwei Variablen muessen gesetzt sein. Lokal in einer Datei `.env.local`, auf Vercel unter
Settings, Environment Variables.

| Variable | Wofuer |
| --- | --- |
| `ANTHROPIC_API_KEY` | API-Key von console.anthropic.com. Wird nur serverseitig gelesen und landet nie im Frontend. |
| `ACCESS_CODES` | Gueltige Zugangscodes, kommagetrennt, zum Beispiel `IDEEN-2026-A1,IDEEN-2026-A2`. |

Vorlage steht in `.env.example`.

## Lokal starten

```bash
npm install
cp .env.example .env.local   # danach die echten Werte eintragen
npm run dev
```

Laeuft dann auf http://localhost:3000

## Neue Zugangscodes ergaenzen

Codes stehen ausschliesslich in der Umgebungsvariable `ACCESS_CODES`, kommagetrennt.
Auf Vercel den Wert unter Settings, Environment Variables bearbeiten und danach einmal
neu deployen (Deployments, Redeploy). Es gibt keine Datenbank und keine Code-Liste im Code.

Gross- und Kleinschreibung sowie Leerzeichen sind egal, `ideen-2026-a1` und `IDEEN-2026-A1`
gelten als derselbe Code.

Nach ThriveCart-Kauf bekommt der Kaeufer einen dieser Codes per Mail. Wenn du pro Kaeufer
einen eigenen Code willst, leg einfach mehrere an und vergib sie einzeln.

## Systemprompt aendern

Der komplette Systemprompt fuer die Bewertung steht in **`lib/prompt.ts`**, in der
Konstante `SYSTEM_PROMPT`. Wenn die Bewertungslogik nachgeschaerft werden soll, also
Achsen, Strenge der Noten, Preisrahmen oder Tonalitaet, wird nur diese Datei angefasst.

Modell und `max_tokens` stehen in `app/api/analyze/route.ts` ganz oben
(`MODELL`, `MAX_TOKENS`).

Die JSON-Struktur, die das Modell zurueckgeben muss, ist zusaetzlich in `lib/types.ts`
typisiert und wird dort per `istErgebnis` geprueft. Wenn du die Struktur im Prompt
aenderst, musst du sie dort mitziehen.

## Begrenzung auf fuenf Durchlaeufe

Der Zaehler liegt aktuell im `localStorage` des Browsers, Schluessel
`ideencheck_laeufe_<CODE>`. Das reicht fuer ein Produkt zu 27 Euro.

Falls Missbrauch auftritt, wird auf Vercel KV umgestellt. Die Stelle ist in
`app/page.tsx` kommentiert: Zaehler pro Code serverseitig in KV halten und in
`app/api/analyze/route.ts` pruefen und hochzaehlen, bevor das Modell gefragt wird.

## Was das Tool nicht macht

Keine Nutzerkonten, kein Login, keine Datenbank. Eingaben und Ergebnisse werden auf dem
Server nicht gespeichert. Die Zahlung laeuft ueber ThriveCart, nicht im Tool.

## Struktur

```
app/page.tsx               Hauptseite mit allen Zustaenden
app/api/analyze/route.ts   API-Call an Claude, gibt JSON zurueck
app/api/verify/route.ts    Zugangscode pruefen
components/CodeGate.tsx    Zugangscode-Eingabe
components/InputForm.tsx   Textarea und Button
components/LoadingState.tsx  wechselnde Statuszeilen
components/IdeaCard.tsx    eine Idee mit Scores
components/ScoreBar.tsx    ein Balken
components/WinnerAnalysis.tsx  Gewinner im Detail
components/KillerCriteria.tsx  feste Kriterien, nicht aus der KI
lib/prompt.ts              der Systemprompt
lib/types.ts               Typen und Pruefung der JSON-Antwort
lib/access.ts              Pruefung der Zugangscodes
```
