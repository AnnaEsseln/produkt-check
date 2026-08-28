/**
 * Zugangscodes. Stehen serverseitig in der Umgebungsvariable ACCESS_CODES,
 * kommagetrennt. Gross- und Kleinschreibung sowie Leerzeichen sind egal.
 */
export function codeIstGueltig(code: unknown): boolean {
  if (typeof code !== "string") return false;
  const eingabe = code.trim().toUpperCase();
  if (!eingabe) return false;

  const gueltige = (process.env.ACCESS_CODES ?? "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);

  return gueltige.includes(eingabe);
}
