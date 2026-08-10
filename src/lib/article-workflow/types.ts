import type { CitySlug } from "@/lib/cities";
import type { GeneratedArticleDraft } from "@/lib/cms/types";

export type ContentSource =
  | "real-job"
  | "customer-question"
  | "homeowner-problem"
  | "educational"
  | "topic-queue";

export type ReviewStatus = "PASS" | "WARNING" | "ACTION NEEDED";

export type ArticleAngle = {
  id: string;
  label: string;
  primaryQuestion: string;
};

export type ArticleBrief = {
  proposedTitle: string;
  primaryQuestion: string;
  purpose: string;
  intendedReader: string;
  allowedFacts: string[];
  unsupportedClaims: string[];
  missingInformation: string[];
  proposedStructure: string[];
};

export type StructuredEvidence = {
  homeownerNotice: string;
  inspected: string;
  observed: string;
  found: string;
  workPerformed: string;
  homeownerLesson: string;
};

export type WizardImage = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  ownerDescription: string;
  isCover: boolean;
};

export type OverlapMatch = {
  title: string;
  slug: string;
  excerpt: string;
  score: number;
  reason: string;
};

export type OverlapResult = {
  status: "none" | "potential";
  matches: OverlapMatch[];
  recommendation: string;
};

export type ContentReviewCategory = {
  name: string;
  status: ReviewStatus;
  notes: string;
};

export type ContentReviewResult = {
  summary: string;
  categories: ContentReviewCategory[];
};

export type GuidedWorkflowContext = {
  source: ContentSource;
  city: CitySlug;
  categoryId: string;
  rawNotes: string;
  structuredEvidence: StructuredEvidence;
  images: WizardImage[];
  selectedAngle: ArticleAngle | null;
  brief: ArticleBrief | null;
  briefApproved: boolean;
  overlap: OverlapResult | null;
  draft: GeneratedArticleDraft | null;
  review: ContentReviewResult | null;
};

export type GuidedArticleDraft = GeneratedArticleDraft & {
  imagePlacements?: Array<{
    imageId: string;
    suggestion: string;
  }>;
};

export const CONTENT_SOURCE_OPTIONS: Array<{ value: ContentSource; label: string; description: string }> = [
  {
    value: "real-job",
    label: "Real Job / Field Experience",
    description: "Highest-value option based on actual field work.",
  },
  {
    value: "customer-question",
    label: "Customer Question",
    description: "A real question homeowners ask repeatedly.",
  },
  {
    value: "homeowner-problem",
    label: "Specific Homeowner Problem",
    description: "A concrete problem that deserves a clear explanation.",
  },
  {
    value: "educational",
    label: "Educational Topic",
    description: "Technical, safety, or maintenance explanation.",
  },
  {
    value: "topic-queue",
    label: "Approved Topic Queue",
    description: "Reserved for future curated topics.",
  },
];

export const EMPTY_STRUCTURED_EVIDENCE: StructuredEvidence = {
  homeownerNotice: "",
  inspected: "",
  observed: "",
  found: "",
  workPerformed: "",
  homeownerLesson: "",
};
