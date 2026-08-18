import "server-only";

import { officeAuthIsConfigured } from "@/lib/auth/options";

function normalizeEnvValue(value: string) {
  return value.replace(/^\uFEFF/, "").replace(/\r/g, "").trim();
}

export function getConfiguredOfficeUsernames(): string[] {
  const username = normalizeEnvValue(process.env.OFFICE_USERNAME || "");

  if (!username || !officeAuthIsConfigured()) {
    return [];
  }

  return [username];
}
