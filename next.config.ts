import type { NextConfig } from "next";

const isVercelDeployment = Boolean(process.env.VERCEL);
const deploymentId =
  process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
  process.env.DEPLOYMENT_VERSION?.trim() ||
  undefined;

const nextConfig: NextConfig = {
  output: isVercelDeployment ? undefined : "standalone",
  poweredByHeader: false,
  deploymentId,
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/calgary/services",
        permanent: true,
      },
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
        source: "/articles",
        destination: "/calgary/articles",
        permanent: true,
      },
      {
        source: "/articles/:slug",
        destination: "/calgary/articles/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
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
