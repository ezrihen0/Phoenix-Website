import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

type ProtectedJsonEnvelope = {
  version: 1;
  iv: string;
  tag: string;
  ciphertext: string;
};

function getProtectionKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or NEXTAUTH_SECRET must be configured for protected CMS storage.");
  }

  return createHash("sha256").update(secret, "utf8").digest();
}

function isProtectedEnvelope(value: unknown): value is ProtectedJsonEnvelope {
  return Boolean(
    value &&
      typeof value === "object" &&
      "version" in value &&
      "iv" in value &&
      "tag" in value &&
      "ciphertext" in value,
  );
}

export function protectJson(value: unknown): ProtectedJsonEnvelope {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getProtectionKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  return {
    version: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

export function unprotectJson<T>(value: unknown): T | null {
  if (!isProtectedEnvelope(value) || value.version !== 1) {
    return null;
  }

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      getProtectionKey(),
      Buffer.from(value.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(value.tag, "base64"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(value.ciphertext, "base64")),
      decipher.final(),
    ]).toString("utf8");

    return JSON.parse(plaintext) as T;
  } catch {
    return null;
  }
}