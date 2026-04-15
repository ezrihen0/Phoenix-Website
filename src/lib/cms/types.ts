export type ArticleStatus = "draft" | "published";

export type LeadDeliveryStatus = "sent" | "skipped" | "failed";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  relatedSlugs: string[];
  status: ArticleStatus;
  authorName: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  aiGenerated: boolean;
};

export type SiteSettings = {
  businessName: string;
  legalName: string;
  siteUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  hoursLabel: string;
  hoursDetail: string;
  serviceRadius: string;
  bookingLabel: string;
  workizUrl: string;
  mapEmbedUrl: string;
  socialPreview: string;
  defaultAuthorName: string;
  blogIndexTitle: string;
  blogIndexDescription: string;
  aiProvider: "openai";
  aiModel: string;
  aiSystemPrompt: string;
  sendLeadEmails: boolean;
  notificationEmail: string;
  googleAppPassword: string;
};

export type PublicSiteSettings = Pick<
  SiteSettings,
  | "businessName"
  | "legalName"
  | "siteUrl"
  | "phoneDisplay"
  | "phoneHref"
  | "email"
  | "hoursLabel"
  | "hoursDetail"
  | "serviceRadius"
  | "bookingLabel"
  | "workizUrl"
  | "mapEmbedUrl"
  | "socialPreview"
  | "defaultAuthorName"
  | "blogIndexTitle"
  | "blogIndexDescription"
>;

export type Lead = {
  id: string;
  source: "contact-form";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  preferredDay?: string;
  preferredTime?: string;
  message: string;
  createdAt: string;
  bookingDeliveryStatus: LeadDeliveryStatus;
  bookingDeliveryNote?: string;
  emailDeliveryStatus: LeadDeliveryStatus;
  emailDeliveryNote?: string;
};

export type GeneratedArticleDraft = {
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
};