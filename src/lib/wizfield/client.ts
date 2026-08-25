import "server-only";

import {
  WIZFIELD_REQUEST_TIMEOUT_MS,
  buildWizfieldRequestPayload,
  interpretWizfieldHttpResult,
  type PhoenixRequestServiceSyncInput,
  type WizfieldSyncOutcome,
} from "@/lib/wizfield/map-request-service";

function readEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function isWizfieldConfigured() {
  return Boolean(readEnv("WIZFIELD_API_BASE_URL") && readEnv("WIZFIELD_INTEGRATION_SECRET"));
}

function getWizfieldConfig() {
  const baseUrl = readEnv("WIZFIELD_API_BASE_URL").replace(/\/+$/, "");
  const secret = readEnv("WIZFIELD_INTEGRATION_SECRET");

  if (!baseUrl || !secret) {
    return null;
  }

  return { baseUrl, secret };
}

export async function sendRequestServiceToWizField(
  input: PhoenixRequestServiceSyncInput,
): Promise<WizfieldSyncOutcome> {
  const lastSyncAt = new Date().toISOString();

  try {
    const built = buildWizfieldRequestPayload(input);
    if (!built.ok) {
      return {
        wizfieldSyncStatus: "failed",
        wizfieldLastSyncAt: lastSyncAt,
        wizfieldSyncError: built.error,
      };
    }

    const config = getWizfieldConfig();
    if (!config) {
      return {
        wizfieldSyncStatus: "not_attempted",
        wizfieldLastSyncAt: lastSyncAt,
        wizfieldSyncError: "WizField is not configured.",
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WIZFIELD_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${config.baseUrl}/api/integrations/phoenix/request-service`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(built.payload),
        signal: controller.signal,
        cache: "no-store",
      });

      const body = await readJsonBody(response);
      const outcome = interpretWizfieldHttpResult({
        phoenixLeadId: input.requestId,
        lastSyncAt,
        httpStatus: response.status,
        body,
      });

      logSyncOutcome(input.requestId, outcome, response.status);
      return outcome;
    } catch (error) {
      const timedOut = isAbortError(error);
      const outcome = interpretWizfieldHttpResult({
        phoenixLeadId: input.requestId,
        lastSyncAt,
        timedOut,
        networkError: !timedOut,
      });

      logSyncOutcome(input.requestId, outcome);
      return outcome;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return {
      wizfieldSyncStatus: "failed",
      wizfieldLastSyncAt: lastSyncAt,
      wizfieldSyncError: "WizField sync failed.",
    };
  }
}

async function readJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function logSyncOutcome(leadId: string, outcome: WizfieldSyncOutcome, httpStatus?: number) {
  console.info("[wizfield] request-service sync", {
    leadId,
    httpStatus,
    status: outcome.wizfieldSyncStatus,
    wizfieldCustomerId: outcome.wizfieldCustomerId,
    wizfieldLeadId: outcome.wizfieldLeadId,
    portalAccess: outcome.wizfieldPortalAccessStatus,
  });
}
