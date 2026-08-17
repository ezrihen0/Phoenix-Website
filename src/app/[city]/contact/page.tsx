import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Mail, MapPinned, Phone } from "lucide-react";
import { notFound } from "next/navigation";

import { CityPlaceholderPage } from "@/components/city-placeholder-page";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { cityHasFullContent, getCityBySlug, getCityHref, getCitySettings, getRequestServiceHref } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    return createPageMetadata({
      title: "Contact Page Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city contact page could not be found.",
      path: `/${cityParam}/contact`,
    });
  }

  if (!cityHasFullContent(city.slug)) {
    return {
      ...createPageMetadata({
        title: `Contact Phoenix ${city.name} | Dispatch Number`,
        description: `Call Phoenix dispatch for ${city.name.toLowerCase()} fireplace, chimney, and WETT service routing while the full city contact page is being prepared.`,
        path: getCityHref(city.slug, "/contact"),
      }),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return createPageMetadata({
    title: `Contact Phoenix Chimney & Fireplace Services | ${city.name} Booking`,
    description:
      `Call, book online, or send a service request for fireplace repair, chimney work, and WETT inspections in ${city.name} and nearby communities.`,
    path: getCityHref(city.slug, "/contact"),
    keywords: [`contact fireplace repair ${city.name}`, `book chimney service ${city.name}`],
  });
}

export default async function CityContactPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    notFound();
  }

  if (!cityHasFullContent(city.slug)) {
    return <CityPlaceholderPage city={city} section="contact" />;
  }

  const siteSettings = getCitySettings(await getPublicSiteSettings(), city.slug);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: getCityHref(city.slug) },
          { name: "Contact", path: getCityHref(city.slug, "/contact") },
        ])}
      />

      <section className="section-pad">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading
                eyebrow="Contact Phoenix"
                title="Call, book online, or send the issue over and we will route it correctly."
                description="Share the issue, your timeline, and the best way to reach you. We will point the request to the right service and follow up with next steps."
              />
            </Reveal>
            <div className="grid gap-4">
              <ContactCard icon={<Phone className="h-5 w-5" />} label="Phone">
                <a href={`tel:${siteSettings.phoneHref}`}>{siteSettings.phoneDisplay}</a>
              </ContactCard>
              <ContactCard icon={<Mail className="h-5 w-5" />} label="Email">
                <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
              </ContactCard>
              <ContactCard icon={<Clock3 className="h-5 w-5" />} label="Office hours">
                {siteSettings.hoursLabel} · {siteSettings.hoursDetail}
              </ContactCard>
              <ContactCard icon={<CalendarDays className="h-5 w-5" />} label="Request service">
                <Link href={getRequestServiceHref(city.slug)}>Request Service</Link>
              </ContactCard>
              <ContactCard icon={<MapPinned className="h-5 w-5" />} label="Coverage">
                {siteSettings.serviceRadius}
              </ContactCard>
            </div>
          </div>

          <Reveal delay={120}>
            <ContactForm city={city.slug} settings={siteSettings} />
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="grid gap-0 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-5 p-8">
              <p className="eyebrow">Service map</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                {city.name}-focused, with surrounding communities covered as needed.
              </h2>
              <p className="text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                If you are unsure whether your area is covered, call first. The current service radius includes {city.name} plus nearby communities within roughly 100 kilometres.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {city.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <iframe
              src={siteSettings.mapEmbedUrl}
              title={`Service area map for ${city.name}`}
              className="min-h-[22rem] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}

type ContactCardProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
};

function ContactCard({ icon, label, children }: ContactCardProps) {
  return (
    <div className="rounded-[1.8rem] border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-4">
      <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
        {icon}
        {label}
      </p>
      <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{children}</div>
    </div>
  );
}
