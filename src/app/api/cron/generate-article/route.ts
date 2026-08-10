import { NextResponse } from "next/server";

import { getCityBySlug } from "@/lib/cities";
import { generateDailyArticle } from "@/lib/ai/generate-article";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  return authorization === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const city = getCityBySlug(new URL(request.url).searchParams.get("city") || "")?.slug;
    const result = await generateDailyArticle(city ? { city } : undefined);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[cron-generate-article] Failed", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}