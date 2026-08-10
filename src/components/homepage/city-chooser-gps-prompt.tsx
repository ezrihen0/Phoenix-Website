"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getCityHref, getNearestCityByCoordinates } from "@/lib/cities";

type GeoState = "idle" | "locating" | "redirecting" | "manual" | "error" | "blocked";

const BLOCKED_SESSION_KEY = "phoenix-city-chooser-blocked";

function isInNorthAmerica(latitude: number, longitude: number) {
  return latitude >= 5 && latitude <= 84 && longitude >= -172 && longitude <= -52;
}

export function CityChooserGpsPrompt() {
  const router = useRouter();
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.sessionStorage.getItem(BLOCKED_SESSION_KEY) !== "1") {
      return;
    }

    const blockedTimer = window.setTimeout(() => {
      setGeoState("blocked");
      setGeoMessage("Location-based city selection is only available in North America.");
    }, 0);

    return () => {
      window.clearTimeout(blockedTimer);
    };
  }, []);

  function blockChooser() {
    setGeoState("blocked");
    setGeoMessage("Location-based city selection is only available in North America.");

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(BLOCKED_SESSION_KEY, "1");
    }
  }

  function handleManualChoice() {
    setGeoState("manual");
    setGeoMessage(null);
  }

  function handleUseGps() {
    if (typeof window === "undefined" || !window.navigator.geolocation) {
      setGeoState("error");
      setGeoMessage("Location is not available in this browser.");
      return;
    }

    setGeoState("locating");
    setGeoMessage(null);

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!isInNorthAmerica(latitude, longitude)) {
          blockChooser();
          return;
        }

        const nearestCity = getNearestCityByCoordinates(latitude, longitude);
        setGeoState("redirecting");
        router.replace(getCityHref(nearestCity.slug));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          handleManualChoice();
          return;
        }

        setGeoState("error");
        setGeoMessage("We could not determine your location.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  if (geoState === "manual") {
    return null;
  }

  const isBusy = geoState === "locating" || geoState === "redirecting";

  if (geoState === "blocked") {
    return (
      <p className="text-sm text-[var(--color-muted)]">{geoMessage}</p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-muted)]">
      <button
        type="button"
        onClick={handleUseGps}
        disabled={isBusy}
        className="inline-flex items-center gap-1.5 font-medium text-[var(--color-forest)] underline-offset-2 hover:underline disabled:opacity-70"
      >
        {isBusy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
        {geoState === "redirecting" ? "Opening your city…" : geoState === "locating" ? "Locating…" : "Use my location"}
      </button>
      {geoMessage ? <span>{geoMessage}</span> : null}
    </div>
  );
}
