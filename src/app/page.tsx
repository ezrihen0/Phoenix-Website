import type { Metadata } from "next";

import { CityChooserHero } from "@/components/city-chooser-hero";
import { WhatWeDo } from "@/components/homepage/what-we-do";
import { StructuredData } from "@/components/structured-data";
import { buildBreadcrumbSchema, buildOrganizationSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Phoenix Chimney & Fireplace | Alberta Fireplace & Chimney Service",
  description:
    "Phoenix Chimney & Fireplace Services is the organization behind fireplace repair, chimney care, and WETT inspection service across Calgary, Edmonton, and Red Deer.",
  path: "/",
  keywords: [
    "phoenix chimney fireplace alberta",
    "fireplace service calgary edmonton red deer",
    "chimney company alberta",
  ],
});

export default function Home() {
  return (
    <>
      <StructuredData
        data={[
          buildOrganizationSchema(),
          buildBreadcrumbSchema([{ name: "Home", path: "/" }]),
        ]}
      />
      <CityChooserHero />
      <WhatWeDo />
    </>
  );
}
