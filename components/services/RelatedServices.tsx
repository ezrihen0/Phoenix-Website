import Link from "next/link";
export function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const services = [["gas-fireplace-repair", "Gas Fireplace Repair"],["wett-inspection", "WETT Inspection"],["chimney-sweep", "Chimney Sweep"],["chimney-repair", "Chimney Repair"]] as const;
  return <section className="container-shell pb-14"><h2 className="text-2xl font-semibold">Related Services</h2><div className="mt-4 flex flex-wrap gap-3">{services.filter(([s]) => s !== currentSlug).map(([s,l]) => <Link key={s} className="rounded-full border border-[var(--border-soft)] px-4 py-2" href={`/services/${s}`}>{l}</Link>)}</div></section>;
}