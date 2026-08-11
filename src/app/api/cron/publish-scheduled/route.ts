import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { CITY_SLUGS, getCityHref, type CitySlug } from "@/lib/cities";
import { publishDueScheduledArticles } from "@/lib/cms/storage";
import { getServiceLandingHref, serviceLandingPages } from "@/lib/site-data";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  return authorization === `Bearer ${cronSecret}`;
}

function revalidatePublishedArticles(articleRoutes: Array<{ city: CitySlug; slug: string }> = []) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  for (const city of CITY_SLUGS) {
    revalidatePath(getCityHref(city));
    revalidatePath(getCityHref(city, "/about"));
    revalidatePath(getCityHref(city, "/contact"));
    revalidatePath(getCityHref(city, "/services"));
    revalidatePath(getCityHref(city, "/wett"));
    revalidatePath(getCityHref(city, "/articles"));
  }

  revalidatePath("/services");
  revalidatePath("/wett");
  revalidatePath("/about");
  revalidatePath("/contact");

  for (const servicePage of serviceLandingPages) {
    revalidatePath(getServiceLandingHref(servicePage.slug));

    for (const city of CITY_SLUGS) {
      revalidatePath(getServiceLandingHref(servicePage.slug, city));
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/publish");

  for (const route of articleRoutes) {
    revalidatePath(getCityHref(route.city, `/articles/${route.slug}`));
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await publishDueScheduledArticles();

    if (result.published.length > 0) {
      revalidatePublishedArticles(
        result.published.map((article) => ({
          city: article.city,
          slug: article.slug,
        })),
      );
    }

    return NextResponse.json({
      ok: true,
      publishedCount: result.published.length,
      skippedCount: result.skipped.length,
      published: result.published.map((article) => ({
        id: article.id,
        slug: article.slug,
        city: article.city,
        publishedAt: article.publishedAt,
      })),
      skipped: result.skipped,
    });
  } catch (error) {
    console.error("[cron-publish-scheduled] Failed", error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
