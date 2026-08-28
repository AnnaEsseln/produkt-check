import { NextResponse } from "next/server";
import { codeIstGueltig } from "@/lib/access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const code = (body as { code?: unknown })?.code;

  if (!codeIstGueltig(code)) {
    return NextResponse.json(
      { ok: false, fehler: "Dieser Code passt nicht. Pruef bitte die Schreibweise." },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
