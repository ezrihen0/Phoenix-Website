export type WettDefectFamily = {
  id: string;
  label: string;
  prompts: string[];
  setsClassification: false;
};

const generic = ["Location", "Observation", "Photo where safely possible"];

export const DEFECT_FAMILIES: WettDefectFamily[] = [
  { id: "cracked-chimney-crown", label: "Cracked chimney crown", setsClassification: false, prompts: ["Crack width", "Crack length/extent", "Water evidence", "Slope/drainage", "Drip projection", "Loose material", "Movement/displacement"] },
  { id: "missing-damaged-chimney-crown", label: "Missing or damaged chimney crown", setsClassification: false, prompts: generic },
  { id: "insufficient-drip-detail", label: "Insufficient drip detail", setsClassification: false, prompts: generic },
  { id: "damaged-chimney-liner", label: "Damaged chimney liner", setsClassification: false, prompts: ["Liner type", "Visible location", "Crack width", "Displacement", "Missing section", "Chimney-fire history", "Remaining liner visible"] },
  { id: "missing-chimney-liner", label: "Missing chimney liner", setsClassification: false, prompts: generic },
  { id: "damaged-firebrick-firebox-lining", label: "Damaged firebrick or firebox lining", setsClassification: false, prompts: generic },
  { id: "rust-corrosion", label: "Rust or corrosion", setsClassification: false, prompts: generic },
  { id: "connector-clearance", label: "Connector clearance", setsClassification: false, prompts: ["Measured clearance", "Source-verified requirement", "Configuration"] },
  { id: "incorrect-hearth-dimensions", label: "Hearth dimension concern", setsClassification: false, prompts: ["System type", "Exact model", "Manufacturer requirement available", "Front", "Left", "Right", "Rear if applicable", "Protection function"] },
  { id: "missing-data-label", label: "Missing data label", setsClassification: false, prompts: ["Manufacturer marking", "Model marking", "Serial", "Manual available", "Prior permit or report"] },
  { id: "unidentified-appliance", label: "Unidentified appliance", setsClassification: false, prompts: ["Manufacturer marking", "Model marking", "Serial", "Manual available", "Prior permit or report"] },
  { id: "termination-height", label: "Termination height", setsClassification: false, prompts: generic },
  { id: "deteriorated-mortar-masonry", label: "Deteriorated mortar or masonry", setsClassification: false, prompts: generic },
  { id: "chimney-movement", label: "Chimney movement", setsClassification: false, prompts: generic },
  { id: "combustible-clearance-intrusion", label: "Combustible clearance intrusion", setsClassification: false, prompts: ["Measured clearance", "Source-verified requirement"] },
  { id: "creosote-deposits", label: "Creosote or deposit buildup", setsClassification: false, prompts: ["Location", "Observed severity", "Accessible extent", "Cleaning history if reported", "Chimney-fire history"] },
  { id: "suspected-chimney-fire", label: "Suspected previous chimney fire", setsClassification: false, prompts: ["Reported history", "Visible liner access", "What remains concealed"] },
  { id: "cleanout-defect", label: "Cleanout defect", setsClassification: false, prompts: generic },
  { id: "damaged-factory-built-chimney", label: "Damaged factory-built chimney", setsClassification: false, prompts: generic },
  { id: "mixed-incompatible-chimney-components", label: "Mixed or unknown listed components", setsClassification: false, prompts: ["Observed brands", "Labels found", "Compatibility established"] },
  { id: "insert-liner-connection", label: "Insert liner connection", setsClassification: false, prompts: ["Connection visible", "Reason if hidden"] },
  { id: "inaccessible-attic", label: "Inaccessible attic", setsClassification: false, prompts: ["Hatch exists", "Access attempted", "Reason not accessed", "Components that may exist there"] },
  { id: "concealed-chimney-section", label: "Concealed chimney section", setsClassification: false, prompts: ["What is concealed", "Why access was not available"] },
  { id: "thimble-wall-pass-through", label: "Thimble or wall pass-through", setsClassification: false, prompts: generic },
  { id: "water-penetration", label: "Water penetration", setsClassification: false, prompts: generic },
  { id: "flashing-defect", label: "Flashing defect", setsClassification: false, prompts: generic },
  { id: "termination-cap-defect", label: "Termination cap defect", setsClassification: false, prompts: generic },
  { id: "unsupported-component", label: "Unsupported component", setsClassification: false, prompts: generic },
];

export function defectFamily(id: string) {
  return DEFECT_FAMILIES.find((family) => family.id === id);
}

export function defectPrompts(id: string) {
  return defectFamily(id)?.prompts ?? [];
}
