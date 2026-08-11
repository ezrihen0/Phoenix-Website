import { get, put } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const REMOTE_ARTICLES_KEY = "cms/articles.json";
const BASE_URL = process.env.STAGE3_BASE_URL || "http://localhost:3000";
const TEST_PREFIX = "stage3-scheduler-test-";
const CONCURRENT_PREFIX = "stage3-concurrent-";
const TEST_ID_DRAFT = `${TEST_PREFIX}draft`;
const TEST_ID_SCHEDULED_FUTURE = `${TEST_PREFIX}scheduled-future`;
const TEST_ID_SCHEDULED_DUE = `${TEST_PREFIX}scheduled-due`;
const TEST_ID_PUBLISHED = `${TEST_PREFIX}published`;

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(ROOT, ".env.local"), "utf8");

    for (const line of raw.split("\n")) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const index = trimmed.indexOf("=");

      if (index === -1) {
        continue;
      }

      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore missing env file
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function buildTestArticle({
  id,
  slug,
  status,
  scheduledAt,
  publishedAt = "",
  title,
  updatedAt,
  aiGenerated = false,
}) {
  const now = new Date().toISOString();

  return {
    id,
    city: "calgary",
    slug,
    title: title || `Stage 3 ${slug}`,
    excerpt: "Stage 3 scheduler integration test excerpt for Phoenix CMS validation.",
    body: `# Stage 3 test\n\nThis is a scheduler integration test article with enough markdown body content to satisfy publish validation rules for the Phoenix CMS.`,
    seoTitle: `Stage 3 ${slug} SEO title`,
    seoDescription: "Stage 3 scheduler integration test SEO description for Phoenix CMS validation.",
    keywords: ["stage3", "scheduler", "test"],
    relatedSlugs: [],
    relatedServiceSlugs: [],
    status,
    scheduledAt,
    authorName: "Phoenix Editorial Team",
    authorType: "organization",
    createdAt: now,
    updatedAt: updatedAt || now,
    publishedAt,
    aiGenerated,
  };
}

function assertIncludes(html, needle, message) {
  if (!html.includes(needle)) {
    throw new Error(message);
  }
}

async function saveArticleLikeAdmin(token, article) {
  const articles = await readArticles(token);
  const existingIndex = articles.findIndex((entry) => entry.id === article.id);
  const nextArticles = [...articles];

  if (existingIndex >= 0) {
    nextArticles.splice(existingIndex, 1, article);
  } else {
    nextArticles.push(article);
  }

  await writeArticles(token, nextArticles);
}

async function loginAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  assert(username && password, "ADMIN_USERNAME and ADMIN_PASSWORD are required for UI smoke tests.");

  const body = new URLSearchParams({ username, password });
  const response = await fetch(`${BASE_URL}/admin/login/submit`, {
    method: "POST",
    body,
    redirect: "manual",
  });
  const setCookie = response.headers.get("set-cookie");

  assert(setCookie, "Admin login did not return a session cookie.");

  return setCookie.split(";")[0];
}

async function fetchAdminPage(path, cookie) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Cookie: cookie },
  });

  return {
    status: response.status,
    html: await response.text(),
  };
}

async function runUiSmokeTests(token) {
  console.log("\nUI smoke — authenticated admin pages");

  const cookie = await loginAdmin();
  const uiScheduledId = `${TEST_PREFIX}ui-scheduled`;
  const future = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  const articles = await readArticles(token);
  const uiFixture = buildTestArticle({
    id: uiScheduledId,
    slug: `${TEST_PREFIX}ui-scheduled`,
    status: "scheduled",
    scheduledAt: future,
    title: "UI Smoke Scheduled Article",
  });

  await writeArticles(token, [
    ...articles.filter((article) => article.id !== uiScheduledId),
    uiFixture,
  ]);

  try {
    const newPage = await fetchAdminPage("/admin/articles/new", cookie);
    assert(newPage.status === 200, `/admin/articles/new returned ${newPage.status}`);
    assertIncludes(newPage.html, "Save draft", "New article page should expose Save draft.");
    assertIncludes(newPage.html, "Schedule publish", "New article page should expose Schedule publish.");
    assertIncludes(newPage.html, "Publish now", "New article page should expose Publish now.");

    const scheduledEditPage = await fetchAdminPage(`/admin/articles/${uiScheduledId}`, cookie);
    assert(
      scheduledEditPage.status === 200,
      `/admin/articles/${uiScheduledId} returned ${scheduledEditPage.status}`,
    );
    assertIncludes(
      scheduledEditPage.html,
      'type="date"',
      "Scheduled article edit page should expose publish date control.",
    );
    assertIncludes(
      scheduledEditPage.html,
      'type="time"',
      "Scheduled article edit page should expose publish time control.",
    );
    assertIncludes(
      scheduledEditPage.html,
      "Currently scheduled for",
      "Scheduled article edit page should show scheduled confirmation message.",
    );

    const publishPage = await fetchAdminPage("/admin/publish", cookie);
    assert(publishPage.status === 200, `/admin/publish returned ${publishPage.status}`);
    assertIncludes(publishPage.html, "Manual editor", "Publish workspace should expose manual editor entry.");
    assertIncludes(publishPage.html, "Continue", "Guided AI workflow should load on /admin/publish.");

    const listPage = await fetchAdminPage("/admin/articles", cookie);
    assert(listPage.status === 200, `/admin/articles returned ${listPage.status}`);
    assertIncludes(listPage.html, "Draft:", "Articles list should show draft summary count.");
    assertIncludes(listPage.html, "Scheduled:", "Articles list should show scheduled summary count.");
    assertIncludes(listPage.html, "Published:", "Articles list should show published summary count.");
    assertIncludes(listPage.html, "Next scheduled publication:", "Articles list should show next scheduled block.");
    assertIncludes(listPage.html, ">Draft<", "Articles list should expose Draft status filter.");
    assertIncludes(listPage.html, ">Scheduled<", "Articles list should expose Scheduled status filter.");
    assertIncludes(listPage.html, ">Published<", "Articles list should expose Published status filter.");
    assertIncludes(listPage.html, "UI Smoke Scheduled Article", "Articles list should show scheduled test article.");
    assertIncludes(listPage.html, "Scheduled", "Articles list should render Scheduled status badges.");

    console.log("UI smoke tests passed.");
  } finally {
    const latest = await readArticles(token);
    await writeArticles(
      token,
      latest.filter((article) => article.id !== uiScheduledId),
    );
  }
}

async function runConcurrentSaveTest(token, cronSecret) {
  console.log("\nConcurrent save — admin update during cron publish");

  const originalArticles = await readArticles(token);
  const withoutTests = originalArticles.filter(
    (article) =>
      !String(article.id).startsWith(TEST_PREFIX) &&
      !String(article.id).startsWith(CONCURRENT_PREFIX),
  );

  const past = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const baselineUpdatedAt = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const dueId = `${CONCURRENT_PREFIX}due`;
  const adminId = `${CONCURRENT_PREFIX}admin-target`;

  const dueArticle = buildTestArticle({
    id: dueId,
    slug: `${CONCURRENT_PREFIX}due`,
    status: "scheduled",
    scheduledAt: past,
    title: "Concurrent Cron Target",
    updatedAt: baselineUpdatedAt,
  });

  const adminArticle = buildTestArticle({
    id: adminId,
    slug: `${CONCURRENT_PREFIX}admin-target`,
    status: "draft",
    title: "Concurrent Admin Target Original",
    updatedAt: baselineUpdatedAt,
  });

  await writeArticles(token, [...withoutTests, dueArticle, adminArticle]);

  try {
    const adminUpdatedAt = new Date().toISOString();
    const adminUpdated = buildTestArticle({
      id: adminId,
      slug: `${CONCURRENT_PREFIX}admin-target`,
      status: "draft",
      title: "Concurrent Admin Target Updated During Cron",
      updatedAt: adminUpdatedAt,
    });

    const [cronResult] = await Promise.all([
      fetch(`${BASE_URL}/api/cron/publish-scheduled`, {
        headers: { Authorization: `Bearer ${cronSecret}` },
      }).then(async (response) => ({
        status: response.status,
        body: await response.json(),
      })),
      saveArticleLikeAdmin(token, adminUpdated),
    ]);

    assert(cronResult.status === 200, `Concurrent cron failed: ${JSON.stringify(cronResult.body)}`);
    assert(
      cronResult.body.published.some((entry) => entry.id === dueId),
      "Cron should publish the due scheduled article during concurrent admin save.",
    );

    const finalArticles = await readArticles(token);
    const finalDue = finalArticles.find((article) => article.id === dueId);
    const finalAdmin = finalArticles.find((article) => article.id === adminId);

    assert(finalDue?.status === "published", "Due article should remain published after concurrent save.");
    assert(Boolean(finalDue?.publishedAt), "Due article should keep publishedAt after concurrent save.");
    assert(
      finalAdmin?.title === "Concurrent Admin Target Updated During Cron",
      "Admin-updated article title should survive concurrent cron publish.",
    );
    assert(
      finalAdmin?.updatedAt === adminUpdatedAt,
      "Admin-updated article updatedAt should survive concurrent cron publish.",
    );
    assert(finalAdmin?.status === "draft", "Admin-updated article should remain a draft.");

    console.log("Concurrent save test passed.");
  } finally {
    const latest = await readArticles(token);
    const cleaned = latest.filter((article) => !String(article.id).startsWith(CONCURRENT_PREFIX));
    await writeArticles(token, cleaned);
    console.log("Cleaned up concurrent test articles from CMS storage.");
  }
}

async function readArticles(token) {
  const blob = await get(REMOTE_ARTICLES_KEY, {
    access: "private",
    token,
    useCache: false,
  });

  if (!blob?.stream) {
    return [];
  }

  return JSON.parse(await new Response(blob.stream).text());
}

async function writeArticles(token, articles) {
  await put(REMOTE_ARTICLES_KEY, JSON.stringify(articles, null, 2), {
    access: "private",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });
}

async function fetchText(path) {
  const response = await fetch(`${BASE_URL}${path}`);

  return {
    status: response.status,
    text: await response.text(),
  };
}

async function main() {
  loadEnvLocal();

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const cronSecret = process.env.CRON_SECRET?.trim();

  assert(token, "BLOB_READ_WRITE_TOKEN is required for Stage 3 integration tests.");
  assert(cronSecret, "CRON_SECRET is required for Stage 3 integration tests.");

  const originalArticles = await readArticles(token);
  const withoutTests = originalArticles.filter((article) => !String(article.id).startsWith(TEST_PREFIX));

  const past = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const fixtures = [
    buildTestArticle({
      id: TEST_ID_DRAFT,
      slug: `${TEST_PREFIX}draft`,
      status: "draft",
    }),
    buildTestArticle({
      id: TEST_ID_SCHEDULED_FUTURE,
      slug: `${TEST_PREFIX}scheduled-future`,
      status: "scheduled",
      scheduledAt: future,
    }),
    buildTestArticle({
      id: TEST_ID_SCHEDULED_DUE,
      slug: `${TEST_PREFIX}scheduled-due`,
      status: "scheduled",
      scheduledAt: past,
    }),
    buildTestArticle({
      id: TEST_ID_PUBLISHED,
      slug: `${TEST_PREFIX}published`,
      status: "published",
      publishedAt: new Date().toISOString(),
    }),
  ];

  await writeArticles(token, [...withoutTests, ...fixtures]);

  try {
    console.log("Test 1 — Draft / Scheduled hidden from public surfaces");

    const draftPage = await fetchText(`/calgary/articles/${TEST_PREFIX}draft`);
    assert(draftPage.status === 404, "Draft article page should return 404.");

    const futurePage = await fetchText(`/calgary/articles/${TEST_PREFIX}scheduled-future`);
    assert(futurePage.status === 404, "Future scheduled article page should return 404.");

    const articlesIndex = await fetchText("/calgary/articles");
    assert(!articlesIndex.text.includes(`${TEST_PREFIX}draft`), "Draft should not appear in article index.");
    assert(
      !articlesIndex.text.includes(`${TEST_PREFIX}scheduled-future`),
      "Future scheduled article should not appear in article index.",
    );

    const sitemap = await fetchText("/sitemap.xml");
    assert(!sitemap.text.includes(`${TEST_PREFIX}draft`), "Draft should not appear in sitemap.");
    assert(
      !sitemap.text.includes(`${TEST_PREFIX}scheduled-future`),
      "Future scheduled article should not appear in sitemap.",
    );

    const feed = await fetchText("/feed.xml");
    assert(!feed.text.includes(`${TEST_PREFIX}draft`), "Draft should not appear in RSS feed.");

    console.log("Test 2 — Publish Now / existing published article");

    const publishedPage = await fetchText(`/calgary/articles/${TEST_PREFIX}published`);
    assert(publishedPage.status === 200, "Published article page should return 200.");
    assert(
      sitemap.text.includes(`${TEST_PREFIX}published`) || (await fetchText("/sitemap.xml")).text.includes(`${TEST_PREFIX}published`),
      "Published article should appear in sitemap.",
    );

    console.log("Test 3 — Scheduled article auto-publish via cron");

    const unauthorizedCron = await fetch(`${BASE_URL}/api/cron/publish-scheduled`);
    assert(unauthorizedCron.status === 401, "Cron route should reject unauthorized requests.");

    const cronResponse = await fetch(`${BASE_URL}/api/cron/publish-scheduled`, {
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    });
    const cronJson = await cronResponse.json();

    assert(cronResponse.status === 200, `Cron route failed: ${JSON.stringify(cronJson)}`);
    assert(cronJson.ok === true, "Cron route should return ok=true.");
    assert(
      cronJson.published.some((entry) => entry.id === TEST_ID_SCHEDULED_DUE),
      "Due scheduled article should be published by cron.",
    );

    const duePage = await fetchText(`/calgary/articles/${TEST_PREFIX}scheduled-due`);
    assert(duePage.status === 200, "Due scheduled article should be public after cron.");

    const dueStillHiddenFuture = await fetchText(`/calgary/articles/${TEST_PREFIX}scheduled-future`);
    assert(dueStillHiddenFuture.status === 404, "Future scheduled article should remain hidden after cron.");

    const storedAfterCron = await readArticles(token);
    const dueRecord = storedAfterCron.find((article) => article.id === TEST_ID_SCHEDULED_DUE);
    assert(dueRecord?.status === "published", "Due scheduled article status should be published in storage.");
    assert(Boolean(dueRecord?.publishedAt), "Due scheduled article should have publishedAt in storage.");
    assert(!dueRecord?.scheduledAt, "Due scheduled article should clear scheduledAt after publish.");

    console.log("Test 4 — CREATE WITH AI uses same publishing engine");

    const aiFixture = buildTestArticle({
      id: `${TEST_PREFIX}ai-scheduled`,
      slug: `${TEST_PREFIX}ai-scheduled`,
      status: "scheduled",
      scheduledAt: future,
    });
    aiFixture.aiGenerated = true;

    await writeArticles(token, [...storedAfterCron.filter((article) => article.id !== aiFixture.id), aiFixture]);

    const aiHidden = await fetchText(`/calgary/articles/${TEST_PREFIX}ai-scheduled`);
    assert(aiHidden.status === 404, "AI-scheduled article should follow the same public hiding rules.");

    console.log("Regression — seed / existing published articles still resolve");

    const seedPage = await fetchText("/calgary/articles/spring-fireplace-maintenance-checklist-calgary");
    assert(seedPage.status === 200, "Existing seed article should still resolve.");

    console.log("\nStage 3 scheduler tests passed.");

    await runConcurrentSaveTest(token, cronSecret);
    await runUiSmokeTests(token);
  } finally {
    const latest = await readArticles(token);
    const cleaned = latest.filter((article) => !String(article.id).startsWith(TEST_PREFIX));
    await writeArticles(token, cleaned);
    console.log("Cleaned up Stage 3 test articles from CMS storage.");
  }
}

main().catch((error) => {
  console.error("\nStage 3 scheduler tests failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
