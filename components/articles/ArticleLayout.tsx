import Link from "next/link";
import { ShortAnswerBox } from "@/components/articles/ShortAnswerBox";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import type { Article } from "@/lib/articles";
import { articleSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
export function ArticleLayout({ article }: { article: Article }) {
  return <article className="container-shell py-14">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(article)) }} />
    <p className="section-kicker">Alberta Homeowner Guide</p>
    <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: {article.lastUpdated}</p>
    <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{article.title}</h1>
    <p className="mt-4 text-lg leading-8 text-[var(--text-secondary)]">{article.intro}</p>
    <ShortAnswerBox answer={article.shortAnswer} />
    <section className="mt-8 space-y-4 rounded-2xl border border-[var(--card-border)] bg-white/70 p-6 text-[var(--text-secondary)]">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">When to Call Phoenix</h2>
      <p className="leading-7">{article.whenToCall}</p>
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Alberta Context</h2>
      <p className="leading-7">{article.albertaContext}</p>
    </section>
    <div className="mt-8 flex flex-wrap gap-3">
      <a className="rounded-full bg-[var(--button-primary-bg)] px-5 py-3 font-medium text-[var(--button-primary-text)] premium-glow" href={siteConfig.phoneHref}>Call Now</a>
      <Link className="rounded-full border border-[var(--border-soft)] px-5 py-3 font-medium" href={article.relatedService}>Related Service</Link>
    </div>
    <RelatedArticles current={article.slug} />
  </article>;
}
