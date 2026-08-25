import { SEED_ARTICLES } from "@/lib/cms/seed-articles";
import type { Article, SiteSettings } from "@/lib/cms/types";

export const defaultSiteSettings: SiteSettings = {
  businessName: "Phoenix Chimney & Fireplace Services",
  legalName: "Phoenix Chimney & Fireplace Services",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://phoenixfireplace.ca",
  phoneDisplay: "(825) 823-9556",
  phoneHref: "+18258239556",
  email: "Service@phoenixfireplace.ca",
  sendingEmail: "Service@phoenixfireplace.ca",
  hoursLabel: "Sunday-Friday",
  hoursDetail: "9AM-6PM Calgary time",
  serviceRadius: "Serving Calgary and surrounding communities within 100 km.",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Calgary&t=m&z=9&output=embed&iwloc=near",
  socialPreview: "/images/photos/hero-fireplace.jpg",
  defaultAuthorName: "Phoenix Editorial Team",
  blogIndexTitle: "Fireplace & Chimney Advice Across Central Alberta",
  blogIndexDescription:
    "Weather-aware maintenance guidance, WETT inspection insights, and practical fireplace service advice for Calgary, Edmonton, and Red Deer homeowners.",
  aiProvider: "openai",
  aiModel: process.env.OPENAI_MODEL || "gpt-4.1",
  aiSystemPrompt:
    "Write practical, trustworthy articles for Alberta homeowners about fireplaces, chimneys, gas appliances, WETT inspections, and masonry repair. Default to general Alberta authority content. Use a city only when supplied context shows geography changes the answer. Separate code, official guidance, manufacturer rules, best practice, and Phoenix field notes. Do not invent jobs, photos, ratings, or legal requirements. Avoid fluff, unsafe DIY, and keyword stuffing. Open with a direct answer, then evidence and a relevant Phoenix service link.",
  sendLeadEmails: true,
  notificationEmail: "Service@phoenixfireplace.ca",
  googleAppPassword: "",
};

export const defaultArticles: Article[] = SEED_ARTICLES;
