/**
 * Remove mock inbox test leads (ids a0000001-… through a0000005-…).
 * Local file: data/cms/leads.json
 * Run: npx tsx scripts/delete-mock-leads.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const MOCK_ID_PREFIX = "a000000";
const LEADS_FILE = path.join(process.cwd(), "data", "cms", "leads.json");

type LeadRow = { id: string };

async function main() {
  let leads: LeadRow[] = [];

  try {
    const raw = await fs.readFile(LEADS_FILE, "utf8");
    leads = JSON.parse(raw) as LeadRow[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("No leads file found — nothing to delete.");
      return;
    }
    throw error;
  }

  const before = leads.length;
  const kept = leads.filter((lead) => !lead.id.startsWith(MOCK_ID_PREFIX));
  const removed = before - kept.length;

  if (removed === 0) {
    console.log("No mock leads found.");
    return;
  }

  await fs.writeFile(LEADS_FILE, `${JSON.stringify(kept, null, 2)}\n`, "utf8");
  console.log(`Removed ${removed} mock lead(s). ${kept.length} lead(s) remain.`);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
