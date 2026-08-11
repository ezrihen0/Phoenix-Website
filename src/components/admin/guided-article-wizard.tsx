"use client";

import { useMemo, useState, useTransition } from "react";

import {
  checkArticleOverlapAction,
  createEvidenceDraftFromWorkflowAction,
  generateArticleBriefAction,
  generateGuidedArticleDraftAction,
  runArticleContentReviewAction,
  saveArticleAction,
  suggestArticleAnglesAction,
  uploadArticleImageAction,
} from "@/app/admin/actions";
import { ArticlePublishControls } from "@/components/admin/article-publish-controls";
import { ArticleBody } from "@/components/articles/article-body";
import {
  ReviewStatusBadge,
  WizardField,
  WizardStepShell,
  WizardTextArea,
  WizardTextInput,
} from "@/components/admin/guided-wizard-steps";
import { cities, defaultCitySlug, getCityHref, type CitySlug } from "@/lib/cities";
import { getArticleCategoriesForCity } from "@/lib/article-workflow/categories";
import { slugify } from "@/lib/cms/helpers";
import {
  CONTENT_SOURCE_OPTIONS,
  EMPTY_STRUCTURED_EVIDENCE,
  type ArticleAngle,
  type ArticleBrief,
  type ContentReviewResult,
  type ContentSource,
  type GuidedArticleDraft,
  type OverlapResult,
  type StructuredEvidence,
  type WizardImage,
} from "@/lib/article-workflow/types";

const TOTAL_STEPS = 8;

type GuidedArticleWizardProps = {
  defaultAuthorName: string;
  onOpenManualEditor: () => void;
};

type FormFields = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  coverImage: string;
};

function buildBodyWithImages(body: string, images: WizardImage[]) {
  if (images.length === 0) {
    return body;
  }

  const imageBlocks = images.map((image) => {
    const caption = image.caption.trim() ? `\n*${image.caption.trim()}*` : "";
    return `![${image.alt || "Job photo"}](${image.url})${caption}`;
  });

  if (body.includes(imageBlocks[0]?.split("\n")[0] || "")) {
    return body;
  }

  return `${body.trim()}\n\n## Photos from the job\n\n${imageBlocks.join("\n\n")}`.trim();
}

function buildWorkflowPayload(state: {
  source: ContentSource;
  city: CitySlug;
  categoryId: string;
  rawNotes: string;
  structuredEvidence: StructuredEvidence;
  images: WizardImage[];
  selectedAngle: ArticleAngle | null;
  brief: ArticleBrief | null;
  draft: GuidedArticleDraft | null;
  overlap: OverlapResult | null;
}) {
  return JSON.stringify({
    source: state.source,
    city: state.city,
    categoryId: state.categoryId,
    rawNotes: state.rawNotes,
    structuredEvidence: state.structuredEvidence,
    images: state.images,
    selectedAngle: state.selectedAngle,
    brief: state.brief,
    draft: state.draft
      ? {
          title: state.draft.title,
          excerpt: state.draft.excerpt,
          body: state.draft.body,
          seoTitle: state.draft.seoTitle,
          seoDescription: state.draft.seoDescription,
          keywords: state.draft.keywords,
        }
      : undefined,
    overlap: state.overlap,
  });
}

export function GuidedArticleWizard({ defaultAuthorName, onOpenManualEditor }: GuidedArticleWizardProps) {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState<ContentSource | "">("");
  const [city, setCity] = useState<CitySlug>(defaultCitySlug);
  const [categoryId, setCategoryId] = useState("");
  const [rawNotes, setRawNotes] = useState("");
  const [structuredEvidence, setStructuredEvidence] = useState<StructuredEvidence>(EMPTY_STRUCTURED_EVIDENCE);
  const [images, setImages] = useState<WizardImage[]>([]);
  const [angles, setAngles] = useState<ArticleAngle[]>([]);
  const [selectedAngleId, setSelectedAngleId] = useState("");
  const [overlap, setOverlap] = useState<OverlapResult | null>(null);
  const [brief, setBrief] = useState<ArticleBrief | null>(null);
  const [briefApproved, setBriefApproved] = useState(false);
  const [draft, setDraft] = useState<GuidedArticleDraft | null>(null);
  const [review, setReview] = useState<ContentReviewResult | null>(null);
  const [savedEvidenceId, setSavedEvidenceId] = useState<string | null>(null);
  const [fields, setFields] = useState<FormFields>({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    seoTitle: "",
    seoDescription: "",
    keywords: "",
    coverImage: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => getArticleCategoriesForCity(city), [city]);
  const selectedAngle = angles.find((angle) => angle.id === selectedAngleId) || null;
  const previewSlug = slugify(fields.slug || fields.title || "article-slug");
  const previewUrl = getCityHref(city, `/articles/${previewSlug || "article-slug"}`);

  function updateStructuredField<K extends keyof StructuredEvidence>(key: K, value: StructuredEvidence[K]) {
    setStructuredEvidence((current) => ({ ...current, [key]: value }));
  }

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function getBasePayload() {
    if (!source || !categoryId || !selectedAngle) {
      return null;
    }

    return {
      source,
      city,
      categoryId,
      rawNotes,
      structuredEvidence,
      images,
      selectedAngle,
      brief,
      draft,
      overlap,
    };
  }

  function canContinue() {
    switch (step) {
      case 1:
        return Boolean(source);
      case 2:
        return Boolean(categoryId);
      case 3:
        return rawNotes.trim().length >= 40;
      case 4:
        return true;
      case 5:
        return Boolean(selectedAngleId);
      case 6:
        return briefApproved;
      case 7:
        return Boolean(draft);
      case 8:
        return fields.title.length >= 8 && fields.body.length >= 120;
      default:
        return false;
    }
  }

  function handleSuggestAngles() {
    if (!source || !categoryId || rawNotes.trim().length < 40) {
      setError("Complete the evidence step before suggesting angles.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await suggestArticleAnglesAction(
        JSON.stringify({
          source,
          city,
          categoryId,
          rawNotes,
          structuredEvidence,
          images,
        }),
      );

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setAngles(result.data);
    });
  }

  function handleCheckOverlapAndBrief() {
    const payload = getBasePayload();

    if (!payload?.selectedAngle) {
      setError("Select an article angle first.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const overlapResult = await checkArticleOverlapAction(JSON.stringify(payload));

      if (!overlapResult.ok) {
        setError(overlapResult.error);
        return;
      }

      setOverlap(overlapResult.data);

      const briefResult = await generateArticleBriefAction(JSON.stringify(payload));

      if (!briefResult.ok) {
        setError(briefResult.error);
        return;
      }

      setBrief(briefResult.data);
      setBriefApproved(false);
    });
  }

  function handleGenerateDraft() {
    const payload = getBasePayload();

    if (!payload?.selectedAngle || !brief) {
      setError("Approve the article brief before generating the draft.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await generateGuidedArticleDraftAction(JSON.stringify(payload));

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const nextDraft = result.data;
      setDraft(nextDraft);

      const cover = images.find((image) => image.isCover)?.url || images[0]?.url || "";
      const body = buildBodyWithImages(nextDraft.body, images);

      setFields({
        title: nextDraft.title,
        slug: slugify(nextDraft.title),
        excerpt: nextDraft.excerpt,
        body,
        seoTitle: nextDraft.seoTitle,
        seoDescription: nextDraft.seoDescription,
        keywords: nextDraft.keywords.join(", "),
        coverImage: cover,
      });
    });
  }

  function handleRunReview() {
    const payload = getBasePayload();

    if (!payload?.selectedAngle || !brief || !draft) {
      setError("Generate the article draft before running content review.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await runArticleContentReviewAction(
        buildWorkflowPayload({
          ...payload,
          draft: {
            ...draft,
            title: fields.title,
            excerpt: fields.excerpt,
            body: fields.body,
            seoTitle: fields.seoTitle,
            seoDescription: fields.seoDescription,
            keywords: fields.keywords.split(",").map((entry) => entry.trim()).filter(Boolean),
          },
        }),
      );

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setReview(result.data);
    });
  }

  async function handleImageUpload(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setError(null);

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadArticleImageAction(formData);

      if (!result.ok) {
        setError(result.error);
        continue;
      }

      const image: WizardImage = {
        id: crypto.randomUUID(),
        url: result.data.url,
        alt: "",
        caption: "",
        ownerDescription: "",
        isCover: images.length === 0,
      };

      setImages((current) => [...current, image]);
    }
  }

  function handleSaveEvidenceDraft() {
    if (source !== "real-job" || !categoryId || rawNotes.trim().length < 40) {
      setError("Add real job notes before saving an evidence draft.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createEvidenceDraftFromWorkflowAction(
        JSON.stringify({
          source,
          city,
          categoryId,
          rawNotes,
          structuredEvidence,
          images,
        }),
      );

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSavedEvidenceId(result.data.id);
    });
  }

  function handleContinue() {
    if (!canContinue()) {
      return;
    }

    if (step === 5 && !selectedAngle) {
      setError("Select one article angle before continuing.");
      return;
    }

    if (step === 6 && !briefApproved) {
      setError("Approve the article brief before continuing.");
      return;
    }

    if (step === 7 && !draft) {
      setError("Generate the article draft before continuing.");
      return;
    }

    setError(null);
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  function handleBack() {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <div className="space-y-5 pb-32">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-muted)]">Guided article workflow</p>
        <button
          type="button"
          onClick={onOpenManualEditor}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
        >
          Manual editor
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <WizardStepShell
          step={1}
          totalSteps={TOTAL_STEPS}
          title="Where is this article coming from?"
          description="Choose the source of truth for this article. AI will not choose a topic for you."
        >
          <div className="space-y-3">
            {CONTENT_SOURCE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`block rounded-2xl border px-4 py-4 ${source === option.value ? "border-[var(--color-ink)] bg-white" : "border-[var(--color-border)] bg-white/70"}`}
              >
                <input
                  type="radio"
                  name="content-source"
                  value={option.value}
                  checked={source === option.value}
                  onChange={() => setSource(option.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-[var(--color-ink)]">{option.label}</span>
                <span className="mt-1 block text-sm leading-6 text-[var(--color-muted)]">{option.description}</span>
              </label>
            ))}
          </div>
        </WizardStepShell>
      ) : null}

      {step === 2 ? (
        <WizardStepShell
          step={2}
          totalSteps={TOTAL_STEPS}
          title="City and service"
          description="Select the city and the service category for this article."
        >
          <div className="space-y-4">
            <WizardField label="City">
              <select
                value={city}
                onChange={(event) => {
                  setCity(event.target.value as CitySlug);
                  setCategoryId("");
                }}
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
              >
                {cities.map((entry) => (
                  <option key={entry.slug} value={entry.slug}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </WizardField>
            <WizardField label="Service / category">
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </WizardField>
          </div>
        </WizardStepShell>
      ) : null}

      {step === 3 ? (
        <WizardStepShell
          step={3}
          totalSteps={TOTAL_STEPS}
          title="Tell us what actually happened"
          description="Raw notes are the primary evidence source. Structured fields are optional."
        >
          <div className="space-y-4">
            <WizardField label="Raw notes / job details">
              <WizardTextArea
                value={rawNotes}
                onChange={setRawNotes}
                rows={8}
                placeholder="Customer had water beside chimney in attic during heavy rain..."
              />
            </WizardField>
            <WizardField label="What did the homeowner notice?" hint="Optional">
              <WizardTextInput
                value={structuredEvidence.homeownerNotice}
                onChange={(value) => updateStructuredField("homeownerNotice", value)}
              />
            </WizardField>
            <WizardField label="What did you inspect?" hint="Optional">
              <WizardTextInput
                value={structuredEvidence.inspected}
                onChange={(value) => updateStructuredField("inspected", value)}
              />
            </WizardField>
            <WizardField label="What did you observe?" hint="Optional">
              <WizardTextInput
                value={structuredEvidence.observed}
                onChange={(value) => updateStructuredField("observed", value)}
              />
            </WizardField>
            <WizardField label="What did you find?" hint="Optional">
              <WizardTextInput
                value={structuredEvidence.found}
                onChange={(value) => updateStructuredField("found", value)}
              />
            </WizardField>
            <WizardField label="What work was performed?" hint="Optional">
              <WizardTextInput
                value={structuredEvidence.workPerformed}
                onChange={(value) => updateStructuredField("workPerformed", value)}
              />
            </WizardField>
            <WizardField label="What should a homeowner learn?" hint="Optional">
              <WizardTextInput
                value={structuredEvidence.homeownerLesson}
                onChange={(value) => updateStructuredField("homeownerLesson", value)}
              />
            </WizardField>
          </div>
        </WizardStepShell>
      ) : null}

      {step === 4 ? (
        <WizardStepShell
          step={4}
          totalSteps={TOTAL_STEPS}
          title="Job photos"
          description="Real photos are preferred. Describe what each photo shows. AI will not inspect images visually."
        >
          <div className="space-y-4">
            <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-4 py-4 text-sm font-semibold text-[var(--color-ink)]">
              Add photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="sr-only"
                onChange={(event) => {
                  void handleImageUpload(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
            {images.map((image) => (
              <div key={image.id} className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white/70 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.alt || "Uploaded job photo"} className="max-h-56 w-full rounded-xl object-cover" />
                <WizardField label="What does this photo show?">
                  <WizardTextInput
                    value={image.ownerDescription}
                    onChange={(value) =>
                      setImages((current) =>
                        current.map((entry) =>
                          entry.id === image.id ? { ...entry, ownerDescription: value, alt: value || entry.alt } : entry,
                        ),
                      )
                    }
                  />
                </WizardField>
                <WizardField label="Alt text">
                  <WizardTextInput
                    value={image.alt}
                    onChange={(value) =>
                      setImages((current) =>
                        current.map((entry) => (entry.id === image.id ? { ...entry, alt: value } : entry)),
                      )
                    }
                  />
                </WizardField>
                <WizardField label="Caption" hint="Optional">
                  <WizardTextInput
                    value={image.caption}
                    onChange={(value) =>
                      setImages((current) =>
                        current.map((entry) => (entry.id === image.id ? { ...entry, caption: value } : entry)),
                      )
                    }
                  />
                </WizardField>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setImages((current) =>
                        current.map((entry) => ({ ...entry, isCover: entry.id === image.id })),
                      )
                    }
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${image.isCover ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-border)]"}`}
                  >
                    {image.isCover ? "Cover image" : "Set as cover"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImages((current) => current.filter((entry) => entry.id !== image.id))}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {source === "real-job" ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  Save this as a reusable evidence draft
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  This stores the notes and photo context privately so you can attach it to service
                  pages later, even if you do not publish an article right now.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveEvidenceDraft}
                    disabled={isPending}
                    className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save evidence draft"}
                  </button>
                  {savedEvidenceId ? (
                    <a
                      href={`/admin/evidence/${savedEvidenceId}`}
                      className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
                    >
                      Open saved evidence
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </WizardStepShell>
      ) : null}

      {step === 5 ? (
        <WizardStepShell
          step={5}
          totalSteps={TOTAL_STEPS}
          title="Exact article angle"
          description="Suggest a few angles, then choose the one question this article will answer."
        >
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleSuggestAngles}
              disabled={isPending}
              className="min-h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-base font-semibold disabled:opacity-50"
            >
              {isPending ? "Suggesting angles..." : "Suggest article angles"}
            </button>
            {angles.map((angle) => (
              <label
                key={angle.id}
                className={`block rounded-2xl border px-4 py-4 ${selectedAngleId === angle.id ? "border-[var(--color-ink)] bg-white" : "border-[var(--color-border)] bg-white/70"}`}
              >
                <input
                  type="radio"
                  name="article-angle"
                  value={angle.id}
                  checked={selectedAngleId === angle.id}
                  onChange={() => setSelectedAngleId(angle.id)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-[var(--color-ink)]">{angle.label}</span>
                <span className="mt-2 block text-sm leading-6 text-[var(--color-muted)]">{angle.primaryQuestion}</span>
              </label>
            ))}
          </div>
        </WizardStepShell>
      ) : null}

      {step === 6 ? (
        <WizardStepShell
          step={6}
          totalSteps={TOTAL_STEPS}
          title="Article brief"
          description="Review overlap, generate the brief, edit if needed, then approve before writing the article."
        >
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleCheckOverlapAndBrief}
              disabled={isPending || !selectedAngle}
              className="min-h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-base font-semibold disabled:opacity-50"
            >
              {isPending ? "Working..." : "Check overlap and generate brief"}
            </button>

            {overlap ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4 text-sm leading-6 text-[var(--color-muted)]">
                <p className="font-semibold text-[var(--color-ink)]">
                  {overlap.status === "none" ? "No meaningful overlap found" : "Potential overlap"}
                </p>
                <p className="mt-2">{overlap.recommendation}</p>
                {overlap.matches.map((match) => (
                  <p key={match.slug} className="mt-2">
                    <span className="font-medium text-[var(--color-ink)]">{match.title}</span> — {match.reason}
                  </p>
                ))}
              </div>
            ) : null}

            {brief ? (
              <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
                <WizardField label="Proposed title">
                  <WizardTextInput
                    value={brief.proposedTitle}
                    onChange={(value) => setBrief({ ...brief, proposedTitle: value })}
                  />
                </WizardField>
                <WizardField label="Primary homeowner question">
                  <WizardTextArea
                    value={brief.primaryQuestion}
                    onChange={(value) => setBrief({ ...brief, primaryQuestion: value })}
                    rows={3}
                  />
                </WizardField>
                <WizardField label="Article purpose">
                  <WizardTextArea value={brief.purpose} onChange={(value) => setBrief({ ...brief, purpose: value })} rows={3} />
                </WizardField>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">Facts AI is allowed to use</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--color-muted)]">
                    {brief.allowedFacts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">Claims AI must NOT make</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--color-muted)]">
                    {brief.unsupportedClaims.map((claim) => (
                      <li key={claim}>{claim}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setBriefApproved(true)}
                  className="min-h-11 w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-base font-semibold text-[var(--color-paper)]"
                >
                  Approve brief & continue
                </button>
              </div>
            ) : null}
          </div>
        </WizardStepShell>
      ) : null}

      {step === 7 ? (
        <WizardStepShell
          step={7}
          totalSteps={TOTAL_STEPS}
          title="Generate article draft"
          description="The full article is written only after the brief is approved."
        >
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={isPending || !briefApproved || !brief}
              className="min-h-11 w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-base font-semibold text-[var(--color-paper)] disabled:opacity-50"
            >
              {isPending ? "Generating article..." : "Generate article from approved brief"}
            </button>
            {draft ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{draft.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{draft.excerpt}</p>
              </div>
            ) : null}
          </div>
        </WizardStepShell>
      ) : null}

      {step === 8 ? (
        <WizardStepShell
          step={8}
          totalSteps={TOTAL_STEPS}
          title="Review, edit, and publish"
          description="Run the internal content review, edit anything you want, then save or publish manually."
        >
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleRunReview}
              disabled={isPending}
              className="min-h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-base font-semibold disabled:opacity-50"
            >
              {isPending ? "Running review..." : "Run Search & AI Content Review"}
            </button>

            {review ? (
              <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-ink)]">Search & AI Content Review</p>
                <p className="text-sm leading-6 text-[var(--color-muted)]">{review.summary}</p>
                {review.categories.map((category) => (
                  <div key={category.name} className="rounded-xl border border-[var(--color-border)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--color-ink)]">{category.name}</p>
                      <ReviewStatusBadge status={category.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{category.notes}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="text-xs text-[var(--color-muted)]">Preview URL: {previewUrl}</p>

            <form action={saveArticleAction} className="space-y-4">
              <input type="hidden" name="returnTo" value="/admin/publish" />
              <input type="hidden" name="authorName" value={defaultAuthorName} />
              <input type="hidden" name="authorType" value="organization" />
              <input type="hidden" name="aiGenerated" value="true" />
              <input type="hidden" name="city" value={city} />
              <input
                type="hidden"
                name="coverImageAlt"
                value={images.find((image) => image.url === fields.coverImage)?.alt || ""}
              />

              <WizardField label="Title">
                <input
                  name="title"
                  value={fields.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  required
                  className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
                />
              </WizardField>
              <WizardField label="Slug">
                <input
                  name="slug"
                  value={fields.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
                />
              </WizardField>
              <WizardField label="Excerpt">
                <textarea
                  name="excerpt"
                  value={fields.excerpt}
                  onChange={(event) => updateField("excerpt", event.target.value)}
                  rows={3}
                  required
                  className="min-h-[5rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
                />
              </WizardField>
              <WizardField label="Body">
                <textarea
                  name="body"
                  value={fields.body}
                  onChange={(event) => updateField("body", event.target.value)}
                  rows={12}
                  required
                  className="min-h-[16rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 font-mono text-base leading-7 outline-none"
                />
              </WizardField>
              <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
                <ArticleBody markdown={fields.body} city={city} />
              </div>
              <WizardField label="SEO title">
                <input
                  name="seoTitle"
                  value={fields.seoTitle}
                  onChange={(event) => updateField("seoTitle", event.target.value)}
                  required
                  className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
                />
              </WizardField>
              <WizardField label="SEO description">
                <textarea
                  name="seoDescription"
                  value={fields.seoDescription}
                  onChange={(event) => updateField("seoDescription", event.target.value)}
                  rows={3}
                  required
                  className="min-h-[5rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
                />
              </WizardField>
              <WizardField label="Keywords">
                <input
                  name="keywords"
                  value={fields.keywords}
                  onChange={(event) => updateField("keywords", event.target.value)}
                  required
                  className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
                />
              </WizardField>
              <WizardField label="Cover image URL">
                <input
                  name="coverImage"
                  value={fields.coverImage}
                  onChange={(event) => updateField("coverImage", event.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
                />
              </WizardField>
              <input type="hidden" name="relatedSlugs" value="" />

              <div className="pb-28">
                <ArticlePublishControls layout="fixed" />
              </div>
            </form>
          </div>
        </WizardStepShell>
      ) : null}

      {step < 8 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-paper)]/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-lg gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || isPending}
              className="min-h-12 flex-1 rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-base font-semibold disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue() || isPending}
              className="min-h-12 flex-1 rounded-full bg-[var(--color-ink)] px-5 py-3 text-base font-semibold text-[var(--color-paper)] disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
