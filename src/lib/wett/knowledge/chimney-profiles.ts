import { knowledgeItem } from "./types";
import type { WettSystemType } from "../schema";

function item(
  system: WettSystemType,
  section: string,
  id: string,
  label: string,
  instructions: string,
  conditional: "chimney-masonry" | "chimney-factory-chase" | "chimney-factory-direct" | "chimney-unknown",
  extra: { utiAllowed?: boolean; naAllowed?: boolean; manufacturerDependent?: boolean } = {},
) {
  return knowledgeItem(system, section, {
    id,
    label,
    instructions,
    conditional,
    utiAllowed: extra.utiAllowed ?? true,
    naAllowed: extra.naAllowed ?? true,
    manufacturerDependent: extra.manufacturerDependent ?? false,
    historicalApplicabilitySensitive: false,
  });
}

export function masonryChimneyItems(system: WettSystemType, prefix: string) {
  const section = "Masonry Chimney";
  return [
    item(system, section, `${prefix}-flue`, "Flue / liner", "Inspect the visible flue or liner, joints, cracks, erosion, missing sections, deposits, and obstruction. A concealed length is Unable to Inspect for that length only.", "chimney-masonry"),
    item(system, section, prefix === "mf" ? "mf-liner" : `${prefix}-liner`, "Visible liner", "Record the first visible flue tile or liner and its visible condition. Do not describe concealed liner as measured or compliant.", "chimney-masonry"),
    item(system, section, `${prefix}-masonry`, "Chimney masonry", "Inspect accessible brick, block, or stone, mortar, spalling, cracking, efflorescence, leaning, separation, previous repairs, loose masonry, and water damage.", "chimney-masonry"),
    item(system, section, `${prefix}-crown`, "Crown", "Inspect the masonry crown where this chimney is masonry. Do not use this item for factory-built pipe.", "chimney-masonry"),
    item(system, section, `${prefix}-termination`, "Rain cap / termination", "Record the termination device that was visible. Do not invent a height that was not measured.", "chimney-masonry"),
    item(system, section, `${prefix}-flashing`, "Flashing", "Inspect accessible flashing and the roof relationship.", "chimney-masonry"),
    item(system, section, `${prefix}-cleanout`, "Cleanout", "Inspect the cleanout where the chimney has one.", "chimney-masonry"),
    item(system, section, `${prefix}-clearance`, "Combustible clearance", "Record combustible clearance only where it was accessible. Concealed clearance is Unable to Inspect for that location.", "chimney-masonry"),
  ];
}

export function chasePipeItems(system: WettSystemType, prefix: string) {
  const section = "Factory-Built Pipe — Inside Chase";
  const items = [
    item(system, section, `${prefix}-chase-pipe`, "Pipe sections and joints", "Inspect visible pipe sections, joints, locking method, and bands. Record separation, dents, or corrosion that were seen.", "chimney-factory-chase", { manufacturerDependent: true }),
    item(system, section, `${prefix}-chase-supports`, "Supports and offsets", "Inspect accessible supports and offsets. Do not assume a concealed support is present.", "chimney-factory-chase", { manufacturerDependent: true }),
    item(system, section, `${prefix}-chase-shields`, "Firestops and attic shield", "Inspect accessible firestops and the attic insulation shield. If the attic was not accessed, use Unable to Inspect on this item only.", "chimney-factory-chase"),
    item(system, section, `${prefix}-chase-clearance`, "Chase clearance", "Record accessible pipe clearance. A finished chase interior that cannot be seen is Unable to Inspect for that concealed clearance.", "chimney-factory-chase"),
    item(system, section, `${prefix}-chase-cover`, "Chase top and termination", "Inspect the chase cover, flashing, storm collar, and termination. This is not a masonry crown.", "chimney-factory-chase", { manufacturerDependent: true }),
  ];
  if (prefix === "fb") {
    items.push(
      item(system, section, "fb-concealed", "Concealed chimney", "A factory-built chimney section concealed in an inaccessible area is Unable to Inspect. Do not mark it compliant from the exposed termination.", "chimney-factory-chase"),
    );
  }
  return items;
}

export function directPipeItems(system: WettSystemType, prefix: string) {
  const section = "Factory-Built Pipe — Direct Through Roof";
  return [
    item(system, section, `${prefix}-direct-pipe`, "Pipe sections and joints", "Inspect exposed pipe sections, joints, supports, and offsets. Do not add chase items when no chase is present.", "chimney-factory-direct", { manufacturerDependent: true }),
    item(system, section, `${prefix}-direct-supports`, "Ceiling support and shields", "Inspect the ceiling support, firestop, and attic insulation shield where the route requires them and they were accessible.", "chimney-factory-direct"),
    item(system, section, `${prefix}-direct-roof`, "Flashing, storm collar, and termination", "Inspect roof flashing, storm collar, termination, and the relationship to nearby roof or structure. Do not inspect a chase cover or masonry crown on this route.", "chimney-factory-direct"),
  ];
}

export function unknownChimneyItem(system: WettSystemType, id: string) {
  return item(
    system,
    "Chimney Configuration",
    id,
    "Chimney route not verified",
    "The chimney route was not established. Do not complete chase, direct-pipe, or masonry-crown items for a route that was not identified.",
    "chimney-unknown",
    { naAllowed: false },
  );
}
