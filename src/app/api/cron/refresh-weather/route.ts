import { NextResponse } from "next/server";

import { refreshWeatherCache } from "@/lib/weather/store";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await refreshWeatherCache();
    return NextResponse.json({
      ok: true,
      updatedAt: store.updatedAt,
      cities: Object.keys(store.cities),
    });
  } catch (error) {
    console.error("[cron-refresh-weather] Failed", error);
    return NextResponse.json(
      { ok: false, message: "Weather refresh failed. The website remains operational." },
      { status: 500 },
    );
  }
}
