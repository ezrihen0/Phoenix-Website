import type { Metadata } from "next";

import { CityChooserHero } from "@/components/city-chooser-hero";
import { StructuredData } from "@/components/structured-data";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Choose Your City | Phoenix Chimney & Fireplace Services",
    description:
      "Select Calgary, Edmonton, or Red Deer to get the right Phoenix fireplace and chimney service path and dispatch number.",
    path: "/",
    keywords: [
      "phoenix fireplace calgary",
      "phoenix fireplace edmonton",
      "phoenix fireplace red deer",
    ],
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([{ name: "City chooser", path: "/" }])} />
      <CityChooserHero />
    </>
  );
}
