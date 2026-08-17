import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

type ProtectedJsonEnvelope = {
  version: 1;
  iv: string;
  tag: string;
  ciphertext: string;
};

function getSessionProtectionKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or NEXTAUTH_SECRET must be configured for protected CMS storage.");
  }

  return createHash("sha256").update(secret, "utf8").digest();
}

function getSharedBlobProtectionKey() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    return null;
  }

  return createHash("sha256").update(`cms-protect:v2:${token}`, "utf8").digest();
}

function getPreferredProtectionKey() {
  return getSharedBlobProtectionKey() || getSessionProtectionKey();
}

function getProtectionKeys() {
  const keys: Buffer[] = [];
  const seen = new Set<string>();

  const addKey = (key: Buffer | null) => {
    if (!key) {
      return;
    }

    const id = key.toString("hex");

    if (seen.has(id)) {
      return;
    }

    seen.add(id);
    keys.push(key);
  };

  addKey(getSharedBlobProtectionKey());

  if (process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET) {
    addKey(getSessionProtectionKey());
  }

  return keys;
}

function decryptWithKey<T>(value: ProtectedJsonEnvelope, key: Buffer): T | null {
  try {
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(value.iv, "base64"));
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

export function isProtectedJsonEnvelope(value: unknown): value is ProtectedJsonEnvelope {
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
  const cipher = createCipheriv("aes-256-gcm", getPreferredProtectionKey(), iv);
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
  if (!isProtectedJsonEnvelope(value) || value.version !== 1) {
    return null;
  }

  for (const key of getProtectionKeys()) {
    const decrypted = decryptWithKey<T>(value, key);

    if (decrypted !== null) {
      return decrypted;
    }
  }

  return null;
}

export function shouldRewrapProtectedJson(value: unknown) {
  if (!isProtectedJsonEnvelope(value) || value.version !== 1) {
    return false;
  }

  const preferred = decryptWithKey(value, getPreferredProtectionKey());

  return preferred === null && unprotectJson(value) !== null;
}
