import type { CitySlug } from "@/lib/cities";
import type { Article } from "@/lib/cms/types";

const AUTHOR = "Phoenix Editorial Team";
const CREATED_AT = "2026-04-15T00:00:00.000Z";

const SEED_IDS = [
  "seed-calgary-spring-fireplace-checklist",
  "seed-edmonton-spring-fireplace-checklist",
  "seed-red-deer-spring-fireplace-checklist",
  "seed-calgary-wett-booking-guide",
  "seed-edmonton-wett-booking-guide",
  "seed-red-deer-wett-booking-guide",
  "seed-calgary-gas-fireplace-troubleshooting",
  "seed-edmonton-gas-fireplace-troubleshooting",
  "seed-red-deer-gas-fireplace-troubleshooting",
] as const;

export function isKnownSeedId(id: string) {
  return SEED_IDS.includes(id as (typeof SEED_IDS)[number]);
}

export function getSeedArticleById(id: string) {
  return SEED_ARTICLES.find((article) => article.id === id);
}

function articleLinks(city: CitySlug, slugs: { seasonal: string; wett: string; gas: string }) {
  return {
    seasonal: `/${city}/articles/${slugs.seasonal}`,
    wett: `/${city}/articles/${slugs.wett}`,
    gas: `/${city}/articles/${slugs.gas}`,
    wettService: `/${city}/wett`,
    gasRepair: `/${city}/gas-fireplace-repair`,
    gasMaintenance: `/${city}/services/gas-fireplace-maintenance`,
    chimneyInspection: `/${city}/services/chimney-sweeping-inspection`,
    chimneyRepair: `/${city}/services/chimney-repair-masonry`,
    gasInstallation: `/${city}/services/gas-fireplace-installation`,
  };
}

export const SEED_ARTICLES: Article[] = [
  {
    id: "seed-calgary-spring-fireplace-checklist",
    city: "calgary",
    slug: "spring-fireplace-maintenance-checklist-calgary",
    title: "What Should Calgary Homeowners Check on Their Fireplace This Spring?",
    excerpt:
      "After Calgary’s long heating season, spring is the practical window to inspect soot, draft, gas performance, and exterior masonry before fall bookings tighten.",
    seoTitle: "Spring Fireplace Maintenance Checklist Calgary | Post-Winter Inspection Guide",
    seoDescription:
      "A Calgary-focused spring fireplace checklist covering safe visual checks, common post-winter wear signs, and when professional chimney or gas service makes sense.",
    keywords: [
      "spring fireplace maintenance Calgary",
      "fireplace checklist Calgary",
      "chimney inspection after winter Calgary",
    ],
    relatedSlugs: [
      "when-to-book-a-wett-inspection-in-calgary",
      "gas-fireplace-not-turning-on-calgary",
    ],
    relatedServiceSlugs: ["chimney-sweeping-inspection", "gas-fireplace-maintenance"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/hero-fireplace.jpg",
    coverImageAlt: "Finished living room with a gas fireplace ready for seasonal inspection",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-03-20T14:00:00.000Z",
    aiGenerated: false,
    body: `If you heated regularly through winter, plan a spring fireplace review while issues are still minor and appointment windows are wider. Start with safe visual checks indoors and out, note anything that changed during the season, and book service if ignition, draft, odor, or masonry concerns are already present.

Calgary homes often mix newer gas inserts in suburban builds with older masonry systems in established neighbourhoods. Spring is useful because you can compare how the unit behaved during peak use without waiting for the next cold snap to confirm a problem.

## Practical spring checklist for Calgary homes

- Check the firebox, glass, and surround for soot staining, moisture marks, or unusual odours.
- Walk the exterior chimney or vent termination for cracked mortar, loose cap pieces, or staining below the crown.
- For gas units, note delayed ignition, weak flame colour, or frequent shutdowns that appeared late in the season.
- For wood-burning systems, recall whether draft felt weaker, smoke lingered, or creosote odour increased.
- Test carbon monoxide and smoke alarms and replace batteries if needed.
- Confirm exterior vents, caps, and terminations are clear of debris after wind and melt cycles.

## What common signs may indicate

- **Soot or odour after gas use** may point to incomplete combustion, dirty burners, or venting restriction worth professional review.
- **White or damp staining on masonry** may suggest moisture entry that can accelerate freeze-thaw damage before next winter.
- **Delayed gas ignition** often traces to pilot or ignition components that worsened with heavy use rather than a single cold-start glitch.
- **Changed draft in a wood system** may reflect creosote buildup, blockages, or structural wear that is easier to schedule in spring.

## When professional service becomes relevant

Book chimney sweeping or inspection if a wood-burning system had heavy use, visible creosote, or draft changes you cannot explain. For gas fireplaces, choose maintenance when ignition is inconsistent, the flame pattern changed, or the unit has not been professionally cleaned on a reasonable interval.

This checklist is informational. It helps you decide what to monitor and when to escalate — it is not a substitute for appliance-specific service. See our [chimney sweeping and inspection guide](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).chimneyInspection}) for inspection visits, or the [gas fireplace maintenance guide](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).gasMaintenance}) if performance slipped during winter.

## Related reading

- [When to book a WETT inspection in Calgary](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).wett})
- [Gas fireplace not turning on in Calgary? Safe checks to start with](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).gas})
`,
  },
  {
    id: "seed-edmonton-spring-fireplace-checklist",
    city: "edmonton",
    slug: "spring-fireplace-maintenance-checklist-edmonton",
    title: "What Should Edmonton Homeowners Check on Their Fireplace This Spring?",
    excerpt:
      "Edmonton’s extended heating season makes spring the best time to inspect wear, venting, and gas performance before homeowners shift focus to summer projects.",
    seoTitle: "Spring Fireplace Maintenance Checklist Edmonton | After a Long Heating Season",
    seoDescription:
      "An Edmonton spring fireplace checklist with practical post-winter checks, what common warning signs may mean, and when to schedule chimney or gas service.",
    keywords: [
      "spring fireplace maintenance Edmonton",
      "fireplace checklist Edmonton",
      "chimney inspection Edmonton spring",
    ],
    relatedSlugs: [
      "when-to-book-a-wett-inspection-in-edmonton",
      "gas-fireplace-not-turning-on-edmonton",
    ],
    relatedServiceSlugs: ["chimney-sweeping-inspection", "gas-fireplace-maintenance"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/hero-fireplace.jpg",
    coverImageAlt: "Living room fireplace area prepared for a seasonal maintenance review",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-03-20T14:00:00.000Z",
    aiGenerated: false,
    body: `Spring is when Edmonton homeowners can finally step back and assess how the fireplace performed across a long, continuous heating period. The goal is simple: catch soot, venting, ignition, and masonry issues early while service schedules are still flexible.

Because furnaces and fireplaces often run heavily into late cold spells, wear can accumulate quietly. A short spring review helps you separate normal seasonal fatigue from problems that should go to a technician before fall demand returns.

## Edmonton spring fireplace checklist

- Review indoor surfaces around the appliance for soot, moisture, or persistent odours.
- Inspect exterior brick, crown, cap, and flashing for cracks, gaps, or staining after winter moisture cycles.
- For gas fireplaces, record any startup delay, flame instability, or shutdowns that increased near the end of heating season.
- For wood-burning units, note draft changes, smoke spillage, or difficulty maintaining a stable burn.
- Check that exterior vent terminals and chimney caps are intact after ice, wind, and spring melt.
- Replace smoke and carbon monoxide alarm batteries if they were not changed recently.

## What each sign may indicate

- **More frequent gas shutdowns** can reflect dirty burners, airflow issues, or failing ignition parts stressed by extended runtime.
- **Exterior mortar gaps** may allow water entry that becomes costly if left through summer rains and the next freeze cycle.
- **Persistent smoky odour in a wood system** may signal creosote accumulation or a venting restriction that inspection should clarify.
- **Glass darkening faster than usual** on gas units often means cleaning and maintenance are overdue rather than a one-time use issue.

## When to schedule professional help

Arrange chimney sweeping or inspection if a wood-burning fireplace had heavy use or draft behaviour changed. Choose gas fireplace maintenance when ignition is unreliable, flame quality shifted, or the appliance skipped annual service.

Use this article to plan observations and timing. For service visits, see the [chimney sweeping and inspection guide](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).chimneyInspection}) or [gas fireplace maintenance guide](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).gasMaintenance}).

## Related reading

- [When to book a WETT inspection in Edmonton](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).wett})
- [Gas fireplace not turning on in Edmonton? Start with safe checks](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).gas})
`,
  },
  {
    id: "seed-red-deer-spring-fireplace-checklist",
    city: "red-deer",
    slug: "spring-fireplace-maintenance-checklist-red-deer",
    title: "What Should Red Deer Homeowners Check on Their Fireplace This Spring?",
    excerpt:
      "For Red Deer homes — including many with longer vent runs or rural access considerations — spring is the right time for a calm post-winter fireplace review.",
    seoTitle: "Spring Fireplace Maintenance Checklist Red Deer | Post-Winter Home Review",
    seoDescription:
      "A Red Deer spring fireplace checklist covering safe homeowner checks, what warning signs may mean, and when chimney or gas service is appropriate.",
    keywords: [
      "spring fireplace maintenance Red Deer",
      "fireplace checklist Red Deer",
      "chimney inspection Red Deer",
    ],
    relatedSlugs: [
      "when-to-book-a-wett-inspection-in-red-deer",
      "gas-fireplace-not-turning-on-red-deer",
    ],
    relatedServiceSlugs: ["chimney-sweeping-inspection", "gas-fireplace-maintenance"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/hero-fireplace.jpg",
    coverImageAlt: "Residential fireplace and mantel ready for spring maintenance planning",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-03-20T14:00:00.000Z",
    aiGenerated: false,
    body: `After winter use, Red Deer homeowners benefit from a structured spring review even when the fireplace seemed fine day to day. The point is to catch venting, cleanliness, and exterior wear before small issues carry into the next heating season.

Homes in and around Red Deer often balance town-house convenience with rural or acreage properties where exterior access and vent terminations deserve extra attention once snow clears.

## Spring checklist tailored to Red Deer properties

- Inspect the appliance surround, glass, and hearth for soot, moisture, or odours that persisted after use ended.
- Check chimney exteriors, caps, and vent terminations for damage, leaning components, or animal debris after melt.
- For gas units, note whether startup took longer or flames looked uneven toward the end of winter.
- For wood-burning systems, recall whether kindling lit easily and smoke cleared as expected.
- Confirm area around exterior vents is clear for safe airflow before summer projects begin.
- Test alarms and replace batteries on smoke and carbon monoxide detectors.

## What signs may mean in practice

- **Exterior cap damage** can admit moisture or block draft paths; it is worth fixing before summer storms.
- **Hard starts on gas units** after a long season often indicate maintenance needs rather than a temporary glitch.
- **Uneven soot patterns** may suggest airflow or venting issues that inspection can clarify.
- **Musty or sharp odours** when the system is idle can mean debris, moisture, or creosote issues inside the vent path.

## When to involve a technician

Schedule inspection or sweeping when wood-burning use was heavy or draft behaviour changed. Book gas maintenance when ignition is inconsistent, shutdowns increased, or the unit missed regular cleaning intervals.

This page is planning guidance, not a repair procedure. For visits, see [chimney sweeping and inspection](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).chimneyInspection}) or [gas fireplace maintenance](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).gasMaintenance}).

## Related reading

- [When to book a WETT inspection in Red Deer](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).wett})
- [Gas fireplace not turning on in Red Deer? Safe first checks](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).gas})
`,
  },
  {
    id: "seed-calgary-wett-booking-guide",
    city: "calgary",
    slug: "when-to-book-a-wett-inspection-in-calgary",
    title: "When Should Calgary Homeowners Book a WETT Inspection?",
    excerpt:
      "Most Calgary WETT bookings are driven by paperwork needs — insurance, a purchase or sale, or verifying an existing wood-burning setup — not casual curiosity.",
    seoTitle: "When to Book a WETT Inspection in Calgary | Insurance and Real-Estate Timing",
    seoDescription:
      "Learn when Calgary homeowners typically need WETT inspection documentation for insurance, real-estate files, and wood-burning appliance verification.",
    keywords: [
      "WETT inspection Calgary",
      "fireplace inspection for home sale Calgary",
      "insurance fireplace inspection Calgary",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-calgary",
      "gas-fireplace-not-turning-on-calgary",
    ],
    relatedServiceSlugs: ["wett-inspections"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/wett-inspection.jpg",
    coverImageAlt: "Technician reviewing fireplace and venting components during an inspection visit",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-03-29T13:00:00.000Z",
    aiGenerated: false,
    body: `Book a WETT inspection when someone involved in the decision — an insurer, buyer, seller, or broker — needs documented review of a wood-burning appliance and its visible venting setup. The inspection report supports file requirements; it is not the same as booking repair work.

In Calgary, that need often appears during real-estate timelines or when insurance asks for current documentation on a stove, insert, or fireplace system.

## Common Calgary situations that trigger a booking

### Insurance review

Insurers may request inspection documentation when a property includes a wood-burning appliance, especially if records are outdated or the system changed since the last policy review.

### Real-estate transactions

Purchase or sale conditions frequently require a report covering visible condition, clearances, and obvious defects before firm dates or possession.

### After appliance changes

If a stove or insert was added or altered, documentation can clarify whether visible installation details match file expectations. Confirm requirements with your broker or insurer rather than assuming one checklist fits every case.

## How this differs from repair service

A WETT inspection visit documents what is visible and reportable for the file. If the inspection surfaces repair needs, that work is scoped separately. Phoenix can help coordinate inspection timing; certification and report authorship belong to the qualified inspector performing the visit.

For inspection scheduling in Calgary, start on the [WETT inspections page](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).wettService}). If you already expect masonry or venting follow-up, reviewing [chimney sweeping and inspection](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).chimneyInspection}) and [chimney repair options](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).chimneyRepair}) can help you plan next steps.

## Timing tip for Calgary files

If documentation is already on a deadline, book before the condition date rather than assuming same-week availability during busy real-estate periods.

## Related reading

- [Spring fireplace maintenance checklist for Calgary](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).seasonal})
- [Gas fireplace not turning on in Calgary? Safe checks first](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).gas})
`,
  },
  {
    id: "seed-edmonton-wett-booking-guide",
    city: "edmonton",
    slug: "when-to-book-a-wett-inspection-in-edmonton",
    title: "When Should Edmonton Homeowners Book a WETT Inspection?",
    excerpt:
      "Edmonton WETT inspections are usually booked for insurance files, property transfers, or verifying a wood-burning appliance — plan early if a deadline is attached.",
    seoTitle: "When to Book a WETT Inspection in Edmonton | Home Sale and Insurance Guide",
    seoDescription:
      "Understand when Edmonton homeowners commonly need WETT inspection documentation for insurance, purchases, sales, and wood-burning appliance files.",
    keywords: [
      "WETT inspection Edmonton",
      "home sale fireplace inspection Edmonton",
      "wood stove inspection Edmonton",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-edmonton",
      "gas-fireplace-not-turning-on-edmonton",
    ],
    relatedServiceSlugs: ["wett-inspections"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/wett-inspection.jpg",
    coverImageAlt: "Close view of fireplace components being checked during a WETT-related inspection",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-03-29T13:00:00.000Z",
    aiGenerated: false,
    body: `A WETT inspection is the right step when documentation is required for a wood-burning appliance — not when you simply want general fireplace cleaning. Edmonton homeowners most often book when insurance, a purchase agreement, or a sale condition names inspection reporting.

Allow lead time during active real-estate seasons. Inspectors can be booked out when many files share similar condition dates.

## Typical Edmonton booking scenarios

### Insurance documentation

Policies may ask for proof that a wood stove, insert, or fireplace system was reviewed within an acceptable timeframe, especially after upgrades or ownership changes.

### Purchase and sale conditions

Buyers and sellers use inspection reports to satisfy financing, insurance, or contractual conditions tied to solid-fuel appliances.

### Verification after installation work

When an appliance was recently installed or modified, a report may be needed to confirm visible clearances and connections for the property file.

## Inspection versus repair planning

Inspection visits focus on reportable visible conditions. Recommended repairs, if any, are separate decisions. Phoenix can help with scheduling coordination; the inspecting professional produces the WETT report.

Use the [WETT inspections page](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).wettService}) for Edmonton booking. If you anticipate chimney or masonry follow-up, see [chimney sweeping and inspection](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).chimneyInspection}).

## Related reading

- [Spring fireplace checklist for Edmonton](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).seasonal})
- [Gas fireplace not turning on in Edmonton](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).gas})
`,
  },
  {
    id: "seed-red-deer-wett-booking-guide",
    city: "red-deer",
    slug: "when-to-book-a-wett-inspection-in-red-deer",
    title: "When Should Red Deer Homeowners Book a WETT Inspection?",
    excerpt:
      "Red Deer homeowners usually book WETT inspections when a lender, insurer, or sale file requires documented review of a wood-burning appliance.",
    seoTitle: "When to Book a WETT Inspection in Red Deer | Documentation and Timing",
    seoDescription:
      "See when Red Deer homeowners typically need WETT inspection reports for insurance, property transfers, and wood-burning appliance verification.",
    keywords: [
      "WETT inspection Red Deer",
      "fireplace inspection Red Deer",
      "wood stove inspection Red Deer",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-red-deer",
      "gas-fireplace-not-turning-on-red-deer",
    ],
    relatedServiceSlugs: ["wett-inspections"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/wett-inspection.jpg",
    coverImageAlt: "Inspector evaluating a wood-burning fireplace setup and visible venting",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-03-29T13:00:00.000Z",
    aiGenerated: false,
    body: `Book a WETT inspection when your file needs professional documentation of a wood-burning fireplace, insert, or stove — commonly for insurance renewal, a rural property transfer, or a sale condition in the Red Deer area.

Because some properties sit farther from immediate service corridors, earlier booking helps avoid deadline pressure if travel coordination is required.

## When Red Deer homeowners typically need documentation

### Property sale or purchase

Conditions may require a report confirming visible appliance condition, clearances, and obvious defects before removal of subjects.

### Insurance requests

Carriers may ask for inspection reporting when solid-fuel appliances are part of the risk profile or when prior records are missing.

### Post-install verification

After adding or replacing an appliance, owners sometimes need reportable confirmation for their insurer or municipality-facing file. Requirements vary — confirm with the requesting party.

## Keep inspection and repair decisions separate

The inspection produces documentation. Repair or upgrade work, if recommended, is scoped afterward. Phoenix can coordinate inspection visits; report content comes from the qualified inspector.

Schedule through the [WETT inspections page](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).wettService}). For chimney maintenance context, see [chimney sweeping and inspection](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).chimneyInspection}).

## Related reading

- [Spring fireplace checklist for Red Deer](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).seasonal})
- [Gas fireplace not turning on in Red Deer](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).gas})
`,
  },
  {
    id: "seed-calgary-gas-fireplace-troubleshooting",
    city: "calgary",
    slug: "gas-fireplace-not-turning-on-calgary",
    title: "Gas Fireplace Not Turning On in Calgary? Safe Checks to Start With",
    excerpt:
      "If your Calgary gas fireplace will not start, begin with power, gas supply, and remote or wall-switch basics — then stop if odours, repeated clicking, or error codes persist.",
    seoTitle: "Gas Fireplace Not Turning On Calgary | Safe Homeowner Troubleshooting",
    seoDescription:
      "Diagnostic guidance for Calgary homeowners when a gas fireplace will not light, including safe basic checks, common failure categories, and when to book repair.",
    keywords: [
      "gas fireplace not turning on Calgary",
      "gas fireplace troubleshooting Calgary",
      "fireplace ignition problem Calgary",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-calgary",
      "when-to-book-a-wett-inspection-in-calgary",
    ],
    relatedServiceSlugs: ["gas-fireplace-repair", "gas-fireplace-maintenance"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/service-gasfireplace.jpg",
    coverImageAlt: "Technician servicing a gas fireplace ignition and burner assembly",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-04-05T13:00:00.000Z",
    aiGenerated: false,
    body: `When a gas fireplace will not turn on, start with the safe, simple checks: confirm the unit has power, the wall switch or remote has fresh batteries, and the gas supply valve is in the expected on position if you know how to verify it safely. If the appliance smells abnormal, clicks repeatedly without lighting, or throws an error code you cannot clear, stop and book service.

This article explains likely categories of failure so you can decide whether basic checks are enough — it is not a repair guide and it is not a substitute for qualified gas appliance service.

## Safe checks Calgary homeowners can try

- Confirm the fireplace circuit breaker is on and any power switch feeding the unit is enabled.
- Replace remote batteries and test the wall switch if the unit uses one.
- Look for obvious obstructions around the intake or glass that could affect airflow messages on some models.
- Review the owner manual for a simple reset sequence if one is provided for your model.
- Note error codes or blinking patterns to share with a technician later.

Do not disassemble gas valves, bypass safety sensors, or open components beyond what the manufacturer describes for homeowners.

## Common failure categories

- **Power or control issues** — tripped breakers, failed switches, or remote signal problems.
- **Ignition and pilot problems** — worn ignitors, dirty pilot assemblies, or delayed ignition after heavy seasonal use.
- **Gas supply or valve settings** — interruptions or valves not in the expected operating position.
- **Safety shutdowns** — airflow, overheat, or flame-proving faults that require diagnostic tools to interpret.

## When to stop troubleshooting

Stop and schedule professional service if you smell gas, hear repeated ignition attempts without flame, see soot or smoke, or the unit shuts down immediately after lighting. Those patterns usually need on-site diagnosis rather than further homeowner testing.

## Where repair and maintenance fit

Use this page to understand the issue and perform safe basics. When repair is appropriate, see [gas fireplace repair in Calgary](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).gasRepair}). For preventive cleaning and performance checks, see [gas fireplace maintenance](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).gasMaintenance}).

## Related reading

- [Spring fireplace maintenance checklist for Calgary](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).seasonal})
- [When to book a WETT inspection in Calgary](${articleLinks("calgary", { seasonal: "spring-fireplace-maintenance-checklist-calgary", wett: "when-to-book-a-wett-inspection-in-calgary", gas: "gas-fireplace-not-turning-on-calgary" }).wett})
`,
  },
  {
    id: "seed-edmonton-gas-fireplace-troubleshooting",
    city: "edmonton",
    slug: "gas-fireplace-not-turning-on-edmonton",
    title: "Gas Fireplace Not Turning On in Edmonton? What to Check Safely",
    excerpt:
      "When an Edmonton gas fireplace fails to start after heavy winter use, check power, controls, and basic gas supply first — then call for service if ignition keeps failing.",
    seoTitle: "Gas Fireplace Not Turning On Edmonton | Diagnostic Homeowner Guide",
    seoDescription:
      "Informational troubleshooting for Edmonton gas fireplaces that will not light, including safe checks, likely failure types, and when repair service is appropriate.",
    keywords: [
      "gas fireplace not turning on Edmonton",
      "gas fireplace repair Edmonton",
      "fireplace won't start Edmonton",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-edmonton",
      "when-to-book-a-wett-inspection-in-edmonton",
    ],
    relatedServiceSlugs: ["gas-fireplace-repair", "gas-fireplace-maintenance"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/service-gasfireplace.jpg",
    coverImageAlt: "Gas fireplace burner area being inspected during a service call",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-04-05T13:00:00.000Z",
    aiGenerated: false,
    body: `If your gas fireplace will not light, begin with safe homeowner checks: verify power to the unit, test the wall switch or remote batteries, and confirm you are following the manufacturer’s normal startup sequence. When ignition fails repeatedly, unusual odours appear, or the unit logs an error state, stop and arrange professional diagnosis.

Extended Edmonton heating seasons can leave ignition components and burners dirty enough that startup problems surface late in winter or on the first spring attempt — that context helps explain timing even before a technician identifies the exact part.

## Safe first checks

- Reset tripped breakers and confirm any dedicated power switch is on.
- Swap remote batteries and test a wall switch if equipped.
- Check that intake paths and glass gaskets are reasonably clean and unobstructed.
- Record error flashes or codes from the control panel for the service visit.
- Avoid opening gas controls or internal panels not meant for homeowner access.

## Likely problem categories

- **Controls and power** — failed switches, loose connections, or remote pairing issues.
- **Ignition assembly wear** — dirty pilots, weak ignitors, or delayed flame proving after long runtime seasons.
- **Airflow or venting-related safeties** — shutdowns triggered when the appliance cannot confirm safe operation.
- **Deferred maintenance** — performance issues that appear as “won’t start” but reflect cleaning or adjustment needs.

## When troubleshooting should end

Treat repeated clicking, gas odour, partial ignition, or immediate shutdown as stop conditions. Those symptoms need trained diagnosis with proper test equipment.

## Service boundaries

This article supports understanding only. For repair intent, use [gas fireplace repair in Edmonton](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).gasRepair}). For preventive service, see [gas fireplace maintenance](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).gasMaintenance}).

## Related reading

- [Spring fireplace checklist for Edmonton](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).seasonal})
- [WETT inspection timing in Edmonton](${articleLinks("edmonton", { seasonal: "spring-fireplace-maintenance-checklist-edmonton", wett: "when-to-book-a-wett-inspection-in-edmonton", gas: "gas-fireplace-not-turning-on-edmonton" }).wett})
`,
  },
  {
    id: "seed-red-deer-gas-fireplace-troubleshooting",
    city: "red-deer",
    slug: "gas-fireplace-not-turning-on-red-deer",
    title: "Gas Fireplace Not Turning On in Red Deer? Start With These Safe Steps",
    excerpt:
      "For Red Deer gas fireplaces that refuse to start, verify power and controls first, note any error indicators, and arrange service if ignition problems repeat.",
    seoTitle: "Gas Fireplace Not Turning On Red Deer | Safe Troubleshooting Guide",
    seoDescription:
      "Red Deer homeowner guide for gas fireplaces that will not turn on, covering basic safe checks, common issue types, and when to choose repair or maintenance service.",
    keywords: [
      "gas fireplace not turning on Red Deer",
      "gas fireplace troubleshooting Red Deer",
      "fireplace repair Red Deer",
    ],
    relatedSlugs: [
      "spring-fireplace-maintenance-checklist-red-deer",
      "when-to-book-a-wett-inspection-in-red-deer",
    ],
    relatedServiceSlugs: ["gas-fireplace-repair", "gas-fireplace-maintenance"],
    status: "published",
    authorName: AUTHOR,
    authorType: "organization",
    coverImage: "/images/photos/service-gasfireplace.jpg",
    coverImageAlt: "Service technician reviewing a gas fireplace that failed to ignite",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    publishedAt: "2026-04-05T13:00:00.000Z",
    aiGenerated: false,
    body: `A gas fireplace that will not start is usually addressed first with simple safety checks: power on, remote or wall switch working, and the normal startup sequence followed exactly as the manual describes. If the unit still will not light after those steps, or if you notice gas odour or endless ignition clicking, stop and book qualified service.

Red Deer properties — including some with longer vent layouts or units that sat idle between intermittent cold spells — may see startup issues appear suddenly even when the fireplace worked fine earlier in the season.

## Homeowner-safe checks

- Confirm electrical supply and any appliance-specific power switch.
- Replace remote batteries and test alternate controls if available.
- Inspect visible intake areas and glass for heavy sooting that can accompany performance problems.
- Write down indicator lights or error codes before calling for service.
- Do not adjust gas valves or disable safety interlocks.

## Common categories behind a no-start condition

- **Control or power faults** affecting startup signals.
- **Ignition or pilot issues** from wear or cleaning backlog.
- **Flame-proving or airflow safeties** shutting the unit down when conditions are out of range.
- **Maintenance-related performance loss** that shows up as failed ignition rather than a visible broken part.

## When to call for service instead of continuing

Odour, repeated unsuccessful ignition, smoke, or immediate shutdown after flame are all clear lines to stop DIY effort and schedule repair.

## Repair versus this diagnostic article

This page helps you sort symptoms and safe checks. Repair booking belongs on the [gas fireplace repair page](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).gasRepair}). Preventive visits fit the [gas fireplace maintenance guide](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).gasMaintenance}).

## Related reading

- [Spring fireplace checklist for Red Deer](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).seasonal})
- [When to book a WETT inspection in Red Deer](${articleLinks("red-deer", { seasonal: "spring-fireplace-maintenance-checklist-red-deer", wett: "when-to-book-a-wett-inspection-in-red-deer", gas: "gas-fireplace-not-turning-on-red-deer" }).wett})
`,
  },
];
