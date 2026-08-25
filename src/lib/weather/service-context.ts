import type { CanonicalServiceSlug } from "@/lib/service-taxonomy";
import type { CityWeatherSnapshot } from "@/lib/weather/types";

export const WATER_FREEZE_POINT_C = 0;

export type WeatherServiceContextKind = "masonry" | "leak" | "gas";

export type WeatherServiceContext = {
  kind: WeatherServiceContextKind;
  title: string;
  elevated: boolean;
  statusLabel: string;
  body: string;
  serviceSlug: CanonicalServiceSlug;
  secondaryServiceSlug?: CanonicalServiceSlug;
};

const MOISTURE_PATTERN =
  /\b(rain|raining|drizzle|showers?|thunderstorms?|snow|snowing|flurries|flurry|freezing rain|ice pellets?|sleet|blizzard)\b/i;
const FREEZING_PRECIP_PATTERN = /\b(freezing rain|freezing drizzle|ice pellets?|hail)\b/i;
const SNOW_OR_ICE_PATTERN =
  /\b(snow|snowing|flurries|flurry|ice pellets?|freezing rain|freezing drizzle|sleet|blizzard)\b/i;

function conditionsFromSnapshot(snapshot: CityWeatherSnapshot): string[] {
  return [snapshot.condition, ...(snapshot.forecastConditions || [])].filter(Boolean);
}

function matchesAny(conditions: string[], pattern: RegExp) {
  return conditions.some((condition) => pattern.test(condition));
}

export function deriveWeatherServiceContext(
  snapshot: CityWeatherSnapshot,
): WeatherServiceContext[] {
  const conditions = conditionsFromSnapshot(snapshot);
  const hasMoisture = matchesAny(conditions, MOISTURE_PATTERN);
  const hasFreezingPrecip = matchesAny(conditions, FREEZING_PRECIP_PATTERN);
  const hasSnowOrIce = matchesAny(conditions, SNOW_OR_ICE_PATTERN);
  const atOrBelowFreeze = snapshot.temperatureC <= WATER_FREEZE_POINT_C;
  const aboveFreeze = snapshot.temperatureC > WATER_FREEZE_POINT_C;

  const masonryElevated =
    hasFreezingPrecip || (atOrBelowFreeze && hasMoisture) || (aboveFreeze && hasSnowOrIce);
  const leakElevated = hasMoisture;
  const gasElevated = atOrBelowFreeze;

  return [
    {
      kind: "masonry",
      title: "Chimney Masonry Conditions",
      elevated: masonryElevated,
      statusLabel: masonryElevated ? "Elevated conditions" : "Typical conditions",
      body: masonryElevated
        ? "Conditions relevant to masonry deterioration for crowns, mortar, brick, and other chimney masonry. This is Phoenix service context, not an Environment and Climate Change Canada chimney rating."
        : "Current observations are not pointing to freeze/thaw or moisture conditions that typically relate to chimney masonry.",
      serviceSlug: "chimney-repair-masonry",
    },
    {
      kind: "leak",
      title: "Leak Conditions",
      elevated: leakElevated,
      statusLabel: leakElevated ? "Elevated conditions" : "Typical conditions",
      body: leakElevated
        ? "Rain, snow melt or wet conditions relevant to chimney leaks, flashing and crowns. This is Phoenix service context, not an Environment and Climate Change Canada leak rating."
        : "Current observations are not pointing to rain, snow melt, or wet conditions that typically relate to chimney leaks, flashing, and crowns.",
      serviceSlug: "chimney-sweeping-inspection",
      secondaryServiceSlug: "chimney-repair-masonry",
    },
    {
      kind: "gas",
      title: "Gas Fireplace Conditions",
      elevated: gasElevated,
      statusLabel: gasElevated ? "Cold-weather service context" : "Typical conditions",
      body: gasElevated
        ? "Cold-weather service context relevant to gas fireplace startup and seasonal service demand. This is Phoenix service context, not an Environment and Climate Change Canada fireplace rating."
        : "Current temperature is not at or below freezing, so this is not a cold-weather startup context.",
      serviceSlug: "gas-fireplace-maintenance",
    },
  ];
}
