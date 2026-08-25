import "server-only";

import type { PortalConnectionStatus, PortalCustomerSnapshot, PortalSession } from "@/lib/portal/types";

/**
 * WizField adapter boundary. Production must not query WizField from the frontend
 * or invent mock customers while the CRM is deferred.
 */
export function getPortalConnectionStatus(): PortalConnectionStatus {
  return {
    connected: false,
    provider: "wizfield",
    status: "deferred",
    message:
      "The customer portal is prepared, but WizField is not connected yet. Job status, quotes, invoices, and documents will appear here after the adapter is live.",
  };
}

export async function requestPortalMagicLink(_identifier: string): Promise<{
  accepted: boolean;
  connection: PortalConnectionStatus;
}> {
  return {
    accepted: false,
    connection: getPortalConnectionStatus(),
  };
}

export async function getPortalSnapshot(
  _session: PortalSession | null,
): Promise<PortalCustomerSnapshot | null> {
  if (!getPortalConnectionStatus().connected) {
    return null;
  }

  return null;
}
