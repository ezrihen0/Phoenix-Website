import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createEmptyWettReport } from "../schema";
import {
  cleaningHelp,
  helpCatalog,
  helpContextFromReport,
  inspectionGroupHelp,
  inspectionItemHelp,
  measurementGroupHelp,
  readTechnicianHelpAnswer,
  sharedHelp,
  technicianHelpSystemPrompt,
  FIELD_GUIDE_TOPICS,
} from "./help";

const smoke = inspectionGroupHelp("masonry-fireplace", "smoke");
assert.equal(smoke?.title, "Smoke chamber");
assert.match(smoke?.summary || "", /visible smoke-chamber/i);
assert.ok(smoke?.checks.includes("Cracks"));
assert.match(smoke?.accessGuidance || "", /UTI/);
assert.match(smoke?.caution || "", /concealed upper smoke chamber/i);

const refractory = inspectionItemHelp("factory-built-fireplace", "fb-refractory");
assert.match(refractory?.summary || "", /refractory/i);
assert.equal(refractory?.manufacturerDependent, true);
assert.match(refractory?.caution || "", /do not automatically classify every small refractory crack/i);

const door = inspectionItemHelp("wood-stove", "ws-door");
assert.match(door?.title || "", /gasket/i);
assert.match(door?.caution || "", /worn gasket/i);
assert.equal(door?.manufacturerDependent, undefined);

const factoryMantel = measurementGroupHelp("factory-built-fireplace", "manufacturer-clearances");
const masonryMantel = measurementGroupHelp("masonry-fireplace", "mantel");
assert.equal(factoryMantel?.manufacturerDependent, true);
assert.match(factoryMantel?.caution || "", /model-specific/i);
assert.equal(masonryMantel?.manufacturerDependent, undefined);
assert.match(masonryMantel?.caution || "", /fireplace-opening/i);
assert.equal(factoryMantel?.summary === masonryMantel?.summary, false);

const woodCleaning = cleaningHelp("wood-stove");
const insertCleaning = cleaningHelp("fireplace-insert");
const masonryCleaning = cleaningHelp("masonry-fireplace");
const factoryCleaning = cleaningHelp("factory-built-fireplace");
assert.match(woodCleaning?.checks.join(" ") || "", /connector/i);
assert.match(insertCleaning?.checks.join(" ") || "", /liner/i);
assert.match(masonryCleaning?.checks.join(" ") || "", /smoke chamber/i);
assert.match(factoryCleaning?.checks.join(" ") || "", /factory-built/i);
assert.match(woodCleaning?.caution || "", /does not set Cleaning Required/);

for (const guidance of [...helpCatalog(), sharedHelp("finding")!]) {
  const text = [guidance.title, guidance.summary, ...guidance.checks, guidance.accessGuidance, guidance.evidenceGuidance, guidance.caution].join(" ");
  assert.equal(/ontario/i.test(text), false, guidance.id);
  assert.equal(/one sweep every year/i.test(text), false, guidance.id);
  assert.equal(/annual chimney sweeping/i.test(text), false, guidance.id);
  assert.equal(/requires annual/i.test(text), false, guidance.id);
}

const topics = [
  ["wood-stove", "item", "ws-firebrick"],
  ["wood-stove", "item", "ws-baffle"],
  ["wood-stove", "item", "ws-door"],
  ["wood-stove", "item", "ws-air"],
  ["wood-stove", "measure", "connector"],
  ["wood-stove", "measure", "hearth"],
  ["wood-stove", "group", "clearances"],
  ["wood-stove", "group", "chimney-masonry"],
  ["fireplace-insert", "item", "ins-firebrick"],
  ["fireplace-insert", "item", "ins-glass"],
  ["fireplace-insert", "item", "ins-liner-connection"],
  ["fireplace-insert", "group", "original"],
  ["fireplace-insert", "item", "ins-damper-mod"],
  ["fireplace-insert", "item", "ins-smoke"],
  ["fireplace-insert", "measure", "hearth"],
  ["fireplace-insert", "measure", "facing-mantel"],
  ["fireplace-insert", "group", "chimney-masonry"],
  ["masonry-fireplace", "group", "firebox"],
  ["masonry-fireplace", "measure", "hearth"],
  ["masonry-fireplace", "group", "damper"],
  ["masonry-fireplace", "group", "smoke"],
  ["masonry-fireplace", "item", "mf-flue"],
  ["masonry-fireplace", "measure", "mantel"],
  ["masonry-fireplace", "item", "mf-masonry"],
  ["masonry-fireplace", "item", "mf-crown"],
  ["masonry-fireplace", "item", "mf-termination"],
  ["masonry-fireplace", "item", "mf-flashing"],
  ["masonry-fireplace", "item", "mf-cleanout"],
  ["factory-built-fireplace", "item", "fb-refractory"],
  ["factory-built-fireplace", "item", "fb-grate"],
  ["factory-built-fireplace", "item", "fb-doors"],
  ["factory-built-fireplace", "item", "fb-air-passages"],
  ["factory-built-fireplace", "measure", "manufacturer-clearances"],
  ["factory-built-fireplace", "measure", "hearth"],
  ["factory-built-fireplace", "item", "fb-chase-pipe"],
  ["factory-built-fireplace", "item", "fb-chase-supports"],
  ["factory-built-fireplace", "item", "fb-chase-shields"],
  ["factory-built-fireplace", "item", "fb-chase-clearance"],
  ["factory-built-fireplace", "item", "fb-chase-cover"],
  ["factory-built-fireplace", "item", "fb-direct-roof"],
] as const;

for (const [system, kind, id] of topics) {
  const guidance = kind === "item" ? inspectionItemHelp(system, id) : kind === "group" ? inspectionGroupHelp(system, id) : measurementGroupHelp(system, id);
  assert.ok(guidance, `${system} ${id}`);
  assert.ok(guidance.checks.length > 0);
}
for (const system of ["wood-stove", "fireplace-insert", "masonry-fireplace", "factory-built-fireplace"] as const) {
  assert.ok(cleaningHelp(system));
}

assert.deepEqual(
  FIELD_GUIDE_TOPICS.map((topic) => topic.title),
  [
    "How statuses work",
    "When to use UTI",
    "How photo evidence works",
    "How Manufacturer Lookup works",
    "How AI Rewrite works",
    "How recommendations work",
    "How to complete a report",
  ],
);
assert.match(sharedHelp("uti")?.caution || "", /Do not use UTI for a missing manual/i);

const report = createEmptyWettReport({ id: "82324810-5108-42ba-b06c-0651eb93fb64", reportNumber: "PHX-WETT-TEST", username: "office", now: "2026-09-23T00:00:00.000Z" });
report.system = { type: "factory-built-fireplace", manufacturer: "Regency", model: "F500", listingStatus: "verified" };
report.inspection.inspectionLevel = "visual";
report.venting.route = "factory-chase";
const context = helpContextFromReport(report, { helpId: "factory-built-fireplace:fb-refractory", helpTitle: "Refractory", currentSection: "Inspection", inspectionGroup: "Firebox", inspectionItem: "Refractory panels", currentStatus: "not-compliant" });
assert.equal(context.business, "Phoenix");
assert.equal(context.province, "Alberta");
assert.equal(context.systemLabel, "Factory-Built Fireplace");
assert.equal(context.manufacturer, "Regency");
assert.equal(context.model, "F500");
assert.equal(context.listingStatus, "verified");
assert.equal(context.inspectionLevel, "visual");
assert.equal(context.chimneyConfiguration, "factory-chase");
assert.equal(context.currentStatus, "not-compliant");

const parsed = readTechnicianHelpAnswer({
  quickAnswer: "A small crack is not automatically a failure.",
  verifyNext: ["Exact model", "Manual replacement criteria"],
  sourcePath: "Manufacturer manual / listing.",
  caution: "Do not classify from appearance alone.",
  status: "not-compliant",
  finding: "invented crack",
  recommendation: "replace the fireplace",
});
assert.deepEqual(parsed, {
  quickAnswer: "A small crack is not automatically a failure.",
  verifyNext: ["Exact model", "Manual replacement criteria"],
  sourcePath: "Manufacturer manual / listing.",
  caution: "Do not classify from appearance alone.",
});
assert.equal("status" in (parsed || {}), false);

const prompt = technicianHelpSystemPrompt();
assert.match(prompt, /Do not change inspection status/);
assert.match(prompt, /Do not create a finding/);
assert.match(prompt, /Do not create a recommendation/);
assert.match(prompt, /Do not invent an observation/);

const pdf = readFileSync("src/lib/wett/report-pdf.tsx", "utf8");
const view = readFileSync("src/lib/wett/report-view-model.ts", "utf8");
const helpUi = readFileSync("src/components/admin/office/wett/wett-help.tsx", "utf8");
assert.equal(pdf.includes("knowledge/help"), false);
assert.equal(view.includes("knowledge/help"), false);
assert.equal(helpUi.includes("autosaveWettReportAction"), false);
assert.equal(helpUi.includes("updateDraft"), false);
assert.equal(helpUi.includes("router.refresh"), false);

const actions = readFileSync("src/app/admin/office/wett/actions.ts", "utf8");
const start = actions.indexOf("export async function askWettTechnicianHelpAction");
const end = actions.indexOf("export async function rewriteWettNoteAction");
const askBody = actions.slice(start, end);
assert.equal(askBody.includes("saveWettEditableDraft"), false);
assert.equal(askBody.includes("revalidatePath"), false);
assert.equal(askBody.includes("redirect("), false);

console.log("wett help guidance passed");
