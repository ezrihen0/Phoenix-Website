import type { WettSystemType } from "../schema";

export type WettConditional =
  | "chimney-masonry"
  | "chimney-factory-built"
  | "chimney-factory-chase"
  | "chimney-factory-direct"
  | "chimney-unknown"
  | "insert-original-masonry";

export type WettKnowledgeItem = {
  id: string;
  systemTypes: WettSystemType[];
  section: string;
  label: string;
  instructions: string;
  inputType: "status";
  utiAllowed: boolean;
  naAllowed: boolean;
  manufacturerDependent: boolean;
  historicalApplicabilitySensitive: boolean;
  conditional?: WettConditional;
};

export type WettWorkflowSection = {
  id: string;
  label: string;
  items: WettKnowledgeItem[];
};

export type WettSystemWorkflow = {
  type: WettSystemType;
  label: string;
  rearHearthApplies: boolean;
  sections: WettWorkflowSection[];
};

export function knowledgeItem(
  system: WettSystemType,
  section: string,
  input: Omit<WettKnowledgeItem, "systemTypes" | "section" | "inputType">,
): WettKnowledgeItem {
  return {
    ...input,
    systemTypes: [system],
    section,
    inputType: "status",
  };
}
