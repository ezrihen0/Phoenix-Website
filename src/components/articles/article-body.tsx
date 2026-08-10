import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getScopedPath, type CitySlug } from "@/lib/cities";

type ArticleBodyProps = {
  markdown: string;
  city?: CitySlug;
};

export function ArticleBody({ markdown, city }: ArticleBodyProps) {
  return (
    <div className="article-markdown max-w-none text-[var(--color-muted)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (!href) {
              return <span>{children}</span>;
            }

            if (href.startsWith("/")) {
              return <Link href={getScopedPath(href, city)}>{children}</Link>;
            }

            return (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}