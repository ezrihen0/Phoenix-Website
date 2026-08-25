import "server-only";

import type { CitySlug } from "@/lib/cities";
import { getCityBySlug } from "@/lib/cities";
import type { CityWeatherSnapshot } from "@/lib/weather/types";

const ECCC_FETCH_TIMEOUT_MS = 2500;
const NEAR_TERM_HOURS = 12;

export type WeatherProvider = {
  id: string;
  fetchCityWeather: (city: CitySlug) => Promise<CityWeatherSnapshot>;
};

type Localized<T> = {
  en?: T;
  fr?: T;
};

type LocalizedValue<T> = {
  value?: Localized<T> | T;
};

type EcccHourlyForecast = {
  condition?: Localized<string>;
  timestamp?: string;
};

type EcccCitypageProperties = {
  identifier?: string;
  lastUpdated?: string;
  name?: Localized<string>;
  url?: Localized<string>;
  currentConditions?: {
    condition?: Localized<string>;
    timestamp?: Localized<string>;
    temperature?: LocalizedValue<number>;
    relativeHumidity?: LocalizedValue<number>;
    wind?: {
      speed?: LocalizedValue<number>;
      direction?: LocalizedValue<string> | Localized<string>;
    };
  };
  hourlyForecastGroup?: {
    hourlyForecasts?: EcccHourlyForecast[];
  };
  hourlyForecasts?: EcccHourlyForecast[];
};

type EcccCitypageFeature = {
  id?: string;
  properties?: EcccCitypageProperties;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readLocalized(value: unknown): unknown {
  if (!isRecord(value)) {
    return value ?? undefined;
  }

  return "en" in value ? value.en : undefined;
}

function readLocalizedValue(field: unknown): unknown {
  if (!isRecord(field)) {
    return undefined;
  }

  if ("value" in field) {
    return readLocalized(field.value);
  }

  return readLocalized(field);
}

function readFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readTrimmedString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function collectForecastConditions(properties: EcccCitypageProperties): string[] {
  const hourly =
    properties.hourlyForecastGroup?.hourlyForecasts || properties.hourlyForecasts || [];

  return hourly
    .slice(0, NEAR_TERM_HOURS)
    .map((entry) => readTrimmedString(readLocalized(entry.condition)))
    .filter((condition): condition is string => Boolean(condition));
}

export const ecccWeatherProvider: WeatherProvider = {
  id: "eccc-geomet",
  async fetchCityWeather(city) {
    const config = getCityBySlug(city);

    if (!config) {
      throw new Error(`Unsupported weather city: ${city}`);
    }

    const url = new URL(
      `https://api.weather.gc.ca/collections/citypageweather-realtime/items/${config.ecccCitypageId}`,
    );
    url.searchParams.set("f", "json");
    url.searchParams.set("lang", "en");

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/geo+json, application/json",
        "User-Agent": "PhoenixFireplace/1.0 (+https://phoenixfireplace.ca)",
      },
      signal: AbortSignal.timeout(ECCC_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Weather provider failed for ${city}`);
    }

    const payload = (await response.json()) as EcccCitypageFeature;
    const properties = payload.properties;

    if (!properties) {
      throw new Error(`Weather provider returned no properties for ${city}`);
    }

    const reportedName = readTrimmedString(readLocalized(properties.name));
    const reportedId = readTrimmedString(properties.identifier) || readTrimmedString(payload.id);

    if (reportedName !== config.name || reportedId !== config.ecccCitypageId) {
      throw new Error(`Weather provider city mismatch for ${city}`);
    }

    const current = properties.currentConditions;
    const temperatureC = readFiniteNumber(readLocalizedValue(current?.temperature));
    const condition = readTrimmedString(readLocalized(current?.condition));
    const updatedAt =
      readTrimmedString(readLocalized(current?.timestamp)) ||
      readTrimmedString(properties.lastUpdated);

    if (temperatureC == null || !updatedAt) {
      throw new Error(`Weather provider returned incomplete observations for ${city}`);
    }

    const humidityPct = readFiniteNumber(readLocalizedValue(current?.relativeHumidity));
    const windKph = readFiniteNumber(readLocalizedValue(current?.wind?.speed));
    const windDirection =
      readTrimmedString(readLocalizedValue(current?.wind?.direction)) ||
      readTrimmedString(readLocalized(current?.wind?.direction));
    const sourceUrl = readTrimmedString(readLocalized(properties.url));
    const forecastConditions = collectForecastConditions(properties);

    return {
      city,
      temperatureC,
      ...(windKph != null ? { windKph } : {}),
      ...(windDirection ? { windDirection } : {}),
      ...(humidityPct != null ? { humidityPct } : {}),
      condition: condition || "",
      ...(forecastConditions.length > 0 ? { forecastConditions } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
      updatedAt,
    };
  },
};
