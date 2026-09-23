import type { WettSystemType } from "../system-profile";

export const MEASUREMENT_SOURCE_BEHAVIORS = [
  "manufacturer",
  "alberta-code",
  "b365",
  "chimney-manufacturer",
  "manual-or-code",
  "observation-only",
] as const;

export type MeasurementSourceBehavior = (typeof MEASUREMENT_SOURCE_BEHAVIORS)[number];

export const MEASUREMENT_CONDITIONALS = [
  "always",
  "wood-chimney-masonry",
  "wood-chimney-factory",
  "insert-original-masonry",
  "insert-original-factory",
  "when-applies",
  "when-thermal",
  "when-observable",
  "when-mantel-present",
  "when-mantel-combustible",
] as const;

export type MeasurementConditional = (typeof MEASUREMENT_CONDITIONALS)[number];

export const MEASUREMENT_OPTION_SETS = ["protection", "masonry-screen", "factory-screen", "condition", "mantel-material"] as const;

export type MeasurementOptionSet = (typeof MEASUREMENT_OPTION_SETS)[number];

export type MeasurementDefinition = {
  id: string;
  label: string;
  kind: "measurement" | "check";
  sourceBehavior: MeasurementSourceBehavior;
  conditional: MeasurementConditional;
  dependsOn?: string;
  historical?: boolean;
  optionSet?: MeasurementOptionSet;
  fields?: Array<"present" | "type" | "condition" | "listed" | "observable" | "visibleCondition" | "damage" | "note">;
  hint?: string;
};

export type MeasurementGroupDefinition = {
  id: string;
  label: string;
  hint?: string;
  items: MeasurementDefinition[];
};

export type MeasurementProfile = {
  type: WettSystemType;
  groups: MeasurementGroupDefinition[];
};

const clearance = (id: string, label: string, conditional: MeasurementConditional = "always"): MeasurementDefinition => ({
  id,
  label,
  kind: "measurement",
  sourceBehavior: "manufacturer",
  conditional,
});

const codeMeasure = (id: string, label: string, conditional: MeasurementConditional = "always"): MeasurementDefinition => ({
  id,
  label,
  kind: "measurement",
  sourceBehavior: "alberta-code",
  conditional,
  historical: true,
});

const MANTEL_CLEARANCE_HINT = "Use the verified source for this exact installation. Do not calculate a clearance from mantel depth or projection.";

function mantelPresent(id: string): MeasurementDefinition {
  return check(id, "Mantel present", "observation-only", ["present"]);
}

function mantelMaterial(id: string, dependsOn: string): MeasurementDefinition {
  return check(id, "Mantel material", "observation-only", ["type"], {
    conditional: "when-mantel-present",
    dependsOn,
    optionSet: "mantel-material",
    hint: "Non-combustible material does not open a combustible-clearance comparison. Unknown material has to be resolved before a clearance conclusion.",
  });
}

function mantelClearance(id: string, label: string, dependsOn: string, sourceBehavior: MeasurementSourceBehavior, historical = false): MeasurementDefinition {
  return {
    id,
    label,
    kind: "measurement",
    sourceBehavior,
    conditional: "when-mantel-combustible",
    dependsOn,
    historical,
    hint: MANTEL_CLEARANCE_HINT,
  };
}

function check(
  id: string,
  label: string,
  sourceBehavior: MeasurementSourceBehavior,
  fields: MeasurementDefinition["fields"],
  extra: Partial<MeasurementDefinition> = {},
): MeasurementDefinition {
  return { id, label, kind: "check", sourceBehavior, conditional: "always", fields, ...extra };
}

export const MEASUREMENT_PROFILES: MeasurementProfile[] = [
  {
    type: "wood-stove",
    groups: [
      {
        id: "appliance-clearances",
        label: "Appliance Clearances",
        hint: "Record the observed clearance and the required clearance from the exact manual or other verified source. Leave a clearance off this installation when that configuration does not use it.",
        items: [
          clearance("ws-clearance-left", "Left side clearance"),
          clearance("ws-clearance-right", "Right side clearance"),
          clearance("ws-clearance-rear", "Rear clearance"),
          clearance("ws-clearance-corner", "Corner clearance", "when-applies"),
          clearance("ws-clearance-ceiling", "Ceiling clearance", "when-applies"),
          clearance("ws-clearance-alcove", "Alcove clearance", "when-applies"),
        ],
      },
      {
        id: "hearth",
        label: "Hearth",
        hint: "Hearth and floor protection follow the manufacturer and the actual configuration. Tile or a noncombustible appearance is not proof of thermal protection.",
        items: [
          clearance("ws-hearth-front", "Front extension"),
          clearance("ws-hearth-left", "Left extension"),
          clearance("ws-hearth-right", "Right extension"),
          clearance("ws-hearth-rear", "Rear extension", "when-applies"),
          check("ws-protection-type", "Protection type", "manufacturer", ["type"], { optionSet: "protection" }),
          {
            id: "ws-r-value",
            label: "Required R-value / thermal performance",
            kind: "measurement",
            sourceBehavior: "manufacturer",
            conditional: "when-thermal",
            dependsOn: "ws-protection-type",
            hint: "Record this only when the exact source requires it.",
          },
        ],
      },
      {
        id: "connector",
        label: "Connector",
        hint: "Use the manufacturer manual, CSA B365-17, or the listed connector manual. Do not invent the required clearance.",
        items: [
          { id: "ws-connector-diameter", label: "Flue pipe diameter", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "always" },
          { id: "ws-connector-clearance", label: "Clearance to combustibles", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "always" },
          { id: "ws-connector-horizontal", label: "Horizontal run", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "always" },
          { id: "ws-connector-rise", label: "Rise / slope", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "always" },
          { id: "ws-connector-ceiling", label: "Ceiling clearance", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "always" },
          { id: "ws-connector-wall", label: "Wall clearance", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "always" },
        ],
      },
      {
        id: "chimney-masonry",
        label: "Chimney",
        hint: "Masonry chimney measurements. Factory-built chimney fields stay off this branch.",
        items: [
          { id: "ws-masonry-flue", label: "Flue / liner dimension", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "wood-chimney-masonry" },
          { id: "ws-masonry-liner-top", label: "Liner top projection", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "wood-chimney-masonry" },
          { id: "ws-masonry-termination", label: "Chimney termination height", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "wood-chimney-masonry" },
          { id: "ws-masonry-nearby", label: "Nearby roof / structure relationship", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "wood-chimney-masonry" },
          { id: "ws-masonry-cleanout", label: "Cleanout clearance", kind: "measurement", sourceBehavior: "manual-or-code", conditional: "wood-chimney-masonry" },
        ],
      },
      {
        id: "chimney-factory",
        label: "Chimney",
        hint: "Factory-built chimney measurements come from that chimney manufacturer. Masonry liner fields stay off this branch.",
        items: [
          { id: "ws-chimney-diameter", label: "Chimney diameter", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "wood-chimney-factory" },
          { id: "ws-chimney-height", label: "Chimney height", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "wood-chimney-factory" },
          { id: "ws-chimney-clearance", label: "Manufacturer-required clearances", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "wood-chimney-factory" },
          { id: "ws-chimney-support", label: "Support / offset dimensions", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "wood-chimney-factory", hint: "Record only where the manual requires the dimension." },
        ],
      },
      {
        id: "mantel",
        label: "Mantel",
        hint: "Use the exact stove manual or CSA B365-17 where that source applies. Do not mix appliance, connector, chimney, and fireplace-opening rules.",
        items: [
          mantelPresent("ws-mantel-present"),
          mantelMaterial("ws-mantel-material", "ws-mantel-present"),
          mantelClearance("ws-mantel-projection", "Mantel projection", "ws-mantel-material", "manual-or-code"),
          mantelClearance("ws-mantel-vertical", "Vertical distance", "ws-mantel-material", "manual-or-code"),
        ],
      },
    ],
  },
  {
    type: "fireplace-insert",
    groups: [
      {
        id: "insert-clearances",
        label: "Insert Clearances",
        hint: "Use the exact insert manufacturer requirements. Do not substitute a similar model.",
        items: [clearance("ins-sidewall", "Adjacent sidewall clearance")],
      },
      {
        id: "facing-mantel",
        label: "Facing / Mantel",
        items: [
          mantelPresent("ins-mantel-present"),
          mantelMaterial("ins-mantel-material", "ins-mantel-present"),
          mantelClearance("ins-mantel-clearance", "Mantel clearance", "ins-mantel-material", "manufacturer"),
          mantelClearance("ins-mantel-projection", "Mantel projection", "ins-mantel-material", "manufacturer"),
          clearance("ins-top-facing", "Top facing clearance"),
          clearance("ins-side-facing", "Side facing clearance"),
        ],
      },
      {
        id: "hearth",
        label: "Hearth",
        hint: "Insert hearth requirements can be manufacturer-specific. Do not reuse generic masonry hearth dimensions.",
        items: [
          clearance("ins-hearth-front", "Hearth front extension"),
          clearance("ins-hearth-left", "Hearth left extension"),
          clearance("ins-hearth-right", "Hearth right extension"),
          clearance("ins-r-value", "Thermal / R-value requirement", "when-applies"),
          check("ins-raised", "Raised insert condition", "manufacturer", ["note"]),
        ],
      },
      {
        id: "liner",
        label: "Liner",
        items: [
          { id: "ins-liner-diameter", label: "Liner diameter", kind: "measurement", sourceBehavior: "manufacturer", conditional: "always" },
          { id: "ins-liner-termination", label: "Chimney / liner termination", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "always" },
        ],
      },
      {
        id: "original-masonry",
        label: "Original Fireplace",
        hint: "Masonry measurements that still apply to the fireplace the appliance was installed into.",
        items: [
          { id: "ins-opening", label: "Original fireplace opening", kind: "measurement", sourceBehavior: "observation-only", conditional: "insert-original-masonry" },
          { id: "ins-masonry-clearance", label: "Relevant masonry clearance", kind: "measurement", sourceBehavior: "alberta-code", conditional: "insert-original-masonry", historical: true },
        ],
      },
      {
        id: "original-factory",
        label: "Original Fireplace",
        hint: "Compatibility is manufacturer-specific. Do not guess the original fireplace.",
        items: [
          check("ins-original-compatibility", "Original fireplace compatibility", "manufacturer", ["note"], {
            conditional: "insert-original-factory",
          }),
        ],
      },
    ],
  },
  {
    type: "masonry-fireplace",
    groups: [
      {
        id: "opening",
        label: "Fireplace Opening",
        items: [
          codeMeasure("mf-opening-width", "Opening width"),
          codeMeasure("mf-opening-height", "Opening height"),
          codeMeasure("mf-firebox-depth", "Fire chamber depth"),
        ],
      },
      {
        id: "hearth",
        label: "Hearth",
        hint: "Where the current Alberta Part 9 masonry fireplace provision applies, the baseline is 400 mm in front and 200 mm each side. Do not mark an older installation Not Compliant from that baseline alone.",
        items: [
          codeMeasure("mf-hearth-front", "Hearth front extension"),
          codeMeasure("mf-hearth-left", "Hearth left extension"),
          codeMeasure("mf-hearth-right", "Hearth right extension"),
        ],
      },
      {
        id: "mantel",
        label: "Mantel / Combustibles",
        hint: "Use the applicable NBC(AE) Section 9.22 fireplace-opening combustible provision and resolve historical applicability. Do not calculate a clearance from mantel depth.",
        items: [
          mantelPresent("mf-mantel-present"),
          mantelMaterial("mf-mantel-material", "mf-mantel-present"),
          mantelClearance("mf-mantel-height", "Mantel height above opening", "mf-mantel-material", "alberta-code", true),
          mantelClearance("mf-mantel-projection", "Mantel projection", "mf-mantel-material", "alberta-code", true),
          codeMeasure("mf-trim-left", "Left trim clearance"),
          codeMeasure("mf-trim-right", "Right trim clearance"),
          codeMeasure("mf-other-projection", "Other combustible projection"),
        ],
      },
      {
        id: "smoke-chamber",
        label: "Smoke Chamber",
        hint: "If the smoke chamber is outside the inspection level, record Unable to Inspect. Do not invent a concealed measurement.",
        items: [
          check("mf-smoke", "Smoke chamber", "observation-only", ["observable", "visibleCondition", "damage"]),
          {
            id: "mf-smoke-slope",
            label: "Side slope measurement",
            kind: "measurement",
            sourceBehavior: "observation-only",
            conditional: "when-observable",
            dependsOn: "mf-smoke",
          },
        ],
      },
      {
        id: "flue",
        label: "Flue / Liner",
        hint: "Record only what was observable. Concealed liner dimensions are not measured values.",
        items: [
          { id: "mf-flue-dimension", label: "Flue dimension", kind: "measurement", sourceBehavior: "observation-only", conditional: "always" },
          { id: "mf-liner-top", label: "Liner top projection", kind: "measurement", sourceBehavior: "observation-only", conditional: "always" },
          check("mf-liner-condition", "Visible liner condition", "observation-only", ["visibleCondition"]),
        ],
      },
      {
        id: "crown",
        label: "Crown / Chimney",
        items: [
          { id: "mf-crown-drip", label: "Crown drip projection", kind: "measurement", sourceBehavior: "observation-only", conditional: "always" },
          { id: "mf-chimney-height", label: "Chimney height above roof contact", kind: "measurement", sourceBehavior: "alberta-code", conditional: "always", historical: true },
          { id: "mf-nearby-height", label: "Height above nearby roof / structure", kind: "measurement", sourceBehavior: "alberta-code", conditional: "always", historical: true },
          { id: "mf-nearby-distance", label: "Horizontal distance to nearby roof / structure", kind: "measurement", sourceBehavior: "alberta-code", conditional: "always", historical: true },
          { id: "mf-cleanout", label: "Cleanout clearance", kind: "measurement", sourceBehavior: "alberta-code", conditional: "when-applies", historical: true },
        ],
      },
      {
        id: "opening-protection",
        label: "Opening Protection",
        hint: "This is a field observation. A missing screen does not set Not Compliant unless you attach a verified requirement and classify it.",
        items: [
          check("mf-screen", "Protective opening screen / barrier", "observation-only", ["present", "type", "condition"], {
            optionSet: "masonry-screen",
          }),
        ],
      },
    ],
  },
  {
    type: "factory-built-fireplace",
    groups: [
      {
        id: "manufacturer-clearances",
        label: "Manufacturer Clearances",
        hint: "Record only the measurements this model and manual require. Do not invent a required value, and do not identify the unit from decorative facing.",
        items: [
          clearance("fb-opening", "Fireplace opening"),
          mantelPresent("fb-mantel-present"),
          mantelMaterial("fb-mantel-material", "fb-mantel-present"),
          mantelClearance("fb-mantel-height", "Mantel height", "fb-mantel-material", "manufacturer"),
          mantelClearance("fb-mantel-projection", "Mantel projection", "fb-mantel-material", "manufacturer"),
          clearance("fb-clearance-left", "Left side combustible clearance"),
          clearance("fb-clearance-right", "Right side combustible clearance"),
          clearance("fb-top-facing", "Top facing clearance"),
        ],
      },
      {
        id: "hearth",
        label: "Hearth",
        items: [
          clearance("fb-hearth-front", "Hearth front"),
          clearance("fb-hearth-left", "Hearth left"),
          clearance("fb-hearth-right", "Hearth right"),
        ],
      },
      {
        id: "firebox",
        label: "Firebox Components",
        hint: "These are inspection checks. Classify them from the manufacturer instructions.",
        items: [
          check("fb-refractory", "Refractory panels", "manufacturer", ["condition", "note"]),
          check("fb-firebrick", "Firebrick", "manufacturer", ["condition", "note"]),
          check("fb-grate", "Grate", "manufacturer", ["condition", "note"]),
          check("fb-air", "Air passages", "manufacturer", ["condition", "note"]),
          check("fb-warping", "Warping", "manufacturer", ["condition", "note"]),
          check("fb-cracks", "Cracks", "manufacturer", ["condition", "note"]),
          check("fb-missing", "Missing pieces", "manufacturer", ["condition", "note"]),
          check("fb-modifications", "Unauthorized modifications", "manufacturer", ["condition", "note"]),
        ],
      },
      {
        id: "doors",
        label: "Doors / Screens",
        hint: "There is no universal door or screen configuration. Use the listing and manufacturer instructions.",
        items: [
          check("fb-doors", "Opening protection / doors / screen", "manufacturer", ["present", "type", "condition", "listed"], {
            optionSet: "factory-screen",
          }),
        ],
      },
      {
        id: "chimney",
        label: "Chimney System",
        items: [
          { id: "fb-chimney-diameter", label: "Chimney diameter", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "always" },
          { id: "fb-chimney-height", label: "Chimney height", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "always" },
          { id: "fb-roof", label: "Roof / nearby structure relationship", kind: "measurement", sourceBehavior: "chimney-manufacturer", conditional: "always" },
          { id: "fb-framing", label: "Framing clearance", kind: "measurement", sourceBehavior: "manufacturer", conditional: "when-applies", hint: "Record only where the framing clearance is accessible." },
        ],
      },
    ],
  },
];

export function measurementProfileFor(type: WettSystemType | undefined) {
  return MEASUREMENT_PROFILES.find((profile) => profile.type === type);
}

export function measurementDefinitions(type: WettSystemType | undefined) {
  return measurementProfileFor(type)?.groups.flatMap((group) => group.items) ?? [];
}

export function measurementDefinition(type: WettSystemType | undefined, id: string) {
  return measurementDefinitions(type).find((item) => item.id === id);
}
