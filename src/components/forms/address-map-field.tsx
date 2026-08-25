"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";

import { isAllowedMapsHost } from "@/lib/maps/allowed-hosts";
import {
  fillAddressFromPickerPlace,
  importPlacesAutocomplete,
  loadPlacePickerLibrary,
  type GmpAdvancedMarkerElement,
  type GmpMapElement,
} from "@/lib/maps/places-loader";

type AddressValue = {
  addressStreet: string;
  addressCity: string;
  addressProvince: string;
  addressPostalCode: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
};

type AddressMapFieldProps = {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  serviceAreaNote?: string;
  locationBias?: { lat: number; lng: number };
};

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || "";
const DEFAULT_MAP_CENTER = { lat: 51.0447, lng: -114.0719 };

function withUnit(street: string, unit: string) {
  const trimmedUnit = unit.trim();
  if (!trimmedUnit) {
    return street;
  }

  if (street.toLowerCase().includes(trimmedUnit.toLowerCase())) {
    return street;
  }

  return `${street}, ${trimmedUnit}`;
}

function toBiasAttribute(center: { lat: number; lng: number }) {
  return `${center.lat},${center.lng}`;
}

export function AddressMapField({
  value,
  onChange,
  serviceAreaNote,
  locationBias,
}: AddressMapFieldProps) {
  const mapElementId = `phoenix-address-map-${useId().replace(/:/g, "")}`;
  const streetInputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<GmpMapElement | null>(null);
  const markerRef = useRef<GmpAdvancedMarkerElement | null>(null);
  const unitInputRef = useRef<HTMLInputElement | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const streetLineRef = useRef(value.addressStreet);
  const unitRef = useRef("");
  const [streetLine, setStreetLine] = useState(value.addressStreet);
  const [unit, setUnit] = useState("");
  const [eclReady, setEclReady] = useState(false);
  const [lookupFailed, setLookupFailed] = useState(!mapsKey);
  const [mapDisplayFailed, setMapDisplayFailed] = useState(false);
  const [lookupNote, setLookupNote] = useState("");

  onChangeRef.current = onChange;
  valueRef.current = value;
  streetLineRef.current = streetLine;
  unitRef.current = unit;

  const mapCenter = locationBias || DEFAULT_MAP_CENTER;

  function emit(next: Partial<AddressValue> & { streetLine?: string; unit?: string }) {
    const nextStreetLine = next.streetLine ?? streetLineRef.current;
    const nextUnit = next.unit ?? unitRef.current;
    const current = valueRef.current;

    streetLineRef.current = nextStreetLine;
    unitRef.current = nextUnit;
    setStreetLine(nextStreetLine);
    if (next.unit != null) {
      setUnit(next.unit);
    }

    onChangeRef.current({
      addressStreet: withUnit(nextStreetLine, nextUnit),
      addressCity: next.addressCity ?? current.addressCity,
      addressProvince: next.addressProvince ?? current.addressProvince,
      addressPostalCode: next.addressPostalCode ?? current.addressPostalCode,
      latitude: "latitude" in next ? next.latitude : current.latitude,
      longitude: "longitude" in next ? next.longitude : current.longitude,
      formattedAddress: next.formattedAddress ?? current.formattedAddress,
    });
  }

  useEffect(() => {
    if (!mapsKey || !isAllowedMapsHost()) {
      setLookupFailed(true);
      return;
    }

    let cancelled = false;
    const previousAuthFailure = (window as Window & { gm_authFailure?: () => void }).gm_authFailure;
    const originalConsoleError = console.error;

    function isBlockedMapsMessage(messageValue: unknown) {
      const text = typeof messageValue === "string" ? messageValue : String(messageValue ?? "");
      return (
        text.includes("ApiTargetBlockedMapError") ||
        text.includes("AutocompleteService") ||
        text.includes("REQUEST_DENIED")
      );
    }

    console.error = (...args: unknown[]) => {
      if (args.some((arg) => isBlockedMapsMessage(arg))) {
        const message = args.map((arg) => String(arg)).join(" ");
        if (message.includes("ApiTargetBlockedMapError")) {
          setMapDisplayFailed(true);
        } else {
          setLookupFailed(true);
        }
      }
      originalConsoleError.apply(console, args);
    };

    (window as Window & { gm_authFailure?: () => void }).gm_authFailure = () => {
      previousAuthFailure?.();
      if (!cancelled) {
        setLookupFailed(true);
      }
    };

    void loadPlacePickerLibrary(mapsKey)
      .then(() => {
        if (!cancelled) {
          setEclReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLookupFailed(true);
        }
      });

    return () => {
      cancelled = true;
      console.error = originalConsoleError;
      (window as Window & { gm_authFailure?: () => void }).gm_authFailure = previousAuthFailure;
    };
  }, []);

  useEffect(() => {
    if (!eclReady || lookupFailed) {
      return;
    }

    const input = streetInputRef.current;
    if (!input) {
      return;
    }

    let cancelled = false;
    let autocomplete: { addListener: (eventName: string, handler: () => void) => void } | null = null;

    const map = mapRef.current;
    if (map?.innerMap) {
      map.innerMap.setOptions({ mapTypeControl: false, streetViewControl: false });
    }

    const blockEnterSubmit = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    };
    input.addEventListener("keydown", blockEnterSubmit);

    void importPlacesAutocomplete()
      .then((Autocomplete) => {
        if (cancelled || !streetInputRef.current) {
          return;
        }

        const ac = new Autocomplete(streetInputRef.current, {
          fields: ["address_components", "formatted_address", "geometry", "name"],
          types: ["address"],
          componentRestrictions: { country: "ca" },
        });
        autocomplete = ac;

        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          if (!place.geometry?.location) {
            setLookupNote(
              place.name
                ? `No map pin for “${place.name}”. Enter the address manually if needed.`
                : "No map pin for that address. Enter it manually if needed.",
            );
            if (markerRef.current) {
              markerRef.current.position = null;
            }
            return;
          }

          setLookupNote("");
          const mapEl = mapRef.current;
          if (mapEl) {
            mapEl.center = place.geometry.location;
            mapEl.zoom = 17;
          }
          if (markerRef.current) {
            markerRef.current.position = place.geometry.location;
          }

          emit(
            fillAddressFromPickerPlace({
              addressComponents: place.address_components,
              formattedAddress: place.formatted_address,
              location: place.geometry.location,
              name: place.name,
            }),
          );
          window.requestAnimationFrame(() => {
            unitInputRef.current?.focus();
          });
        });
      })
      .catch(() => {
        if (!cancelled) {
          setLookupFailed(true);
        }
      });

    return () => {
      cancelled = true;
      input.removeEventListener("keydown", blockEnterSubmit);
      void autocomplete;
    };
    // Form values stay in refs; rebind when the selected city or map host is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eclReady, lookupFailed, locationBias?.lat, locationBias?.lng, mapElementId]);

  const pinConfirmed = value.latitude != null && value.longitude != null;
  const showPicker = Boolean(mapsKey) && !lookupFailed && eclReady;
  const showMap = showPicker && !mapDisplayFailed;

  return (
    <div className="space-y-4 sm:col-span-2">
      <div className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
        <span>Service address</span>
        <p className="text-sm font-normal leading-6 text-[var(--color-muted)]">
          Start typing a street address, then confirm city and postal code. You can still submit if lookup does not load.
        </p>
      </div>

      {lookupNote ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
          {lookupNote}
        </p>
      ) : pinConfirmed && !lookupFailed ? (
        <p className="rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--color-muted)]">
          Pin confirmed from the selected address. Coverage is checked from this location.
        </p>
      ) : lookupFailed || !mapsKey ? (
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Address search is optional. Enter the address manually if lookup does not load.
        </p>
      ) : !eclReady ? (
        <p className="text-xs text-[var(--color-muted)]">Loading address search…</p>
      ) : null}

      {serviceAreaNote ? (
        <p className="rounded-2xl bg-[var(--color-paper-strong)] px-4 py-3 text-sm leading-6 text-[var(--color-muted)]">
          {serviceAreaNote}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
            <span>Street</span>
            <input
              ref={streetInputRef}
              name="addressStreet"
              required
              autoComplete="off"
              value={streetLine}
              onChange={(event) => emit({ streetLine: event.target.value })}
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-ember)]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
            <span>
              Apartment, unit, suite, or floor{" "}
              <span className="font-normal text-[var(--color-muted)]">(optional)</span>
            </span>
            <input
              ref={unitInputRef}
              name="addressUnit"
              autoComplete="address-line2"
              value={unit}
              onChange={(event) => emit({ unit: event.target.value })}
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-ember)]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
            <span>City</span>
            <input
              name="addressCity"
              required
              autoComplete="address-level2"
              value={value.addressCity}
              onChange={(event) => emit({ addressCity: event.target.value })}
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-ember)]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
            <span>Postal code</span>
            <input
              name="addressPostalCode"
              required
              autoComplete="postal-code"
              value={value.addressPostalCode}
              onChange={(event) => emit({ addressPostalCode: event.target.value })}
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-ember)]"
            />
          </label>
        </div>

        <div className="min-h-[14rem]">
          {showMap ? (
            <gmp-map
              ref={mapRef as unknown as Ref<HTMLElement>}
              id={mapElementId}
              className="phoenix-address-map"
              center={toBiasAttribute(mapCenter)}
              zoom="11"
              map-id="DEMO_MAP_ID"
            >
              <gmp-advanced-marker ref={markerRef as unknown as Ref<HTMLElement>} />
            </gmp-map>
          ) : (
            <div className="flex h-full min-h-[14rem] items-center rounded-[1.5rem] border border-dashed border-[var(--color-border)] bg-white/70 px-4 text-sm leading-6 text-[var(--color-muted)]">
              Map preview is unavailable. Street, city, and postal code are enough to submit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
