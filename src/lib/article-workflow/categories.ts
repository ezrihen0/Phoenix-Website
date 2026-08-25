import type { CitySlug } from "@/lib/cities";

export type ArticleCategoryId =
  | "chimney-leaks"
  | "masonry"
  | "chimney-crown"
  | "flashing"
  | "wood-fireplace"
  | "gas-fireplace"
  | "wett-inspection"
  | "fireplace-troubleshooting";

export type ArticleCategory = {
  id: ArticleCategoryId;
  label: string;
  description: string;
  relatedServiceSlug?: string;
};

export const articleCategories: ArticleCategory[] = [
  {
    id: "chimney-leaks",
    label: "Chimney leaks",
    description: "Water entry, attic staining, and leak diagnosis.",
    relatedServiceSlug: "chimney-repair-masonry",
  },
  {
    id: "masonry",
    label: "Masonry",
    description: "Brick, stone, mortar, and chimney structure issues.",
    relatedServiceSlug: "chimney-repair-masonry",
  },
  {
    id: "chimney-crown",
    label: "Chimney crown",
    description: "Crown cracks, deterioration, and water protection.",
    relatedServiceSlug: "chimney-repair-masonry",
  },
  {
    id: "flashing",
    label: "Flashing",
    description: "Roof-to-chimney flashing and related leak paths.",
    relatedServiceSlug: "chimney-repair-masonry",
  },
  {
    id: "wood-fireplace",
    label: "Wood fireplace",
    description: "Wood-burning systems, drafting, and upkeep.",
    relatedServiceSlug: "chimney-sweeping-inspection",
  },
  {
    id: "gas-fireplace",
    label: "Gas fireplace",
    description: "Gas appliance troubleshooting and maintenance.",
    relatedServiceSlug: "gas-fireplace-repair",
  },
  {
    id: "wett-inspection",
    label: "WETT / inspection",
    description: "Inspections, reporting, and compliance guidance.",
    relatedServiceSlug: "wett-inspections",
  },
  {
    id: "fireplace-troubleshooting",
    label: "Fireplace troubleshooting",
    description: "General diagnosis and homeowner decision guidance.",
    relatedServiceSlug: "gas-fireplace-repair",
  },
];

const cityCategoryRules: Partial<Record<CitySlug, ArticleCategoryId[]>> = {
  // Empty restrictions mean all categories are available for every city in V1.
};

export function getArticleCategoryById(categoryId: string) {
  return articleCategories.find((category) => category.id === categoryId);
}

export function getArticleCategoriesForCity(city: CitySlug) {
  const allowed = cityCategoryRules[city];

  if (!allowed || allowed.length === 0) {
    return articleCategories;
  }

  return articleCategories.filter((category) => allowed.includes(category.id));
}
