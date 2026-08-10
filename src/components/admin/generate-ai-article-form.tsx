"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";

export function GenerateAiArticleForm() {
  return (
    <Link
      href="/admin/publish"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
    >
      <PenLine className="h-4 w-4" />
      Create AI Article
    </Link>
  );
}
