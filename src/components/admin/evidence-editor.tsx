"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import {
  saveEvidenceAction,
  uploadEvidenceImageAction,
} from "@/app/admin/actions";
import {
  WizardField,
  WizardTextArea,
  WizardTextInput,
} from "@/components/admin/guided-wizard-steps";
import { cities } from "@/lib/cities";
import {
  EVIDENCE_STATUS_VALUES,
  EVIDENCE_TYPE_VALUES,
  evidenceServiceOptions,
  type EvidenceImageRecord,
  type EvidenceRecord,
} from "@/lib/evidence";

type EvidenceEditorProps = {
  evidence?: EvidenceRecord | null;
};

function ensurePrimaryImage(images: EvidenceImageRecord[]) {
  if (images.length === 0) {
    return images;
  }

  if (images.some((image) => image.isPrimary)) {
    return images;
  }

  return images.map((image, index) => ({
    ...image,
    isPrimary: index === 0,
  }));
}

export function EvidenceEditor({ evidence }: EvidenceEditorProps) {
  const [images, setImages] = useState<EvidenceImageRecord[]>(
    ensurePrimaryImage(evidence?.images || []),
  );
  const [existingImagePath, setExistingImagePath] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [status, setStatus] = useState<EvidenceRecord["status"]>(
    evidence?.status || "draft",
  );
  const city = evidence?.jobCity || "calgary";

  const summary = useMemo(() => {
    return {
      services:
        evidenceServiceOptions
          .filter((option) =>
            (evidence?.serviceSlugs || []).includes(option.slug),
          )
          .map((option) => option.title)
          .join(", ") || "No services attached yet",
      city:
        cities.find((entry) => entry.slug === (evidence?.jobCity || city))?.name ||
        city,
    };
  }, [city, evidence?.jobCity, evidence?.serviceSlugs]);

  function setPrimaryImage(imageId: string) {
    setImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: image.id === imageId,
      })),
    );
  }

  function updateImage(
    imageId: string,
    updater: (image: EvidenceImageRecord) => EvidenceImageRecord,
  ) {
    setImages((current) =>
      current.map((image) => (image.id === imageId ? updater(image) : image)),
    );
  }

  function removeImage(imageId: string) {
    setImages((current) =>
      ensurePrimaryImage(current.filter((image) => image.id !== imageId)),
    );
  }

  function addExistingSiteImage() {
    const nextPath = existingImagePath.trim();

    if (!nextPath) {
      setError("Enter a site-relative image path such as /images/photos/example.jpg.");
      return;
    }

    if (!nextPath.startsWith("/images/")) {
      setError("Existing site assets must start with /images/.");
      return;
    }

    setError(null);
    setImages((current) =>
      ensurePrimaryImage([
        ...current,
        {
          id: crypto.randomUUID(),
          source: "site-asset",
          url: nextPath,
          isPrimary: current.length === 0,
          publicAlt: "",
          publicCaption: "",
          internalSourceDescription: "",
          approvedForPublic: false,
        },
      ]),
    );
    setExistingImagePath("");
  }

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setError(null);

    startUploadTransition(async () => {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadEvidenceImageAction(formData);

        if (!result.ok) {
          setError(result.error);
          continue;
        }

        setImages((current) =>
          ensurePrimaryImage([
            ...current,
            {
              id: crypto.randomUUID(),
              source: "blob-upload",
              url: result.data.url,
              isPrimary: current.length === 0,
              publicAlt: "",
              publicCaption: "",
              internalSourceDescription: "",
              approvedForPublic: false,
            },
          ]),
        );
      }
    });
  }

  return (
    <form
      action={saveEvidenceAction}
      className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8"
    >
      <input type="hidden" name="originalId" value={evidence?.id || ""} />
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

      <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 px-5 py-4 text-sm leading-7 text-[var(--color-muted)]">
        <p className="font-semibold text-[var(--color-ink)]">
          Evidence records stay private by default.
        </p>
        <p className="mt-2">
          Draft evidence never renders publicly. To publish, the record needs owner verification,
          privacy approval, and at least one attached service.
        </p>
      </div>

      {error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          <span>Status</span>
          <select
            name="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as EvidenceRecord["status"])
            }
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
          >
            {EVIDENCE_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          <span>City</span>
          <select
            name="city"
            defaultValue={evidence?.jobCity || "calgary"}
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
          >
            {cities.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          <span>Evidence type</span>
          <select
            name="evidenceType"
            defaultValue={evidence?.evidenceType || "mixed"}
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
          >
            {EVIDENCE_TYPE_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          <span>Job / evidence date</span>
          <input
            type="date"
            name="jobDate"
            defaultValue={evidence?.jobDate || ""}
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
          />
        </label>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
            Service association
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Attach each field example only to the services it can safely support.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {evidenceServiceOptions.map((option) => (
            <label
              key={option.slug}
              className="flex items-start gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-muted)]"
            >
              <input
                type="checkbox"
                name="serviceSlugs"
                value={option.slug}
                defaultChecked={Boolean(
                  evidence?.serviceSlugs.includes(option.slug),
                )}
                className="mt-1 h-4 w-4 rounded border-[var(--color-border)]"
              />
              <span>{option.title}</span>
            </label>
          ))}
        </div>
        <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
          <span className="font-semibold text-[var(--color-ink)]">Current services:</span>{" "}
          {summary.services}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <WizardField label="Public label" hint="Optional short label for the field example">
          <input
            type="text"
            name="summaryLabel"
            defaultValue={evidence?.publicData.summaryLabel || ""}
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
          />
        </WizardField>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <WizardField label="Homeowner problem" hint="Optional public-safe summary">
          <textarea
            name="homeownerProblem"
            defaultValue={evidence?.publicData.homeownerProblem || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="What was inspected">
          <textarea
            name="inspected"
            defaultValue={evidence?.publicData.inspected || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="What was observed">
          <textarea
            name="observed"
            defaultValue={evidence?.publicData.observed || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="What was found">
          <textarea
            name="found"
            defaultValue={evidence?.publicData.found || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="What work was performed">
          <textarea
            name="workPerformed"
            defaultValue={evidence?.publicData.workPerformed || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="Homeowner lesson">
          <textarea
            name="homeownerLesson"
            defaultValue={evidence?.publicData.homeownerLesson || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
            Evidence images
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Upload new photos or attach existing site assets. Public captions and alt text should
            describe only what the owner has verified.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]">
            {isUploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                void handleFileUpload(event.target.files);
                event.target.value = "";
              }}
            />
          </label>

          <div className="flex flex-1 gap-3">
            <input
              value={existingImagePath}
              onChange={(event) => setExistingImagePath(event.target.value)}
              placeholder="/images/photos/example.jpg"
              className="min-h-11 flex-1 rounded-full border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
            />
            <button
              type="button"
              onClick={addExistingSiteImage}
              className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Add existing
            </button>
          </div>
        </div>

        {images.length ? (
          <div className="space-y-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="space-y-3 rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.publicAlt || "Evidence image preview"}
                  className="max-h-72 w-full rounded-[1.25rem] object-cover"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                  {image.source}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <WizardField label="Public alt">
                    <WizardTextInput
                      value={image.publicAlt || ""}
                      onChange={(value) =>
                        updateImage(image.id, (entry) => ({
                          ...entry,
                          publicAlt: value,
                        }))
                      }
                    />
                  </WizardField>
                  <WizardField label="Public caption" hint="Optional">
                    <WizardTextInput
                      value={image.publicCaption || ""}
                      onChange={(value) =>
                        updateImage(image.id, (entry) => ({
                          ...entry,
                          publicCaption: value,
                        }))
                      }
                    />
                  </WizardField>
                </div>
                <WizardField label="Internal source description" hint="Never shown publicly">
                  <WizardTextArea
                    value={image.internalSourceDescription || ""}
                    onChange={(value) =>
                      updateImage(image.id, (entry) => ({
                        ...entry,
                        internalSourceDescription: value,
                      }))
                    }
                    rows={3}
                  />
                </WizardField>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                    <input
                      type="checkbox"
                      checked={image.approvedForPublic}
                      onChange={(event) =>
                        updateImage(image.id, (entry) => ({
                          ...entry,
                          approvedForPublic: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-[var(--color-border)]"
                    />
                    Approved for public display
                  </label>
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(image.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      image.isPrimary
                        ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                    }`}
                  >
                    {image.isPrimary ? "Primary image" : "Set as primary"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-[var(--color-border)] bg-white/50 px-5 py-6 text-sm leading-7 text-[var(--color-muted)]">
            No images attached yet.
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <WizardField label="Internal source note" hint="Never shown publicly">
          <textarea
            name="sourceNote"
            defaultValue={evidence?.internalData.sourceNote || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="Internal verification note" hint="Never shown publicly">
          <textarea
            name="verificationNote"
            defaultValue={evidence?.internalData.verificationNote || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="Internal owner notes" hint="Never shown publicly">
          <textarea
            name="ownerNotes"
            defaultValue={evidence?.internalData.ownerNotes || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
        <WizardField label="Internal location note" hint="Keep location context private">
          <textarea
            name="internalLocationNote"
            defaultValue={evidence?.internalData.internalLocationNote || ""}
            rows={4}
            className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
          />
        </WizardField>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-start gap-3 rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
          <input
            type="checkbox"
            name="ownerVerified"
            defaultChecked={evidence?.ownerVerified}
            className="mt-1 h-4 w-4 rounded border-[var(--color-border)]"
          />
          <span>
            <span className="block font-semibold text-[var(--color-ink)]">
              Owner verified
            </span>
            The facts and image context have been checked against a real job/source.
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
          <input
            type="checkbox"
            name="publicApproved"
            defaultChecked={evidence?.publicApproved}
            className="mt-1 h-4 w-4 rounded border-[var(--color-border)]"
          />
          <span>
            <span className="block font-semibold text-[var(--color-ink)]">
              Privacy approved for public display
            </span>
            This record contains no customer identity or location detail beyond the allowed public
            context.
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 font-semibold text-[var(--color-paper)]"
        >
          {evidence ? "Save evidence" : "Create evidence draft"}
        </button>
        {evidence?.id ? (
          <Link
            href="/admin/evidence"
            className="rounded-full border border-[var(--color-border)] px-6 py-3 font-semibold text-[var(--color-ink)]"
          >
            Back to evidence
          </Link>
        ) : null}
      </div>
    </form>
  );
}
