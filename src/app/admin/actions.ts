"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AI_MODEL_VALUES } from "@/lib/ai/model-options";
import { clearAdminSession, requireAdmin } from "@/lib/auth/options";
import { generateDailyArticle } from "@/lib/ai/generate-article";
import { defaultSiteSettings } from "@/lib/cms/defaults";
import { slugify } from "@/lib/cms/helpers";
import { deleteArticle, getArticleBySlug, getCmsStorageStatus, getSiteSettings, saveArticle, saveSiteSettings } from "@/lib/cms/storage";

const articleSchema = z.object({
  slug: z.string().optional(),
  title: z.string().trim().min(8),
  excerpt: z.string().trim().min(24),
  body: z.string().trim().min(120),
  seoTitle: z.string().trim().min(8),
  seoDescription: z.string().trim().min(24),
  coverImage: z.string().trim().optional(),
  keywords: z.string().trim().min(3),
  relatedSlugs: z.string().trim().optional(),
  status: z.enum(["draft", "published"]),
  authorName: z.string().trim().min(2),
});

const settingsSchema = z.object({
  businessName: z.string().trim().min(2),
  legalName: z.string().trim().min(2),
  siteUrl: z.string().trim().url(),
  phoneDisplay: z.string().trim().min(7),
  phoneHref: z.string().trim().min(7),
  email: z.string().trim().email(),
  hoursLabel: z.string().trim().min(2),
  hoursDetail: z.string().trim().min(2),
  serviceRadius: z.string().trim().min(8),
  bookingLabel: z.string().trim().min(2),
  workizUrl: z.string().trim().url(),
  mapEmbedUrl: z.string().trim().url(),
  socialPreview: z.string().trim().min(1),
  defaultAuthorName: z.string().trim().min(2),
  blogIndexTitle: z.string().trim().min(6),
  blogIndexDescription: z.string().trim().min(20),
  aiModel: z.enum(AI_MODEL_VALUES),
  aiSystemPrompt: z.string().trim().min(20),
  sendLeadEmails: z.preprocess(
    (value) => value === true || value === "true" || value === "on",
    z.boolean(),
  ),
  notificationEmail: z.string().trim().email(),
  googleAppPassword: z.string().trim().optional().default(""),
});

const aiModelSchema = z.object({
  aiModel: z.enum(AI_MODEL_VALUES),
});

function toList(value: string) {
  return value
    .split(/,|\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function revalidatePublicContent(slug?: string) {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/wett");
  revalidatePath("/articles");
  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/settings");

  if (slug) {
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/admin/articles/${slug}`);
  }
}

function redirectWithActionError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function ensureHealthyCmsStorage(path: string) {
  const storageStatus = getCmsStorageStatus();

  if (!storageStatus.healthy) {
    redirectWithActionError(
      path,
      "CMS storage is unavailable on this deployment. Fix Blob storage in Vercel, redeploy, and refresh admin before trying again.",
    );
  }
}

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login?loggedOut=1");
}

export async function saveArticleAction(formData: FormData) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/articles");

  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.parse(raw);
  const originalSlug = String(formData.get("originalSlug") || "").trim();
  const createdAt = String(formData.get("createdAt") || "").trim();
  const now = new Date().toISOString();
  const slug = slugify(parsed.slug || parsed.title);

  try {
    const existingArticle = originalSlug
      ? await getArticleBySlug(originalSlug, { includeDrafts: true })
      : null;

    await saveArticle({
      id: existingArticle?.id || crypto.randomUUID(),
      slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      body: parsed.body,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      keywords: toList(parsed.keywords),
      relatedSlugs: toList(parsed.relatedSlugs || ""),
      status: parsed.status,
      authorName: parsed.authorName,
      coverImage: parsed.coverImage || undefined,
      createdAt: existingArticle?.createdAt || createdAt || now,
      updatedAt: now,
      publishedAt:
        parsed.status === "published"
          ? existingArticle?.publishedAt || now
          : existingArticle?.publishedAt || now,
      aiGenerated: existingArticle?.aiGenerated || false,
    });

    if (originalSlug && originalSlug !== slug) {
      await deleteArticle(originalSlug);
    }
  } catch (error) {
    redirectWithActionError(
      "/admin/articles",
      getActionErrorMessage(error, "The article could not be saved because CMS storage is unavailable."),
    );
  }

  revalidatePublicContent(slug);
  redirect(`/admin/articles/${slug}?saved=1`);
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") || "").trim();

  if (!slug) {
    redirect("/admin/articles?error=missing-slug");
  }

  ensureHealthyCmsStorage("/admin/articles");

  try {
    await deleteArticle(slug);
  } catch (error) {
    redirectWithActionError(
      "/admin/articles",
      getActionErrorMessage(error, "The article could not be deleted because CMS storage is unavailable."),
    );
  }

  revalidatePublicContent(slug);
  redirect("/admin/articles?deleted=1");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/settings");

  const raw = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.parse(raw);
  try {
    const existing = await getSiteSettings();

    await saveSiteSettings({
      ...defaultSiteSettings,
      ...existing,
      ...parsed,
      aiProvider: "openai",
      notificationEmail: parsed.notificationEmail || parsed.email,
      googleAppPassword: parsed.googleAppPassword || existing.googleAppPassword,
    });
  } catch (error) {
    redirectWithActionError(
      "/admin/settings",
      getActionErrorMessage(error, "Settings could not be saved because CMS storage is unavailable."),
    );
  }

  revalidatePublicContent();
  redirect("/admin/settings?saved=1");
}

export async function updateAiModelAction(formData: FormData) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin");

  const parsed = aiModelSchema.parse({
    aiModel: String(formData.get("aiModel") || ""),
  });
  try {
    const settings = await getSiteSettings();

    await saveSiteSettings({
      ...defaultSiteSettings,
      ...settings,
      aiModel: parsed.aiModel,
    });
  } catch (error) {
    redirectWithActionError(
      "/admin",
      getActionErrorMessage(error, "The AI model could not be updated because CMS storage is unavailable."),
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  redirect("/admin?aiModelSaved=1");
}

export async function generateAiArticleAction() {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/articles");

  let result;

  try {
    result = await generateDailyArticle({ force: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The AI article generator failed unexpectedly.";

    redirect(`/admin/articles?error=${encodeURIComponent(message)}`);
  }

  if (result.status === "created") {
    revalidatePublicContent(result.article.slug);
    redirect(`/admin/articles/${result.article.slug}?generated=1`);
  }

  redirect("/admin/articles?skipped=1");
}