import type { CitySlug } from "@/lib/cities";

export type ArticleStatus = "draft" | "scheduled" | "published";

export type LeadDeliveryStatus = "sent" | "skipped" | "failed";

export type ArticleAuthorType = "organization" | "person";

export type Article = {
  id: string;
  city: CitySlug;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  relatedSlugs: string[];
  relatedServiceSlugs?: string[];
  status: ArticleStatus;
  scheduledAt?: string;
  authorName: string;
  authorType: ArticleAuthorType;
  coverImage?: string;
  coverImageAlt?: string;
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
  sendingEmail: string;
  hoursLabel: string;
  hoursDetail: string;
  serviceRadius: string;
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
  | "mapEmbedUrl"
  | "socialPreview"
  | "defaultAuthorName"
  | "blogIndexTitle"
  | "blogIndexDescription"
>;

export type LeadSource = "contact-form" | "website";

export type LeadDisposition = "pending" | "added-to-calendar" | "not-added";

export type LeadDispositionReason =
  | "customer-no-response"
  | "customer-declined"
  | "service-not-accepted";

export type Lead = {
  id: string;
  city: CitySlug;
  source: LeadSource;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  preferredDay?: string;
  preferredTime?: string;
  message: string;
  address?: string;
  addressStreet?: string;
  addressCity?: string;
  addressProvince?: string;
  addressPostalCode?: string;
  urgency?: string;
  urgencyDetail?: string;
  preferredContactMethod?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
  bookingDeliveryStatus?: LeadDeliveryStatus;
  bookingDeliveryNote?: string;
  emailDeliveryStatus: LeadDeliveryStatus;
  emailDeliveryNote?: string;
  disposition?: LeadDisposition;
  dispositionReason?: LeadDispositionReason;
  officeNote?: string;
  handledAt?: string;
  handledBy?: string;
};

export type GeneratedArticleDraft = {
  title: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
};

export type OfficeChecklistTaskId =
  | "review-new-overnight-leads"
  | "review-todays-calendar"
  | "check-office-inbox"
  | "review-yesterdays-unresolved-leads"
  | "complete-todays-article"
  | "morning-review-completed";

export type OfficeChecklistCompletion = {
  taskId: OfficeChecklistTaskId;
  completedAt: string;
  completedBy: string;
};

export type OfficeArticleTaskStatus =
  | "pending"
  | "in-progress"
  | "waiting-for-manager-image"
  | "done";

export type OfficeArticleTaskState = {
  calendarDate: string;
  website: string;
  topic: string;
  status: OfficeArticleTaskStatus;
  linkedArticleId?: string;
  aiImageProvidedAt?: string;
  realImageProvidedAt?: string;
  managerImageRequestedAt?: string;
  completedAt?: string;
  completedBy?: string;
};

export type OfficeDailyStateRecord = {
  date: string;
  username: string;
  checklist: OfficeChecklistCompletion[];
  articleTask?: OfficeArticleTaskState;
  updatedAt: string;
};

export type OfficeDailyStateStore = {
  records: OfficeDailyStateRecord[];
};