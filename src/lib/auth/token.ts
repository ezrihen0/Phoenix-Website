import type { UserRole } from "@/lib/auth/types";

export const ADMIN_SESSION_COOKIE_NAME = "phoenix_admin_session";

export type AdminSessionTokenPayload = {
  username: string;
  expiresAt: number;
  role?: UserRole;
};

const encoder = new TextEncoder();

function getSessionSecretValue() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return secret;
}

async function importSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecretValue()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value: string) {
  if (value.length % 2 !== 0 || /[^0-9a-f]/i.test(value)) {
    return null;
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }

  return bytes;
}

function encodePayload(payload: AdminSessionTokenPayload) {
  return encodeURIComponent(JSON.stringify(payload));
}

function decodePayload(value: string) {
  const parsed = JSON.parse(decodeURIComponent(value)) as Partial<AdminSessionTokenPayload>;

  if (
    typeof parsed.username !== "string" ||
    !parsed.username ||
    typeof parsed.expiresAt !== "number" ||
    (parsed.role !== undefined && parsed.role !== "admin" && parsed.role !== "office")
  ) {
    return null;
  }

  return parsed as AdminSessionTokenPayload;
}

export async function createAdminSessionToken(payload: AdminSessionTokenPayload) {
  const encodedPayload = encodePayload(payload);
  const signature = await crypto.subtle.sign(
    "HMAC",
    await importSigningKey(),
    encoder.encode(encodedPayload),
  );

  return `${encodedPayload}.${bytesToHex(new Uint8Array(signature))}`;
}

export async function readAdminSessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return null;
  }

  const encodedPayload = token.slice(0, separatorIndex);
  const signatureHex = token.slice(separatorIndex + 1);
  const signature = hexToBytes(signatureHex);

  if (!signature) {
    return null;
  }

  const isValid = await crypto.subtle.verify(
    "HMAC",
    await importSigningKey(),
    signature,
    encoder.encode(encodedPayload),
  );

  if (!isValid) {
    return null;
  }

  try {
    const payload = decodePayload(encodedPayload);

    if (!payload || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}