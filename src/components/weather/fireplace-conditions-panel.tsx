import { Droplets, Flame, ThermometerSnowflake, Wind } from "lucide-react";

import Link from "next/link";

import {
  WeatherModuleRequestLink,
  WeatherModuleSourceLink,
} from "@/components/weather/fireplace-conditions-links";
import {
  getCityHref,
  getRequestServiceHref,
  type CityDefinition,
} from "@/lib/cities";
import { formatSiteDateTime } from "@/lib/datetime";
import { getCanonicalService, getServiceHref } from "@/lib/service-taxonomy";
import { deriveWeatherServiceContext } from "@/lib/weather/service-context";
import type { CityWeatherState } from "@/lib/weather/types";

type FireplaceConditionsPanelProps = {
  city: CityDefinition;
  state: CityWeatherState | null;
  fromPath?: string;
};

const observationNumber = new Intl.NumberFormat("en-CA", {
  maximumFractionDigits: 1,
});

function formatTemperature(value: number) {
  return `${observationNumber.format(value)}°C`;
}

function formatWind(speed?: number, direction?: string) {
  if (speed == null && !direction) {
    return null;
  }

  if (speed == null) {
    return direction;
  }

  const speedLabel = `${observationNumber.format(speed)} km/h`;
  return direction ? `${speedLabel} ${direction}` : speedLabel;
}

function formatHumidity(value?: number) {
  if (value == null) {
    return null;
  }

  return `${observationNumber.format(value)}%`;
}

export function FireplaceConditionsPanel({
  city,
  state,
  fromPath = getCityHref(city.slug),
}: FireplaceConditionsPanelProps) {
  const snapshot = state?.snapshot;
  const requestHref = getRequestServiceHref({
    city: city.slug,
    cta: "weather-module",
    from: fromPath,
  });
  const contexts = snapshot ? deriveWeatherServiceContext(snapshot) : [];
  const windLabel = snapshot ? formatWind(snapshot.windKph, snapshot.windDirection) : null;
  const humidityLabel = snapshot ? formatHumidity(snapshot.humidityPct) : null;

  return (
    <section className="section-pad pt-0">
      <div className="page-frame">
        <article className="rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
          <p className="eyebrow">Local conditions</p>
          <h2 className="display-title mt-3 text-balance text-3xl font-semibold leading-none text-[var(--color-ink)] sm:text-4xl">
            Today’s Fireplace & Chimney Conditions
          </h2>

          {snapshot ? (
            <>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-[1.5rem] bg-white/75 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    City
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{city.name}</dd>
                </div>
                <div className="rounded-[1.5rem] bg-white/75 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Temperature
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                    {formatTemperature(snapshot.temperatureC)}
                  </dd>
                </div>
                {snapshot.condition ? (
                  <div className="rounded-[1.5rem] bg-white/75 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Weather
                    </dt>
                    <dd className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                      {snapshot.condition}
                    </dd>
                  </div>
                ) : null}
                {windLabel ? (
                  <div className="rounded-[1.5rem] bg-white/75 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Wind
                    </dt>
                    <dd className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                      <Wind className="h-4 w-4 text-[var(--color-ember)]" />
                      {windLabel}
                    </dd>
                  </div>
                ) : null}
                {humidityLabel ? (
                  <div className="rounded-[1.5rem] bg-white/75 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Humidity
                    </dt>
                    <dd className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                      <Droplets className="h-4 w-4 text-[var(--color-ember)]" />
                      {humidityLabel}
                    </dd>
                  </div>
                ) : null}
                <div className="rounded-[1.5rem] bg-white/75 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Last updated
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                    {formatSiteDateTime(snapshot.updatedAt, { showTimeZone: true })}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {contexts.map((context) => {
                  const service = getCanonicalService(context.serviceSlug);
                  const secondary = context.secondaryServiceSlug
                    ? getCanonicalService(context.secondaryServiceSlug)
                    : undefined;
                  const ContextIcon =
                    context.kind === "gas"
                      ? Flame
                      : context.kind === "masonry"
                        ? ThermometerSnowflake
                        : Droplets;

                  return (
                    <div
                      key={context.kind}
                      className="flex flex-col rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 p-5"
                    >
                      <ContextIcon className="h-5 w-5 text-[var(--color-ember)]" />
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                        {context.title}
                      </h3>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                        {context.statusLabel}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">
                        {context.body}
                      </p>
                      {context.elevated && service ? (
                        <div className="mt-4 space-y-2">
                          <WeatherModuleRequestLink
                            href={getRequestServiceHref({
                              city: city.slug,
                              service: context.serviceSlug,
                              cta: "weather-module",
                              from: fromPath,
                            })}
                            city={city.slug}
                            className="inline-flex text-sm font-semibold text-[var(--color-forest)]"
                          >
                            Request Service
                          </WeatherModuleRequestLink>
                          <p className="text-xs leading-6 text-[var(--color-muted)]">
                            Related:{" "}
                            <Link
                              href={getServiceHref(context.serviceSlug, city.slug)}
                              className="font-semibold text-[var(--color-ink)]"
                            >
                              {service.title}
                            </Link>
                            {secondary ? (
                              <>
                                {" "}
                                /{" "}
                                <Link
                                  href={getServiceHref(context.secondaryServiceSlug!, city.slug)}
                                  className="font-semibold text-[var(--color-ink)]"
                                >
                                  {secondary.title}
                                </Link>
                              </>
                            ) : null}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <WeatherModuleRequestLink
                  href={requestHref}
                  city={city.slug}
                  className="inline-flex w-fit rounded-full bg-[var(--color-ember)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-ember-dark)]"
                >
                  Request Service
                </WeatherModuleRequestLink>
                {snapshot.sourceUrl ? (
                  <p className="text-xs leading-6 text-[var(--color-muted)]">
                    Weather data: Environment and Climate Change Canada.{" "}
                    <WeatherModuleSourceLink href={snapshot.sourceUrl} city={city.slug} />
                  </p>
                ) : (
                  <p className="text-xs leading-6 text-[var(--color-muted)]">
                    Weather data: Environment and Climate Change Canada.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="mt-6 space-y-5">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Current weather context is temporarily unavailable.
              </p>
              <WeatherModuleRequestLink
                href={requestHref}
                city={city.slug}
                className="inline-flex w-fit rounded-full bg-[var(--color-ember)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-ember-dark)]"
              >
                Request Service
              </WeatherModuleRequestLink>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
