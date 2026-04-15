import type { Article, SiteSettings } from "@/lib/cms/types";

const now = "2026-04-15T00:00:00.000Z";

export const defaultSiteSettings: SiteSettings = {
  businessName: "Phoenix Chimney & Fireplace Services",
  legalName: "Phoenix Chimney & Fireplace Services",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fireplacerepairscalgary.ca",
  phoneDisplay: "(825) 425-0050",
  phoneHref: "+18254250050",
  email: "phoenixfireplace0@gmail.com",
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
  blogIndexTitle: "Fireplace & Chimney Advice for Calgary Homes",
  blogIndexDescription:
    "News, maintenance guidance, inspection insights, and seasonal fireplace advice written to help Calgary homeowners make safer service decisions.",
  aiProvider: "openai",
  aiModel: process.env.OPENAI_MODEL || "gpt-4.1",
  aiSystemPrompt:
    "Write practical, trustworthy SEO articles for Calgary homeowners about fireplaces, chimneys, gas appliances, WETT inspections, and masonry repair. Avoid fluff, unsafe advice, and keyword stuffing. Prioritize clear structure, factual service guidance, and strong internal linking opportunities.",
  sendLeadEmails: false,
  notificationEmail: "phoenixfireplace0@gmail.com",
  googleAppPassword: "",
};

export const defaultArticles: Article[] = [
  {
    id: "seed-spring-fireplace-checklist",
    slug: "spring-fireplace-maintenance-checklist-calgary",
    title: "Spring Fireplace Maintenance Checklist for Calgary Homeowners",
    excerpt:
      "A practical post-winter checklist for checking gas fireplaces, chimney draft, masonry damage, and service timing before the next heating season.",
    seoTitle:
      "Spring Fireplace Maintenance Checklist Calgary | What to Inspect After Winter",
    seoDescription:
      "Learn what Calgary homeowners should inspect after winter, from soot and draft issues to gas fireplace service timing and chimney masonry wear.",
    keywords: [
      "spring fireplace maintenance Calgary",
      "fireplace checklist Calgary",
      "chimney inspection after winter",
    ],
    relatedSlugs: [
      "when-to-book-a-wett-inspection-in-calgary",
      "gas-fireplace-not-turning-on-calgary",
    ],
    status: "published",
    authorName: "Phoenix Editorial Team",
    coverImage: "/images/photos/hero-fireplace.jpg",
    createdAt: now,
    updatedAt: now,
    publishedAt: "2026-03-20T14:00:00.000Z",
    aiGenerated: false,
    body: `## Why spring is the right time to inspect your system

After a long Calgary heating season, fireplaces and chimneys have already done their hardest work. Spring is the easiest time to catch soot buildup, masonry wear, weak draft, and gas-fireplace performance issues before fall appointments fill up.

## What to inspect first

- Look for soot, staining, or unusual odors around the appliance.
- Check exterior brick, crown, and cap areas for visible moisture damage.
- If you have a gas unit, note any ignition hesitation, weak flame, or dirty glass.
- If you have a wood-burning system, schedule a proper inspection if draft changed during the winter.

## When to bring in professional service

If you notice ignition trouble, smoke spillage, heavy creosote, or visible masonry movement, the safest move is to book service before the next cold season. Calgary homeowners dealing with gas appliance issues should review our [gas fireplace repair service](/services#gas-fireplace-repair). If the concern is structural or venting-related, our [chimney sweep and repair service](/services#chimney-sweep-repair) is the right next step.

## A simple planning rule

Spring is ideal for preventive service. Summer is ideal for larger masonry or liner work. Fall should be reserved for appointments that genuinely cannot wait.

## Related reading

- [When to book a WETT inspection in Calgary](/articles/when-to-book-a-wett-inspection-in-calgary)
- [Gas fireplace not turning on in Calgary? Start here](/articles/gas-fireplace-not-turning-on-calgary)
`,
  },
  {
    id: "seed-wett-booking-guide",
    slug: "when-to-book-a-wett-inspection-in-calgary",
    title: "When to Book a WETT Inspection in Calgary",
    excerpt:
      "A straightforward guide to when WETT inspections are typically needed for insurance, real-estate transactions, new installations, and peace of mind.",
    seoTitle:
      "When to Book a WETT Inspection in Calgary | Insurance and Home Sale Guide",
    seoDescription:
      "Understand the most common reasons Calgary homeowners book a WETT inspection, including insurance, real-estate deals, and wood-burning appliance safety.",
    keywords: [
      "WETT inspection Calgary",
      "insurance fireplace inspection Calgary",
      "home sale chimney inspection Calgary",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-calgary",
      "gas-fireplace-not-turning-on-calgary",
    ],
    status: "published",
    authorName: "Phoenix Editorial Team",
    coverImage: "/images/photos/wett-inspection.jpg",
    createdAt: now,
    updatedAt: now,
    publishedAt: "2026-03-29T13:00:00.000Z",
    aiGenerated: false,
    body: `## The most common reason Calgary homeowners book one

The biggest trigger is not curiosity. It is paperwork. A buyer, seller, insurer, or broker needs a qualified inspection and a report they can use to make a decision.

## Common booking scenarios

### 1. Insurance review

Insurers often want a current inspection when a property has a wood stove, insert, or older fireplace system.

### 2. Real-estate transactions

Home sales frequently require confirmation that the system is safe, installed correctly, and not hiding obvious defects.

### 3. New appliance installation

If a stove or insert has recently been installed, a WETT inspection can confirm whether clearances, venting, and connected components meet the right standard.

## What to do next

If you need a dedicated inspection visit, start on our [WETT inspections page](/wett). If the inspection is likely to reveal repair work, it also helps to understand our [masonry and chimney repair services](/services#masonry-rebuilds) ahead of time.

## Related reading

- [Spring fireplace maintenance checklist for Calgary homeowners](/articles/spring-fireplace-maintenance-checklist-calgary)
- [Gas fireplace not turning on in Calgary? Start here](/articles/gas-fireplace-not-turning-on-calgary)
`,
  },
  {
    id: "seed-gas-fireplace-troubleshooting",
    slug: "gas-fireplace-not-turning-on-calgary",
    title: "Gas Fireplace Not Turning On in Calgary? Start Here",
    excerpt:
      "A homeowner-friendly guide to the most common gas fireplace startup issues, when to stop troubleshooting, and when to call for service.",
    seoTitle:
      "Gas Fireplace Not Turning On Calgary | Troubleshooting and Repair Guide",
    seoDescription:
      "Review common gas fireplace ignition problems, what Calgary homeowners can safely check, and when professional repair is the right call.",
    keywords: [
      "gas fireplace repair Calgary",
      "gas fireplace not turning on",
      "fireplace ignition issue Calgary",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-calgary",
      "when-to-book-a-wett-inspection-in-calgary",
    ],
    status: "published",
    authorName: "Phoenix Editorial Team",
    coverImage: "/images/photos/service-gasfireplace.jpg",
    createdAt: now,
    updatedAt: now,
    publishedAt: "2026-04-05T13:00:00.000Z",
    aiGenerated: false,
    body: `## Start with the safe checks only

If your gas fireplace is not turning on, do not jump straight to disassembly. The safe first checks are whether the unit has power, whether the wall switch or remote is functioning, and whether the appliance has clearly overdue cleaning.

## Common causes

- Dirty pilot assembly or burner components
- Worn ignition components
- Valve or control issues
- Delayed maintenance causing poor startup performance

## When to stop troubleshooting

If the unit smells abnormal, clicks repeatedly without ignition, shuts off unexpectedly, or shows inconsistent flame quality, it is time to book professional service.

Our [gas fireplace repair and maintenance service](/services#gas-fireplace-repair) is designed for exactly that scenario. If you are already planning broader seasonal upkeep, pair it with a [spring maintenance review](/articles/spring-fireplace-maintenance-checklist-calgary).

## Related reading

- [When to book a WETT inspection in Calgary](/articles/when-to-book-a-wett-inspection-in-calgary)
- [Spring fireplace maintenance checklist for Calgary homeowners](/articles/spring-fireplace-maintenance-checklist-calgary)
`,
  },
];