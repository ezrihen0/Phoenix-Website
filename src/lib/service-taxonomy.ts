import { getCityHref, type CitySlug } from "@/lib/cities";

export const SERVICE_FAMILIES = ["gas-fireplace", "chimney", "wett"] as const;

export type ServiceFamily = (typeof SERVICE_FAMILIES)[number];

export const CANONICAL_SERVICE_SLUGS = [
  "gas-fireplace-repair",
  "gas-fireplace-maintenance",
  "gas-fireplace-installation",
  "chimney-sweeping-inspection",
  "chimney-repair-masonry",
  "wett-inspections",
] as const;

export type CanonicalServiceSlug = (typeof CANONICAL_SERVICE_SLUGS)[number];

export const SERVICE_LANDING_SLUGS = [
  "gas-fireplace-maintenance",
  "chimney-sweeping-inspection",
  "chimney-repair-masonry",
  "gas-fireplace-installation",
] as const;

export type ServiceLandingSlug = (typeof SERVICE_LANDING_SLUGS)[number];

const LEGACY_SERVICE_SLUG_ALIASES: Record<string, CanonicalServiceSlug> = {
  "chimney-sweep-repair": "chimney-sweeping-inspection",
  "masonry-rebuilds": "chimney-repair-masonry",
  "wood-stove-service": "chimney-sweeping-inspection",
};

export type CanonicalService = {
  slug: CanonicalServiceSlug;
  family: ServiceFamily;
  title: string;
  navLabel: string;
  tagline: string;
  description: string;
  bullets: readonly string[];
  image: string;
  icon: string;
  formLabel: string;
};

export const canonicalServices: readonly CanonicalService[] = [
  {
    slug: "gas-fireplace-repair",
    family: "gas-fireplace",
    title: "Gas Fireplace Repair",
    navLabel: "Gas Fireplace Repair",
    tagline: "Diagnose ignition, shutdown, and performance problems before replacing the unit.",
    description:
      "When a gas fireplace will not ignite, keeps shutting off, or runs poorly, we inspect the system, explain what we find, and present repair, maintenance, or replacement options.",
    bullets: [
      "Pilot and ignition troubleshooting",
      "Thermocouple, valve, and control diagnosis",
      "Shutdown, odor, and flame-quality issues",
      "$99 diagnostic visit when the problem is unknown",
    ],
    image: "/images/photos/service-gasfireplace.jpg",
    icon: "/images/icons/fireplace-icon.png",
    formLabel: "Gas fireplace repair",
  },
  {
    slug: "gas-fireplace-maintenance",
    family: "gas-fireplace",
    title: "Gas Fireplace Maintenance",
    navLabel: "Gas Fireplace Maintenance",
    tagline: "Annual safety checks, cleaning, and tune-ups while the fireplace still runs.",
    description:
      "Preventive service for fireplaces that still operate: burner and pilot cleaning, safety checks, and combustion review before heating season.",
    bullets: [
      "Burner, pilot, and ignition cleaning",
      "Control and safety-switch checks",
      "Glass, gasket, and firebox cleaning",
      "Notes if worn parts need repair next",
    ],
    image: "/images/photos/gallery-02.jpeg",
    icon: "/images/icons/fireplace-icon.png",
    formLabel: "Gas fireplace maintenance",
  },
  {
    slug: "gas-fireplace-installation",
    family: "gas-fireplace",
    title: "Gas Fireplace Installation",
    navLabel: "Gas Fireplace Installation",
    tagline: "New installs, replacements, and retrofits planned around venting and the room.",
    description:
      "Installation planning for new units, replacements, and retrofits — appliance fit, venting, clearances, and finishing — not emergency repair.",
    bullets: [
      "New install, replacement, and retrofit planning",
      "Venting, framing, and clearance review",
      "Insert, direct-vent, and linear options",
      "Startup walkthrough after installation",
    ],
    image: "/images/photos/team-fireplace.jpg",
    icon: "/images/icons/fireplace-icon.png",
    formLabel: "Gas fireplace installation",
  },
  {
    slug: "chimney-sweeping-inspection",
    family: "chimney",
    title: "Chimney Sweeping & Inspection",
    navLabel: "Chimney Sweeping & Inspection",
    tagline: "Sweep to improve visibility, then inspect and explain what comes next.",
    description:
      "Creosote removal, visual inspection of the flue and accessible chimney parts, and clear notes on whether the next step is routine care, repair, or a WETT report.",
    bullets: [
      "Creosote and blockage removal",
      "Liner, cap, crown, and flashing review",
      "Draft and safety observations",
      "Sweep is not a formal WETT inspection",
    ],
    image: "/images/photos/service-sweep.jpeg",
    icon: "/images/icons/chimney-icon.png",
    formLabel: "Chimney sweeping & inspection",
  },
  {
    slug: "chimney-repair-masonry",
    family: "chimney",
    title: "Chimney Repair & Masonry",
    navLabel: "Chimney Repair & Masonry",
    tagline: "Crowns, mortar, brick, flashing, liners, and leak paths — scoped after inspection.",
    description:
      "Targeted masonry and chimney repair for freeze-thaw wear, water entry, and structural deterioration, with a clear urgent-versus-phased plan.",
    bullets: [
      "Crown, brick, and tuckpointing repairs",
      "Flashing and water-entry diagnosis",
      "Liner and venting review when needed",
      "Wood stove and chase work as capabilities, not separate URLs",
    ],
    image: "/images/photos/service-masonry.jpg",
    icon: "/images/icons/chimney-icon.png",
    formLabel: "Chimney repair & masonry",
  },
  {
    slug: "wett-inspections",
    family: "wett",
    title: "WETT Inspections",
    navLabel: "WETT Inspections",
    tagline: "Inspection reporting for insurance, real estate, and wood-burning system review.",
    description:
      "Customer-facing WETT inspection reports for insurance and real-estate files where they apply. A WETT visit is documentation, not an automatic repair or sweep.",
    bullets: [
      "Insurance and pre-sale reports",
      "Appliance, clearance, and venting review",
      "Clear findings and next-step notes",
      "Not a substitute for sweeping or masonry repair",
    ],
    image: "/images/photos/wett-inspection.jpg",
    icon: "/images/icons/inspection-icon.png",
    formLabel: "WETT inspection",
  },
] as const;

export const SERVICE_FAMILY_LABELS: Record<ServiceFamily, string> = {
  "gas-fireplace": "Gas fireplace",
  chimney: "Chimney",
  wett: "WETT",
};

export function isCanonicalServiceSlug(value: string): value is CanonicalServiceSlug {
  return (CANONICAL_SERVICE_SLUGS as readonly string[]).includes(value);
}

export function isServiceLandingSlug(value: string): value is ServiceLandingSlug {
  return (SERVICE_LANDING_SLUGS as readonly string[]).includes(value);
}

export function resolveCanonicalServiceSlug(slug: string): CanonicalServiceSlug | undefined {
  if (isCanonicalServiceSlug(slug)) {
    return slug;
  }

  return LEGACY_SERVICE_SLUG_ALIASES[slug];
}

export function getCanonicalService(slug: string) {
  const canonical = resolveCanonicalServiceSlug(slug);
  return canonicalServices.find((service) => service.slug === canonical);
}

export function getServicePath(slug: string) {
  const canonical = resolveCanonicalServiceSlug(slug);

  if (!canonical) {
    return "/services";
  }

  if (canonical === "gas-fireplace-repair") {
    return "/gas-fireplace-repair";
  }

  if (canonical === "wett-inspections") {
    return "/wett";
  }

  return `/services/${canonical}`;
}

export function getServiceHref(slug: string, city?: CitySlug | null) {
  const path = getServicePath(slug);
  return city ? getCityHref(city, path) : path;
}

export function getServicesByFamily(family: ServiceFamily) {
  return canonicalServices.filter((service) => service.family === family);
}
