"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { z } from "zod";

import { AI_MODEL_VALUES } from "@/lib/ai/model-options";
import {
  generateArticleBrief,
  generateGuidedArticleDraft,
  runArticleContentReview,
  suggestArticleAngles,
} from "@/lib/ai/guided-article";
import { improveArticleFromNotes } from "@/lib/ai/improve-article-from-notes";
import { clearAdminSession, requireAdmin } from "@/lib/auth/options";
import { generateDailyArticle } from "@/lib/ai/generate-article";
import { checkArticleOverlap } from "@/lib/article-workflow/overlap-check";
import { getArticleCategoryById } from "@/lib/article-workflow/categories";
import { CITY_SLUGS, getCityBySlug, getCityHref, type CitySlug } from "@/lib/cities";
import {
  applyArticleMigrationProposals,
  buildArticleMigrationReport,
  type ArticleMigrationReport,
} from "@/lib/cms/article-migration";
import { assertPublishableArticle } from "@/lib/cms/article-quality";
import { defaultSiteSettings } from "@/lib/cms/defaults";
import { slugify } from "@/lib/cms/helpers";
import {
  deleteArticle,
  deleteArticleById,
  getArticleById,
  getCmsStorageStatus,
  getEvidenceById,
  listArticles,
  readStoredArticlesRaw,
  restoreArticleSnapshot,
  saveEvidence,
  getSiteSettings,
  saveArticle,
  saveSiteSettings,
  snapshotArticles,
  writeStoredArticlesRaw,
} from "@/lib/cms/storage";
import {
  EVIDENCE_IMAGE_SOURCE_VALUES,
  EVIDENCE_STATUS_VALUES,
  EVIDENCE_TYPE_VALUES,
  isSupportedEvidenceServiceSlug,
  type EvidenceRecord,
} from "@/lib/evidence";
import { getServiceLandingHref, serviceLandingPages } from "@/lib/site-data";

const articleSchema = z.object({
  city: z.enum(CITY_SLUGS),
  slug: z.string().optional(),
  title: z.string().trim().min(8),
  excerpt: z.string().trim().min(24),
  body: z.string().trim().min(120),
  seoTitle: z.string().trim().min(8),
  seoDescription: z.string().trim().min(24),
  coverImage: z.string().trim().optional(),
  coverImageAlt: z.string().trim().optional(),
  keywords: z.string().trim().min(3),
  relatedSlugs: z.string().trim().optional(),
  relatedServiceSlugs: z.string().trim().optional(),
  status: z.enum(["draft", "published"]),
  authorName: z.string().trim().min(2),
  authorType: z.enum(["organization", "person"]).default("organization"),
});

const settingsSchema = z.object({
  businessName: z.string().trim().min(2),
  legalName: z.string().trim().min(2),
  siteUrl: z.string().trim().url(),
  phoneDisplay: z.string().trim().min(7),
  phoneHref: z.string().trim().min(7),
  email: z.string().trim().email(),
  sendingEmail: z.string().trim().email(),
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

const contentSourceSchema = z.enum([
  "real-job",
  "customer-question",
  "homeowner-problem",
  "educational",
  "topic-queue",
]);

const structuredEvidenceSchema = z.object({
  homeownerNotice: z.string(),
  inspected: z.string(),
  observed: z.string(),
  found: z.string(),
  workPerformed: z.string(),
  homeownerLesson: z.string(),
});

const wizardImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string(),
  caption: z.string(),
  ownerDescription: z.string(),
  isCover: z.boolean(),
});

const articleAngleSchema = z.object({
  id: z.string(),
  label: z.string(),
  primaryQuestion: z.string(),
});

const articleBriefSchema = z.object({
  proposedTitle: z.string(),
  primaryQuestion: z.string(),
  purpose: z.string(),
  intendedReader: z.string(),
  allowedFacts: z.array(z.string()),
  unsupportedClaims: z.array(z.string()),
  missingInformation: z.array(z.string()),
  proposedStructure: z.array(z.string()),
});

const workflowBaseSchema = z.object({
  source: contentSourceSchema,
  city: z.enum(CITY_SLUGS),
  categoryId: z.string().min(2),
  rawNotes: z.string().min(40),
  structuredEvidence: structuredEvidenceSchema,
  images: z.array(wizardImageSchema),
});

const evidenceImageSchema = z.object({
  id: z.string().min(1),
  source: z.enum(EVIDENCE_IMAGE_SOURCE_VALUES),
  url: z.string().trim().min(1),
  isPrimary: z.boolean(),
  publicAlt: z.string(),
  publicCaption: z.string(),
  internalSourceDescription: z.string(),
  approvedForPublic: z.boolean(),
});

const evidenceSchema = z.object({
  status: z.enum(EVIDENCE_STATUS_VALUES),
  city: z.enum(CITY_SLUGS),
  evidenceType: z.enum(EVIDENCE_TYPE_VALUES),
  summaryLabel: z.string().trim().optional(),
  homeownerProblem: z.string().trim().optional(),
  inspected: z.string().trim().optional(),
  observed: z.string().trim().optional(),
  found: z.string().trim().optional(),
  workPerformed: z.string().trim().optional(),
  homeownerLesson: z.string().trim().optional(),
  sourceNote: z.string().trim().optional(),
  verificationNote: z.string().trim().optional(),
  ownerNotes: z.string().trim().optional(),
  internalLocationNote: z.string().trim().optional(),
  jobDate: z.string().trim().optional(),
  ownerVerified: z.preprocess(
    (value) => value === true || value === "true" || value === "on",
    z.boolean(),
  ),
  publicApproved: z.preprocess(
    (value) => value === true || value === "true" || value === "on",
    z.boolean(),
  ),
});

function deepSeekUnavailableMessage() {
  return "AI assistant unavailable. You can continue editing manually.";
}

function ensureDeepSeekConfigured() {
  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    throw new Error(deepSeekUnavailableMessage());
  }
}

async function withDeepSeekAction<T>(runner: () => Promise<T>) {
  try {
    ensureDeepSeekConfigured();
    const data = await runner();
    return { ok: true as const, data };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error && error.message ? error.message : deepSeekUnavailableMessage(),
    };
  }
}

function parseWorkflowPayload(payload: string) {
  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return null;
  }
}

const ALLOWED_RETURN_PATHS = ["/admin/publish"] as const;

function getSafeReturnPath(formData: FormData) {
  const returnTo = String(formData.get("returnTo") || "").trim();

  return ALLOWED_RETURN_PATHS.includes(returnTo as (typeof ALLOWED_RETURN_PATHS)[number])
    ? returnTo
    : null;
}

function toList(value: string) {
  return value
    .split(/,|\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseJsonField<T>(value: FormDataEntryValue | null, schema: z.ZodSchema<T>, fallback: T) {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return schema.parse(parsed);
  } catch {
    return fallback;
  }
}

function getEvidenceServiceSlugs(formData: FormData) {
  return Array.from(
    new Set(
      formData
        .getAll("serviceSlugs")
        .map((value) => String(value || "").trim())
        .filter((value) => value && isSupportedEvidenceServiceSlug(value)),
    ),
  );
}

function revalidatePublicContent(articleRoutes: Array<{ city: CitySlug; slug: string }> = []) {
  revalidatePath("/");

  for (const city of CITY_SLUGS) {
    revalidatePath(getCityHref(city));
    revalidatePath(getCityHref(city, "/about"));
    revalidatePath(getCityHref(city, "/contact"));
    revalidatePath(getCityHref(city, "/services"));
    revalidatePath(getCityHref(city, "/wett"));
    revalidatePath(getCityHref(city, "/articles"));
  }

  revalidatePath("/services");
  revalidatePath("/wett");
  revalidatePath("/about");
  revalidatePath("/contact");

  for (const servicePage of serviceLandingPages) {
    revalidatePath(getServiceLandingHref(servicePage.slug));

    for (const city of CITY_SLUGS) {
      revalidatePath(getServiceLandingHref(servicePage.slug, city));
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/evidence");
  revalidatePath("/admin/publish");
  revalidatePath("/admin/settings");

  for (const route of articleRoutes) {
    revalidatePath(getCityHref(route.city, `/articles/${route.slug}`));
  }
}

function buildEvidenceRecordFromFormData(formData: FormData, existing?: EvidenceRecord | null) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = evidenceSchema.parse(raw);
  const images = parseJsonField(
    formData.get("imagesJson"),
    z.array(evidenceImageSchema),
    [],
  );
  const serviceSlugs = getEvidenceServiceSlugs(formData);
  const now = new Date().toISOString();
  const nextStatus = parsed.status;

  if (nextStatus !== "draft" && !parsed.ownerVerified) {
    throw new Error("Owner verification is required before evidence can move beyond draft.");
  }

  if (nextStatus === "public" && !parsed.publicApproved) {
    throw new Error("Privacy approval is required before evidence can be published.");
  }

  if (nextStatus === "public" && serviceSlugs.length === 0) {
    throw new Error("Attach at least one supported service before publishing evidence.");
  }

  const approvedAt =
    nextStatus === "approved" || nextStatus === "public"
      ? existing?.approvedAt || now
      : undefined;
  const publishedAt =
    nextStatus === "public"
      ? existing?.publishedAt || now
      : undefined;

  return {
    id: existing?.id || crypto.randomUUID(),
    status: nextStatus,
    serviceSlugs,
    jobCity: parsed.city,
    evidenceType: parsed.evidenceType,
    publicData: {
      summaryLabel: parsed.summaryLabel || undefined,
      homeownerProblem: parsed.homeownerProblem || undefined,
      inspected: parsed.inspected || undefined,
      observed: parsed.observed || undefined,
      found: parsed.found || undefined,
      workPerformed: parsed.workPerformed || undefined,
      homeownerLesson: parsed.homeownerLesson || undefined,
    },
    internalData: {
      sourceNote: parsed.sourceNote || undefined,
      verificationNote: parsed.verificationNote || undefined,
      ownerNotes: parsed.ownerNotes || undefined,
      internalLocationNote: parsed.internalLocationNote || undefined,
    },
    images,
    ownerVerified: parsed.ownerVerified,
    publicApproved: parsed.publicApproved,
    jobDate: parsed.jobDate || undefined,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    approvedAt,
    publishedAt,
  } satisfies EvidenceRecord;
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

  const returnPath = getSafeReturnPath(formData);
  const errorPath = returnPath || "/admin/articles";

  ensureHealthyCmsStorage(errorPath);

  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.parse(raw);
  const originalId = String(formData.get("originalId") || "").trim();
  const originalSlug = String(formData.get("originalSlug") || "").trim();
  const originalCity = String(formData.get("originalCity") || "").trim();
  const aiGeneratedFlag = String(formData.get("aiGenerated") || "").trim() === "true";
  const now = new Date().toISOString();
  const slug = slugify(parsed.slug || parsed.title);
  const articleId = originalId || crypto.randomUUID();

  try {
    const existingArticle = originalId
      ? await getArticleById(originalId, { includeDrafts: true })
      : null;

    const nextArticle = {
      id: existingArticle?.id || articleId,
      city: parsed.city,
      slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      body: parsed.body,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      keywords: toList(parsed.keywords),
      relatedSlugs: toList(parsed.relatedSlugs || ""),
      relatedServiceSlugs: toList(parsed.relatedServiceSlugs || ""),
      status: parsed.status,
      authorName: parsed.authorName,
      authorType: parsed.authorType,
      coverImage: parsed.coverImage || undefined,
      coverImageAlt: parsed.coverImageAlt || undefined,
      createdAt: existingArticle?.createdAt || now,
      updatedAt: now,
      publishedAt:
        parsed.status === "published"
          ? existingArticle?.publishedAt || now
          : existingArticle?.publishedAt || now,
      aiGenerated: existingArticle?.aiGenerated || aiGeneratedFlag,
    };

    assertPublishableArticle(nextArticle);

    await saveArticle(nextArticle);
  } catch (error) {
    redirectWithActionError(
      errorPath,
      getActionErrorMessage(error, "The article could not be saved because CMS storage is unavailable."),
    );
  }

  const routesToRevalidate: Array<{ city: CitySlug; slug: string }> = [{
    city: parsed.city,
    slug,
  }];
  const previousCity = getCityBySlug(originalCity)?.slug;

  if (originalSlug && previousCity && (originalSlug !== slug || previousCity !== parsed.city)) {
    routesToRevalidate.push({ city: previousCity, slug: originalSlug });
  }

  revalidatePublicContent(routesToRevalidate);

  if (returnPath) {
    redirect(`${returnPath}?saved=1&city=${encodeURIComponent(parsed.city)}&slug=${encodeURIComponent(slug)}`);
  }

  redirect(`/admin/articles/${articleId}?saved=1`);
}

export async function improveArticleFromNotesAction(notes: string, city: string) {
  await requireAdmin();

  const citySlug = getCityBySlug(city)?.slug;

  if (!citySlug) {
    return {
      ok: false as const,
      error: "Invalid city selected.",
    };
  }

  const trimmedNotes = notes.trim();

  if (trimmedNotes.length < 40) {
    return {
      ok: false as const,
      error: "Add more detail to your notes before using AI (at least 40 characters).",
    };
  }

  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    return {
      ok: false as const,
      error: "AI assistant unavailable. You can continue editing manually.",
    };
  }

  try {
    const draft = await improveArticleFromNotes(trimmedNotes, citySlug);

    return {
      ok: true as const,
      draft,
    };
  } catch {
    return {
      ok: false as const,
      error: "AI assistant unavailable. You can continue editing manually.",
    };
  }
}

export async function suggestArticleAnglesAction(payload: string) {
  await requireAdmin();

  const parsedPayload = parseWorkflowPayload(payload);

  if (!parsedPayload) {
    return { ok: false as const, error: "Invalid workflow data." };
  }

  const parsed = workflowBaseSchema.safeParse(parsedPayload);

  if (!parsed.success) {
    return { ok: false as const, error: "Complete the source, city, service, and evidence steps first." };
  }

  return withDeepSeekAction(() => suggestArticleAngles(parsed.data));
}

export async function checkArticleOverlapAction(payload: string) {
  await requireAdmin();

  const schema = workflowBaseSchema.extend({
    selectedAngle: articleAngleSchema,
  });
  const parsedPayload = parseWorkflowPayload(payload);

  if (!parsedPayload) {
    return { ok: false as const, error: "Invalid workflow data." };
  }

  const parsed = schema.safeParse(parsedPayload);

  if (!parsed.success) {
    return { ok: false as const, error: "Select an article angle before checking overlap." };
  }

  const articles = await listArticles({ includeDrafts: true, city: parsed.data.city });
  const overlap = checkArticleOverlap({
    city: parsed.data.city,
    proposedTitle: parsed.data.selectedAngle.label,
    primaryQuestion: parsed.data.selectedAngle.primaryQuestion,
    articles,
  });

  return { ok: true as const, data: overlap };
}

export async function generateArticleBriefAction(payload: string) {
  await requireAdmin();

  const schema = workflowBaseSchema.extend({
    selectedAngle: articleAngleSchema,
  });
  const parsedPayload = parseWorkflowPayload(payload);

  if (!parsedPayload) {
    return { ok: false as const, error: "Invalid workflow data." };
  }

  const parsed = schema.safeParse(parsedPayload);

  if (!parsed.success) {
    return { ok: false as const, error: "Select an article angle before generating a brief." };
  }

  return withDeepSeekAction(() => generateArticleBrief(parsed.data));
}

export async function generateGuidedArticleDraftAction(payload: string) {
  await requireAdmin();

  const schema = workflowBaseSchema.extend({
    selectedAngle: articleAngleSchema,
    brief: articleBriefSchema,
  });
  const parsedPayload = parseWorkflowPayload(payload);

  if (!parsedPayload) {
    return { ok: false as const, error: "Invalid workflow data." };
  }

  const parsed = schema.safeParse(parsedPayload);

  if (!parsed.success) {
    return { ok: false as const, error: "Approve the article brief before generating the draft." };
  }

  return withDeepSeekAction(() => generateGuidedArticleDraft(parsed.data));
}

export async function runArticleContentReviewAction(payload: string) {
  await requireAdmin();

  const draftSchema = z.object({
    title: z.string(),
    excerpt: z.string(),
    body: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    keywords: z.array(z.string()),
  });

  const overlapSchema = z.object({
    status: z.enum(["none", "potential"]),
    matches: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        score: z.number(),
        reason: z.string(),
      }),
    ),
    recommendation: z.string(),
  });

  const schema = workflowBaseSchema.extend({
    selectedAngle: articleAngleSchema,
    brief: articleBriefSchema,
    draft: draftSchema,
    overlap: overlapSchema.nullable(),
  });
  const parsedPayload = parseWorkflowPayload(payload);

  if (!parsedPayload) {
    return { ok: false as const, error: "Invalid workflow data." };
  }

  const parsed = schema.safeParse(parsedPayload);

  if (!parsed.success) {
    return { ok: false as const, error: "Generate the article draft before running content review." };
  }

  return withDeepSeekAction(() => runArticleContentReview(parsed.data));
}

export async function uploadArticleImageAction(formData: FormData) {
  await requireAdmin();

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    return {
      ok: false as const,
      error: "Image upload requires BLOB_READ_WRITE_TOKEN to be configured.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Choose a photo to upload." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false as const, error: "Only image files can be uploaded." };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: "Images must be 8 MB or smaller." };
  }

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const key = `articles/images/${crypto.randomUUID()}.${extension}`;
    const blob = await put(key, file, {
      access: "public",
      token,
      addRandomSuffix: false,
    });

    return {
      ok: true as const,
      data: {
        url: blob.url,
      },
    };
  } catch {
    return {
      ok: false as const,
      error: "Image upload failed. Your article notes are still saved.",
    };
  }
}

export async function uploadEvidenceImageAction(formData: FormData) {
  await requireAdmin();

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    return {
      ok: false as const,
      error: "Image upload requires BLOB_READ_WRITE_TOKEN to be configured.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Choose a photo to upload." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false as const, error: "Only image files can be uploaded." };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: "Images must be 8 MB or smaller." };
  }

  try {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const key = `evidence/images/${crypto.randomUUID()}.${extension}`;
    const blob = await put(key, file, {
      access: "public",
      token,
      addRandomSuffix: false,
    });

    return {
      ok: true as const,
      data: {
        url: blob.url,
      },
    };
  } catch {
    return {
      ok: false as const,
      error: "Image upload failed. Your evidence draft is still available to edit.",
    };
  }
}

export async function saveEvidenceAction(formData: FormData) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/evidence");

  const originalId = String(formData.get("originalId") || "").trim();
  const returnPath = originalId ? `/admin/evidence/${originalId}` : "/admin/evidence/new";
  let savedId = originalId;

  try {
    const existing = originalId ? await getEvidenceById(originalId) : null;
    const nextRecord = buildEvidenceRecordFromFormData(formData, existing);
    savedId = nextRecord.id;

    await saveEvidence(nextRecord);
  } catch (error) {
    redirectWithActionError(
      returnPath,
      getActionErrorMessage(
        error,
        "The evidence record could not be saved because CMS storage is unavailable.",
      ),
    );
  }

  revalidatePublicContent();
  redirect(savedId ? `/admin/evidence/${savedId}?saved=1` : "/admin/evidence?saved=1");
}

export async function createEvidenceDraftFromWorkflowAction(payload: string) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/publish");

  const parsedPayload = parseWorkflowPayload(payload);

  if (!parsedPayload) {
    return { ok: false as const, error: "Invalid workflow data." };
  }

  const parsed = workflowBaseSchema.safeParse(parsedPayload);

  if (!parsed.success) {
    return { ok: false as const, error: "Complete the evidence step before saving a draft." };
  }

  const category = getArticleCategoryById(parsed.data.categoryId);
  const suggestedServiceSlug =
    category?.relatedServiceSlug && isSupportedEvidenceServiceSlug(category.relatedServiceSlug)
      ? [category.relatedServiceSlug]
      : [];
  const now = new Date().toISOString();

  try {
    const record: EvidenceRecord = {
      id: crypto.randomUUID(),
      status: "draft",
      serviceSlugs: suggestedServiceSlug,
      jobCity: parsed.data.city,
      evidenceType:
        category?.id === "wett-inspection"
          ? "wett"
          : parsed.data.source === "real-job"
            ? "mixed"
            : "inspection",
      publicData: {
        homeownerProblem: parsed.data.structuredEvidence.homeownerNotice || undefined,
        inspected: parsed.data.structuredEvidence.inspected || undefined,
        observed: parsed.data.structuredEvidence.observed || undefined,
        found: parsed.data.structuredEvidence.found || undefined,
        workPerformed: parsed.data.structuredEvidence.workPerformed || undefined,
        homeownerLesson: parsed.data.structuredEvidence.homeownerLesson || undefined,
      },
      internalData: {
        sourceNote: parsed.data.rawNotes,
        verificationNote: category ? `Saved from guided article workflow (${category.label}).` : "Saved from guided article workflow.",
      },
      images: parsed.data.images.map((image) => ({
        id: image.id || crypto.randomUUID(),
        source: "blob-upload",
        url: image.url,
        isPrimary: image.isCover,
        publicAlt: image.alt || undefined,
        publicCaption: image.caption || undefined,
        internalSourceDescription: image.ownerDescription || undefined,
        approvedForPublic: false,
      })),
      ownerVerified: false,
      publicApproved: false,
      createdAt: now,
      updatedAt: now,
    };

    await saveEvidence(record);
    revalidatePublicContent();

    return {
      ok: true as const,
      data: {
        id: record.id,
      },
    };
  } catch (error) {
    return {
      ok: false as const,
      error: getActionErrorMessage(
        error,
        "The evidence draft could not be saved because CMS storage is unavailable.",
      ),
    };
  }
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const articleId = String(formData.get("articleId") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const city = getCityBySlug(String(formData.get("city") || "").trim())?.slug;

  if (!articleId && !slug) {
    redirect("/admin/articles?error=missing-article-id");
  }

  ensureHealthyCmsStorage("/admin/articles");

  try {
    if (articleId) {
      await deleteArticleById(articleId);
    } else if (slug && city) {
      await deleteArticle(slug, city);
    }
  } catch (error) {
    redirectWithActionError(
      "/admin/articles",
      getActionErrorMessage(error, "The article could not be deleted because CMS storage is unavailable."),
    );
  }

  if (slug && city) {
    revalidatePublicContent([{ city, slug }]);
  } else {
    revalidatePublicContent();
  }

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
      sendingEmail: parsed.sendingEmail || parsed.email,
      notificationEmail: parsed.notificationEmail || parsed.sendingEmail || parsed.email,
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

export async function generateAiArticleAction(formData: FormData) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/articles");
  const city = getCityBySlug(String(formData.get("city") || "").trim())?.slug;

  let result;

  try {
    result = await generateDailyArticle({ force: true, city });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The AI article generator failed unexpectedly.";

    redirect(`/admin/articles?error=${encodeURIComponent(message)}`);
  }

  if (result.status === "created") {
    redirect(`/admin/articles/${result.article.id}?generated=1`);
  }

  redirect("/admin/articles?skipped=1");
}

export async function inventoryArticlesAction(): Promise<{
  ok: true;
  report: ArticleMigrationReport;
}> {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/articles/migrate");

  const [storedArticles, mergedArticles] = await Promise.all([
    readStoredArticlesRaw(),
    listArticles({ includeDrafts: true }),
  ]);

  return {
    ok: true,
    report: buildArticleMigrationReport(storedArticles, mergedArticles),
  };
}

export async function dryRunArticleMigrationAction(): Promise<{
  ok: true;
  report: ArticleMigrationReport;
}> {
  return inventoryArticlesAction();
}

export async function applyArticleMigrationAction(formData: FormData) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/articles/migrate");

  const approvedIds = formData
    .getAll("approvedIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (approvedIds.length === 0) {
    redirect("/admin/articles/migrate?error=Select at least one migration proposal to apply.");
  }

  try {
    const [storedArticles, mergedArticles] = await Promise.all([
      readStoredArticlesRaw(),
      listArticles({ includeDrafts: true }),
    ]);
    const snapshot = await snapshotArticles();
    const nextArticles = applyArticleMigrationProposals(
      storedArticles,
      mergedArticles,
      approvedIds,
    );

    await writeStoredArticlesRaw(nextArticles);
    revalidatePublicContent();
    redirect(
      `/admin/articles/migrate?applied=1&count=${nextArticles.length}&snapshot=${encodeURIComponent(snapshot.key)}`,
    );
  } catch (error) {
    redirectWithActionError(
      "/admin/articles/migrate",
      getActionErrorMessage(error, "Article migration could not be applied."),
    );
  }
}

export async function restoreArticleSnapshotAction(formData: FormData) {
  await requireAdmin();
  ensureHealthyCmsStorage("/admin/articles/migrate");

  const snapshotKey = String(formData.get("snapshotKey") || "").trim();

  if (!snapshotKey) {
    redirect("/admin/articles/migrate?error=Choose a snapshot to restore.");
  }

  try {
    const restored = await restoreArticleSnapshot(snapshotKey);
    revalidatePublicContent();
    redirect(`/admin/articles/migrate?restored=1&count=${restored.length}`);
  } catch (error) {
    redirectWithActionError(
      "/admin/articles/migrate",
      getActionErrorMessage(error, "The selected snapshot could not be restored."),
    );
  }
}