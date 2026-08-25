"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";

import { improveArticleFromNotesAction, saveArticleAction } from "@/app/admin/actions";
import { ArticlePublishControls } from "@/components/admin/article-publish-controls";
import { ArticleBody } from "@/components/articles/article-body";
import { cities, defaultCitySlug, getCityHref, type CitySlug } from "@/lib/cities";
import { slugify } from "@/lib/cms/helpers";
import type { GeneratedArticleDraft } from "@/lib/cms/types";
import { WEATHER_CONTENT_TAGS, WEATHER_CONTENT_TAG_LABELS, type WeatherContentTag } from "@/lib/weather/content-tags";

type MobileArticlePublisherProps = {
  defaultAuthorName: string;
};

type FormFields = {
  city: CitySlug;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  relatedSlugs: string;
  coverImage: string;
  coverImageAlt: string;
  weatherTags: WeatherContentTag[];
};

const emptyFields: FormFields = {
  city: defaultCitySlug,
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
  keywords: "",
  relatedSlugs: "",
  coverImage: "",
  coverImageAlt: "",
  weatherTags: [],
};

export function MobileArticlePublisher({ defaultAuthorName }: MobileArticlePublisherProps) {
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [aiNotes, setAiNotes] = useState("");
  const [aiDraft, setAiDraft] = useState<GeneratedArticleDraft | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiApplied, setAiApplied] = useState(false);
  const [showBodyPreview, setShowBodyPreview] = useState(false);
  const [showSeoExtras, setShowSeoExtras] = useState(true);
  const [isAiPending, startAiTransition] = useTransition();

  const previewSlug = slugify(fields.slug || fields.title || "article-slug");
  const previewUrl = getCityHref(fields.city, `/articles/${previewSlug || "article-slug"}`);
  const cityName = cities.find((city) => city.slug === fields.city)?.name || fields.city;

  const wordCount = useMemo(
    () => fields.body.trim().split(/\s+/).filter(Boolean).length,
    [fields.body],
  );

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function handleImproveWithAi() {
    setAiError(null);
    startAiTransition(async () => {
      const result = await improveArticleFromNotesAction(aiNotes, fields.city);

      if (!result.ok) {
        setAiDraft(null);
        setAiError(result.error);
        return;
      }

      setAiDraft(result.draft);
    });
  }

  function handleApplyAiDraft() {
    if (!aiDraft) {
      return;
    }

    setFields((current) => ({
      ...current,
      title: aiDraft.title,
      excerpt: aiDraft.excerpt,
      body: aiDraft.body,
      seoTitle: aiDraft.seoTitle,
      seoDescription: aiDraft.seoDescription,
      keywords: aiDraft.keywords.join(", "),
    }));
    setAiApplied(true);
    setShowSeoExtras(true);
  }

  function handleDiscardAiDraft() {
    setAiDraft(null);
    setAiError(null);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Preview</h2>
        <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-muted)]">
          <p>
            <span className="font-medium text-[var(--color-ink)]">City:</span> {cityName}
          </p>
          <p>
            <span className="font-medium text-[var(--color-ink)]">Title:</span>{" "}
            {fields.title || "Your article title"}
          </p>
          <p>
            <span className="font-medium text-[var(--color-ink)]">URL:</span>{" "}
            <span className="break-all font-mono text-xs">{previewUrl}</span>
          </p>
          <p>
            <span className="font-medium text-[var(--color-ink)]">Excerpt:</span>{" "}
            {fields.excerpt || "Your excerpt will appear here."}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">AI Writing Assistant</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Paste field notes or job details. AI will draft an article for your review — nothing publishes
          automatically.
        </p>

        <label className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">Raw notes / job details</span>
          <textarea
            value={aiNotes}
            onChange={(event) => setAiNotes(event.target.value)}
            rows={6}
            placeholder="Customer had water entering beside the chimney after a previous flashing repair..."
            className="min-h-[9rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </label>

        <button
          type="button"
          onClick={handleImproveWithAi}
          disabled={isAiPending || aiNotes.trim().length < 40}
          className="mt-4 min-h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-base font-semibold text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAiPending ? "Generating draft..." : "Improve with AI"}
        </button>

        {aiNotes.trim().length > 0 && aiNotes.trim().length < 40 ? (
          <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
            Add a bit more detail (at least 40 characters) before generating.
          </p>
        ) : null}

        {aiError ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            {aiError}
          </p>
        ) : null}

        {aiDraft ? (
          <div className="mt-4 space-y-4 rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
                AI draft preview
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--color-ink)]">{aiDraft.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{aiDraft.excerpt}</p>
              <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-sm leading-6 text-[var(--color-muted)]">
                {aiDraft.body}
              </p>
              <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">
                SEO: {aiDraft.seoTitle} · Keywords: {aiDraft.keywords.join(", ")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleApplyAiDraft}
                className="min-h-11 rounded-full bg-[var(--color-ink)] px-5 py-3 text-base font-semibold text-[var(--color-paper)]"
              >
                Apply to article fields
              </button>
              <button
                type="button"
                onClick={handleImproveWithAi}
                disabled={isAiPending}
                className="min-h-11 rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-base font-semibold text-[var(--color-ink)] disabled:opacity-50"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleDiscardAiDraft}
                className="min-h-11 rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-base font-semibold text-[var(--color-muted)]"
              >
                Discard
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <form action={saveArticleAction} className="space-y-5 pb-4">
        <input type="hidden" name="returnTo" value="/admin/publish" />
        <input type="hidden" name="authorName" value={defaultAuthorName} />
        <input type="hidden" name="authorType" value="organization" />
        <input type="hidden" name="aiGenerated" value={aiApplied ? "true" : "false"} />

        <MobileField label="City">
          <select
            name="city"
            value={fields.city}
            onChange={(event) => updateField("city", event.target.value as CitySlug)}
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
          >
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </MobileField>

        <MobileField label="Title" required>
          <input
            name="title"
            value={fields.title}
            onChange={(event) => updateField("title", event.target.value)}
            required
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
          />
        </MobileField>

        <MobileField label="Slug" hint="Leave blank to auto-generate from title">
          <input
            name="slug"
            value={fields.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="auto-from-title"
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
          />
        </MobileField>

        <MobileField label="Excerpt" required>
          <textarea
            name="excerpt"
            value={fields.excerpt}
            onChange={(event) => updateField("excerpt", event.target.value)}
            required
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </MobileField>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              Body <span className="text-[var(--color-ember)]">*</span>
            </span>
            <button
              type="button"
              onClick={() => setShowBodyPreview((current) => !current)}
              className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
            >
              {showBodyPreview ? "Edit" : "Preview"}
            </button>
          </div>

          {showBodyPreview ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-4">
              {fields.body.trim() ? (
                <ArticleBody markdown={fields.body} city={fields.city} />
              ) : (
                <p className="text-sm text-[var(--color-muted)]">Nothing to preview yet.</p>
              )}
            </div>
          ) : (
            <textarea
              name="body"
              value={fields.body}
              onChange={(event) => updateField("body", event.target.value)}
              required
              rows={14}
              className="min-h-[16rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 font-mono text-base leading-7 outline-none"
            />
          )}

          <p className="text-xs text-[var(--color-muted)]">{wordCount} words</p>
        </div>

        <button
          type="button"
          onClick={() => setShowSeoExtras((current) => !current)}
          className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-left text-sm font-semibold text-[var(--color-ink)]"
        >
          {showSeoExtras ? "Hide SEO & extras" : "Show SEO & extras"}
        </button>

        {showSeoExtras ? (
          <div className="space-y-5">
            <MobileField label="SEO title" required>
              <input
                name="seoTitle"
                value={fields.seoTitle}
                onChange={(event) => updateField("seoTitle", event.target.value)}
                required
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
              />
            </MobileField>

            <MobileField label="SEO description" required>
              <textarea
                name="seoDescription"
                value={fields.seoDescription}
                onChange={(event) => updateField("seoDescription", event.target.value)}
                required
                rows={3}
                className="min-h-[5rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
              />
            </MobileField>

            <MobileField label="Keywords" required hint="Comma-separated">
              <input
                name="keywords"
                value={fields.keywords}
                onChange={(event) => updateField("keywords", event.target.value)}
                required
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
              />
            </MobileField>

            <MobileField label="Cover image path" hint="Optional">
              <input
                name="coverImage"
                value={fields.coverImage}
                onChange={(event) => updateField("coverImage", event.target.value)}
                placeholder="/images/photos/hero-fireplace.jpg"
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
              />
            </MobileField>

            <MobileField
              label="Cover image alt"
              hint={fields.coverImage.trim() ? "Required when publishing with a cover image" : "Optional unless a cover image is set"}
            >
              <input
                name="coverImageAlt"
                value={fields.coverImageAlt}
                onChange={(event) => updateField("coverImageAlt", event.target.value)}
                placeholder="Gas fireplace with clean glass and steady flame"
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
              />
            </MobileField>

            <MobileField label="Related slugs" hint="Optional, comma-separated">
              <input
                name="relatedSlugs"
                value={fields.relatedSlugs}
                onChange={(event) => updateField("relatedSlugs", event.target.value)}
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
              />
            </MobileField>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-[var(--color-ink)]">Weather content tags</legend>
              <p className="mb-3 text-sm leading-6 text-[var(--color-muted)]">
                Explicit editorial tags only. These control the header weather article strip.
              </p>
              <div className="grid gap-2">
                {WEATHER_CONTENT_TAGS.map((tag) => (
                  <label key={tag} className="flex items-start gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-ink)]">
                    <input
                      type="checkbox"
                      name="weatherTags"
                      value={tag}
                      checked={fields.weatherTags.includes(tag)}
                      onChange={(event) => {
                        setFields((current) => ({
                          ...current,
                          weatherTags: event.target.checked
                            ? [...current.weatherTags, tag]
                            : current.weatherTags.filter((entry) => entry !== tag),
                        }));
                      }}
                    />
                    <span>
                      {tag}
                      <span className="block text-xs font-normal text-[var(--color-muted)]">{WEATHER_CONTENT_TAG_LABELS[tag]}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        ) : (
          <>
            <input type="hidden" name="seoTitle" value={fields.seoTitle} />
            <input type="hidden" name="seoDescription" value={fields.seoDescription} />
            <input type="hidden" name="keywords" value={fields.keywords} />
            <input type="hidden" name="coverImage" value={fields.coverImage} />
            <input type="hidden" name="coverImageAlt" value={fields.coverImageAlt} />
            <input type="hidden" name="relatedSlugs" value={fields.relatedSlugs} />
            {fields.weatherTags.map((tag) => (
              <input key={tag} type="hidden" name="weatherTags" value={tag} />
            ))}
          </>
        )}

        <input type="hidden" name="weatherTagsField" value="1" />

        <div className="pb-28">
          <ArticlePublishControls layout="fixed" />
        </div>
      </form>
    </div>
  );
}

function MobileField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[var(--color-ink)]">
        {label}
        {required ? <span className="text-[var(--color-ember)]"> *</span> : null}
      </span>
      {hint ? <span className="text-xs leading-5 text-[var(--color-muted)]">{hint}</span> : null}
      {children}
    </label>
  );
}
