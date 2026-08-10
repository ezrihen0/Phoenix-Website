import type { Article, ArticleAuthorType } from "@/lib/cms/types";

export function getArticleByline(
  article: Pick<Article, "authorName" | "authorType">,
  legalName: string,
) {
  if (article.authorType === "organization") {
    return `Published by ${legalName}`;
  }

  return article.authorName;
}

export function getArticleSchemaAuthorName(
  article: Pick<Article, "authorName" | "authorType">,
  legalName: string,
) {
  return article.authorType === "organization" ? legalName : article.authorName;
}

export function getDefaultAuthorType(authorType?: ArticleAuthorType): ArticleAuthorType {
  return authorType === "person" ? "person" : "organization";
}
