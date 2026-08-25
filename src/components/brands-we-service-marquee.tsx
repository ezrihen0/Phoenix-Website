const BRANDS_WE_SERVICE = [
  "Napoleon",
  "Heat & Glo",
  "Majestic",
  "Valor",
  "Regency",
  "Mendota",
  "Kozy Heat",
  "Enviro",
  "Montigo",
  "Kingsman",
] as const;

function BrandSequence({ duplicateKey }: { duplicateKey: string }) {
  return (
    <ul className="city-brand-marquee-sequence">
      {BRANDS_WE_SERVICE.map((brand) => (
        <li key={`${duplicateKey}-${brand}`}>
          <span>{brand}</span>
          <span className="city-brand-marquee-dot" aria-hidden="true">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export function BrandsWeServiceMarquee() {
  return (
    <section className="city-brand-marquee" aria-label="Brands we service">
      <p className="city-brand-marquee-heading">Brands We Service</p>
      <p className="sr-only">{BRANDS_WE_SERVICE.join(", ")}</p>
      <div className="city-brand-marquee-viewport">
        <div className="city-brand-marquee-track" aria-hidden="true">
          <BrandSequence duplicateKey="a" />
          <BrandSequence duplicateKey="b" />
        </div>
        <ul className="city-brand-marquee-static">
          {BRANDS_WE_SERVICE.map((brand, index) => (
            <li key={brand}>
              <span>{brand}</span>
              {index < BRANDS_WE_SERVICE.length - 1 ? (
                <span className="city-brand-marquee-dot" aria-hidden="true">
                  ·
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
