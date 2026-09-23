export const MANUFACTURER_BRAND_LABELS = [
  "Napoleon",
  "Regency",
  "Pacific Energy",
  "Drolet",
  "Jøtul",
  "Vermont Castings",
  "Osburn",
  "Enviro",
  "Quadra-Fire",
] as const;

export const MANUFACTURER_LOOKUP_FIELDS = [
  "brand",
  "model",
  "suffix",
  "serial",
  "manufacturingDate",
  "certificationLabel",
  "manualTitle",
  "manualPart",
  "manualRevision",
  "effectiveDate",
  "serialApplicability",
  "officialSourceUrl",
  "lastVerified",
] as const;

export const MANUFACTURER_CLEARANCES_ENCODED = false;

export function appearanceIsNotIdentification() {
  return "MANUFACTURER LOOKUP REQUIRED";
}
