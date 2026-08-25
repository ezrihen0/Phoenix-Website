import type { PublicSiteSettings } from "@/lib/cms/types";

export type PublicGoogleRating = {
  rating: number;
  reviewCount: number;
  url?: string;
};

export function getPublicGoogleRating(settings: PublicSiteSettings): PublicGoogleRating | null {
  // Owner-verified values only. Never fabricate 5.0 or a review count.
  const rating = settings.googleRating;
  const reviewCount = settings.googleReviewCount;

  if (typeof rating !== "number" || typeof reviewCount !== "number") {
    return null;
  }

  if (rating < 1 || rating > 5 || reviewCount < 1) {
    return null;
  }

  return {
    rating: Number(rating.toFixed(1)),
    reviewCount,
    url: settings.googleReviewsUrl?.trim() || process.env.GOOGLE_BUSINESS_PROFILE_URL?.trim() || undefined,
  };
}
