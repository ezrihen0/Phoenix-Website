import { SEED_ARTICLES } from "../src/lib/cms/seed-articles";
import {
  getWeatherContentTagPriority,
  isPrecipOrMeltCondition,
  selectEligibleArticles,
} from "../src/lib/weather/content-tags";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const draftsAndScheduled = [
  ...SEED_ARTICLES,
  {
    status: "draft",
    scope: "general" as const,
    slug: "draft-cold-weather",
    title: "Draft cold weather",
    weatherTags: ["cold-weather"],
  },
  {
    status: "scheduled",
    scope: "general" as const,
    slug: "scheduled-maintenance",
    title: "Scheduled maintenance",
    weatherTags: ["maintenance"],
  },
  {
    status: "published",
    scope: "city" as const,
    city: "calgary",
    slug: "calgary-gas-startup",
    title: "Calgary gas startup",
    weatherTags: ["gas-startup"],
  },
];

assert(JSON.stringify(getWeatherContentTagPriority({ temperatureC: -16, condition: "Clear" })) === JSON.stringify(["cold-weather", "gas-startup"]), "<-15 tags");
assert(JSON.stringify(getWeatherContentTagPriority({ temperatureC: -15, condition: "Clear" })) === JSON.stringify(["gas-startup", "pre-winter"]), "-15 tags");
assert(JSON.stringify(getWeatherContentTagPriority({ temperatureC: -5, condition: "Clear" })) === JSON.stringify(["gas-startup", "pre-winter"]), "-5 tags");
assert(JSON.stringify(getWeatherContentTagPriority({ temperatureC: 0, condition: "Clear" })) === JSON.stringify(["freeze-thaw", "masonry"]), "0C tags");
assert(JSON.stringify(getWeatherContentTagPriority({ temperatureC: 5, condition: "Clear" })) === JSON.stringify(["freeze-thaw", "masonry"]), "5C tags");
assert(getWeatherContentTagPriority({ temperatureC: 7, condition: "Clear" }).length === 0, "+5 to +10 has no tag");
assert(getWeatherContentTagPriority({ temperatureC: 10, condition: "Clear" }).length === 0, "+10 has no tag");
assert(JSON.stringify(getWeatherContentTagPriority({ temperatureC: 10.1, condition: "Clear" })) === JSON.stringify(["maintenance"]), ">10 maintenance only");
assert(JSON.stringify(getWeatherContentTagPriority({ temperatureC: 18, condition: "Light Rain" })) === JSON.stringify(["chimney-leak", "snow-melt"]), "precip overrides temperature");
assert(isPrecipOrMeltCondition("Wet snow"), "wet snow is precip/melt");
assert(!isPrecipOrMeltCondition("Snow"), "dry snow is not precip/melt");
assert(!isPrecipOrMeltCondition("Snowshower"), "snowshower is not treated as rain");

const coldCandidates = selectEligibleArticles(draftsAndScheduled, "cold-weather", "calgary");
assert(coldCandidates.every((article) => article.status === "published"), "drafts cannot appear");
assert(!coldCandidates.some((article) => article.slug === "draft-cold-weather"), "draft slug excluded");
assert(coldCandidates.some((article) => article.slug === "gas-fireplace-not-turning-on"), "published cold-weather seed included");

const maintenanceCandidates = selectEligibleArticles(draftsAndScheduled, "maintenance", "edmonton");
assert(!maintenanceCandidates.some((article) => article.slug === "scheduled-maintenance"), "scheduled excluded");
assert(maintenanceCandidates.every((article) => article.slug !== "gas-fireplace-blower-not-working"), "blower stays untagged");

const gasCandidates = selectEligibleArticles(draftsAndScheduled, "gas-startup", "calgary");
assert(gasCandidates.length === 1 && gasCandidates[0]?.slug === "calgary-gas-startup", "city-scoped article wins");

const freezeCandidates = selectEligibleArticles(SEED_ARTICLES, "freeze-thaw", "calgary");
const masonryCandidates = selectEligibleArticles(SEED_ARTICLES, "masonry", "calgary");
const leakCandidates = selectEligibleArticles(SEED_ARTICLES, "chimney-leak", "calgary");
const meltCandidates = selectEligibleArticles(SEED_ARTICLES, "snow-melt", "calgary");
const rainCandidates = selectEligibleArticles(SEED_ARTICLES, "rain", "calgary");
assert(freezeCandidates.length === 0, "freeze-thaw empty until published");
assert(masonryCandidates.length === 0, "masonry empty until published");
assert(leakCandidates.length === 0, "chimney-leak empty until published");
assert(meltCandidates.length === 0, "snow-melt empty until published");
assert(rainCandidates.length === 0, "rain empty until published");

const blower = SEED_ARTICLES.find((article) => article.slug === "gas-fireplace-blower-not-working");
assert(!blower?.weatherTags?.length, "blower remains untagged");

console.log("weather-article-strip checks passed");
