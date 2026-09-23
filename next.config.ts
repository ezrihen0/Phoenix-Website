import { networkInterfaces } from "node:os";

import type { NextConfig } from "next";

function lanDevOrigins() {
  const origins = new Set<string>();
  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === "IPv4" && !entry.internal) {
        origins.add(entry.address);
      }
    }
  }
  return [...origins];
}

const isVercelDeployment = Boolean(process.env.VERCEL);
const deploymentId =
  process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
  process.env.DEPLOYMENT_VERSION?.trim() ||
  undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: lanDevOrigins(),
  output: isVercelDeployment ? undefined : "standalone",
  poweredByHeader: false,
  deploymentId,
  async redirects() {
    return [
      {
        source: "/wett",
        destination: "/calgary/wett",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/calgary/about",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/calgary/contact",
        permanent: true,
      },
      {
        source: "/gas-fireplace-repair",
        destination: "/calgary/gas-fireplace-repair",
        permanent: true,
      },
      {
        source: "/calgary/articles/spring-fireplace-maintenance-checklist-calgary",
        destination: "/articles/spring-fireplace-maintenance-checklist",
        permanent: true,
      },
      {
        source: "/edmonton/articles/spring-fireplace-maintenance-checklist-edmonton",
        destination: "/articles/spring-fireplace-maintenance-checklist",
        permanent: true,
      },
      {
        source: "/red-deer/articles/spring-fireplace-maintenance-checklist-red-deer",
        destination: "/articles/spring-fireplace-maintenance-checklist",
        permanent: true,
      },
      {
        source: "/calgary/articles/when-to-book-a-wett-inspection-in-calgary",
        destination: "/articles/when-to-book-a-wett-inspection",
        permanent: true,
      },
      {
        source: "/edmonton/articles/when-to-book-a-wett-inspection-in-edmonton",
        destination: "/articles/when-to-book-a-wett-inspection",
        permanent: true,
      },
      {
        source: "/red-deer/articles/when-to-book-a-wett-inspection-in-red-deer",
        destination: "/articles/when-to-book-a-wett-inspection",
        permanent: true,
      },
      {
        source: "/calgary/articles/gas-fireplace-not-turning-on-calgary",
        destination: "/articles/gas-fireplace-not-turning-on",
        permanent: true,
      },
      {
        source: "/edmonton/articles/gas-fireplace-not-turning-on-edmonton",
        destination: "/articles/gas-fireplace-not-turning-on",
        permanent: true,
      },
      {
        source: "/red-deer/articles/gas-fireplace-not-turning-on-red-deer",
        destination: "/articles/gas-fireplace-not-turning-on",
        permanent: true,
      },
      {
        source: "/calgary/request-service",
        destination: "/request-service?city=calgary",
        permanent: true,
      },
      {
        source: "/edmonton/request-service",
        destination: "/request-service?city=edmonton",
        permanent: true,
      },
      {
        source: "/red-deer/request-service",
        destination: "/request-service?city=red-deer",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/portal",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/portal/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/request-service",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
