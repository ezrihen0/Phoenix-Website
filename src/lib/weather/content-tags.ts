export const WEATHER_CONTENT_TAGS = [
  "cold-weather",
  "gas-startup",
  "freeze-thaw",
  "chimney-leak",
  "snow-melt",
  "rain",
  "pre-winter",
  "masonry",
  "wett",
  "maintenance",
] as const;

export type WeatherContentTag = (typeof WEATHER_CONTENT_TAGS)[number];

export const WEATHER_CONTENT_TAG_LABELS: Record<WeatherContentTag, string> = {
  "cold-weather": "Cold-weather fireplace content",
  "gas-startup": "Gas fireplace startup guide",
  "freeze-thaw": "Freeze/thaw masonry guide",
  "chimney-leak": "Chimney leak guide",
  "snow-melt": "Snow-melt chimney guide",
  rain: "Rain and chimney moisture guide",
  "pre-winter": "Pre-winter fireplace content",
  masonry: "Masonry guide",
  wett: "WETT inspection guide",
  maintenance: "Fireplace maintenance guide",
};

const WEATHER_CONTENT_TAG_SET = new Set<string>(WEATHER_CONTENT_TAGS);

export function isWeatherContentTag(value: string): value is WeatherContentTag {
  return WEATHER_CONTENT_TAG_SET.has(value);
}

export function sanitizeWeatherTags(value: unknown): WeatherContentTag[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<WeatherContentTag>();

  for (const entry of value) {
    if (typeof entry !== "string") {
      continue;
    }

    const tag = entry.trim();

    if (isWeatherContentTag(tag) && !seen.has(tag)) {
      seen.add(tag);
    }
  }

  return [...seen];
}

export function isPrecipOrMeltCondition(condition: string) {
  const text = condition.toLowerCase();

  if (!text.trim()) {
    return false;
  }

  return /(rain|drizzle|thunder|wet snow|melting|\bmelt\b)/.test(text);
}

export function getWeatherContentTagPriority(snapshot: {
  temperatureC: number;
  condition: string;
}) {
  if (isPrecipOrMeltCondition(snapshot.condition)) {
    return ["chimney-leak", "snow-melt"] as const satisfies readonly WeatherContentTag[];
  }

  const temperatureC = snapshot.temperatureC;

  if (!Number.isFinite(temperatureC)) {
    return [] as const satisfies readonly WeatherContentTag[];
  }

  if (temperatureC < -15) {
    return ["cold-weather", "gas-startup"] as const satisfies readonly WeatherContentTag[];
  }

  if (temperatureC <= -5) {
    return ["gas-startup", "pre-winter"] as const satisfies readonly WeatherContentTag[];
  }

  if (temperatureC <= 5) {
    return ["freeze-thaw", "masonry"] as const satisfies readonly WeatherContentTag[];
  }

  if (temperatureC > 10) {
    return ["maintenance"] as const satisfies readonly WeatherContentTag[];
  }

  return [] as const satisfies readonly WeatherContentTag[];
}

export type WeatherTaggedArticle = {
  status: string;
  scope: string;
  city?: string;
  weatherTags?: readonly string[];
};

export function selectEligibleArticles<T extends WeatherTaggedArticle>(
  articles: readonly T[],
  tag: WeatherContentTag,
  city: string,
) {
  const matching = articles.filter(
    (article) =>
      article.status === "published" &&
      Array.isArray(article.weatherTags) &&
      article.weatherTags.includes(tag),
  );
  const cityMatches = matching.filter((article) => article.scope === "city" && article.city === city);

  if (cityMatches.length > 0) {
    return cityMatches;
  }

  return matching.filter((article) => article.scope === "general" || !article.city);
}

export function rotatePick<T>(items: readonly T[], seed: string) {
  if (items.length === 0) {
    return undefined;
  }

  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return items[hash % items.length];
}

export function shortenArticleTitle(title: string, maxLength = 32) {
  const trimmed = title.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  const slice = trimmed.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > 16 ? slice.slice(0, lastSpace) : slice;

  return `${base.trim()}…`;
}
