import { cities, type CityDefinition } from "@/lib/cities";
import type { Article, SiteSettings } from "@/lib/cms/types";

const now = "2026-04-15T00:00:00.000Z";

export const defaultSiteSettings: SiteSettings = {
  businessName: "Phoenix Chimney & Fireplace Services",
  legalName: "Phoenix Chimney & Fireplace Services",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://phoenixfireplace.ca",
  phoneDisplay: "(825) 425-0050",
  phoneHref: "+18254250050",
  email: "phoenixfireplace0@gmail.com",
  sendingEmail: "phoenixfireplace0@gmail.com",
  hoursLabel: "Sunday-Friday",
  hoursDetail: "9AM-6PM local dispatch",
  serviceRadius: "Serving Calgary and surrounding communities within 100 km.",
  bookingLabel: "24/7 online booking",
  workizUrl:
    "https://online-booking.workiz.com/?ac=a4cec125301177c1e59dbd126ecf1fdb5e10a208bf0fd37dc32cf14e5be902f7",
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
    "Write practical, trustworthy SEO articles for Canadian homeowners about fireplaces, chimneys, gas appliances, WETT inspections, and masonry repair. Localize the content to the requested Alberta city, its weather patterns, and its insurance or reporting context. Avoid fluff, unsafe advice, and keyword stuffing. Prioritize clear structure, factual service guidance, and strong internal linking opportunities.",
  sendLeadEmails: false,
  notificationEmail: "phoenixfireplace0@gmail.com",
  googleAppPassword: "",
};

function getCityArticleSlugs(city: CityDefinition) {
  return {
    seasonal: `spring-fireplace-maintenance-checklist-${city.slug}`,
    wett: `when-to-book-a-wett-inspection-in-${city.slug}`,
    gas: `gas-fireplace-not-turning-on-${city.slug}`,
  };
}

function buildSeasonalChecklistArticle(city: CityDefinition): Article {
  const slugs = getCityArticleSlugs(city);
  const nearbyAreas = city.serviceAreas.slice(0, 4).join(", ");

  return {
    id: `seed-${city.slug}-spring-fireplace-checklist`,
    city: city.slug,
    slug: slugs.seasonal,
    title: `Spring Fireplace Maintenance Checklist for ${city.name} Homeowners`,
    excerpt:
      `A practical post-winter checklist for checking gas fireplaces, chimney draft, masonry wear, and service timing in ${city.name} before the next heating season.`,
    seoTitle:
      `Spring Fireplace Maintenance Checklist ${city.name} | What to Inspect After Winter`,
    seoDescription:
      `Learn what ${city.name} homeowners should inspect after winter, from soot and draft issues to gas fireplace service timing and masonry wear.`,
    keywords: [
      `spring fireplace maintenance ${city.name}`,
      `fireplace checklist ${city.name}`,
      `chimney inspection after winter ${city.name}`,
    ],
    relatedSlugs: [slugs.wett, slugs.gas],
    status: "published",
    authorName: "Phoenix Editorial Team",
    coverImage: "/images/photos/hero-fireplace.jpg",
    createdAt: now,
    updatedAt: now,
    publishedAt: "2026-03-20T14:00:00.000Z",
    aiGenerated: false,
    body: `## Why spring is the right time to inspect your system in ${city.name}

After a long heating season, fireplaces and chimneys have already done their hardest work. Spring is the easiest time to catch soot buildup, masonry wear, weak draft, and gas-fireplace performance issues before fall appointments fill up.

Local conditions matter here. ${city.weatherContext}

## What to inspect first

- Look for soot, staining, or unusual odors around the appliance.
- Check exterior brick, crown, and cap areas for visible moisture damage.
- If you have a gas unit, note any ignition hesitation, weak flame, or dirty glass.
- If you have a wood-burning system, schedule an inspection appointment if draft changed during the winter.

## What homeowners around ${city.name} usually miss

The hidden issue is often cumulative wear, not a dramatic failure. Freeze-thaw movement, moisture entry, and months of repeated firing can leave a system looking usable while draft, venting, or masonry performance is already slipping.

If you live around ${nearbyAreas}, the same rule applies: inspect in spring while repair timelines are still flexible.

## When to bring in professional service

If you notice ignition trouble, smoke spillage, heavy creosote, or visible masonry movement, book service before the next cold season. Homeowners dealing with gas appliance issues should review our [gas fireplace maintenance guide](/services/gas-fireplace-maintenance). If the concern is structural or venting-related, our [chimney sweeping and inspection guide](/services/chimney-sweeping-inspection) and [chimney repair and masonry page](/services/chimney-repair-masonry) are the right next steps.

## A simple planning rule

Spring is ideal for preventive service. Summer is ideal for larger masonry or liner work. Fall should be reserved for appointments that genuinely cannot wait.

## Related reading

- [When to book a WETT inspection in ${city.name}](/articles/${slugs.wett})
- [Gas fireplace not turning on in ${city.name}? Start here](/articles/${slugs.gas})
`,
  };
}

function buildWettArticle(city: CityDefinition): Article {
  const slugs = getCityArticleSlugs(city);

  return {
    id: `seed-${city.slug}-wett-booking-guide`,
    city: city.slug,
    slug: slugs.wett,
    title: `When to Book a WETT Inspection in ${city.name}`,
    excerpt:
      `A straightforward guide to when WETT inspections are typically needed in ${city.name} for insurance, real-estate transactions, new installations, and peace of mind.`,
    seoTitle:
      `When to Book a WETT Inspection in ${city.name} | Insurance and Home Sale Guide`,
    seoDescription:
      `Understand the most common reasons ${city.name} homeowners book a WETT inspection, including insurance, real-estate deals, and wood-burning appliance safety.`,
    keywords: [
      `WETT inspection ${city.name}`,
      `insurance fireplace inspection ${city.name}`,
      `home sale chimney inspection ${city.name}`,
    ],
    relatedSlugs: [slugs.seasonal, slugs.gas],
    status: "published",
    authorName: "Phoenix Editorial Team",
    coverImage: "/images/photos/wett-inspection.jpg",
    createdAt: now,
    updatedAt: now,
    publishedAt: "2026-03-29T13:00:00.000Z",
    aiGenerated: false,
    body: `## The most common reason ${city.name} homeowners book one

The biggest trigger is not curiosity. It is paperwork. A buyer, seller, insurer, or broker needs an inspection report they can use to make a decision.

That is especially true in Alberta, where local context often includes ${city.regulationContext.toLowerCase()}

## Common booking scenarios

### 1. Insurance review

Insurers often want a current inspection when a property has a wood stove, insert, or older fireplace system.

### 2. Real-estate transactions

Home sales frequently require documentation of visible condition, clearances, connected components, and obvious defects.

### 3. New appliance installation

If a stove or insert has recently been installed, a WETT inspection can document clearances, venting, and connected components for the file.

## What to do next

If you need a dedicated inspection visit, start on our [WETT inspections page](/wett). If the inspection is likely to reveal repair work, it also helps to understand our [chimney sweeping and inspection guide](/services/chimney-sweeping-inspection) and [chimney repair and masonry page](/services/chimney-repair-masonry) ahead of time.

## Local timing matters in ${city.name}

Because heating demand can stay high for long stretches, many homeowners wait too long and then try to book around a sale deadline or insurance renewal. If documentation is already on your radar, book before the file becomes urgent.

## Related reading

- [Spring fireplace maintenance checklist for ${city.name} homeowners](/articles/${slugs.seasonal})
- [Gas fireplace not turning on in ${city.name}? Start here](/articles/${slugs.gas})
`,
  };
}

function buildGasTroubleshootingArticle(city: CityDefinition): Article {
  const slugs = getCityArticleSlugs(city);

  return {
    id: `seed-${city.slug}-gas-fireplace-troubleshooting`,
    city: city.slug,
    slug: slugs.gas,
    title: `Gas Fireplace Not Turning On in ${city.name}? Start Here`,
    excerpt:
      `A homeowner-friendly guide to the most common gas fireplace startup issues in ${city.name}, when to stop troubleshooting, and when to call for service.`,
    seoTitle:
      `Gas Fireplace Not Turning On ${city.name} | Troubleshooting and Repair Guide`,
    seoDescription:
      `Review common gas fireplace ignition problems, what ${city.name} homeowners can safely check, and when professional repair is the right call.`,
    keywords: [
      `gas fireplace repair ${city.name}`,
      `gas fireplace not turning on ${city.name}`,
      `fireplace ignition issue ${city.name}`,
    ],
    relatedSlugs: [slugs.seasonal, slugs.wett],
    status: "published",
    authorName: "Phoenix Editorial Team",
    coverImage: "/images/photos/service-gasfireplace.jpg",
    createdAt: now,
    updatedAt: now,
    publishedAt: "2026-04-05T13:00:00.000Z",
    aiGenerated: false,
    body: `## Start with the safe checks only

If your gas fireplace is not turning on, do not jump straight to disassembly. The safe first checks are whether the unit has power, whether the wall switch or remote is functioning, and whether the appliance has clearly overdue cleaning.

## Why this shows up after heavy heating seasons

In ${city.name}, long periods of regular use can expose dirty pilot assemblies, tired ignition components, airflow issues, and general maintenance backlog faster than homeowners expect. ${city.weatherContext}

## Common causes

- Dirty pilot assembly or burner components
- Worn ignition components
- Valve or control issues
- Delayed maintenance causing poor startup performance

## When to stop troubleshooting

If the unit smells abnormal, clicks repeatedly without ignition, shuts off unexpectedly, or shows inconsistent flame quality, it is time to book professional service.

Our [gas fireplace maintenance guide](/services/gas-fireplace-maintenance) is designed for exactly that scenario. If you are already planning broader seasonal upkeep, pair it with a [spring maintenance review](/articles/${slugs.seasonal}). If the unit is aging out or the homeowner is already thinking beyond repair, review our [gas fireplace installation page](/services/gas-fireplace-installation) as well.

## Do not ignore inspection history

If a system has gone years without an inspection appointment, or if a property change means an insurer or buyer now wants documentation, it may make sense to combine the repair discussion with a [WETT planning review](/articles/${slugs.wett}).

## Related reading

- [When to book a WETT inspection in ${city.name}](/articles/${slugs.wett})
- [Spring fireplace maintenance checklist for ${city.name} homeowners](/articles/${slugs.seasonal})
`,
  };
}

export const defaultArticles: Article[] = cities.flatMap((city) => [
  buildSeasonalChecklistArticle(city),
  buildWettArticle(city),
  buildGasTroubleshootingArticle(city),
]);