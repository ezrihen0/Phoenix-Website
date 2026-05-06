import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
export function FinalCTA({ className = "" }: { className?: string }) {
  return <Section className={`mb-10 rounded-3xl bg-[var(--surface-inverse)] text-[var(--text-inverse)] ${className}`}><h2 className="text-3xl font-semibold">Need Service This Week?</h2><p className="mt-3 max-w-2xl text-[var(--hero-subtitle)]">Call now for fast support or book online at your convenience.</p><div className="mt-6 flex flex-wrap gap-4"><Button href={siteConfig.phoneHref}>Call Now</Button><Button href={siteConfig.booking.url} variant="secondary" external>Book Online</Button></div></Section>;
}
