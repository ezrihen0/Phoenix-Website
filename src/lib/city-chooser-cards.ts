import { cities, getCityHref, type CitySlug } from "@/lib/cities";

export type CityChooserCard = {
  slug: CitySlug;
  name: string;
  href: string;
  serviceLabel: string;
  contextLine?: string;
  ctaLabel: string;
  image?: string;
  imageAlt?: string;
  fallbackClassName: string;
};

const cityCardImages: Record<
  CitySlug,
  {
    src: string;
    alt: string;
  }
> = {
  calgary: {
    src: "/images/cities/calgary.png",
    alt: "Calgary skyline and Bow River with the Rocky Mountains in the distance",
  },
  edmonton: {
    src: "/images/cities/edmonton.png",
    alt: "Edmonton skyline and Walterdale Bridge over the North Saskatchewan River",
  },
  "red-deer": {
    src: "/images/cities/red-deer.png",
    alt: "Red Deer downtown and the Red Deer River winding through green river valley parks",
  },
};

const fallbackClassNames: Record<CitySlug, string> = {
  calgary:
    "bg-[radial-gradient(circle_at_20%_20%,rgba(186,92,29,0.45),transparent_55%),linear-gradient(160deg,#2f241d_0%,#171310_100%)]",
  edmonton:
    "bg-[radial-gradient(circle_at_80%_15%,rgba(72,112,88,0.42),transparent_55%),linear-gradient(160deg,#1f2622_0%,#121614_100%)]",
  "red-deer":
    "bg-[radial-gradient(circle_at_50%_0%,rgba(182,84,45,0.38),transparent_60%),linear-gradient(160deg,#25201a_0%,#14110f_100%)]",
};

export function getCityChooserCards(): CityChooserCard[] {
  return cities.map((city) => ({
    slug: city.slug,
    name: city.name,
    href: getCityHref(city.slug),
    serviceLabel: "Fireplace & Chimney Services",
    ctaLabel: `Explore ${city.name}`,
    image: cityCardImages[city.slug]?.src,
    imageAlt: cityCardImages[city.slug]?.alt,
    fallbackClassName: fallbackClassNames[city.slug],
  }));
}
