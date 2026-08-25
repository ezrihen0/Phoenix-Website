import { NextResponse } from "next/server";

import { requestPortalMagicLink } from "@/lib/portal/adapter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email = "";

  try {
    const payload = (await request.json()) as { email?: unknown };
    email = typeof payload.email === "string" ? payload.email.trim() : "";
  } catch {
    email = "";
  }

  const result = await requestPortalMagicLink(email);

  return NextResponse.json(
    {
      ok: result.accepted,
      status: result.connection.status,
      message: result.connection.message,
    },
    { status: 200 },
  );
}
