import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "papoon_fireplacerepair",
    environment: process.env.NODE_ENV,
    deploymentVersion: process.env.DEPLOYMENT_VERSION || "local",
    timestamp: new Date().toISOString(),
  });
}