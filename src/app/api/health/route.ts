import { NextResponse } from "next/server";

import { authIsConfigured, officeAuthIsConfigured } from "@/lib/auth/options";
import { defaultSiteSettings } from "@/lib/cms/defaults";
import { getCmsStorageMode, getSiteSettings } from "@/lib/cms/storage";
import { leadEmailDeliveryIsConfigured } from "@/lib/email/lead-notifications";
import { isWizfieldConfigured } from "@/lib/wizfield/client";

const deploymentVersion =
  process.env.VERCEL_DEPLOYMENT_ID?.trim() ||
  process.env.DEPLOYMENT_VERSION?.trim() ||
  "local";

export async function GET() {
  let leadEmailConfigured = false;

  try {
    const settings = await getSiteSettings();
    leadEmailConfigured =
      settings.sendLeadEmails && leadEmailDeliveryIsConfigured(settings);
  } catch {
    leadEmailConfigured =
      defaultSiteSettings.sendLeadEmails &&
      leadEmailDeliveryIsConfigured(defaultSiteSettings);
  }

  return NextResponse.json({
    ok: true,
    service: "papoon_fireplacerepair",
    environment: process.env.NODE_ENV,
    cmsStorage: getCmsStorageMode(),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    adminAuthConfigured: authIsConfigured(),
    officeAuthConfigured: officeAuthIsConfigured(),
    brevoConfigured: Boolean(process.env.BREVO_API_KEY?.trim()),
    wizfieldConfigured: isWizfieldConfigured(),
    leadEmailConfigured,
    deploymentVersion,
    timestamp: new Date().toISOString(),
  });
}