import { NextResponse } from "next/server";

import { getCmsStorageMode } from "@/lib/cms/storage";

const deploymentVersion =
  process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
  process.env.DEPLOYMENT_VERSION?.trim() ||
  "local";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "papoon_fireplacerepair",
    environment: process.env.NODE_ENV,
    cmsStorage: getCmsStorageMode(),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    deploymentVersion,
    timestamp: new Date().toISOString(),
  });
}