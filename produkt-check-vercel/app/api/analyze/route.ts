import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { istErgebnis } from "@/lib/types";
import { codeIstGueltig } from "@/lib/access";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODELL = "claude-sonnet-4-6";
const MAX_TOKENS = 4000;
const MIN_ZEICHEN = 200;

/** Entfernt Markdown-Backticks und schneidet auf das aeussere JSON-Objekt zu. */
function jsonAusText(text: string): unknown {
  let roh = text.trim();
  roh = roh.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  const start = roh.indexOf("{");
  const ende = roh.lastIndexOf("}");
  if (start === -1 || ende === -1 || ende <= start) {
    throw new Error("Kein JSON in der Antwort gefunden.");
  }

  return JSON.parse(roh.slice(start, ende + 1));
}

async function frageModell(userMessage: string): Promise<unknown> {
  const antwort = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODELL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!antwort.ok) {
    throw new Error(`API-Status ${antwort.status}`);
  }

  const daten = (await antwort.json()) as {
    content?: { type: string; text?: string }[];
  };

  const text = (daten.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("\n")
    .trim();

  if (!text) throw new Error("Leere Antwort vom Modell.");

  const ergebnis = jsonAusText(text);
  if (!istErgebnis(ergebnis)) {
    throw new Error("Antwort passt nicht zur erwarteten Struktur.");
  }

  return ergebnis;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { fehler: "Auf dem Server fehlt der API-Key. Melde dich kurz bei uns." },
      { status: 500 },
    );
  }

  let body: { code?: unknown; text?: unknown; extra?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ fehler: "Anfrage nicht lesbar." }, { status: 400 });
  }

  if (!codeIstGueltig(body.code)) {
    return NextResponse.json(
      { fehler: "Dein Zugangscode gilt nicht mehr. Gib ihn bitte neu ein." },
      { status: 401 },
    );
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (text.length < MIN_ZEICHEN) {
    return NextResponse.json(
      {
        fehler:
          "Das sieht zu kurz aus. Kopier bitte die komplette Antwort von ChatGPT rein.",
      },
      { status: 400 },
    );
  }

  const extra = typeof body.extra === "string" ? body.extra.trim() : "";
  const userMessage = extra
    ? `${text}\n\nZusaetzlicher Hinweis von der Person:\n${extra}`
    : text;

  // Ein Versuch, bei Fehler oder ungueltigem JSON genau eine Wiederholung.
  try {
    return NextResponse.json(await frageModell(userMessage));
  } catch {
    try {
      return NextResponse.json(await frageModell(userMessage));
    } catch {
      return NextResponse.json(
        { fehler: "Die Auswertung hat nicht geklappt. Versuch es noch einmal." },
        { status: 502 },
      );
    }
  }
}
