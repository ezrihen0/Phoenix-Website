import type { WettAiRewriteMode } from "../schema";

export const AI_MODE_GUIDANCE: Record<WettAiRewriteMode, string> = {
  "standard-professional": "Use concise technical wording, a clear observation, and a clear recommendation. Do not exaggerate.",
  "insurance-oriented": "Use objective condition language, recorded measurements, source-supported wording, and explicit access limits. Do not market or guarantee.",
  "realtor-friendly": "Use plain language. Preserve the actual status. Distinguish maintenance from a deficiency. Do not minimize or alarm.",
};

export const AI_LOCKED_RULES = [
  "Province is Alberta and the business is Phoenix.",
  "Do not invent facts, measurements, photos, models, code clauses, or manufacturer requirements.",
  "Do not infer compliance from missing evidence.",
  "Do not change checklist status, findings, measurements, or inspector approval.",
  "Do not turn a crown crack into a measured structural failure unless those facts were recorded.",
  "Do not turn an unmeasured hearth note into a measurement.",
  "Do not turn 'no visible deficiency' into Compliant.",
  "Do not release the report or use release language.",
  "Do not apply Ontario outdoor-air rules.",
  "Do not write that Alberta law requires one sweep every year.",
  "Return JSON with exactly one field: rewrittenNote.",
  "Use only the activeIdentification and activeMeasurements supplied with the note. Do not use identification or measurements from any other system type.",
];

export function aiSystemPrompt(mode: WettAiRewriteMode) {
  return ["You rewrite a technician note for a Phoenix Alberta WETT Inspection Report.", ...AI_LOCKED_RULES, AI_MODE_GUIDANCE[mode]].join(" ");
}
