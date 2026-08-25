export const PORTAL_HOST = "portal.phoenixfireplace.ca";
const DEFAULT_PORTAL_ORIGIN = `https://${PORTAL_HOST}`;

function parseOrigin(value: string) {
  return new URL(value.includes("://") ? value : `https://${value}`).origin;
}

export function getPortalOrigin() {
  const configured = process.env.PORTAL_URL?.trim();

  if (configured) {
    try {
      return parseOrigin(configured);
    } catch {
      return DEFAULT_PORTAL_ORIGIN;
    }
  }

  return DEFAULT_PORTAL_ORIGIN;
}

export function isPortalHost(hostname?: string | null) {
  if (!hostname) {
    return false;
  }

  const host = hostname.split(":")[0].toLowerCase();

  if (host === PORTAL_HOST) {
    return true;
  }

  try {
    return new URL(getPortalOrigin()).hostname.toLowerCase() === host;
  } catch {
    return false;
  }
}
