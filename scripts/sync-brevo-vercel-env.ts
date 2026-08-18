import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

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
    return "updated";
  } catch {
    execFileSync(
      "npx",
      ["vercel", "env", "add", name, "production", "--value", value, "--sensitive", "-y"],
      { stdio: "inherit", shell: true },
    );
    return "added";
  }
}

const apiKey = parseEnv(readFileSync(".env.local", "utf8")).BREVO_API_KEY?.trim();

if (!apiKey) {
  throw new Error("BREVO_API_KEY must be set in .env.local.");
}

const action = upsertVercelEnv("BREVO_API_KEY", apiKey);
console.log(`${action} BREVO_API_KEY on Vercel production.`);
