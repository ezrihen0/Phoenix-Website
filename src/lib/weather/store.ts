import "server-only";

import { get, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";

import { CITY_SLUGS, cities } from "@/lib/cities";
import { ecccWeatherProvider } from "@/lib/weather/provider";
import { resolveWeatherArticleStrip } from "@/lib/weather/article-strip";
import {
  WEATHER_RULES,
  type CityWeatherSnapshot,
  type CityWeatherState,
  type WeatherRecommendation,
} from "@/lib/weather/types";

const LOCAL_WEATHER_FILE = path.join(process.cwd(), "data", "cms", "weather.json");
const REMOTE_WEATHER_KEY = "cms/weather.json";
const FRESHNESS_MS = 90 * 60 * 1000;

type WeatherStore = {
  updatedAt: string;
  cities: Record<string, CityWeatherSnapshot>;
};

function rulesEnabled() {
  return process.env.WEATHER_RULES_ENABLED === "true";
}

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function getWeatherBlobAccess(): "public" | "private" {
  return process.env.BLOB_STORE_ACCESS === "public" ? "public" : "private";
}

function getWeatherBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
}

async function readStore(): Promise<WeatherStore> {
  const empty: WeatherStore = { updatedAt: "", cities: {} };

  try {
    if (hasBlobStorage()) {
      const token = getWeatherBlobToken();
      const blob = await get(REMOTE_WEATHER_KEY, {
        access: getWeatherBlobAccess(),
        useCache: false,
        ...(token ? { token } : {}),
      });
      if (!blob || blob.statusCode !== 200 || !blob.stream) {
        return empty;
      }
      return (await new Response(blob.stream).json()) as WeatherStore;
    }

    const raw = await fs.readFile(LOCAL_WEATHER_FILE, "utf8");
    return JSON.parse(raw) as WeatherStore;
  } catch {
    return empty;
  }
}

async function writeStore(store: WeatherStore) {
  const payload = JSON.stringify(store, null, 2);

  if (hasBlobStorage()) {
    const token = getWeatherBlobToken();
    await put(REMOTE_WEATHER_KEY, payload, {
      access: getWeatherBlobAccess(),
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType: "application/json; charset=utf-8",
      ...(token ? { token } : {}),
    });
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_WEATHER_FILE), { recursive: true });
  await fs.writeFile(LOCAL_WEATHER_FILE, payload, "utf8");
}

function resolveRecommendation(snapshot: CityWeatherSnapshot): WeatherRecommendation | null {
  if (!rulesEnabled()) {
    return null;
  }

  const age = Date.now() - new Date(snapshot.updatedAt).getTime();
  if (!Number.isFinite(age) || age > FRESHNESS_MS) {
    return null;
  }

  const active = WEATHER_RULES.find((rule) => rule.enabled);
  if (!active) {
    return null;
  }

  return {
    ruleId: active.id,
    headline: active.label,
    body: active.recommendation,
    href: active.educationHref,
    ctaLabel: active.ctaLabel,
  };
}

export async function refreshWeatherCache() {
  const previous = await readStore();
  const nextCities: Record<string, CityWeatherSnapshot> = { ...previous.cities };

  for (const city of cities) {
    try {
      nextCities[city.slug] = await ecccWeatherProvider.fetchCityWeather(city.slug);
    } catch (error) {
      console.error(`[weather] Provider failed for ${city.slug}. Keeping previous snapshot if present.`, error);
    }
  }

  const store: WeatherStore = {
    updatedAt: new Date().toISOString(),
    cities: nextCities,
  };

  await writeStore(store);
  return store;
}

export async function getCityWeatherState(citySlug: string): Promise<CityWeatherState | null> {
  const store = await readStore();
  let snapshot = store.cities[citySlug];

  if ((!snapshot || !snapshot.sourceUrl) && isSupportedWeatherCity(citySlug)) {
    try {
      snapshot = await ecccWeatherProvider.fetchCityWeather(citySlug);
      try {
        await writeStore({
          updatedAt: new Date().toISOString(),
          cities: { ...store.cities, [citySlug]: snapshot },
        });
      } catch (error) {
        console.error(`[weather] Failed to persist snapshot for ${citySlug}.`, error);
      }
    } catch (error) {
      console.error(`[weather] Provider miss-fill failed for ${citySlug}.`, error);
      if (!snapshot) {
        return null;
      }
    }
  }

  if (!snapshot) {
    return null;
  }

  let articleStrip = null;

  try {
    if (isSupportedWeatherCity(citySlug)) {
      articleStrip = await resolveWeatherArticleStrip(citySlug, snapshot);
    }
  } catch (error) {
    console.error(`[weather] Article strip lookup failed for ${citySlug}.`, error);
  }

  return {
    snapshot,
    recommendation: resolveRecommendation(snapshot),
    articleStrip,
  };
}

export function isSupportedWeatherCity(value: string): value is (typeof CITY_SLUGS)[number] {
  return CITY_SLUGS.includes(value as (typeof CITY_SLUGS)[number]);
}
