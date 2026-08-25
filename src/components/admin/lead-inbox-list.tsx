"use client";

import { useCallback, useState } from "react";

import { LeadCard } from "@/components/admin/lead-card";
import type { Lead } from "@/lib/cms/types";

type LeadInboxListProps = {
  leads: Lead[];
};

export function LeadInboxList({ leads }: LeadInboxListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const toggleLead = useCallback((leadId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  }, []);

  function expandAll() {
    setExpandedIds(new Set(leads.map((lead) => lead.id)));
  }

  function collapseAll() {
    setExpandedIds(new Set());
  }

  return (
    <div className="overflow-x-hidden space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white"
        >
          Expand All
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white"
        >
          Collapse All
        </button>
      </div>

      <div className="space-y-2">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            expanded={expandedIds.has(lead.id)}
            onToggle={() => toggleLead(lead.id)}
          />
        ))}
      </div>
    </div>
  );
}
