"use client";

import { Cloud, CloudRain, CloudSnow, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { getCityBySlug, type CitySlug } from "@/lib/cities";
import type { CityWeatherSnapshot, CityWeatherState } from "@/lib/weather/types";

const CLIENT_CACHE_MS = 45 * 60 * 1000;

type WeatherBannerProps = {
  city: CitySlug;
};

type ConditionKind = "sun" | "cloud" | "snow" | "rain";

function getConditionKind(condition: string): ConditionKind {
  const text = condition.toLowerCase();

  if (/(snow|blizzard|flurr|ice pellet|hail|squall)/.test(text)) {
    return "snow";
  }

  if (/(rain|shower|drizzle|thunder|storm|precip)/.test(text)) {
    return "rain";
  }

  if (/(clear|sunny|fair|mainly sun)/.test(text)) {
    return "sun";
  }

  return "cloud";
}

function formatTemperature(value: number) {
  return `${Math.round(value)}°C`;
}

function ConditionIcon({ kind }: { kind: ConditionKind }) {
  const className = "site-weather-strip-icon";

  if (kind === "sun") {
    return <Sun className={className} aria-hidden="true" />;
  }

  if (kind === "snow") {
    return <CloudSnow className={className} aria-hidden="true" />;
  }

  if (kind === "rain") {
    return <CloudRain className={className} aria-hidden="true" />;
  }

  return <Cloud className={className} aria-hidden="true" />;
}

export function WeatherBanner({ city }: WeatherBannerProps) {
  const [snapshot, setSnapshot] = useState<CityWeatherSnapshot | null>(null);
  const cityName = getCityBySlug(city)?.name ?? city;

  useEffect(() => {
    const cacheKey = `phoenix-weather:${city}`;
    const cached = window.sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { savedAt: number; state: CityWeatherState | null };
        if (Date.now() - parsed.savedAt < CLIENT_CACHE_MS) {
          setSnapshot(parsed.state?.snapshot ?? null);
          return;
        }
      } catch {
        window.sessionStorage.removeItem(cacheKey);
      }
    }

    fetch(`/api/weather?city=${city}`)
      .then((response) => response.json())
      .then((payload: { state?: CityWeatherState | null }) => {
        const nextSnapshot = payload.state?.snapshot ?? null;
        setSnapshot(nextSnapshot);
        window.sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ savedAt: Date.now(), state: payload.state || null }),
        );
      })
      .catch(() => {
        setSnapshot(null);
      });
  }, [city]);

  if (!snapshot) {
    return null;
  }

  const condition = snapshot.condition.trim();
  const temperature = formatTemperature(snapshot.temperatureC);
  const kind = getConditionKind(condition);
  const desktopLabel = condition
    ? `${cityName} · ${temperature} · ${condition}`
    : `${cityName} · ${temperature}`;
  const mobileLabel = condition ? `${temperature} · ${condition}` : temperature;

  return (
    <div className="site-weather-strip" aria-label={`Current weather in ${desktopLabel}`}>
      <div className="page-bleed site-weather-strip-inner">
        <ConditionIcon kind={kind} />
        <p className="site-weather-strip-copy">
          <span className="site-weather-strip-desktop">{desktopLabel}</span>
          <span className="site-weather-strip-mobile">{mobileLabel}</span>
        </p>
      </div>
    </div>
  );
}
