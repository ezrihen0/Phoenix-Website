export const DIAGRAMS = [
  {
    id: "masonry-exterior" as const,
    label: "Masonry / exterior chimney",
    regions: ["rain-cap", "crown", "liner-top", "masonry", "mortar", "flashing", "roof-intersection", "cleanout", "termination"],
  },
  {
    id: "fireplace-appliance" as const,
    label: "Fireplace / appliance",
    regions: ["hearth", "firebox", "damper", "smoke-chamber", "flue", "screen", "doors-glass", "mantel", "sidewall", "connector", "appliance"],
  },
  {
    id: "factory-built" as const,
    label: "Factory-built system",
    regions: ["fireplace-body", "face", "standoff", "chase", "firestop", "attic-shield", "chimney-section", "offset", "roof-support", "flashing", "storm-collar", "termination"],
  },
];

export function diagramRegions(diagramId: (typeof DIAGRAMS)[number]["id"]) {
  return DIAGRAMS.find((diagram) => diagram.id === diagramId)?.regions ?? [];
}
