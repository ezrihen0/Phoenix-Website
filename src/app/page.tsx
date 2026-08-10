import type { Metadata } from "next";

import { CityChooserHero } from "@/components/city-chooser-hero";
import { StructuredData } from "@/components/structured-data";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Phoenix Fireplace & Chimney | Choose Your City",
    description:
      "Phoenix provides fireplace and chimney service across Alberta. Choose Calgary, Edmonton, or Red Deer to reach the right local team.",
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
