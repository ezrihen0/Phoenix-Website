import "server-only";

import { get, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";

import {
  isProtectedJsonEnvelope,
  protectJson,
  unprotectJson,
} from "@/lib/cms/secure-json";
import {
  emptyWettIndex,
  parseWettIndex,
  parseWettReport,
  type WettIndexFile,
  type WettReport,
} from "@/lib/wett/schema";

const IS_VERCEL_RUNTIME = Boolean(process.env.VERCEL);
const ALLOW_LOCAL_STORAGE = !IS_VERCEL_RUNTIME || process.env.ALLOW_LOCAL_CMS_STORAGE === "1";
const LOCAL_ROOT = IS_VERCEL_RUNTIME
  ? path.join(process.env.TMPDIR || "/tmp", "papoon_fireplacerepair", "wett")
  : path.join(process.cwd(), "data", "cms", "wett");

export const WETT_INDEX_KEY = "wett/reports/index.json";

const globalLock = globalThis as typeof globalThis & {
  __phoenixWettWriteLock?: Promise<void>;
};

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
}

function usesBlobStorage() {
  return Boolean(getBlobToken());
}

function assertWettStorageConfigured() {
  if (!usesBlobStorage() && !ALLOW_LOCAL_STORAGE) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for WETT report storage in Vercel deployments.");
  }
}

function localPathForKey(key: string) {
  const relative = key.replace(/^wett\//, "");
  const root = path.resolve(LOCAL_ROOT);
  const resolved = path.resolve(root, relative);
  const relativeToRoot = path.relative(root, resolved);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    throw new Error("Invalid WETT storage key.");
  }

  return resolved;
}

export async function withWettLock<T>(operation: () => Promise<T>) {
  const previous = globalLock.__phoenixWettWriteLock ?? Promise.resolve();
  let release = () => {};
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });

  globalLock.__phoenixWettWriteLock = previous.then(() => current, () => current);
  await previous;

  try {
    return await operation();
  } finally {
    release();
  }
}

async function readProtectedValue(key: string): Promise<unknown | null> {
  assertWettStorageConfigured();

  if (!usesBlobStorage()) {
    try {
      const payload = JSON.parse(await fs.readFile(localPathForKey(key), "utf8")) as unknown;
      const decrypted = unprotectJson(payload);

      if (decrypted !== null) {
        return decrypted;
      }

      if (isProtectedJsonEnvelope(payload)) {
        throw new Error(
          "Protected WETT data could not be decrypted. Confirm ADMIN_SESSION_SECRET matches the secret used to store this file.",
        );
      }

      return null;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }

      throw error;
    }
  }

  const token = getBlobToken();
  const blob = await get(key, {
    access: "private",
    token,
    useCache: false,
  });

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return null;
  }

  const payload = (await new Response(blob.stream).json()) as unknown;
  const decrypted = unprotectJson(payload);

  if (decrypted !== null) {
    return decrypted;
  }

  if (isProtectedJsonEnvelope(payload)) {
    throw new Error(
      "Protected WETT data could not be decrypted. Confirm ADMIN_SESSION_SECRET matches the secret used to store this file.",
    );
  }

  return null;
}

async function writeProtectedValue(key: string, value: unknown) {
  assertWettStorageConfigured();
  const envelope = JSON.stringify(protectJson(value));

  if (!usesBlobStorage()) {
    const filePath = localPathForKey(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, envelope, "utf8");
    return;
  }

  await put(key, envelope, {
    access: "private",
    token: getBlobToken(),
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    contentType: "application/json; charset=utf-8",
  });
}

export async function readWettIndex() {
  const value = await readProtectedValue(WETT_INDEX_KEY);
  return value ? parseWettIndex(value) : emptyWettIndex();
}

export async function writeWettIndex(index: WettIndexFile) {
  await writeProtectedValue(WETT_INDEX_KEY, index);
}

export function wettReportKey(reportId: string) {
  return `wett/reports/${reportId}/report.json`;
}

export function wettCompletedKey(reportId: string) {
  return `wett/reports/${reportId}/completed.json`;
}

export async function readWettReport(reportId: string) {
  const value = await readProtectedValue(wettReportKey(reportId));
  return value ? parseWettReport(value) : null;
}

export async function writeWettReport(report: WettReport) {
  await writeProtectedValue(wettReportKey(report.id), parseWettReport(report));
}

export async function readCompletedWettReport(reportId: string) {
  const value = await readProtectedValue(wettCompletedKey(reportId));
  return value ? parseWettReport(value) : null;
}

export async function writeCompletedWettReport(report: WettReport) {
  await writeProtectedValue(wettCompletedKey(report.id), parseWettReport(report));
}

export async function writePrivateWettBytes(key: string, bytes: Uint8Array, contentType: string) {
  assertWettStorageConfigured();

  if (!key.startsWith("wett/reports/") || key.includes("..")) {
    throw new Error("Invalid WETT storage key.");
  }

  if (!usesBlobStorage()) {
    const filePath = localPathForKey(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, bytes);
    return;
  }

  await put(key, Buffer.from(bytes), {
    access: "private",
    token: getBlobToken(),
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    contentType,
  });
}

export async function readPrivateWettBytes(key: string) {
  assertWettStorageConfigured();

  if (!key.startsWith("wett/reports/") || key.includes("..")) {
    throw new Error("Invalid WETT storage key.");
  }

  if (!usesBlobStorage()) {
    try {
      const bytes = await fs.readFile(localPathForKey(key));
      return new Uint8Array(bytes);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }

      throw error;
    }
  }

  const blob = await get(key, {
    access: "private",
    token: getBlobToken(),
    useCache: false,
  });

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return null;
  }

  return new Uint8Array(await new Response(blob.stream).arrayBuffer());
}
