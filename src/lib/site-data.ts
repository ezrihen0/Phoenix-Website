import { getCityHref, type CitySlug } from "@/lib/cities";

export const siteConfig = {
  name: "Phoenix Chimney & Fireplace Services",
  shortName: "Phoenix Fireplace",
  legalName: "Phoenix Chimney & Fireplace Services",
  description:
    "Phoenix Chimney & Fireplace Services routes fireplace repair, chimney care, and WETT inspection service across Calgary, Edmonton, and Red Deer.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://phoenixfireplace.ca",
  phoneDisplay: "(825) 425-0050",
  phoneHref: "+18254250050",
  email: "phoenixfireplace0@gmail.com",
  serviceRadius: "Serving Calgary and surrounding communities within 100 km.",
  hoursLabel: "Sunday-Friday",
  hoursDetail: "9AM-6PM local dispatch",
  bookingLabel: "24/7 online booking",
  workizUrl:
    "https://online-booking.workiz.com/?ac=a4cec125301177c1e59dbd126ecf1fdb5e10a208bf0fd37dc32cf14e5be902f7",
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
  { value: "Priority", label: "Scheduling for urgent WETT report requests when available" },
  { value: "100km", label: "Coverage radius around Calgary" },
] as const;

export function getTrustMetrics(cityName: string) {
  return [
    { value: "Local", label: `Fireplace and chimney service for ${cityName} homes` },
    { value: "Priority", label: "Scheduling for urgent WETT report requests when available" },
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

export const services = [
  {
    slug: "gas-fireplace-repair",
    title: "Gas Fireplace Repair & Maintenance",
    tagline: "Diagnostics, tune-ups, cleaning, and dependable heat before winter hits.",
    description:
      "From ignition problems and low flame performance to annual cleaning and safety checks, we keep gas fireplaces running safely and efficiently.",
    bullets: [
      "Pilot and ignition troubleshooting",
      "Thermocouple and valve diagnosis",
      "Annual cleaning and glass service",
      "Safety testing and combustion checks",
    ],
    image: "/images/photos/service-gasfireplace.jpg",
    icon: "/images/icons/fireplace-icon.png",
  },
  {
    slug: "wett-inspections",
    title: "WETT Inspections",
    tagline: "Inspection reporting for insurance, real estate, and peace of mind.",
    description:
      "We inspect wood-burning systems, venting, clearances, and chimney condition to produce documentation homeowners can share with insurers or real-estate contacts.",
    bullets: [
      "Insurance and pre-sale reports",
      "Visual system assessments",
      "Clearance and venting review",
      "Clear inspection documentation",
    ],
    image: "/images/photos/wett-inspection.jpg",
    icon: "/images/icons/inspection-icon.png",
  },
  {
    slug: "chimney-sweep-repair",
    title: "Chimney Sweep & Repair",
    tagline: "Safer draft, cleaner systems, and repairs before small issues become structural ones.",
    description:
      "Professional sweeping, creosote removal, visual inspection, and repair planning for chimneys that need better performance and lower risk.",
    bullets: [
      "Creosote and blockage removal",
      "Camera inspections",
      "Crown, cap, and liner repairs",
      "Moisture and leak diagnosis",
    ],
    image: "/images/photos/service-sweep.jpeg",
    icon: "/images/icons/chimney-icon.png",
  },
  {
    slug: "wood-stove-service",
    title: "Wood Stove & Fireplace Service",
    tagline: "Maintenance and repairs that keep wood-burning systems safe and efficient.",
    description:
      "We service wood stoves, inserts, and fireplaces with gasket replacement, inspection, cleaning, and repair support for wood-burning systems.",
    bullets: [
      "Annual maintenance and cleanings",
      "Door gasket and seal replacement",
      "Chimney connection checks",
      "Draft and burn-performance review",
    ],
    image: "/images/photos/service-woodstove.jpg",
    icon: "/images/icons/service-icon.png",
  },
  {
    slug: "masonry-rebuilds",
    title: "Masonry Repair & Rebuilds",
    tagline: "Roofline-up repairs, tuckpointing, and exterior protection built for freeze-thaw cycles.",
    description:
      "When exterior chimney damage is visible, we repair crowns, brick, mortar, caps, and water-entry points before deterioration spreads.",
    bullets: [
      "Crown repair and rebuilding",
      "Brick and stone restoration",
      "Tuckpointing and mortar replacement",
      "Waterproofing and leak protection",
    ],
    image: "/images/photos/service-masonry.jpg",
    icon: "/images/icons/chimney-icon.png",
  },
] as const;

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
      "Fast responses, clear appointment windows, and online booking that works after hours.",
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

export function getAboutPoints(cityName: string) {
  return [
    {
      title: "Careful fireplace and chimney technicians",
      description:
        "Every visit is built around safety, clean workmanship, and realistic advice instead of unnecessary upsells.",
    },
    {
      title: "Scheduling that respects the homeowner",
      description:
        "Fast responses, clear appointment windows, and online booking that works after hours.",
    },
    {
      title: "Repair-first mindset",
      description:
        "We focus on the safest effective fix, whether that is a tune-up, targeted repair, or rebuild plan.",
    },
    {
      title: `Work built for ${cityName}`,
      description:
        `${cityName} winter wear, freeze-thaw masonry stress, and seasonal startup problems are treated as local realities, not edge cases.`,
    },
  ] as const;
}

export const galleryImages = [
  {
    src: "/images/photos/gallery-01.jpg",
    alt: "Fireplace service component close-up.",
  },
  {
    src: "/images/photos/gallery-02.jpeg",
    alt: "Interior view of a fireplace unit during service.",
  },
  {
    src: "/images/photos/gallery-03.jpeg",
    alt: "Measurement detail near a hearth assembly.",
  },
  {
    src: "/images/photos/gallery-04.jpeg",
    alt: "Fireplace and chimney service photo from a home visit.",
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
      "Use the online booking link for 24/7 scheduling, or call the office if you need help choosing the right service type.",
  },
] as const;

export function getHomeFaqs(cityName: string, serviceAreas: readonly string[]) {
  const nearbyAreas = serviceAreas.slice(0, 5).join(", ");

  return [
    {
      question: `Do I need a WETT inspection for a home sale in ${cityName}?`,
      answer:
        `Often yes. Buyers, insurers, and real-estate agents commonly request a WETT inspection for wood-burning appliances and connected chimney systems in ${cityName}.`,
    },
    {
      question: "Can you repair a gas fireplace that will not ignite?",
      answer:
        "Yes. Ignition failure, pilot issues, dirty burners, and worn components are part of our standard gas fireplace repair work.",
    },
    {
      question: `How far outside ${cityName} do you travel?`,
      answer:
        `We serve ${cityName} and surrounding communities within roughly a 100-kilometre radius, including nearby areas such as ${nearbyAreas}.`,
    },
    {
      question: "What is the fastest way to schedule service?",
      answer:
        "Use the online booking link for 24/7 scheduling, or call the office if you need help choosing the right service type.",
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
        `The most common triggers are home sales, insurance reviews, newly installed wood-burning appliances, and any situation where a homeowner needs formal documentation before using the system with confidence.`,
    },
    {
      question: `Is a WETT inspection in ${cityName} the same as a repair visit?`,
      answer:
        `No. A WETT inspection is a reporting and system-review service. If defects are found, Phoenix can also outline the repair path so the homeowner understands what needs correction next.`,
    },
    {
      question: `How fast can I book a WETT inspection in ${cityName}?`,
      answer:
        `Timing depends on season and urgency, but Phoenix treats insurance files, real-estate closings, and safety-sensitive requests as priority scheduling cases whenever possible.`,
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
      "Annual gas fireplace safety checks, cleaning, and pilot service for Calgary, Edmonton, and Red Deer homes.",
    metaTitle: "Gas Fireplace Maintenance Alberta | Calgary, Edmonton & Red Deer",
    metaDescription:
      "Annual gas fireplace safety checks, cleaning, pilot light troubleshooting, and performance tuning for Calgary, Edmonton, and Red Deer homes.",
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
      "gas fireplace maintenance Calgary",
      "gas fireplace maintenance Edmonton",
      "gas fireplace maintenance Red Deer",
      "gas fireplace repair Alberta",
      "fireplace technicians Calgary Edmonton Red Deer",
    ],
    eyebrow: "Annual fireplace safety service",
    heroTitle:
      "Gas fireplace maintenance that keeps Alberta homes safer before heating season stress shows up.",
    heroDescription:
      "Phoenix handles annual safety checks, burner cleaning, pilot light issues, and combustion tuning for homeowners in Calgary, Edmonton, and Red Deer who want dependable ignition and cleaner performance before the cold hits.",
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
    image: "/images/photos/gallery-03.jpeg",
    imageAlt: "Open gas fireplace firebox during seasonal cleaning and maintenance service",
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
    cityHighlights: {
      calgary:
        "Calgary homeowners often book maintenance before shoulder-season startup, especially when chinook swings and long idle periods make ignition behavior inconsistent.",
      edmonton:
        "Edmonton's longer heating season makes annual cleaning and combustion checks more important for fireplaces that see extended winter use.",
      "red-deer":
        "Red Deer and central-Alberta homes benefit from preventive tune-ups before repeated cold starts expose weak pilots, dirty burners, or sluggish controls.",
    },
    provinceCoverage: {
      eyebrow: "Alberta coverage",
      title: "Gas fireplace maintenance for Calgary, Edmonton, and Red Deer homeowners.",
      description:
        "These pages cover the same preventive maintenance service across Alberta's main service areas. Choose your city page for local booking and service-area context.",
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
    menuDescription: "Expert chimney sweep visits, creosote removal, and WETT-aware inspections.",
    cardDescription:
      "Chimney sweep service with creosote removal, inspection reporting, and safety guidance for Alberta homeowners.",
    metaTitle: "Chimney Sweep Alberta | Calgary, Edmonton & Red Deer",
    metaDescription:
      "Book chimney sweeping, creosote removal, WETT-aware inspections, and safety reporting for Calgary, Edmonton, and Red Deer.",
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
      "expert chimney sweep Calgary",
      "expert chimney sweep Edmonton",
      "expert chimney sweep Red Deer",
      "chimney sweeping inspection Alberta",
      "WETT inspection Alberta",
    ],
    eyebrow: "Sweep, inspect, and document",
    heroTitle:
      "Chimney sweep service with inspections that show what is clean, what is damaged, and what needs attention next.",
    heroDescription:
      "Phoenix combines creosote removal, system inspection, and practical safety reporting for homeowners in Calgary, Edmonton, and Red Deer who need lower fire risk, better draft, and clearer documentation.",
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
        question: "How often should a chimney be swept?",
        answer:
          "Frequency depends on how often the system is used and what fuel it burns. Heavy wood-burning use, smoke complaints, or visible creosote buildup are common reasons to schedule sooner rather than later.",
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
    cityHighlights: {
      calgary:
        "In Calgary, sweeping is often paired with inspections after heavy winter use, smoke complaints, or a real-estate file that needs clearer chimney documentation.",
      edmonton:
        "Edmonton homes with longer burn seasons benefit from routine creosote removal and inspection before deep-winter draft issues become safety problems.",
      "red-deer":
        "Red Deer and surrounding acreage properties often need combined sweeping and inspection visits when wood-burning systems carry heavier seasonal workloads.",
    },
    provinceCoverage: {
      eyebrow: "Alberta coverage",
      title: "Chimney sweeping and inspection across Calgary, Edmonton, and Red Deer.",
      description:
        "Homeowners across Alberta's main service areas can book the same sweeping and inspection service. Open your city page for local scheduling details.",
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
    metaTitle: "Chimney Repair & Masonry Alberta | Calgary, Edmonton & Red Deer",
    metaDescription:
      "Book tuckpointing, chimney brick repair, liner replacement, crown work, and leak diagnosis for Calgary, Edmonton, and Red Deer.",
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
      "chimney repair masonry Calgary",
      "chimney repair masonry Edmonton",
      "chimney repair masonry Red Deer",
      "chimney liner replacement Alberta",
      "chimney leak repair Alberta",
    ],
    eyebrow: "Structural chimney repair",
    heroTitle:
      "Chimney repair and masonry work that stops leaks, stabilizes brickwork, and fixes the parts winter weather keeps stressing.",
    heroDescription:
      "Phoenix repairs chimney crowns, mortar joints, brick faces, liners, and water-entry points for homeowners in Calgary, Edmonton, and Red Deer who need a targeted repair scope instead of guesswork.",
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
    secondaryImageAlt: "Outdoor chimney structure after masonry repair and crown restoration work",
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
    cityHighlights: {
      calgary:
        "Calgary chimneys commonly show freeze-thaw mortar wear, crown cracking, and water intrusion after repeated weather swings and roofline exposure.",
      edmonton:
        "In Edmonton, longer cold stretches and accumulated winter moisture can turn minor chimney leaks into widespread masonry and liner problems if left alone.",
      "red-deer":
        "Red Deer homes and acreages often need targeted masonry repair plans that address both exterior deterioration and the venting path behind it.",
    },
    cityCoverage: {
      title: (cityName) => `Chimney repair coverage in ${cityName} and nearby communities`,
    },
    provinceCoverage: {
      eyebrow: "Alberta coverage",
      title: "Chimney repair and masonry for Calgary, Edmonton, and Red Deer homes.",
      description:
        "Exterior chimney repair needs vary by exposure and wear patterns. Choose your city page to review local service context and book the right visit.",
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
      "New gas fireplace installs, retrofit replacements, and upgrade planning for Calgary, Edmonton, and Red Deer projects.",
    metaTitle: "Gas Fireplace Installation Alberta | Calgary, Edmonton & Red Deer",
    metaDescription:
      "Book new gas fireplace installations, retrofits, replacements, and venting upgrades for Calgary, Edmonton, and Red Deer.",
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
      "gas fireplace installation Calgary",
      "gas fireplace installation Edmonton",
      "gas fireplace installation Red Deer",
      "gas fireplace retrofit Alberta",
      "gas fireplace upgrade Alberta",
    ],
    eyebrow: "Install, retrofit, and upgrade",
    heroTitle:
      "Gas fireplace installation planned around venting, retrofit constraints, and the finished look homeowners actually want.",
    heroDescription:
      "Phoenix helps Calgary, Edmonton, and Red Deer homeowners plan new gas fireplace installations, replace aging units, and retrofit existing openings with a cleaner, more dependable heating feature.",
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
    cityHighlights: {
      calgary:
        "Calgary renovation projects often focus on replacing dated fireplace fronts with cleaner gas units that suit newer living-room layouts and finish packages.",
      edmonton:
        "Edmonton homeowners frequently plan upgrades around longer heating seasons, improved efficiency, and retrofits that replace unreliable older appliances.",
      "red-deer":
        "Red Deer and central-Alberta projects often blend installation planning with renovation work, insert upgrades, and direct-vent solutions for existing openings.",
    },
    provinceCoverage: {
      eyebrow: "Alberta coverage",
      title: "Gas fireplace installation planning across Calgary, Edmonton, and Red Deer.",
      description:
        "Installation and retrofit projects share the same planning steps across Alberta's main service areas. Open your city page to start local project planning.",
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
  if (city) {
    return getCityHref(city, `/services/${slug}`);
  }

  return `/services/${slug}`;
}

export function getServiceLandingPage(slug: string) {
  return serviceLandingPages.find((page) => page.slug === slug);
}

export function getServiceDetailPath(serviceSlug: string) {
  if (serviceSlug === "gas-fireplace-repair") {
    return "/gas-fireplace-repair";
  }

  if (serviceSlug === "wett-inspections") {
    return "/wett";
  }

  return `/services#${serviceSlug}`;
}

export const footerLinks = [
  {
    title: "Services",
    items: services.slice(0, 4).map((service) => ({
      label: service.title,
      href: getServiceDetailPath(service.slug),
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