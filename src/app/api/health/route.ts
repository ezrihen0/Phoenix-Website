import { NextResponse } from "next/server";

import { authIsConfigured, officeAuthIsConfigured } from "@/lib/auth/options";
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
    adminAuthConfigured: authIsConfigured(),
    officeAuthConfigured: officeAuthIsConfigured(),
    deploymentVersion,
    timestamp: new Date().toISOString(),
  });
}