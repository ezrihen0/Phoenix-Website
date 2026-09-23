import { z } from "zod";

import {
  measurementDefinition,
  measurementDefinitions,
  type MeasurementDefinition,
  type MeasurementSourceBehavior,
} from "@/lib/wett/knowledge/measurement-profiles";
import type { WettSystem } from "@/lib/wett/system-profile";

export const WETT_MEASUREMENT_UNITS = ["in", "mm", "ft", "cm"] as const;
export const WETT_MEASUREMENT_STATUSES = ["compliant", "not-compliant", "not-applicable", "unable-to-inspect"] as const;
export const WETT_MEASUREMENT_SOURCES = [
  "manufacturer-manual",
  "listing",
  "b365",
  "listed-connector",
  "alberta-code",
  "chimney-manual",
  "historic-not-applied",
  "other-verified",
  "not-verified",
] as const;
export const WETT_PROTECTION_TYPES = ["ember", "thermal", "both", "unknown"] as const;
export const WETT_MASONRY_SCREEN_TYPES = ["mesh-screen", "spark-screen", "curtain", "glass-door", "other"] as const;
export const WETT_FACTORY_SCREEN_TYPES = ["mesh-screen", "curtain", "factory-doors", "glass-doors", "other"] as const;
export const WETT_COMPONENT_CONDITIONS = ["good", "damaged", "incomplete", "modified", "unknown"] as const;
export const WETT_MANTEL_MATERIALS = ["combustible", "non-combustible", "unknown"] as const;
export const WETT_PRESENT_ANSWERS = ["yes", "no", "na"] as const;
export const WETT_LISTED_ANSWERS = ["yes", "no", "unknown"] as const;
export const WETT_OBSERVABLE_ANSWERS = ["yes", "no", "partial"] as const;
export const WETT_HISTORICAL_APPLICABILITY = ["unresolved", "current-provision", "historic-not-applied"] as const;

/**
 * Legacy generic hearth keys. Thickness is not copied into a system profile.
 * Extension and photo keys map onto the active system's hearth items when the ids exist.
 */
export const LEGACY_MEASUREMENT_FIELDS = [
  "frontExtensionInches",
  "leftExtensionInches",
  "rightExtensionInches",
  "rearExtensionInches",
  "sideExtensionInches",
  "thicknessInches",
  "frontPhotoId",
  "leftPhotoId",
  "rightPhotoId",
  "rearPhotoId",
  "conditionNotes",
  "sourceVerifiedRequirement",
] as const;

export const MEASUREMENT_SOURCE_LABELS: Record<(typeof WETT_MEASUREMENT_SOURCES)[number], string> = {
  "manufacturer-manual": "Manufacturer Manual",
  listing: "Listing / Label",
  b365: "CSA B365-17",
  "listed-connector": "Listed Connector Manual",
  "alberta-code": "Alberta Building Code",
  "chimney-manual": "Chimney Manufacturer Manual",
  "historic-not-applied": "Historical installation — requirement not applied",
  "other-verified": "Other verified source",
  "not-verified": "Not verified",
};

export const MEASUREMENT_STATUS_LABELS: Record<(typeof WETT_MEASUREMENT_STATUSES)[number], string> = {
  compliant: "Compliant",
  "not-compliant": "Not Compliant",
  "not-applicable": "N/A",
  "unable-to-inspect": "UTI",
};

export const PROTECTION_TYPE_LABELS: Record<(typeof WETT_PROTECTION_TYPES)[number], string> = {
  ember: "Ember",
  thermal: "Thermal",
  both: "Both",
  unknown: "Unknown",
};

export const MASONRY_SCREEN_LABELS: Record<(typeof WETT_MASONRY_SCREEN_TYPES)[number], string> = {
  "mesh-screen": "Mesh Screen",
  "spark-screen": "Spark Screen",
  curtain: "Curtain",
  "glass-door": "Glass / Door System",
  other: "Other",
};

export const FACTORY_SCREEN_LABELS: Record<(typeof WETT_FACTORY_SCREEN_TYPES)[number], string> = {
  "mesh-screen": "Mesh Screen",
  curtain: "Curtain",
  "factory-doors": "Factory Doors",
  "glass-doors": "Glass Doors",
  other: "Other",
};

export const MANTEL_MATERIAL_LABELS: Record<(typeof WETT_MANTEL_MATERIALS)[number], string> = {
  combustible: "Combustible",
  "non-combustible": "Non-Combustible",
  unknown: "Unknown",
};

export const COMPONENT_CONDITION_LABELS: Record<(typeof WETT_COMPONENT_CONDITIONS)[number], string> = {
  good: "Good",
  damaged: "Damaged",
  incomplete: "Incomplete",
  modified: "Modified",
  unknown: "Unknown",
};

const SOURCE_OPTIONS: Record<MeasurementSourceBehavior, Array<(typeof WETT_MEASUREMENT_SOURCES)[number]>> = {
  manufacturer: ["manufacturer-manual", "listing", "not-verified"],
  "alberta-code": ["alberta-code", "historic-not-applied", "other-verified"],
  b365: ["b365"],
  "chimney-manufacturer": ["chimney-manual", "not-verified"],
  "manual-or-code": ["manufacturer-manual", "b365", "listed-connector", "alberta-code"],
  "observation-only": ["other-verified", "not-verified"],
};

const optionalText = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, max) : undefined;
  }, z.string().max(max).optional());

const optionalMeasure = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 100000 ? number : undefined;
}, z.number().finite().min(0).max(100000).optional());

export const measurementItemSchema = z
  .object({
    id: z.string().min(1).max(80),
    observed: optionalMeasure,
    unit: z.enum(WETT_MEASUREMENT_UNITS).optional(),
    required: optionalMeasure,
    requiredUnit: z.enum(WETT_MEASUREMENT_UNITS).optional(),
    source: z.enum(WETT_MEASUREMENT_SOURCES).optional(),
    sourceReference: optionalText(240),
    sourceVerified: z.boolean().optional(),
    referencePoint: optionalText(160),
    photoId: z.string().uuid().optional(),
    status: z.enum(WETT_MEASUREMENT_STATUSES).optional(),
    note: optionalText(1000),
    present: z.enum(WETT_PRESENT_ANSWERS).optional(),
    componentType: z.string().max(40).optional(),
    condition: z.enum(WETT_COMPONENT_CONDITIONS).optional(),
    listedComponent: z.enum(WETT_LISTED_ANSWERS).optional(),
    observable: z.enum(WETT_OBSERVABLE_ANSWERS).optional(),
    visibleCondition: optionalText(500),
    damage: optionalText(500),
    historicalApplicability: z.enum(WETT_HISTORICAL_APPLICABILITY).optional(),
    applies: z.boolean().optional(),
  })
  .strict();

export const measurementsSchema = z
  .object({
    items: z.array(measurementItemSchema).max(80),
  })
  .strict();

export type MeasurementItem = z.infer<typeof measurementItemSchema>;
export type WettMeasurements = z.infer<typeof measurementsSchema>;

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
  const normalized = text(value, 80);
  return options.find((option) => option === normalized);
}

function measure(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100000) return value;
  if (typeof value !== "string" || !value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 100000 ? number : undefined;
}

function uuid(value: unknown) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) ? value : undefined;
}

function compact<T extends Raw>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== false)) as T;
}

export function sourceOptionsFor(behavior: MeasurementSourceBehavior) {
  return SOURCE_OPTIONS[behavior];
}

export function optionLabels(set: MeasurementDefinition["optionSet"]) {
  if (set === "protection") return PROTECTION_TYPE_LABELS;
  if (set === "masonry-screen") return MASONRY_SCREEN_LABELS;
  if (set === "factory-screen") return FACTORY_SCREEN_LABELS;
  if (set === "mantel-material") return MANTEL_MATERIAL_LABELS;
  return COMPONENT_CONDITION_LABELS;
}

function branchActive(definition: MeasurementDefinition, system: WettSystem) {
  if (definition.conditional === "wood-chimney-masonry") return system.type === "wood-stove" && system.chimneyType === "masonry";
  if (definition.conditional === "wood-chimney-factory") return system.type === "wood-stove" && system.chimneyType === "factory-built";
  if (definition.conditional === "insert-original-masonry") return system.type === "fireplace-insert" && system.originalFireplaceType === "masonry";
  if (definition.conditional === "insert-original-factory") return system.type === "fireplace-insert" && system.originalFireplaceType === "factory-built";
  return true;
}

function parentItem(items: MeasurementItem[], definition: MeasurementDefinition) {
  return definition.dependsOn ? items.find((item) => item.id === definition.dependsOn) : undefined;
}

export function measurementIsActive(definition: MeasurementDefinition, system: WettSystem, items: MeasurementItem[]) {
  if (!branchActive(definition, system)) return false;
  if (definition.conditional === "when-applies") return items.some((item) => item.id === definition.id && item.applies === true);
  if (definition.conditional === "when-thermal") {
    const parent = parentItem(items, definition);
    return parent?.componentType === "thermal" || parent?.componentType === "both";
  }
  if (definition.conditional === "when-observable") {
    const parent = parentItem(items, definition);
    return parent?.observable === "yes" || parent?.observable === "partial";
  }
  if (definition.conditional === "when-mantel-present") return parentItem(items, definition)?.present === "yes";
  if (definition.conditional === "when-mantel-combustible") return parentItem(items, definition)?.componentType === "combustible";
  return true;
}

function defaultUnit(system: WettSystem): MeasurementItem["unit"] {
  return system.type === "masonry-fireplace" ? "mm" : "in";
}

function allowsDetail(definition: MeasurementDefinition, item: MeasurementItem, field: "type" | "condition" | "listed") {
  const fields = definition.fields || [];
  if (field === "type" && !fields.includes("type")) return false;
  if (field === "condition" && !fields.includes("condition")) return false;
  if (field === "listed" && !fields.includes("listed")) return false;
  if (fields.includes("present") && item.present !== "yes") return false;
  return true;
}

function allowedComponentType(definition: MeasurementDefinition, value: string | undefined) {
  if (!value) return undefined;
  const labels = optionLabels(definition.optionSet);
  return value in labels ? value : undefined;
}

function cleanItem(definition: MeasurementDefinition, item: MeasurementItem, system: WettSystem): MeasurementItem | undefined {
  const observable = item.observable === "yes" || item.observable === "partial";
  const unit = item.observed === undefined ? undefined : item.unit || defaultUnit(system);
  const requiredUnit = item.required === undefined ? undefined : item.requiredUnit || unit || defaultUnit(system);
  const cleaned = compact({
    id: definition.id,
    observed: item.observed,
    unit,
    required: definition.kind === "measurement" ? item.required : undefined,
    requiredUnit: definition.kind === "measurement" ? requiredUnit : undefined,
    source: item.source,
    sourceReference: item.sourceReference,
    sourceVerified: item.sourceVerified === true ? true : undefined,
    referencePoint: item.referencePoint,
    photoId: item.photoId,
    status: item.status,
    note: item.note,
    present: item.present,
    componentType: allowsDetail(definition, item, "type") ? allowedComponentType(definition, item.componentType) : undefined,
    condition: allowsDetail(definition, item, "condition") ? item.condition : undefined,
    listedComponent: allowsDetail(definition, item, "listed") ? item.listedComponent : undefined,
    observable: item.observable,
    visibleCondition: !definition.fields?.includes("observable") || observable ? item.visibleCondition : undefined,
    damage: !definition.fields?.includes("observable") || observable ? item.damage : undefined,
    historicalApplicability: definition.historical ? item.historicalApplicability : undefined,
    applies: definition.conditional === "when-applies" ? true : undefined,
  });

  const hasContent = Object.entries(cleaned).some(([key, value]) => key !== "id" && key !== "applies" && value !== undefined);
  if (!hasContent && definition.conditional !== "when-applies") return undefined;
  if (definition.conditional === "when-applies" && item.applies !== true && !hasContent) return undefined;
  return measurementItemSchema.parse(cleaned);
}

const LEGACY_OBSERVED: Record<string, string> = {
  frontExtensionInches: "hearth-front",
  leftExtensionInches: "hearth-left",
  sideExtensionInches: "hearth-left",
  rightExtensionInches: "hearth-right",
  rearExtensionInches: "hearth-rear",
};

const LEGACY_PHOTOS: Record<string, string> = {
  frontPhotoId: "hearth-front",
  leftPhotoId: "hearth-left",
  rightPhotoId: "hearth-right",
  rearPhotoId: "hearth-rear",
};

function legacyItems(system: WettSystem, measurements: Raw) {
  const hearth = rawRecord(measurements.hearth);
  const byId = new Map<string, Raw>();
  const definitions = measurementDefinitions(system.type);

  function target(suffix: string) {
    return definitions.find((definition) => definition.id.endsWith(suffix));
  }

  for (const [key, suffix] of Object.entries(LEGACY_OBSERVED)) {
    const definition = target(suffix);
    const observed = measure(hearth[key]);
    if (!definition || observed === undefined || byId.has(definition.id)) continue;
    byId.set(definition.id, { id: definition.id, observed, unit: "in", applies: definition.conditional === "when-applies" ? true : undefined });
  }

  for (const [key, suffix] of Object.entries(LEGACY_PHOTOS)) {
    const definition = target(suffix);
    const photoId = uuid(hearth[key]);
    if (!definition || !photoId) continue;
    byId.set(definition.id, { ...byId.get(definition.id), id: definition.id, photoId, applies: definition.conditional === "when-applies" ? true : undefined });
  }

  const sourceReference = text(hearth.sourceVerifiedRequirement, 240);
  const note = text(hearth.conditionNotes, 1000);
  if (sourceReference) {
    for (const [id, item] of byId) {
      byId.set(id, { ...item, sourceReference, sourceVerified: true, source: "other-verified" });
    }
  }
  const front = definitions.find((definition) => definition.id.endsWith("hearth-front"));
  if (front && note) {
    byId.set(front.id, { ...byId.get(front.id), id: front.id, note });
  }

  return [...byId.values()];
}

export function sanitizeMeasurements(system: WettSystem, measurements: unknown): WettMeasurements {
  const raw = rawRecord(measurements);
  const incoming = [...legacyItems(system, raw), ...(Array.isArray(raw.items) ? raw.items : [])];
  const merged = new Map<string, Raw>();
  for (const entry of incoming) {
    const item = rawRecord(entry);
    const id = text(item.id, 80);
    if (id) merged.set(id, { ...merged.get(id), ...item, id });
  }

  const preliminary = [...merged.values()].map((item) => measurementItemSchema.parse(normalizeDraft(item)));
  const active = measurementDefinitions(system.type).flatMap((definition) => {
    if (!branchActive(definition, system)) return [];
    const stored = preliminary.find((item) => item.id === definition.id);
    if (!stored) return [];
    if (definition.conditional === "when-applies" && stored.applies !== true && !hasMeasurementContent(stored)) return [];
    if (definition.conditional === "when-thermal" || definition.conditional === "when-observable" || definition.conditional === "when-mantel-present" || definition.conditional === "when-mantel-combustible") {
      const withParent = measurementIsActive(definition, system, preliminary);
      if (!withParent) return [];
    }
    const cleaned = cleanItem(definition, stored, system);
    return cleaned ? [cleaned] : [];
  });

  return measurementsSchema.parse({ items: active });
}

function normalizeDraft(item: Raw): Raw {
  return compact({
    id: text(item.id, 80),
    observed: measure(item.observed),
    unit: oneOf(item.unit, WETT_MEASUREMENT_UNITS),
    required: measure(item.required),
    requiredUnit: oneOf(item.requiredUnit, WETT_MEASUREMENT_UNITS),
    source: oneOf(item.source, WETT_MEASUREMENT_SOURCES),
    sourceReference: text(item.sourceReference, 240),
    sourceVerified: item.sourceVerified === true ? true : undefined,
    referencePoint: text(item.referencePoint, 160),
    photoId: uuid(item.photoId),
    status: oneOf(item.status, WETT_MEASUREMENT_STATUSES),
    note: text(item.note, 1000),
    present: oneOf(item.present, WETT_PRESENT_ANSWERS),
    componentType: text(item.componentType, 40),
    condition: oneOf(item.condition, WETT_COMPONENT_CONDITIONS),
    listedComponent: oneOf(item.listedComponent, WETT_LISTED_ANSWERS),
    observable: oneOf(item.observable, WETT_OBSERVABLE_ANSWERS),
    visibleCondition: text(item.visibleCondition, 500),
    damage: text(item.damage, 500),
    historicalApplicability: oneOf(item.historicalApplicability, WETT_HISTORICAL_APPLICABILITY),
    applies: item.applies === true ? true : undefined,
  });
}

function hasMeasurementContent(item: MeasurementItem) {
  return Boolean(
    item.observed !== undefined ||
      item.required !== undefined ||
      item.source ||
      item.sourceReference ||
      item.photoId ||
      item.status ||
      item.note ||
      item.present ||
      item.componentType ||
      item.condition ||
      item.observable ||
      item.visibleCondition ||
      item.damage,
  );
}

export function measurementsHaveData(measurements: unknown) {
  const raw = rawRecord(measurements);
  const items = Array.isArray(raw.items) ? raw.items : [];
  if (items.some((item) => hasMeasurementContent(normalizeDraft(rawRecord(item)) as MeasurementItem))) return true;
  const hearth = rawRecord(raw.hearth);
  return LEGACY_MEASUREMENT_FIELDS.some((key) => {
    const value = hearth[key];
    return value !== undefined && value !== null && value !== "";
  });
}

export function measurementClassificationIssue(system: WettSystem, item: MeasurementItem) {
  const definition = measurementDefinition(system.type, item.id);
  if (!definition || !item.status || item.status === "not-applicable") return undefined;
  if (item.status === "unable-to-inspect") {
    return item.note?.trim() ? undefined : `${definition.label} needs a note of what was not verified before UTI.`;
  }

  const classified = item.status === "compliant" || item.status === "not-compliant";
  if (!classified) return undefined;

  if (definition.sourceBehavior === "observation-only") {
    return item.sourceVerified === true && item.sourceReference?.trim()
      ? undefined
      : `${definition.label} needs a verified requirement before Compliant or Not Compliant. Presence alone does not set that status.`;
  }

  if (definition.kind === "check") {
    return item.sourceVerified === true && item.source && item.source !== "not-verified" && item.sourceReference?.trim()
      ? undefined
      : `${definition.label} needs a verified manufacturer or listing source before Compliant or Not Compliant.`;
  }

  if (definition.historical && item.historicalApplicability !== "current-provision" && item.historicalApplicability !== "historic-not-applied") {
    return `${definition.label} needs historical applicability resolved before Compliant or Not Compliant.`;
  }

  if (item.observed === undefined || item.required === undefined || item.sourceVerified !== true || !item.source || item.source === "not-verified" || !item.sourceReference?.trim()) {
    return `${definition.label} needs an observed value, a required value, and a verified source before Compliant or Not Compliant.`;
  }

  return undefined;
}

export function measurementComparison(item: MeasurementItem) {
  if (item.observed === undefined || item.required === undefined || item.sourceVerified !== true) return undefined;
  if (item.unit && item.requiredUnit && item.unit !== item.requiredUnit) return undefined;
  if (item.observed < item.required) {
    return "Clearance deficiency detected. The recorded combustible clearance is below the verified applicable requirement. Confirm the measurement and source before classifying the item.";
  }
  return "Observed meets the recorded requirement. The status stays with the inspector.";
}

function amount(value: number | undefined, unit: MeasurementItem["unit"]) {
  if (value === undefined) return undefined;
  return `${value} ${unit || ""}`.trim();
}

function typeLabel(definition: MeasurementDefinition, value: string | undefined) {
  if (!value) return undefined;
  const labels = optionLabels(definition.optionSet);
  return labels[value as keyof typeof labels] || value;
}

export function measurementOutputLines(system: WettSystem, items: MeasurementItem[]) {
  const lines: Array<{ id: string; label: string; value: string }> = [];

  for (const definition of measurementDefinitions(system.type)) {
    if (!measurementIsActive(definition, system, items)) continue;
    const item = items.find((entry) => entry.id === definition.id);
    if (!item) continue;
    const parts: string[] = [];

    if (definition.kind === "measurement") {
      const observed = amount(item.observed, item.unit);
      const required = amount(item.required, item.requiredUnit);
      if (observed) parts.push(`Observed: ${observed}`);
      if (required) parts.push(`Required: ${required}`);
      if (item.source) parts.push(`Source: ${MEASUREMENT_SOURCE_LABELS[item.source]}`);
      if (item.sourceReference) parts.push(`Reference: ${item.sourceReference}`);
      if (item.referencePoint) parts.push(`Reference point: ${item.referencePoint}`);
    } else {
      if (item.present) parts.push(`Present: ${item.present === "na" ? "N/A" : item.present === "yes" ? "Yes" : "No"}`);
      const selected = typeLabel(definition, item.componentType);
      if (selected) parts.push(`Type: ${selected}`);
      if (item.condition) parts.push(`Condition: ${COMPONENT_CONDITION_LABELS[item.condition]}`);
      if (item.listedComponent) parts.push(`Appears original / listed: ${item.listedComponent === "yes" ? "Yes" : item.listedComponent === "no" ? "No" : "Unknown"}`);
      if (item.observable) parts.push(`Observable: ${item.observable === "yes" ? "Yes" : item.observable === "partial" ? "Partial" : "No"}`);
      if (item.visibleCondition) parts.push(item.visibleCondition);
      if (item.damage) parts.push(`Damage / cracking: ${item.damage}`);
      if (item.note) parts.push(item.note);
    }

    if (item.status) parts.push(`Status: ${MEASUREMENT_STATUS_LABELS[item.status]}`);
    if (parts.length === 0) continue;
    lines.push({ id: definition.id, label: definition.label, value: parts.join("\n") });
  }

  return lines;
}
