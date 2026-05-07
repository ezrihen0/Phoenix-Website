import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden py-16 text-[var(--hero-title)] md:py-20"
      style={{ background: "var(--surface-hero)" }}
    >
      <div className="hero-lux-plane hero-lux-plane-a" />
      <div className="hero-lux-plane hero-lux-plane-b" />
      <div className="hero-lux-glow hero-lux-glow-a" />
      <div className="hero-lux-glow hero-lux-glow-b" />
      <div className="container-shell relative grid items-center gap-10 md:grid-cols-[1.06fr_0.94fr]">
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--foundation-gold)]">Alberta Local Experts</p>
          <h1 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-[1.06] md:text-[3.45rem]">Premium Chimney and Fireplace Services in Alberta</h1>
          <p className="mt-5 max-w-[52ch] text-lg text-[var(--hero-body-text)]">Gas fireplace repair, WETT inspections, chimney sweeping, and chimney repairs for homeowners in Calgary, Edmonton, Red Deer, and surrounding areas.</p>
          <p className="mt-4 text-sm text-[var(--foundation-gold)]">Local Alberta Service | Clear Diagnostics | Professional Reporting</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={siteConfig.phoneHref}>Call Now</Button>
            <Button href={siteConfig.booking.url} variant="secondary" external>Book Online</Button>
          </div>
        </div>
        <div className="relative z-10">
          <div className="hero-glass-shell rounded-3xl border border-[var(--border-glass)] p-4 md:p-6">
            <div className="hero-main-card rounded-2xl p-6 md:p-8">
              <div className="rounded-xl border border-[var(--hero-detail-border)] bg-[var(--hero-detail-bg)] p-4 md:p-5">
                <p className="text-sm text-[var(--hero-subtitle)]">Luxury Indoor Fireplace Scene</p>
                <p className="mt-1 text-xl font-semibold md:text-2xl">Warm premium ambiance with trusted local service</p>
              </div>
            </div>
            <div className="hero-micro-card hero-micro-card-a hidden rounded-xl border border-[var(--border-contrast)] bg-[var(--hero-micro-a-bg)] p-3 text-sm text-[var(--hero-subtitle)] md:block">
              Copper-grade diagnostics
            </div>
            <div className="hero-micro-card hero-micro-card-b hidden rounded-xl border border-[var(--border-contrast-strong)] bg-[var(--hero-micro-b-bg)] p-3 text-sm text-[var(--hero-detail-text)] md:block">
              Insurance-ready clarity
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
