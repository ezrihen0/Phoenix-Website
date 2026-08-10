import "server-only";

import { get, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";

import { defaultCitySlug, getCityBySlug, type CitySlug } from "@/lib/cities";
import { defaultArticles, defaultSiteSettings } from "@/lib/cms/defaults";
import { protectJson, unprotectJson } from "@/lib/cms/secure-json";
import type { Article, Lead, PublicSiteSettings, SiteSettings } from "@/lib/cms/types";

const LOCAL_DATA_DIR = Boolean(process.env.VERCEL)
  ? path.join(process.env.TMPDIR || "/tmp", "papoon_fireplacerepair", "cms")
  : path.join(process.cwd(), "data", "cms");
const LOCAL_ARTICLES_FILE = path.join(LOCAL_DATA_DIR, "articles.json");
const LOCAL_LEADS_FILE = path.join(LOCAL_DATA_DIR, "leads.json");
const LOCAL_SETTINGS_FILE = path.join(LOCAL_DATA_DIR, "settings.json");
const REMOTE_ARTICLES_KEY = "cms/articles.json";
const REMOTE_LEADS_KEY = "cms/leads.json";
const REMOTE_SETTINGS_KEY = "cms/settings.json";
const REMOTE_BLOB_ACCESS = process.env.BLOB_STORE_ACCESS === "public" ? "public" : "private";
const JSON_BLOB_CACHE_TTL_SECONDS = 60;
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
};

type GetArticleOptions = {
  includeDrafts?: boolean;
  city?: CitySlug;
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
  return REMOTE_BLOB_ACCESS === "private"
    ? { ...options, useCache: false }
    : options;
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
      return unprotectJson<T>(payload) ?? (payload as T);
    }

    return payload as T;
  } catch {
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
    cacheControlMaxAge: JSON_BLOB_CACHE_TTL_SECONDS,
    ...getBlobBaseOptions(),
    contentType: "application/json; charset=utf-8",
  });
}

function sortArticles(articles: Article[]) {
  return [...articles].sort((first, second) => {
    return new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();
  });
}

function sortLeads(leads: Lead[]) {
  return [...leads].sort((first, second) => {
    return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
  });
}

function normalizeArticleRecord(article: Article & { city?: string }) {
  const city = getCityBySlug(article.city || "")?.slug || defaultCitySlug;

  return {
    ...article,
    city,
    keywords: article.keywords || [],
    relatedSlugs: article.relatedSlugs || [],
    authorName: article.authorName || defaultSiteSettings.defaultAuthorName,
    coverImage: article.coverImage || undefined,
    createdAt: article.createdAt || article.publishedAt || article.updatedAt,
    updatedAt: article.updatedAt || article.publishedAt || article.createdAt,
    publishedAt: article.publishedAt || article.updatedAt || article.createdAt,
    aiGenerated: Boolean(article.aiGenerated),
  } satisfies Article;
}

function normalizeLeadRecord(lead: Lead & { city?: string }) {
  const city = getCityBySlug(lead.city || "")?.slug || defaultCitySlug;

  return {
    ...lead,
    city,
  } satisfies Lead;
}

function normalizeSettingsRecord(
  settings?: Partial<SiteSettings> & { leadNotificationEmail?: string; senderEmail?: string },
) {
  if (!settings) {
    return settings;
  }

  const { leadNotificationEmail, senderEmail, ...rest } = settings;

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

function sanitizeBookingLabel(label: string) {
  const trimmed = label.trim();

  if (!trimmed || /workiz/i.test(trimmed)) {
    return "Book online";
  }

  return trimmed;
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
    bookingLabel: sanitizeBookingLabel(settings.bookingLabel),
    workizUrl: settings.workizUrl,
    mapEmbedUrl: settings.mapEmbedUrl,
    socialPreview: settings.socialPreview,
    defaultAuthorName: settings.defaultAuthorName,
    blogIndexTitle: settings.blogIndexTitle,
    blogIndexDescription: settings.blogIndexDescription,
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

  const articles = hasBlobStorage()
    ? await readRemoteJson<Array<Article & { city?: string }>>(REMOTE_ARTICLES_KEY, fallback)
    : await readLocalJson<Array<Article & { city?: string }>>(LOCAL_ARTICLES_FILE, fallback);
  const mergedArticles = [...articles];

  for (const defaultArticle of fallback) {
    if (!mergedArticles.some((article) => article.id === defaultArticle.id)) {
      mergedArticles.push(defaultArticle);
    }
  }

  const sorted = sortArticles(mergedArticles.map(normalizeArticleRecord));
  const filteredByCity = options?.city
    ? sorted.filter((article) => article.city === options.city)
    : sorted;

  if (options?.includeDrafts) {
    return filteredByCity;
  }

  return filteredByCity.filter((article) => article.status === "published");
}

export async function getArticleBySlug(
  slug: string,
  options?: GetArticleOptions,
) {
  assertCmsStorageConfigured();
  noStore();

  const articles = await listArticles({
    includeDrafts: true,
    city: options?.city || defaultCitySlug,
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

export async function listLeads(options?: ListLeadsOptions) {
  assertCmsStorageConfigured();
  noStore();

  const fallback: Lead[] = [];
  const leads = hasBlobStorage()
    ? await readRemoteJson<Array<Lead & { city?: string }>>(REMOTE_LEADS_KEY, fallback, { protectedData: true })
    : await readLocalJson<Array<Lead & { city?: string }>>(LOCAL_LEADS_FILE, fallback);

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