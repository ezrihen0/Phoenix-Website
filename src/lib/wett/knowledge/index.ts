import type { WettReport, WettSystemType } from "../schema";
import type { WettSystem } from "../system-profile";
import { factoryBuiltFireplaceWorkflow } from "./systems/factory-built-fireplace";
import { fireplaceInsertWorkflow } from "./systems/fireplace-insert";
import { masonryFireplaceWorkflow } from "./systems/masonry-fireplace";
import { woodStoveWorkflow } from "./systems/wood-stove";
import type { WettKnowledgeItem, WettSystemWorkflow } from "./types";

export const SYSTEM_WORKFLOWS: WettSystemWorkflow[] = [
  woodStoveWorkflow,
  fireplaceInsertWorkflow,
  masonryFireplaceWorkflow,
  factoryBuiltFireplaceWorkflow,
];

export function workflowFor(type: WettSystemType | undefined) {
  return SYSTEM_WORKFLOWS.find((workflow) => workflow.type === type);
}

export function activeChimneyRoute(report: { system: WettSystem; venting?: { route?: string } }) {
  const system = report.system;
  const chosen = report.venting?.route;

  if (system.type === "masonry-fireplace") return "masonry" as const;
  if (system.type === "wood-stove") {
    if (system.chimneyType === "masonry") return "masonry" as const;
    if (system.chimneyType === "factory-built" && (chosen === "factory-chase" || chosen === "factory-direct")) return chosen;
    return "unknown" as const;
  }
  if (system.type === "factory-built-fireplace") {
    return chosen === "factory-chase" || chosen === "factory-direct" ? chosen : ("unknown" as const);
  }
  if (system.type === "fireplace-insert") {
    if (system.originalFireplaceType === "masonry") return "masonry" as const;
    if (system.originalFireplaceType === "factory-built" && (chosen === "factory-chase" || chosen === "factory-direct")) return chosen;
    return "unknown" as const;
  }
  return "unknown" as const;
}

export function chimneyRouteQuestion(report: { system: WettSystem; venting?: { route?: string } }) {
  const system = report.system;
  if (system.type === "masonry-fireplace") return "none" as const;
  if (system.type === "wood-stove") return system.chimneyType === "factory-built" ? ("factory-enclosure" as const) : ("none" as const);
  if (system.type === "factory-built-fireplace") return "factory-enclosure" as const;
  if (system.type === "fireplace-insert") return system.originalFireplaceType === "factory-built" ? ("factory-enclosure" as const) : ("none" as const);
  return "none" as const;
}

export function itemApplies(item: WettKnowledgeItem, report: Pick<WettReport, "system" | "venting">) {
  if (!report.system.type || !item.systemTypes.includes(report.system.type)) {
    return false;
  }

  const route = activeChimneyRoute(report);

  if (item.conditional === "chimney-masonry") return route === "masonry";
  if (item.conditional === "chimney-factory-built") return route === "factory-chase" || route === "factory-direct";
  if (item.conditional === "chimney-factory-chase") return route === "factory-chase";
  if (item.conditional === "chimney-factory-direct") return route === "factory-direct";
  if (item.conditional === "chimney-unknown") return route === "unknown";
  if (item.conditional === "insert-original-masonry") {
    return report.system.type === "fireplace-insert" && report.system.originalFireplaceType === "masonry";
  }

  return true;
}

export function applicableItems(report: Pick<WettReport, "system" | "venting">) {
  const workflow = workflowFor(report.system.type);
  if (!workflow) {
    return [];
  }

  return workflow.sections.flatMap((section) => section.items).filter((item) => itemApplies(item, report));
}
