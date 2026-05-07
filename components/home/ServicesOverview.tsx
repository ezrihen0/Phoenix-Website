import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
export function ServicesOverview() {
  const items = [["Gas Fireplace Repair", "Fix ignition issues, weak flame, and unreliable operation.", "/services/gas-fireplace-repair"],["WETT Inspection", "Professional inspections with clear Alberta-focused reporting.", "/services/wett-inspection"],["Chimney Sweep", "Safe and clean chimney maintenance for better performance.", "/services/chimney-sweep"],["Chimney Repair", "Targeted repairs to protect your home and restore safety.", "/services/chimney-repair"]] as const;
  return <Section><p className="section-kicker">What We Do</p><h2 className="section-title">Core Services</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{items.map(([t,b,h]) => <Link key={h} href={h}><Card title={t} body={b} /></Link>)}</div></Section>;
}
