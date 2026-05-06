import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden py-20 text-[var(--hero-title)]"
      style={{ background: "var(--surface-hero)" }}
    >
      <div className="absolute -right-14 top-8 h-56 w-56 rounded-full bg-[var(--accent-glow)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_35%,rgba(214,171,103,0.14),transparent_42%)]" />
      <div className="container-shell relative grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--foundation-gold)]">Alberta Local Experts</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">Premium Chimney and Fireplace Services in Alberta</h1>
          <p className="mt-4 text-lg text-[#dce2ec]">Gas fireplace repair, WETT inspections, chimney sweeping, and chimney repairs for homeowners in Calgary, Edmonton, Red Deer, and surrounding areas.</p>
          <p className="mt-4 text-sm text-[var(--foundation-gold)]">Local Alberta Service | Clear Diagnostics | Professional Reporting</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={siteConfig.phoneHref}>Call Now</Button>
            <Button href={siteConfig.booking.url} variant="secondary" external>Book Online</Button>
          </div>
        </div>
        <div className="rounded-3xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.06)] p-6">
          <div className="rounded-2xl bg-[linear-gradient(145deg,#2f343a_0%,#4f3a2f_50%,#2a2422_100%)] p-8 shadow-2xl">
            <div className="rounded-xl border border-[rgba(255,255,255,0.2)] bg-[rgba(255,188,117,0.14)] p-4">
              <p className="text-sm text-[var(--hero-subtitle)]">Luxury Indoor Fireplace Scene</p>
              <p className="mt-1 text-xl font-semibold">Warm premium ambiance with trusted local service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
