"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  acceptWettAiNoteAction,
  autosaveWettReportAction,
  finalizeWettReportAction,
  lookupManufacturerRequirementAction,
  rejectWettAiNoteAction,
  resendWettReportAction,
  rewriteWettNoteAction,
  rewriteWettWordingAction,
  setWettReviewStatusAction,
  updateWettPhotoCaptionAction,
} from "@/app/admin/office/wett/actions";
import {
  purgeWettLocalRecovery,
  readWettLocalRecovery,
  writeWettLocalRecovery,
  type WettLocalRecoveryRecord,
} from "@/lib/wett/local-recovery";
import { FirstUseHelpBanner } from "@/components/admin/office/wett/wett-help";
import { WettKnowledgeSections, type PhotoLink } from "@/components/admin/office/wett/wett-knowledge-sections";
import { recommendationsNeeded } from "@/lib/wett/recommendations";
import { itemApplies, workflowFor } from "@/lib/wett/knowledge/index";
import { validateWettReportForFinalization } from "@/lib/wett/knowledge/completion-gate";
import {
  applyEditableDraft,
  editableFromReport,
  isEditableWettStatus,
  WETT_AI_REWRITE_MODES,
  type WettAiRewriteMode,
  type WettEditableDraft,
  type WettReport,
} from "@/lib/wett/schema";

const SECTIONS = [
  { id: "setup", label: "Setup" },
  { id: "property", label: "Property" },
  { id: "identification", label: "Identification" },
  { id: "system", label: "Inspection" },
  { id: "measurements", label: "Measurements & System Checks" },
  { id: "findings", label: "Additional Findings" },
  { id: "recommendations", label: "Technician Recommendations / Corrective Options" },
  { id: "notes", label: "Technician Notes" },
  { id: "review", label: "Review" },
  { id: "finalize", label: "Finalize" },
] as const;

type SaveState = "unsaved" | "saving" | "saved" | "failed";

const SAVE_LABELS: Record<SaveState, string> = {
  unsaved: "Unsaved",
  saving: "Saving",
  saved: "Saved",
  failed: "Save failed",
};

type SectionId = (typeof SECTIONS)[number]["id"];

export function WettReportBuilder({ initialReport, username }: { initialReport: WettReport; username: string }) {
  const router = useRouter();
  const [report, setReport] = useState(initialReport);
  const [section, setSection] = useState<SectionId>("setup");
  const [focusGroup, setFocusGroup] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [saveMessage, setSaveMessage] = useState<string>();
  const [recovery, setRecovery] = useState<WettLocalRecoveryRecord | null>(null);
  const [serverConflict, setServerConflict] = useState<WettReport | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoError, setPhotoError] = useState<string>();
  const [photoUploading, setPhotoUploading] = useState(false);
  const [aiMode, setAiMode] = useState<WettAiRewriteMode>("standard-professional");
  const [aiMessage, setAiMessage] = useState<string>();
  const [actionMessage, setActionMessage] = useState<string>();
  const reportRef = useRef(report);
  const sectionContentRef = useRef<HTMLElement | null>(null);
  const dirtyRef = useRef(false);
  const chainRef = useRef(Promise.resolve());
  const timerRef = useRef<number | null>(null);
  const editable = isEditableWettStatus(report.status);
  const showRecommendations = recommendationsNeeded(report);
  const sections = SECTIONS.filter((item) => item.id !== "recommendations" || showRecommendations);
  const sectionIndex = Math.max(0, sections.findIndex((item) => item.id === section));

  useEffect(() => {
    reportRef.current = report;
  }, [report]);

  const loadedReportRef = useRef(initialReport);
  if (loadedReportRef.current.id !== initialReport.id) {
    loadedReportRef.current = initialReport;
  }

  useEffect(() => {
    const loaded = loadedReportRef.current;
    const local = readWettLocalRecovery(username, loaded.id);

    if (!local || !isEditableWettStatus(loaded.status)) {
      return;
    }

    const serverEditable = JSON.stringify(editableFromReport(loaded));
    const localEditable = JSON.stringify(local.editable);
    const localIsNewer =
      local.savedRevision > loaded.audit.autosaveRevision ||
      (local.savedRevision === loaded.audit.autosaveRevision &&
        local.updatedAt > loaded.audit.updatedAt &&
        localEditable !== serverEditable);

    if (localIsNewer) {
      setRecovery(local);
      return;
    }

    if (local.savedRevision < loaded.audit.autosaveRevision) {
      purgeWettLocalRecovery(username, loaded.id);
    }
  }, [initialReport.id, username]);

  useEffect(() => {
    if (section === "recommendations" && !showRecommendations) {
      setSection("notes");
    }
  }, [section, showRecommendations]);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  useEffect(() => {
    const flush = () => {
      if (dirtyRef.current) {
        void persist();
      }
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    };
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) {
        return;
      }
      event.preventDefault();
    };

    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", onLeave);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const progressLabel = useMemo(() => `Section ${sectionIndex + 1} of ${sections.length}`, [sectionIndex, sections.length]);
  const currentSection = sections[sectionIndex] ?? sections[0];
  const inspectionWorkflow = workflowFor(report.system.type);
  const inspectionGroups = inspectionWorkflow?.sections.filter((group) => group.items.some((item) => itemApplies(item, report))) ?? [];
  const skipInitialScroll = useRef(true);

  useEffect(() => {
    if (skipInitialScroll.current) {
      skipInitialScroll.current = false;
      return;
    }
    const target = focusGroup ? document.getElementById(`wett-group-${focusGroup}`) : sectionContentRef.current;
    target?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [section, focusGroup]);

  function showSection(next: SectionId, groupId?: string | null) {
    setSection(next);
    setFocusGroup(next === "system" ? groupId || null : null);
    void persist();
  }

  function rememberLocal(next: WettReport) {
    writeWettLocalRecovery({
      username,
      reportId: next.id,
      savedRevision: next.audit.autosaveRevision,
      updatedAt: new Date().toISOString(),
      editable: editableFromReport(next),
    });
  }

  function updateDraft(updater: (draft: WettEditableDraft) => WettEditableDraft) {
    if (!editable) {
      return;
    }

    setReport((current) => {
      const next = applyEditableDraft(current, updater(editableFromReport(current)));
      reportRef.current = next;
      rememberLocal(next);
      return next;
    });
    dirtyRef.current = true;
    setSaveState("unsaved");
    setSaveMessage(undefined);
    scheduleSave();
  }

  function scheduleSave() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      void persist();
    }, 1600);
  }

  function enqueue<T>(task: () => Promise<T>) {
    const next = chainRef.current.then(task, task);
    chainRef.current = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  async function persist() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    return enqueue(async () => {
      if (!dirtyRef.current || !isEditableWettStatus(reportRef.current.status)) {
        return;
      }

      const snapshot = reportRef.current;
      setSaveState("saving");
      const result = await autosaveWettReportAction(
        snapshot.id,
        snapshot.audit.autosaveRevision,
        editableFromReport(snapshot),
      );

      if (!result.ok || !result.report) {
        setSaveState("failed");
        setSaveMessage(result.message);
        if (result.code === "conflict" && result.report) {
          setServerConflict(result.report);
          setRecovery({
            username,
            reportId: snapshot.id,
            savedRevision: reportRef.current.audit.autosaveRevision,
            updatedAt: new Date().toISOString(),
            editable: editableFromReport(reportRef.current),
          });
        }
        return;
      }

      const latestTyped = reportRef.current;
      const serverReport = result.report;
      const changedSinceSnapshot = JSON.stringify(editableFromReport(latestTyped)) !== JSON.stringify(editableFromReport(snapshot));

      if (changedSinceSnapshot) {
        const merged = applyEditableDraft(serverReport, editableFromReport(latestTyped));
        merged.audit.autosaveRevision = serverReport.audit.autosaveRevision;
        reportRef.current = merged;
        setReport(merged);
        dirtyRef.current = true;
        setSaveState("unsaved");
        scheduleSave();
        return;
      }

      dirtyRef.current = false;
      reportRef.current = serverReport;
      setReport(serverReport);
      setSaveState("saved");
      setSaveMessage(undefined);
      purgeWettLocalRecovery(username, serverReport.id);
    });
  }

  async function uploadPhoto(file: File | undefined, link: PhotoLink = {}) {
    if (!file || !editable) {
      return;
    }

    setPhotoError(undefined);
    setPhotoUploading(true);
    await persist();

    try {
      const body = new FormData();
      body.set("file", file);
      body.set("caption", link.caption || photoCaption);
      body.set("expectedRevision", String(reportRef.current.audit.autosaveRevision));
      if (link.checklistItemId) body.set("checklistItemId", link.checklistItemId);
      if (link.findingId) body.set("findingId", link.findingId);
      if (link.measurementId) body.set("measurementId", link.measurementId);
      if (link.inspectionSection) body.set("inspectionSection", link.inspectionSection);
      if (reportRef.current.system.type) body.set("systemType", reportRef.current.system.type);
      const response = await fetch(`/api/admin/wett/reports/${report.id}/photos`, {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as { error?: string; report?: WettReport };

      if (!response.ok || !payload.report) {
        setPhotoError(payload.error || "The photo could not be uploaded. Try again.");
        return;
      }

      reportRef.current = payload.report;
      setReport(payload.report);
      setPhotoCaption("");
      purgeWettLocalRecovery(username, payload.report.id);
    } catch {
      setPhotoError("The photo could not be uploaded. Try again.");
    } finally {
      setPhotoUploading(false);
    }
  }

  async function runRevisionAction(action: (revision: number) => Promise<{ ok: boolean; message?: string; report?: WettReport | null }>) {
    await persist();
    const result = await action(reportRef.current.audit.autosaveRevision);

    if (result.report) {
      reportRef.current = result.report;
      setReport(result.report);
    }

    return result;
  }

  return (
    <div>
      <p className="text-sm font-semibold text-[#6b625a]">{report.reportNumber}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className={`text-sm font-semibold ${saveState === "failed" ? "text-[#9a3412]" : "text-[#1c1816]"}`}>
          {SAVE_LABELS[saveState]}
        </p>
        <p className="text-sm text-[#6b625a]">{progressLabel}</p>
      </div>
      <FirstUseHelpBanner />
      {saveMessage ? <p className="mt-2 text-sm text-[#9a3412]">{saveMessage}</p> : null}
      {saveState === "failed" ? (
        <button type="button" onClick={() => void persist()} className="mt-3 min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold">
          Retry save
        </button>
      ) : null}

      {recovery ? (
        <div className="mt-4 rounded-3xl border border-[#c56a3a] bg-white p-4">
          <p className="text-sm leading-6">A newer copy of this draft is on this device. The server copy stays available.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white"
              onClick={() => {
                updateDraft(() => recovery.editable);
                setRecovery(null);
              }}
            >
              Restore this device
            </button>
            <button
              type="button"
              className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold"
              onClick={() => {
                if (serverConflict) {
                  reportRef.current = serverConflict;
                  setReport(serverConflict);
                  dirtyRef.current = false;
                  setSaveState("saved");
                }
                purgeWettLocalRecovery(username, report.id);
                setRecovery(null);
                setServerConflict(null);
              }}
            >
              Use server version
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 md:hidden">
        <SectionStepControls
          index={sectionIndex}
          total={sections.length}
          onPrevious={() => showSection(sections[sectionIndex - 1].id)}
          onNext={() => showSection(sections[sectionIndex + 1].id)}
        />
        <label className="grid gap-2 text-sm font-semibold">
          Section
          <select
            value={section === "system" && focusGroup ? `system:${focusGroup}` : section}
            onChange={(event) => {
              const value = event.target.value;
              if (value.startsWith("system:")) {
                showSection("system", value.slice("system:".length));
                return;
              }
              showSection(value as SectionId);
            }}
            className="min-h-12 w-full rounded-2xl border border-[#d8d0c6] bg-white px-3 text-base"
          >
            {sections.map((item, index) =>
              item.id === "system" && inspectionGroups.length > 0 ? (
                <optgroup key={item.id} label={`${index + 1}. ${item.label}`}>
                  <option value="system">
                    {index + 1}. {item.label}
                  </option>
                  {inspectionGroups.map((group) => (
                    <option key={group.id} value={`system:${group.id}`}>
                      {group.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option key={item.id} value={item.id}>
                  {index + 1}. {item.label}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <nav className="mt-5 hidden min-w-0 max-w-full gap-2 overflow-x-auto pb-2 md:flex" aria-label="Report sections">
        {sections.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => showSection(item.id)}
            className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-semibold ${
              item.id === section ? "bg-[#1c1816] text-white" : "bg-white text-[#1c1816]"
            }`}
          >
            {index + 1}. {item.label}
          </button>
        ))}
      </nav>

      <section ref={sectionContentRef} className="mt-4 scroll-mt-24 rounded-3xl border border-[#d8d0c6] bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold md:sr-only">{currentSection.label}</h2>
        <WettKnowledgeSections
          section={section}
          report={report}
          disabled={!editable}
          onChange={updateDraft}
          onUploadPhoto={(file, link) => void uploadPhoto(file, link)}
          onLookup={async (requirement) => {
            await persist();
            const result = await lookupManufacturerRequirementAction(reportRef.current.id, reportRef.current.audit.autosaveRevision, requirement);
            if (result.report) {
              reportRef.current = result.report;
              setReport(result.report);
              dirtyRef.current = false;
              setSaveState("saved");
            }
            return result.ok ? undefined : result.message;
          }}
          onRewriteText={async (text) => {
            const result = await rewriteWettWordingAction(report.id, text, aiMode);
            return result.candidate;
          }}
        />
        {section === "notes" ? (
          <div className="grid gap-4">
            <TextArea label="Technician note" value={report.notes.generalTechnicianNote || ""} disabled={!editable} onChange={(value) => updateDraft((draft) => ({ ...draft, notes: { ...draft.notes, generalTechnicianNote: value } }))} />
            <label className="grid gap-2 text-sm font-semibold">
              Rewrite style
              <select
                value={aiMode}
                disabled={!editable}
                onChange={(event) => setAiMode(event.target.value as WettAiRewriteMode)}
                className="min-h-12 rounded-2xl border border-[#d8d0c6] bg-white px-3 text-base"
              >
                {WETT_AI_REWRITE_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={!editable}
              onClick={() => {
                void runRevisionAction((revision) => rewriteWettNoteAction(report.id, revision, aiMode)).then((result) => {
                  setAiMessage(result.ok ? undefined : result.message);
                });
              }}
              className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              Rewrite note
            </button>
            {aiMessage ? <p className="text-sm text-[#6b625a]">{aiMessage}</p> : null}
            {report.notes.aiOriginalNote ? (
              <NoteBlock title="Original note" body={report.notes.aiOriginalNote} />
            ) : null}
            {report.notes.aiCandidateNote ? (
              <div className="rounded-2xl bg-[#f4efe8] p-4">
                <NoteBlock title="AI candidate" body={report.notes.aiCandidateNote} />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={() => void runRevisionAction((revision) => acceptWettAiNoteAction(report.id, revision))}>
                    Accept
                  </button>
                  <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold" onClick={() => void runRevisionAction((revision) => rejectWettAiNoteAction(report.id, revision))}>
                    Reject
                  </button>
                  <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold" onClick={() => void runRevisionAction((revision) => rewriteWettNoteAction(report.id, revision, aiMode)).then((result) => setAiMessage(result.ok ? undefined : result.message))}>
                    Retry
                  </button>
                </div>
              </div>
            ) : null}
            <TextArea label="Maintenance notes" value={report.maintenance.notes || ""} disabled={!editable} onChange={(value) => updateDraft((draft) => ({ ...draft, maintenance: { notes: value } }))} />
            <TextArea label="Protective barrier notes" value={report.protectiveBarrier.notes || ""} disabled={!editable} onChange={(value) => updateDraft((draft) => ({ ...draft, protectiveBarrier: { notes: value } }))} />
          </div>
        ) : null}
        {section === "review" ? (
          <div className="grid gap-4 text-sm leading-6">
            <p>Status: {report.status}</p>
            <p>Title: WETT Inspection Report. Release stays with the responsible inspector.</p>
            <ul className="grid gap-2">
              {validateWettReportForFinalization(report).blockers.map((blocker, index) => (
                <li key={`${index}-${blocker}`} className="rounded-2xl bg-[#f4efe8] px-3 py-3">{blocker}</li>
              ))}
            </ul>
            <details className="rounded-2xl border border-[#d8d0c6] p-3">
              <summary className="min-h-12 cursor-pointer text-sm font-semibold">View all report photos</summary>
              <div className="mt-3 grid gap-3">
                {report.photos.map((photo) => (
                  <figure key={photo.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/admin/wett/reports/${report.id}/photos/${photo.id}`} alt={photo.caption || "Inspection photo"} className="aspect-[4/3] w-full rounded-2xl object-cover" />
                    <figcaption className="mt-1 text-sm">{photo.caption || "Phoenix Evidence Photo"}</figcaption>
                  </figure>
                ))}
              </div>
            </details>
            <a href={`/admin/office/wett/${report.id}/preview`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#1c1816] px-4 font-semibold">Open preview</a>
            <a href={`/api/admin/wett/reports/${report.id}/pdf`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#1c1816] px-4 font-semibold">Download PDF</a>
          </div>
        ) : null}
        {section === "finalize" ? (
          <div className="grid gap-4 text-sm leading-6">
            <p>Status: {report.status}</p>
            <p>Delivery: {report.delivery.status}{report.delivery.failureReason ? ` — ${report.delivery.failureReason}` : ""}</p>
            <p>Title: WETT Inspection Report. Release stays with the responsible inspector.</p>
            <label className="flex min-h-12 items-center gap-3 font-semibold">
              <input type="checkbox" checked={report.signOff.inspectorApproved === true} disabled={!editable} onChange={(event) => updateDraft((draft) => ({ ...draft, signOff: { ...draft.signOff, inspectorApproved: event.target.checked } }))} />
              Inspector approval
            </label>
            <label className="flex min-h-12 items-center gap-3 font-semibold">
              <input type="checkbox" checked={report.signOff.classificationReviewed === true} disabled={!editable} onChange={(event) => updateDraft((draft) => ({ ...draft, signOff: { ...draft.signOff, classificationReviewed: event.target.checked } }))} />
              Classification reviewed
            </label>
            <label className="flex min-h-12 items-center gap-3 font-semibold">
              <input type="checkbox" checked={report.signOff.scopeReviewed === true} disabled={!editable} onChange={(event) => updateDraft((draft) => ({ ...draft, signOff: { ...draft.signOff, scopeReviewed: event.target.checked } }))} />
              Scope reviewed
            </label>
            <ul className="grid gap-2">
              {validateWettReportForFinalization(report).blockers.map((blocker, index) => (
                <li key={`${index}-${blocker}`} className="rounded-2xl bg-[#f4efe8] px-3 py-3">{blocker}</li>
              ))}
            </ul>
            {actionMessage ? <p>{actionMessage}</p> : null}
            {editable && report.status !== "ready-for-review" ? (
              <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 font-semibold" onClick={() => void setWettReviewStatusAction(report.id, "ready-for-review").then((result) => result.report && setReport(result.report))}>
                Mark ready for review
              </button>
            ) : null}
            {report.status === "ready-for-review" ? (
              <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 font-semibold" onClick={() => void setWettReviewStatusAction(report.id, "draft").then((result) => result.report && setReport(result.report))}>
                Return to draft
              </button>
            ) : null}
            {editable ? (
              <button
                type="button"
                className="min-h-12 rounded-full bg-[#c56a3a] px-4 font-semibold text-white"
                onClick={() => {
                  void persist().then(() => finalizeWettReportAction(report.id)).then((result) => {
                    if (result.report) {
                      reportRef.current = result.report;
                      setReport(result.report);
                    }
                    setActionMessage(result.ok ? "Report completed." : result.message);
                    if (result.ok) {
                      purgeWettLocalRecovery(username, report.id);
                      router.refresh();
                    }
                  });
                }}
              >
                Finalize report
              </button>
            ) : null}
            {report.status === "completed" && report.delivery.status !== "sent" ? (
              <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 font-semibold" onClick={() => void resendWettReportAction(report.id).then((result) => {
                if (result.report) setReport(result.report);
                setActionMessage(result.ok ? "Report email sent." : result.message);
              })}>
                Resend email
              </button>
            ) : null}
            <a href={`/admin/office/wett/${report.id}/preview`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#1c1816] px-4 font-semibold">
              Open preview
            </a>
            <a href={`/api/admin/wett/reports/${report.id}/pdf`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#1c1816] px-4 font-semibold">
              Download PDF
            </a>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function SectionStepControls({
  index,
  total,
  onPrevious,
  onNext,
}: {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={index <= 0}
        onClick={onPrevious}
        className="min-h-12 flex-1 touch-manipulation rounded-full border border-[#1c1816] bg-white px-4 text-sm font-semibold text-[#1c1816] disabled:opacity-40"
      >
        Previous
      </button>
      <p className="min-w-14 text-center text-sm font-semibold">
        {index + 1} / {total}
      </p>
      <button
        type="button"
        disabled={index >= total - 1}
        onClick={onNext}
        className="min-h-12 flex-1 touch-manipulation rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}


function TextField({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-2xl border border-[#d8d0c6] px-3 text-base font-normal"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <textarea
        value={value}
        disabled={disabled}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-[#d8d0c6] px-3 py-3 text-base font-normal"
      />
    </label>
  );
}

function NoteBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b625a]">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{body}</p>
    </div>
  );
}
