export const siteConfig = {
  name: "Phoenix Chimney & Fireplace Services",
  shortName: "Phoenix Fireplace",
  legalName: "Phoenix Chimney & Fireplace Services",
  description:
    "Calgary chimney and fireplace specialists for gas fireplace repair, WETT inspections, chimney sweeping, masonry repair, and safety-first maintenance.",
  url: "https://fireplacerepairscalgary.ca",
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
  { href: "/wett", label: "WETT" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const heroHighlights = [
  "Certified WETT inspections for insurance and real-estate transactions",
  "Gas fireplace repair and diagnostics for all major makes and models",
  "Chimney sweeping, masonry repair, relining, and camera inspections",
] as const;

export const trustMetrics = [
  { value: "10+", label: "Years serving Calgary homes" },
  { value: "24h", label: "Turnaround for urgent WETT reporting" },
  { value: "100km", label: "Coverage radius around Calgary" },
] as const;

export const valuePillars = [
  {
    title: "Insurance-ready documentation",
    description:
      "Clear reporting, photo evidence, and code-minded recommendations for insurers, buyers, sellers, and homeowners.",
  },
  {
    title: "Field-tested diagnostics",
    description:
      "We use live camera inspection, combustion troubleshooting, and practical repair plans instead of guesswork.",
  },
  {
    title: "One local team, start to finish",
    description:
      "From a routine sweep to masonry rebuilds, you work with one accountable Calgary crew.",
  },
] as const;

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
    tagline: "Certified reporting for insurance, real estate, and peace of mind.",
    description:
      "We inspect wood-burning systems, venting, clearances, and chimney condition to produce documentation accepted by Canadian insurance providers.",
    bullets: [
      "Insurance and pre-sale reports",
      "Camera-based visual assessments",
      "Clearance and venting review",
      "Photo-backed documentation",
    ],
    image: "/images/photos/wett-inspection.jpg",
    icon: "/images/icons/inspection-icon.png",
  },
  {
    slug: "chimney-sweep-repair",
    title: "Chimney Sweep & Repair",
    tagline: "Safer draft, cleaner systems, and repairs before small issues become structural ones.",
    description:
      "Professional sweeping, creosote removal, video inspection, and repair planning for chimneys that need better performance and lower risk.",
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
      "We service wood stoves, inserts, and fireplaces with gasket replacement, inspection, cleaning, and repair support tailored to Calgary homes.",
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
    title: "Licensed, careful technicians",
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

export const galleryImages = [
  {
    src: "/images/photos/gallery-01.jpg",
    alt: "Technician servicing a fireplace component in the field.",
  },
  {
    src: "/images/photos/gallery-02.jpeg",
    alt: "Detailed interior inspection of a fireplace unit.",
  },
  {
    src: "/images/photos/gallery-03.jpeg",
    alt: "Measurement and inspection work on a hearth assembly.",
  },
  {
    src: "/images/photos/gallery-04.jpeg",
    alt: "Field photo from a live repair visit in a Calgary home.",
  },
] as const;

export const wettBenefits = [
  {
    title: "Insurance and real-estate ready",
    description:
      "Reports are written to help buyers, sellers, insurers, and homeowners understand system condition fast.",
  },
  {
    title: "Camera-backed inspection",
    description:
      "Hidden defects, blockages, and compromised flues are easier to document when the full system is reviewed visually.",
  },
  {
    title: "Actionable findings",
    description:
      "You get plain-language recommendations on what passes, what needs correction, and what should be repaired before use.",
  },
  {
    title: "Fast reporting turnaround",
    description:
      "Time-sensitive files for listings, closings, or insurance reviews are handled with urgency.",
  },
] as const;

export const homeFaqs = [
  {
    question: "Do I need a WETT inspection for a home sale in Calgary?",
    answer:
      "Often yes. Buyers, insurers, and real-estate agents commonly request a certified WETT inspection for wood-burning appliances and connected chimney systems.",
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
      "Use the Workiz booking link for 24/7 online scheduling, or call the office if you need help choosing the right service type.",
  },
] as const;

export const contactServiceOptions = services.map((service) => service.title);

export const footerLinks = [
  {
    title: "Services",
    items: services.slice(0, 4).map((service) => ({
      label: service.title,
      href: "/services",
    })),
  },
  {
    title: "Company",
    items: [
      { label: "About Phoenix", href: "/about" },
      { label: "WETT Inspections", href: "/wett" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;