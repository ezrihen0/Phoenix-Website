import { Reveal } from "@/components/motion/reveal";
import { CityChooserGpsPrompt } from "@/components/homepage/city-chooser-gps-prompt";
import { CityImageCard } from "@/components/homepage/city-image-card";
import { getCityChooserCards } from "@/lib/city-chooser-cards";

export function CityChooserHero() {
  const cityCards = getCityChooserCards();

  return (
    <section className="pb-6 pt-3 sm:pb-8 sm:pt-4 lg:pb-10">
      <div className="page-bleed space-y-6 lg:space-y-8">
        <Reveal>
          <div className="page-frame max-w-3xl space-y-4">
            <h1 className="display-title text-balance text-4xl font-semibold leading-[0.94] text-[var(--color-ink)] sm:text-5xl lg:text-[3.25rem]">
              Fireplace &amp; Chimney Services Across Alberta
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
              Choose your city to view local services, service areas and contact information.
            </p>
          </div>
        </Reveal>

        <div className="page-frame space-y-4">
          <Reveal delay={60}>
            <CityChooserGpsPrompt />
          </Reveal>

          <div className="group/grid grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cityCards.map((card, index) => (
              <Reveal key={card.slug} delay={100 + index * 70}>
                <CityImageCard card={card} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
