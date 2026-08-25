"use client";

import { ArrowRight, Cloud, CloudRain, CloudSnow, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trackWeatherArticleStripClick, trackWeatherArticleStripImpression } from "@/lib/analytics/events";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import type { CityWeatherSnapshot, CityWeatherState, WeatherArticleStrip } from "@/lib/weather/types";

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
  const [articleStrip, setArticleStrip] = useState<WeatherArticleStrip | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "empty">("loading");
  const impressionKey = useRef<string | null>(null);
  const cityName = getCityBySlug(city)?.name ?? city;

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `phoenix-weather:v2:${city}`;
    const cached = window.sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { savedAt: number; state: CityWeatherState | null };
        if (Date.now() - parsed.savedAt < CLIENT_CACHE_MS) {
          if (!cancelled) {
            setSnapshot(parsed.state?.snapshot ?? null);
            setArticleStrip(parsed.state?.articleStrip ?? null);
            setLoadState(parsed.state?.snapshot ? "ready" : "empty");
          }
          return;
        }
      } catch {
        window.sessionStorage.removeItem(cacheKey);
      }
    }

    fetch(`/api/weather?city=${city}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        return response.json();
      })
      .then((payload: { state?: CityWeatherState | null }) => {
        if (cancelled) {
          return;
        }

        const nextSnapshot = payload.state?.snapshot ?? null;
        setSnapshot(nextSnapshot);
        setArticleStrip(payload.state?.articleStrip ?? null);
        setLoadState(nextSnapshot ? "ready" : "empty");
        window.sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ savedAt: Date.now(), state: payload.state || null }),
        );
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setSnapshot(null);
        setArticleStrip(null);
        setLoadState("empty");
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  useEffect(() => {
    if (!articleStrip) {
      impressionKey.current = null;
      return;
    }

    const key = `${city}:${articleStrip.tag}:${articleStrip.articleSlug}`;

    if (impressionKey.current === key) {
      return;
    }

    impressionKey.current = key;
    trackWeatherArticleStripImpression(city, articleStrip.tag, articleStrip.articleSlug);
  }, [articleStrip, city]);

  if (loadState === "empty") {
    return null;
  }

  if (loadState === "loading" || !snapshot) {
    return (
      <div className="site-weather-strip" aria-hidden="true">
        <div className="page-bleed site-weather-strip-inner" />
      </div>
    );
  }

  const condition = snapshot.condition.trim();
  const temperature = formatTemperature(snapshot.temperatureC);
  const kind = getConditionKind(condition);
  const factsDesktop = condition
    ? `${cityName} · ${temperature} · ${condition}`
    : `${cityName} · ${temperature}`;
  const factsMobile = condition ? `${temperature} · ${condition}` : temperature;
  const desktopLabel = articleStrip
    ? `${temperature} in ${cityName} — ${articleStrip.label}`
    : factsDesktop;
  const mobileLabel = articleStrip
    ? `${temperature} · ${articleStrip.articleShortTitle}`
    : factsMobile;
  const ariaLabel = articleStrip
    ? `${desktopLabel}. Read ${articleStrip.articleTitle}`
    : `Current weather in ${factsDesktop}`;

  const copy = (
    <>
      <ConditionIcon kind={kind} />
      <p className="site-weather-strip-copy">
        <span className="site-weather-strip-desktop">
          {desktopLabel}
          {articleStrip ? (
            <>
              {" · "}
              <span className="site-weather-strip-cta">{articleStrip.articleTitle}</span>
            </>
          ) : null}
        </span>
        <span className="site-weather-strip-mobile">{mobileLabel}</span>
      </p>
      {articleStrip ? <ArrowRight className="site-weather-strip-arrow" aria-hidden="true" /> : null}
    </>
  );

  if (articleStrip) {
    return (
      <div className="site-weather-strip">
        <div className="page-bleed site-weather-strip-inner">
          <Link
            href={articleStrip.href}
            className="site-weather-strip-link"
            aria-label={ariaLabel}
            onClick={() => {
              trackWeatherArticleStripClick(city, articleStrip.tag, articleStrip.articleSlug);
            }}
          >
            {copy}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="site-weather-strip" aria-label={ariaLabel}>
      <div className="page-bleed site-weather-strip-inner">{copy}</div>
    </div>
  );
}
