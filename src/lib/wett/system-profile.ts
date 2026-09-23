import { z } from "zod";

export const WETT_SYSTEM_TYPES = [
  "wood-stove",
  "fireplace-insert",
  "masonry-fireplace",
  "factory-built-fireplace",
] as const;

export const WETT_LABEL_STATUSES = ["present-readable", "present-illegible", "missing"] as const;
export const WETT_MANUAL_STATUSES = ["verified", "found-not-verified", "not-available", "lookup-required"] as const;
export const WETT_CHIMNEY_TYPES = ["masonry", "factory-built", "unknown"] as const;
export const WETT_MASONRY_LINER_TYPES = ["clay", "stainless", "other", "unknown", "unable-to-verify"] as const;
export const WETT_INSERT_LINER_TYPES = ["stainless", "other", "unknown", "unable-to-verify"] as const;
export const WETT_CONNECTOR_TYPES = ["single-wall", "double-wall", "other", "unknown"] as const;
export const WETT_ORIGINAL_FIREPLACE_TYPES = ["masonry", "factory-built", "unknown"] as const;
export const WETT_ALTERATION_ANSWERS = ["yes", "no", "unknown"] as const;
export const WETT_YEAR_STATUSES = ["known", "unknown"] as const;
export const WETT_MEASURE_UNITS = ["in", "mm"] as const;

/** Legacy generic identification keys. They are not stored on the active profile. */
export const LEGACY_IDENTIFICATION_FIELDS = [
  "applianceType",
  "manufacturingDate",
  "manualRevision",
  "installationDate",
  "installationDateStatus",
  "lastMajorAlteration",
  "listingInformation",
] as const;

export const LABEL_STATUS_LABELS: Record<(typeof WETT_LABEL_STATUSES)[number], string> = {
  "present-readable": "Present & Readable",
  "present-illegible": "Present but Illegible",
  missing: "Missing",
};

export const MANUAL_STATUS_LABELS: Record<(typeof WETT_MANUAL_STATUSES)[number], string> = {
  verified: "Verified",
  "found-not-verified": "Found — Not Yet Verified",
  "not-available": "Not Available",
  "lookup-required": "Lookup Required",
};

export const CHIMNEY_TYPE_LABELS: Record<(typeof WETT_CHIMNEY_TYPES)[number], string> = {
  masonry: "Masonry",
  "factory-built": "Factory-Built",
  unknown: "Unknown",
};

export const MASONRY_LINER_LABELS: Record<(typeof WETT_MASONRY_LINER_TYPES)[number], string> = {
  clay: "Clay",
  stainless: "Stainless",
  other: "Other",
  unknown: "Unknown",
  "unable-to-verify": "Unable to Verify",
};

export const INSERT_LINER_LABELS: Record<(typeof WETT_INSERT_LINER_TYPES)[number], string> = {
  stainless: "Stainless",
  other: "Other",
  unknown: "Unknown",
  "unable-to-verify": "Unable to Verify",
};

export const CONNECTOR_TYPE_LABELS: Record<(typeof WETT_CONNECTOR_TYPES)[number], string> = {
  "single-wall": "Single-Wall",
  "double-wall": "Double-Wall",
  other: "Other",
  unknown: "Unknown",
};

export const ORIGINAL_FIREPLACE_LABELS: Record<(typeof WETT_ORIGINAL_FIREPLACE_TYPES)[number], string> = {
  masonry: "Masonry",
  "factory-built": "Factory-Built",
  unknown: "Unknown",
};

export const ALTERATION_LABELS: Record<(typeof WETT_ALTERATION_ANSWERS)[number], string> = {
  yes: "Yes",
  no: "No",
  unknown: "Unknown",
};

const optionalText = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }, z.string().max(max).optional());

const optionalYear = z.preprocess((value) => yearValue(value), z.string().regex(/^\d{4}$/).optional());

const optionalMeasure = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}, z.number().finite().min(0).max(2000).optional());

const listedIdentity = {
  manufacturer: optionalText(120),
  model: optionalText(120),
  modelSuffix: optionalText(80),
  serial: optionalText(80),
  labelStatus: z.enum(WETT_LABEL_STATUSES).optional(),
  labelRecheckConfirmed: z.boolean().optional(),
  alternateIdentity: z.enum(["yes", "no"]).optional(),
  alternateEvidence: optionalText(240),
  listingStatus: z.enum(["verified", "not-verified", "confirmed-unlisted"]).optional(),
  manualStatus: z.enum(WETT_MANUAL_STATUSES).optional(),
  installationYearStatus: z.enum(WETT_YEAR_STATUSES).optional(),
  installationYear: optionalYear,
  description: optionalText(2000),
};

const woodStoveSystemSchema = z
  .object({
    type: z.literal("wood-stove"),
    ...listedIdentity,
    chimneyType: z.enum(WETT_CHIMNEY_TYPES).optional(),
    linerType: z.enum(WETT_MASONRY_LINER_TYPES).optional(),
    chimneyManufacturer: optionalText(160),
    chimneySeries: optionalText(160),
    connectorType: z.enum(WETT_CONNECTOR_TYPES).optional(),
  })
  .strict();

const fireplaceInsertSystemSchema = z
  .object({
    type: z.literal("fireplace-insert"),
    ...listedIdentity,
    originalFireplaceType: z.enum(WETT_ORIGINAL_FIREPLACE_TYPES).optional(),
    originalFireplaceManufacturer: optionalText(160),
    originalFireplaceModel: optionalText(160),
    linerType: z.enum(WETT_INSERT_LINER_TYPES).optional(),
    linerDiameter: optionalMeasure,
    linerDiameterUnit: z.enum(WETT_MEASURE_UNITS).optional(),
  })
  .strict();

const masonryFireplaceSystemSchema = z
  .object({
    type: z.literal("masonry-fireplace"),
    description: optionalText(2000),
    homeBuiltYearStatus: z.enum(WETT_YEAR_STATUSES).optional(),
    homeBuiltYear: optionalYear,
    majorAlteration: z.enum(WETT_ALTERATION_ANSWERS).optional(),
    alterationYear: optionalYear,
    linerType: z.enum(WETT_MASONRY_LINER_TYPES).optional(),
  })
  .strict();

const factoryBuiltFireplaceSystemSchema = z
  .object({
    type: z.literal("factory-built-fireplace"),
    ...listedIdentity,
    certificationListing: optionalText(240),
    chimneyManufacturer: optionalText(160),
    chimneySeries: optionalText(160),
    chimneyDiameter: optionalMeasure,
    chimneyDiameterUnit: z.enum(WETT_MEASURE_UNITS).optional(),
  })
  .strict();

const unsetSystemSchema = z
  .object({
    type: z.undefined().optional(),
    description: optionalText(2000),
  })
  .strict();

export const wettSystemSchema = z.union([
  woodStoveSystemSchema,
  fireplaceInsertSystemSchema,
  masonryFireplaceSystemSchema,
  factoryBuiltFireplaceSystemSchema,
  unsetSystemSchema,
]);

export type WettSystemType = (typeof WETT_SYSTEM_TYPES)[number];
export type WettSystem = z.infer<typeof wettSystemSchema>;

type Raw = Record<string, unknown>;

function rawRecord(value: unknown): Raw {
  return value && typeof value === "object" ? { ...(value as Raw) } : {};
}

function text(value: unknown, max: number) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function oneOf<T extends string>(value: unknown, options: readonly T[]) {
  const normalized = text(value, 80)?.toLowerCase();
  return options.find((option) => option === normalized);
}

function yearValue(value: unknown) {
  if (typeof value === "number" && value >= 1800 && value <= 2100) return String(Math.trunc(value));
  if (typeof value !== "string") return undefined;
  const match = value.trim().match(/^(\d{4})/);
  if (!match) return undefined;
  const year = Number(match[1]);
  return year >= 1800 && year <= 2100 ? match[1] : undefined;
}

function measureValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 2000) return value;
  if (typeof value !== "string" || !value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 2000 ? number : undefined;
}

function mapLabel(value: unknown) {
  const normalized = text(value, 160)?.toLowerCase() ?? "";
  if (!normalized) return undefined;
  if (normalized.includes("illegible")) return "present-illegible" as const;
  if (normalized.includes("missing")) return "missing" as const;
  if (normalized.includes("readable") || normalized === "present-readable") return "present-readable" as const;
  return oneOf(value, WETT_LABEL_STATUSES);
}

function mapManual(value: unknown) {
  const normalized = text(value, 160)?.toLowerCase() ?? "";
  if (!normalized) return undefined;
  if (normalized.includes("lookup")) return "lookup-required" as const;
  if (normalized.includes("not available") || normalized.includes("unavailable") || normalized === "not-available") return "not-available" as const;
  if (normalized.includes("not yet") || normalized.includes("found")) return "found-not-verified" as const;
  if (normalized.includes("verified")) return "verified" as const;
  return oneOf(value, WETT_MANUAL_STATUSES);
}

function mapChimney(value: unknown) {
  const normalized = text(value, 80)?.toLowerCase() ?? "";
  if (!normalized) return undefined;
  if (normalized.includes("factory")) return "factory-built" as const;
  if (normalized.includes("masonry")) return "masonry" as const;
  if (normalized.includes("unknown")) return "unknown" as const;
  return oneOf(value, WETT_CHIMNEY_TYPES);
}

function mapLiner<T extends string>(value: unknown, options: readonly T[]) {
  const normalized = text(value, 80)?.toLowerCase() ?? "";
  if (!normalized) return undefined;
  if (normalized.includes("unable")) return options.find((option) => option === "unable-to-verify");
  if (normalized.includes("stainless")) return options.find((option) => option === "stainless");
  if (normalized.includes("clay")) return options.find((option) => option === "clay");
  if (normalized.includes("other")) return options.find((option) => option === "other");
  if (normalized.includes("unknown")) return options.find((option) => option === "unknown");
  return oneOf(value, options);
}

function mapConnector(value: unknown) {
  const normalized = text(value, 80)?.toLowerCase() ?? "";
  if (!normalized) return undefined;
  if (normalized.includes("double")) return "double-wall" as const;
  if (normalized.includes("single")) return "single-wall" as const;
  if (normalized.includes("other")) return "other" as const;
  if (normalized.includes("unknown")) return "unknown" as const;
  return oneOf(value, WETT_CONNECTOR_TYPES);
}

function mapYearStatus(raw: Raw, statusKey: string, yearKey: string) {
  const explicit = oneOf(raw[statusKey], WETT_YEAR_STATUSES);
  if (explicit) return explicit;
  const legacy = text(raw.installationDateStatus, 40)?.toLowerCase();
  if (legacy === "unknown") return "unknown" as const;
  if (yearValue(raw[yearKey]) || yearValue(raw.installationDate) || legacy === "known" || legacy === "estimated") return "known" as const;
  return undefined;
}

function activeYear(raw: Raw, statusKey: string, yearKey: string) {
  const status = mapYearStatus(raw, statusKey, yearKey);
  if (status !== "known") return { status, year: undefined };
  return { status, year: yearValue(raw[yearKey]) || yearValue(raw.installationDate) || yearValue(raw.installationYear) };
}

function notes(raw: Raw) {
  return text(raw.description, 2000) || text(raw.lastMajorAlteration, 2000);
}

function compact<T extends Raw>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function listedFields(raw: Raw) {
  const year = activeYear(raw, "installationYearStatus", "installationYear");
  return {
    manufacturer: text(raw.manufacturer, 120),
    model: text(raw.model, 120),
    modelSuffix: text(raw.modelSuffix, 80),
    serial: text(raw.serial, 80),
    labelStatus: mapLabel(raw.labelStatus),
    labelRecheckConfirmed: mapLabel(raw.labelStatus) === "missing" && raw.labelRecheckConfirmed === true ? true : undefined,
    alternateIdentity: mapLabel(raw.labelStatus) === "missing" && (raw.alternateIdentity === "yes" || raw.alternateIdentity === "no") ? raw.alternateIdentity : undefined,
    alternateEvidence: mapLabel(raw.labelStatus) === "missing" ? text(raw.alternateEvidence, 240) : undefined,
    listingStatus: raw.listingStatus === "verified" || raw.listingStatus === "not-verified" || raw.listingStatus === "confirmed-unlisted" ? raw.listingStatus : undefined,
    manualStatus: mapManual(raw.manualStatus),
    installationYearStatus: year.status,
    installationYear: year.year,
    description: notes(raw),
  };
}

export function sanitizeSystem(value: unknown): WettSystem {
  const raw = rawRecord(value);
  const type = oneOf(raw.type, WETT_SYSTEM_TYPES);

  if (type === "wood-stove") {
    const chimneyType = mapChimney(raw.chimneyType);
    return wettSystemSchema.parse(
      compact({
        type,
        ...listedFields(raw),
        chimneyType,
        linerType: chimneyType === "masonry" ? mapLiner(raw.linerType, WETT_MASONRY_LINER_TYPES) : undefined,
        chimneyManufacturer: chimneyType === "factory-built" ? text(raw.chimneyManufacturer, 160) : undefined,
        chimneySeries: chimneyType === "factory-built" ? text(raw.chimneySeries, 160) : undefined,
        connectorType: mapConnector(raw.connectorType),
      }),
    );
  }

  if (type === "fireplace-insert") {
    const originalFireplaceType = mapChimney(raw.originalFireplaceType);
    const diameter = measureValue(raw.linerDiameter);
    return wettSystemSchema.parse(
      compact({
        type,
        ...listedFields(raw),
        originalFireplaceType,
        originalFireplaceManufacturer: originalFireplaceType === "factory-built" ? text(raw.originalFireplaceManufacturer, 160) : undefined,
        originalFireplaceModel: originalFireplaceType === "factory-built" ? text(raw.originalFireplaceModel, 160) : undefined,
        linerType: mapLiner(raw.linerType, WETT_INSERT_LINER_TYPES),
        linerDiameter: diameter,
        linerDiameterUnit: diameter === undefined ? undefined : oneOf(raw.linerDiameterUnit, WETT_MEASURE_UNITS) || "in",
      }),
    );
  }

  if (type === "masonry-fireplace") {
    const explicitYear = oneOf(raw.homeBuiltYearStatus, WETT_YEAR_STATUSES);
    const year = {
      status: explicitYear ?? (yearValue(raw.homeBuiltYear) ? ("known" as const) : undefined),
      year: explicitYear === "unknown" ? undefined : yearValue(raw.homeBuiltYear),
    };
    const majorAlteration = oneOf(raw.majorAlteration, WETT_ALTERATION_ANSWERS);
    return wettSystemSchema.parse(
      compact({
        type,
        description: notes(raw),
        homeBuiltYearStatus: year.status,
        homeBuiltYear: year.status === "known" ? yearValue(raw.homeBuiltYear) : undefined,
        majorAlteration,
        alterationYear: majorAlteration === "yes" ? yearValue(raw.alterationYear) : undefined,
        linerType: mapLiner(raw.linerType, WETT_MASONRY_LINER_TYPES),
      }),
    );
  }

  if (type === "factory-built-fireplace") {
    const diameter = measureValue(raw.chimneyDiameter);
    return wettSystemSchema.parse(
      compact({
        type,
        ...listedFields(raw),
        certificationListing: text(raw.certificationListing, 240) || text(raw.listingInformation, 240),
        chimneyManufacturer: text(raw.chimneyManufacturer, 160),
        chimneySeries: text(raw.chimneySeries, 160),
        chimneyDiameter: diameter,
        chimneyDiameterUnit: diameter === undefined ? undefined : oneOf(raw.chimneyDiameterUnit, WETT_MEASURE_UNITS) || "in",
      }),
    );
  }

  const description = notes(raw);
  return wettSystemSchema.parse(compact({ description }));
}

export function applianceIdentityRecorded(system: WettSystem) {
  if (system.type !== "wood-stove" && system.type !== "fireplace-insert" && system.type !== "factory-built-fireplace") {
    return true;
  }

  if (system.listingStatus === "not-verified" || system.alternateIdentity === "no") {
    return false;
  }

  if (system.labelStatus === "missing" && system.labelRecheckConfirmed !== true) {
    return false;
  }

  return Boolean(system.manufacturer || system.model || system.labelStatus || system.listingStatus === "confirmed-unlisted");
}

export function systemProfileHasData(system: unknown, checklistCount: number, measurements: object) {
  const raw = rawRecord(system);
  const measured = rawRecord(measurements);
  const identity = Object.entries(raw).some(([key, entry]) => key !== "type" && entry !== undefined && entry !== "");
  const items = Array.isArray(measured.items) ? measured.items : [];
  const hearth = rawRecord(measured.hearth);
  const legacyMeasured = Object.values(hearth).some((entry) => entry !== undefined && entry !== null && entry !== "");
  return identity || checklistCount > 0 || items.length > 0 || legacyMeasured;
}

export function switchedSystemDraft(type: WettSystemType) {
  return {
    system: sanitizeSystem({ type }),
    checklist: [],
    measurements: { items: [] },
    venting: {},
    cleaning: { locations: [] },
    recommendations: [],
    manufacturerLookups: [],
  };
}

function labelFor(value: string | undefined, labels: Record<string, string>) {
  return value ? labels[value] || value : undefined;
}

function yearLine(status: "known" | "unknown" | undefined, year: string | undefined) {
  if (status === "unknown") return "Unknown";
  if (status === "known" && year) return year;
  return undefined;
}

function diameterLine(value: number | undefined, unit: "in" | "mm" | undefined) {
  if (value === undefined) return undefined;
  return `${value} ${unit === "mm" ? "mm" : "in"}`;
}

export const LISTING_NOT_VERIFIED_NOTICE =
  "The appliance listing/certification could not be verified from the information available during the inspection. This may affect insurer acceptance. The homeowner should confirm requirements directly with their insurer.";

const LISTING_STATUS_LABELS = {
  verified: "Verified",
  "not-verified": "Not verified",
  "confirmed-unlisted": "Confirmed unlisted",
} as const;

export function identificationLines(system: WettSystem) {
  const lines: Array<{ label: string; value: string }> = [];
  const add = (label: string, value: string | undefined) => {
    if (value?.trim()) lines.push({ label, value });
  };

  if (system.type === "wood-stove") {
    add("Manufacturer", system.manufacturer);
    add("Model", system.model);
    add("Model suffix", system.modelSuffix);
    add("Serial", system.serial);
    add("Label status", labelFor(system.labelStatus, LABEL_STATUS_LABELS));
    add("Listing status", labelFor(system.listingStatus, LISTING_STATUS_LABELS));
    add("Listing note", system.listingStatus === "not-verified" ? LISTING_NOT_VERIFIED_NOTICE : undefined);
    add("Manual status", labelFor(system.manualStatus, MANUAL_STATUS_LABELS));
    add("Installation year", yearLine(system.installationYearStatus, system.installationYear));
    add("Chimney type", labelFor(system.chimneyType, CHIMNEY_TYPE_LABELS));
    add("Liner type", labelFor(system.linerType, MASONRY_LINER_LABELS));
    add("Chimney manufacturer", system.chimneyManufacturer);
    add("Chimney series / model", system.chimneySeries);
    add("Connector type", labelFor(system.connectorType, CONNECTOR_TYPE_LABELS));
  }

  if (system.type === "fireplace-insert") {
    add("Manufacturer", system.manufacturer);
    add("Model", system.model);
    add("Model suffix", system.modelSuffix);
    add("Serial", system.serial);
    add("Label status", labelFor(system.labelStatus, LABEL_STATUS_LABELS));
    add("Listing status", labelFor(system.listingStatus, LISTING_STATUS_LABELS));
    add("Listing note", system.listingStatus === "not-verified" ? LISTING_NOT_VERIFIED_NOTICE : undefined);
    add("Manual status", labelFor(system.manualStatus, MANUAL_STATUS_LABELS));
    add("Installation year", yearLine(system.installationYearStatus, system.installationYear));
    add("Original fireplace type", labelFor(system.originalFireplaceType, ORIGINAL_FIREPLACE_LABELS));
    add("Original fireplace manufacturer", system.originalFireplaceManufacturer);
    add("Original fireplace model", system.originalFireplaceModel);
    add("Liner type", labelFor(system.linerType, INSERT_LINER_LABELS));
    add("Liner diameter", diameterLine(system.linerDiameter, system.linerDiameterUnit));
  }

  if (system.type === "masonry-fireplace") {
    add("Year home was built", yearLine(system.homeBuiltYearStatus, system.homeBuiltYear));
    add("Major fireplace / chimney alteration", labelFor(system.majorAlteration, ALTERATION_LABELS));
    add("Approx. alteration year", system.majorAlteration === "yes" ? system.alterationYear : undefined);
    add("Liner type", labelFor(system.linerType, MASONRY_LINER_LABELS));
  }

  if (system.type === "factory-built-fireplace") {
    add("Manufacturer", system.manufacturer);
    add("Model", system.model);
    add("Model suffix", system.modelSuffix);
    add("Serial", system.serial);
    add("Label status", labelFor(system.labelStatus, LABEL_STATUS_LABELS));
    add("Listing status", labelFor(system.listingStatus, LISTING_STATUS_LABELS));
    add("Listing note", system.listingStatus === "not-verified" ? LISTING_NOT_VERIFIED_NOTICE : undefined);
    add("Certification / listing", system.certificationListing);
    add("Manual status", labelFor(system.manualStatus, MANUAL_STATUS_LABELS));
    add("Installation year", yearLine(system.installationYearStatus, system.installationYear));
    add("Chimney manufacturer", system.chimneyManufacturer);
    add("Chimney series / model", system.chimneySeries);
    add("Chimney diameter", diameterLine(system.chimneyDiameter, system.chimneyDiameterUnit));
  }

  add("System notes", system.description);
  return lines;
}
