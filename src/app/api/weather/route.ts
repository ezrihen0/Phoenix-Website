import { NextResponse } from "next/server";

import { getCityWeatherState, isSupportedWeatherCity } from "@/lib/weather/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city") || "";

  if (!isSupportedWeatherCity(city)) {
    return NextResponse.json({ ok: false, message: "Unknown city." }, { status: 400 });
  }

  const state = await getCityWeatherState(city);

  return NextResponse.json(
    {
      ok: true,
      state,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    },
  );
}
