import { WETT_EVIDENCE_TYPES, type WettEvidenceType } from "../schema";

export const PHOENIX_EVIDENCE_LABEL = "Phoenix Evidence Photo";

export const EVIDENCE_TYPE_LABELS: Record<WettEvidenceType, string> = {
  overview: "Overview",
  "identification-label": "Identification label",
  measurement: "Measurement",
  component: "Component",
  deficiency: "Deficiency",
  "access-limitation": "Access limitation",
  "manufacturer-label": "Manufacturer label",
  "chimney-exterior": "Chimney exterior",
  termination: "Termination",
  hearth: "Hearth",
  other: "Other",
};

export const PHOENIX_EVIDENCE_TYPES = WETT_EVIDENCE_TYPES;

export const OFFICIAL_WETT_PHOTO_SOP_AVAILABLE = false;
