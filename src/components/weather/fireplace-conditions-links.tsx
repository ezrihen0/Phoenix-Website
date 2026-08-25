"use client";

import Link from "next/link";

import { trackWeatherModuleCta, trackWeatherSourceClick } from "@/lib/analytics/events";
import type { CitySlug } from "@/lib/cities";

type WeatherModuleRequestLinkProps = {
  href: string;
  city: CitySlug;
  className?: string;
  children?: string;
};

export function WeatherModuleRequestLink({
  href,
  city,
  className,
  children = "Request Service",
}: WeatherModuleRequestLinkProps) {
  return (
    <Link
      href={href}
      data-cta="weather-module"
      onClick={() => trackWeatherModuleCta(city)}
      className={className}
    >
      {children}
    </Link>
  );
}

type WeatherModuleSourceLinkProps = {
  href: string;
  city: CitySlug;
};

export function WeatherModuleSourceLink({ href, city }: WeatherModuleSourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="weather-source"
      onClick={() => trackWeatherSourceClick(city)}
      className="font-semibold text-[var(--color-forest)] underline-offset-2 hover:underline"
    >
      Click here
    </a>
  );
}
