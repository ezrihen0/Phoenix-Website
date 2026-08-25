import type { CitySlug } from "@/lib/cities";

export type CityWeatherSnapshot = {
  city: CitySlug;
  temperatureC: number;
  feelsLikeC: number;
  precipitationMm: number;
  windKph: number;
  condition: string;
  alert?: string;
  updatedAt: string;
};

export type WeatherRule = {
  id: string;
  label: string;
  enabled: boolean;
  recommendation: string;
  educationHref: string;
  ctaLabel: string;
};

export type WeatherRecommendation = {
  ruleId: string;
  headline: string;
  body: string;
  href: string;
  ctaLabel: string;
};

export type CityWeatherState = {
  snapshot: CityWeatherSnapshot;
  recommendation: WeatherRecommendation | null;
};

export const WEATHER_RULES: WeatherRule[] = [
  {
    id: "extreme-cold",
    label: "Extreme cold",
    enabled: false,
    recommendation: "Cold weather is here. If you are starting a gas fireplace for the first time this season, review safe checks before requesting service.",
    educationHref: "/articles/turning-on-your-gas-fireplace-before-winter",
    ctaLabel: "View recommendations",
  },
  {
    id: "heavy-rain",
    label: "Heavy rain",
    enabled: false,
    recommendation: "Wet weather can expose chimney leak paths. See what staining or water entry can mean before booking masonry repair.",
    educationHref: "/services/chimney-repair-masonry",
    ctaLabel: "View recommendations",
  },
];
