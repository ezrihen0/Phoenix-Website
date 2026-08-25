"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";

import {
  PORTAL_DOCUMENT_FILTERS,
  type PortalDocumentKind,
  type PortalPreviewLibraryDocument,
} from "@/lib/portal/ui-preview";

type PortalDocumentsTabProps = {
  documents: PortalPreviewLibraryDocument[];
};

export function PortalDocumentsTab({ documents }: PortalDocumentsTabProps) {
  const [filter, setFilter] = useState<(typeof PORTAL_DOCUMENT_FILTERS)[number]["id"]>("all");

  const visible = useMemo(() => {
    if (filter === "all") {
      return documents;
    }

    return documents.filter((document) => document.kind === (filter as PortalDocumentKind));
  }, [documents, filter]);

  if (documents.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-10 text-center shadow-[0_10px_30px_rgba(31,26,22,0.05)]">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">No documents yet</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Reports and documents shared with you will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PORTAL_DOCUMENT_FILTERS.map((item) => {
          const isActive = item.id === filter;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)] ${
                isActive
                  ? "bg-[var(--color-ember)] text-white"
                  : "border border-[var(--color-border)] bg-white text-[var(--color-muted)]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted)]">No documents in this group yet.</p>
      ) : (
        <ul className="mt-5 grid gap-3">
          {visible.map((document) => (
            <li
              key={document.id}
              className="flex items-start gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_8px_24px_rgba(31,26,22,0.04)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(90,108,122,0.12)] text-[#4d5d6b]">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{document.kind} document</span>
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-ink)]">{document.title}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{document.jobNumber}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {document.dateLabel} · {document.fileType}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
