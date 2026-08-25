import { getCityBySlug, getCityHref, isCitySlug, type CitySlug } from "@/lib/cities";
import { getServiceHref } from "@/lib/service-taxonomy";
import { getServiceLandingPage } from "@/lib/site-data";

export type ContextualLink = {
  title: string;
  description: string;
  path: string;
};

export function resolvePublicServiceHref(serviceSlug: string, city?: CitySlug) {
  return getServiceHref(serviceSlug, city);
}

export function resolveRelatedServiceLink(
  slug: string,
  city: CitySlug,
): { href: string; title: string; description: string } | null {
  if (slug === "wett-inspections") {
    return {
      href: getCityHref(city, "/wett"),
      title: "WETT inspections",
      description:
        "Book inspection documentation when insurance, a sale, or appliance verification requires a report.",
    };
  }

  if (slug === "gas-fireplace-repair") {
    return {
      href: getCityHref(city, "/gas-fireplace-repair"),
      title: "Gas fireplace repair",
      description:
        "Diagnostics and repair when the unit will not ignite, keeps shutting off, or shows weak flame performance.",
    };
  }

  const landing = getServiceLandingPage(slug);

  if (!landing) {
    return null;
  }

  const cityConfig = getCityBySlug(city);
  const cityName = cityConfig?.name ?? city;

  return {
    href: getServiceHref(slug, city),
    title: landing.title,
    description: landing.directAnswer.city(cityName)[0],
  };
}

export function getWettContextualLinks(city?: CitySlug): ContextualLink[] {
  return [
    {
      title: "Chimney sweeping and inspection",
      description:
        "When draft, creosote buildup, or venting concerns appear during or after an inspection review—not every WETT file requires sweeping, but many homeowners use this page to plan the next visit.",
      path: "/services/chimney-sweeping-inspection",
    },
    {
      title: "Chimney repair and masonry",
      description:
        "If visible crown, cap, brick, or liner issues show up in inspection findings, this page covers structural repair scope separate from the inspection appointment itself.",
      path: "/services/chimney-repair-masonry",
    },
    {
      title: "WETT inspection guidance",
      description:
        "Read when to book, what to prepare, and how inspection timing differs from repair or sweeping visits.",
      path: city
        ? `/articles/when-to-book-a-wett-inspection`
        : "/articles/when-to-book-a-wett-inspection",
    },
  ];
}

export function getGasRepairContextualLinks(city: CitySlug): ContextualLink[] {
  return [
    {
      title: "Gas fireplace maintenance",
      description:
        "Preventive cleaning and safety checks when the fireplace still runs but performance has slipped or annual service is overdue.",
      path: "/services/gas-fireplace-maintenance",
    },
    {
      title: "Gas fireplace installation",
      description:
        "Replacement or new-install planning when repair costs point toward upgrading the unit instead of repeated component work.",
      path: "/services/gas-fireplace-installation",
    },
    {
      title: "Gas fireplace troubleshooting guide",
      description:
        "Informational checks for ignition and shutdown symptoms before you book a repair visit.",
      path: `/articles/gas-fireplace-not-turning-on`,
    },
  ];
}

export function getCityHubLinks(city: CitySlug): ContextualLink[] {
  return [
    {
      title: "Service directory",
      description: "Compare repair, WETT, sweeping, maintenance, masonry, and installation options in one place.",
      path: "/services",
    },
    {
      title: "Gas fireplace repair",
      description: "Book diagnostics when the unit will not ignite, shuts off, or shows weak flame performance.",
      path: "/gas-fireplace-repair",
    },
    {
      title: "WETT inspections",
      description: "Inspection documentation for insurance, real-estate, and wood-burning system reviews.",
      path: "/wett",
    },
    {
      title: "Articles",
      description: "Homeowner guidance on maintenance timing, WETT requests, and common fireplace symptoms.",
      path: "/articles",
    },
    {
      title: "About Phoenix",
      description: "Who publishes this site, which markets we serve, and how service categories fit together.",
      path: "/about",
    },
  ];
}

export function resolveContextualLinkHref(path: string, city?: CitySlug) {
  if (!city) {
    return path;
  }

  if (path === "/articles" || path.startsWith("/articles/")) {
    return path;
  }

  const firstSegment = path.split("?")[0].split("/").filter(Boolean)[0];

  if (firstSegment && isCitySlug(firstSegment)) {
    return path;
  }

  return getCityHref(city, path);
}

export function getGasTroubleshootingArticleSlug(_city: CitySlug) {
  return "gas-fireplace-not-turning-on";
}
