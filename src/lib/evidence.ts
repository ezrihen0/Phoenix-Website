import type { CitySlug } from "@/lib/cities";
import { serviceLandingPages } from "@/lib/site-data";

export const EVIDENCE_STATUS_VALUES = [
  "draft",
  "approved",
  "public",
  "archived",
] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUS_VALUES)[number];

export const EVIDENCE_TYPE_VALUES = [
  "maintenance",
  "inspection",
  "repair",
  "installation",
  "wett",
  "mixed",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPE_VALUES)[number];

export const EVIDENCE_IMAGE_SOURCE_VALUES = [
  "site-asset",
  "blob-upload",
] as const;

export type EvidenceImageSource = (typeof EVIDENCE_IMAGE_SOURCE_VALUES)[number];

export type EvidencePublicFields = {
  summaryLabel?: string;
  homeownerProblem?: string;
  inspected?: string;
  observed?: string;
  found?: string;
  workPerformed?: string;
  homeownerLesson?: string;
};

export type EvidenceInternalFields = {
  sourceNote?: string;
  verificationNote?: string;
  ownerNotes?: string;
  internalLocationNote?: string;
};

export type EvidenceImageRecord = {
  id: string;
  source: EvidenceImageSource;
  url: string;
  isPrimary: boolean;
  publicAlt?: string;
  publicCaption?: string;
  internalSourceDescription?: string;
  approvedForPublic: boolean;
};

export type EvidenceRecord = {
  id: string;
  status: EvidenceStatus;
  serviceSlugs: string[];
  jobCity: CitySlug;
  evidenceType: EvidenceType;
  publicData: EvidencePublicFields;
  internalData: EvidenceInternalFields;
  images: EvidenceImageRecord[];
  ownerVerified: boolean;
  publicApproved: boolean;
  jobDate?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  publishedAt?: string;
};

export type PublicEvidenceImage = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
};

export type PublicEvidence = {
  id: string;
  serviceSlugs: string[];
  jobCity: CitySlug;
  evidenceType: EvidenceType;
  publicData: EvidencePublicFields;
  images: PublicEvidenceImage[];
  jobDate?: string;
  publishedAt?: string;
};

export type EvidenceServiceOption = {
  slug: string;
  title: string;
};

export const evidenceServiceOptions: EvidenceServiceOption[] = [
  ...serviceLandingPages.map((servicePage) => ({
    slug: servicePage.slug,
    title: servicePage.title,
  })),
  {
    slug: "wett-inspections",
    title: "WETT Inspections",
  },
];

const supportedEvidenceServiceSlugSet = new Set(
  evidenceServiceOptions.map((option) => option.slug),
);

export function isSupportedEvidenceServiceSlug(value: string) {
  return supportedEvidenceServiceSlugSet.has(value);
}

export function getPrimaryEvidenceImage(
  images: ReadonlyArray<EvidenceImageRecord | PublicEvidenceImage>,
) {
  return images.find((image) => image.isPrimary) || images[0];
}

export function hasMeaningfulPublicEvidence(record: EvidenceRecord) {
  const {
    summaryLabel,
    homeownerProblem,
    inspected,
    observed,
    found,
    workPerformed,
    homeownerLesson,
  } = record.publicData;

  return Boolean(
    summaryLabel?.trim() ||
      homeownerProblem?.trim() ||
      inspected?.trim() ||
      observed?.trim() ||
      found?.trim() ||
      workPerformed?.trim() ||
      homeownerLesson?.trim() ||
      record.images.some((image) => image.approvedForPublic && image.url.trim()),
  );
}

export function isEvidencePublic(record: EvidenceRecord) {
  return (
    record.status === "public" &&
    record.ownerVerified &&
    record.publicApproved &&
    hasMeaningfulPublicEvidence(record)
  );
}

export function toPublicEvidence(record: EvidenceRecord): PublicEvidence | null {
  if (!isEvidencePublic(record)) {
    return null;
  }

  const images = record.images
    .filter((image) => image.approvedForPublic && image.url.trim())
    .map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.publicAlt?.trim() || "",
      caption: image.publicCaption?.trim() || undefined,
      isPrimary: image.isPrimary,
    }));

  return {
    id: record.id,
    serviceSlugs: record.serviceSlugs,
    jobCity: record.jobCity,
    evidenceType: record.evidenceType,
    publicData: record.publicData,
    images,
    jobDate: record.jobDate,
    publishedAt: record.publishedAt,
  };
}
