import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="page-frame">
        <div className="glass-panel rounded-[2.5rem] px-8 py-16 text-center sm:px-12">
          <p className="eyebrow">Page not found</p>
          <h1 className="display-title mt-5 text-5xl font-semibold leading-none text-[var(--color-ink)] sm:text-6xl">
            That page has gone cold.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            The route may have changed during the rebuild. Use the main navigation,
            go back home, or head straight to the services page.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
            >
              Back to home
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
            >
              Browse services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}