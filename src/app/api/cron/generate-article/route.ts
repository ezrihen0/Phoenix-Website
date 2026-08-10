import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      disabled: true,
      message:
        "Scheduled article generation is disabled. Use the admin article tools to create drafts for owner review.",
    },
    { status: 410 },
  );
}
