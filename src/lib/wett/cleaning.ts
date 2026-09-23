import { z } from "zod";

import type { WettSystemType } from "./system-profile";

export const CLEANING_ITEM_ID = "cleaning-deposits";

export const WETT_DEPOSIT_LEVELS = ["none", "light", "moderate", "heavy", "glazed", "unable-to-assess"] as const;
export const WETT_CLEANING_ASSESSMENTS = ["no-cleaning-indicated", "cleaning-recommended", "cleaning-required"] as const;
export const WETT_LAST_CLEANING = ["yes", "no", "unknown"] as const;
export const WETT_DEPOSIT_CONDITIONS = ["soot", "flaky", "glazed-creosote", "heavy-accumulation", "blockage", "rapid", "other"] as const;
export const WETT_CLEANING_ACCESS = ["concealed", "inaccessible", "unsafe", "beyond-inspection-level", "other"] as const;

export const DEPOSIT_LEVEL_LABELS: Record<(typeof WETT_DEPOSIT_LEVELS)[number], string> = {
  none: "None",
  light: "Light",
  moderate: "Moderate",
  heavy: "Heavy",
  glazed: "Glazed / Concerning",
  "unable-to-assess": "Unable to Assess",
};

export const CLEANING_ASSESSMENT_LABELS: Record<(typeof WETT_CLEANING_ASSESSMENTS)[number], string> = {
  "no-cleaning-indicated": "No Cleaning Indicated",
  "cleaning-recommended": "Cleaning Recommended",
  "cleaning-required": "Cleaning Required Before Continued Use",
};

export const DEPOSIT_CONDITION_LABELS: Record<(typeof WETT_DEPOSIT_CONDITIONS)[number], string> = {
  soot: "Soot",
  flaky: "Flaky deposits",
  "glazed-creosote": "Glazed creosote",
  "heavy-accumulation": "Heavy combustible-deposit accumulation",
  blockage: "Blockage",
  rapid: "Rapid recurring accumulation",
  other: "Other observed deposit condition",
};

export const CLEANING_RECOMMENDED_TEXT = "Professional cleaning/sweeping is recommended.";
export const CLEANING_REQUIRED_TEXT = "Cleaning is recommended before continued use due to the observed combustible-deposit condition.";
export const CLEANING_TECHNICAL_BASIS =
  "Alberta Fire Code: chimneys, flues, and flue pipes are cleaned as often as necessary to keep them free from dangerous accumulations of combustible deposits. Inspection for dangerous conditions is a separate interval.";

const optionalText = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, max) : undefined;
  }, z.string().max(max).optional());

export const cleaningLocationSchema = z
  .object({
    id: z.string().min(1).max(80),
    deposits: z.enum(WETT_DEPOSIT_LEVELS).optional(),
    utiReason: z.enum(WETT_CLEANING_ACCESS).optional(),
  })
  .strict();

export const cleaningSchema = z
  .object({
    deposits: z.enum(WETT_DEPOSIT_LEVELS).optional(),
    assessment: z.enum(WETT_CLEANING_ASSESSMENTS).optional(),
    lastCleaningKnown: z.enum(WETT_LAST_CLEANING).optional(),
    lastCleaningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    conditions: z.array(z.enum(WETT_DEPOSIT_CONDITIONS)).max(8).optional(),
    observation: optionalText(4000),
    observationRaw: optionalText(4000),
    observationCandidate: optionalText(4000),
    acceptedFinalText: optionalText(4000),
    locations: z.array(cleaningLocationSchema).max(8),
  })
  .strict();

export type CleaningRecord = z.infer<typeof cleaningSchema>;
export type CleaningLocation = z.infer<typeof cleaningLocationSchema>;

export const CLEANING_LOCATIONS: Record<WettSystemType, Array<{ id: string; label: string }>> = {
  "wood-stove": [
    { id: "appliance", label: "Appliance / firebox" },
    { id: "connector", label: "Flue pipe / connector" },
    { id: "chimney", label: "Chimney / flue" },
  ],
  "fireplace-insert": [
    { id: "appliance", label: "Insert / firebox" },
    { id: "liner", label: "Liner" },
    { id: "liner-connection", label: "Liner connection" },
    { id: "termination", label: "Termination / accessible chimney" },
  ],
  "masonry-fireplace": [
    { id: "firebox", label: "Firebox" },
    { id: "smoke-chamber", label: "Smoke chamber" },
    { id: "flue", label: "Flue / liner" },
    { id: "chimney", label: "Accessible chimney" },
  ],
  "factory-built-fireplace": [
    { id: "firebox", label: "Firebox / refractory" },
    { id: "pipe", label: "Factory-built chimney / pipe" },
    { id: "termination", label: "Accessible termination" },
  ],
};

export function cleaningLocationsFor(type: WettSystemType | undefined) {
  return type ? CLEANING_LOCATIONS[type] : [];
}

export function cleaningEvidenceOpen(cleaning: Pick<CleaningRecord, "deposits" | "assessment">) {
  return cleaning.deposits === "heavy" || cleaning.deposits === "glazed" || cleaning.assessment === "cleaning-recommended" || cleaning.assessment === "cleaning-required";
}

export function cleaningPhotoEncouraged(cleaning: Pick<CleaningRecord, "deposits" | "assessment">) {
  return cleaning.deposits === "heavy" || cleaning.deposits === "glazed" || cleaning.assessment === "cleaning-required";
}

/** Elapsed time since the last cleaning does not set a cleaning requirement. */
export function cleaningRequiredFromLastCleaningDate(_date: string | undefined) {
  return false;
}

export function cleaningRecommendationCopy(assessment: CleaningRecord["assessment"]) {
  if (assessment === "cleaning-required") {
    return { text: CLEANING_REQUIRED_TEXT, priority: "before-continued-use" as const };
  }
  if (assessment === "cleaning-recommended") {
    return { text: CLEANING_RECOMMENDED_TEXT, priority: "routine" as const };
  }
  return undefined;
}

export function cleaningReportVisible(cleaning: CleaningRecord) {
  if (cleaning.assessment === "cleaning-recommended" || cleaning.assessment === "cleaning-required") return true;
  if (cleaning.observation?.trim() || cleaning.acceptedFinalText?.trim()) return true;
  if (cleaning.deposits === "unable-to-assess") return true;
  if (cleaning.locations.some((location) => location.utiReason)) return true;
  return false;
}

type Raw = Record<string, unknown>;

function rawRecord(value: unknown): Raw {
  return value && typeof value === "object" ? { ...(value as Raw) } : {};
}

export function sanitizeCleaning(type: WettSystemType | undefined, value: unknown): CleaningRecord {
  const raw = rawRecord(value);
  const allowed = new Set(cleaningLocationsFor(type).map((location) => location.id));
  const locations = (Array.isArray(raw.locations) ? raw.locations : []).flatMap((entry) => {
    const location = rawRecord(entry);
    const id = typeof location.id === "string" ? location.id : "";
    if (!allowed.has(id)) return [];
    return [{
      id,
      deposits: WETT_DEPOSIT_LEVELS.includes(location.deposits as (typeof WETT_DEPOSIT_LEVELS)[number]) ? location.deposits : undefined,
      utiReason: WETT_CLEANING_ACCESS.includes(location.utiReason as (typeof WETT_CLEANING_ACCESS)[number]) ? location.utiReason : undefined,
    }];
  });
  const known = raw.lastCleaningKnown === "yes" || raw.lastCleaningKnown === "no" || raw.lastCleaningKnown === "unknown" ? raw.lastCleaningKnown : undefined;
  const conditions = Array.isArray(raw.conditions)
    ? raw.conditions.filter((entry): entry is (typeof WETT_DEPOSIT_CONDITIONS)[number] => WETT_DEPOSIT_CONDITIONS.includes(entry as (typeof WETT_DEPOSIT_CONDITIONS)[number]))
    : undefined;

  return cleaningSchema.parse({
    deposits: WETT_DEPOSIT_LEVELS.includes(raw.deposits as (typeof WETT_DEPOSIT_LEVELS)[number]) ? raw.deposits : undefined,
    assessment: WETT_CLEANING_ASSESSMENTS.includes(raw.assessment as (typeof WETT_CLEANING_ASSESSMENTS)[number]) ? raw.assessment : undefined,
    lastCleaningKnown: known,
    lastCleaningDate: known === "yes" && typeof raw.lastCleaningDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.lastCleaningDate) ? raw.lastCleaningDate : undefined,
    conditions,
    observation: raw.observation,
    observationRaw: raw.observationRaw,
    observationCandidate: raw.observationCandidate,
    acceptedFinalText: raw.acceptedFinalText,
    locations: locations.flatMap((location) => {
      try {
        return [cleaningLocationSchema.parse(location)];
      } catch {
        return [];
      }
    }),
  });
}
