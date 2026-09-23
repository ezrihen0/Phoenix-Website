import { masonryChimneyItems } from "../chimney-profiles";
import { knowledgeItem, type WettSystemWorkflow } from "../types";

const system = "masonry-fireplace" as const;

function card(section: string, id: string, label: string, instructions: string, extra: { uti?: boolean; na?: boolean } = {}) {
  return knowledgeItem(system, section, {
    id,
    label,
    instructions,
    utiAllowed: extra.uti ?? true,
    naAllowed: extra.na ?? true,
    manufacturerDependent: false,
    historicalApplicabilitySensitive: true,
  });
}

export const masonryFireplaceWorkflow: WettSystemWorkflow = {
  type: system,
  label: "Masonry Fireplace",
  rearHearthApplies: false,
  sections: [
    {
      id: "firebox",
      label: "Firebox",
      items: [
        card("Firebox", "mf-firebrick", "Firebrick and masonry", "Inspect firebrick, masonry, mortar joints, spalling, missing brick, and open joints."),
        card("Firebox", "mf-cracks", "Cracks and floor", "Record cracks, floor condition, and burn-through that were observed. A crack does not set Not Compliant by itself."),
        card("Firebox", "mf-repairs", "Repairs and modification", "Record previous repairs, combustible intrusion, or major modification that was observed."),
      ],
    },
    {
      id: "damper",
      label: "Damper",
      items: [
        card("Damper", "mf-damper", "Damper", "Inspect whether the damper is present, operates, and shows corrosion, deformation, obstruction, or modification."),
      ],
    },
    {
      id: "smoke",
      label: "Smoke Chamber",
      items: [
        card("Smoke Chamber", "mf-smoke", "Smoke chamber", "Inspect visible masonry, cracks, gaps, shape, parging, staining, repairs, and obstructions. If the area cannot be seen, use Unable to Inspect on the smoke chamber only."),
      ],
    },
    {
      id: "opening",
      label: "Hearth / Opening",
      items: [
        card("Hearth / Opening", "mf-hearth", "Hearth condition", "Record hearth construction, cracks, gaps, and exposed combustible flooring. Measurements belong in Measurements & System Checks. Do not apply a current new-construction dimension automatically to a historic installation.", { na: false }),
        card("Hearth / Opening", "mf-combustibles", "Mantel, trim, and combustibles", "Inspect the mantel, trim, shelving, and other combustible material. If no mantel is present, record that in Measurements and do not force a mantel clearance."),
      ],
    },
    {
      id: "chimney-masonry",
      label: "Masonry Chimney",
      items: [
        ...masonryChimneyItems(system, "mf"),
        card("Masonry Chimney", "mf-attic", "Attic / concealed chimney", "If attic or concealed chimney areas were not accessed within this inspection level, use Unable to Inspect on this item only. Do not infer the concealed condition from the room below."),
      ],
    },
    {
      id: "air",
      label: "Combustion Air",
      items: [
        card("Combustion Air", "mf-air", "Alberta combustion air", "Record the Alberta combustion-air observation. Do not apply Ontario outdoor-air rules.", { na: false }),
      ],
    },
  ],
};
