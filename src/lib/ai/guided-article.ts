import "server-only";

import { z } from "zod";

import {
  ARTICLE_STRUCTURE_RULES,
  FACTUAL_BOUNDARY_RULES,
  GUIDED_JSON_ONLY_RULE,
} from "@/lib/ai/prompt-shared";
import { requestDeepSeekJsonCompletion } from "@/lib/ai/deepseek-client";
import { getArticleCategoryById } from "@/lib/article-workflow/categories";
import type {
  ArticleAngle,
  ArticleBrief,
  ContentReviewResult,
  ContentSource,
  GuidedArticleDraft,
  OverlapResult,
  StructuredEvidence,
  WizardImage,
} from "@/lib/article-workflow/types";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import type { GeneratedArticleDraft } from "@/lib/cms/types";

const angleSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(8),
  primaryQuestion: z.string().min(12),
});

const anglesResponseSchema = z.object({
  angles: z.array(angleSchema).min(3).max(5),
});

const briefResponseSchema = z.object({
  proposedTitle: z.string().min(12),
  primaryQuestion: z.string().min(12),
  purpose: z.string().min(24),
  intendedReader: z.string().min(12),
  allowedFacts: z.array(z.string()).min(1),
  unsupportedClaims: z.array(z.string()),
  missingInformation: z.array(z.string()),
  proposedStructure: z.array(z.string()).min(3),
});

const draftResponseSchema = z.object({
  title: z.string().min(12),
  excerpt: z.string().min(40),
  body: z.string().min(120),
  seoTitle: z.string().min(12),
  seoDescription: z.string().min(40),
  keywords: z.array(z.string()).min(3).max(8),
  imagePlacements: z
    .array(
      z.object({
        imageId: z.string(),
        suggestion: z.string(),
      }),
    )
    .optional(),
});

const reviewCategorySchema = z.object({
  name: z.string().min(2),
  status: z.enum(["PASS", "WARNING", "ACTION NEEDED"]),
  notes: z.string().min(8),
});

const reviewResponseSchema = z.object({
  summary: z.string().min(24),
  categories: z.array(reviewCategorySchema).min(8),
});

function parseJsonResponse<T>(content: string, schema: z.ZodSchema<T>) {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new Error("DeepSeek returned invalid JSON.");
  }

  const parsed = schema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error("DeepSeek returned an incomplete response.");
  }

  return parsed.data;
}

function buildEvidencePayload(rawNotes: string, structuredEvidence: StructuredEvidence) {
  return {
    rawNotes,
    structuredEvidence,
  };
}

function buildContextPayload({
  source,
  city,
  categoryId,
  rawNotes,
  structuredEvidence,
  images,
}: {
  source: ContentSource;
  city: CitySlug;
  categoryId: string;
  rawNotes: string;
  structuredEvidence: StructuredEvidence;
  images: WizardImage[];
}) {
  const cityConfig = getCityBySlug(city);
  const category = getArticleCategoryById(categoryId);

  if (!cityConfig) {
    throw new Error(`Unsupported city: ${city}`);
  }

  if (!category) {
    throw new Error("Unsupported article category.");
  }

  return {
    source,
    city: cityConfig.name,
    province: cityConfig.province,
    category: category.label,
    categoryDescription: category.description,
    audience: cityConfig.articleAudience,
    evidence: buildEvidencePayload(rawNotes, structuredEvidence),
    images: images.map((image) => ({
      id: image.id,
      alt: image.alt,
      caption: image.caption,
      ownerDescription: image.ownerDescription,
      isCover: image.isCover,
    })),
  };
}

export async function suggestArticleAngles(input: {
  source: ContentSource;
  city: CitySlug;
  categoryId: string;
  rawNotes: string;
  structuredEvidence: StructuredEvidence;
}): Promise<ArticleAngle[]> {
  const content = await requestDeepSeekJsonCompletion({
    systemPrompt: `${FACTUAL_BOUNDARY_RULES}\n\n${GUIDED_JSON_ONLY_RULE}`,
    userPrompt: JSON.stringify({
      task: "Suggest 3 to 5 distinct article angles based ONLY on the supplied evidence. Do not invent facts. Do not choose a topic unrelated to the evidence.",
      context: buildContextPayload({ ...input, images: [] }),
      outputShape: {
        angles: [{ id: "string", label: "string", primaryQuestion: "string" }],
      },
    }),
  });

  const parsed = parseJsonResponse(content, anglesResponseSchema);
  return parsed.angles;
}

export async function generateArticleBrief(input: {
  source: ContentSource;
  city: CitySlug;
  categoryId: string;
  rawNotes: string;
  structuredEvidence: StructuredEvidence;
  images: WizardImage[];
  selectedAngle: ArticleAngle;
}): Promise<ArticleBrief> {
  const content = await requestDeepSeekJsonCompletion({
    systemPrompt: `${FACTUAL_BOUNDARY_RULES}\n\n${GUIDED_JSON_ONLY_RULE}\n\nCreate an article brief only. Do not write the full article.`,
    userPrompt: JSON.stringify({
      task: "Create an article brief from the selected angle and supplied evidence.",
      context: buildContextPayload(input),
      selectedAngle: input.selectedAngle,
      outputShape: {
        proposedTitle: "string",
        primaryQuestion: "string",
        purpose: "string",
        intendedReader: "string",
        allowedFacts: ["string"],
        unsupportedClaims: ["string"],
        missingInformation: ["string"],
        proposedStructure: ["string"],
      },
    }),
  });

  return parseJsonResponse(content, briefResponseSchema);
}

export async function generateGuidedArticleDraft(input: {
  source: ContentSource;
  city: CitySlug;
  categoryId: string;
  rawNotes: string;
  structuredEvidence: StructuredEvidence;
  images: WizardImage[];
  selectedAngle: ArticleAngle;
  brief: ArticleBrief;
}): Promise<GuidedArticleDraft> {
  const content = await requestDeepSeekJsonCompletion({
    systemPrompt: `${FACTUAL_BOUNDARY_RULES}\n\n${ARTICLE_STRUCTURE_RULES}\n\n${GUIDED_JSON_ONLY_RULE}`,
    userPrompt: JSON.stringify({
      task: "Write the full article draft using ONLY the approved brief and supplied evidence.",
      context: buildContextPayload(input),
      selectedAngle: input.selectedAngle,
      approvedBrief: input.brief,
      outputShape: {
        title: "string",
        excerpt: "string",
        body: "markdown",
        seoTitle: "string",
        seoDescription: "string",
        keywords: ["string"],
        imagePlacements: [{ imageId: "string", suggestion: "string" }],
      },
    }),
  });

  return parseJsonResponse(content, draftResponseSchema);
}

export async function runArticleContentReview(input: {
  source: ContentSource;
  city: CitySlug;
  categoryId: string;
  rawNotes: string;
  structuredEvidence: StructuredEvidence;
  images: WizardImage[];
  selectedAngle: ArticleAngle;
  brief: ArticleBrief;
  draft: GeneratedArticleDraft;
  overlap: OverlapResult | null;
}): Promise<ContentReviewResult> {
  const content = await requestDeepSeekJsonCompletion({
    systemPrompt: `${FACTUAL_BOUNDARY_RULES}\n\nThis is an INTERNAL editorial review. Do NOT claim Google rankings, AI Overview inclusion, or verified search demand.\n\n${GUIDED_JSON_ONLY_RULE}`,
    userPrompt: JSON.stringify({
      task: "Run a Search & AI Content Review on the draft.",
      context: buildContextPayload(input),
      selectedAngle: input.selectedAngle,
      approvedBrief: input.brief,
      draft: input.draft,
      overlap: input.overlap,
      requiredCategories: [
        "Search intent",
        "Evidence",
        "Unsupported claims",
        "Specificity",
        "Duplication",
        "Keyword usage",
        "City usage",
        "Images",
        "Title",
        "Excerpt/meta",
        "Missing information",
        "Answer Extractability",
      ],
      outputShape: {
        summary: "string",
        categories: [{ name: "string", status: "PASS|WARNING|ACTION NEEDED", notes: "string" }],
      },
    }),
  });

  return parseJsonResponse(content, reviewResponseSchema);
}
