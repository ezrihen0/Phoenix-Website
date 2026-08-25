import { getArticleHref } from "@/lib/cms/helpers";
import { listArticles } from "@/lib/cms/storage";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";

export const revalidate = 3600;

export async function GET() {
  const articles = await listArticles();
  const lastBuildDate = articles[0]?.updatedAt || new Date().toISOString();
  const items = articles
    .map((article) => {
      const url = absoluteUrl(getArticleHref(article));
      const coverImage = article.coverImage ? absoluteUrl(article.coverImage) : "";

      return `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <language>en-ca</language>
          <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
          <description>${escapeXml(article.excerpt)}</description>
          <author>${escapeXml(article.authorName)}</author>
          ${coverImage ? `<media:content url="${escapeXml(coverImage)}" medium="image" />` : ""}
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>${escapeXml(siteConfig.name)}</title>
        <link>${siteConfig.url}</link>
        <description>${escapeXml(siteConfig.description)}</description>
        <language>en-ca</language>
        <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
        <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}