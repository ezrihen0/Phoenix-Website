const PRODUCTION_MAPS_HOSTS = ["phoenixfireplace.ca", "www.phoenixfireplace.ca"] as const;

function extraAllowedHosts() {
  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_ALLOWED_HOSTS,
  ]
    .filter(Boolean)
    .join(",");

  return configured
    .split(",")
    .map((value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return "";
      }

      try {
        return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).hostname.toLowerCase();
      } catch {
        return trimmed.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
      }
    })
    .filter(Boolean);
}

export function getAllowedMapsHosts() {
  const hosts = new Set<string>(PRODUCTION_MAPS_HOSTS);

  for (const host of extraAllowedHosts()) {
    hosts.add(host);
  }

  if (process.env.NODE_ENV !== "production") {
    hosts.add("localhost");
    hosts.add("127.0.0.1");
  }

  return hosts;
}

export function isAllowedMapsHost(hostname?: string) {
  if (typeof window === "undefined" && !hostname) {
    return false;
  }

  const host = (hostname || window.location.hostname).toLowerCase();
  return getAllowedMapsHosts().has(host);
}

export const REQUIRED_GOOGLE_MAPS_APIS = [
  "Maps JavaScript API",
  "Places API",
] as const;
