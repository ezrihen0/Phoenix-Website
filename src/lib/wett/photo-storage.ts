import "server-only";

import { randomUUID } from "node:crypto";

import type { WettPhoto } from "@/lib/wett/schema";
import { readPrivateWettBytes, writePrivateWettBytes } from "@/lib/wett/storage";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

const PHOTO_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);

const WETT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isWettRecordId(value: string) {
  return WETT_ID.test(value);
}

export function wettPhotoStorageKey(reportId: string, photoId: string, extension: string) {
  if (!isWettRecordId(reportId) || !isWettRecordId(photoId)) {
    throw new Error("Invalid WETT photo path.");
  }

  return `wett/reports/${reportId}/photos/${photoId}.${extension}`;
}

export function wettPdfStorageKey(reportId: string) {
  if (!isWettRecordId(reportId)) {
    throw new Error("Invalid WETT report path.");
  }

  return `wett/reports/${reportId}/pdf/report.pdf`;
}

export function assertWettPhotoFile(file: File) {
  const extension = PHOTO_TYPES.get(file.type);

  if (!extension) {
    throw new Error("Upload a JPEG, PNG, WebP, or HEIC photo.");
  }

  if (file.size <= 0 || file.size > MAX_PHOTO_BYTES) {
    throw new Error("Photos must be 8 MB or smaller.");
  }

  return extension;
}

export async function storeWettPhoto(input: {
  reportId: string;
  username: string;
  file: File;
  caption?: string;
}) {
  const extension = assertWettPhotoFile(input.file);
  const photoId = randomUUID();
  const storageKey = wettPhotoStorageKey(input.reportId, photoId, extension);
  const bytes = new Uint8Array(await input.file.arrayBuffer());

  if (bytes.byteLength !== input.file.size) {
    throw new Error("The photo upload was incomplete. Try again.");
  }

  await writePrivateWettBytes(storageKey, bytes, input.file.type);

  const photo: WettPhoto = {
    id: photoId,
    storageKey,
    contentType: input.file.type,
    byteSize: bytes.byteLength,
    caption: input.caption,
    createdAt: new Date().toISOString(),
    createdBy: input.username,
  };

  return photo;
}

export async function readWettPhotoBytes(storageKey: string) {
  if (!/^wett\/reports\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/photos\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp|heic|heif)$/i.test(storageKey)) {
    return null;
  }

  return readPrivateWettBytes(storageKey);
}
