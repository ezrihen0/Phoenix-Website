import "server-only";

import { get, list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";

import { defaultCitySlug, getCityBySlug, type CitySlug } from "@/lib/cities";
import { defaultArticles, defaultSiteSettings } from "@/lib/cms/defaults";
import { getArticleSortTimestamp } from "@/lib/cms/helpers";
import {
  isProtectedJsonEnvelope,
  protectJson,
  shouldRewrapProtectedJson,
  unprotectJson,
} from "@/lib/cms/secure-json";
import type {
  Article,
  Lead,
  LeadDisposition,
  LeadDispositionReason,
  OfficeDailyStateRecord,
  OfficeDailyStateStore,
  PublicSiteSettings,
  SiteSettings,
  WizfieldPortalAccessStatus,
  WizfieldSyncStatus,
} from "@/lib/cms/types";
import { sanitizeWeatherTags } from "@/lib/weather/content-tags";
import { OFFICE_DAILY_STATE_RETENTION_DAYS } from "@/lib/office/constants";
import { pruneOfficeDailyStateRecords } from "@/lib/office/daily-state";
import type { EvidenceRecord, PublicEvidence } from "@/lib/evidence";
import { EVIDENCE_TYPE_VALUES, toPublicEvidence } from "@/lib/evidence";

const LOCAL_DATA_DIR = Boolean(process.env.VERCEL)
  ? path.join(process.env.TMPDIR || "/tmp", "papoon_fireplacerepair", "cms")
  : path.join(process.cwd(), "data", "cms");
const LOCAL_ARTICLES_FILE = path.join(LOCAL_DATA_DIR, "articles.json");
const LOCAL_EVIDENCE_FILE = path.join(LOCAL_DATA_DIR, "evidence.json");
const LOCAL_LEADS_FILE = path.join(LOCAL_DATA_DIR, "leads.json");
const LOCAL_SETTINGS_FILE = path.join(LOCAL_DATA_DIR, "settings.json");
const LOCAL_OFFICE_DAILY_STATE_FILE = path.join(LOCAL_DATA_DIR, "office-daily-state.json");
const REMOTE_ARTICLES_KEY = "cms/articles.json";
const REMOTE_ARTICLE_SNAPSHOT_PREFIX = "cms/articles.snapshot.";
const REMOTE_EVIDENCE_KEY = "cms/evidence.json";
const REMOTE_LEADS_KEY = "cms/leads.json";
const REMOTE_SETTINGS_KEY = "cms/settings.json";
const REMOTE_OFFICE_DAILY_STATE_KEY = "cms/office-daily-state.json";
const REMOTE_BLOB_ACCESS = process.env.BLOB_STORE_ACCESS === "public" ? "public" : "private";
const IS_VERCEL_RUNTIME = Boolean(process.env.VERCEL);
const ALLOW_LOCAL_CMS_STORAGE = !IS_VERCEL_RUNTIME || process.env.ALLOW_LOCAL_CMS_STORAGE === "1";
const CANONICAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || undefined;

export type CmsStorageMode = "blob" | "local" | "local-fallback" | "misconfigured";

export type CmsStorageStatus = {
  mode: CmsStorageMode;
  healthy: boolean;
  tone: "success" | "warning" | "error";
  label: string;
  title: string;
  message: string;
};

type ListArticlesOptions = {
  includeDrafts?: boolean;
  city?: CitySlug;
  scope?: "general" | "city";
};

type GetArticleOptions = {
  includeDrafts?: boolean;
  city?: CitySlug;
  scope?: "general" | "city";
};

type ListEvidenceOptions = {
  status?: EvidenceRecord["status"];
  city?: CitySlug;
  serviceSlug?: string;
};

type ListPublicEvidenceOptions = {
  city?: CitySlug;
  serviceSlug?: string;
  limit?: number;
};

type ListLeadsOptions = {
  city?: CitySlug;
};

function getBlobReadWriteToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  return token || undefined;
}

function hasBlobStorage() {
  return Boolean(getBlobReadWriteToken());
}

function assertCmsStorageConfigured() {
  if (!hasBlobStorage() && !ALLOW_LOCAL_CMS_STORAGE) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for CMS storage in Vercel deployments.");
  }
}

function getBlobBaseOptions() {
  const token = getBlobReadWriteToken();
  const access: "public" | "private" = REMOTE_BLOB_ACCESS;

  return token
    ? { access, token }
    : { access };
}

function getBlobReadOptions() {
  const options = getBlobBaseOptions();

  // CMS JSON files are overwritten in place, so cached reads can serve stale data.
  return {
    ...options,
    useCache: false,
  };
}

async function ensureLocalDataDir() {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
}

async function readLocalJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as T;
  } catch {
    await ensureLocalDataDir();
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function writeLocalJson(filePath: string, value: unknown) {
  await ensureLocalDataDir();
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function readRemoteJson<T>(
  key: string,
  fallback: T,
  options?: { protectedData?: boolean },
): Promise<T> {
  const blob = await get(key, getBlobReadOptions());

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    await writeRemoteJson(key, fallback, options);
    return fallback;
  }

  try {
    const payload = (await new Response(blob.stream).json()) as unknown;

    if (options?.protectedData) {
      const decrypted = unprotectJson<T>(payload);

      if (decrypted !== null) {
        if (shouldRewrapProtectedJson(payload)) {
          await writeRemoteJson(key, decrypted, options);
        }

        return decrypted;
      }

      if (isProtectedJsonEnvelope(payload)) {
        throw new Error(
          "Protected CMS data could not be decrypted. Confirm ADMIN_SESSION_SECRET matches the secret used to store this file.",
        );
      }
    }

    if (isProtectedJsonEnvelope(payload)) {
      throw new Error("Protected CMS data was found where plain JSON was expected.");
    }

    return payload as T;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Protected CMS data")) {
      throw error;
    }

    return fallback;
  }
}

async function writeRemoteJson(
  key: string,
  value: unknown,
  options?: { protectedData?: boolean },
) {
  const payload = options?.protectedData ? protectJson(value) : value;

  await put(key, JSON.stringify(payload, null, 2), {
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    ...getBlobBaseOptions(),
    contentType: "application/json; charset=utf-8",
  });
}

function asArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value : fallback;
}

function sortArticles(articles: Article[]) {
  return [...articles].sort((first, second) => {
    return (
      new Date(getArticleSortTimestamp(second)).getTime() -
      new Date(getArticleSortTimestamp(first)).getTime()
    );
  });
}

function sortEvidence(evidence: EvidenceRecord[]) {
  return [...evidence].sort((first, second) => {
    const firstTimestamp = first.publishedAt || first.updatedAt || first.createdAt;
    const secondTimestamp = second.publishedAt || second.updatedAt || second.createdAt;
    return new Date(secondTimestamp).getTime() - new Date(firstTimestamp).getTime();
  });
}

function sortLeads(leads: Lead[]) {
  return [...leads].sort((first, second) => {
    return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
  });
}

function normalizeArticleRecord(article: Article & { city?: string; scope?: string }) {
  const hasCity = Boolean(getCityBySlug(article.city || ""));
  const scope: Article["scope"] =
    article.scope === "city" || (article.scope !== "general" && hasCity) ? "city" : "general";
  const city = scope === "city" ? getCityBySlug(article.city || "")?.slug : undefined;
  const createdAt = article.createdAt || article.updatedAt || new Date().toISOString();
  const updatedAt = article.updatedAt || createdAt;
  const status =
    article.status === "scheduled" || article.status === "published"
      ? article.status
      : "draft";
  const scheduledAt =
    status === "scheduled" && article.scheduledAt?.trim()
      ? article.scheduledAt
      : undefined;
  const publishedAt =
    status === "published"
      ? article.publishedAt || updatedAt || createdAt
      : "";

  return {
    ...article,
    scope,
    city,
    keywords: article.keywords || [],
    relatedSlugs: article.relatedSlugs || [],
    relatedServiceSlugs: article.relatedServiceSlugs || [],
    weatherTags: Array.isArray(article.weatherTags)
      ? sanitizeWeatherTags(article.weatherTags)
      : sanitizeWeatherTags(defaultArticles.find((seed) => seed.id === article.id)?.weatherTags),
    authorName: article.authorName || defaultSiteSettings.defaultAuthorName,
    authorType: article.authorType === "person" ? "person" : "organization",
    coverImage: article.coverImage || undefined,
    coverImageAlt: article.coverImageAlt || undefined,
    status,
    scheduledAt,
    createdAt,
    updatedAt,
    publishedAt,
    aiGenerated: Boolean(article.aiGenerated),
  } satisfies Article;
}

function normalizeEvidenceRecord(record: Partial<EvidenceRecord> & { jobCity?: string }) {
  const city = getCityBySlug(record.jobCity || "")?.slug || defaultCitySlug;
  const now = new Date().toISOString();
  const evidenceType = EVIDENCE_TYPE_VALUES.includes(
    record.evidenceType as (typeof EVIDENCE_TYPE_VALUES)[number],
  )
    ? (record.evidenceType as EvidenceRecord["evidenceType"])
    : "mixed";

  return {
    id: record.id || crypto.randomUUID(),
    status: record.status || "draft",
    serviceSlugs: Array.isArray(record.serviceSlugs) ? record.serviceSlugs.filter(Boolean) : [],
    jobCity: city,
    evidenceType,
    publicData: {
      summaryLabel: record.publicData?.summaryLabel?.trim() || undefined,
      homeownerProblem: record.publicData?.homeownerProblem?.trim() || undefined,
      inspected: record.publicData?.inspected?.trim() || undefined,
      observed: record.publicData?.observed?.trim() || undefined,
      found: record.publicData?.found?.trim() || undefined,
      workPerformed: record.publicData?.workPerformed?.trim() || undefined,
      homeownerLesson: record.publicData?.homeownerLesson?.trim() || undefined,
    },
    internalData: {
      sourceNote: record.internalData?.sourceNote?.trim() || undefined,
      verificationNote: record.internalData?.verificationNote?.trim() || undefined,
      ownerNotes: record.internalData?.ownerNotes?.trim() || undefined,
      internalLocationNote: record.internalData?.internalLocationNote?.trim() || undefined,
    },
    images: Array.isArray(record.images)
      ? record.images.map((image) => ({
          id: image.id || crypto.randomUUID(),
          source: image.source || "site-asset",
          url: image.url?.trim() || "",
          isPrimary: Boolean(image.isPrimary),
          pairRole: image.pairRole === "before" || image.pairRole === "after" ? image.pairRole : "other",
          publicAlt: image.publicAlt?.trim() || undefined,
          publicCaption: image.publicCaption?.trim() || undefined,
          internalSourceDescription: image.internalSourceDescription?.trim() || undefined,
          approvedForPublic: Boolean(image.approvedForPublic),
        }))
      : [],
    ownerVerified: Boolean(record.ownerVerified),
    publicApproved: Boolean(record.publicApproved),
    jobDate: record.jobDate?.trim() || undefined,
    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || record.createdAt || now,
    approvedAt: record.approvedAt || undefined,
    publishedAt: record.publishedAt || undefined,
  } satisfies EvidenceRecord;
}

function normalizeLeadRecord(lead: Lead & { city?: string }) {
  const city = getCityBySlug(lead.city || "")?.slug || defaultCitySlug;
  const disposition = normalizeLeadDisposition(lead.disposition);

  return {
    ...lead,
    city,
    disposition,
    dispositionReason:
      disposition === "not-added" ? normalizeLeadDispositionReason(lead.dispositionReason) : undefined,
    officeNote: lead.officeNote?.trim() || undefined,
    handledAt: lead.handledAt,
    handledBy: lead.handledBy?.trim() || undefined,
    wizfieldSyncStatus: normalizeWizfieldSyncStatus(lead.wizfieldSyncStatus),
    wizfieldCustomerId: lead.wizfieldCustomerId?.trim() || undefined,
    wizfieldLeadId: lead.wizfieldLeadId?.trim() || undefined,
    wizfieldPortalAccessStatus: normalizeWizfieldPortalAccessStatus(lead.wizfieldPortalAccessStatus),
    wizfieldPortalAccessExpiresAt: lead.wizfieldPortalAccessExpiresAt?.trim() || undefined,
    wizfieldLastSyncAt: lead.wizfieldLastSyncAt?.trim() || undefined,
    wizfieldSyncError: lead.wizfieldSyncError?.trim() || undefined,
  } satisfies Lead;
}

function normalizeWizfieldSyncStatus(value?: WizfieldSyncStatus): WizfieldSyncStatus {
  if (value === "synced" || value === "failed" || value === "not_attempted") {
    return value;
  }

  return "not_attempted";
}

function normalizeWizfieldPortalAccessStatus(
  value?: WizfieldPortalAccessStatus,
): WizfieldPortalAccessStatus | undefined {
  if (
    value === "sent" ||
    value === "already_sent" ||
    value === "pending_email" ||
    value === "email_failed" ||
    value === "not_requested"
  ) {
    return value;
  }

  return undefined;
}

function normalizeLeadDisposition(value?: LeadDisposition): LeadDisposition {
  if (value === "added-to-calendar" || value === "not-added" || value === "pending") {
    return value;
  }

  return "pending";
}

function normalizeLeadDispositionReason(value?: LeadDispositionReason): LeadDispositionReason | undefined {
  if (
    value === "customer-no-response" ||
    value === "customer-declined" ||
    value === "service-not-accepted"
  ) {
    return value;
  }

  return undefined;
}

function normalizeSettingsRecord(
  settings?: Partial<SiteSettings> & {
    leadNotificationEmail?: string;
    senderEmail?: string;
    bookingLabel?: string;
    workizUrl?: string;
  },
) {
  if (!settings) {
    return settings;
  }

  const { leadNotificationEmail, senderEmail, bookingLabel: _bookingLabel, workizUrl: _workizUrl, ...rest } =
    settings;

  return {
    ...rest,
    sendingEmail:
      rest.sendingEmail || senderEmail || rest.email || defaultSiteSettings.sendingEmail,
    notificationEmail:
      rest.notificationEmail ||
      leadNotificationEmail ||
      rest.sendingEmail ||
      senderEmail ||
      rest.email ||
      defaultSiteSettings.notificationEmail,
  } satisfies Partial<SiteSettings>;
}

export function getCmsStorageStatus(): CmsStorageStatus {
  if (hasBlobStorage()) {
    return {
      mode: "blob",
      healthy: true,
      tone: "success",
      label: "Blob connected",
      title: "Shared Blob storage is healthy.",
      message: "Admin content is using shared Vercel Blob storage, so article and settings changes persist across requests.",
    };
  }

  if (ALLOW_LOCAL_CMS_STORAGE) {
    if (IS_VERCEL_RUNTIME) {
      return {
        mode: "local-fallback",
        healthy: false,
        tone: "warning",
        label: "Local fallback",
        title: "Shared Blob storage is unavailable.",
        message:
          "This Vercel deployment is using instance-local fallback storage. Generated articles and saved changes can disappear between requests, so admin write actions should stay paused until Blob storage is restored.",
      };
    }

    return {
      mode: "local",
      healthy: true,
      tone: "success",
      label: "Local development",
      title: "Local CMS storage is active.",
      message: "This is expected in local development, where admin content is stored on the local filesystem.",
    };
  }

  return {
    mode: "misconfigured",
    healthy: false,
    tone: "error",
    label: "Blob missing",
    title: "Blob storage is misconfigured.",
    message:
      "BLOB_READ_WRITE_TOKEN is missing on this Vercel deployment. Admin reads and writes are blocked until Blob storage is configured and the site is redeployed.",
  };
}

export function getCmsStorageMode() {
  return getCmsStorageStatus().mode;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  assertCmsStorageConfigured();
  noStore();

  if (hasBlobStorage()) {
    const remoteSettings = await readRemoteJson(REMOTE_SETTINGS_KEY, defaultSiteSettings, {
      protectedData: true,
    });

    return {
      ...defaultSiteSettings,
      ...normalizeSettingsRecord(remoteSettings),
      siteUrl: CANONICAL_SITE_URL || normalizeSettingsRecord(remoteSettings)?.siteUrl || defaultSiteSettings.siteUrl,
    };
  }

  const localSettings = await readLocalJson(LOCAL_SETTINGS_FILE, defaultSiteSettings);

  return {
    ...defaultSiteSettings,
    ...normalizeSettingsRecord(localSettings),
    siteUrl: CANONICAL_SITE_URL || normalizeSettingsRecord(localSettings)?.siteUrl || defaultSiteSettings.siteUrl,
  };
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const settings = await getSiteSettings();

  return {
    businessName: settings.businessName,
    legalName: settings.legalName,
    siteUrl: settings.siteUrl,
    phoneDisplay: settings.phoneDisplay,
    phoneHref: settings.phoneHref,
    email: settings.email,
    hoursLabel: settings.hoursLabel,
    hoursDetail: settings.hoursDetail,
    serviceRadius: settings.serviceRadius,
    mapEmbedUrl: settings.mapEmbedUrl,
    socialPreview: settings.socialPreview,
    defaultAuthorName: settings.defaultAuthorName,
    blogIndexTitle: settings.blogIndexTitle,
    blogIndexDescription: settings.blogIndexDescription,
    googleRating: settings.googleRating,
    googleReviewCount: settings.googleReviewCount,
    googleReviewsUrl: settings.googleReviewsUrl,
  };
}

export async function saveSiteSettings(settings: SiteSettings) {
  assertCmsStorageConfigured();

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_SETTINGS_KEY, settings, { protectedData: true });
    return;
  }

  await writeLocalJson(LOCAL_SETTINGS_FILE, settings);
}

export async function listArticles(options?: ListArticlesOptions) {
  assertCmsStorageConfigured();
  noStore();

  const fallback = sortArticles(defaultArticles);

  const articles = asArray(
    hasBlobStorage()
      ? await readRemoteJson<Array<Article & { city?: string }>>(REMOTE_ARTICLES_KEY, fallback)
      : await readLocalJson<Array<Article & { city?: string }>>(LOCAL_ARTICLES_FILE, fallback),
    fallback,
  );
  const mergedArticles = [...articles];

  for (const defaultArticle of fallback) {
    if (!mergedArticles.some((article) => article.id === defaultArticle.id)) {
      mergedArticles.push(defaultArticle);
    }
  }

  const sorted = sortArticles(mergedArticles.map(normalizeArticleRecord));
  const filtered = sorted.filter((article) => {
    if (options?.scope === "general") {
      return article.scope === "general";
    }

    if (options?.city) {
      return article.scope === "city" && article.city === options.city;
    }

    if (options?.scope === "city") {
      return article.scope === "city";
    }

    return true;
  });

  if (options?.includeDrafts) {
    return filtered;
  }

  return filtered.filter((article) => article.status === "published");
}

export async function getArticleBySlug(
  slug: string,
  options?: GetArticleOptions,
) {
  assertCmsStorageConfigured();
  noStore();

  const articles = await listArticles({
    includeDrafts: true,
    city: options?.city,
    scope: options?.scope || (options?.city ? "city" : "general"),
  });
  const article = articles.find((entry) => entry.slug === slug);

  if (!article) {
    return null;
  }

  if (!options?.includeDrafts && article.status !== "published") {
    return null;
  }

  return article;
}

export async function getArticleById(id: string, options?: { includeDrafts?: boolean }) {
  assertCmsStorageConfigured();
  noStore();

  const articles = await listArticles({ includeDrafts: true });
  const article = articles.find((entry) => entry.id === id);

  if (!article) {
    return null;
  }

  if (!options?.includeDrafts && article.status !== "published") {
    return null;
  }

  return article;
}

export async function saveArticle(article: Article) {
  assertCmsStorageConfigured();

  const normalizedArticle = normalizeArticleRecord(article);
  const articles = await listArticles({ includeDrafts: true });
  const conflict = articles.find(
    (entry) =>
      entry.id !== normalizedArticle.id &&
      entry.city === normalizedArticle.city &&
      entry.slug === normalizedArticle.slug,
  );

  if (conflict) {
    throw new Error(
      `An article with the slug "${normalizedArticle.slug}" already exists for ${normalizedArticle.city}.`,
    );
  }

  const existingIndex = articles.findIndex((entry) => entry.id === normalizedArticle.id);
  const nextArticles = [...articles];

  if (existingIndex >= 0) {
    nextArticles.splice(existingIndex, 1, normalizedArticle);
  } else {
    nextArticles.push(normalizedArticle);
  }

  const sorted = sortArticles(nextArticles);

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_ARTICLES_KEY, sorted);
    return;
  }

  await writeLocalJson(LOCAL_ARTICLES_FILE, sorted);
}

export async function deleteArticle(slug: string, city: CitySlug = defaultCitySlug) {
  assertCmsStorageConfigured();

  const articles = await listArticles({ includeDrafts: true });
  const nextArticles = articles.filter(
    (article) => !(article.slug === slug && article.city === city),
  );

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_ARTICLES_KEY, nextArticles);
    return;
  }

  await writeLocalJson(LOCAL_ARTICLES_FILE, nextArticles);
}

export async function deleteArticleById(id: string) {
  assertCmsStorageConfigured();

  const articles = await listArticles({ includeDrafts: true });
  const nextArticles = articles.filter((article) => article.id !== id);

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_ARTICLES_KEY, nextArticles);
    return;
  }

  await writeLocalJson(LOCAL_ARTICLES_FILE, nextArticles);
}

async function readRawArticlesJson(): Promise<Array<Article & { city?: string }>> {
  if (hasBlobStorage()) {
    const blob = await get(REMOTE_ARTICLES_KEY, getBlobReadOptions());

    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      return [];
    }

    try {
      const payload = (await new Response(blob.stream).json()) as unknown;
      return asArray(payload, []);
    } catch {
      return [];
    }
  }

  try {
    const file = await fs.readFile(LOCAL_ARTICLES_FILE, "utf8");
    return asArray(JSON.parse(file) as unknown, []);
  } catch {
    return [];
  }
}

export async function readStoredArticlesRaw() {
  assertCmsStorageConfigured();
  noStore();

  const articles = await readRawArticlesJson();
  return sortArticles(articles.map(normalizeArticleRecord));
}

export async function writeStoredArticlesRaw(articles: Article[]) {
  assertCmsStorageConfigured();

  const sorted = sortArticles(articles.map(normalizeArticleRecord));

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_ARTICLES_KEY, sorted);
    return sorted;
  }

  await writeLocalJson(LOCAL_ARTICLES_FILE, sorted);
  return sorted;
}

function getSnapshotKey(timestamp: string) {
  return `${REMOTE_ARTICLE_SNAPSHOT_PREFIX}${timestamp}.json`;
}

function getLocalSnapshotPath(timestamp: string) {
  return path.join(LOCAL_DATA_DIR, `articles.snapshot.${timestamp}.json`);
}

export async function snapshotArticles() {
  assertCmsStorageConfigured();

  const articles = await readStoredArticlesRaw();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const snapshotKey = getSnapshotKey(timestamp);

  if (hasBlobStorage()) {
    await writeRemoteJson(snapshotKey, articles);
  } else {
    await writeLocalJson(getLocalSnapshotPath(timestamp), articles);
  }

  return {
    key: snapshotKey,
    timestamp,
    articleCount: articles.length,
  };
}

export async function listArticleSnapshots() {
  assertCmsStorageConfigured();
  noStore();

  if (hasBlobStorage()) {
    const result = await list({
      prefix: REMOTE_ARTICLE_SNAPSHOT_PREFIX,
      ...getBlobBaseOptions(),
    });

    return result.blobs
      .map((blob) => ({
        key: blob.pathname,
        uploadedAt: blob.uploadedAt.toISOString(),
      }))
      .sort((first, second) => second.uploadedAt.localeCompare(first.uploadedAt));
  }

  await ensureLocalDataDir();

  try {
    const files = await fs.readdir(LOCAL_DATA_DIR);
    return files
      .filter((file) => file.startsWith("articles.snapshot.") && file.endsWith(".json"))
      .map((file) => ({
        key: `cms/${file}`,
        uploadedAt: file.replace("articles.snapshot.", "").replace(".json", ""),
      }))
      .sort((first, second) => second.uploadedAt.localeCompare(first.uploadedAt));
  } catch {
    return [];
  }
}

async function readSnapshotArticles(snapshotKey: string) {
  if (hasBlobStorage()) {
    const blob = await get(snapshotKey, getBlobReadOptions());

    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      throw new Error(`Snapshot "${snapshotKey}" was not found.`);
    }

    const payload = (await new Response(blob.stream).json()) as unknown;
    return sortArticles(asArray(payload, []).map(normalizeArticleRecord));
  }

  const localFileName = path.basename(snapshotKey);
  const filePath = path.join(LOCAL_DATA_DIR, localFileName);
  const payload = JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
  return sortArticles(asArray(payload, []).map(normalizeArticleRecord));
}

export async function restoreArticleSnapshot(snapshotKey: string) {
  assertCmsStorageConfigured();

  const articles = await readSnapshotArticles(snapshotKey);
  return writeStoredArticlesRaw(articles);
}

export async function listEvidence(options?: ListEvidenceOptions) {
  assertCmsStorageConfigured();
  noStore();

  const fallback: EvidenceRecord[] = [];
  const evidence = asArray(
    hasBlobStorage()
      ? await readRemoteJson<Array<Partial<EvidenceRecord> & { jobCity?: string }>>(
          REMOTE_EVIDENCE_KEY,
          fallback,
          { protectedData: true },
        )
      : await readLocalJson<Array<Partial<EvidenceRecord> & { jobCity?: string }>>(
          LOCAL_EVIDENCE_FILE,
          fallback,
        ),
    fallback,
  );

  const sorted = sortEvidence(evidence.map(normalizeEvidenceRecord));

  return sorted.filter((record) => {
    if (options?.status && record.status !== options.status) {
      return false;
    }

    if (options?.city && record.jobCity !== options.city) {
      return false;
    }

    if (options?.serviceSlug && !record.serviceSlugs.includes(options.serviceSlug)) {
      return false;
    }

    return true;
  });
}

export async function getEvidenceById(id: string) {
  assertCmsStorageConfigured();
  noStore();

  const evidence = await listEvidence();
  return evidence.find((record) => record.id === id) || null;
}

export async function listPublicEvidence(
  options?: ListPublicEvidenceOptions,
): Promise<PublicEvidence[]> {
  const evidence = await listEvidence({
    status: "public",
    city: options?.city,
    serviceSlug: options?.serviceSlug,
  });
  const projected = evidence
    .map((record) => toPublicEvidence(record))
    .filter((record): record is PublicEvidence => record != null);

  return typeof options?.limit === "number" ? projected.slice(0, options.limit) : projected;
}

export async function saveEvidence(record: EvidenceRecord) {
  assertCmsStorageConfigured();

  const normalizedRecord = normalizeEvidenceRecord(record);
  const evidence = await listEvidence();
  const existingIndex = evidence.findIndex((entry) => entry.id === normalizedRecord.id);
  const nextEvidence = [...evidence];

  if (existingIndex >= 0) {
    nextEvidence.splice(existingIndex, 1, normalizedRecord);
  } else {
    nextEvidence.push(normalizedRecord);
  }

  const sorted = sortEvidence(nextEvidence);

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_EVIDENCE_KEY, sorted, { protectedData: true });
    return;
  }

  await writeLocalJson(LOCAL_EVIDENCE_FILE, sorted);
}

export async function listLeads(options?: ListLeadsOptions) {
  assertCmsStorageConfigured();
  noStore();

  const fallback: Lead[] = [];
  const leads = asArray(
    hasBlobStorage()
      ? await readRemoteJson<Array<Lead & { city?: string }>>(REMOTE_LEADS_KEY, fallback, {
          protectedData: true,
        })
      : await readLocalJson<Array<Lead & { city?: string }>>(LOCAL_LEADS_FILE, fallback),
    fallback,
  );

  const sorted = sortLeads(leads.map(normalizeLeadRecord));

  return options?.city ? sorted.filter((lead) => lead.city === options.city) : sorted;
}

export async function saveLead(lead: Lead) {
  assertCmsStorageConfigured();

  const normalizedLead = normalizeLeadRecord(lead);
  const leads = await listLeads();
  const nextLeads = sortLeads([
    normalizedLead,
    ...leads.filter((entry) => entry.id !== normalizedLead.id),
  ]);

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_LEADS_KEY, nextLeads, { protectedData: true });
    return;
  }

  await writeLocalJson(LOCAL_LEADS_FILE, nextLeads);
}

export type PublishDueScheduledArticlesResult = {
  published: Article[];
  skipped: Array<{ id: string; reason: string }>;
};

export async function publishDueScheduledArticles(): Promise<PublishDueScheduledArticlesResult> {
  assertCmsStorageConfigured();

  const now = new Date();
  const articles = await listArticles({ includeDrafts: true });
  const due = articles.filter(
    (article) =>
      article.status === "scheduled" &&
      article.scheduledAt &&
      new Date(article.scheduledAt).getTime() <= now.getTime(),
  );

  const published: Article[] = [];
  const skipped: Array<{ id: string; reason: string }> = [];

  for (const candidate of due) {
    const fresh = await getArticleById(candidate.id, { includeDrafts: true });

    if (!fresh) {
      skipped.push({ id: candidate.id, reason: "missing" });
      continue;
    }

    if (fresh.status !== "scheduled" || !fresh.scheduledAt) {
      skipped.push({ id: candidate.id, reason: "status-changed" });
      continue;
    }

    if (new Date(fresh.scheduledAt).getTime() > now.getTime()) {
      skipped.push({ id: candidate.id, reason: "not-due" });
      continue;
    }

    if (fresh.updatedAt !== candidate.updatedAt) {
      skipped.push({ id: candidate.id, reason: "concurrent-edit" });
      continue;
    }

    const nextArticle = normalizeArticleRecord({
      ...fresh,
      status: "published",
      publishedAt: fresh.scheduledAt,
      scheduledAt: undefined,
      updatedAt: now.toISOString(),
    });

    await saveArticle(nextArticle);
    published.push(nextArticle);
  }

  return { published, skipped };
}

function normalizeOfficeDailyStateRecord(record: OfficeDailyStateRecord): OfficeDailyStateRecord {
  return {
    ...record,
    username: record.username.trim(),
    date: record.date.slice(0, 10),
    checklist: Array.isArray(record.checklist) ? record.checklist : [],
    updatedAt: record.updatedAt || new Date().toISOString(),
  };
}

async function readOfficeDailyStateStore(): Promise<OfficeDailyStateStore> {
  assertCmsStorageConfigured();
  noStore();

  const fallback: OfficeDailyStateStore = { records: [] };
  const raw = hasBlobStorage()
    ? await readRemoteJson<OfficeDailyStateStore>(REMOTE_OFFICE_DAILY_STATE_KEY, fallback, {
        protectedData: true,
      })
    : await readLocalJson<OfficeDailyStateStore>(LOCAL_OFFICE_DAILY_STATE_FILE, fallback);

  return {
    records: asArray(raw?.records, fallback.records).map(normalizeOfficeDailyStateRecord),
  };
}

async function writeOfficeDailyStateStore(store: OfficeDailyStateStore) {
  const prunedRecords = pruneOfficeDailyStateRecords(
    store.records.map(normalizeOfficeDailyStateRecord),
    OFFICE_DAILY_STATE_RETENTION_DAYS,
  );

  const nextStore: OfficeDailyStateStore = { records: prunedRecords };

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_OFFICE_DAILY_STATE_KEY, nextStore, { protectedData: true });
    return;
  }

  await writeLocalJson(LOCAL_OFFICE_DAILY_STATE_FILE, nextStore);
}

export async function listOfficeDailyStateRecords() {
  const store = await readOfficeDailyStateStore();
  return store.records;
}

export async function getOfficeDailyState(date: string, username: string) {
  const records = await listOfficeDailyStateRecords();
  const dateKey = date.slice(0, 10);
  const normalizedUsername = username.trim().toLowerCase();

  return (
    records.find(
      (record) =>
        record.date === dateKey && record.username.trim().toLowerCase() === normalizedUsername,
    ) || null
  );
}

export async function saveOfficeDailyState(record: OfficeDailyStateRecord) {
  const normalizedRecord = normalizeOfficeDailyStateRecord({
    ...record,
    updatedAt: new Date().toISOString(),
  });
  const records = await listOfficeDailyStateRecords();
  const normalizedUsername = normalizedRecord.username.trim().toLowerCase();
  const nextRecords = [
    normalizedRecord,
    ...records.filter(
      (entry) =>
        !(
          entry.date === normalizedRecord.date &&
          entry.username.trim().toLowerCase() === normalizedUsername
        ),
    ),
  ];

  await writeOfficeDailyStateStore({ records: nextRecords });

  return normalizedRecord;
}

export async function listOfficeDailyStatesForDate(date: string) {
  const dateKey = date.slice(0, 10);
  const records = await listOfficeDailyStateRecords();
  return records.filter((record) => record.date === dateKey);
}