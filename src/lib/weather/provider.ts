import type { CitySlug } from "@/lib/cities";
import { cities } from "@/lib/cities";
import type { CityWeatherSnapshot } from "@/lib/weather/types";

export type WeatherProvider = {
  id: string;
  fetchCityWeather: (city: CitySlug) => Promise<CityWeatherSnapshot>;
};

function weatherCodeToCondition(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 67) return "Precipitation";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

export const openMeteoWeatherProvider: WeatherProvider = {
  id: "open-meteo",
  async fetchCityWeather(city) {
    const config = cities.find((entry) => entry.slug === city);

    if (!config) {
      throw new Error(`Unsupported weather city: ${city}`);
    }

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(config.latitude));
    url.searchParams.set("longitude", String(config.longitude));
    url.searchParams.set(
      "current",
      "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
    );
    url.searchParams.set("wind_speed_unit", "kmh");
    url.searchParams.set("timezone", "America/Edmonton");

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Weather provider failed for ${city}`);
    }

    const payload = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        apparent_temperature?: number;
        precipitation?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        time?: string;
      };
    };

    return {
      city,
      temperatureC: payload.current?.temperature_2m ?? 0,
      feelsLikeC: payload.current?.apparent_temperature ?? 0,
      precipitationMm: payload.current?.precipitation ?? 0,
      windKph: payload.current?.wind_speed_10m ?? 0,
      condition: weatherCodeToCondition(payload.current?.weather_code ?? -1),
      updatedAt: payload.current?.time || new Date().toISOString(),
    };
  },
};
