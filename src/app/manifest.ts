import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f4ecdf",
    theme_color: "#1f1a16",
    icons: [
      {
        src: "/images/brand/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/brand/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}