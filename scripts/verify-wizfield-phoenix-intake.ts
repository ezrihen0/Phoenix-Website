import {
  PHOENIX_SERVICE_TO_WIZFIELD,
  WIZFIELD_REQUEST_TIMEOUT_MS,
  applyWizfieldOutcomeToLead,
  buildWizfieldRequestPayload,
  formatWizfieldOfficeSyncLines,
  interpretWizfieldHttpResult,
  mapPhoenixServiceToWizfield,
  outcomeContainsCredential,
  payloadContainsOrganizationId,
  type PhoenixRequestServiceSyncInput,
} from "../src/lib/wizfield/map-request-service";
import type { Lead } from "../src/lib/cms/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const PHOENIX_LEAD_ID = "0c91a7d2-4e3b-4f1c-9a2e-1234567890ab";
const SECRET = "wizfield-integration-secret-never-log-this";

const SAMPLE_INPUT: PhoenixRequestServiceSyncInput = {
  requestId: PHOENIX_LEAD_ID,
  firstName: "John",
  lastName: "Smith",
  phone: "4035550100",
  email: "john@example.com",
  service: "Gas Fireplace Repair",
  message: "The fireplace will not stay lit.",
  urgency: "As soon as possible",
  urgencyDetail: "Today, if available",
  preferredTime: "8-12 Morning",
  addressStreet: "123 Main St",
  addressCity: "Calgary",
  addressProvince: "AB",
  addressPostalCode: "T2P 1J9",
  city: "calgary",
  ctaLocation: "header",
  sourceUrl: "https://phoenixfireplace.ca/calgary",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "repair",
};

const EXPECTED_MAPPING = {
  "Gas Fireplace Repair": "repair",
  "Gas Fireplace Maintenance": "cleaning",
  "Gas Fireplace Installation": "repair",
  "Chimney Sweeping & Inspection": "cleaning",
  "Chimney Repair & Masonry": "repair",
  "WETT Inspections": "inspection",
} as const;

assert(
  WIZFIELD_REQUEST_TIMEOUT_MS >= 3_000 && WIZFIELD_REQUEST_TIMEOUT_MS <= 4_000,
  "WizField timeout must stay in the 3-4 second range",
);

assert(
  JSON.stringify(PHOENIX_SERVICE_TO_WIZFIELD) === JSON.stringify(EXPECTED_MAPPING),
  "6 to 4 service mapping drifted",
);

for (const [title, type] of Object.entries(EXPECTED_MAPPING)) {
  const mapped = mapPhoenixServiceToWizfield(title);
  const built = buildWizfieldRequestPayload({ ...SAMPLE_INPUT, service: title });
  assert(mapped === type, `${title} must map to ${type}`);
  assert(built.ok, `${title} payload must build`);
  assert(built.payload.service.type === type, `${title} payload type`);
  assert(built.payload.service.originalService === title, `${title} originalService must be preserved`);
}

const missingService = buildWizfieldRequestPayload({ ...SAMPLE_INPUT, service: "Unknown Service" });
assert(!missingService.ok, "unknown Phoenix service must not invent a WizField type");

const first = buildWizfieldRequestPayload(SAMPLE_INPUT);
const second = buildWizfieldRequestPayload({ ...SAMPLE_INPUT });
assert(first.ok && second.ok, "sample payload must build");
assert(first.payload.requestId === PHOENIX_LEAD_ID, "requestId must be the Phoenix lead.id");
assert(second.payload.requestId === first.payload.requestId, "replay of the same persisted lead reuses requestId");
assert(JSON.stringify(first.payload) === JSON.stringify(second.payload), "same persisted lead must produce the same payload");
assert(first.payload.customer.fullName === "John Smith", "fullName joins first and last name");
assert(first.payload.serviceAddress.line1 === "123 Main St", "street maps to line1");
assert(first.payload.serviceAddress.city === "Calgary", "city maps");
assert(first.payload.serviceAddress.region === "AB", "province maps to region");
assert(first.payload.serviceAddress.postalCode === "T2P 1J9", "postal code maps");
assert(first.payload.attribution.source === "website", "attribution.source must be website");
assert(first.payload.attribution.cta === "header", "ctaLocation maps to attribution.cta");
assert(first.payload.request.preferredDay === "Today, if available", "preferredDay falls back to urgencyDetail");
assert(first.payload.request.preferredTime === "8-12 Morning", "preferredTime is sent");
assert(!payloadContainsOrganizationId(first.payload), "payload must not contain organizationId");
assert(!JSON.stringify(first.payload).toLowerCase().includes("organization"), "payload must not mention organization");

const thisWeek = buildWizfieldRequestPayload({
  ...SAMPLE_INPUT,
  urgency: "This week",
  urgencyDetail: "Wednesday",
  preferredDay: "Wednesday",
});
assert(thisWeek.ok && thisWeek.payload.request.preferredDay === "Wednesday", "This week preferredDay is preserved");

const otherLead = buildWizfieldRequestPayload({
  ...SAMPLE_INPUT,
  requestId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
});
assert(
  otherLead.ok && otherLead.payload.requestId !== first.payload.requestId,
  "a second Phoenix lead (browser double-submit) gets a different requestId and is not treated as replay",
);

const lastSyncAt = "2026-08-25T12:00:00.000Z";
const successBody = {
  data: {
    requestId: PHOENIX_LEAD_ID.toUpperCase(),
    organizationId: "org-should-not-be-required-on-phoenix",
    customerId: "cust-1",
    leadId: "lead-1",
    customerCreated: true,
    leadCreated: true,
    portalAccess: { status: "sent", expiresAt: "2026-08-26T12:00:00.000Z" },
  },
};

const synced = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  httpStatus: 200,
  body: successBody,
});
assert(synced.wizfieldSyncStatus === "synced", "valid request stores synced");
assert(synced.wizfieldCustomerId === "cust-1", "customerId persisted");
assert(synced.wizfieldLeadId === "lead-1", "leadId persisted");
assert(synced.wizfieldPortalAccessStatus === "sent", "portal sent stored");
assert(synced.wizfieldLastSyncAt === lastSyncAt, "lastSyncAt recorded on success");
assert(!synced.wizfieldSyncError, "success clears sync error");
assert(!outcomeContainsCredential(synced, SECRET), "success outcome must not include the secret");

const emailFailed = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  httpStatus: 200,
  body: {
    data: {
      ...successBody.data,
      portalAccess: { status: "email_failed", expiresAt: null },
    },
  },
});
assert(emailFailed.wizfieldSyncStatus === "synced", "portal email failure is still CRM-synced");
assert(emailFailed.wizfieldCustomerId === "cust-1", "email failure retains IDs");
assert(emailFailed.wizfieldPortalAccessStatus === "email_failed", "email_failed status stored");

const mismatch = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  httpStatus: 200,
  body: {
    data: {
      ...successBody.data,
      requestId: "11111111-2222-3333-4444-555555555555",
    },
  },
});
assert(mismatch.wizfieldSyncStatus === "failed", "returned requestId must match Phoenix lead.id");
assert(!mismatch.wizfieldCustomerId && !mismatch.wizfieldLeadId, "mismatched requestId must not store foreign IDs");
assert(mismatch.wizfieldLastSyncAt === lastSyncAt, "lastSyncAt recorded on requestId mismatch");

const unauthorized = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  httpStatus: 401,
  body: { error: { code: "integration_credential_invalid", message: `Bearer ${SECRET}` } },
});
assert(unauthorized.wizfieldSyncStatus === "failed", "401 must not lose the Phoenix lead path");
assert(unauthorized.wizfieldLastSyncAt === lastSyncAt, "lastSyncAt recorded on 401");
assert(unauthorized.wizfieldSyncError === "WizField HTTP 401 integration_credential_invalid", "401 records status and code");
assert(!outcomeContainsCredential(unauthorized, SECRET), "401 outcome must not include the secret");

const conflict = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  httpStatus: 409,
  body: { error: { code: "integration_idempotency_conflict" } },
});
assert(conflict.wizfieldSyncStatus === "failed", "409 must not fail the Phoenix capture path");
assert(conflict.wizfieldSyncError === "WizField HTTP 409 integration_idempotency_conflict", "409 records code");
assert(conflict.wizfieldLastSyncAt === lastSyncAt, "lastSyncAt recorded on 409");

const serverError = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  httpStatus: 500,
});
assert(serverError.wizfieldSyncStatus === "failed", "500 marks failed");
assert(serverError.wizfieldLastSyncAt === lastSyncAt, "lastSyncAt recorded on 500");

const timeout = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  timedOut: true,
});
assert(timeout.wizfieldSyncStatus === "failed", "timeout marks failed");
assert(timeout.wizfieldSyncError === "WizField timeout", "timeout message");
assert(timeout.wizfieldLastSyncAt === lastSyncAt, "lastSyncAt recorded on timeout");

const network = interpretWizfieldHttpResult({
  phoenixLeadId: PHOENIX_LEAD_ID,
  lastSyncAt,
  networkError: true,
});
assert(network.wizfieldSyncStatus === "failed", "network failure marks failed");
assert(network.wizfieldLastSyncAt === lastSyncAt, "lastSyncAt recorded on network failure");

const phoenixLead = {
  id: PHOENIX_LEAD_ID,
  city: "calgary",
  source: "website",
  firstName: "John",
  lastName: "Smith",
  phone: "4035550100",
  email: "john@example.com",
  service: "Gas Fireplace Repair",
  message: "The fireplace will not stay lit.",
  createdAt: lastSyncAt,
  emailDeliveryStatus: "skipped",
} satisfies Lead;

const enriched = applyWizfieldOutcomeToLead(phoenixLead, timeout);
assert(enriched.id === PHOENIX_LEAD_ID, "sync metadata must not replace Phoenix lead.id");
assert(enriched.wizfieldSyncStatus === "failed", "failed outcome is stored on the existing lead");
assert(enriched.emailDeliveryStatus === "skipped", "WizField failure must not rewrite unrelated lead fields");

const officeLines = formatWizfieldOfficeSyncLines(emailFailed).join("\n");
assert(officeLines.includes("WizField sync: synced"), "office email includes sync status");
assert(officeLines.includes("WizField portal: email_failed"), "office email includes portal email failure");
assert(!officeLines.includes(SECRET), "office email lines must not include the secret");

console.log("wizfield-phoenix-intake checks passed");
