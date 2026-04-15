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
