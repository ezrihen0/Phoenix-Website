import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { estimateReadingTime, formatArticleDate } from "@/lib/cms/helpers";
import type { Article } from "@/lib/cms/types";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_18px_40px_rgba(31,26,22,0.06)]">
      {article.coverImage ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
          <span>{formatArticleDate(article.publishedAt)}</span>
          <span className="inline-flex items-center gap-2 text-[var(--color-muted)]">
            <Clock3 className="h-3.5 w-3.5 text-[var(--color-ember)]" />
            {estimateReadingTime(article.body)} min read
          </span>
        </div>
        <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
          {article.title}
        </h2>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{article.excerpt}</p>
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
        >
          Read article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}