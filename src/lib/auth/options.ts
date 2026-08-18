import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  readAdminSessionToken,
} from "@/lib/auth/token";
import { resolveSessionRole, type SessionUser, type UserRole } from "@/lib/auth/types";

type LoginResult =
  | {
      ok: true;
      username: string;
      role: UserRole;
    }
  | {
      ok: false;
      reason: "invalid" | "locked" | "not-configured";
      retryAfterSeconds?: number;
      remainingAttempts?: number;
    };

type LoginAttemptRecord = {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number;
};

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const ADMIN_SESSION_REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const LOGIN_DELAY_MS = 700;

function normalizeEnvValue(value: string) {
  const cleaned = value.replace(/\uFEFF/g, "").replace(/\r/g, "").trim();

  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    return cleaned.slice(1, -1).trim();
  }

  return cleaned;
}

function getConfiguredAdminUsername() {
  return normalizeEnvValue(process.env.ADMIN_USERNAME || "");
}

function getConfiguredAdminPassword() {
  return normalizeEnvValue(process.env.ADMIN_PASSWORD || "");
}

function getConfiguredAdminPasswordHash() {
  return normalizeEnvValue(process.env.ADMIN_PASSWORD_HASH || "");
}

function getConfiguredOfficeUsername() {
  return normalizeEnvValue(process.env.OFFICE_USERNAME || "");
}

function getConfiguredOfficePassword() {
  return normalizeEnvValue(process.env.OFFICE_PASSWORD || "");
}

function getConfiguredOfficePasswordHash() {
  return normalizeEnvValue(process.env.OFFICE_PASSWORD_HASH || "");
}

function getConfiguredSessionSecret() {
  return (process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
}

export function getAdminSessionCookieOptions(maxAgeSeconds = ADMIN_SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    priority: "high" as const,
    maxAge: maxAgeSeconds,
  };
}

export function getAdminSessionMaxAgeSeconds(remember = false) {
  return remember ? ADMIN_SESSION_REMEMBER_MAX_AGE_SECONDS : ADMIN_SESSION_MAX_AGE_SECONDS;
}

function safeEqual(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function verifyPasswordHash(password: string, storedHash: string) {
  const [scheme, salt, hash] = storedHash.split(":");

  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");

  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}

function usernamesMatch(input: string, expected: string) {
  return input.trim().toLowerCase() === expected.trim().toLowerCase();
}

function passwordsMatch(password: string, passwordHash: string, plainPassword: string) {
  if (passwordHash && verifyPasswordHash(password, passwordHash)) {
    return true;
  }

  if (plainPassword) {
    return safeEqual(password, plainPassword);
  }

  return false;
}

function verifyCredentials({
  username,
  password,
  expectedUsername,
  passwordHash,
  plainPassword,
}: {
  username: string;
  password: string;
  expectedUsername: string;
  passwordHash: string;
  plainPassword: string;
}) {
  if (!expectedUsername) {
    return false;
  }

  return (
    usernamesMatch(username, expectedUsername) &&
    passwordsMatch(password, passwordHash, plainPassword)
  );
}

function getRateLimitStore() {
  const key = "__phoenixAdminLoginRateLimit";
  const globalScope = globalThis as typeof globalThis & {
    __phoenixAdminLoginRateLimit?: Map<string, LoginAttemptRecord>;
  };

  if (!globalScope[key]) {
    globalScope[key] = new Map<string, LoginAttemptRecord>();
  }

  return globalScope[key];
}

function getRateLimitKey(clientIp: string) {
  return clientIp || "unknown";
}

async function waitForDelay(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function officeAuthIsConfigured() {
  return Boolean(
    getConfiguredOfficeUsername() &&
      (getConfiguredOfficePasswordHash() || getConfiguredOfficePassword()),
  );
}

export async function verifyAdminLoginAttempt({
  username,
  password,
  clientIp,
}: {
  username: string;
  password: string;
  clientIp: string;
}): Promise<LoginResult> {
  if (!authIsConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  const rateLimitStore = getRateLimitStore();
  const rateLimitKey = getRateLimitKey(clientIp);
  const currentAttempt = rateLimitStore.get(rateLimitKey);
  const now = Date.now();

  if (currentAttempt?.lockedUntil && currentAttempt.lockedUntil > now) {
    return {
      ok: false,
      reason: "locked",
      retryAfterSeconds: Math.ceil((currentAttempt.lockedUntil - now) / 1000),
    };
  }

  await waitForDelay(LOGIN_DELAY_MS);

  const normalizedUsername = username.trim();

  if (
    verifyCredentials({
      username: normalizedUsername,
      password,
      expectedUsername: getConfiguredAdminUsername(),
      passwordHash: getConfiguredAdminPasswordHash(),
      plainPassword: getConfiguredAdminPassword(),
    })
  ) {
    rateLimitStore.delete(rateLimitKey);
    return { ok: true, username: getConfiguredAdminUsername(), role: "admin" };
  }

  if (
    officeAuthIsConfigured() &&
    verifyCredentials({
      username: normalizedUsername,
      password,
      expectedUsername: getConfiguredOfficeUsername(),
      passwordHash: getConfiguredOfficePasswordHash(),
      plainPassword: getConfiguredOfficePassword(),
    })
  ) {
    rateLimitStore.delete(rateLimitKey);
    return { ok: true, username: getConfiguredOfficeUsername(), role: "office" };
  }

  const withinWindow = currentAttempt && now - currentAttempt.firstAttemptAt < LOGIN_WINDOW_MS;
  const nextAttempt: LoginAttemptRecord = withinWindow
    ? {
        ...currentAttempt,
        count: currentAttempt.count + 1,
      }
    : {
        count: 1,
        firstAttemptAt: now,
        lockedUntil: 0,
      };

  if (nextAttempt.count >= MAX_LOGIN_ATTEMPTS) {
    nextAttempt.lockedUntil = now + LOGIN_LOCK_MS;
  }

  rateLimitStore.set(rateLimitKey, nextAttempt);

  if (nextAttempt.lockedUntil > now) {
    return {
      ok: false,
      reason: "locked",
      retryAfterSeconds: Math.ceil((nextAttempt.lockedUntil - now) / 1000),
    };
  }

  return {
    ok: false,
    reason: "invalid",
    remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - nextAttempt.count),
  };
}

export async function buildAdminSessionCookie(
  username: string,
  role: UserRole,
  options?: { remember?: boolean },
) {
  const maxAgeSeconds = getAdminSessionMaxAgeSeconds(options?.remember);

  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: await createAdminSessionToken({
      username,
      role,
      expiresAt: Date.now() + maxAgeSeconds * 1000,
    }),
    options: getAdminSessionCookieOptions(maxAgeSeconds),
  };
}

export async function createAdminSession(username: string, role: UserRole, options?: { remember?: boolean }) {
  const cookieStore = await cookies();
  const sessionCookie = await buildAdminSessionCookie(username, role, options);
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = await readAdminSessionToken(token);

  if (!session) {
    return null;
  }

  return {
    username: session.username,
    role: resolveSessionRole(session.role),
  };
}

/** @deprecated Use getSession() instead. */
export async function getAdminSession(): Promise<SessionUser | null> {
  return getSession();
}

export function authIsConfigured() {
  return Boolean(
    getConfiguredAdminUsername() &&
      (getConfiguredAdminPasswordHash() || getConfiguredAdminPassword()) &&
      getConfiguredSessionSecret(),
  );
}
