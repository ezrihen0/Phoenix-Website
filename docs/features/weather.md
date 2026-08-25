# Weather recommendations

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md) §17

Hourly weather cache may refresh (`/api/cron/refresh-weather`). The public banner stays off until the owner supplies validated thresholds.

Do **not** invent temperature, wind, or precipitation cutoffs in code.

Until that validation exists:

- `WEATHER_RULES_ENABLED` stays unset/false in production
- each entry in `WEATHER_RULES` stays `enabled: false`
- the site must keep working if the weather provider fails
- stale snapshots must not show time-sensitive recommendations

When the owner supplies thresholds, enable only the specific rules that match those values, then set `WEATHER_RULES_ENABLED=true`.
