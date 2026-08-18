/**
 * Audit sitemap URLs for SEO health.
 *
 * Usage:
 *   node scripts/audit-sitemap.mjs
 *   SITEMAP_AUDIT_BASE_URL=http://localhost:3000 node scripts/audit-sitemap.mjs
 *   node scripts/audit-sitemap.mjs --sample-canonicals
 */

const BASE_URL = (process.env.SITEMAP_AUDIT_BASE_URL || "https://phoenixfireplace.ca").replace(/\/$/, "");
const SAMPLE_CANONICALS = process.argv.includes("--sample-canonicals");

const SAMPLE_PATHS = [
  "/",
  "/calgary",
  "/edmonton",
  "/red-deer",
  "/calgary/gas-fireplace-repair",
  "/calgary/wett",
  "/calgary/services/chimney-sweeping-inspection",
];

function parseLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function normalizeComparableUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    let pathname = parsed.pathname;

    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    parsed.pathname = pathname || "/";
    return parsed.toString();
  } catch {
    return url;
  }
}

function extractMeta(html, name) {
  const patterns = [
    new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']`, "i"),
    new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function hasNoindex(html, headers) {
  const robotsHeader = headers.get("x-robots-tag") || "";
  if (/noindex/i.test(robotsHeader)) {
    return true;
  }

  const robotsMeta = extractMeta(html, "robots");
  return Boolean(robotsMeta && /noindex/i.test(robotsMeta));
}

async function fetchWithRedirects(url, maxRedirects = 5) {
  const chain = [];
  let current = url;

  for (let index = 0; index <= maxRedirects; index += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      headers: { "User-Agent": "PhoenixSitemapAudit/1.0" },
    });

    chain.push({ url: current, status: response.status });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return { chain, response, finalUrl: current };
      }

      current = new URL(location, current).toString();
      continue;
    }

    const html = await response.text();
    return { chain, response, finalUrl: current, html };
  }

  throw new Error(`Redirect chain exceeded ${maxRedirects} hops for ${url}`);
}

async function auditUrl(url) {
  const result = await fetchWithRedirects(url);
  const { chain, response, finalUrl, html = "" } = result;
  const status = chain[chain.length - 1]?.status ?? response.status;
  const redirected = chain.length > 1;
  const canonical = html ? extractMeta(html, "canonical") : null;
  const noindex = html ? hasNoindex(html, response.headers) : false;

  const issues = [];
  if (status !== 200) {
    issues.push(`status ${status}`);
  }
  if (redirected) {
    issues.push(`redirect chain (${chain.length - 1} hop(s))`);
  }
  if (noindex) {
    issues.push("noindex");
  }
  if (canonical) {
    const canonicalComparable = normalizeComparableUrl(canonical);
    const urlComparable = normalizeComparableUrl(url);
    const finalComparable = normalizeComparableUrl(finalUrl);
    const auditOrigin = new URL(url).origin;
    const canonicalOrigin = new URL(canonical).origin;

    if (auditOrigin === canonicalOrigin) {
      if (canonicalComparable !== urlComparable && canonicalComparable !== finalComparable) {
        issues.push(`canonical mismatch (${canonical})`);
      }
    } else if (new URL(url).pathname !== new URL(canonical).pathname) {
      issues.push(`canonical path mismatch (${canonical})`);
    }
  }

  return {
    url,
    finalUrl,
    status,
    redirected,
    redirectHops: chain.length - 1,
    noindex,
    canonical,
    issues,
  };
}

async function main() {
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;
  console.log(`Auditing sitemap: ${sitemapUrl}`);

  const sitemapResponse = await fetch(sitemapUrl);
  if (!sitemapResponse.ok) {
    console.error(`Failed to fetch sitemap: ${sitemapResponse.status}`);
    process.exit(1);
  }

  const sitemapXml = await sitemapResponse.text();
  const locs = parseLocs(sitemapXml);
  console.log(`Found ${locs.length} URLs in sitemap\n`);

  const results = [];
  for (const loc of locs) {
    const result = await auditUrl(loc);
    results.push(result);
    const flag = result.issues.length ? "FAIL" : "OK";
    console.log(`${flag} ${loc}`);
    if (result.issues.length) {
      for (const issue of result.issues) {
        console.log(`     - ${issue}`);
      }
    }
  }

  const failures = results.filter((result) => result.issues.length > 0);
  const redirectFailures = results.filter((result) => result.redirected);
  const noindexFailures = results.filter((result) => result.noindex);
  const non200 = results.filter((result) => result.status !== 200);

  console.log("\n--- Summary ---");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Sitemap URLs: ${locs.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Non-200: ${non200.length}`);
  console.log(`Redirects: ${redirectFailures.length}`);
  console.log(`Noindex: ${noindexFailures.length}`);

  if (SAMPLE_CANONICALS) {
    console.log("\n--- Sample canonical checks ---");
    for (const path of SAMPLE_PATHS) {
      const url = `${BASE_URL}${path}`;
      const result = await auditUrl(url);
      const flag = result.issues.length ? "FAIL" : "OK";
      console.log(`${flag} ${url}`);
      if (result.canonical) {
        console.log(`     canonical: ${result.canonical}`);
      }
      for (const issue of result.issues) {
        console.log(`     - ${issue}`);
      }
    }
  }

  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
