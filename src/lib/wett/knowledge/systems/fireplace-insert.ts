import { chasePipeItems, directPipeItems, masonryChimneyItems, unknownChimneyItem } from "../chimney-profiles";
import { knowledgeItem, type WettSystemWorkflow } from "../types";

const system = "fireplace-insert" as const;

function card(
  section: string,
  id: string,
  label: string,
  instructions: string,
  extra: { uti?: boolean; na?: boolean; manufacturer?: boolean; conditional?: "insert-original-masonry" } = {},
) {
  return knowledgeItem(system, section, {
    id,
    label,
    instructions,
    conditional: extra.conditional,
    utiAllowed: extra.uti ?? true,
    naAllowed: extra.na ?? true,
    manufacturerDependent: extra.manufacturer ?? false,
    historicalApplicabilitySensitive: false,
  });
}

export const fireplaceInsertWorkflow: WettSystemWorkflow = {
  type: system,
  label: "Fireplace Insert / Hearth-Mounted Stove",
  rearHearthApplies: true,
  sections: [
    {
      id: "appliance",
      label: "Insert",
      items: [
        card("Insert", "ins-firebrick", "Firebrick / refractory", "Inspect the insert firebrick or refractory. A crack is an observation, not an automatic Not Compliant result."),
        card("Insert", "ins-baffle", "Baffle and internal components", "Inspect the baffle and internal components that can be seen."),
        card("Insert", "ins-glass", "Glass and door", "Inspect glass, door, and controls."),
        card("Insert", "ins-gasket", "Gaskets", "Inspect door and glass gaskets. Wear alone does not set Not Compliant."),
        card("Insert", "ins-damage", "Damage, corrosion, and warping", "Record damage, corrosion, or warping that was observed."),
        card("Insert", "ins-modifications", "Unauthorized modifications", "Record modifications that were observed."),
      ],
    },
    {
      id: "liner",
      label: "Liner",
      items: [
        card("Liner", "ins-liner", "Liner", "Inspect the liner that was accessible. The liner is a component. It is not the chimney type.", { manufacturer: true }),
        card("Liner", "ins-liner-connection", "Liner connection", "Inspect the adaptor, seal, alignment, and support where they can be seen. If the connection is concealed at this inspection level, use Unable to Inspect on this item only.", { manufacturer: true, na: false }),
        card("Liner", "ins-damper-mod", "Damper modification", "Record whether the original damper was modified or removed, where that could be seen.", { conditional: "insert-original-masonry" }),
      ],
    },
    {
      id: "original",
      label: "Original Fireplace",
      items: [
        card("Original Fireplace", "ins-damper", "Original damper", "Inspect the original damper only where the insert leaves it observable. If it is concealed, use Unable to Inspect on this item only.", { conditional: "insert-original-masonry" }),
        card("Original Fireplace", "ins-smoke", "Smoke chamber", "Inspect the smoke chamber only where it can be seen. If the insert or surround hides it, use Unable to Inspect on this item only.", { conditional: "insert-original-masonry" }),
        card("Original Fireplace", "ins-original-mod", "Original fireplace modification", "Record modifications to the original fireplace that were observed.", { conditional: "insert-original-masonry" }),
      ],
    },
    {
      id: "chimney-masonry",
      label: "Masonry Chimney",
      items: masonryChimneyItems(system, "ins"),
    },
    {
      id: "chimney-chase",
      label: "Factory-Built Pipe — Inside Chase",
      items: chasePipeItems(system, "ins"),
    },
    {
      id: "chimney-direct",
      label: "Factory-Built Pipe — Direct Through Roof",
      items: directPipeItems(system, "ins"),
    },
    {
      id: "chimney-unknown",
      label: "Chimney Configuration",
      items: [unknownChimneyItem(system, "ins-chimney-unknown")],
    },
  ],
};
