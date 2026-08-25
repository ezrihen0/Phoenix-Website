import type { Article } from "@/lib/cms/types";

const AUTHOR = "Phoenix Editorial Team";
const CREATED_AT = "2026-08-24T00:00:00.000Z";

function generalArticle(
  partial: Omit<Article, "scope" | "authorName" | "authorType" | "aiGenerated" | "status" | "createdAt" | "updatedAt"> & {
    publishedAt: string;
  },
): Article {
  return {
    scope: "general",
    authorName: AUTHOR,
    authorType: "organization",
    aiGenerated: false,
    status: "published",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    ...partial,
  };
}

export const SEED_ARTICLES: Article[] = [
  generalArticle({
    id: "seed-general-spring-fireplace-checklist",
    slug: "spring-fireplace-maintenance-checklist",
    title: "What Should Alberta Homeowners Check on Their Fireplace This Spring?",
    excerpt:
      "After a long heating season, spring is the practical window to inspect soot, draft, gas performance, and exterior masonry before fall bookings tighten.",
    seoTitle: "Spring Fireplace Maintenance Checklist Alberta | Phoenix",
    seoDescription:
      "A practical spring fireplace checklist for Alberta homes: safe visual checks, common post-winter wear signs, and when chimney or gas service makes sense.",
    keywords: ["spring fireplace maintenance Alberta", "fireplace checklist", "chimney inspection after winter"],
    relatedSlugs: ["when-to-book-a-wett-inspection", "gas-fireplace-not-turning-on"],
    relatedServiceSlugs: ["chimney-sweeping-inspection", "gas-fireplace-maintenance"],
    weatherTags: ["maintenance"],
    coverImage: "/images/photos/hero-fireplace.jpg",
    coverImageAlt: "Living room gas fireplace ready for seasonal inspection",
    publishedAt: "2026-03-20T14:00:00.000Z",
    body: `If you heated regularly through winter, plan a spring fireplace review while issues are still minor. Start with safe visual checks indoors and out. Note anything that changed during the season, then book service if ignition, draft, odor, or masonry concerns are already present.

Alberta winters mix freeze-thaw masonry stress with long idle periods on gas fireplaces. Spring is useful because you can compare how the unit behaved during peak use without waiting for the next cold snap.

## Practical spring checklist

- Check the firebox, glass, and surround for soot staining, moisture marks, or unusual odours.
- Walk the exterior chimney or vent termination for cracked mortar, loose cap pieces, or staining below the crown.
- For gas units, note delayed ignition, weak flame colour, or frequent shutdowns that appeared late in the season.
- For wood-burning systems, recall whether draft felt weaker, smoke lingered, or creosote odour increased.
- Test carbon monoxide and smoke alarms.
- Confirm exterior vents and caps are clear of debris after wind and melt cycles.

## What common signs may indicate

Soot or odour after gas use may point to incomplete combustion, dirty burners, or venting restriction. White or damp staining on masonry may suggest moisture entry that freeze-thaw can worsen. Changed draft in a wood system may reflect creosote buildup or blockages.

This checklist is informational. It is not a substitute for appliance-specific service and does not authorize unsafe DIY work on gas, combustion, or venting components.

See [chimney sweeping and inspection](/services/chimney-sweeping-inspection) and [gas fireplace maintenance](/services/gas-fireplace-maintenance).`,
  }),
  generalArticle({
    id: "seed-general-wett-booking-guide",
    slug: "when-to-book-a-wett-inspection",
    title: "When Should You Book a WETT Inspection?",
    excerpt:
      "WETT inspections are documentation visits. They are commonly requested for insurance and real-estate files, but those requests are not universal.",
    seoTitle: "When to Book a WETT Inspection in Alberta | Phoenix",
    seoDescription:
      "Learn when a WETT inspection is typically requested, how it differs from sweeping or repair, and what a customer-facing report usually covers.",
    keywords: ["WETT inspection Alberta", "when to book WETT", "wood fireplace inspection"],
    relatedSlugs: [
      "did-your-insurer-ask-for-a-wett-inspection",
      "selling-a-home-with-a-wood-burning-fireplace",
      "buying-a-home-with-a-wood-burning-fireplace",
    ],
    relatedServiceSlugs: ["wett-inspections"],
    weatherTags: ["wett"],
    coverImage: "/images/photos/wett-inspection.jpg",
    coverImageAlt: "WETT inspection tools prepared for a wood-burning system review",
    publishedAt: "2026-04-02T14:00:00.000Z",
    body: `A WETT inspection is a reporting visit. It reviews the wood-burning appliance, clearances, venting path, and visible chimney condition, then explains findings in language a homeowner, insurer, or real-estate file can use.

It is not the same as a chimney sweep, and it is not an automatic repair. Sweeping can improve visibility. Repair follows diagnosis. WETT documents the system.

## Common reasons people book

- An insurer asked for documentation before renewing or binding coverage.
- A home is being listed or purchased with a wood-burning fireplace or stove.
- A newly installed or recently changed wood-burning system needs a clear record.
- The homeowner wants a formal review before using the system again.

Do not treat insurer, lender, or real-estate requirements as universal. Ask what the requesting party actually needs.

## What the report should help you understand

You should leave with a clearer picture of what was inspected, what was found, and what options exist next. If defects appear, Phoenix can outline the repair path without treating replacement as the default.

Book a [WETT inspection](/request-service?service=wett-inspections&cta=article&from=/articles/when-to-book-a-wett-inspection) after you choose Calgary, Edmonton, or Red Deer, or start from the [Alberta services hub](/services).`,
  }),
  generalArticle({
    id: "seed-general-insurance-wett",
    slug: "did-your-insurer-ask-for-a-wett-inspection",
    title: "Did Your Home Insurance Company Suddenly Ask for a WETT Inspection? Here's What They're Actually Looking For",
    excerpt:
      "An insurance request for a WETT inspection is a documentation request, not proof that the fireplace is unsafe. Here is what the visit is actually for.",
    seoTitle: "Insurance WETT Inspection Request Explained | Phoenix Alberta",
    seoDescription:
      "If your insurer asked for a WETT inspection, learn what the report documents, what it is not, and how to book without treating every requirement as universal.",
    keywords: ["insurance WETT inspection", "WETT for home insurance Alberta", "wood stove insurance inspection"],
    relatedSlugs: ["when-to-book-a-wett-inspection", "selling-a-home-with-a-wood-burning-fireplace"],
    relatedServiceSlugs: ["wett-inspections"],
    weatherTags: ["wett"],
    coverImage: "/images/photos/wett-report.jpg",
    coverImageAlt: "Inspection documentation prepared for a wood-burning fireplace review",
    publishedAt: "2026-08-24T15:00:00.000Z",
    body: `If an insurer asked for a WETT inspection, they usually want a current picture of the wood-burning system: the appliance, clearances, venting, and visible chimney condition. They are not asking Phoenix to guess whether the fireplace “passes” over the phone.

## What the insurer is typically trying to understand

- Whether the system is a wood-burning appliance that needs documented review.
- Whether obvious installation, clearance, or chimney concerns are visible.
- Whether the homeowner has a report they can share instead of informal photos.

Requirements vary. One insurer’s request is not a provincial rule. Ask the insurer what document they need and any deadline they mentioned.

## What a WETT visit is not

It is not a chimney sweep. It is not a repair visit. If the flue is heavily soiled, sweeping may be needed first so the system can be observed properly. Phoenix explains that sequence instead of selling a default replacement.

[Request a WETT inspection](/request-service?service=wett-inspections&cta=article&from=/articles/did-your-insurer-ask-for-a-wett-inspection) and mention the insurance deadline when you book.`,
  }),
  generalArticle({
    id: "seed-general-seller-wett",
    slug: "selling-a-home-with-a-wood-burning-fireplace",
    title: "Selling a Home With a Wood-Burning Fireplace? You May Need a WETT Inspection",
    excerpt:
      "Sellers usually need a WETT report because buyers, insurers, or listing conditions asked for documentation — not because every sale legally requires one.",
    seoTitle: "Selling a Home With a Wood Fireplace: WETT Inspection Guide | Phoenix",
    seoDescription:
      "A seller-focused guide to WETT inspections: what the report is for, how it differs from repair, and how to time the visit around a listing or closing.",
    keywords: ["WETT inspection home sale", "selling house wood fireplace Alberta", "WETT for sellers"],
    relatedSlugs: ["buying-a-home-with-a-wood-burning-fireplace", "when-to-book-a-wett-inspection"],
    relatedServiceSlugs: ["wett-inspections"],
    weatherTags: ["wett"],
    coverImage: "/images/photos/about-crew.jpg",
    coverImageAlt: "Technician speaking with a homeowner before an inspection visit",
    publishedAt: "2026-08-24T15:10:00.000Z",
    body: `If you are selling a home with a wood-burning fireplace or stove, a WETT inspection is often requested so the listing file, buyer, or insurer can see the system’s condition in writing.

That request is common. It is not automatically required in every transaction. Confirm what your realtor, buyer, or insurer actually asked for.

## What sellers usually need from the visit

- A customer-facing report, not an internal technician note.
- Clear findings: what was inspected, what was found, and what options exist.
- Timing that fits a listing or closing deadline.

If the chimney is too dirty to observe, sweeping may come first. That is diagnosis, not a sales tactic.

Same facts as a buyer-focused article; the priority here is disclosure and file timing. [Book WETT](/request-service?service=wett-inspections&cta=article&from=/articles/selling-a-home-with-a-wood-burning-fireplace) and mention the closing date.`,
  }),
  generalArticle({
    id: "seed-general-buyer-wett",
    slug: "buying-a-home-with-a-wood-burning-fireplace",
    title: "Buying a Home With a Wood-Burning Fireplace? Here's Why a WETT Inspection Matters",
    excerpt:
      "Buyers use a WETT inspection to understand the wood-burning system before they rely on it — and before they assume the listing photos tell the whole story.",
    seoTitle: "Buying a Home With a Wood Fireplace: WETT Inspection | Phoenix",
    seoDescription:
      "A buyer-focused WETT inspection guide: what to learn about the appliance, venting, and chimney before you use a wood-burning fireplace in a new home.",
    keywords: ["WETT inspection home purchase", "buying house wood fireplace Alberta", "WETT for buyers"],
    relatedSlugs: ["selling-a-home-with-a-wood-burning-fireplace", "when-to-book-a-wett-inspection"],
    relatedServiceSlugs: ["wett-inspections"],
    weatherTags: ["wett"],
    coverImage: "/images/photos/wett-inspection.jpg",
    coverImageAlt: "Wood-burning fireplace and chimney system being reviewed",
    publishedAt: "2026-08-24T15:20:00.000Z",
    body: `If you are buying a home with a wood-burning fireplace, a WETT inspection helps you understand the system you are inheriting: appliance type, clearances, venting path, and visible chimney condition.

Sellers and buyers look at the same facts. The buyer’s question is different: is this system something you can use, and what work might follow?

## What buyers should want explained

- Whether the appliance and chimney can be observed well enough to report on.
- What findings, if any, affect safe use.
- Which next steps are maintenance, repair, or further evaluation.

Do not treat a WETT report as a renovation quote. It is documentation. Repair options come after diagnosis.

Mention your possession date when you [request service](/request-service?service=wett-inspections&cta=article&from=/articles/buying-a-home-with-a-wood-burning-fireplace).`,
  }),
  generalArticle({
    id: "seed-general-gas-not-turning-on",
    slug: "gas-fireplace-not-turning-on",
    title: "Gas Fireplace Not Turning On? Safe Checks to Start With",
    excerpt:
      "Some ignition problems have simple homeowner checks. Gas, venting, and combustion work still belong to a technician.",
    seoTitle: "Gas Fireplace Not Turning On | Safe Checks | Phoenix Alberta",
    seoDescription:
      "Safe homeowner checks when a gas fireplace will not ignite, plus when a $99 diagnostic visit is the right next step instead of guessing parts over the phone.",
    keywords: ["gas fireplace not turning on", "gas fireplace ignition Alberta", "fireplace will not ignite"],
    relatedSlugs: ["turning-on-your-gas-fireplace-before-winter", "gas-fireplace-blower-not-working"],
    relatedServiceSlugs: ["gas-fireplace-repair"],
    weatherTags: ["gas-startup", "cold-weather"],
    coverImage: "/images/photos/service-gasfireplace.jpg",
    coverImageAlt: "Gas fireplace firebox opened during diagnostic service",
    publishedAt: "2026-04-10T14:00:00.000Z",
    body: `When a gas fireplace will not ignite, start with checks that do not involve opening gas components or bypassing safety devices.

## Safe checks

- Confirm the unit has power if it is millivolt or electronic ignition with a switch or remote.
- Check that the gas shutoff serving the fireplace is open.
- Replace remote or thermostat batteries if the control is wireless.
- Look at the glass and firebox for obvious soot or debris — do not disassemble the burner.

If the unit still will not light, clicks without firing, or shuts down immediately, stop. Those symptoms need diagnosis.

Phoenix does not price complex repairs by guessing over the phone. When the problem is unknown, a $99 diagnostic/inspection visit comes first: assessment, findings, options, then an accurate quote.

[Book gas fireplace repair](/request-service?service=gas-fireplace-repair&cta=article&from=/articles/gas-fireplace-not-turning-on) after choosing your city.`,
  }),
  generalArticle({
    id: "seed-general-gas-before-winter",
    slug: "turning-on-your-gas-fireplace-before-winter",
    title: "Turning On Your Gas Fireplace Before Winter? Here's What You Can Check Yourself — and When to Call a Technician",
    excerpt:
      "First-use-of-season startup is a common time for ignition complaints. Here is what you can check safely, and when maintenance or repair is the better path.",
    seoTitle: "Gas Fireplace Startup Before Winter | Phoenix Alberta",
    seoDescription:
      "Safe seasonal startup checks for gas fireplaces, plus when to book maintenance versus repair diagnostics before heating season.",
    keywords: ["gas fireplace winter startup", "first time using gas fireplace", "gas fireplace maintenance Alberta"],
    relatedSlugs: ["gas-fireplace-not-turning-on", "spring-fireplace-maintenance-checklist"],
    relatedServiceSlugs: ["gas-fireplace-maintenance", "gas-fireplace-repair"],
    weatherTags: ["gas-startup", "pre-winter"],
    coverImage: "/images/photos/gallery-02.jpeg",
    coverImageAlt: "Gas fireplace with open glass doors and burning logs",
    publishedAt: "2026-08-24T15:30:00.000Z",
    body: `The first cold stretch is when many Alberta gas fireplaces are asked to work after months idle. Dust, pet hair, and a weak pilot show up then.

## What you can check yourself

- Confirm the control, switch, or remote has power.
- Confirm the fireplace gas shutoff is open.
- Look for blocked vents or obvious debris at the termination — do not climb unsafely.
- Note whether the problem is delayed ignition, no ignition, or shutdown after lighting.

## When to call

If the fireplace still runs but is overdue for cleaning, book [maintenance](/services/gas-fireplace-maintenance). If it will not ignite or keep running, book [repair diagnostics](/request-service?service=gas-fireplace-repair&cta=article&from=/articles/turning-on-your-gas-fireplace-before-winter). Unknown problems start with a $99 diagnostic visit, not a guessed part.

Do not remove safety devices, drill orifices, or work on gas valves.`,
  }),
  generalArticle({
    id: "seed-general-blower",
    slug: "gas-fireplace-blower-not-working",
    title: "Is Your Gas Fireplace Blower Not Working? Here's What It Actually Does and What Can Go Wrong",
    excerpt:
      "A blower moves room air across the fireplace. It is not the burner. Knowing the difference keeps a comfort complaint from being treated as an ignition emergency.",
    seoTitle: "Gas Fireplace Blower Not Working | Phoenix Alberta",
    seoDescription:
      "What a gas fireplace blower does, why it may stop, and when the issue is a blower versus a fireplace that will not heat or ignite.",
    keywords: ["gas fireplace blower not working", "fireplace fan not working", "gas fireplace blower repair"],
    relatedSlugs: ["gas-fireplace-not-turning-on", "turning-on-your-gas-fireplace-before-winter"],
    relatedServiceSlugs: ["gas-fireplace-repair"],
    coverImage: "/images/photos/service-gasfireplace.jpg",
    coverImageAlt: "Gas fireplace with circulating blower components",
    publishedAt: "2026-08-24T15:40:00.000Z",
    body: `A gas fireplace blower circulates room air across the heat exchanger so the living space warms faster. If the flame is present but the room stays cool, the blower may be the issue. If there is no flame, that is an ignition or fuel problem, not a fan problem.

## What commonly goes wrong

- The blower has a separate switch, rheostat, or temperature sensor.
- Dust and pet hair bind the motor after a summer idle.
- A thermal snap-switch never closes if the firebox is not getting hot.
- Wiring or a control module failed.

Do not reach into the blower compartment while the unit is powered. If the fireplace itself will not light, follow the [ignition guide](/articles/gas-fireplace-not-turning-on) instead.

[Request service](/request-service?service=gas-fireplace-repair&cta=article&from=/articles/gas-fireplace-blower-not-working) and describe whether you have flame without airflow, or no flame at all.`,
  }),
  generalArticle({
    id: "seed-general-chimney-not-swept",
    slug: "chimney-not-swept-in-years",
    title: "Haven't Had Your Chimney Swept in Years? Here's What to Check Before Using Your Fireplace Again",
    excerpt:
      "A sweep is not just passing a brush through a flue. If buildup blocks observation, cleaning comes first so the system can be inspected and explained.",
    seoTitle: "Chimney Not Swept in Years | What to Do Next | Phoenix",
    seoDescription:
      "What to do if a wood-burning chimney has not been swept in years: visibility, inspection, and when WETT or masonry repair is a separate visit.",
    keywords: ["chimney not swept", "chimney sweep after years", "creosote buildup Alberta"],
    relatedSlugs: ["when-to-book-a-wett-inspection", "spring-fireplace-maintenance-checklist"],
    relatedServiceSlugs: ["chimney-sweeping-inspection"],
    weatherTags: ["maintenance"],
    coverImage: "/images/photos/service-sweep.jpeg",
    coverImageAlt: "Chimney sweeping and inspection equipment",
    publishedAt: "2026-08-24T15:50:00.000Z",
    body: `If a wood-burning chimney has not been swept in years, do not assume a quick brush pass is the whole job. Buildup can hide liner damage, blockages, and moisture paths. Phoenix treats sweeping as the step that restores visibility so inspection can mean something.

## The sequence

1. Sweep to improve visibility.
2. Inspect accessible flue, cap, crown, flashing, and draft conditions.
3. Explain findings.
4. Recommend the appropriate next step: routine care, repair, or a separate WETT report if documentation is required.

Final sweep pricing depends on the system, condition, level of buildup, and chimney height/accessibility.

A sweep is not a WETT inspection. If an insurer or sale file needs a report, that is a [WETT visit](/articles/when-to-book-a-wett-inspection).

[Book chimney sweeping and inspection](/services/chimney-sweeping-inspection).`,
  }),
];

export function isKnownSeedId(id: string) {
  return SEED_ARTICLES.some((article) => article.id === id);
}

export function getSeedArticleById(id: string) {
  return SEED_ARTICLES.find((article) => article.id === id);
}
