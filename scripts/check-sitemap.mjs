#!/usr/bin/env node
/**
 * Sitemap validation check for Phoenix SEO hardening.
 *
 * Fails (exit 1) if any sitemap URL:
 *   - returns a non-200 status
 *   - redirects (3xx, no follow)
 *   - is marked noindex
 *   - has a conflicting or missing canonical
 *
 * Usage:
 *   npm run check:sitemap
 *   node scripts/check-sitemap.mjs --sitemap http://localhost:3000/sitemap.xml --base http://localhost:3000
 *   SITEMAP_URL=https://phoenixfireplace.ca/sitemap.xml npm run check:sitemap
 *   SITE_BASE=https://phoenixfireplace.ca npm run check:sitemap
 */
const args = process.argv.slice(2);
function argValue(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}
const SITEMAP_URL = argValue("sitemap") || process.env.SITEMAP_URL || "https://phoenixfireplace.ca/sitemap.xml";
const SITE_BASE = argValue("base") || process.env.SITE_BASE || "https://phoenixfireplace.ca";
// --host <origin> : fetch each sitemap page from this origin instead of the
// sitemap's own host. Useful for pre-deploy QA against a local build
// (e.g. --host http://localhost:3000).
const CHECK_HOST = argValue("host");

const stats = {
  total: 0,
  ok: 0,
  redirects: 0,
  notFound: 0,
  noindex: 0,
  canonicalConflicts: 0,
  errors: 0,
};
const problems = [];

function getUrl(path) {
  // <loc> entries may be absolute URLs — use them as-is.
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : "/" + path;
  return new URL(clean, SITE_BASE).toString();
}

function pageUrl(loc) {
  if (!CHECK_HOST) return getUrl(loc);
  // Rewrite only the origin so a local build can be validated pre-deploy.
  const u = new URL(getUrl(loc));
  const h = new URL(CHECK_HOST);
  u.protocol = h.protocol;
  u.host = h.host;
  return u.toString();
}

async function fetchUrl(url) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "PhoenixSitemapChecker/1.0" },
  });
  const status = res.status;
  const location = res.headers.get("location");
  const html = status >= 200 && status < 300 ? await res.text() : "";
  return { status, location, html };
}

function hasNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]*>/i.test(html) && /noindex/i.test(html);
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return null;
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

function normalize(u) {
  try {
    const url = new URL(u, SITE_BASE);
    let p = url.pathname;
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p || "/";
  } catch {
    return u;
  }
}

async function main() {
  let res;
  try {
    res = await fetch(SITEMAP_URL, { headers: { "user-agent": "PhoenixSitemapChecker/1.0" } });
  } catch (e) {
    console.error(`[FAIL] Could not reach sitemap at ${SITEMAP_URL}: ${e.message}`);
    console.error("  (Is production deployed? For a local check use:");
    console.error("   node scripts/check-sitemap.mjs --sitemap http://localhost:3000/sitemap.xml --base http://localhost:3000 --host http://localhost:3000)");
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`[FAIL] Could not fetch sitemap at ${SITEMAP_URL} (HTTP ${res.status})`);
    process.exit(1);
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  stats.total = locs.length;

  for (const loc of locs) {
    const url = pageUrl(loc);
    let r;
    try {
      r = await fetchUrl(url);
    } catch (e) {
      stats.errors++;
      problems.push(`[ERROR] ${url} — ${e.message}`);
      continue;
    }

    if (r.status >= 300 && r.status < 400) {
      stats.redirects++;
      problems.push(`[REDIRECT] ${url} -> ${r.status} ${r.location || ""}`);
      continue;
    }
    if (r.status === 404) {
      stats.notFound++;
      problems.push(`[404] ${url}`);
      continue;
    }
    if (r.status !== 200) {
      stats.errors++;
      problems.push(`[HTTP ${r.status}] ${url}`);
      continue;
    }

    stats.ok++;
    if (hasNoindex(r.html)) {
      stats.noindex++;
      problems.push(`[NOINDEX] ${url}`);
    }
    const canonical = extractCanonical(r.html);
    if (canonical && normalize(canonical) === normalize(url)) {
      // canonical matches self — all good
    } else if (canonical) {
      stats.canonicalConflicts++;
      problems.push(`[CANONICAL CONFLICT] ${url} → canonical "${canonical}"`);
    } else {
      stats.canonicalConflicts++;
      problems.push(`[NO CANONICAL] ${url}`);
    }
  }

  console.log(`\nSitemap validation - ${SITEMAP_URL}`);
  console.log(`Total URLs:          ${stats.total}`);
  console.log(`200 OK:              ${stats.ok}`);
  console.log(`Redirects (3xx):     ${stats.redirects}`);
  console.log(`404:                 ${stats.notFound}`);
  console.log(`Noindex:             ${stats.noindex}`);
  console.log(`Canonical conflicts: ${stats.canonicalConflicts}`);
  console.log(`Other errors:        ${stats.errors}`);

  if (problems.length) {
    console.log("\nProblems:");
    for (const p of problems) console.log("  " + p);
    console.log("\n[FAIL] RELEASE GATE FAILED (redirects / 404 / noindex / canonical conflicts must be 0)");
    process.exit(1);
  }
  console.log("\n[OK] RELEASE GATE PASSED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
