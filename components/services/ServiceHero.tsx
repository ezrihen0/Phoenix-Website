import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function ServiceHero({ title, description }: { title: string; description: string }) {
  return (
    <section
      className="relative overflow-hidden py-14 text-[var(--text-inverse)]"
      style={{ background: "var(--surface-hero)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_32%,rgba(214,171,103,0.12),transparent_40%)]" />
      <div className="container-shell relative">
        <p className="section-kicker text-[var(--foundation-gold)]">Alberta Local Experts</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-[#dce2ec]">{description}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button href={siteConfig.phoneHref}>Call Now</Button>
          <Button href={siteConfig.booking.url} variant="secondary" external>Book Online</Button>
        </div>
      </div>
    </section>
  );
}
