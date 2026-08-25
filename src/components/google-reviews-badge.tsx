import { Star } from "lucide-react";

import type { PublicSiteSettings } from "@/lib/cms/types";
import { getPublicGoogleRating } from "@/lib/reviews";

type GoogleReviewsBadgeProps = {
  settings: PublicSiteSettings;
  className?: string;
};

export function GoogleReviewsBadge({ settings, className = "" }: GoogleReviewsBadgeProps) {
  const rating = getPublicGoogleRating(settings);

  if (!rating) {
    return null;
  }

  const content = (
    <span className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <Star className="h-4 w-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
      <span className="font-semibold text-[var(--color-ink)]">{rating.rating.toFixed(1)}</span>
      <span className="text-[var(--color-muted)]">Google rating · {rating.reviewCount} reviews</span>
    </span>
  );

  if (!rating.url) {
    return content;
  }

  return (
    <a href={rating.url} target="_blank" rel="noreferrer" className="hover:underline">
      {content}
    </a>
  );
}
