import Link from "next/link";
import { listArticles } from "@/lib/articles";
export function RelatedArticles({ current }: { current: string }) { const related = listArticles().filter((a) => a.slug !== current).slice(0, 3); return <section className="mt-10"><p className="section-kicker">More Answers</p><h2 className="section-title">Related Articles</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{related.map((a) => <Link key={a.slug} href={`/articles/${a.slug}`} className="card-premium p-4"><p className="font-medium text-[var(--inner-page-title)]">{a.title}</p></Link>)}</div></section>; }
