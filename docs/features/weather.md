# Weather recommendations

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md) §15–18

## Provider

The Canadian weather source is Environment and Climate Change Canada through MSC GeoMet City Page Weather (`citypageweather-realtime`).

- Calgary → `ab-52`
- Edmonton → `ab-50`
- Red Deer → `ab-29`

Those GeoMet IDs live on the city registry (`ecccCitypageId`). After each fetch, Phoenix rejects the payload if the reported city name does not match the registry name.

No API key is required. Attribution in public UI:

**Weather data: Environment and Climate Change Canada**

If an official weather.gc.ca page URL is present, the reader link uses **Click here**. Never show a raw GeoMet or weather.gc.ca URL.

## Cache

Hourly weather cache may refresh (`/api/cron/refresh-weather`). Snapshots persist in `data/cms/weather.json` locally or `cms/weather.json` in Blob. Visitors do not call GeoMet on every page view.

If a city snapshot is missing (or has no ECCC source URL yet), the server may fill it once with a short timeout. If ECCC is slow or unavailable:

- the website remains operational
- previous snapshots are kept
- the city-page panel shows: **Current weather context is temporarily unavailable.**
- Phoenix never invents temperature, wind, humidity, or condition values

## Public UI

- **City-page panel** (`FireplaceConditionsPanel`): factual conditions plus Phoenix service context on Calgary, Edmonton, and Red Deer home pages. Reusable later on selected articles.
- **Header weather strip** (`WeatherBanner`): compact ECCC facts in the sticky header. Lives in the same 2rem slot as the previous compact strip. No second bar.

## Weather article strip

Content routing, not a forecast and not a risk score.

Flow: current ECCC snapshot → approved content tag → published Phoenix article → header CTA.

- Kill switch: `WEATHER_ARTICLE_STRIP_ENABLED` must be exactly `true`. Default is off.
- Tags live on CMS article metadata (`weatherTags`). Editors set them explicitly. The strip never infers tags from article text.
- Query path uses `listArticles()` (published only). Drafts and scheduled articles cannot appear.
- City-scoped published articles win over general Alberta articles for the same tag.
- If several published articles share a tag, the strip rotates by Alberta calendar day.
- If weather is missing, hide the strip. If no tagged published article matches the current rule, show weather facts only and no CTA.
- Precipitation/melt condition text takes priority over temperature bands. `+5°C` to `+10°C` has no content tag. Above `+10°C` uses `maintenance` only.

This strip does **not** enable `WEATHER_RULES`.

## Service context vs recommendation rules

The city-page panel derives **Phoenix service context** (masonry, leak, gas fireplace). It does **not** claim that ECCC provides a chimney or fireplace risk rating.

`WEATHER_RULES` stay disabled until the owner supplies validated thresholds:

- `WEATHER_RULES_ENABLED` stays unset/false in production
- each entry in `WEATHER_RULES` stays `enabled: false`
- stale snapshots must not show time-sensitive **recommendations**

Do **not** invent precipitation-mm or wind-kph cutoffs in code.

The panel may use the physical freeze point of water (`0°C`) only to label freeze vs thaw / cold-weather **service context**. That is not a masonry-damage score and must not be used to enable `WEATHER_RULES`.

When the owner supplies thresholds, enable only the specific rules that match those values, then set `WEATHER_RULES_ENABLED=true`.
