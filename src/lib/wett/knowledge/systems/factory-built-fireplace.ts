import { chasePipeItems, directPipeItems, unknownChimneyItem } from "../chimney-profiles";
import { knowledgeItem, type WettSystemWorkflow } from "../types";

const system = "factory-built-fireplace" as const;

function card(section: string, id: string, label: string, instructions: string, extra: { uti?: boolean; na?: boolean; manufacturer?: boolean } = {}) {
  return knowledgeItem(system, section, {
    id,
    label,
    instructions,
    utiAllowed: extra.uti ?? true,
    naAllowed: extra.na ?? false,
    manufacturerDependent: extra.manufacturer ?? false,
    historicalApplicabilitySensitive: false,
  });
}

export const factoryBuiltFireplaceWorkflow: WettSystemWorkflow = {
  type: system,
  label: "Factory-Built Fireplace",
  rearHearthApplies: false,
  sections: [
    {
      id: "model",
      label: "Model Identification",
      items: [
        card("Model Identification", "fb-model", "Model identity", "Attempt manufacturer, model, serial, certification label, listing, and chimney identity. If there is no reliable product identity, use manufacturer lookup. Model-specific requirements stay not verified. Do not guess from appearance.", { uti: false, manufacturer: true }),
      ],
    },
    {
      id: "manual",
      label: "Manufacturer Manual",
      items: [
        card("Manufacturer Manual", "fb-manual", "Manual", "Record manual title, part, revision, and date when established. A missing manual is manufacturer lookup, not Unable to Inspect.", { uti: false, manufacturer: true }),
      ],
    },
    {
      id: "firebox",
      label: "Firebox",
      items: [
        card("Firebox", "fb-refractory", "Refractory panels", "Inspect factory refractory or firebrick. Damage classification stays manufacturer-dependent where the manual controls it.", { manufacturer: true }),
        card("Firebox", "fb-grate", "Grate", "Inspect the grate where this model has one.", { na: true }),
        card("Firebox", "fb-doors", "Doors and screens", "Inspect doors and screens against the listing. There is no universal door or screen configuration.", { manufacturer: true }),
        card("Firebox", "fb-air-passages", "Air passages and louvers", "Inspect air passages, louvers, and cooling-air openings that are part of this model.", { manufacturer: true }),
        card("Firebox", "fb-shell", "Shell, warping, and missing pieces", "Record warping, cracks, missing pieces, and visible shell condition."),
        card("Firebox", "fb-mods", "Unauthorized modifications", "Record modifications that were observed. Do not add a masonry smoke chamber or masonry damper unless a separate finding documents that unusual condition."),
        card("Firebox", "fb-standoffs", "Standoffs and framing", "Inspect standoffs and framing only where they are accessible.", { na: true }),
      ],
    },
    {
      id: "compatibility",
      label: "Component Compatibility Audit",
      items: [
        card("Component Compatibility Audit", "fb-compatibility", "Component compatibility", "Record whether listed components were identified as compatible. Mixed or unknown components require manufacturer lookup and stay not verified.", { uti: false, manufacturer: true }),
      ],
    },
    {
      id: "air",
      label: "Alberta Outdoor-Air / Combustion-Air Gate",
      items: [
        card("Alberta Outdoor-Air / Combustion-Air Gate", "fb-outdoor-air", "Alberta outdoor air", "Record the Alberta outdoor-air or combustion-air observation for this installation. Do not apply Ontario outdoor-air rules."),
      ],
    },
    {
      id: "chimney-chase",
      label: "Factory-Built Pipe — Inside Chase",
      items: chasePipeItems(system, "fb"),
    },
    {
      id: "chimney-direct",
      label: "Factory-Built Pipe — Direct Through Roof",
      items: directPipeItems(system, "fb"),
    },
    {
      id: "chimney-unknown",
      label: "Chimney Configuration",
      items: [unknownChimneyItem(system, "fb-chimney-unknown")],
    },
  ],
};
