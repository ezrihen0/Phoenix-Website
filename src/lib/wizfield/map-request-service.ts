import type { Lead, WizfieldPortalAccessStatus, WizfieldSyncStatus } from "@/lib/cms/types";

export const WIZFIELD_REQUEST_TIMEOUT_MS = 4_000;

export const PHOENIX_SERVICE_TO_WIZFIELD = {
  "Gas Fireplace Repair": "repair",
  "Gas Fireplace Maintenance": "cleaning",
  // Closest supported operational category. Exact Phoenix title is preserved in originalService.
  "Gas Fireplace Installation": "repair",
  "Chimney Sweeping & Inspection": "cleaning",
  "Chimney Repair & Masonry": "repair",
  "WETT Inspections": "inspection",
} as const;

export type WizfieldServiceType = (typeof PHOENIX_SERVICE_TO_WIZFIELD)[keyof typeof PHOENIX_SERVICE_TO_WIZFIELD];

export type PhoenixRequestServiceSyncInput = {
  requestId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  urgency: string;
  urgencyDetail: string;
  preferredDay?: string;
  preferredTime?: string;
  addressStreet: string;
  addressCity: string;
  addressProvince: string;
  addressPostalCode: string;
  city: string;
  ctaLocation?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type WizfieldRequestPayload = {
  requestId: string;
  customer: {
    fullName: string;
    phone: string;
    email: string | null;
  };
  serviceAddress: {
    line1: string;
    line2: string | null;
    city: string;
    region: string | null;
    postalCode: string;
  };
  service: {
    type: WizfieldServiceType;
    originalService: string | null;
  };
  request: {
    description: string | null;
    urgency: string | null;
    preferredDay: string | null;
    preferredTime: string | null;
  };
  attribution: {
    source: "website";
    city: string | null;
    cta: string | null;
    sourceUrl: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
  };
};

export type WizfieldSyncOutcome = {
  wizfieldSyncStatus: WizfieldSyncStatus;
  wizfieldCustomerId?: string;
  wizfieldLeadId?: string;
  wizfieldPortalAccessStatus?: WizfieldPortalAccessStatus;
  wizfieldPortalAccessExpiresAt?: string;
  wizfieldLastSyncAt: string;
  wizfieldSyncError?: string;
};

const PORTAL_ACCESS_STATUSES = [
  "sent",
  "already_sent",
  "pending_email",
  "email_failed",
  "not_requested",
] as const satisfies readonly WizfieldPortalAccessStatus[];

export function mapPhoenixServiceToWizfield(serviceTitle: string): WizfieldServiceType | undefined {
  return PHOENIX_SERVICE_TO_WIZFIELD[serviceTitle as keyof typeof PHOENIX_SERVICE_TO_WIZFIELD];
}

export function buildWizfieldRequestPayload(
  input: PhoenixRequestServiceSyncInput,
): { ok: true; payload: WizfieldRequestPayload } | { ok: false; error: string } {
  const serviceType = mapPhoenixServiceToWizfield(input.service);

  if (!serviceType) {
    return {
      ok: false,
      error: "Phoenix service could not be mapped to a WizField type.",
    };
  }

  const requestId = input.requestId.trim().toLowerCase();
  const fullName = `${input.firstName} ${input.lastName}`.replace(/\s+/g, " ").trim();

  return {
    ok: true,
    payload: {
      requestId,
      customer: {
        fullName,
        phone: input.phone.trim(),
        email: nullableText(input.email),
      },
      serviceAddress: {
        line1: input.addressStreet.trim(),
        line2: null,
        city: input.addressCity.trim(),
        region: nullableText(input.addressProvince),
        postalCode: input.addressPostalCode.trim(),
      },
      service: {
        type: serviceType,
        originalService: nullableText(input.service),
      },
      request: {
        description: nullableText(input.message),
        urgency: nullableText(input.urgency),
        preferredDay: nullableText(input.preferredDay) || nullableText(input.urgencyDetail),
        preferredTime: nullableText(input.preferredTime),
      },
      attribution: {
        source: "website",
        city: nullableText(input.city),
        cta: nullableText(input.ctaLocation),
        sourceUrl: nullableText(input.sourceUrl),
        utmSource: nullableText(input.utmSource),
        utmMedium: nullableText(input.utmMedium),
        utmCampaign: nullableText(input.utmCampaign),
      },
    },
  };
}

export function payloadContainsOrganizationId(payload: unknown): boolean {
  if (payload == null || typeof payload !== "object") {
    return false;
  }

  if (Array.isArray(payload)) {
    return payload.some(payloadContainsOrganizationId);
  }

  return Object.entries(payload as Record<string, unknown>).some(([key, value]) => {
    const normalizedKey = key.toLowerCase();
    return (
      normalizedKey === "organizationid" ||
      normalizedKey === "organization_id" ||
      payloadContainsOrganizationId(value)
    );
  });
}

export function interpretWizfieldHttpResult(params: {
  phoenixLeadId: string;
  lastSyncAt: string;
  httpStatus?: number;
  body?: unknown;
  timedOut?: boolean;
  networkError?: boolean;
}): WizfieldSyncOutcome {
  const lastSyncAt = params.lastSyncAt;

  if (params.timedOut) {
    return failedOutcome(lastSyncAt, "WizField timeout");
  }

  if (params.networkError) {
    return failedOutcome(lastSyncAt, "WizField network error");
  }

  if (params.httpStatus == null) {
    return failedOutcome(lastSyncAt, "WizField sync failed.");
  }

  if (params.httpStatus !== 200) {
    const code = readErrorCode(params.body);
    return failedOutcome(
      lastSyncAt,
      code ? `WizField HTTP ${params.httpStatus} ${code}` : `WizField HTTP ${params.httpStatus}`,
    );
  }

  const data = readSuccessData(params.body);
  if (!data) {
    return failedOutcome(lastSyncAt, "WizField response was invalid.");
  }

  if (!requestIdsMatch(params.phoenixLeadId, data.requestId)) {
    return failedOutcome(lastSyncAt, "WizField requestId did not match Phoenix lead id.");
  }

  const portalAccessStatus = readPortalAccessStatus(data.portalAccess?.status);
  const portalAccessExpiresAt =
    typeof data.portalAccess?.expiresAt === "string" && data.portalAccess.expiresAt.trim()
      ? data.portalAccess.expiresAt.trim()
      : undefined;

  return {
    wizfieldSyncStatus: "synced",
    wizfieldCustomerId: data.customerId,
    wizfieldLeadId: data.leadId,
    wizfieldPortalAccessStatus: portalAccessStatus,
    wizfieldPortalAccessExpiresAt: portalAccessExpiresAt,
    wizfieldLastSyncAt: lastSyncAt,
  };
}

export function applyWizfieldOutcomeToLead(lead: Lead, outcome: WizfieldSyncOutcome): Lead {
  return {
    ...lead,
    wizfieldSyncStatus: outcome.wizfieldSyncStatus,
    wizfieldCustomerId: outcome.wizfieldCustomerId,
    wizfieldLeadId: outcome.wizfieldLeadId,
    wizfieldPortalAccessStatus: outcome.wizfieldPortalAccessStatus,
    wizfieldPortalAccessExpiresAt: outcome.wizfieldPortalAccessExpiresAt,
    wizfieldLastSyncAt: outcome.wizfieldLastSyncAt,
    wizfieldSyncError: outcome.wizfieldSyncError,
  };
}

export function formatWizfieldOfficeSyncLines(outcome: WizfieldSyncOutcome): string[] {
  const lines = [`WizField sync: ${outcome.wizfieldSyncStatus}`];

  if (outcome.wizfieldCustomerId) {
    lines.push(`WizField customer: ${outcome.wizfieldCustomerId}`);
  }

  if (outcome.wizfieldLeadId) {
    lines.push(`WizField lead: ${outcome.wizfieldLeadId}`);
  }

  if (outcome.wizfieldPortalAccessStatus) {
    lines.push(`WizField portal: ${outcome.wizfieldPortalAccessStatus}`);
  }

  if (outcome.wizfieldSyncError) {
    lines.push(`WizField error: ${outcome.wizfieldSyncError}`);
  }

  return lines;
}

export function outcomeContainsCredential(outcome: WizfieldSyncOutcome, secret: string): boolean {
  if (!secret) {
    return false;
  }

  return JSON.stringify(outcome).includes(secret);
}

function failedOutcome(lastSyncAt: string, error: string): WizfieldSyncOutcome {
  return {
    wizfieldSyncStatus: "failed",
    wizfieldLastSyncAt: lastSyncAt,
    wizfieldSyncError: error,
  };
}

function nullableText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function requestIdsMatch(phoenixLeadId: string, returnedRequestId: string | undefined): boolean {
  if (!returnedRequestId) {
    return false;
  }

  return phoenixLeadId.trim().toLowerCase() === returnedRequestId.trim().toLowerCase();
}

function readErrorCode(body: unknown): string | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  const error = isRecord(body.error) ? body.error : undefined;
  const code = error?.code;
  return typeof code === "string" && code.trim() ? code.trim() : undefined;
}

function readSuccessData(body: unknown):
  | {
      requestId?: string;
      customerId?: string;
      leadId?: string;
      portalAccess?: {
        status?: unknown;
        expiresAt?: unknown;
      };
    }
  | undefined {
  if (!isRecord(body) || !isRecord(body.data)) {
    return undefined;
  }

  const data = body.data;
  const customerId = typeof data.customerId === "string" ? data.customerId.trim() : "";
  const leadId = typeof data.leadId === "string" ? data.leadId.trim() : "";

  if (!customerId || !leadId) {
    return undefined;
  }

  return {
    requestId: typeof data.requestId === "string" ? data.requestId : undefined,
    customerId,
    leadId,
    portalAccess: isRecord(data.portalAccess)
      ? {
          status: data.portalAccess.status,
          expiresAt: data.portalAccess.expiresAt,
        }
      : undefined,
  };
}

function readPortalAccessStatus(value: unknown): WizfieldPortalAccessStatus | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return PORTAL_ACCESS_STATUSES.find((status) => status === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
