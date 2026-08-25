import { getCityHref, type CitySlug } from "@/lib/cities";
import {
  canonicalServices,
  getServiceHref,
  getServicePath,
} from "@/lib/service-taxonomy";

export const siteConfig = {
  name: "Phoenix Chimney & Fireplace Services",
  shortName: "Phoenix Fireplace",
  legalName: "Phoenix Chimney & Fireplace Services",
  description:
    "Phoenix Chimney & Fireplace Services routes fireplace repair, chimney care, and WETT inspection service across Calgary, Edmonton, and Red Deer.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://phoenixfireplace.ca",
  phoneDisplay: "(825) 823-9556",
  phoneHref: "+18258239556",
  email: "Service@phoenixfireplace.ca",
  serviceRadius: "Serving Calgary and surrounding communities within 100 km.",
  hoursLabel: "Sunday-Friday",
  hoursDetail: "9AM-6PM Calgary time",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Calgary&t=m&z=9&output=embed&iwloc=near",
  serviceAreas: [
    "Altadore",
    "Aspen Woods",
    "Airdrie",
    "Brentwood",
    "Chestermere",
    "Cochrane",
    "Okotoks",
    "Sunnyside",
    "Strathmore",
  ],
  socialPreview: "/images/photos/hero-fireplace.jpg",
} as const;

export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/articles", label: "Articles" },
  { href: "/wett", label: "WETT" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const heroHighlights = [
  "WETT inspection appointments for insurance and real-estate documentation",
  "Gas fireplace repair and diagnostics for common ignition and performance issues",
  "Chimney sweeping, masonry repair, relining, and visual inspections",
] as const;

export const trustMetrics = [
  { value: "Local", label: "Fireplace and chimney service for Calgary homes" },
  { value: "WETT", label: "Inspection reporting for insurance and real-estate files" },
  { value: "100km", label: "Coverage radius around Calgary" },
] as const;

export function getTrustMetrics(cityName: string) {
  return [
    { value: "Local", label: `Fireplace and chimney service for ${cityName} homes` },
    { value: "WETT", label: "Inspection reporting for insurance and real-estate files" },
    { value: "100km", label: `Coverage radius around ${cityName}` },
  ] as const;
}

export const valuePillars = [
  {
    title: "Clear service documentation",
    description:
      "Clear notes and practical recommendations for homeowners, buyers, sellers, and insurance-related requests.",
  },
  {
    title: "Symptom-led diagnostics",
    description:
      "We start with the symptom, review visible conditions, and explain practical repair options instead of guessing.",
  },
  {
    title: "One local team, start to finish",
    description:
      "From a routine sweep to masonry rebuilds, you work with one accountable Calgary crew.",
  },
] as const;

export function getValuePillars(cityName: string) {
  return [
    {
      title: "Clear service documentation",
      description:
        "Clear notes and practical recommendations for homeowners, buyers, sellers, and insurance-related requests.",
    },
    {
      title: "Symptom-led diagnostics",
      description:
        "We start with the symptom, review visible conditions, and explain practical repair options instead of guessing.",
    },
    {
      title: "One local team, start to finish",
      description:
        `From a routine sweep to masonry rebuilds, you work with one accountable ${cityName} crew.`,
    },
  ] as const;
}

export const services = canonicalServices;

export const processSteps = [
  {
    title: "Tell us the symptom",
    description:
      "Share the appliance type, what changed, and whether you need service, inspection, or an insurance-ready report.",
  },
  {
    title: "We confirm the right visit",
    description:
      "We point you toward repair, cleaning, WETT inspection, or masonry work so the appointment matches the real issue.",
  },
  {
    title: "You get clear next steps",
    description:
      "Expect direct findings, practical recommendations, and documentation that is easy to act on.",
  },
] as const;

export const aboutPoints = [
  {
    title: "Careful fireplace and chimney technicians",
    description:
      "Every visit is built around safety, clean workmanship, and realistic advice instead of unnecessary upsells.",
  },
  {
    title: "Scheduling that respects the homeowner",
    description:
      "Clear appointment windows and a request form that stays available after hours.",
  },
  {
    title: "Repair-first mindset",
    description:
      "We focus on the safest effective fix, whether that is a tune-up, targeted repair, or rebuild plan.",
  },
  {
    title: "Work built for Calgary winters",
    description:
      "Freeze-thaw masonry, draft issues, and seasonal startup problems are treated as local realities, not edge cases.",
  },
] as const;

export function getAboutPoints(city: { name: string; weatherContext: string; regulationContext: string }) {
  return [
    {
      title: "Careful fireplace and chimney technicians",
      description:
        "Every visit is built around safety, clean workmanship, and realistic advice instead of unnecessary upsells.",
    },
    {
      title: "Scheduling that respects the homeowner",
      description:
        "Clear appointment windows and a request form that stays available after hours.",
    },
    {
      title: "Repair-first mindset",
      description:
        "We focus on the safest effective fix, whether that is a tune-up, targeted repair, or rebuild plan.",
    },
    {
      title: `Work built for ${city.name}`,
      description: `${city.weatherContext} ${city.regulationContext}`,
    },
  ] as const;
}

export const galleryImages = [
  {
    src: "/images/photos/gallery-01.jpg",
    alt: "Basement appliance vent, copper supply line, and shut-off valve during an inspection.",
  },
  {
    src: "/images/photos/gallery-02.jpeg",
    alt: "Gas fireplace with open glass doors, mesh screen, and burning logs in a brick surround.",
  },
  {
    src: "/images/photos/gallery-03.jpeg",
    alt: "Brick chimney on a shingled roof with a metal chase cover and round cap.",
  },
  {
    src: "/images/photos/gallery-04.jpeg",
    alt: "Brick chimney crown, terracotta flue, and chimney cap during a roof-level service visit.",
  },
] as const;

export const wettBenefits = [
  {
    title: "Insurance and real-estate documentation support",
    description:
      "Reports are written to help buyers, sellers, insurers, and homeowners understand system condition fast.",
  },
  {
    title: "Visual inspection support",
    description:
      "Hidden defects, blockages, and compromised flues are easier to document when the full system is reviewed visually.",
  },
  {
    title: "Actionable findings",
    description:
      "You get plain-language recommendations on what passes, what needs correction, and what should be repaired before use.",
  },
  {
    title: "Report timing clarity",
    description:
      "Time-sensitive files for listings, closings, or insurance reviews can be discussed at booking so timing is clear before the visit.",
  },
] as const;

export const homeFaqs = [
  {
    question: "Do I need a WETT inspection for a home sale in Calgary?",
    answer:
      "Often yes. Buyers, insurers, and real-estate agents commonly request a WETT inspection for wood-burning appliances and connected chimney systems.",
  },
  {
    question: "Can you repair a gas fireplace that will not ignite?",
    answer:
      "Yes. Ignition failure, pilot issues, dirty burners, and worn components are part of our standard gas fireplace repair work.",
  },
  {
    question: "How far outside Calgary do you travel?",
    answer:
      "We serve Calgary and surrounding communities within roughly a 100-kilometre radius, including nearby towns such as Airdrie, Cochrane, Chestermere, Okotoks, and Strathmore.",
  },
  {
    question: "What is the fastest way to schedule service?",
    answer:
      "Use Request Service for 24/7 intake, or call the office if you need help choosing the right service type.",
  },
] as const;

export function getHomeFaqs(cityName: string, serviceAreas: readonly string[], weatherContext?: string) {
  const nearbyAreas = serviceAreas.slice(0, 5).join(", ");

  return [
    {
      question: `Do I need a WETT inspection for a home sale in ${cityName}?`,
      answer:
        `Not automatically. Buyers, insurers, or listing conditions in ${cityName} commonly request a WETT inspection for wood-burning appliances, but that request is not a universal rule. Ask what document the other party actually needs.`,
    },
    {
      question: "Can you repair a gas fireplace that will not ignite?",
      answer:
        "Yes. Ignition failure, pilot issues, dirty burners, and worn components are part of our standard gas fireplace repair work. Unknown problems start with a diagnostic visit, not a guessed part over the phone.",
    },
    {
      question: `How far outside ${cityName} do you travel?`,
      answer:
        `We serve ${cityName} and surrounding communities within roughly a 100-kilometre radius, including nearby areas such as ${nearbyAreas}. Those towns are coverage, not separate website pages.`,
    },
    {
      question: `How does ${cityName} weather affect fireplace and chimney work?`,
      answer:
        weatherContext ||
        `${cityName} seasonal weather affects ignition, masonry, and when homeowners usually book service.`,
    },
    {
      question: "What is the fastest way to schedule service?",
      answer:
        "Use Request Service for 24/7 intake, or call the office if you need help choosing the right service type.",
    },
  ] as const;
}

export const contactServiceOptions = services.map((service) => service.title);

export function getServicesFaqs(cityName: string) {
  return [
    {
      question: `Do you handle gas fireplace repair in ${cityName}?`,
      answer:
        `Yes. Phoenix handles gas fireplace repair in ${cityName}, including pilot issues, ignition failures, weak flame performance, dirty components, and overdue maintenance concerns.`,
    },
    {
      question: `Can I book both gas fireplace repair and a WETT inspection in ${cityName}?`,
      answer:
        `Yes. If a property in ${cityName} needs both troubleshooting and formal documentation, Phoenix can guide you into the right service flow instead of sending you to separate contractors first.`,
    },
    {
      question: `What are the common signs I need fireplace repair in ${cityName}?`,
      answer:
        `Common warning signs include a fireplace that will not ignite, delayed startup, soot, unusual odors, poor draft, visible chimney wear, or a system that has gone too long without service.`,
    },
    {
      question: `Do you travel outside ${cityName} for chimney and fireplace service?`,
      answer:
        `Yes. Phoenix serves ${cityName} plus nearby communities within roughly 100 kilometres, subject to scheduling and service type.`,
    },
  ] as const;
}

export function getWettFaqs(cityName: string) {
  return [
    {
      question: `When do I need a WETT inspection in ${cityName}?`,
      answer:
        `The most common triggers are home sales, insurance reviews, newly installed wood-burning appliances, and any situation where a homeowner needs formal documentation. Those requests are common in ${cityName}; they are not a universal requirement. Ask what the requesting party actually needs.`,
    },
    {
      question: `Is a WETT inspection in ${cityName} the same as a repair visit?`,
      answer:
        `No. A WETT inspection is a reporting and system-review service. If defects are found, Phoenix can also outline the repair path so the homeowner understands what needs correction next.`,
    },
    {
      question: `How fast can I book a WETT inspection in ${cityName}?`,
      answer:
        `Timing depends on season, route, and current workload. If the request is tied to an insurance file, real-estate closing, or another deadline, mention that at booking so the right appointment path can be discussed.`,
    },
    {
      question: `What does a WETT inspection in ${cityName} usually review?`,
      answer:
        `The inspection typically reviews the appliance, clearances, venting path, visible chimney condition, installation context, and other code-related or safety-related concerns relevant to the system.`,
    },
  ] as const;
}

export type ServiceLandingFaq = {
  question: string;
  answer: string;
};

export type ServiceLandingSemanticSection = {
  eyebrow?: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type ServiceLandingPage = {
  slug: string;
  title: string;
  navLabel: string;
  menuDescription: string;
  cardDescription: string;
  metaTitle: string;
  metaDescription: string;
  cityMetaTitle: (cityName: string) => string;
  cityMetaDescription: (cityName: string) => string;
  cityKeywords: (cityName: string) => readonly string[];
  keywords: readonly string[];
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  cityHeroTitle: (cityName: string) => string;
  directAnswer: {
    province: readonly string[];
    city: (cityName: string) => readonly string[];
  };
  image: string;
  imageAlt: string;
  secondaryImage: string;
  secondaryImageAlt: string;
  included: readonly string[];
  scopeSection: {
    eyebrow: string;
    title: string;
    description?: string;
  };
  supportingSection: {
    eyebrow: string;
    title: string;
    description?: string;
  };
  supportingPoints: ReadonlyArray<{
    title: string;
    description: string;
  }>;
  semanticSections: readonly ServiceLandingSemanticSection[];
  faqs: readonly ServiceLandingFaq[];
  relatedServices: readonly string[];
  contextualLinks?: readonly {
    title: string;
    description: string;
    path: string;
  }[];
  cityHighlights: Record<CitySlug, string>;
  cityCoverage?: {
    title: (cityName: string) => string;
  };
  provinceCoverage: {
    eyebrow: string;
    title: string;
    description: string;
  };
  finalCta: {
    provinceTitle: string;
    cityTitle: (cityName: string) => string;
    description: string;
  };
  ctaLabel: string;
};

export function getCityServiceMetadata(servicePage: ServiceLandingPage, cityName: string) {
  return {
    title: servicePage.cityMetaTitle(cityName),
    description: servicePage.cityMetaDescription(cityName),
  };
}

export const serviceLandingPages: readonly ServiceLandingPage[] = [
  {
    slug: "gas-fireplace-maintenance",
    title: "Gas Fireplace Maintenance",
    navLabel: "Gas Fireplace Maintenance",
    menuDescription: "Annual safety checks, cleaning, and pilot light troubleshooting.",
    cardDescription:
      "Annual gas fireplace safety checks, cleaning, and pilot service for Alberta homes.",
    metaTitle: "Gas Fireplace Maintenance in Alberta | Phoenix",
    metaDescription:
      "Alberta resource for annual gas fireplace safety checks, cleaning, and tune-ups. Choose Calgary, Edmonton, or Red Deer for local booking.",
    cityMetaTitle: (cityName) => `Gas Fireplace Maintenance in ${cityName} | Phoenix Chimney`,
    cityMetaDescription: (cityName) =>
      `Book annual gas fireplace maintenance in ${cityName} for safety checks, cleaning, pilot service, and preventive tune-ups before heating season.`,
    cityKeywords: (cityName) =>
      [
        `gas fireplace maintenance ${cityName}`,
        `annual fireplace service ${cityName}`,
        `gas fireplace cleaning ${cityName}`,
        `pilot light service ${cityName}`,
      ] as const,
    keywords: [
      "gas fireplace maintenance Alberta",
      "annual fireplace service Alberta",
      "gas fireplace cleaning Alberta",
      "pilot light service Alberta",
    ],
    eyebrow: "Annual fireplace safety service",
    heroTitle:
      "Gas fireplace maintenance that keeps Alberta homes safer before heating season stress shows up.",
    heroDescription:
      "Phoenix handles annual safety checks, burner cleaning, pilot light issues, and combustion tuning for Alberta homes. Choose Calgary, Edmonton, or Red Deer to book the local visit.",
    cityHeroTitle: (cityName) => `Gas fireplace maintenance in ${cityName}`,
    directAnswer: {
      province: [
        "Gas fireplace maintenance is preventive service for fireplaces that still run but need annual safety checks, cleaning, and tuning before regular use.",
        "It addresses soot buildup, weak flame patterns, pilot behavior, and venting concerns before they turn into ignition failures or shutdown problems.",
        "Book maintenance when the unit is operating but overdue for cleaning, before seasonal startup, or when performance has slowly declined rather than failed completely.",
      ],
      city: (cityName) => [
        `Gas fireplace maintenance in ${cityName} is preventive service for fireplaces that still run but need annual safety checks, cleaning, and tuning before regular use.`,
        "It focuses on burner and pilot cleaning, flame-pattern review, control checks, and combustion and venting observations—not full component replacement.",
        "Choose maintenance when the fireplace is overdue for service or running unevenly. If the unit will not ignite or keeps shutting off, gas fireplace repair is the better starting point.",
      ],
    },
    image: "/images/photos/gallery-02.jpeg",
    imageAlt: "Gas fireplace with open glass doors and burning logs in a brick surround",
    secondaryImage: "/images/photos/service-gasfireplace.jpg",
    secondaryImageAlt: "Gas fireplace interior opened for cleaning and annual maintenance work",
    included: [
      "Burner, pilot, and ignition cleaning to remove soot and debris buildup",
      "Inspection of controls, safety switches, and shutdown behavior",
      "Pilot light and flame-pattern troubleshooting for weak or unstable burn",
      "Glass, gasket, and firebox cleaning where serviceable",
      "Combustion and venting review for safe operation",
      "Clear maintenance notes with repair recommendations if worn parts are found",
    ],
    scopeSection: {
      eyebrow: "Service scope",
      title: "What We Check During Gas Fireplace Maintenance",
      description:
        "Maintenance visits focus on the components that affect safe ignition, stable flame quality, and reliable shutdown behavior.",
    },
    supportingSection: {
      eyebrow: "When to book",
      title: "When a Gas Fireplace Needs Maintenance",
      description:
        "Maintenance is for prevention and tune-ups—not for fireplaces that have already stopped working.",
    },
    supportingPoints: [
      {
        title: "Annual safety checks",
        description:
          "We inspect the components that most often lead to nuisance shutoffs, ignition failure, and unsafe operation when a fireplace has been sitting idle.",
      },
      {
        title: "Cleaning that improves reliability",
        description:
          "Dust, pet hair, lint, and soot buildup can interfere with pilot assemblies and flame quality long before a full repair is obvious.",
      },
      {
        title: "Maintenance vs component failure",
        description:
          "If the pilot will not stay lit or the main burner behaves inconsistently, we identify whether the problem is maintenance-related or a component failure that needs repair.",
      },
    ],
    semanticSections: [
      {
        heading: "Maintenance Is Not the Same as Gas Fireplace Repair",
        paragraphs: [
          "Maintenance is scheduled preventive work: cleaning, safety checks, and performance tuning while the fireplace still operates.",
          "Repair is for active failure—no ignition, repeated shutdowns, abnormal odors, or a unit that will not stay running. Those symptoms need diagnostics and component work, not just a tune-up.",
        ],
      },
    ],
    faqs: [
      {
        question: "How often should a gas fireplace be maintained?",
        answer:
          "Most gas fireplaces benefit from annual maintenance before regular heating-season use, especially if the unit sat idle for months or shows soot, weak flame, or inconsistent pilot behavior.",
      },
      {
        question: "What is included in gas fireplace maintenance?",
        answer:
          "A typical visit includes burner and pilot cleaning, control and safety-switch checks, flame-pattern review, glass and firebox cleaning where serviceable, and a combustion and venting review with written notes.",
      },
      {
        question: "Can maintenance fix a fireplace that will not ignite?",
        answer:
          "Sometimes cleaning resolves startup issues, but a fireplace that will not ignite or keeps shutting off usually needs repair diagnostics. Maintenance and repair serve different intents.",
      },
      {
        question: "Will I get notes if worn parts are found?",
        answer:
          "Yes. Maintenance visits include clear notes on what was checked, what was found, and whether the next step is continued maintenance, repair, or replacement planning.",
      },
    ],
    relatedServices: ["gas-fireplace-installation", "chimney-sweeping-inspection"],
    contextualLinks: [
      {
        title: "Gas fireplace repair",
        description:
          "Diagnostics and component work when the unit will not ignite, keeps shutting off, or fails after maintenance is overdue.",
        path: "/gas-fireplace-repair",
      },
    ],
    cityHighlights: {
      calgary:
        "Calgary freeze-thaw cycles, chinook swings, and shoulder-season idle periods often show up as inconsistent ignition after a unit sat unused. Nearby dispatch includes Airdrie, Cochrane, Okotoks, and Chestermere within about 100 km — those towns are service-area logic, not separate landing pages.",
      edmonton:
        "Edmonton's longer heating season and cold snaps put more hours on pilots, blowers, and venting. Annual cleaning matters more for fireplaces that run from fall through late spring, including Sherwood Park, St. Albert, and Leduc homes in the same hub radius.",
      "red-deer":
        "Red Deer and central-Alberta homes see repeated cold starts and freeze-thaw masonry stress around the same season. Preventive tune-ups help before weak pilots or dirty burners show up in Blackfalds, Sylvan Lake, and Lacombe.",
    },
    provinceCoverage: {
      eyebrow: "Choose your city",
      title: "This Alberta page explains the service. City pages are the local booking pages.",
      description:
        "Use Calgary, Edmonton, or Red Deer for local context and Request Service. This general page does not replace the city revenue page.",
    },
    finalCta: {
      provinceTitle: "Book gas fireplace maintenance in your Alberta service area.",
      cityTitle: (cityName) => `Book gas fireplace maintenance in ${cityName}.`,
      description: "Schedule online or call if you need help choosing between maintenance and repair.",
    },
    ctaLabel: "Book fireplace maintenance",
  },
  {
    slug: "chimney-sweeping-inspection",
    title: "Chimney Sweeping & Inspection",
    navLabel: "Chimney Sweeping & Inspection",
    menuDescription: "Chimney sweep visits, creosote removal, and WETT-aware inspections.",
    cardDescription:
      "Chimney sweep service with creosote removal, inspection reporting, and safety guidance for Alberta homeowners.",
    metaTitle: "Chimney Sweeping and Inspection in Alberta | Phoenix",
    metaDescription:
      "Alberta resource for chimney sweeping, creosote removal, and inspection. Choose Calgary, Edmonton, or Red Deer for local booking.",
    cityMetaTitle: (cityName) => `Chimney Sweeping & Inspection in ${cityName} | Phoenix Chimney`,
    cityMetaDescription: (cityName) =>
      `Book chimney sweeping and inspection in ${cityName} for creosote removal, draft review, and clearer safety documentation.`,
    cityKeywords: (cityName) =>
      [
        `chimney sweep ${cityName}`,
        `chimney sweeping ${cityName}`,
        `creosote removal ${cityName}`,
        `chimney inspection ${cityName}`,
      ] as const,
    keywords: [
      "chimney sweeping inspection Alberta",
      "creosote removal Alberta",
      "chimney inspection Alberta",
    ],
    eyebrow: "Sweep, inspect, and document",
    heroTitle:
      "Chimney sweep service with inspections that show what is clean, what is damaged, and what needs attention next.",
    heroDescription:
      "Phoenix combines creosote removal, system inspection, and practical safety reporting for Alberta wood-burning systems. Choose your city page to book locally.",
    cityHeroTitle: (cityName) => `Chimney sweeping and inspection in ${cityName}`,
    directAnswer: {
      province: [
        "Chimney sweeping and inspection removes creosote and soot buildup, checks the flue and accessible chimney components, and documents what is clean, worn, or blocked.",
        "It is the right visit when smoke, draft changes, heavy use, or routine cleaning timing suggest the chimney path needs attention before deeper problems develop.",
        "This service includes WETT-aware notes when documentation may be needed, but it is not the same as a formal WETT inspection for insurance or real-estate reporting.",
      ],
      city: (cityName) => [
        `Chimney sweeping and inspection in ${cityName} removes creosote and soot, checks liner, cap, crown, flashing, and draft conditions, and explains what needs follow-up work.`,
        "Book it for routine cleaning, smoke or draft complaints, or when you need clearer notes on chimney condition after heavy seasonal use.",
        "If you need formal WETT documentation for insurance or a home sale, that is a separate WETT inspection visit—not this sweeping and inspection service.",
      ],
    },
    image: "/images/photos/service-masonry.jpg",
    imageAlt: "Chimney inspection equipment set up near a roofline",
    secondaryImage: "/images/photos/wett-report.jpg",
    secondaryImageAlt:
      "Roof-level chimney inspection tools and camera equipment prepared for sweep and safety review",
    included: [
      "Pre-sweep review of system condition, appliance type, and visible venting concerns",
      "Creosote, soot, and blockage removal from serviceable chimney paths",
      "Visual inspection of liner, cap, crown, flashing, and accessible masonry",
      "Draft and safety observations tied to real burn performance concerns",
      "WETT-aware notes when insurance, sale, or compliance documentation is likely needed",
      "Clear repair or follow-up recommendations if structural or venting defects are found",
    ],
    scopeSection: {
      eyebrow: "Service scope",
      title: "What Is Checked During Chimney Sweeping and Inspection",
      description:
        "The visit combines cleaning of serviceable flue paths with visual review of the parts that most often affect draft, safety, and follow-up repair decisions.",
    },
    supportingSection: {
      eyebrow: "What the visit reveals",
      title: "What Chimney Sweeping and Inspection Can Reveal",
      description:
        "Sweeping reduces fuel load in the flue. Inspection identifies wear, blockages, and venting concerns while the system is already being reviewed.",
    },
    supportingPoints: [
      {
        title: "Creosote removal before it becomes a fire risk",
        description:
          "A sweep is not just about cleanliness. It reduces the fuel load sitting inside the chimney and can restore safer airflow through the system.",
      },
      {
        title: "Inspection while the system is open",
        description:
          "The best time to spot cap damage, liner wear, and moisture-related defects is while the service visit is already focused on the chimney path.",
      },
      {
        title: "Clear next-step guidance",
        description:
          "Homeowners get straight answers on whether the next step is routine maintenance, a WETT inspection, or a repair visit.",
      },
    ],
    semanticSections: [
      {
        heading: "Sweeping, General Inspection, and WETT Inspection Are Different Visits",
        paragraphs: [
          "Sweeping removes creosote, soot, and blockages from serviceable chimney paths. Inspection during that visit focuses on visible liner, cap, crown, flashing, and draft conditions.",
          "A WETT inspection is a separate reporting visit for insurance, real-estate, or formal documentation needs. This sweeping and inspection page covers cleaning and practical safety review—not WETT report delivery.",
        ],
        bullets: [
          "Sweeping: creosote and blockage removal",
          "Inspection: visible flue, cap, crown, and draft review during the visit",
          "WETT inspection: separate formal documentation service when required",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does a chimney sweep cost?",
        answer:
          "Sweep pricing is quoted after we understand the system. Final pricing depends on the system, condition, level of buildup, and chimney height/accessibility.",
      },
      {
        question: "Does chimney sweeping include a WETT inspection?",
        answer:
          "No. Sweeping and inspection can include WETT-aware notes when documentation may be needed, but a formal WETT inspection for insurance or a home sale is a separate appointment.",
      },
      {
        question: "What problems can sweeping and inspection identify?",
        answer:
          "Common findings include creosote buildup, blockages, cap or crown wear, liner concerns, flashing issues, and draft problems tied to how the system is actually performing.",
      },
      {
        question: "What happens if damage is found during the visit?",
        answer:
          "You receive clear repair or follow-up recommendations. Structural or venting defects may point toward masonry repair, liner work, or a dedicated WETT inspection depending on the situation.",
      },
    ],
    relatedServices: ["chimney-repair-masonry"],
    contextualLinks: [
      {
        title: "WETT inspections",
        description:
          "When insurance or a real-estate file requires wood-burning documentation beyond a routine sweep—not every sweep visit includes WETT reporting.",
        path: "/wett",
      },
    ],
    cityHighlights: {
      calgary:
        "In Calgary, sweeping is often needed after a heavy winter, smoke in the room, or a sale file that needs chimney notes — not because every home automatically needs WETT. Chinooks and freeze-thaw also affect caps, crowns, and flashing around the same visit.",
      edmonton:
        "Edmonton's longer burn season can load more creosote before deep winter. Sweeping restores visibility so draft, liner, and cap issues can be explained instead of guessed, including for Sherwood Park and St. Albert wood systems in the hub radius.",
      "red-deer":
        "Red Deer and nearby acreages (Sylvan Lake, Innisfail, Rocky Mountain House) often combine sweeping with inspection when wood systems carry a heavier seasonal load. A sweep is still not a WETT report unless documentation was requested.",
    },
    provinceCoverage: {
      eyebrow: "Choose your city",
      title: "This Alberta page explains sweeping and inspection. City pages are for local booking.",
      description:
        "Open Calgary, Edmonton, or Red Deer for local scheduling. This general page should not compete with those city pages in search.",
    },
    finalCta: {
      provinceTitle: "Book chimney sweeping and inspection in your Alberta service area.",
      cityTitle: (cityName) => `Book chimney sweeping and inspection in ${cityName}.`,
      description: "Schedule online or call if you are unsure whether sweeping, inspection, or WETT documentation is the right next step.",
    },
    ctaLabel: "Book chimney sweeping",
  },
  {
    slug: "chimney-repair-masonry",
    title: "Chimney Repair & Masonry",
    navLabel: "Chimney Repair & Masonry",
    menuDescription: "Tuckpointing, brickwork, liner replacement, and leak control.",
    cardDescription:
      "Tuckpointing, chimney brick repair, liner replacement, and leak diagnosis built for Alberta freeze-thaw wear.",
    metaTitle: "Chimney Repair and Masonry in Alberta | Phoenix",
    metaDescription:
      "Alberta resource for chimney masonry, crowns, flashing, and leak paths. Choose Calgary, Edmonton, or Red Deer for local booking.",
    cityMetaTitle: (cityName) => `Chimney Repair & Masonry in ${cityName} | Phoenix Chimney`,
    cityMetaDescription: (cityName) =>
      `Book chimney repair and masonry work in ${cityName} for mortar wear, crown damage, leaks, and structural chimney concerns.`,
    cityKeywords: (cityName) =>
      [
        `chimney repair ${cityName}`,
        `chimney masonry ${cityName}`,
        `chimney leak repair ${cityName}`,
        `tuckpointing ${cityName}`,
      ] as const,
    keywords: [
      "chimney repair Alberta",
      "chimney masonry Alberta",
      "chimney leak repair Alberta",
      "tuckpointing Alberta",
    ],
    eyebrow: "Structural chimney repair",
    heroTitle:
      "Chimney repair and masonry work that stops leaks, stabilizes brickwork, and fixes the parts winter weather keeps stressing.",
    heroDescription:
      "Phoenix repairs chimney crowns, mortar joints, brick faces, liners, and water-entry points for Alberta chimneys that need a targeted repair scope instead of guesswork. Choose Calgary, Edmonton, or Red Deer to book locally.",
    cityHeroTitle: (cityName) => `Chimney repair and masonry in ${cityName}`,
    directAnswer: {
      province: [
        "Chimney repair and masonry addresses visible exterior deterioration—cracked mortar, spalled brick, failing crowns, flashing leaks, and water entry that accelerates further damage.",
        "It is relevant when stains, leaks, loose mortar, or exterior wear appear at the chimney, not when the primary need is routine creosote removal or formal WETT reporting.",
        "Repair scope is based on visible deterioration patterns and leak sources, with clear notes on what is urgent and what can be phased.",
      ],
      city: (cityName) => [
        `Chimney repair and masonry in ${cityName} targets mortar wear, crown failure, brick spalling, flashing leaks, and water-entry points on exposed chimney structures.`,
        "Book when you see exterior deterioration, interior staining near the chimney path, or repeated leak symptoms tied to the roofline.",
        "Freeze-thaw exposure can accelerate mortar and crown wear on exterior chimneys, which is why early tuckpointing and crown repair often matter before damage spreads.",
      ],
    },
    image: "/images/photos/service-sweep.jpeg",
    imageAlt: "Fresh chimney crown repair and exterior masonry restoration on a brick chimney",
    secondaryImage: "/images/photos/gallery-04.jpeg",
    secondaryImageAlt: "Brick chimney crown, terracotta flue, and chimney cap during a roof-level service visit",
    included: [
      "Assessment of cracked mortar, spalled brick, crown failure, and visible structural movement",
      "Leak-source review around crowns, caps, flashing, and exterior water-entry points",
      "Tuckpointing and masonry repair planning based on actual deterioration patterns",
      "Chimney liner and venting review when interior protection may also be compromised",
      "Repair recommendations for waterproofing, rebuilding, or selective brick replacement",
      "Clear scope notes so homeowners understand what is urgent and what can be phased",
    ],
    scopeSection: {
      eyebrow: "Repair scope",
      title: "What Chimney Masonry Repair May Involve",
      description:
        "Repair planning starts with how water enters, where masonry is failing, and whether liner or venting conditions are contributing to the problem.",
    },
    supportingSection: {
      eyebrow: "Warning signs",
      title: "Signs a Chimney May Need Masonry Repair",
      description:
        "Exterior wear, leaks, and mortar failure often progress gradually until draft, staining, or visible movement becomes hard to ignore.",
    },
    supportingPoints: [
      {
        title: "Tuckpointing before moisture gets deeper",
        description:
          "When mortar joints open up, freeze-thaw cycles accelerate damage. Early repair protects more of the structure from needing full rebuild work.",
      },
      {
        title: "Brick and crown repairs tied to the source of failure",
        description:
          "We look at how water is entering, where brick faces are failing, and whether the crown or liner condition is contributing to faster deterioration.",
      },
      {
        title: "Liner review when the inside is part of the problem",
        description:
          "Visible exterior damage often overlaps with venting or liner issues, so the repair path should account for both the shell and the flue.",
      },
    ],
    semanticSections: [
      {
        heading: "Cosmetic Wear, Water Entry, and Repair Scope",
        paragraphs: [
          "Surface mortar cracking or minor spalling may be early-stage deterioration that tuckpointing or selective brick repair can address before moisture spreads.",
          "Water-entry problems often trace to crowns, caps, flashing, or open mortar joints. Repair scope should follow the leak source—not just the most visible symptom.",
        ],
      },
      {
        heading: "When Exterior Damage May Point to Deeper Concerns",
        paragraphs: [
          "Visible movement, widespread spalling, or interior staining near the chimney path may suggest the repair scope needs to include liner or venting review—not just exterior patching.",
          "The goal is a clear, phased plan: what needs immediate attention, what can wait, and what follow-up inspection or sweeping may still be required.",
        ],
      },
    ],
    faqs: [
      {
        question: "What are common signs a chimney needs masonry repair?",
        answer:
          "Common signs include cracked or missing mortar, spalled brick faces, crown deterioration, flashing leaks, interior staining, and visible water entry around the chimney structure.",
      },
      {
        question: "Can tuckpointing stop chimney leaks?",
        answer:
          "Tuckpointing helps when open mortar joints are allowing water in, but leaks may also come from crowns, caps, or flashing. The repair plan should target the actual entry point.",
      },
      {
        question: "Does masonry repair include liner replacement?",
        answer:
          "Liner and venting review is part of repair planning when interior protection may also be compromised. Liner replacement is scoped separately when inspection findings support it.",
      },
      {
        question: "Why does freeze-thaw matter for chimneys?",
        answer:
          "Repeated freeze-thaw cycles can open mortar joints and stress crowns and brick faces on exposed chimneys, which accelerates deterioration once moisture enters the masonry.",
      },
    ],
    relatedServices: ["chimney-sweeping-inspection"],
    contextualLinks: [
      {
        title: "WETT inspections",
        description:
          "Documentation for insurers or closings when wood-burning system review is required separately from masonry repair work.",
        path: "/wett",
      },
    ],
    cityHighlights: {
      calgary:
        "Calgary chimneys commonly show freeze-thaw mortar wear, crown cracking, and staining after chinook swings. Moisture that enters in a thaw can split joints on the next freeze — that is local climate, not a reason to invent job photos.",
      edmonton:
        "Edmonton's longer cold stretches and melt cycles can turn a small chimney leak into wider masonry and liner damage. Extended winter moisture on north and windward faces is a common local pattern.",
      "red-deer":
        "Red Deer chimneys see central-Alberta freeze-thaw plus acreage exposure around Sylvan Lake and Innisfail. Repair is scoped after inspection: crown, mortar, flashing, then the venting path — not a default rebuild.",
    },
    cityCoverage: {
      title: (cityName) => `Chimney repair coverage in ${cityName} and nearby communities`,
    },
    provinceCoverage: {
      eyebrow: "Choose your city",
      title: "This Alberta page explains masonry repair. City pages are the local booking pages.",
      description:
        "Chimney wear varies by exposure. Choose Calgary, Edmonton, or Red Deer for local context instead of treating this hub as a city landing page.",
    },
    finalCta: {
      provinceTitle: "Book chimney repair and masonry in your Alberta service area.",
      cityTitle: (cityName) => `Book chimney repair and masonry in ${cityName}.`,
      description: "Schedule online or call to describe visible wear, leaks, or staining before the visit.",
    },
    ctaLabel: "Book chimney repair",
  },
  {
    slug: "gas-fireplace-installation",
    title: "Gas Fireplace Installation",
    navLabel: "Gas Fireplace Installation",
    menuDescription: "New installs, retrofits, replacements, and upgrade planning.",
    cardDescription:
      "New gas fireplace installs, retrofit replacements, and upgrade planning for Alberta projects.",
    metaTitle: "Gas Fireplace Installation in Alberta | Phoenix",
    metaDescription:
      "Alberta resource for new installs, replacements, and retrofits. Choose Calgary, Edmonton, or Red Deer to plan a local visit.",
    cityMetaTitle: (cityName) => `Gas Fireplace Installation in ${cityName} | Phoenix Chimney`,
    cityMetaDescription: (cityName) =>
      `Plan gas fireplace installation, retrofits, and replacements in ${cityName} with venting and layout guidance before work starts.`,
    cityKeywords: (cityName) =>
      [
        `gas fireplace installation ${cityName}`,
        `gas fireplace retrofit ${cityName}`,
        `fireplace replacement ${cityName}`,
        `gas fireplace upgrade ${cityName}`,
      ] as const,
    keywords: [
      "gas fireplace installation Alberta",
      "gas fireplace retrofit Alberta",
      "fireplace replacement Alberta",
    ],
    eyebrow: "Install, retrofit, and upgrade",
    heroTitle:
      "Gas fireplace installation planned around venting, retrofit constraints, and the finished look homeowners actually want.",
    heroDescription:
      "Phoenix helps Alberta homeowners plan new gas fireplace installations, replace aging units, and retrofit existing openings. Choose Calgary, Edmonton, or Red Deer for a local consult.",
    cityHeroTitle: (cityName) => `Gas fireplace installation in ${cityName}`,
    directAnswer: {
      province: [
        "Gas fireplace installation covers new units, replacements, and retrofits planned around the existing opening, venting path, framing constraints, and how the room will be used.",
        "It is the right starting point when you are upgrading an outdated fireplace, planning a renovation, or replacing a unit that is beyond practical repair.",
        "Installation planning reviews appliance fit, venting, clearances, gas connection coordination, finishing work, and startup—not emergency ignition troubleshooting.",
      ],
      city: (cityName) => [
        `Gas fireplace installation in ${cityName} helps homeowners plan new units, replacements, and retrofits around venting, room layout, and the existing fireplace opening.`,
        "Book installation planning when you are renovating, replacing an aging unit, or upgrading to a cleaner gas feature—not when the current fireplace simply will not ignite.",
        "The visit clarifies appliance options, venting implications, finishing scope, and what to expect before installation day.",
      ],
    },
    image: "/images/photos/team-fireplace.jpg",
    imageAlt: "Modern linear gas fireplace installed into a contemporary living room wall",
    secondaryImage: "/images/photos/hero-fireplace.jpg",
    secondaryImageAlt: "Finished gas fireplace installation with a clean surround and wood mantel",
    included: [
      "Room and appliance assessment for new installs, replacements, or retrofit opportunities",
      "Review of venting path, framing constraints, and clearance requirements",
      "Guidance on insert, direct-vent, linear, or traditional unit options",
      "Coordination notes for gas connection, finishing work, and control upgrades",
      "Startup, commissioning, and operational walkthrough after installation",
      "Clear expectations on upgrade scope, appearance changes, and maintenance needs",
    ],
    scopeSection: {
      eyebrow: "Planning scope",
      title: "What We Review Before a Gas Fireplace Installation",
      description:
        "Installation planning focuses on fit, venting, and finish expectations before construction or replacement work begins.",
    },
    supportingSection: {
      eyebrow: "Project fit",
      title: "When Fireplace Installation or Replacement Makes Sense",
      description:
        "Installation is a planning and upgrade path—not the same as maintenance or repair on an existing operating unit.",
    },
    supportingPoints: [
      {
        title: "New installs that fit the room properly",
        description:
          "The right installation starts with sizing, venting, and viewing-angle decisions that match how the room is actually used.",
      },
      {
        title: "Retrofits for outdated or inefficient units",
        description:
          "Older fireplaces and builder-grade setups can often be upgraded with better controls, cleaner finishes, and more dependable performance.",
      },
      {
        title: "Upgrade planning before construction starts",
        description:
          "Homeowners get a clearer picture of appliance choices, venting implications, and the steps needed to move from concept to install.",
      },
    ],
    semanticSections: [
      {
        heading: "New Installation, Replacement, and Retrofit Planning",
        paragraphs: [
          "A new installation starts from the room and opening available. A replacement swaps an aging unit while working within existing constraints. A retrofit upgrades appearance, controls, or appliance type within the current layout.",
          "Each path has different venting, finishing, and coordination needs. Planning clarifies which approach fits the project before work starts.",
        ],
        bullets: [
          "New installation: room and opening assessment from the start",
          "Replacement: swap an aging or unreliable unit within existing constraints",
          "Retrofit: upgrade finish, controls, or appliance type in the current opening",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between installation and repair?",
        answer:
          "Installation and replacement planning address upgrades, retrofits, and new units. Repair addresses an existing fireplace that has stopped working or is performing poorly.",
      },
      {
        question: "Can you replace an old gas fireplace in the same opening?",
        answer:
          "Often yes, but the right replacement depends on venting path, framing constraints, clearances, and the appliance options that fit the opening and room layout.",
      },
      {
        question: "What happens during an installation consult?",
        answer:
          "We review the room, opening, venting path, appliance options, gas connection coordination, finishing scope, and what startup and maintenance will look like after install.",
      },
      {
        question: "Do I need maintenance after a new installation?",
        answer:
          "Yes. New and replacement units still need ongoing maintenance for safe operation. Installation planning includes expectations for post-install care.",
      },
    ],
    relatedServices: ["gas-fireplace-maintenance"],
    contextualLinks: [
      {
        title: "Gas fireplace repair",
        description:
          "When an existing unit fails before replacement planning is complete, repair diagnostics may be needed alongside install consults.",
        path: "/gas-fireplace-repair",
      },
    ],
    cityHighlights: {
      calgary:
        "Calgary replacements often follow dated fronts, poor ignition after idle winters, or renovations that change the living-room layout. Venting and clearances still govern what can be installed — not the finish package alone.",
      edmonton:
        "Edmonton upgrades more often track a long heating season: efficiency, retrofits in existing openings, and replacing units that fail after years of winter use. Permit and venting review stay part of planning.",
      "red-deer":
        "Red Deer and central-Alberta installs often mix renovation timing with insert or direct-vent options for existing openings. Surrounding communities stay in the 100 km hub; they do not get their own install URLs.",
    },
    provinceCoverage: {
      eyebrow: "Choose your city",
      title: "This Alberta page explains installation planning. City pages are for local consults.",
      description:
        "Open Calgary, Edmonton, or Red Deer to start a local project. This hub is the general resource, not a substitute city landing page.",
    },
    finalCta: {
      provinceTitle: "Plan gas fireplace installation in your Alberta service area.",
      cityTitle: (cityName) => `Plan gas fireplace installation in ${cityName}.`,
      description: "Schedule a consult online or call to discuss replacement, retrofit, or new-install options.",
    },
    ctaLabel: "Book installation consult",
  },
] as const;

export function getCityServiceKeywords(slug: string, cityName: string) {
  const servicePage = getServiceLandingPage(slug);

  if (servicePage) {
    return servicePage.cityKeywords(cityName);
  }

  return [`fireplace service ${cityName}`, `chimney service ${cityName}`] as const;
}

export function getCityServiceCardDescription(slug: string, cityName: string) {
  switch (slug) {
    case "gas-fireplace-maintenance":
      return `Annual gas fireplace safety checks, cleaning, and pilot service for ${cityName} homes.`;
    case "chimney-sweeping-inspection":
      return `Chimney sweep service with creosote removal, inspection reporting, and safety guidance for ${cityName} homeowners.`;
    case "chimney-repair-masonry":
      return `Tuckpointing, chimney brick repair, liner replacement, and leak diagnosis for ${cityName} chimneys affected by freeze-thaw wear.`;
    case "gas-fireplace-installation":
      return `New gas fireplace installs, retrofit replacements, and upgrade planning for ${cityName} projects.`;
    default:
      return `Fireplace and chimney service guidance for ${cityName} homeowners.`;
  }
}

export function getServiceLandingHref(slug: string, city?: CitySlug | null) {
  return getServiceHref(slug, city);
}

export function getServiceLandingPage(slug: string) {
  return serviceLandingPages.find((page) => page.slug === slug);
}

export function getServiceDetailPath(serviceSlug: string) {
  return getServicePath(serviceSlug);
}

export const footerLinks = [
  {
    title: "Services",
    items: services.map((service) => ({
      label: service.title,
      href: getServicePath(service.slug),
    })),
  },
  {
    title: "Company",
    items: [
      { label: "About Phoenix", href: "/about" },
      { label: "Articles", href: "/articles" },
      { label: "WETT Inspections", href: "/wett" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;