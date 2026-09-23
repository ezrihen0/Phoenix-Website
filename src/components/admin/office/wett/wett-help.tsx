"use client";

import { useEffect, useId, useState, type PointerEvent } from "react";

import { askWettTechnicianHelpAction } from "@/app/admin/office/wett/actions";
import {
  AI_HELP_UNAVAILABLE,
  FIELD_GUIDE_TOPICS,
  helpContextFromReport,
  type TechnicianHelpAnswer,
  type TechnicianHelpContext,
  type WettHelpGuidance,
} from "@/lib/wett/knowledge/help";
import type { WettReport } from "@/lib/wett/schema";

const FIRST_USE_KEY = "phoenix-wett-help-seen";

export function HelpIconButton({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Help: ${label}`}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d8d0c6] bg-white text-base font-semibold text-[#6b625a]"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen();
      }}
    >
      ?
    </button>
  );
}

export function WettHelpControl({
  guidance,
  report,
  currentSection,
  inspectionGroup,
  inspectionItem,
  currentStatus,
  onLookup,
  onTakePhoto,
}: {
  guidance?: WettHelpGuidance;
  report: WettReport;
  currentSection: string;
  inspectionGroup?: string;
  inspectionItem?: string;
  currentStatus?: string;
  onLookup?: (requirement: string) => Promise<string | undefined>;
  onTakePhoto?: (file: File) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!guidance) return null;
  const context = helpContextFromReport(report, {
    helpId: guidance.id,
    helpTitle: guidance.title,
    currentSection,
    inspectionGroup,
    inspectionItem: inspectionItem || guidance.title,
    currentStatus,
  });

  return (
    <>
      <HelpIconButton label={guidance.title} onOpen={() => setOpen(true)} />
      {open ? (
        <HelpSheet
          guidance={guidance}
          context={context}
          onClose={() => setOpen(false)}
          onLookup={guidance.manufacturerDependent && onLookup ? () => void onLookup(guidance.title) : undefined}
          onTakePhoto={guidance.photoTargetId && onTakePhoto ? onTakePhoto : undefined}
        />
      ) : null}
    </>
  );
}

export function WettFieldGuideButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="inline-flex min-h-11 items-center rounded-full border border-[#d8d0c6] px-3 text-sm font-semibold text-white" onClick={() => setOpen(true)}>
        ? Help
      </button>
      {open ? <FieldGuideSheet onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function FirstUseHelpBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(FIRST_USE_KEY) !== "dismissed");
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="mt-4 rounded-3xl border border-[#d8d0c6] bg-white p-4">
      <p className="text-sm font-semibold">New to Phoenix WETT?</p>
      <p className="mt-2 text-sm leading-6">Tap the ? beside any inspection area for quick guidance on what to inspect, what evidence to capture, and when UTI applies.</p>
      <button
        type="button"
        className="mt-3 min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white"
        onClick={() => {
          try {
            window.localStorage.setItem(FIRST_USE_KEY, "dismissed");
          } catch {
            // The banner can still close for this visit.
          }
          setVisible(false);
        }}
      >
        Got it
      </button>
    </div>
  );
}

function FieldGuideSheet({ onClose }: { onClose: () => void }) {
  const [topic, setTopic] = useState(FIELD_GUIDE_TOPICS[0]);
  const context: TechnicianHelpContext = {
    business: "Phoenix",
    province: "Alberta",
    currentSection: "Field guide",
    inspectionItem: topic.title,
    helpId: topic.id,
    helpTitle: topic.title,
  };

  return (
    <HelpSheet
      guidance={topic}
      context={context}
      onClose={onClose}
      topics={FIELD_GUIDE_TOPICS}
      onTopic={setTopic}
    />
  );
}

function HelpSheet({
  guidance,
  context,
  onClose,
  onLookup,
  onTakePhoto,
  topics,
  onTopic,
}: {
  guidance: WettHelpGuidance;
  context: TechnicianHelpContext;
  onClose: () => void;
  onLookup?: () => void;
  onTakePhoto?: (file: File) => void;
  topics?: WettHelpGuidance[];
  onTopic?: (topic: WettHelpGuidance) => void;
}) {
  const titleId = useId();
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [answer, setAnswer] = useState<TechnicianHelpAnswer>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = Number(event.currentTarget.dataset.startY || "0");
    if (event.clientY - start > 70) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-help-id={guidance.id}
        className="flex w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl"
        style={{ height: "62vh", maxHeight: "70vh", minHeight: "50vh" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 border-b border-[#d8d0c6] px-4 py-3"
          data-start-y="0"
          onPointerDown={(event) => {
            event.currentTarget.dataset.startY = String(event.clientY);
          }}
          onPointerUp={onPointerUp}
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#6b625a]">Phoenix WETT Field Guide</p>
            <h2 id={titleId} className="truncate text-base font-semibold">{guidance.title}</h2>
          </div>
          <button type="button" aria-label="Close help" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#1c1816] text-base font-semibold" onClick={onClose}>
            X
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {topics && onTopic ? (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {topics.map((topic) => (
                <button key={topic.id} type="button" className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${topic.id === guidance.id ? "bg-[#1c1816] text-white" : "border border-[#d8d0c6]"}`} onClick={() => onTopic(topic)}>
                  {topic.title}
                </button>
              ))}
            </div>
          ) : null}
          <HelpBlock label="What are you checking?" text={guidance.summary} />
          <HelpList label="What to look for" items={guidance.checks} />
          {guidance.accessGuidance ? <HelpBlock label="When UTI may apply" text={guidance.accessGuidance} /> : null}
          {guidance.evidenceGuidance ? <HelpBlock label="Evidence to capture" text={guidance.evidenceGuidance} /> : null}
          {guidance.caution ? <HelpBlock label="Important caution" text={guidance.caution} /> : null}
          {context.systemLabel ? <p className="mt-3 text-sm text-[#6b625a]">System: {context.systemLabel}{context.model ? ` · Model: ${context.model}` : ""}</p> : null}
          {guidance.manufacturerDependent ? <p className="mt-3 text-sm font-semibold">Manufacturer-specific item</p> : null}
          {onLookup ? (
            <button type="button" className="mt-3 min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={onLookup}>
              Find Manufacturer Requirement
            </button>
          ) : null}
          {onTakePhoto ? (
            <label className="mt-3 inline-flex min-h-12 items-center rounded-full border border-[#1c1816] px-4 text-sm font-semibold">
              Take Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) onTakePhoto(file);
                }}
              />
            </label>
          ) : null}
          <div className="mt-5 grid gap-2 border-t border-[#d8d0c6] pt-4">
            <p className="text-sm font-semibold">Ask AI About This Check</p>
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={3} placeholder="Optional. The current system and check are included." className="min-h-20 rounded-2xl border border-[#d8d0c6] px-3 py-2 text-base" />
            <button
              type="button"
              disabled={pending}
              className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold disabled:opacity-50"
              onClick={() => {
                setPending(true);
                setMessage(undefined);
                void askWettTechnicianHelpAction(context, question).then((result) => {
                  setPending(false);
                  if (result.answer) {
                    setAnswer(result.answer);
                    setMessage(undefined);
                    return;
                  }
                  setAnswer(undefined);
                  setMessage(result.message || AI_HELP_UNAVAILABLE);
                });
              }}
            >
              {pending ? "Asking…" : "Ask AI About This Check"}
            </button>
            {message ? <p className="text-sm leading-6">{message}</p> : null}
            {answer ? (
              <div className="grid gap-3 rounded-2xl bg-[#f4efe8] p-3 text-sm leading-6">
                <HelpBlock label="Quick answer" text={answer.quickAnswer} />
                <HelpList label="What to verify next" items={answer.verifyNext} />
                <HelpBlock label="Source path" text={answer.sourcePath} />
                <HelpBlock label="Caution" text={answer.caution} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-sm leading-6">{text}</p>
    </div>
  );
}

function HelpList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold">{label}</p>
      <ul className="mt-1 list-disc pl-5 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
