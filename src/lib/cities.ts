import type { PublicSiteSettings } from "@/lib/cms/types";

export const CITY_SLUGS = ["calgary", "edmonton", "red-deer"] as const;

export type CitySlug = (typeof CITY_SLUGS)[number];

export type CityStatus = "full" | "placeholder";

export type CityDefinition = {
  slug: CitySlug;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  dispatchLabel: string;
  chooserBlurb: string;
  serviceRadius: string;
  serviceAreas: string[];
  phoneDisplay: string;
  phoneHref: string;
  mapEmbedUrl: string;
  launchStage: CityStatus;
  bookingEnabled: boolean;
  contactFormEnabled: boolean;
  articlesEnabled: boolean;
  weatherContext: string;
  regulationContext: string;
  articleAudience: string;
};

const cityDefinitions: Record<CitySlug, CityDefinition> = {
  calgary: {
    slug: "calgary",
    name: "Calgary",
    province: "Alberta",
    latitude: 51.0447,
    longitude: -114.0719,
    dispatchLabel: "Live city site",
    chooserBlurb:
      "Calgary service pages, booking flow, contact routing, and localized article coverage are live now.",
    serviceRadius: "Serving Calgary and surrounding communities within 100 km.",
    serviceAreas: [
      "Altadore",
      "Aspen Woods",
      "Airdrie",
      "Brentwood",
      "Chestermere",
      "Cochrane",
      "Okotoks",
      "Sunnyside",
      "Strathmore",
    ],
    phoneDisplay: "(825) 823-9556",
    phoneHref: "+18258239556",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Calgary&t=m&z=9&output=embed&iwloc=near",
    launchStage: "full",
    bookingEnabled: true,
    contactFormEnabled: true,
    articlesEnabled: true,
    weatherContext:
      "Calgary freeze-thaw cycles, shoulder-season maintenance, chinook swings, and cold-start heating demand.",
    regulationContext:
      "Alberta insurance expectations, WETT reporting requirements, and municipal permit awareness for fireplace and chimney work in Calgary.",
    articleAudience: "Calgary homeowners, buyers, sellers, and property managers",
  },
  edmonton: {
    slug: "edmonton",
    name: "Edmonton",
    province: "Alberta",
    latitude: 53.5461,
    longitude: -113.4938,
    dispatchLabel: "Live city site",
    chooserBlurb:
      "Edmonton service pages, contact routing, and weather-aware article coverage are now live.",
    serviceRadius: "Serving Edmonton and surrounding communities within 100 km.",
    serviceAreas: [
      "Beaumont",
      "Fort Saskatchewan",
      "Leduc",
      "Morinville",
      "Sherwood Park",
      "Spruce Grove",
      "St. Albert",
      "Stony Plain",
    ],
    phoneDisplay: "(825) 823-9556",
    phoneHref: "+18258239556",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Edmonton&t=m&z=9&output=embed&iwloc=near",
    launchStage: "full",
    bookingEnabled: true,
    contactFormEnabled: true,
    articlesEnabled: true,
    weatherContext:
      "Longer cold snaps, heavy winter demand, and extended heating-season wear for Edmonton fireplace and chimney systems.",
    regulationContext:
      "Alberta insurance expectations, WETT reporting requirements, and Edmonton-area permit awareness for fireplace and chimney work.",
    articleAudience: "Edmonton homeowners, buyers, sellers, and property managers",
  },
  "red-deer": {
    slug: "red-deer",
    name: "Red Deer",
    province: "Alberta",
    latitude: 52.2681,
    longitude: -113.8112,
    dispatchLabel: "Live city site",
    chooserBlurb:
      "Red Deer service pages, contact routing, and central-Alberta article coverage are now live.",
    serviceRadius: "Serving Red Deer and surrounding communities within 100 km.",
    serviceAreas: [
      "Blackfalds",
      "Innisfail",
      "Lacombe",
      "Olds",
      "Penhold",
      "Ponoka",
      "Rocky Mountain House",
      "Sylvan Lake",
    ],
    phoneDisplay: "(825) 823-9556",
    phoneHref: "+18258239556",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Red%20Deer%20Alberta&t=m&z=9&output=embed&iwloc=near",
    launchStage: "full",
    bookingEnabled: true,
    contactFormEnabled: true,
    articlesEnabled: true,
    weatherContext:
      "Central Alberta winter wear, freeze-thaw masonry stress, and colder start-up conditions around Red Deer.",
    regulationContext:
      "Alberta insurance expectations, WETT reporting requirements, and Red Deer-area permit awareness for fireplace and chimney work.",
    articleAudience: "Red Deer homeowners, buyers, sellers, and property managers",
  },
};

export const defaultCitySlug: CitySlug = "calgary";

export const cities = CITY_SLUGS.map((slug) => cityDefinitions[slug]);

export function isCitySlug(value: string): value is CitySlug {
  return CITY_SLUGS.includes(value as CitySlug);
}

export function getCityBySlug(value: string) {
  if (!isCitySlug(value)) {
    return undefined;
  }

  return cityDefinitions[value];
}

export function getCityHref(city: CitySlug, path = "/") {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${city}${normalizedPath}`;
}

export function getCityFromPathname(pathname?: string | null) {
  if (!pathname) {
    return null;
  }

  const pathWithoutQuery = pathname.split("?")[0];
  const firstSegment = pathWithoutQuery.split("/").filter(Boolean)[0];

  return firstSegment && isCitySlug(firstSegment) ? firstSegment : null;
}

export function getScopedPath(path: string, city?: CitySlug | null) {
  if (!city) {
    return path;
  }

  const firstSegment = path.split("?")[0].split("/").filter(Boolean)[0];

  if (firstSegment && isCitySlug(firstSegment)) {
    return path;
  }

  return getCityHref(city, path);
}

export function getCitySettings(
  settings: PublicSiteSettings,
  city?: CitySlug | null,
): PublicSiteSettings {
  if (!city) {
    return settings;
  }

  const config = cityDefinitions[city];
  const blogIndexTitle = `Fireplace & Chimney Advice for ${config.name} Homes`;
  const blogIndexDescription = `Local fireplace, chimney, WETT, and masonry guidance for ${config.name} homeowners, buyers, sellers, and property managers.`;

  return {
    ...settings,
    phoneDisplay: config.phoneDisplay,
    phoneHref: config.phoneHref,
    serviceRadius: config.serviceRadius,
    mapEmbedUrl: config.mapEmbedUrl,
    blogIndexTitle,
    blogIndexDescription,
  };
}

export function cityHasFullContent(city: CitySlug) {
  return cityDefinitions[city].launchStage === "full";
}

export function citySupportsBooking(city?: CitySlug | null) {
  return city ? cityDefinitions[city].bookingEnabled : false;
}

export function citySupportsContactForm(city?: CitySlug | null) {
  return city ? cityDefinitions[city].contactFormEnabled : false;
}

export function citySupportsArticles(city?: CitySlug | null) {
  return city ? cityDefinitions[city].articlesEnabled : false;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceInKilometers(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) {
  const earthRadiusKm = 6371;
  const deltaLatitude = toRadians(toLatitude - fromLatitude);
  const deltaLongitude = toRadians(toLongitude - fromLongitude);
  const fromLatitudeRadians = toRadians(fromLatitude);
  const toLatitudeRadians = toRadians(toLatitude);

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(fromLatitudeRadians) *
      Math.cos(toLatitudeRadians) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function getNearestCityByCoordinates(latitude: number, longitude: number) {
  return cities.reduce((nearestCity, city) => {
    const currentDistance = getDistanceInKilometers(
      latitude,
      longitude,
      city.latitude,
      city.longitude,
    );
    const nearestDistance = getDistanceInKilometers(
      latitude,
      longitude,
      nearestCity.latitude,
      nearestCity.longitude,
    );

    return currentDistance < nearestDistance ? city : nearestCity;
  }, cities[0]);
}
