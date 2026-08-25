import { isAllowedMapsHost } from "@/lib/maps/allowed-hosts";

const ECL_SCRIPT_FLAG = "data-phoenix-ecl";
const API_LOADER_FLAG = "data-phoenix-gmpx-loader";
const ECL_SRC =
  "https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.15/index.min.js";

const SHORT_NAME_ADDRESS_COMPONENT_TYPES = new Set([
  "street_number",
  "administrative_area_level_1",
  "postal_code",
]);

export type PlaceAddressComponent = {
  types: string[];
  longText?: string | null;
  shortText?: string | null;
  long_name?: string;
  short_name?: string;
};

export type LatLngLike = {
  lat: (() => number) | number;
  lng: (() => number) | number;
};

export type PickerPlace = {
  addressComponents?: PlaceAddressComponent[];
  displayName?: string | null;
  formattedAddress?: string | null;
  location?: LatLngLike | null;
  name?: string | null;
  viewport?: unknown;
};

export type PlacePickerElement = HTMLElement & {
  value?: PickerPlace | null;
  type?: string;
  country?: string[];
  placeholder?: string;
  locationBias?: { lat: number; lng: number };
  radius?: number;
  forMap?: string;
  strictBounds?: boolean;
};

export type GmpMapElement = HTMLElement & {
  center?: unknown;
  zoom?: number;
  innerMap?: {
    setOptions: (options: Record<string, unknown>) => void;
    fitBounds: (bounds: unknown) => void;
  };
};

export type GmpAdvancedMarkerElement = HTMLElement & {
  position?: unknown;
};

let eclLoader: Promise<void> | null = null;

function loadEclScript() {
  if (!eclLoader) {
    eclLoader = new Promise<void>((resolve, reject) => {
      if (typeof window !== "undefined" && customElements.get("gmpx-place-picker")) {
        resolve();
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>(`script[${ECL_SCRIPT_FLAG}="true"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Google Maps components failed to load.")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.type = "module";
      script.src = ECL_SRC;
      script.async = true;
      script.setAttribute(ECL_SCRIPT_FLAG, "true");
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Google Maps components failed to load."));
      document.head.appendChild(script);
    }).catch((error) => {
      eclLoader = null;
      throw error;
    });
  }

  return eclLoader;
}

export async function loadPlacePickerLibrary(apiKey: string) {
  if (typeof window !== "undefined" && !isAllowedMapsHost()) {
    throw new Error("Google Maps is not enabled on this host.");
  }

  await loadEclScript();
  await Promise.all([
    customElements.whenDefined("gmpx-api-loader"),
    customElements.whenDefined("gmpx-place-picker"),
    customElements.whenDefined("gmp-map"),
  ]);

  let loader = document.querySelector<HTMLElement>(`gmpx-api-loader[${API_LOADER_FLAG}="true"]`);
  if (!loader) {
    loader = document.createElement("gmpx-api-loader");
    loader.setAttribute("key", apiKey);
    loader.setAttribute(API_LOADER_FLAG, "true");
    document.head.appendChild(loader);
  }
}

export type PlacesAutocomplete = {
  addListener: (eventName: string, handler: () => void) => void;
  getPlace: () => {
    address_components?: PlaceAddressComponent[];
    formatted_address?: string;
    geometry?: { location?: LatLngLike };
    name?: string;
  };
};

export async function importPlacesAutocomplete() {
  const maps = (
    window as Window & {
      google?: { maps?: { importLibrary?: (name: "places") => Promise<{ Autocomplete: new (input: HTMLInputElement, opts?: object) => PlacesAutocomplete }> } };
    }
  ).google?.maps;
  const importLibrary = maps?.importLibrary;
  if (!importLibrary) {
    throw new Error("google.maps.importLibrary is unavailable.");
  }

  const { Autocomplete } = await importLibrary("places");
  return Autocomplete;
}

export function getAddressComponentName(components: PlaceAddressComponent[] | undefined, componentType: string) {
  const match = components?.find(
    (component) => component.types[0] === componentType || component.types.includes(componentType),
  );
  if (!match) {
    return "";
  }

  if (SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType)) {
    return (match.shortText || match.short_name || "").trim();
  }

  return (match.longText || match.long_name || "").trim();
}

export function readLocationLatLng(location?: LatLngLike | null) {
  if (!location) {
    return { latitude: undefined, longitude: undefined };
  }

  const latitude = typeof location.lat === "function" ? location.lat() : location.lat;
  const longitude = typeof location.lng === "function" ? location.lng() : location.lng;

  return {
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
  };
}

export function fillAddressFromPickerPlace(place: PickerPlace) {
  const components = place.addressComponents;
  const street = `${getAddressComponentName(components, "street_number")} ${getAddressComponentName(components, "route")}`.trim();
  const { latitude, longitude } = readLocationLatLng(place.location);

  return {
    streetLine: street || place.displayName || place.formattedAddress || "",
    addressCity:
      getAddressComponentName(components, "locality") ||
      getAddressComponentName(components, "postal_town") ||
      getAddressComponentName(components, "sublocality_level_1"),
    addressProvince: getAddressComponentName(components, "administrative_area_level_1"),
    addressPostalCode: getAddressComponentName(components, "postal_code"),
    latitude,
    longitude,
    formattedAddress: place.formattedAddress || street || undefined,
  };
}
