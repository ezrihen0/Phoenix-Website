"use client";

import { useState } from "react";

import { GuidedArticleWizard } from "@/components/admin/guided-article-wizard";
import { MobileArticlePublisher } from "@/components/admin/mobile-article-publisher";

type PublishWorkspaceProps = {
  defaultAuthorName: string;
};

export function PublishWorkspace({ defaultAuthorName }: PublishWorkspaceProps) {
  const [mode, setMode] = useState<"guided" | "manual">("guided");

  if (mode === "manual") {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setMode("guided")}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
        >
          Back to guided workflow
        </button>
        <MobileArticlePublisher defaultAuthorName={defaultAuthorName} />
      </div>
    );
  }

  return <GuidedArticleWizard defaultAuthorName={defaultAuthorName} onOpenManualEditor={() => setMode("manual")} />;
}
