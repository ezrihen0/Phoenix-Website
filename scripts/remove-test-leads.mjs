import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

import { get, put } from "@vercel/blob";

const REMOTE_LEADS_KEY = "cms/leads.json";

function parseEnv(content) {
  const env = {};

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

function loadEnv() {
  for (const [key, value] of Object.entries(parseEnv(readFileSync(".env.local", "utf8")))) {
    process.env[key] = value;
  }
}

function getSharedBlobProtectionKey() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token ? createHash("sha256").update(`cms-protect:v2:${token}`, "utf8").digest() : null;
}

function getSessionProtectionKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is required.");
  }

  return createHash("sha256").update(secret, "utf8").digest();
}

function getProtectionKeys() {
  const keys = [];
  const seen = new Set();

  for (const key of [getSharedBlobProtectionKey(), getSessionProtectionKey()]) {
    if (!key) {
      continue;
    }

    const id = key.toString("hex");
    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    keys.push(key);
  }

  return keys;
}

function isProtectedJsonEnvelope(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      "version" in value &&
      "iv" in value &&
      "tag" in value &&
      "ciphertext" in value,
  );
}

function unprotectJson(value) {
  if (!isProtectedJsonEnvelope(value) || value.version !== 1) {
    return null;
  }

  for (const key of getProtectionKeys()) {
    try {
      const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(value.iv, "base64"));
      decipher.setAuthTag(Buffer.from(value.tag, "base64"));
      const plaintext = Buffer.concat([
        decipher.update(Buffer.from(value.ciphertext, "base64")),
        decipher.final(),
      ]).toString("utf8");

      return JSON.parse(plaintext);
    } catch {
      continue;
    }
  }

  return null;
}

function protectJson(value) {
  const key = getSharedBlobProtectionKey() || getSessionProtectionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  return {
    version: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

function isTestLead(lead) {
  const email = lead.email.trim().toLowerCase();
  const message = lead.message.trim().toLowerCase();
  const firstName = lead.firstName.trim().toLowerCase();
  const lastName = lead.lastName.trim().toLowerCase();

  if (email.endsWith("@example.com")) {
    return true;
  }

  if (email.includes("smoke-test") || email.includes("smoke-request") || email.includes("test-lead")) {
    return true;
  }

  if (
    (firstName === "smoke" || firstName === "test") &&
    (lastName === "test" || lastName === "lead" || lastName === "request")
  ) {
    return true;
  }

  return (
    message.includes("smoke test") ||
    message.includes("automated smoke") ||
    message.includes("automated request-service") ||
    message.includes("please ignore")
  );
}

async function main() {
  loadEnv();

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN must be set in .env.local.");
  }

  const blob = await get(REMOTE_LEADS_KEY, { token, access: "private", useCache: false });
  if (!blob?.stream) {
    console.log("No leads file found.");
    return;
  }

  const payload = await new Response(blob.stream).json();
  const leads = unprotectJson(payload) ?? (Array.isArray(payload) ? payload : []);

  const testLeads = leads.filter(isTestLead);
  const remaining = leads.filter((lead) => !isTestLead(lead));

  if (!testLeads.length) {
    console.log("No test leads found.");
    return;
  }

  await put(REMOTE_LEADS_KEY, JSON.stringify(protectJson(remaining), null, 2), {
    token,
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    contentType: "application/json; charset=utf-8",
  });

  console.log(`Removed ${testLeads.length} test lead(s):`);
  for (const lead of testLeads) {
    console.log(`- ${lead.id} | ${lead.firstName} ${lead.lastName} | ${lead.email}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
