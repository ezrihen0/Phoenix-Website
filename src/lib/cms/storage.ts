import "server-only";

import { list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";

import { defaultArticles, defaultSiteSettings } from "@/lib/cms/defaults";
import { protectJson, unprotectJson } from "@/lib/cms/secure-json";
import type { Article, Lead, PublicSiteSettings, SiteSettings } from "@/lib/cms/types";

const LOCAL_DATA_DIR = path.join(process.cwd(), "data", "cms");
const LOCAL_ARTICLES_FILE = path.join(LOCAL_DATA_DIR, "articles.json");
const LOCAL_LEADS_FILE = path.join(LOCAL_DATA_DIR, "leads.json");
const LOCAL_SETTINGS_FILE = path.join(LOCAL_DATA_DIR, "settings.json");
const REMOTE_ARTICLES_KEY = "cms/articles.json";
const REMOTE_LEADS_KEY = "cms/leads.json";
const REMOTE_SETTINGS_KEY = "cms/settings.json";

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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
  const { blobs } = await list({ prefix: key, limit: 10 });
  const blob = blobs.find((item) => item.pathname === key) ?? blobs[0];

  if (!blob) {
    await writeRemoteJson(key, fallback, options);
    return fallback;
  }

  const response = await fetch(blob.url, { cache: "no-store" });

  if (!response.ok) {
    return fallback;
  }

  try {
    const payload = (await response.json()) as unknown;

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
    access: "public",
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

function normalizeSettingsRecord(
  settings?: Partial<SiteSettings> & { leadNotificationEmail?: string },
) {
  if (!settings) {
    return settings;
  }

  return {
    ...settings,
    notificationEmail:
      settings.notificationEmail || settings.leadNotificationEmail || defaultSiteSettings.notificationEmail,
  } satisfies Partial<SiteSettings>;
}

function sanitizeBookingLabel(label: string) {
  const trimmed = label.trim();

  if (!trimmed || /workiz/i.test(trimmed)) {
    return "Book online";
  }

  return trimmed;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (hasBlobStorage()) {
    const remoteSettings = await readRemoteJson(REMOTE_SETTINGS_KEY, defaultSiteSettings, {
      protectedData: true,
    });

    return {
      ...defaultSiteSettings,
      ...normalizeSettingsRecord(remoteSettings),
    };
  }

  const localSettings = await readLocalJson(LOCAL_SETTINGS_FILE, defaultSiteSettings);

  return {
    ...defaultSiteSettings,
    ...normalizeSettingsRecord(localSettings),
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
  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_SETTINGS_KEY, settings, { protectedData: true });
    return;
  }

  await writeLocalJson(LOCAL_SETTINGS_FILE, settings);
}

export async function listArticles(options?: { includeDrafts?: boolean }) {
  const fallback = sortArticles(defaultArticles);

  const articles = hasBlobStorage()
    ? await readRemoteJson(REMOTE_ARTICLES_KEY, fallback)
    : await readLocalJson(LOCAL_ARTICLES_FILE, fallback);

  const sorted = sortArticles(articles);

  if (options?.includeDrafts) {
    return sorted;
  }

  return sorted.filter((article) => article.status === "published");
}

export async function getArticleBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
) {
  const articles = await listArticles({ includeDrafts: true });
  const article = articles.find((entry) => entry.slug === slug);

  if (!article) {
    return null;
  }

  if (!options?.includeDrafts && article.status !== "published") {
    return null;
  }

  return article;
}

export async function saveArticle(article: Article) {
  const articles = await listArticles({ includeDrafts: true });
  const existingIndex = articles.findIndex((entry) => entry.slug === article.slug);
  const nextArticles = [...articles];

  if (existingIndex >= 0) {
    nextArticles.splice(existingIndex, 1, article);
  } else {
    nextArticles.push(article);
  }

  const sorted = sortArticles(nextArticles);

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_ARTICLES_KEY, sorted);
    return;
  }

  await writeLocalJson(LOCAL_ARTICLES_FILE, sorted);
}

export async function deleteArticle(slug: string) {
  const articles = await listArticles({ includeDrafts: true });
  const nextArticles = articles.filter((article) => article.slug !== slug);

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_ARTICLES_KEY, nextArticles);
    return;
  }

  await writeLocalJson(LOCAL_ARTICLES_FILE, nextArticles);
}

export async function listLeads() {
  const fallback: Lead[] = [];
  const leads = hasBlobStorage()
    ? await readRemoteJson(REMOTE_LEADS_KEY, fallback, { protectedData: true })
    : await readLocalJson(LOCAL_LEADS_FILE, fallback);

  return sortLeads(leads);
}

export async function saveLead(lead: Lead) {
  const leads = await listLeads();
  const nextLeads = sortLeads([lead, ...leads.filter((entry) => entry.id !== lead.id)]);

  if (hasBlobStorage()) {
    await writeRemoteJson(REMOTE_LEADS_KEY, nextLeads, { protectedData: true });
    return;
  }

  await writeLocalJson(LOCAL_LEADS_FILE, nextLeads);
}