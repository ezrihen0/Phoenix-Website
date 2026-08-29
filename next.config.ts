import type { NextConfig } from "next";

/**
 * Legacy URL migration — owner-approved permanent redirects (301).
 * Source URLs are retired legacy pages; every destination is the final
 * canonical URL in the new architecture. No redirect chains. Legacy URLs
 * are NOT included in the sitemap (see app/sitemap.ts — canonical 15-URL set).
 * Installation URLs were deliberately retired (no redirect, return 404).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // ---- Market-wide service pages (consolidated) ----
      { source: "/services/gas-fireplace-maintenance", destination: "/services/gas-fireplace-repair", statusCode: 301 },
      { source: "/services/chimney-sweeping-inspection", destination: "/services/chimney-sweep", statusCode: 301 },
      { source: "/services/chimney-repair-masonry", destination: "/services/chimney-repair", statusCode: 301 },

      // ---- Market-wide index pages (temporary legacy handling) ----
      { source: "/services", destination: "/", statusCode: 301 },
      { source: "/articles", destination: "/", statusCode: 301 },

      // ---- City gas fireplace repair ----
      { source: "/calgary/gas-fireplace-repair", destination: "/services/gas-fireplace-repair", statusCode: 301 },
      { source: "/edmonton/gas-fireplace-repair", destination: "/services/gas-fireplace-repair", statusCode: 301 },
      { source: "/red-deer/gas-fireplace-repair", destination: "/services/gas-fireplace-repair", statusCode: 301 },

      // ---- City WETT ----
      { source: "/calgary/wett", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/edmonton/wett", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/red-deer/wett", destination: "/services/wett-inspection", statusCode: 301 },

      // ---- City service indexes ----
      { source: "/calgary/services", destination: "/calgary", statusCode: 301 },
      { source: "/edmonton/services", destination: "/edmonton", statusCode: 301 },
      { source: "/red-deer/services", destination: "/red-deer", statusCode: 301 },

      // ---- City service sub-pages (maintenance / sweep / repair) ----
      { source: "/calgary/services/gas-fireplace-maintenance", destination: "/services/gas-fireplace-repair", statusCode: 301 },
      { source: "/calgary/services/chimney-sweeping-inspection", destination: "/services/chimney-sweep", statusCode: 301 },
      { source: "/calgary/services/chimney-repair-masonry", destination: "/services/chimney-repair", statusCode: 301 },
      { source: "/edmonton/services/gas-fireplace-maintenance", destination: "/services/gas-fireplace-repair", statusCode: 301 },
      { source: "/edmonton/services/chimney-sweeping-inspection", destination: "/services/chimney-sweep", statusCode: 301 },
      { source: "/edmonton/services/chimney-repair-masonry", destination: "/services/chimney-repair", statusCode: 301 },
      { source: "/red-deer/services/gas-fireplace-maintenance", destination: "/services/gas-fireplace-repair", statusCode: 301 },
      { source: "/red-deer/services/chimney-sweeping-inspection", destination: "/services/chimney-sweep", statusCode: 301 },
      { source: "/red-deer/services/chimney-repair-masonry", destination: "/services/chimney-repair", statusCode: 301 },

      // ---- City contact ----
      { source: "/calgary/contact", destination: "/contact", statusCode: 301 },
      { source: "/edmonton/contact", destination: "/contact", statusCode: 301 },
      { source: "/red-deer/contact", destination: "/contact", statusCode: 301 },

      // ---- City about -> city hub ----
      { source: "/calgary/about", destination: "/calgary", statusCode: 301 },
      { source: "/edmonton/about", destination: "/edmonton", statusCode: 301 },
      { source: "/red-deer/about", destination: "/red-deer", statusCode: 301 },

      // ---- City article indexes -> city hub ----
      { source: "/calgary/articles", destination: "/calgary", statusCode: 301 },
      { source: "/edmonton/articles", destination: "/edmonton", statusCode: 301 },
      { source: "/red-deer/articles", destination: "/red-deer", statusCode: 301 },

      // ---- Articles — individual mappings ----
      { source: "/articles/gas-fireplace-not-turning-on", destination: "/articles/why-wont-my-gas-fireplace-turn-on", statusCode: 301 },
      { source: "/articles/chimney-not-swept-in-years", destination: "/services/chimney-sweep", statusCode: 301 },
      { source: "/articles/gas-fireplace-blower-not-working", destination: "/services/gas-fireplace-repair", statusCode: 301 },
      { source: "/articles/turning-on-your-gas-fireplace-before-winter", destination: "/articles/how-often-service-gas-fireplace-alberta", statusCode: 301 },
      { source: "/articles/buying-a-home-with-a-wood-burning-fireplace", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/articles/selling-a-home-with-a-wood-burning-fireplace", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/articles/did-your-insurer-ask-for-a-wett-inspection", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/articles/when-to-book-a-wett-inspection", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/articles/spring-fireplace-maintenance-checklist", destination: "/articles/how-often-service-gas-fireplace-alberta", statusCode: 301 },
      { source: "/calgary/articles/the-hidden-path-how-chimney-leaks-travel-and-why-the-source-isnt-always-obvious", destination: "/services/chimney-repair", statusCode: 301 },

      // ---- City article redirects — retargeted directly to final URLs (no chains) ----
      { source: "/calgary/articles/gas-fireplace-not-turning-on-calgary", destination: "/articles/why-wont-my-gas-fireplace-turn-on", statusCode: 301 },
      { source: "/edmonton/articles/gas-fireplace-not-turning-on-edmonton", destination: "/articles/why-wont-my-gas-fireplace-turn-on", statusCode: 301 },
      { source: "/red-deer/articles/gas-fireplace-not-turning-on-red-deer", destination: "/articles/why-wont-my-gas-fireplace-turn-on", statusCode: 301 },
      { source: "/calgary/articles/when-to-book-a-wett-inspection-in-calgary", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/edmonton/articles/when-to-book-a-wett-inspection-in-edmonton", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/red-deer/articles/when-to-book-a-wett-inspection-in-red-deer", destination: "/services/wett-inspection", statusCode: 301 },
      { source: "/calgary/articles/spring-fireplace-maintenance-checklist-calgary", destination: "/articles/how-often-service-gas-fireplace-alberta", statusCode: 301 },
      { source: "/edmonton/articles/spring-fireplace-maintenance-checklist-edmonton", destination: "/articles/how-often-service-gas-fireplace-alberta", statusCode: 301 },
      { source: "/red-deer/articles/spring-fireplace-maintenance-checklist-red-deer", destination: "/articles/how-often-service-gas-fireplace-alberta", statusCode: 301 },
    ];
  },
};

export default nextConfig;