import "server-only";

import { getCityBySlug, type CitySlug } from "@/lib/cities";
import { getArticleHref } from "@/lib/cms/helpers";
import { listArticles } from "@/lib/cms/storage";
import { getDateTimePartsInSiteTimeZone } from "@/lib/datetime";
import {
  getWeatherContentTagPriority,
  rotatePick,
  selectEligibleArticles,
  shortenArticleTitle,
  WEATHER_CONTENT_TAG_LABELS,
} from "@/lib/weather/content-tags";
import type { CityWeatherSnapshot, WeatherArticleStrip } from "@/lib/weather/types";

export function isWeatherArticleStripEnabled() {
  return process.env.WEATHER_ARTICLE_STRIP_ENABLED === "true";
}

function getAlbertaDayKey(date = new Date()) {
  const parts = getDateTimePartsInSiteTimeZone(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export async function resolveWeatherArticleStrip(
  city: CitySlug,
  snapshot: CityWeatherSnapshot,
): Promise<WeatherArticleStrip | null> {
  if (!isWeatherArticleStripEnabled()) {
    return null;
  }

  if (!getCityBySlug(city)) {
    return null;
  }

  const tags = getWeatherContentTagPriority(snapshot);

  if (tags.length === 0) {
    return null;
  }

  const articles = await listArticles();
  const dayKey = getAlbertaDayKey();

  for (const tag of tags) {
    const candidates = selectEligibleArticles(articles, tag, city);

    if (candidates.length === 0) {
      continue;
    }

    const picked = rotatePick(candidates, `${dayKey}:${city}:${tag}`);

    if (!picked) {
      continue;
    }

    return {
      tag,
      label: WEATHER_CONTENT_TAG_LABELS[tag],
      articleTitle: picked.title,
      articleShortTitle: shortenArticleTitle(picked.title),
      articleSlug: picked.slug,
      href: getArticleHref(picked),
    };
  }

  return null;
}
