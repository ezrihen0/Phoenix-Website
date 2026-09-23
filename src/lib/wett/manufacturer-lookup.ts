import type { WettSystem } from "./system-profile";

export const MANUFACTURER_LOOKUP_STATUSES = [
  "verified-exact-match",
  "possible-matches",
  "source-conflict",
  "no-verified-exact-match",
  "insufficient-appliance-id",
] as const;

export type ManufacturerLookupStatus = (typeof MANUFACTURER_LOOKUP_STATUSES)[number];

export type PhoenixVerifiedSource = {
  manufacturer: string;
  model: string;
  modelSuffix?: string;
  serialApplicability?: string;
  documentId: string;
  revision?: string;
  requirementKey: string;
  requirementValue: string;
  requirementUnit?: string;
  pageSection?: string;
  officialSource: string;
  canadian: boolean;
};

/**
 * Trusted Phoenix library. It starts empty.
 * A lookup must not invent a clearance, and raw AI output must not be inserted here.
 */
export const PHOENIX_VERIFIED_SOURCES: PhoenixVerifiedSource[] = [];

export type ManufacturerLookupInput = {
  requestedRequirement: string;
  system: WettSystem;
};

export type ManufacturerLookupResult = {
  status: ManufacturerLookupStatus;
  manufacturer?: string;
  model?: string;
  modelSuffix?: string;
  serial?: string;
  sourcesSearched: string[];
  auditNote: string;
  requirementValue?: string;
  requirementUnit?: string;
  sourceDocument?: string;
  pageSection?: string;
};

function listedIdentity(system: WettSystem) {
  if (system.type !== "wood-stove" && system.type !== "fireplace-insert" && system.type !== "factory-built-fireplace") {
    return undefined;
  }
  return system;
}

function sameProduct(source: PhoenixVerifiedSource, manufacturer: string, model: string, suffix?: string) {
  return source.manufacturer.toLowerCase() === manufacturer.toLowerCase() && source.model.toLowerCase() === model.toLowerCase() && (source.modelSuffix || "") === (suffix || "");
}

export function runManufacturerLookup(input: ManufacturerLookupInput): ManufacturerLookupResult {
  const identity = listedIdentity(input.system);
  const manufacturer = identity?.manufacturer?.trim();
  const model = identity?.model?.trim();
  const modelSuffix = identity?.modelSuffix?.trim();
  const serial = identity?.serial?.trim();
  const requested = input.requestedRequirement.trim();

  if (!identity || !manufacturer || !model) {
    return {
      status: "insufficient-appliance-id",
      manufacturer,
      model,
      modelSuffix,
      serial,
      sourcesSearched: ["Phoenix verified library"],
      auditNote: "Manufacturer and exact model are required before a search. This is not a no-match result. Official manufacturer portals and archives are not connected, so they were not recorded as checked.",
    };
  }

  const sourcesSearched = ["Phoenix verified library"];
  const candidates = PHOENIX_VERIFIED_SOURCES.filter((source) => source.requirementKey === requested && sameProduct(source, manufacturer, model, modelSuffix));

  if (candidates.length > 1) {
    return {
      status: "possible-matches",
      manufacturer,
      model,
      modelSuffix,
      serial,
      sourcesSearched,
      auditNote: "Multiple Phoenix verified entries match this manufacturer and model. The technician has to choose. No requirement was applied.",
    };
  }

  if (candidates.length === 1) {
    const match = candidates[0];
    return {
      status: "verified-exact-match",
      manufacturer,
      model,
      modelSuffix,
      serial,
      sourcesSearched,
      auditNote: "A Phoenix verified source matches this manufacturer, model, and suffix. It is not applied until the technician chooses Use Requirement.",
      requirementValue: match.requirementValue,
      requirementUnit: match.requirementUnit,
      sourceDocument: match.documentId,
      pageSection: match.pageSection,
    };
  }

  return {
    status: "no-verified-exact-match",
    manufacturer,
    model,
    modelSuffix,
    serial,
    sourcesSearched,
    auditNote: `Exact manufacturer searched: ${manufacturer}. Exact model searched: ${model}. Suffix considered: ${modelSuffix || "none recorded"}. Serial considered: ${serial || "none recorded"}. Phoenix verified library was searched and no defensible exact match was found. Official manufacturer portal and archive are not connected, so they were not recorded as checked. No requirement value was created.`,
  };
}
