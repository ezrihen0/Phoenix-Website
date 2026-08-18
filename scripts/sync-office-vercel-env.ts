import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { createPasswordHash } from "../src/lib/auth/options";

function parseEnv(content: string) {
  const env: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function upsertVercelEnv(name: string, value: string) {
  try {
    execFileSync(
      "npx",
      ["vercel", "env", "update", name, "production", "--value", value, "--sensitive", "-y"],
      { stdio: "pipe", shell: true },
    );
    return;
  } catch {
    execFileSync(
      "npx",
      ["vercel", "env", "add", name, "production", "--value", value, "--sensitive", "-y"],
      { stdio: "inherit", shell: true },
    );
  }
}

const env = parseEnv(readFileSync(".env.local", "utf8"));
const username = env.OFFICE_USERNAME?.trim();
const password = env.OFFICE_PASSWORD?.trim();

if (!username || !password) {
  throw new Error("OFFICE_USERNAME and OFFICE_PASSWORD must be set in .env.local.");
}

upsertVercelEnv("OFFICE_USERNAME", username);
upsertVercelEnv("OFFICE_PASSWORD", password);
upsertVercelEnv("OFFICE_PASSWORD_HASH", createPasswordHash(password));

console.log("Synced office credentials to Vercel production.");
