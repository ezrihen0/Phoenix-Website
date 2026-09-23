import { chasePipeItems, directPipeItems, masonryChimneyItems, unknownChimneyItem } from "../chimney-profiles";
import { knowledgeItem, type WettSystemWorkflow } from "../types";

const system = "wood-stove" as const;

function card(section: string, id: string, label: string, instructions: string, extra: { uti?: boolean; na?: boolean; manufacturer?: boolean } = {}) {
  return knowledgeItem(system, section, {
    id,
    label,
    instructions,
    utiAllowed: extra.uti ?? true,
    naAllowed: extra.na ?? true,
    manufacturerDependent: extra.manufacturer ?? false,
    historicalApplicabilitySensitive: false,
  });
}

const appliance = "Wood Stove";

export const woodStoveWorkflow: WettSystemWorkflow = {
  type: system,
  label: "Wood Stove",
  rearHearthApplies: true,
  sections: [
    {
      id: "appliance",
      label: "Appliance",
      items: [
        card(appliance, "ws-firebrick", "Firebrick / refractory", "Inspect firebrick or refractory. A crack is an observation. It does not set Not Compliant by itself."),
        card(appliance, "ws-baffle", "Baffle", "Inspect the baffle and internal plates where the firebox can be seen."),
        card(appliance, "ws-glass", "Glass", "Inspect the glass. Do not classify a mark as Not Compliant without its significance."),
        card(appliance, "ws-door", "Door, alignment, and latch", "Inspect the door, alignment, and latch."),
        card(appliance, "ws-gasket", "Door gasket", "Inspect the door gasket. Wear is an observation, not an automatic Not Compliant result."),
        card(appliance, "ws-glass-gasket", "Glass gasket", "Inspect the glass gasket where it is present."),
        card(appliance, "ws-air", "Air controls", "Inspect air controls that are part of this stove."),
        card(appliance, "ws-ash", "Ash components", "Inspect ash components where this stove has them.", { na: true }),
        card(appliance, "ws-corrosion", "Corrosion and warping", "Record corrosion or warping that was observed."),
        card(appliance, "ws-cracks", "Cracks and missing parts", "Record cracks or missing internal components that were observed."),
        card(appliance, "ws-overfire", "Overfiring evidence", "Record evidence of overfiring only when it was observed."),
        card(appliance, "ws-modifications", "Unauthorized modifications", "Record modifications that were observed. Do not guess that a part is unlisted."),
        card(appliance, "ws-condition", "Physical condition", "Record observed rust, deformation, glass, gaskets, and baffles. A visual note of no visible deficiency does not set Compliant.", { na: false }),
      ],
    },
    {
      id: "clearances",
      label: "Clearances",
      items: [
        card("Clearances", "ws-clearances", "Appliance clearances", "Record the clearances that apply to this installation in Measurements. Use the certified clearance for this model when it controls. Do not substitute a generic table.", { manufacturer: true, na: false }),
      ],
    },
    {
      id: "combustion-air",
      label: "Combustion Air",
      items: [
        card("Combustion Air", "ws-combustion-air", "Alberta combustion air", "Record the Alberta combustion-air and depressurization observations for this installation. Do not apply Ontario outdoor-air rules.", { na: false }),
      ],
    },
    {
      id: "fire-code",
      label: "Fire Code / Ongoing Maintenance",
      items: [
        card("Fire Code / Ongoing Maintenance", "ws-fire-code", "Deposits and maintenance", "Record combustible deposits, severity, whether cleaning is recommended from the observed condition, known chimney fire, and known smoke spillage. Inspection interval and cleaning are separate. Do not write that Alberta law requires one sweep every year.", { na: false }),
      ],
    },
    {
      id: "chimney-masonry",
      label: "Masonry Chimney",
      items: masonryChimneyItems(system, "ws"),
    },
    {
      id: "chimney-chase",
      label: "Factory-Built Pipe — Inside Chase",
      items: chasePipeItems(system, "ws"),
    },
    {
      id: "chimney-direct",
      label: "Factory-Built Pipe — Direct Through Roof",
      items: directPipeItems(system, "ws"),
    },
    {
      id: "chimney-unknown",
      label: "Chimney Configuration",
      items: [unknownChimneyItem(system, "ws-chimney-unknown")],
    },
  ],
};
