"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trackWeatherBannerCta, trackWeatherBannerView } from "@/lib/analytics/events";
import type { CitySlug } from "@/lib/cities";
import type { CityWeatherState } from "@/lib/weather/types";

const CLIENT_CACHE_MS = 45 * 60 * 1000;

type WeatherBannerProps = {
  city: CitySlug;
};

export function WeatherBanner({ city }: WeatherBannerProps) {
  const [state, setState] = useState<CityWeatherState | null>(null);
  const viewed = useRef(false);

  useEffect(() => {
    const cacheKey = `phoenix-weather:${city}`;
    const cached = window.sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { savedAt: number; state: CityWeatherState | null };
        if (Date.now() - parsed.savedAt < CLIENT_CACHE_MS) {
          setState(parsed.state);
          return;
        }
      } catch {
        window.sessionStorage.removeItem(cacheKey);
      }
    }

    fetch(`/api/weather?city=${city}`)
      .then((response) => response.json())
      .then((payload: { state?: CityWeatherState | null }) => {
        setState(payload.state || null);
        window.sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ savedAt: Date.now(), state: payload.state || null }),
        );
      })
      .catch(() => {
        setState(null);
      });
  }, [city]);

  useEffect(() => {
    if (!state?.recommendation || viewed.current) {
      return;
    }

    viewed.current = true;
    trackWeatherBannerView(city);
  }, [city, state]);

  if (!state?.recommendation) {
    return null;
  }

  return (
    <div className="border-b border-[var(--color-border)] bg-[rgba(201,95,43,0.08)]">
      <div className="page-bleed flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[var(--color-ink)]">{state.recommendation.body}</p>
        <Link
          href={state.recommendation.href}
          data-cta="weather-banner"
          onClick={() => trackWeatherBannerCta(city)}
          className="inline-flex shrink-0 rounded-full bg-[var(--color-ember)] px-4 py-2 text-sm font-semibold text-white"
        >
          {state.recommendation.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
