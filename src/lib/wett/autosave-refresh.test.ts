import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function functionBody(source: string, name: string) {
  const start = source.indexOf(`export async function ${name}`);
  assert.ok(start >= 0, name);
  const next = source.indexOf("\nexport async function ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

const actions = readFileSync("src/app/admin/office/wett/actions.ts", "utf8");
const autosave = functionBody(actions, "autosaveWettReportAction");
const review = functionBody(actions, "setWettReviewStatusAction");
const rewrite = functionBody(actions, "rewriteWettNoteAction");
const finalize = functionBody(actions, "finalizeWettReportAction");
const create = functionBody(actions, "createWettDraftAction");

for (const body of [autosave, review, rewrite, finalize]) {
  assert.equal(body.includes("revalidatePath"), false);
  assert.equal(body.includes("redirect("), false);
}

assert.equal(create.includes("redirect("), true);

const builder = readFileSync("src/components/admin/office/wett/wett-report-builder.tsx", "utf8");
const refreshCalls = builder.match(/router\.refresh\(\)/g) || [];
assert.equal(refreshCalls.length, 1);
assert.equal(builder.includes('setActionMessage(result.ok ? "Report completed." : result.message);\n                    if (result.ok) {\n                      purgeWettLocalRecovery(username, report.id);\n                      router.refresh();'), true);
assert.equal(builder.includes("window.location"), false);
assert.equal(builder.includes("location.reload"), false);

console.log("wett autosave refresh guard passed");
