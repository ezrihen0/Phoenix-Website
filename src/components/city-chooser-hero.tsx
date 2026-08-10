"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, MapPinned, Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { cities, getCityHref, getNearestCityByCoordinates } from "@/lib/cities";

type GeoState = "idle" | "locating" | "routing" | "manual" | "error" | "blocked";

const BLOCKED_SESSION_KEY = "phoenix-city-chooser-blocked";

function isInNorthAmerica(latitude: number, longitude: number) {
  return latitude >= 5 && latitude <= 84 && longitude >= -172 && longitude <= -52;
}

export function CityChooserHero() {
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
      setGeoMessage("Phoenix city routing is only available to visitors located in North America.");
    }, 0);

    return () => {
      window.clearTimeout(blockedTimer);
    };
  }, []);

  function blockChooser() {
    setGeoState("blocked");
    setGeoMessage("Phoenix city routing is only available to visitors located in North America.");

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
      setGeoMessage("Location is not available in this browser. Choose your city manually.");
      return;
    }

    setGeoState("locating");
    setGeoMessage("Locating you now...");

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!isInNorthAmerica(latitude, longitude)) {
          blockChooser();
          return;
        }

        const nearestCity = getNearestCityByCoordinates(latitude, longitude);
        setGeoState("routing");
        setGeoMessage(`Routing you to ${nearestCity.name}...`);
        router.replace(getCityHref(nearestCity.slug));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          handleManualChoice();
          return;
        }

        setGeoState("error");
        setGeoMessage("We could not determine your location. Choose your city manually or try again.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  if (geoState === "blocked") {
    return (
      <section className="pb-12 pt-3 sm:pb-14 sm:pt-5 lg:pb-16">
        <div className="page-bleed">
          <Reveal>
            <div className="overflow-hidden rounded-[2.8rem] border border-black/10 bg-[var(--color-ink)] px-6 py-10 text-[var(--color-paper)] shadow-[0_30px_80px_rgba(31,26,22,0.2)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <p className="eyebrow text-[var(--color-gold)]">Access unavailable</p>
              <h1 className="display-title mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[0.94] sm:text-5xl lg:text-6xl">
                Phoenix city routing is not available from this location.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--color-paper)]/74 sm:text-base">
                {geoMessage}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  const showGpsPrompt = geoState !== "manual";
  const isBusy = geoState === "locating" || geoState === "routing";

  return (
    <section className="pb-12 pt-3 sm:pb-14 sm:pt-5 lg:pb-16">
      <div className="page-bleed">
        <Reveal>
          <div className="overflow-hidden rounded-[2.8rem] border border-black/10 bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_30px_80px_rgba(31,26,22,0.2)]">
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-5 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
                <p className="eyebrow text-[var(--color-gold)]">Choose your city</p>
                <h1 className="display-title max-w-3xl text-balance text-4xl font-semibold leading-[0.94] sm:text-5xl lg:text-6xl">
                  Phoenix fireplace and chimney service across Alberta.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-[var(--color-paper)]/74 sm:text-base">
                  Choose Calgary, Edmonton, or Red Deer to reach the local Phoenix team, phone number, and service pages for your area.
                </p>

                {showGpsPrompt ? (
                  <div className="max-w-xl rounded-[1.6rem] border border-white/10 bg-white/6 p-4 sm:p-5">
                    <p className="text-sm font-semibold text-[var(--color-paper)]">
                      Use GPS to open the closest city automatically?
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleUseGps}
                        disabled={isBusy}
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
                      >
                        {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                        {geoState === "routing" ? "Routing" : geoState === "locating" ? "Locating" : "Use GPS"}
                      </button>
                      <button
                        type="button"
                        onClick={handleManualChoice}
                        disabled={isBusy}
                        className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-[var(--color-paper)] disabled:opacity-70"
                      >
                        Choose manually
                      </button>
                    </div>
                    {geoMessage ? (
                      <p className="mt-3 text-sm leading-6 text-[var(--color-paper)]/72">{geoMessage}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-white/10 bg-[rgba(255,255,255,0.04)] p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
                <div className="grid gap-3">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={getCityHref(city.slug)}
                      className="group block overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/8 p-4 transition hover:-translate-y-1 hover:bg-white/12 sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                            {city.dispatchLabel}
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-paper)] sm:text-[1.8rem]">
                            {city.name}
                          </h2>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${city.launchStage === "full"
                            ? "bg-[var(--color-forest)] text-[var(--color-paper)]"
                            : "bg-[rgba(186,92,29,0.12)] text-[var(--color-gold)]"
                            }`}
                        >
                          {city.launchStage === "full" ? "Live" : "Rolling out"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[var(--color-paper)]/76">
                        {city.chooserBlurb}
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-[var(--color-paper)]">
                          <Phone className="h-4 w-4 text-[var(--color-gold)]" />
                          {city.phoneDisplay}
                        </div>
                        <div className="inline-flex items-center gap-2 text-sm text-[var(--color-paper)]/72">
                          <MapPinned className="h-4 w-4 text-[var(--color-gold)]" />
                          {city.serviceRadius}
                        </div>
                      </div>

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-gold)]">
                        Open {city.name}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}