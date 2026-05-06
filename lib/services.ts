export type ServiceDef = { slug: string; title: string; description: string; metaDescription: string; faq: { q: string; a: string }[]; };

export const servicePages = {
  gasFireplaceRepair: {
    slug: "gas-fireplace-repair",
    title: "Gas Fireplace Repair in Alberta",
    description: "Reliable diagnostics and repair for ignition issues, weak flame, and intermittent fireplace performance.",
    metaDescription: "Gas fireplace repair for Calgary, Edmonton, and Red Deer homeowners with professional diagnostics and safe service.",
    faq: [{ q: "Why won't my gas fireplace start?", a: "Common causes include ignition component wear, pilot issues, or gas flow restrictions." }, { q: "Can I keep trying to relight it?", a: "If it repeatedly fails, stop and schedule service." }],
  },
  wettInspection: {
    slug: "wett-inspection",
    title: "WETT Inspection Services in Alberta",
    description: "Inspection-first service with clear reporting for homeowners, buyers, and insurance requests.",
    metaDescription: "WETT inspections in Calgary, Edmonton, and Red Deer with clear documentation and practical next steps.",
    faq: [{ q: "What is included in a WETT inspection?", a: "Appliance, venting, and installation checks with written findings." }, { q: "Is this useful for insurance?", a: "Yes, many homeowners use WETT reporting for insurance and real estate." }],
  },
  chimneySweep: {
    slug: "chimney-sweep",
    title: "Chimney Sweep Service in Alberta",
    description: "Professional chimney sweeping to improve safety, draft performance, and seasonal reliability.",
    metaDescription: "Chimney sweep services in Calgary, Edmonton, and Red Deer with clean process and safety-first approach.",
    faq: [{ q: "How often should I sweep my chimney?", a: "Periodic sweeping depends on use and appliance type." }, { q: "Will this make a mess?", a: "Our process is designed to keep your home clean and protected." }],
  },
  chimneyRepair: {
    slug: "chimney-repair",
    title: "Chimney Repair in Alberta",
    description: "Targeted chimney repair services for structure, venting integrity, and long-term safety.",
    metaDescription: "Chimney repair services for Alberta homeowners, including Calgary, Edmonton, and Red Deer.",
    faq: [{ q: "What are signs I need chimney repair?", a: "Cracking, moisture issues, poor draft, and deterioration are common warnings." }, { q: "Can repairs wait until later?", a: "Delays can increase risk and costs." }],
  },
};