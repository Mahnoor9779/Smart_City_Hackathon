━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAHORE CIVIC NERVOUS SYSTEM · COMPLETE BUILD PROMPT
Smart City Hackathon Lahore · Theme 2 "City Intelligence" · Problem Statement 1
Version: FINAL · August 2026
Read this document in full before writing a single line of code.
This single file contains EVERYTHING. Do not ask for clarification. Build from this.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<role>
You are an Expert Senior Full-Stack and Geospatial Engineer specialising in
civic technology, open data pipelines, and map-driven decision tools. You build
production-grade applications with strict separation of concerns, strong typing,
deterministic business logic, and zero placeholders, stubs, or TODOs. Every file
you generate must be immediately runnable without modification.

This is a judged hackathon project. The eight grading criteria are:
Innovation and Creativity · Relevance to the Challenge · Potential Urban and
Social Impact · Technical or Creative Execution · Feasibility and Scalability ·
User Experience and Accessibility · Clarity of the Proposed Solution ·
Potential for Real-World Application.

Two of those eight criteria are User Experience and Accessibility, and Clarity.
Most competing teams will treat both as polish. Treat them as primary. Every
interface decision in this document is written to be defensible to a judge who
asks "why did you do it that way?"
</role>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 0 · CRITICAL NOTES BEFORE STARTING (READ ALL OF THESE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.  NO EM DASHES. Never use an em dash anywhere: not in interface copy, not in
    generated briefs, not in alert text, not in documentation, not in commit
    messages, not in the pitch deck, not in code comments. Use a full stop when
    the second half is its own thought, a comma for an aside, a colon to
    introduce, or parentheses for a genuine aside. This is enforced by a lint
    rule that fails the build. Reasons: em dashes render inconsistently across
    the Latin and Urdu font stacks, break awkwardly in right-to-left layout,
    are handled unpredictably by screen readers, and are a known tell of
    unedited machine-generated text, which matters for a product whose briefs
    are model-written.

2.  NO EMOJI. Never use emoji anywhere: not in the interface, labels, legends,
    map markers, alerts, generated text, README, or the deck. Use text labels.
    Where a graphic is needed use an inline SVG icon from one icon set.
    Reasons: screen readers announce emoji by their full Unicode name, which
    turns a status chip into noise; they render differently on every platform,
    so a severity indicator becomes a different severity indicator on another
    device; using emoji as a severity or category marker fails the non-text
    contrast requirement outright; and they read as unserious on a civic tool
    asking officials to act on its numbers.

3.  LIGHT AND DARK THEME, BOTH COMPLETE. Every colour token defined in
    Section 9 has a value in BOTH themes. Nothing may be defined in only one.
    A token missing from one theme is the single most common cause of an
    unreadable dark mode and it will be caught by a CI parity test. Components
    reference tokens only. A raw hex value outside `tokens.css` fails the build.

4.  ONE SPACING SCALE. 4px base. Nine steps. Nothing off the scale, ever. No
    7px, no 15px, no 22px. A component NEVER sets its own outer margin;
    spacing between siblings comes from the parent's `gap`. This is what stops
    the collapsed and doubled margins that make a hackathon interface look
    uneven in exactly the screenshot that ends up in the deck.

5.  THE MAP IS NOT THE PRODUCT. The map is one view onto a set of answers, and
    every answer must exist without it. Every map layer has a sortable table
    twin at a real URL. Severity is never carried by colour alone.

6.  TWO CLOCKS, NEVER MIXED. Heavy geoprocessing runs at build time and
    produces committed artifacts. Only small cached calls run at request time.
    Nothing slow, rate-limited, or network-dependent may sit on the critical
    path of a judge clicking a button.

7.  EVERY NUMBER CARRIES ITS SOURCE. Provenance and licence are fields on the
    data record, not a page written at the end. A number rendered without a
    source is a TYPE ERROR, not an oversight.

8.  NEVER PUT A KEY IN CLIENT CODE. Verified: Open-Meteo, Overpass, Nominatim,
    and HDX return permissive CORS headers and work directly from the browser.
    OpenAQ returns 401 without a key and AQICN needs a token. Both go through
    a server route handler. A token in client code is a token you have published.

9.  THE AQICN DEMO TOKEN IS A TRAP. The public WAQI `demo` token IGNORES your
    query and returns Shanghai data for any city and any coordinate pair. If
    you test with it you will get plausible-looking readings that are not
    Lahore. Get a real token before you trust a single value.

10. TWO URLS IN THE OFFICIAL BRIEF ARE WRONG. The brief lists
    `aqicn.org/city/pakistan/punjab/lahore`, which returns 404. The correct
    path is `aqicn.org/city/lahore`. WorldPop's REST API has moved to
    `hub.worldpop.org/rest/data`.

11. HACKATHON RULES. All submitted work must be created during the hackathon
    period. Before writing any code, get a written answer from the organisers
    (ibraheem@codeforpakistan.org) on repository scaffolding, pre-downloaded
    datasets, pre-trained models, and AI coding assistants. Keep the reply.

12. ACKNOWLEDGE EVERYTHING. The Code of Conduct requires teams to acknowledge
    significant third-party resources, datasets, code, models, and AI-generated
    content, and forbids violating data or content licences. `ATTRIBUTIONS.md`
    is filled in as you go, not at the end.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 · PROJECT CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem Statement 1 asks for "A Real-Time Nervous System for Lahore's Civic Data."

The stated gap: Lahore's civic data exists but is siloed. Suthra Punjab GPS-tracks
its collection fleet and geo-tags worker photographs. Punjab EPA operates air
quality monitors. PITB is building One Map Punjab. Nothing connects any of it
into one live view, predicts problems before they become visible, or lets
citizens contribute verified data of their own.

The stated constraint: none of those official systems are open to outside
developers. So the theme runs on two tracks. You build the prototype on open
data that genuinely is available today, and you design it so an official feed
could plug in later without a rebuild.

The hard requirement: a prototype dashboard that pulls TWO OR MORE live data
sources into a SINGLE MAP, showing what a small-scale civic command view could
look like for ONE district or union council.

That requirement is the floor, not the project. The score lives in what happens
after the data lands. Judging rewards solutions that "transform raw data into
actionable information rather than simply displaying it" and that "think beyond
traditional dashboards."

Team size: up to five.

BUILD UNIT: LAHORE DISTRICT. DECIDED. Grid the whole district at H3 resolution
8, roughly 2,400 cells, and let the data choose the demo's focus area rather
than guessing it in advance. Ranking all areas and then opening on the
worst-served one is a stronger demo than picking a neighbourhood up front, and
it costs nothing extra because the grid already covers everything.

BOUNDARY STRATEGY, TWO TIERS. Union councils are the unit you want and the one
the brief names, but OSM coverage for them in Lahore is unreliable. Lahore
District's towns and tehsils are the coarser unit that reliably exists. Build
the pipeline so the administrative layer is a CONFIG CHOICE, not a hardcoded
assumption: resolve whatever OSM carries at admin levels 6 through 9, use the
finest level with acceptable coverage, and print which level you are using in
the interface footer. If union councils are thin, you fall back one level and
say so, and nothing else in the system changes.

THE ONE SENTENCE THAT DEFINES THE PRODUCT:
Never show a bare reading. Show the reading, the number of people it affects,
and what to do about it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 · TECH STACK (DO NOT DEVIATE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Layer              | Technology                                          |
|--------------------|-----------------------------------------------------|
| Framework          | Next.js 15 (App Router) + TypeScript strict         |
| Styling            | CSS custom properties + CSS Modules. No Tailwind.   |
| Map rendering      | MapLibre GL JS v4                                   |
| Tile delivery      | PMTiles v3 (static file, HTTP range requests)       |
| Spatial index      | H3 (h3-js v4) at resolution 8                       |
| Geometry ops       | turf.js v7                                          |
| Routing engine     | OSRM (Docker, BUILD TIME ONLY. See ADR-8)           |
| Database           | Supabase Postgres with PostGIS                      |
| Validation         | zod v3 (shared client and server)                   |
| ETL                | Python 3.11 via CONDA: rasterio, geopandas, h3,      |
|                    | pandas, pyarrow. Use environment.yml, not pip.      |
| Model training     | LightGBM (M2 only, offline in ETL)                  |
| LLM                | Anthropic SDK. Default model `claude-sonnet-5`.     |
|                    | Model id read from `LLM_MODEL` env var. Never hardcode. |
| i18n               | next-intl (English and Urdu, RTL)                   |
| Charts             | Hand-authored inline SVG. No chart library.         |
| Icons              | lucide-react, 20px stroke 1.5. No emoji.            |
| Testing            | vitest, Playwright, axe-core                        |
| Hosting            | Vercel free tier                                    |
| Storage            | Supabase Storage (report media, signed upload)      |
| Local toolchain    | Docker Desktop + WSL2. REQUIRED on Windows for      |
|                    | OSRM and tippecanoe. Verify on EVERY machine.      |

Fonts (Google Fonts, subset and self-hosted in `public/fonts/`):
  Latin display and UI: Archivo (500, 600, 700)
  Latin body:           Public Sans (400, 500, 600)
  Data and labels:      IBM Plex Mono (400, 500, 600)
  Urdu headings:        Noto Nastaliq Urdu (400, 600)
  Urdu body and UI:     Noto Sans Arabic (400, 500, 600)

API keys required before development starts:
  OPENAQ_API_KEY        console at openaq.org
  AQICN_TOKEN           aqicn.org/data-platform/token
  ANTHROPIC_API_KEY     console.anthropic.com
  SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
  COPERNICUS account    dataspace.copernicus.eu (build time only, no runtime key)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 · ARCHITECTURAL DECISIONS (JUSTIFICATION REQUIRED IN CODE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every file listed under each decision MUST carry a top-of-file comment block
explaining WHY this approach was chosen and WHAT it prevents. A judge will ask.
Write each decision as a file in `docs/adr/`.

──────────────────────────────────────────────────────────────────────────────
[ADR-1] H3 hexagons at resolution 8 are the universal join key.
  File: docs/adr/001-h3-grid.md · src/lib/h3/grid.ts

  Justification comment to include: "Population, air quality, land surface
  temperature, citizen reports, and travel times all resolve onto the same
  hex grid before anything else touches them. Union council and district
  figures are aggregations over hexes, never separate pipelines. Lahore
  district is roughly 1,770 square kilometres and an H3 resolution 8 cell
  averages about 0.74 square kilometres, so the whole district is around
  2,400 cells: small enough to ship as a single payload and recompute in the
  browser. Without a shared grid we would write the same spatial join four
  times and get four slightly different answers."

  Use resolution 9 for the single focus union council when finer detail is
  needed. Every artifact carries a `grid_version` string. A version mismatch
  between any two artifacts is a hard boot failure, not a warning.

──────────────────────────────────────────────────────────────────────────────
[ADR-2] A cold path and a warm path, never mixed.
  File: docs/adr/002-cold-warm-paths.md · etl/* · src/lib/cache.ts

  Justification comment to include: "Cold is build time: heavy geoprocessing
  runs on a laptop, outputs versioned artifacts, and never runs again during
  the demo. Warm is request time: small, cached calls to live feeds. Nothing
  slow, rate limited, or network dependent may sit on the critical path of a
  judge clicking a button. This single rule is what stops a throttled Overpass
  endpoint from ending the presentation."

──────────────────────────────────────────────────────────────────────────────
[ADR-3] PMTiles on static hosting, not a tile server.
  File: docs/adr/003-pmtiles.md · public/tiles/lahore.pmtiles

  Justification comment to include: "One archive file, HTTP range requests,
  served from the same CDN as the app. No tile infrastructure to run, pay for,
  or have fall over mid demo. It also makes offline mode close to free,
  because the archive can be cached by the service worker."

──────────────────────────────────────────────────────────────────────────────
[ADR-4] Every source implements one SourceAdapter contract.
  File: docs/adr/004-source-adapters.md · src/lib/adapters/types.ts

  Justification comment to include: "Open-Meteo, OpenAQ, a recorded fixture,
  and the not-yet-available Punjab EPA feed are the same shape to everything
  above them. This is what makes the claim that an official feed can slot in
  later structural rather than a promise on a slide. Adding EPA is one new
  file, and we can prove it on stage by toggling a mock."

──────────────────────────────────────────────────────────────────────────────
[ADR-5] One canonical Observation record for everything measured.
  File: docs/adr/005-observation-record.md · src/lib/schema/observation.ts

  Justification comment to include: "Provenance and licence are fields on the
  record, not a page written at the end. Because provenance is a required
  field, an unattributed number becomes a type error rather than an oversight,
  and the uncertainty field gives interpolated values somewhere honest to live."

  The record also carries a required `exportable` boolean, set by the adapter.
  Two upstream sources restrict redistribution, so the licence question has to
  travel with the value rather than being remembered at the export endpoint.
  Full shape in Section 6.1, reasoning in Section 5.2.

──────────────────────────────────────────────────────────────────────────────
[ADR-6] The language model never emits anything executable.
  File: docs/adr/006-llm-boundary.md · src/lib/schema/intent.ts

  Justification comment to include: "Natural language compiles to a validated
  JSON intent checked against a whitelist of metrics, operators, and
  geometries. The application executes the intent; it never executes model
  output. This removes injection and denial-of-service risk, and makes the
  whole feature testable against a fixed golden set instead of impressions."

  NEVER let the model emit Overpass QL, SQL, or JavaScript that is then run.

──────────────────────────────────────────────────────────────────────────────
[ADR-7] Keyless sources from the browser, keyed sources through a route handler.
  File: docs/adr/007-key-boundary.md · src/app/api/*

  Justification comment to include: "Verified directly against the live
  services: Open-Meteo, Overpass, Nominatim, and HDX all return
  Access-Control-Allow-Origin, so the client path genuinely works. OpenAQ
  returns 401 without an X-API-Key header and AQICN requires a token, so both
  must be server side."

  Enforced by a lint rule: importing `openaq.ts`, `aqicn.ts`, or any LLM client
  outside `src/app/api/` fails the build.

──────────────────────────────────────────────────────────────────────────────
[ADR-8] Travel-time reachability is precomputed as sets, never routed at runtime.
  File: docs/adr/008-reachability-sets.md · etl/09_reachability.py
        src/lib/analytics/access.ts

  Justification comment to include: "OSRM runs only at build time (ADR-2), so
  there is no routing engine available when a user drops a what-if pin. The
  cold path therefore precomputes, for every hex, the SET of hexes reachable
  within 5, 10, and 15 minutes by road. Roughly 2,400 sets for one district.
  A what-if placement then becomes a set union in the browser, and the siting
  optimiser becomes repeated set operations, both with no network call and no
  routing engine at runtime. This is what makes D04 and D05 possible UNDER
  ADR-2 rather than in conflict with it."

  Artifact: data/processed/reachability_h3.parquet
    h3 (string) · reach_5min (string[]) · reach_10min (string[]) · reach_15min (string[])
  About 2,400 rows. At an average of 60 hexes within 15 minutes the largest
  column holds roughly 144,000 entries. Ships compressed as a single payload
  well under one megabyte.

  Runtime what-if (D05), pure set arithmetic, no request:
    newlyCovered = reach_15min[pinHex] minus alreadyCoveredHexes
    peopleGained = sum of hex.population over newlyCovered

  WITHOUT THIS ADR THE WHAT-IF FEATURE CANNOT WORK. Build the reachability
  step in the same batch as the access surface, not later.

──────────────────────────────────────────────────────────────────────────────
[ADR-9] PM2.5 in micrograms per cubic metre is the ONE canonical scale.
  File: docs/adr/009-air-quality-scale.md · src/lib/models/aqi-convert.ts

  Justification comment to include: "Three different scales reach this system.
  Open-Meteo returns PM2.5 in micrograms per cubic metre. AQICN returns a US
  EPA AQI value from 0 to 500. OpenAQ returns raw concentrations per pollutant.
  Mixing them means a hex can be coloured on one scale and scored on another.
  Micrograms per cubic metre is canonical because it is what the keyless,
  always-available source returns, and because it is a physical measurement
  rather than a country-specific index. Every adapter converts to it BEFORE
  emitting an Observation."

  AQICN conversion: apply the US EPA PM2.5 breakpoint table in reverse with
  linear interpolation inside the band. Implemented ONCE in aqi-convert.ts
  with a unit test at every breakpoint boundary. Convert nowhere else.

  Display: the interface shows the concentration as the primary number and
  the band name as the label, because a resident recognises "hazardous" and a
  policymaker recognises the concentration. The legend prints BOTH scales.

  The severity ramp (Section 9.6) and the Civic Access Score air bands
  (Section 8.1) use the SAME breakpoints. That is deliberate: one scale, one
  set of boundaries, everywhere.
    step 1     0 to 12    Good
    step 2    12 to 35    Moderate
    step 3    35 to 55    Unhealthy for sensitive groups
    step 4    55 to 150   Unhealthy
    step 5   150 to 250   Very unhealthy
    step 6   above 250    Hazardous

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 · THE EIGHT LAYERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dependency order is strict. A layer may only call the one directly beneath it.
The map component NEVER fetches from Open-Meteo. It asks the serving layer,
which asks analytics, which reads the store. Layer 7 is the only exception and
applies everywhere.

  L0  Sources        Outside your control. Open data APIs, bulk downloads,
                     satellite exports, and the government feeds you cannot
                     reach yet. Assume every one can be slow, throttled, or
                     briefly wrong.

  L1  Ingestion      One adapter per source. Fetches, retries, rate limits,
                     caches, and normalises into the canonical Observation.
                     Records licence and retrieval time on every value.

  L2  Store          The H3 grid and its static attributes, the observation
                     stream, citizen reports, and versioned build artifacts.
                     One grid_version stamped on everything. Row level
                     security ON for every table, with NO anon write policy.
                     See Section 6.7.

  L3  Analytics      Pure functions over the store: exposure counts, access
                     surfaces, the Civic Access Score, hotspot statistics,
                     comparison deltas. No network calls, no randomness,
                     fully unit testable.

  L4  Intelligence   Forecasting, interpolation, trust scoring, the siting
                     optimiser, and the language features. Every model
                     declares a baseline it must beat and a fallback it
                     degrades to.

  L5  Serving        Typed route handlers, the public read API, tile and
                     GeoJSON delivery, the alert stream. Caching policy lives
                     here, never in components.

  L6  Experience     The map canvas, panels, the neighbourhood profile, the
                     report flow, and the table twins. Every visual encoding
                     has a non-visual equivalent.

  L7  Cross-cutting  Provenance display, internationalisation and RTL,
                     accessibility, error and offline states, observability,
                     licence tracking, rate limit protection.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 · DATA SOURCES AND THE ADAPTER CONTRACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All access facts below were verified directly against the live services.
Do not re-verify. Do not substitute values from documentation.

| Source            | Access                    | Path                                    |
|-------------------|---------------------------|-----------------------------------------|
| Open-Meteo        | keyless, CORS *           | client, direct                          |
| Open-Meteo AQ     | keyless, CORS *           | client, direct                          |
| Overpass          | keyless, CORS *           | client, direct, rate limited            |
| Nominatim         | keyless, CORS *           | client, direct, 1 req/sec, UA required   |
| HDX CKAN          | keyless, CORS *           | build time                              |
| OpenAQ v3         | X-API-Key, 401 without    | server route handler                    |
| AQICN / WAQI      | token                     | server route handler                    |
| WorldPop          | open, no CORS             | build time, static raster               |
| HOT Export Tool   | login                     | build time, manual download             |
| Copernicus        | account                   | build time, static tiles                |
| Google Earth Eng. | registered project        | build time only, never live             |
| PBS / BoS Punjab  | manual files              | build time, clean to CSV                |

Exact endpoints:
  https://api.open-meteo.com/v1/forecast?latitude=31.5204&longitude=74.3587&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m
  https://air-quality-api.open-meteo.com/v1/air-quality?latitude=31.5204&longitude=74.3587&current=pm2_5,pm10&hourly=pm2_5&forecast_days=3
  https://overpass-api.de/api/interpreter
  https://nominatim.openstreetmap.org/search?q={query}&format=json&countrycodes=pk&limit=5

  NOMINATIM USAGE POLICY. One request per second is not the only rule. Every
  request MUST send a User-Agent that identifies this application and a way to
  contact the team. Anonymous or default-agent traffic gets blocked, and it can
  be blocked mid demo. Set it in the adapter, cache aggressively, and debounce
  the search field at 400ms. Overpass has no formal policy but throttles heavy
  callers the same way. Both belong in RUNBOOK.md.
  https://api.openaq.org/v3/locations?coordinates=31.5204,74.3587&radius=25000     [X-API-Key]
  https://api.waqi.info/feed/geo:31.5204;74.3587/?token={AQICN_TOKEN}
  https://hub.worldpop.org/rest/data
  https://aqicn.org/city/lahore                                    [reference page only]

──────────────────────────────────────────────────────────────────────────────
THE ADAPTER CONTRACT · src/lib/adapters/types.ts

```typescript
export type AdapterStatus = 'live' | 'cached' | 'mock' | 'planned';

export interface SourceAdapter {
  /** Stable id used in provenance and in ATTRIBUTIONS.md. */
  readonly id: string;
  /** Human name shown on the Sources screen. */
  readonly label: string;
  /** SPDX id or licence name. Required. Shown in the interface. */
  readonly licence: string;
  readonly attributionUrl: string;
  /** live = calling the real service. planned = not yet accessible. */
  readonly status: AdapterStatus;
  /** true if this adapter must run server side (holds a key). */
  readonly serverOnly: boolean;
  /** Cache window in seconds. 0 means immutable build artifact. */
  readonly ttlSeconds: number;
  /** Metrics this adapter can emit. Used by the source health panel. */
  readonly metrics: readonly MetricId[];

  fetchObservations(bbox: BBox, signal: AbortSignal): Promise<Observation[]>;
  /** Cheap liveness probe for the Sources screen. Never throws. */
  health(): Promise<{ ok: boolean; latencyMs: number; message: string }>;
}
```

Adapters to implement:
  open-meteo.ts        live, keyless, client safe
  open-meteo-aq.ts     live, keyless, client safe
  overpass.ts          live, keyless, client safe, rate limited
  nominatim.ts         live, keyless, client safe, 1 req/sec
  openaq.ts            live, keyed, serverOnly true
  aqicn.ts             live, keyed, serverOnly true
  punjab-epa.mock.ts   planned, mock. The empty seat you toggle on stage.
  suthra-punjab.mock.ts planned, mock.
  one-map.mock.ts      planned, mock.

Every adapter records its first successful response to `data/fixtures/`.
`NEXT_PUBLIC_DATA_MODE=fixture` switches the whole registry to replay.

──────────────────────────────────────────────────────────────────────────────
5.2 LICENSING, AND WHY THE PUBLIC API NEEDS ITS OWN LICENCE

DECIDED: dual licence. Code under MIT. Published data exports under ODbL 1.0.
Documentation under CC-BY-4.0. This is the standard civic-technology
arrangement and it is what OpenStreetMap and most humanitarian mapping
projects do.

The reasoning, which you must be able to state if a judge asks.

OpenStreetMap is published under the Open Database License, which separates
three things:

  A PRODUCED WORK is something made FROM the data: the map on screen, the
  printed neighbourhood summary, a chart in the deck. Produced Works need
  ATTRIBUTION ONLY. They do not inherit share-alike.

  A DERIVATIVE DATABASE is a database built from the data. Publishing one
  triggers share-alike: it must also be offered under ODbL.

  A COLLECTIVE DATABASE is independent data sitting alongside OSM data
  without being merged. Only the OSM part stays ODbL.

Feature R04, the public read API, is where this bites. Exporting the access
surface means publishing systematically computed travel times for about 2,400
hexes derived from the OSM road graph, plus facility locations lifted from OSM
tags. That is a Derivative Database, not a picture of one, so the export
carries ODbL.

WHAT SHARE-ALIKE DOES NOT REACH: your code. ODbL governs databases, not
software. The Next.js application, the scoring logic, and the components are
yours under MIT. Only the published data carries the obligation. Do not let
anyone tell you the repository has to be ODbL.

WHAT THIS REQUIRES IN PRACTICE:

  0. TWO UPSTREAM SOURCES RESTRICT REDISTRIBUTION. Both were checked against
     the providers' published terms. These are not cautions, they are rules.

     AQICN / World Air Quality Index is DISPLAY ONLY. Their Terms of Service
     state that the data "can not be redistributed as cached or archived
     data", "can not be sold or included in sold packages", and "can not be
     used in paid applications or services". Fetching live and rendering in
     our own interface is ordinary API use. Re-serving those values through
     /api/v1/export is redistribution and is NOT PERMITTED. The AQICN adapter
     sets `exportable: false` on every observation it emits, and the export
     endpoint drops them. Attribution to the World Air Quality Index project
     is required wherever a reading is shown, along with the station
     operators named in their `attributions` array.

     OpenAQ IS CONDITIONAL, and the condition is machine readable. Terms vary
     by station. `GET /v3/licenses` returns, per licence,
     `commercialUseAllowed`, `attributionRequired`, `shareAlikeRequired`,
     `modificationAllowed`, `redistributionAllowed`, and `sourceUrl`. The
     adapter reads the licence attached to each station and sets `exportable`
     from `redistributionAllowed`. Carry the licence name and sourceUrl
     through as provenance. This is a gate, not a judgement call.

     Neither the Pakistan Bureau of Statistics nor Open Data Pakistan
     publishes a site-wide licence. Establish terms per dataset and record
     them in ATTRIBUTIONS.md, or use the file for internal validation only
     and exclude it from export.

  1. Two licence files, both already written and in the repository root.
     `LICENCE` is MIT and covers the code. `LICENCE-DATA` is the ODbL 1.0
     notice with the full canonical licence text appended, and covers
     everything served from /api/v1/export plus the committed artifacts in
     data/processed.

  2. Visible map attribution: "(c) OpenStreetMap contributors" in the canvas
     corner. Required, not optional, and already in the layout (Section 11.4).

  3. PER-LAYER licence in every API response, never one blanket licence.
     OSM is ODbL. WorldPop is CC-BY-4.0. Copernicus is free with attribution.
     Open-Meteo data is CC-BY-4.0 while its free API TIER carries a
     non-commercial restriction on access. The Observation record already has
     a required `licence` field (ADR-5), so this needs no new modelling. The
     export endpoint emits the set of licences covering what it actually
     returned, plus an HTTP `Link` header pointing at LICENCE-DATA.

  4. PREFER EXPORTING DERIVED AGGREGATES over raw rebroadcast. Publishing
     "12,400 people beyond fifteen minutes" is cleaner than republishing a
     provider's raw forecast values, and it avoids the free-tier access
     question entirely.

  5. Every one of these listed in ATTRIBUTIONS.md, which the Code of Conduct
     requires regardless.

Total cost: two files and a response header. Do it in Batch 1 so it is never
a scramble at freeze.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 · DATA CONTRACTS (EXACT SHAPES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These are the exact shapes that flow through the pipeline. zod schemas enforce
them on both sides. The frontend types are inferred from the zod schemas with
`z.infer`. Do NOT hand-write a duplicate type.

──────────────────────────────────────────────────────────────────────────────
6.1 Observation · the canonical record for everything measured

```json
{
  "sourceId": "open-meteo-aq",
  "metric": "pm2_5",
  "value": 214.3,
  "unit": "ug/m3",
  "h3": "883c5a3287fffff",
  "validAt": "2026-08-30T09:00:00Z",
  "retrievedAt": "2026-08-30T09:04:12Z",
  "confidence": 0.62,
  "method": "interpolated",
  "licence": "CC-BY-4.0",
  "exportable": true
}
```

  metric      one of: pm2_5 | pm10 | aqi | temperature | precipitation |
              wind_speed | wind_direction | lst | ndvi | population |
              access_health_min | access_education_min | elevation | twi
  confidence  0.0 to 1.0. 1.0 only for a directly measured value at a station.
  method      "measured" | "interpolated" | "modelled" | "static"
  licence     REQUIRED. Never null. Never an empty string.
  exportable  REQUIRED boolean. False means the upstream licence forbids
              redistribution, so this value may be DISPLAYED but must be
              dropped by every export endpoint. Set by the adapter, never by
              a caller. AQICN is always false. OpenAQ is set from that
              station's `redistributionAllowed`. See Section 5.2.

──────────────────────────────────────────────────────────────────────────────
6.2 HexCell · one row of the grid, after the join

```json
{
  "h3": "883c5a3287fffff",
  "gridVersion": "v3",
  "ucId": "uc-shalimar-07",
  "ucName": "Shalimar Town UC 7",
  "population": 4820,
  "areaKm2": 0.74,
  "metrics": {
    "pm2_5": { "value": 214.3, "confidence": 0.62, "method": "interpolated", "sourceId": "open-meteo-aq", "retrievedAt": "2026-08-30T09:04:12Z" },
    "access_health_min": { "value": 19, "confidence": 1.0, "method": "modelled", "sourceId": "osrm-local", "retrievedAt": "2026-08-29T22:00:00Z" }
  },
  "exposure": {
    "pm2_5_people": 4820,
    "beyond_15min_health_people": 4820
  }
}
```

──────────────────────────────────────────────────────────────────────────────
6.3 GET /api/v1/areas/{ucId} · the neighbourhood profile response

```json
{
  "success": true,
  "data": {
    "ucId": "uc-shalimar-07",
    "name": { "en": "Shalimar Town UC 7", "ur": "شالیمار ٹاؤن یو سی ۷" },
    "gridVersion": "v3",
    "hexCount": 41,
    "population": 197400,
    "headline": {
      "metric": "pm2_5",
      "value": 214,
      "unit": "ug/m3",
      "severityStep": 5,
      "sentence": {
        "en": "Air is hazardous today. 214, about nine times the safe level.",
        "ur": "آج فضا مضرِ صحت ہے۔ ۲۱۴، محفوظ حد سے تقریباً نو گنا زیادہ۔"
      },
      "peopleAffected": 197400,
      "provenance": { "sourceId": "open-meteo-aq", "retrievedAt": "2026-08-30T09:04:12Z", "licence": "CC-BY-4.0", "method": "interpolated", "confidence": 0.62 }
    },
    "access": {
      "nearestHealthMin": 19,
      "nearestEducationMin": 7,
      "beyond15MinHealthPeople": 12400,
      "beyond15MinEducationPeople": 1900
    },
    "civicAccessScore": { "total": 38.4, "rankInDistrict": 7, "ofTotal": 42, "components": { "health": 22, "education": 61, "air": 12, "green": 30, "connectivity": 58 } },
    "forecast": { "smogRisk": { "peakStep": 6, "arrivesInHours": 41, "peakAt": "2026-09-01T02:00:00Z", "confidence": 0.58 }, "floodRisk": { "indexStep": 2, "rainfall72hMm": 4 } },
    "reports": { "open": 14, "resolved": 31, "medianResponseHours": 62 },
    "coverage": { "hexesWithNoSensor": 6, "hexesTotal": 41, "nearestStationKm": 8.2 }
  },
  "error": null
}
```

──────────────────────────────────────────────────────────────────────────────
6.4 POST /api/v1/plan/optimise · the siting optimiser

Request:
```json
{ "ucId": "uc-shalimar-07", "facilityType": "health", "thresholdMinutes": 15, "candidateCount": 3 }
```

Response:
```json
{
  "success": true,
  "data": {
    "currentlyUnderserved": 12400,
    "candidates": [
      { "rank": 1, "h3": "883c5a3293fffff", "lat": 31.6012, "lng": 74.3821, "newlyCovered": 31000, "remainingUnderserved": 0, "reason": "Sits on the road network between the two largest underserved clusters." }
    ],
    "method": "greedy maximum coverage over the road-network access surface",
    "guarantee": "Submodular. Within (1 - 1/e) of optimal, approximately 63 percent.",
    "computedAt": "2026-08-30T09:05:00Z"
  },
  "error": null
}
```

──────────────────────────────────────────────────────────────────────────────
6.5 POST /api/v1/reports · citizen report submission

Request (multipart, image already uploaded to storage):
```json
{
  "imageUrl": "https://cdn.../reports/uuid.jpg",
  "lat": 31.5981, "lng": 74.3744,
  "category": "uncollected_waste",
  "categorySource": "user",
  "note": "Pile has been here four days",
  "capturedAt": "2026-08-30T08:41:00Z"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "reportId": "rep_01J8...",
    "h3": "893c5a32873ffff",
    "trustScore": 0.71,
    "confidenceLabel": "unconfirmed",
    "corroborationCount": 1,
    "mergedInto": null,
    "visibleOnMap": true,
    "signals": { "corroboration": 0.20, "exifConsistent": 0.20, "geoPlausible": 0.15, "submitterHistory": 0.10, "sensorCrossCheck": 0.06 }
  },
  "error": null
}
```

  category  uncollected_waste | standing_water | open_manhole | broken_streetlight
            | illegal_dumping | blocked_drain | other
  confidenceLabel  "unconfirmed" (trust < 0.75) | "verified" (trust >= 0.75)

──────────────────────────────────────────────────────────────────────────────
6.6 POST /api/v1/ask · natural language to validated intent (ADR-6)

Request: `{ "utterance": "schools within 2km of areas where AQI is above 200" }`

Response:
```json
{
  "success": true,
  "data": {
    "intent": {
      "select": "facility",
      "facilityType": "school",
      "within": { "metres": 2000, "of": { "metric": "aqi", "operator": "gt", "value": 200 } },
      "area": "current_viewport"
    },
    "schemaValid": true,
    "explanation": "Showing schools within 2 km of any area where AQI is above 200.",
    "resultCount": 23
  },
  "error": null
}
```

  The compiled intent is ALWAYS shown to the user above the results.
  Any field not on the whitelist causes rejection with a clear message.
  The whitelist lives in `src/lib/schema/intent.ts` and is the only source of truth.

──────────────────────────────────────────────────────────────────────────────
6.7 DATABASE SCHEMA AND ROW LEVEL SECURITY

File: supabase/migrations/001_init.sql

READ THIS FIRST. Supabase ships an anon key that is PUBLIC BY DESIGN and
present in the browser bundle. A table without row level security is a table
that anyone viewing the page can read, write, and delete. Enable RLS on every
table, and grant the anon role NOTHING except the reads that are genuinely
public. All writes go through a route handler using the service role key,
which applies rate limiting, validation, and trust scoring first.

```sql
create extension if not exists postgis;

create table reports (
  id               uuid primary key default gen_random_uuid(),
  h3               text not null,
  uc_id            text,
  lat              double precision not null,
  lng              double precision not null,
  geom             geography(Point,4326) generated always as
                     (ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) stored,
  category         text not null check (category in
                     ('uncollected_waste','standing_water','open_manhole',
                      'broken_streetlight','illegal_dumping','blocked_drain','other')),
  category_source  text not null check (category_source in ('user','model')),
  note             text check (char_length(note) <= 280),
  media_path       text,
  captured_at      timestamptz not null,
  created_at       timestamptz not null default now(),
  trust_score      numeric(3,2) not null default 0,
  corroboration    integer not null default 1,
  merged_into      uuid references reports(id),
  status           text not null default 'open'
                     check (status in ('open','acknowledged','resolved')),
  resolved_at      timestamptz,
  submitter_hash   text not null,
  deleted_at       timestamptz
);
create index reports_h3_idx      on reports (h3) where deleted_at is null;
create index reports_geom_idx    on reports using gist (geom);
create index reports_created_idx on reports (created_at desc);

create table alert_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  channel      text not null check (channel in ('web_push','email')),
  endpoint     text,
  p256dh       text,
  auth         text,
  email        text,
  uc_id        text not null,
  metric       text not null,
  threshold    numeric not null,
  locale       text not null default 'en',
  created_at   timestamptz not null default now(),
  verified_at  timestamptz,
  revoked_at   timestamptz
);

create table submitter_reputation (
  submitter_hash    text primary key,
  reports_total     integer not null default 0,
  reports_resolved  integer not null default 0,
  reports_rejected  integer not null default 0,
  first_seen        timestamptz not null default now(),
  last_seen         timestamptz not null default now()
);

create table rate_limits (
  key           text primary key,
  count         integer not null default 0,
  window_start  timestamptz not null default now()
);

alter table reports              enable row level security;
alter table alert_subscriptions  enable row level security;
alter table submitter_reputation enable row level security;
alter table rate_limits          enable row level security;

-- The ONLY anon policy in the whole schema. Reports are a public civic
-- dataset, so reading them is intentional. Everything else is server only.
create policy reports_public_read on reports
  for select using (deleted_at is null);

-- There is deliberately NO insert, update, or delete policy for anon on any
-- table. Removing this comment and adding one is a security regression.
```

  submitter_hash is sha256(ip + SERVER_SALT) truncated to 32 characters.
  NEVER store a raw IP address, a device identifier, a name, or a phone number.
  Nothing in this schema can identify a person, which is what makes the privacy
  policy in Section 21 item 7 true rather than aspirational.

──────────────────────────────────────────────────────────────────────────────
6.8 REPORT MEDIA UPLOAD PIPELINE

The Next.js route handler NEVER receives raw image bytes. Six steps:

  1. Client  POST /api/v1/reports/upload-url  { contentType, byteSize }
  2. Server  validates contentType against the allowlist, byteSize against the
             cap, and the caller against the rate limit. Returns a Supabase
             signed upload URL plus the storage path it will occupy.
  3. Client  PUT the file directly to Supabase Storage using the signed URL.
             Show upload progress.
  4. Server  processing step, triggered on the subsequent report POST:
               a. verify MAGIC BYTES. Never trust the content-type header.
               b. downscale to a maximum of 1600px on the long edge.
               c. STRIP ALL EXIF. The coordinates were captured separately in
                  step 5 and are the only location data that survives.
               d. blur faces and vehicle number plates.
               e. write the derivative, then DELETE THE ORIGINAL.
  5. Client  POST /api/v1/reports with the storage path and the coordinates.
  6. Server  runs M8 duplicate detection, then M6 trust scoring, then inserts.

  Allowlist: image/jpeg, image/png, image/webp. Nothing else.
  Cap: 5 MB before processing.
  ONLY the blurred, EXIF-stripped derivative is ever publicly readable. The
  original is deleted, not archived. If step 4d cannot run, the report is
  accepted WITHOUT the image rather than with an unblurred one.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 · DATA FLOW: COLD PATH AND WARM PATH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Stage           | Input                | Transform                        | Output                  | Clock | Cache     |
|-----------------|----------------------|----------------------------------|-------------------------|-------|-----------|
| Grid build      | District boundary    | Polyfill to H3 res 8             | grid_h3_r8.parquet      | COLD  | immutable |
| Population      | WorldPop raster      | Clip, zonal sum to hex           | pop_h3.parquet          | COLD  | immutable |
| Facilities      | OSM extract          | Filter amenity tags, snap to hex | facilities.geojson      | COLD  | immutable |
| Road graph      | OSM extract          | OSRM extract, partition, customise | lahore.osrm           | COLD  | immutable |
| Access surface  | Graph and facilities | Isochrone per facility, min/hex  | access_h3.parquet       | COLD  | immutable |
| Reachability    | Graph and grid       | Reachable set per hex at 5/10/15 | reachability_h3.parquet | COLD  | immutable |
| Terrain, heat   | Copernicus DEM, LST  | Zonal mean, TWI                  | terrain_h3.parquet      | COLD  | immutable |
| Smog model      | Open-Meteo archive   | LightGBM train, walk-forward CV  | smog_model.txt          | COLD  | immutable |
| Tiles           | All of the above     | tippecanoe to PMTiles            | lahore.pmtiles          | COLD  | immutable |
| Weather and PM  | Open-Meteo           | Normalise, interpolate to hex    | Observation[]           | WARM  | 600 s     |
| Station AQI     | OpenAQ, AQICN        | Route handler, normalise         | Observation[]           | WARM  | 600 s     |
| Exposure        | pop + PM             | Multiply per hex, aggregate      | derived                 | WARM  | derived   |
| Forecast        | archive + live       | Model inference                  | risk_forecast           | WARM  | 3600 s    |
| Reports         | User submission      | Verify, score, cluster           | report + trust          | WARM  | live      |

| What-if pin     | reachability sets    | Set union in the BROWSER         | coverage delta          | CLIENT| none      |

Cold artifacts and warm observations meet at the grid join, and ONLY there.
The what-if recomputation (D05) runs entirely in the browser over the
precomputed reachability sets. There is no routing engine at runtime (ADR-8).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 · MODELS AND DETERMINISTIC SCORING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Twelve things get called models on a project like this and only four should
actually be machine learning. Knowing which is which is itself a technical
execution signal. A rules-based index honestly labelled beats a fake neural
network every time, and a judge who asks will find out which you built.

Label every one in the interface and in `docs/model-cards/`.

| ID  | Purpose                    | Kind   | Baseline to beat        | Test                                              |
|-----|----------------------------|--------|-------------------------|---------------------------------------------------|
| M1  | AQI surface from stations  | ML     | Nearest station value   | Leave-one-station-out CV, MAE in ug/m3            |
| M2  | Smog risk 48 to 72 hours   | ML     | Raw forecast, persistence | Walk-forward time split, MAE and threshold F1   |
| M3  | Flood ponding risk         | RULES  | Not applicable          | Qualitative vs known Lahore flood spots           |
| M4  | Travel time access surface | EXACT  | Straight-line distance  | 10 routes vs a routing reference, 20 pct tolerance|
| M5  | Facility siting            | EXACT  | Random, centroid        | Brute force on small instance, report the gap     |
| M6  | Report trust score         | RULES  | Accept everything       | 200 hand-labelled including seeded spam, P and R  |
| M7  | Report photo category      | LLM    | User-selected category  | 100-image labelled set, confusion matrix          |
| M8  | Duplicate detection        | EXACT  | No deduplication        | Synthetic duplicates, recall at fixed FPR         |
| M9  | Hotspot detection          | STATS  | Raw count threshold     | Inject synthetic clusters, detect at p below 0.05 |
| M10 | Natural language to query  | LLM    | Manual filter controls  | 40-utterance golden set, exact intent match       |
| M11 | Situation brief            | LLM    | Template string         | Groundedness: every numeral must appear in input  |
| M12 | Urdu localisation          | LLM    | English only            | Native speaker review of 30 strings               |

Every model ships with a fallback. If a model fails to beat its baseline in CI,
it ships DISABLED and the interface uses the fallback with a visible label.

──────────────────────────────────────────────────────────────────────────────
8.1 CIVIC ACCESS SCORE · pure deterministic TypeScript, no model

File: src/lib/analytics/score.ts
Weights live in `config/scoring.json` and are user-adjustable in the interface.
The formula is PRINTED on the Rankings screen. A black-box index reads as
hand-waving to a judge.

```
civic_access_score =
    0.30 * health_access_score
  + 0.20 * education_access_score
  + 0.25 * air_quality_score
  + 0.15 * green_space_score
  + 0.10 * connectivity_score
```

Every sub-score is normalised to 0 to 100, where 100 is best.

  health_access_score
    Based on population-weighted mean travel minutes to the nearest hospital
    or basic health unit over the hexes in the area.
      <=  5 min  => 100
      <= 10 min  => 80
      <= 15 min  => 60
      <= 25 min  => 35
      <= 40 min  => 15
      >  40 min  => 0
    Linear interpolation between the bands. Never a step function in the output.

  education_access_score
    Identical bands, applied to nearest primary or secondary school.

  air_quality_score
    Based on the 24-hour mean PM2.5 in ug/m3, the canonical scale (ADR-9).
    These are the SAME breakpoints as the severity ramp in Section 9.6.
      <=  12  => 100      (WHO annual guideline)
      <=  35  => 80
      <=  55  => 60
      <= 150  => 35
      <= 250  => 15
      >  250  => 0

  green_space_score
    Based on square metres of mapped park or green area per resident.
      >= 9.0 m2  => 100   (WHO minimum recommendation)
      >= 6.0     => 75
      >= 3.0     => 50
      >= 1.0     => 25
      <  1.0     => 0

  connectivity_score
    Based on road length per square kilometre, capped, plus an intersection
    density term. Normalised against the district maximum.

  RULES:
  - If any component has no data, it is EXCLUDED and the remaining weights are
    renormalised to sum to 1.0. The response reports which components were used.
    NEVER substitute a zero for missing data. A missing park layer is not zero parks.
  - The score is always returned alongside its components so the interface can
    explain it (feature A03).

──────────────────────────────────────────────────────────────────────────────
8.2 EXPOSURE METRICS · the highest impact per hour on the project

File: src/lib/analytics/exposure.ts

Never render a bare reading. Every metric has an exposure twin.

```
people_exposed(metric, threshold) =
    sum over hexes where hex.metrics[metric].value >= threshold
    of hex.population

beyond_threshold_people(accessMetric, minutes) =
    sum over hexes where hex.metrics[accessMetric].value > minutes
    of hex.population
```

  Rounding: population figures are estimates. Round to the nearest 100 below
  10,000 and to the nearest 1,000 above. NEVER display "197,412 people" from a
  raster estimate. False precision is a credibility loss.

──────────────────────────────────────────────────────────────────────────────
8.3 SITING OPTIMISER (M5) · greedy maximum coverage, no model

File: src/lib/models/siting.ts

```
underserved = { hex : hex.access[type] > thresholdMinutes }
candidates  = hexes reachable by the road network, excluding existing facilities

for k in 1..candidateCount:
    best = argmax over candidates of
           sum of population of hexes newly brought within thresholdMinutes
    emit best
    mark those hexes covered
    remove best from candidates
```

  State the guarantee in the interface: the greedy solution to a submodular
  maximum coverage problem is within (1 - 1/e) of optimal, approximately
  63 percent. Do not claim optimality. Verify against brute force on a
  12-candidate instance in the test suite and report the observed gap.

──────────────────────────────────────────────────────────────────────────────
8.4 REPORT TRUST SCORE (M6) · weighted rules, not machine learning

File: src/lib/models/trust.ts

```
trust = 0.35 * corroboration      // 1 - exp(-0.7 * (nearbyReports - 1)), clamped 0..1
      + 0.20 * exif_consistency   // capture time within 24h and GPS within 200 m
      + 0.15 * geo_plausibility   // within 30 m of a mapped road or footway
      + 0.15 * submitter_history  // resolved-report ratio, 0.5 for a new submitter
      + 0.15 * sensor_cross_check // agrees with a co-located sensor or satellite signal
```

  trust >= 0.75  => "verified", solid marker on the map
  trust <  0.75  => "unconfirmed", hollow dashed marker
  NEVER hide a low-trust report. Show it, labelled. Hiding it is censorship;
  labelling it is verification. Say so when a judge asks.

──────────────────────────────────────────────────────────────────────────────
8.5 THREE MODEL TRAPS SPECIFIC TO THIS DATA

  Random splits on time series. If you shuffle hours into train and test for
  M2 you will report a spectacular score and have learned nothing. Split by
  time, always, and hold out the most recent weeks.

  Sensor scarcity. Count how many stations actually report in Lahore BEFORE
  committing to M1. If the answer is three, kriging is theatre. Say so, use
  the forecast grid, and render an honest uncertainty band. Both are
  respectable; only one of them is what you should claim.

  Groundedness on M11. A brief that invents a number is worse than no brief.
  After every generation, assert that every numeral in the output appears in
  the input context. Ten lines of code. It is the difference between a
  defensible feature and a liability. This check is a HARD FAIL, not a warning.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 · DESIGN SYSTEM (COMPLETE, BOTH THEMES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: src/styles/tokens.css

Structure the CSS for the viewer's THREE theme states, not two. An explicit
choice stamps `data-theme` on the root element. The default "system" setting
stamps NOTHING, so only `prefers-color-scheme` separates light from dark there.

```css
:root { /* complete light palette */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* redefine ONLY the values */ }
}

:root[data-theme="dark"] { /* redefine again so the toggle wins */ }
```

NEVER define a colour only inside a media query or a `[data-theme]` block.
`body` MUST set an explicit background from a token.

──────────────────────────────────────────────────────────────────────────────
9.1 SURFACES

| Token             | Light                 | Dark                  | Used for                              |
|-------------------|-----------------------|-----------------------|---------------------------------------|
| --bg-canvas       | #F4F6F7               | #0B1215               | App background                        |
| --bg-surface      | #FFFFFF               | #131E21               | Cards, side panels, sheets, popovers  |
| --bg-surface-alt  | #EDF2F3               | #182528               | Alternating rows, wells, code blocks  |
| --bg-sunken       | #E4EBEC               | #080E10               | Container behind the map canvas       |
| --bg-hover        | #E8EFF0               | #1D2C30               | Row and list item hover               |
| --bg-active       | #DDE7E9               | #243539               | Pressed state                         |
| --bg-selected     | #D6EAEC               | #10333A               | Selected area, active layer, tab      |
| --bg-scrim        | rgba(11,18,21,0.45)   | rgba(0,0,0,0.62)      | Behind modals and expanded sheets     |

9.2 TEXT

| Token             | Light    | Dark     | Used for                                 |
|-------------------|----------|----------|------------------------------------------|
| --text-primary    | #0E191B  | #E8F0F1  | Headings, metric values, load bearing    |
| --text-secondary  | #45575A  | #A6B8BB  | Body copy, descriptions, table cells     |
| --text-tertiary   | #66797C  | #7E9295  | Captions, units, timestamps, provenance  |
| --text-disabled   | #98A8AA  | #566B6E  | Inactive controls ONLY, never content    |
| --text-on-accent  | #FFFFFF  | #06181B  | Text on an accent fill                   |
| --text-link       | #08636D  | #45CBD5  | Inline links inside prose                |

Primary text reaches about 16:1 on its own surface in both themes, secondary
about 7:1, tertiary about 4.6:1. Disabled is BELOW 4.5:1 by design and must
never carry information.

9.3 BORDERS AND FOCUS

| Token             | Light    | Dark     | Used for                                 |
|-------------------|----------|----------|------------------------------------------|
| --border-subtle   | #E6ECED  | #1B292C  | Row dividers inside a list or table       |
| --border-default  | #CFDADC  | #26383B  | Card, panel, and input outlines            |
| --border-strong   | #A6B7B9  | #3A5054  | Table header rule, section separators      |
| --focus-ring      | #0A6771  | #5AD4DE  | 3px outline, 2px offset, EVERY focusable  |

9.4 ACCENT AND INTERACTION

| Token             | Light    | Dark     | Used for                                 |
|-------------------|----------|----------|------------------------------------------|
| --accent          | #0A6771  | #3FC7D1  | Primary buttons, active nav, selection   |
| --accent-hover    | #085259  | #63D6DE  | Hover on accent surfaces                 |
| --accent-active   | #063F45  | #86E2E9  | Pressed accent surfaces                  |
| --accent-subtle   | #DCEDEF  | #0F2E33  | Tinted backgrounds, chips, filter pills  |
| --accent-border   | #7FBEC4  | #2B7F87  | Outline on accent-tinted surfaces        |

  ACCENT MEANS INTERACTIVE. It is NEVER used to encode data, and severity is
  NEVER drawn in accent. Keeping those two jobs separate is what stops the map
  turning into decoration.

9.5 STATUS, FOR SYSTEM FEEDBACK ONLY

| Token             | Light    | Dark     | Used for                                    |
|-------------------|----------|----------|---------------------------------------------|
| --ok              | #2F6B44  | #5FB77B  | Feed healthy, report resolved, save ok      |
| --ok-subtle       | #E2F0E7  | #12271A  | Success banner background                   |
| --warn            | #96590A  | #E0A34F  | Stale data, degraded feed, unconfirmed      |
| --warn-subtle     | #FAEEDA  | #2B2010  | Warning banner background                   |
| --error           | #A03328  | #EE7462  | Adapter failure, validation failure, offline|
| --error-subtle    | #FAE6E3  | #2E1512  | Error banner background                     |
| --info            | #2A5B8F  | #7FADDF  | Neutral notices, method explanations        |
| --info-subtle     | #E4ECF7  | #131F2D  | Informational banner background             |

  STATUS COLOURS DESCRIBE THE SYSTEM. SEVERITY COLOURS DESCRIBE THE CITY.
  Never borrow one for the other, or a failing sensor and hazardous air will
  look like the same thing.

9.6 SEVERITY RAMP, FOR DATA ONLY

Six steps keyed to PM2.5 CONCENTRATION in micrograms per cubic metre, the one
canonical scale (ADR-9), reused for flood and heat risk so a user learns the
ramp once. Boundaries: 12, 35, 55, 150, 250. Identical to the Civic Access
Score air bands in Section 8.1. Colours derive from a perceptually uniform,
colourblind-safe ramp rather than the official red-to-green scale, which fails
for roughly one in twelve men. The legend prints BOTH the concentration and
the AQI band name, because a resident recognises "hazardous" and a policymaker
recognises the number.

| Step                  | Light fill | Light text on | Dark fill  | Dark text on |
|-----------------------|------------|---------------|------------|--------------|
| 1 Good                | #FCFDBF    | #3A2A00       | #26363B    | #9DB0B3      |
| 2 Moderate            | #FEC287    | #4A2400       | #4C4A5C    | #D6D2DE      |
| 3 Unhealthy for some  | #F1605D    | #FFFFFF       | #8B4A66    | #FFFFFF      |
| 4 Unhealthy           | #B63679    | #FFFFFF       | #C75A54    | #14060A      |
| 5 Very unhealthy      | #721F81    | #FFFFFF       | #EE8B3E    | #180B00      |
| 6 Hazardous           | #2C115F    | #FFFFFF       | #FBD75F    | #221800      |
| No data (hatched)     | #EFF2F3    | #66797C       | #162124    | #7E9295      |

  WHY THE RAMP INVERTS BETWEEN THEMES. In the light theme severity increases
  with DARKNESS. In the dark theme it increases with LUMINANCE. The invariant
  being preserved is not hue, it is VISUAL WEIGHT AGAINST THE GROUND: the worst
  areas must be the ones the eye lands on first, and on a dark map a dark
  purple hexagon disappears. Both ramps stay perceptually ordered under
  deuteranopia and protanopia. Both are DOUBLED with a text label in the legend
  and a hatch pattern for estimated cells, so hue is never the only carrier.
  Offer the official air quality colours as an opt-in setting for users who
  already know that scale.

9.7 MAP TOKENS

| Token                     | Light                   | Dark                       |
|---------------------------|-------------------------|----------------------------|
| --map-ground              | #E9EEEF                 | #0D1619                    |
| --map-water               | #C9DDE4                 | #10262E                    |
| --map-road-major          | #FFFFFF                 | #26383C                    |
| --map-road-minor          | #F2F5F6                 | #1C2A2D                    |
| --map-building            | #DFE6E8                 | #172326                    |
| --map-label               | #33474A                 | #C6D6D8                    |
| --map-label-halo          | #FFFFFF                 | #0B1215                    |
| --map-boundary            | #7C9296                 | #4E6B70                    |
| --map-hex-stroke          | rgba(14,25,27,0.10)     | rgba(232,240,241,0.10)     |
| --map-selected            | #0A6771 (2px stroke)    | #5AD4DE (2px stroke)       |
| --map-facility            | #2A5B8F                 | #7FADDF                    |
| --map-report-verified     | #2F6B44 (solid)         | #5FB77B (solid)            |
| --map-report-unconfirmed  | #96590A (dashed hollow) | #E0A34F (dashed hollow)    |

  `src/styles/map-theme.json` carries a full MapLibre style for each theme.
  Switching theme swaps the style object. Do NOT try to recolour layers at runtime.

9.8 TYPOGRAPHY

| Role        | Latin                     | Urdu               | Size / line height    | Used for                    |
|-------------|---------------------------|--------------------|-----------------------|-----------------------------|
| Display     | Archivo 700               | Noto Nastaliq Urdu | 32 / 1.10 (ur 1.90)   | Page titles                 |
| Heading     | Archivo 600               | Noto Nastaliq Urdu | 20 / 1.25 (ur 1.90)   | Section and panel headings  |
| Body        | Public Sans 400           | Noto Sans Arabic   | 16 / 1.60 (ur 1.80)   | Prose, descriptions, briefs |
| Body small  | Public Sans 400           | Noto Sans Arabic   | 14 / 1.55             | Panel copy, table cells     |
| Label       | IBM Plex Mono 600, .1em   | Noto Sans Arabic 600 | 11 / 1.40 uppercase | Field labels, legend keys   |
| Data        | IBM Plex Mono, tabular    | same, Latin digits | 14 / 1.50             | Metrics, timestamps, coords |
| Metric hero | IBM Plex Mono 600         | same               | 40 / 1.05             | The one number on Now       |

  Prose capped at 68 characters. Panel copy capped at 40.
  `font-variant-numeric: tabular-nums` everywhere digits align in a column.
  Nastaliq needs about 1.9 line height. Budget for it EARLY or the RTL layout
  clips descenders on every heading.
  Urdu keeps LATIN DIGITS in data contexts. Eastern Arabic numerals alongside
  English units confuse more than they help in a mixed interface.

9.9 SPACING SCALE

| Token     | Value | Used for                              |
|-----------|-------|---------------------------------------|
| --space-1 | 4px   | Label to value, icon nudges           |
| --space-2 | 8px   | Icon to label, chip padding           |
| --space-3 | 12px  | Related items in a group              |
| --space-4 | 16px  | Blocks inside a panel                 |
| --space-5 | 24px  | Unrelated groups                      |
| --space-6 | 32px  | Desktop container padding             |
| --space-7 | 48px  | Section break, mobile                 |
| --space-8 | 64px  | Section break, desktop                |
| --space-9 | 96px  | Major page divisions                  |

SPACING RULES, ENFORCED BY LINT:
  1. Base unit is 4px and nothing sits off the scale. If a value feels like it
     needs to be 18px, the answer is 16 or 24. One off-scale value is
     invisible; forty of them is why an interface looks amateur without anyone
     being able to say why.
  2. Container padding is ONE token at three breakpoints: 16 below 768, 24 to
     1200, 32 above. Set it on the container. No screen sets its own.
  3. Minimum 24px between any two UNRELATED groups.
  4. Panels never nest more than THREE levels: container, group, item. A
     fourth level means the information architecture is wrong, and each level
     eats padding on a 360px screen until the content column is unusable.
  5. Empty space is LOAD BEARING on the Now screen. The single headline number
     and its sentence own the top third of the viewport with nothing competing.
     Resist filling it. That generosity is what makes the density of the map
     screen acceptable by contrast.
  6. The map is the ONLY full-bleed element. Everything else respects the
     container. Map controls are inset 16px from the canvas edge, never flush.
  7. A component NEVER sets its own outer margin. Sibling spacing comes from
     the parent's `gap`.

9.10 COMPONENT PADDING REFERENCE

| Component        | Padding                   | Internal gap | Notes                          |
|------------------|---------------------------|--------------|--------------------------------|
| Page container   | 16 / 24 / 32              | 48 / 64      | Breakpoint driven, one source  |
| Card, side panel | 20 (16 mobile)            | 16           | Same on all four sides         |
| Bottom sheet     | 20 sides, 16 top          | 16           | Bottom adds safe-area inset    |
| Table cell       | 12 vertical, 16 right     | n/a          | First column no left padding   |
| List row         | 12 vertical, 16 horizontal| 12           | Minimum 44px total height      |
| Button medium    | 10 vertical, 16 horizontal| 8            | Minimum height 44              |
| Button small     | 6 vertical, 12 horizontal | 6            | Minimum height 36, desktop only|
| Input, select    | 10 vertical, 12 horizontal| 8            | Minimum height 44              |
| Chip, pill       | 2 vertical, 8 horizontal  | 4            | Never a tap target on its own  |
| Map control      | 8                         | 8            | 44 by 44 target, inset 16      |
| Banner, toast    | 12 vertical, 16 horizontal| 12           | Full width on mobile           |
| Modal            | 24                        | 16           | Full-height sheet below 768    |

9.11 RADIUS, BORDER, ELEVATION

  Radius: 3px chips, badges, inputs. 6px cards, panels, buttons. 12px sheets
  and modals only. Fully round only for the location dot and map markers.
  ONE radius per component. Never mixed corners.

  Border: 1px is the only border width except focus (3px outline, 2px offset)
  and map selection (2px stroke). Prefer a border over a shadow for separation.

  Elevation: three levels only. Flat, raised, floating. Raised is a 1px border
  plus a barely visible shadow. In DARK MODE elevation is a LIGHTER SURFACE,
  not a stronger shadow.

9.12 MOTION

  Map transitions under 300ms. Data updates NEVER animate position; a value
  changing under the cursor while the user reads it is a bug, not a delight.
  Everything respects `prefers-reduced-motion: reduce` by disabling transforms
  and reducing durations to 0.01ms. Touch targets 44px minimum, always.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 · CONTENT AND COPY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Binding on interface copy, generated briefs, alert text, documentation, commit
messages, and the deck. Put them in `CLAUDE.md` and the pull request template.

  1. No em dashes. See Section 0 note 1.
  2. No emoji. See Section 0 note 2.
  3. Name things the way a resident would.
     NOT "PM2.5 concentration 214 ug/m3" alone.
     YES "Air is hazardous today. 214, about nine times the safe level."
  4. Never write "no data" without saying why.
     NOT "no data"
     YES "no sensor within 8 km of here"
  5. Every error says WHAT BROKE, WHAT STILL WORKS, and WHAT TO DO NEXT.
     NOT "Failed to load air quality."
     YES "Air quality is unavailable right now. The map, population, and
          access layers are still live. Retry."
  6. Every estimated number says it is estimated IN THE SAME BREATH as the
     number, not in a tooltip the user has to find.
  7. A control says exactly what will happen, and the confirmation uses the
     SAME VERB. "Publish" then "Published". Never "Submit" then "Success".
  8. Active voice. Present tense. No apologies. No exclamation marks.
  9. Numbers from raster estimates are rounded (Section 8.2). Never display
     false precision.
 10. Every user-visible string exists in BOTH `en.json` and `ur.json`. A key
     present in one and missing from the other fails CI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 11 · SCREEN INVENTORY AND FEATURE PLACEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Not everything deserves a screen. The most common structural mistake is giving
a feature a route when it should live beside the number it explains.

FIVE DECISION RULES:
  1. Would someone want to send this as a link?  => own route.
  2. Does it hold state that navigating away would destroy?  => own route.
  3. Does it only make sense with a live map and a selection?  => map panel.
  4. Does it explain a single number?  => INLINE, beside that number.
  5. Does it run without anyone watching?  => NO INTERFACE AT ALL.

Rule 4 is the one doing the most work. Nobody navigates away to check
provenance, so provenance on a separate page is the same as no provenance.

──────────────────────────────────────────────────────────────────────────────
11.1 ROUTES

| Screen        | Route                | Job                                          | Table twin      |
|---------------|----------------------|----------------------------------------------|-----------------|
| Now           | /                    | One number, one sentence, one action         | n/a             |
| Map           | /map                 | Layered city view, toggles, time scrubber    | /map/data       |
| Neighbourhood | /area/[id]           | Full profile, printable                      | inline          |
| Rankings      | /rankings            | Civic Access Score, sortable, weights live   | is a table      |
| Compare       | /compare             | Two areas, difference bars                   | inline          |
| Plan          | /plan                | Siting optimiser and what-if pins            | /plan/results   |
| Forecast      | /forecast            | Smog and flood risk, arrival windows         | inline          |
| Report        | /report              | Two-tap submission                           | n/a             |
| Reports       | /reports             | Hotspots, status, response times             | is a table      |
| Alerts        | /alerts              | Subscription settings, web push and email    | n/a             |
| Sources       | /sources             | Feed health, adapter status, planned seats   | is a table      |
| About         | /about               | Attribution, licences, method, model cards   | n/a             |
| API docs      | /about/api           | Public read API documentation                | n/a             |

11.2 PLACEMENT OF ALL 32 CORE FEATURES

| ID  | Feature                     | Placement | Exactly where                    |
|-----|-----------------------------|-----------|----------------------------------|
| S01 | Live layers on one map      | ROUTE     | /map                             |
| S02 | UC boundaries as the unit   | INLINE    | The grid the map draws           |
| S03 | Know Your Neighbourhood     | ROUTE     | /area/[id]                       |
| S04 | Live source panel           | ROUTE     | /sources plus a chrome health dot|
| D01 | Exposure counts             | INLINE    | Beside EVERY metric              |
| D02 | Road-network access surface | PANEL     | Map layer plus profile block     |
| D03 | Civic Access Score          | ROUTE     | /rankings                        |
| D04 | Siting optimiser            | ROUTE     | /plan                            |
| D05 | What-if pins                | PANEL     | Inside /plan, on the canvas      |
| D06 | Compare two areas           | ROUTE     | /compare                         |
| P01 | Smog forecast 48 to 72h     | ROUTE     | /forecast                        |
| P02 | Monsoon flood risk          | ROUTE     | /forecast, second view           |
| P03 | Urban heat exposure         | PANEL     | Map layer plus profile block     |
| P04 | Threshold alerts            | CHROME    | Bell and banner, settings /alerts|
| P05 | Historical playback         | PANEL     | Time scrubber on /map            |
| C01 | Submit a report             | ROUTE     | /report, full screen task flow   |
| C02 | Verification pipeline       | NO UI     | Confidence badge on each report  |
| C03 | Hotspot clustering          | ROUTE     | /reports                         |
| C04 | Accountability view         | ROUTE     | /reports, second view            |
| A01 | Natural language query      | CHROME    | The global search field          |
| A02 | Situation brief             | INLINE    | Block inside /area/[id]          |
| A03 | Why this value              | INLINE    | Expandable in selection panel    |
| X01 | Urdu and RTL                | CHROME    | Language toggle                  |
| X02 | Colourblind-safe palettes   | CHROME    | Setting, reflected in the legend |
| X03 | Table twins                 | ROUTE     | /map/data, /plan/results         |
| X04 | Offline mode                | CHROME    | Persistent banner                |
| X05 | Mobile first                | NO UI     | Constraint on everything above   |
| R01 | Adapter contract            | NO UI     | Surfaced through /sources        |
| R02 | Provenance                  | INLINE    | On EVERY value                   |
| R03 | Uncertainty                 | INLINE    | Hex rendering and legend         |
| R04 | Public read API             | ROUTE     | /about/api                       |
| R05 | Attribution and licences    | ROUTE     | /about                           |

11.3 NAVIGATION

  FIVE primary destinations, the most a mobile bar can carry:
  Now · Map · Rankings · Reports · More

  Forecast, Plan, Compare, Sources, and About live under More on mobile and in
  the header on desktop. "Report a problem" is a PERSISTENT ACTION BUTTON, not
  a nav item, because it is a task and not a place. Anything marked INLINE or
  CHROME never appears in navigation at all. That classification is exactly
  what keeps the nav to five items instead of nineteen.

11.4 ANATOMY OF THE MAP SCREEN

```
[ Now · Map · Rankings · Reports · More ]  [ search or ask ]  [ EN | UR ] [ theme ] [ Report a problem ]
+---------------+--------------------------------------+------------------------------+
| LAYERS        |                                      | SELECTION                    |
|  Air quality  |                                      |  Area name                   |
|  Population   |          MAP CANVAS                  |  Headline value and unit     |
|  Access       |    hex choropleth over basemap       |  People affected      (D01)  |
|  Facilities   |                                      |  Access times         (D02)  |
|  Heat         |    legend bottom left, inset 16      |  Forecast strip       (P01)  |
|  Reports      |    attribution bottom right          |  Why this value       (A03)  |
|               |                                      |  Source, retrieved at (R02)  |
| TIME          |                                      |  Open full profile           |
|  now to +72h  |                                      |                              |
+---------------+--------------------------------------+------------------------------+
| 2,412 hexes · grid v3 · updated 4 min ago            |            View as table       |
+-------------------------------------------------------------------------------------+
```

  Below 768px the left rail becomes a BOTTOM SHEET at 40 percent height, the
  right panel becomes that sheet's EXPANDED state, and the map keeps the full
  viewport behind it.

11.5 THE NOW SCREEN, AND THE FLOW MISTAKE TO AVOID

  DO NOT open on an empty map with a layer panel. A first-time visitor who
  sees fourteen toggles and no answer leaves. Open with ONE NUMBER, ONE
  SENTENCE, ONE ACTION for wherever they are, and let the full map be the
  second screen. This is the difference between a tool and a demo, and a judge
  notices it in the first three seconds.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 12 · COMPONENT SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every component is a `.tsx` file with a paired `.module.css`. Tokens only.
No inline styles except computed map colours and computed bar widths.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: MetricValue          src/components/data/MetricValue.tsx
  THE MOST IMPORTANT COMPONENT IN THE PROJECT. Every number on every screen
  renders through it. Its props make provenance structurally mandatory.

```typescript
interface MetricValueProps {
  value: number | null;
  unit: string;
  label: string;
  /** REQUIRED. There is no way to render a number without a source. */
  provenance: Provenance;
  /** The exposure twin. Renders directly beneath at equal weight. */
  exposure?: { count: number; phrase: string };
  severityStep?: 1 | 2 | 3 | 4 | 5 | 6 | null;
  size: 'hero' | 'default' | 'compact';
  state: DataState;   // see Section 13
}
```

  Renders: value in tabular mono, unit in tertiary, label above in mono
  uppercase, exposure line beneath, and a ProvenanceTag that expands on
  hover or tap. If `method` is not "measured" it renders the word
  "estimated" beside the value, never hidden in the tag.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: ProvenanceTag        src/components/data/ProvenanceTag.tsx
  Small mono text: source label, relative retrieval time, and a licence chip.
  Expands to show the full timestamp, the method, the confidence, and a link
  to the source. Never a bare icon. The word "Source" is always visible.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: StateWrapper         src/components/data/StateWrapper.tsx
  Wraps any data region and renders the correct one of the seven states from
  Section 13. Takes `state`, `retryFn`, and children. NO data component
  renders its own loading or error markup.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: MapCanvas            src/components/map/MapCanvas.tsx
  MapLibre GL. Loads `lahore.pmtiles` through the PMTiles protocol.
  Style object selected by theme from `map-theme.json`.
  Hex choropleth is a `fill` layer driven by a data-join on the H3 index.
  Estimated cells get a `fill-pattern` hatch, never a different hue.
  Selection is a 2px `line` layer, `--map-selected`.
  Keyboard: arrow keys pan, plus and minus zoom, Tab reaches every control,
  Enter on a focused hex selects it and moves focus to the SelectionPanel.
  A visually hidden live region announces the selected area on change.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: LayerRail            src/components/map/LayerRail.tsx
  Checkbox group, NOT a set of styled divs. Each row: label, live or static
  badge, last-updated time, and a small legend swatch. Desktop left rail,
  mobile bottom sheet.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: Legend               src/components/map/Legend.tsx
  Six severity steps with BOTH the colour swatch AND the numeric band AND the
  word label. A seventh entry for hatched "estimated" and an eighth for
  "no sensor nearby". Inset 16px from the canvas corner.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: DataTable            src/components/tables/DataTable.tsx
  The twin for every map layer. Real `<table>` with `<caption>`, `<th scope>`,
  and sortable columns with `aria-sort`. Tabular numerals. Every row links to
  its area. This is not a consolation prize; it is faster than the map for
  anyone comparing twenty areas.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: WhyThisValue         src/components/panels/WhyThisValue.tsx  (A03)
  Expandable. Renders the score components as horizontal bars with their
  weights, then one plain-language sentence per driver. Reads from the
  components already returned by the API. Does NOT call a model.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: SeverityChip         src/components/ui/SeverityChip.tsx
  Colour fill from the severity ramp PLUS the band name as text PLUS a hatch
  pattern when estimated. Never colour alone. Never an emoji.

──────────────────────────────────────────────────────────────────────────────
COMPONENT: CaptureStep / CategoryStep / ConfirmStep   src/components/report/
  Three-step full-screen flow for C01. Step 1 camera or gallery with automatic
  location. Step 2 category, pre-selected from M7 with the model's suggestion
  clearly labelled as a suggestion the user can change. Step 3 optional note
  and submit. Two taps to submit if the user accepts the suggested category.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 13 · THE SEVEN STATES EVERY DATA COMPONENT HANDLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The highest-leverage specification in this document. Most hackathon dashboards
implement ONE of these and break visibly on the other six, usually while a
judge is watching.

```typescript
type DataState =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'stale';     ageSeconds: number }
  | { kind: 'partial';   covered: number; total: number }
  | { kind: 'estimated'; confidence: number; methodUrl: string }
  | { kind: 'failed';    what: string; stillWorking: string[]; retry: () => void }
  | { kind: 'offline';   lastKnownAt: string };
```

| State     | When                        | What the user sees                                                    | Token            |
|-----------|-----------------------------|-----------------------------------------------------------------------|------------------|
| loading   | First fetch in flight       | Skeleton in the EXACT final shape. Never a spinner over the map.      | --bg-surface-alt |
| ready     | Fresh data                  | Value, unit, source, time since retrieval                             | --text-primary   |
| stale     | Cache past its window       | Value dimmed with an explicit age: "last reading 47 minutes ago"      | --warn           |
| partial   | Some hexes uncovered        | Hatched cells and a count: "312 of 2,412 hexes have no nearby sensor" | severity no-data |
| estimated | Interpolated, not measured  | Confidence band, hatch overlay, link to the method                    | --warn-subtle    |
| failed    | Adapter error               | What failed, what still works, a retry. NEVER a blank map.            | --error          |
| offline   | No connectivity             | Cached tiles, last known values with timestamps, persistent banner    | --info           |

  Every one of the seven is implemented on a REFERENCE COMPONENT before any
  feature work begins. This is the Stage 1 gate in Section 22.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 14 · ACCESSIBILITY REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target: WCAG 2.2 Level AA. This is a NAMED JUDGING CRITERION. Assign it to a
person on day zero, not to the end of the schedule.

STRUCTURAL
  - Every map layer has a sortable table twin at a real URL.
  - Full keyboard path through search, layers, selection, and report.
  - Visible 3px focus ring with 2px offset on every interactive element.
  - Landmark regions (`header`, `nav`, `main`, `aside`) and a skip link.
  - The map has `role="application"` with a labelled keyboard help panel.
  - Forms: every input has a real `<label>`, errors use `aria-describedby`,
    and the error summary receives focus on submit failure.

PERCEPTUAL
  - 4.5:1 for text, 3:1 for interface components and graphical objects.
  - Colourblind-safe ramps, verified with a simulator in BOTH themes.
  - Severity NEVER encoded by hue alone. Always hue plus label, plus pattern
    when estimated.
  - Alert changes announced through a polite `aria-live` region.
  - Readable at 200 percent zoom with no horizontal scroll.
  - `prefers-reduced-motion` respected on every transition.

SITUATIONAL
  - Works at 360px on a mid-range Android over a throttled connection.
  - Usable one-handed. Primary actions in thumb reach.
  - Degrades to text when tiles cannot load.
  - Urdu is a first-class locale, reviewed by a fluent speaker. Machine-
    translated Urdu that reads badly is WORSE than English.
  - Print stylesheet for the one-page neighbourhood summary.

CI GATE: `axe-core` across every route. ZERO critical violations. Plus one
manual keyboard-only pass and one screen reader spot check before freeze.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 15 · API CONTRACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Base: /api/v1
All responses: `{ success: boolean, data: T | null, error: string | null }`
All inputs and outputs validated by zod on BOTH sides.
Cursor pagination only. Never page number or offset.

  GET  /api/v1/grid?ucId=&metrics=          Hex cells with joined metrics
  GET  /api/v1/areas                        List of union councils with scores
  GET  /api/v1/areas/{ucId}                 Full profile (Section 6.3)
  GET  /api/v1/areas/{ucId}/brief?lang=     Grounded situation brief (M11)
  GET  /api/v1/rankings?weights=            Civic Access Score, sortable
  GET  /api/v1/forecast/{ucId}              Smog and flood risk
  POST /api/v1/plan/optimise                Siting optimiser (Section 6.4)
  POST /api/v1/plan/whatif                  Recompute coverage with a new pin
  GET  /api/v1/reports?bbox=&cursor=        Reports and hotspots
  POST /api/v1/reports                      Submit a report (Section 6.5)
  POST /api/v1/ask                          NL to validated intent (Section 6.6)
  GET  /api/v1/alerts/stream                Server-sent events
  POST /api/v1/alerts/subscribe             Threshold subscription
  GET  /api/v1/sources                      Adapter registry health
  GET  /api/v1/export/{ucId}.geojson        Public open data export (R04)
  GET  /api/v1/health                       Liveness, grid version, adapter count

  Server-only route handlers (hold keys, ADR-7):
  /api/v1/aqi     OpenAQ and AQICN proxy
  /api/v1/ask     LLM intent compilation
  /api/v1/areas/{ucId}/brief   LLM grounded generation
  /api/v1/reports and /api/v1/reports/upload-url   service role writes

──────────────────────────────────────────────────────────────────────────────
15.2 ABUSE PROTECTION

`POST /api/v1/reports` is a PUBLIC, UNAUTHENTICATED WRITE endpoint that accepts
an image and a coordinate from anyone on the internet. It needs every control
below before it is deployed.

  Rate limits, sliding window, keyed on sha256(ip + SERVER_SALT):
    POST /api/v1/reports/upload-url      10 per hour
    POST /api/v1/reports                 10 per hour
    POST /api/v1/ask                     20 per hour
    GET  /api/v1/areas/{ucId}/brief      30 per hour
    all other GET                       300 per hour
  Over the limit returns 429 with a Retry-After header and a message that says
  when the caller may try again, not a bare rejection.

  Input hardening on every report:
    - Coordinates must fall inside the district bounding box. Reject otherwise.
    - captured_at must be within the last 48 hours and not in the future.
    - note capped at 280 characters, HTML stripped, never stored raw.
    - Image validated by MAGIC BYTES, not the content-type header.
    - Image capped at 5 MB before processing.

  NO LOGIN IS REQUIRED TO SUBMIT A REPORT, and that is a deliberate design
  decision, not an omission. Requiring an account on a civic reporting tool
  excludes exactly the people it exists to serve. The trust score (M6), not an
  identity check, is what separates signal from noise, and low-trust reports
  are labelled rather than hidden. Say this when a judge asks.

  Never store a raw IP address, device identifier, name, or phone number.
  The salted hash is the only thing that persists about a submitter.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 16 · FULL DIRECTORY STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
lahore-nervous-system/
├── .github/workflows/
│   ├── ci.yml                       lint, typecheck, unit, contract, a11y, content
│   └── evals.yml                    model evals with baseline gates (M1 to M11)
├── .claude/
│   ├── CLAUDE.md                    house rules: no em dashes, no emoji, tokens only
│   └── launch.json                  dev server config
├── docs/
│   ├── adr/
│   │   ├── 001-h3-grid.md
│   │   ├── 002-cold-warm-paths.md
│   │   ├── 003-pmtiles.md
│   │   ├── 004-source-adapters.md
│   │   ├── 005-observation-record.md
│   │   ├── 006-llm-boundary.md
│   │   └── 007-key-boundary.md
│   ├── model-cards/
│   │   ├── m1-aqi-interpolation.md
│   │   ├── m2-smog-forecast.md
│   │   ├── m6-report-trust.md
│   │   └── m11-situation-brief.md
│   ├── DESIGN_SYSTEM.md             tokens, spacing, placement, content rules
│   ├── DATA_SOURCES.md              endpoint, auth, CORS, licence, cadence
│   ├── ATTRIBUTIONS.md              Code of Conduct requirement, fill as you go
│   ├── METHODOLOGY.md               how every index is computed, public facing
│   ├── DEMO_SCRIPT.md               the eight beats, verbatim
│   └── RUNBOOK.md                   what to do when a feed dies mid demo
├── data/
│   ├── raw/                         downloads, gitignored, documented in README
│   ├── interim/                     clipped and reprojected, gitignored
│   ├── processed/                   committed artifacts, grid_version stamped
│   │   ├── grid_h3_r8.parquet
│   │   ├── pop_h3.parquet
│   │   ├── access_h3.parquet
│   │   ├── reachability_h3.parquet  ADR-8. Powers what-if and the optimiser.
│   │   ├── terrain_h3.parquet
│   │   ├── uc_lookup.json
│   │   └── facilities.geojson
│   ├── fixtures/                    recorded API responses, the demo safety net
│   │   ├── open-meteo.forecast.json
│   │   ├── open-meteo.air-quality.json
│   │   ├── openaq.locations.json
│   │   ├── aqicn.feed.json
│   │   └── overpass.facilities.json
│   ├── models/
│   │   └── smog_model.txt           LightGBM booster, M2
│   └── eval/                        labelled sets for M6, M7, M10, M12
├── etl/                             COLD PATH, never runs at request time
│   ├── 00_download.py
│   ├── 01_build_grid.py
│   ├── 02_population.py
│   ├── 03_facilities.py
│   ├── 04_road_graph.sh
│   ├── 05_access_surface.py
│   ├── 06_terrain_heat.py
│   ├── 07_train_smog.py
│   ├── 08_make_tiles.sh
│   ├── 09_reachability.py           ADR-8. Reachable sets per hex at 5/10/15
│   ├── validate.py                  SANITY GATES, see Section 21
│   └── environment.yml              CONDA. geopandas and rasterio need it.
├── supabase/
│   └── migrations/
│       └── 001_init.sql             tables, indexes, RLS. See Section 6.7
├── config/
│   ├── scoring.json                 Civic Access Score weights and bands
│   ├── thresholds.json              alert and severity thresholds
│   └── layers.json                  layer registry, drives rail and table twins
├── src/
│   ├── app/
│   │   ├── layout.tsx               locale, direction, theme, skip link
│   │   ├── page.tsx                 Now: one number, one sentence
│   │   ├── map/page.tsx  ·  map/data/page.tsx
│   │   ├── area/[id]/page.tsx  ·  area/[id]/print.tsx
│   │   ├── rankings/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── plan/page.tsx  ·  plan/results/page.tsx
│   │   ├── forecast/page.tsx
│   │   ├── report/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── alerts/page.tsx
│   │   ├── sources/page.tsx
│   │   ├── about/page.tsx  ·  about/api/page.tsx
│   │   └── api/v1/
│   │       ├── grid/route.ts
│   │       ├── areas/route.ts  ·  areas/[ucId]/route.ts  ·  areas/[ucId]/brief/route.ts
│   │       ├── rankings/route.ts
│   │       ├── forecast/[ucId]/route.ts
│   │       ├── plan/optimise/route.ts  ·  plan/whatif/route.ts
│   │       ├── reports/route.ts
│   │       ├── aqi/route.ts         KEYED, server only
│   │       ├── ask/route.ts         KEYED, server only
│   │       ├── alerts/stream/route.ts  ·  alerts/subscribe/route.ts
│   │       ├── sources/route.ts
│   │       ├── export/[ucId]/route.ts
│   │       └── health/route.ts
│   ├── components/
│   │   ├── map/       MapCanvas · LayerRail · HexLayer · Legend · TimeScrubber · MapControls
│   │   ├── panels/    SelectionPanel · ProfileCard · ForecastStrip · WhyThisValue · ScoreBars
│   │   ├── data/      MetricValue · ProvenanceTag · ConfidenceBand · StateWrapper · ExposureLine
│   │   ├── report/    CaptureStep · CategoryStep · ConfirmStep · TrustBadge
│   │   ├── tables/    DataTable · SortHeader
│   │   └── ui/        Button · Sheet · Toggle · Skeleton · Banner · Chip · SeverityChip
│   ├── lib/
│   │   ├── adapters/  types.ts · registry.ts · open-meteo.ts · open-meteo-aq.ts ·
│   │   │              overpass.ts · nominatim.ts · openaq.ts · aqicn.ts ·
│   │   │              punjab-epa.mock.ts · suthra-punjab.mock.ts · one-map.mock.ts
│   │   ├── schema/    observation.ts · hexcell.ts · report.ts · intent.ts · api.ts
│   │   ├── analytics/ exposure.ts · access.ts · score.ts · hotspots.ts · compare.ts
│   │   ├── models/    aqi-convert.ts · interpolate.ts · smog-forecast.ts · flood-index.ts · siting.ts ·
│   │   │              trust.ts · dedupe.ts · prompts/
│   │   ├── h3/        grid.ts · aggregate.ts · lookup.ts
│   │   ├── i18n/      config.ts · direction.ts · glossary.ur.json
│   │   ├── media/     upload.ts · process.ts (EXIF strip, blur, downscale)
│   │   ├── rate-limit.ts · time.ts (UTC store, PKT render) · cache.ts
│   │   ├── provenance.ts · env.ts · format.ts
│   ├── styles/        tokens.css · space.css · type.css · map-theme.json · print.css
│   └── messages/      en.json · ur.json
├── tests/
│   ├── unit/          analytics, h3, scoring, formatters
│   ├── contract/      every adapter against the interface
│   ├── e2e/demo-script.spec.ts      THE EIGHT BEATS, your completion signal
│   ├── a11y/routes.spec.ts          axe across every route
│   ├── content/rules.spec.ts        no em dashes, no emoji, locale parity
│   ├── tokens/parity.spec.ts        every token defined in both themes
│   └── evals/         m1 · m2 · m6 · m7 · m10 · m11
├── public/
│   ├── tiles/lahore.pmtiles
│   ├── fonts/                       Noto Nastaliq Urdu, Noto Sans Arabic subsets
│   ├── manifest.webmanifest
│   └── sw.js                        offline shell and tile cache
├── .env.example
├── .nvmrc · .editorconfig · .gitignore
├── eslint.config.mjs                includes content and token lint rules
├── prettier.config.mjs
├── tsconfig.json · next.config.ts
├── vitest.config.ts · playwright.config.ts
├── LICENCE                          MIT. Covers the code only.
├── LICENCE-DATA                     ODbL 1.0. Covers exports and artifacts.
├── CONTRIBUTING.md                  branch naming, PR rules, code freeze time
└── README.md                        run it in five commands or it does not count
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 17 · ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`.env.example` names every key with NO values. `src/lib/env.ts` parses and
validates with zod at boot. A missing required key is a startup failure with a
clear message, never a runtime `undefined`.

```
# Public, safe in the browser
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GRID_VERSION=v3
NEXT_PUBLIC_FOCUS_DISTRICT=lahore
NEXT_PUBLIC_ADMIN_LEVEL=9              # 9 union council, 7 town, 6 district
                                       # Set to the finest level OSM actually
                                       # covers. Shown in the interface footer.
NEXT_PUBLIC_TILES_URL=/tiles/lahore.pmtiles
NEXT_PUBLIC_DATA_MODE=live              # live | fixture
NEXT_PUBLIC_DEFAULT_LOCALE=en           # en | ur

# Server only. NEVER prefix these with NEXT_PUBLIC_
OPENAQ_API_KEY=
AQICN_TOKEN=
ANTHROPIC_API_KEY=
LLM_MODEL=claude-sonnet-5
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Web push (P04). Generate once with `npx web-push generate-vapid-keys`.
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:team@example.org

# Salt for submitter hashing. Rotate never. Losing it orphans reputation rows.
SERVER_SALT=

# Optional
SENTRY_DSN=
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 18 · TESTING REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Level          | Covers                                             | Tooling          | Gate                                |
|----------------|----------------------------------------------------|------------------|-------------------------------------|
| Unit           | Index maths, H3 helpers, scoring, formatters       | vitest           | Every commit                        |
| Golden file    | ETL outputs hashed so a pipeline change is visible | vitest snapshots | Hash change requires a note         |
| Contract       | Every adapter satisfies SourceAdapter              | vitest + zod     | No adapter merges without one       |
| Fixture replay | Whole app runs offline from recorded responses     | MSW              | MUST pass in airplane mode          |
| Model eval     | M1, M2, M6, M7, M10, M11 against baselines         | eval scripts     | Beat baseline or ship fallback      |
| Token parity   | Every token defined in BOTH themes                 | vitest           | Fails the build                     |
| Content rules  | No em dashes, no emoji, locale key parity          | lint rule        | Fails the build                     |
| Spacing        | No raw px in padding, margin, gap outside space.css| lint rule        | Fails the build                     |
| End to end     | The EIGHT DEMO BEATS, in order                     | Playwright       | Green before code freeze            |
| Accessibility  | Every route, plus a manual keyboard pass           | axe-core         | Zero critical violations            |
| Device         | Real budget Android, throttled network             | manual           | Once per day of the build           |

THE DEMO SCRIPT IS THE END-TO-END SUITE. Write the eight beats from Section 23
as Playwright tests on DAY ONE. They will fail for most of the hackathon, and
the moment they all pass you are done. That is a far better completion signal
than anyone's opinion about whether it feels ready.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 19 · IMPLEMENTATION RULES (DO NOT VIOLATE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.  NEVER leave a placeholder, TODO, stub, or incomplete function. Every file
    must be fully runnable without modification.

2.  NEVER use an em dash or an emoji anywhere. See Section 0 notes 1 and 2.

3.  NEVER hardcode a colour. Every colour comes from a token in `tokens.css`,
    and every token has a value in BOTH themes.

4.  NEVER use a spacing value off the 4px scale. Never set an outer margin on
    a component; use the parent's `gap`.

5.  ALWAYS add the architecture-justification comment at the top of every file
    named in Section 3. Examiners and judges will look.

6.  NEVER render a number without provenance. `MetricValue` requires it, so a
    missing source is a type error.

7.  NEVER call a keyed source from a client component. Lint rule enforces it.

8.  NEVER let the language model emit executable output. It emits a validated
    JSON intent against a whitelist, and the app executes the intent.

9.  ALWAYS assert groundedness on generated briefs: every numeral in the output
    must appear in the input context. HARD FAIL.

10. NEVER substitute zero for missing data in a score. Exclude the component
    and renormalise the remaining weights.

11. NEVER hide a low-trust citizen report. Show it, labelled unconfirmed.

12. ALWAYS handle all seven data states. `StateWrapper` is the only place
    loading and error markup lives.

13. ALWAYS give every map layer a table twin at a real URL.

14. NEVER run heavy geoprocessing at request time. Cold path only.

15. ALWAYS record adapter responses to fixtures on first success, and rehearse
    once in fixture mode with the laptop in airplane mode.

16. ALWAYS stamp `grid_version` on every artifact and assert it matches at boot.

17. NEVER display false precision from a raster estimate. Round per Section 8.2.

18. ALWAYS use cursor pagination. Never page number or offset.

19. ALWAYS add each dataset to `ATTRIBUTIONS.md` in the same commit that adds
    its adapter. CI diffs the registry against the file.

20. ALWAYS store timestamps in UTC and convert only at render. Asia/Karachi
    is UTC+5 with no daylight saving. Open-Meteo returns GMT unless you pass
    `timezone=Asia/Karachi`, so pass it explicitly so forecast HOURS align to
    local days, and still persist the absolute UTC instant. A naive local
    timestamp entering the store is a five-hour bug that surfaces as
    "smog arrives tomorrow" being wrong by a day.

21. ALWAYS convert air quality to PM2.5 micrograms per cubic metre inside the
    ADAPTER, using aqi-convert.ts. Never let an AQI value reach analytics,
    scoring, or the map. See ADR-9.

22. NEVER route at runtime. What-if and the optimiser read the precomputed
    reachability sets. See ADR-8.

23. NEVER grant the anon role an insert, update, or delete policy on any
    table. All writes go through a route handler with the service role key.
    See Section 6.7.

24. NEVER export an observation whose `exportable` flag is false. AQICN is
    display only; OpenAQ depends on the station. The export endpoint filters
    on this field, and no caller may override it. See Section 5.2.

25. NEVER store a raw IP address, device identifier, name, or phone number.
    The salted submitter hash is the only thing that persists about a person.

26. If generating files in batches, generate them in dependency-safe order:
    config and tokens, then schema, then migrations, then adapters, then
    analytics, then models, then route handlers, then components, then pages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 20 · CONSISTENCY INVARIANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consistency is not a review meeting. It is a set of statements that are either
true or false at any moment, most of them checkable in CI. If it cannot be
asserted, it will drift.

| Invariant                                              | Why                | Checked by                          |
|--------------------------------------------------------|--------------------|-------------------------------------|
| Every rendered number carries source and retrieval time| ADR-5, R02         | MetricValue prop is required        |
| Every artifact and observation shares one grid_version | ADR-1              | Boot assertion, refuses to load     |
| Every adapter has a contract test and a fixture        | ADR-4, demo safety | Contract suite enumerates registry  |
| Every map layer has a table twin at a real URL         | X03                | Route test per registered layer     |
| Every model has a declared baseline and a fallback     | Section 8          | Eval suite fails without one        |
| Every numeral in a brief appears in its input          | M11                | Groundedness check, hard fail       |
| Every data component handles all seven states          | Section 13         | State cases enumerated per component|
| Every user-visible string exists in en and ur          | X01                | Message key diff in CI              |
| No colour literal outside tokens.css                   | Section 9          | Lint rule on hex values             |
| Every token has a value in both themes                 | Section 9          | Token parity test                   |
| No spacing value off the 4px scale                     | Section 9.9        | Lint rule on raw px                 |
| No em dash or emoji in source or output                | Section 10         | Content lint rule                   |
| No keyed source imported outside app/api               | ADR-7              | Import restriction lint rule        |
| Every dataset appears in ATTRIBUTIONS.md               | Code of Conduct    | Registry diffed against the file    |
| Every table has RLS on and no anon write policy        | Section 6.7        | Migration test asserts pg_policies  |
| Every stored timestamp is UTC                          | Rule 20            | Lint ban on naive Date construction |
| No AQI value reaches analytics or the map              | ADR-9              | Type: Observation carries ug/m3 only|
| No routing call exists at runtime                      | ADR-8              | Lint ban on OSRM imports in src/app |
| No raw IP or device id is persisted anywhere           | Rule 25            | Schema review plus grep in CI       |
| No observation with exportable false leaves an export  | Section 5.2        | Export route test with a mixed set  |
| Every source in the adapter registry is in ATTRIBUTIONS| Code of Conduct    | Registry diffed against the file    |

THE TRACEABILITY CHAIN. Each feature ID must be followable in one direction
with no gaps:
  feature -> layer -> source -> model -> placement -> screen -> route -> file -> test
If any feature cannot complete that chain, it is NOT DESIGNED YET, whatever it
looks like on the map. Run the trace at every stage gate. It takes fifteen
minutes and it catches the two or three things that would otherwise be
discovered during judging.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 21 · PRE-DEVELOPMENT CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Things that, left undone, surface at hour thirty when there is no time to fix
them. Item 1 is urgent and is not optional.

  [ ]  1. SETTLE THE PRE-BUILDING QUESTION IN WRITING.
          The rules say all submitted work must be created during the hackathon
          period. Planning, scaffolding, and pre-written code are three
          different things and only the first is unambiguously safe. Email the
          organisers and get a written answer on repository scaffolding,
          pre-downloaded and pre-cleaned datasets, pre-trained models, and AI
          coding assistants. Keep the reply. One email removes the only risk
          here that can disqualify you no matter how good the build is.

  [ ]  2. Get every account and key issued and TESTED with one real call.
          A key that arrives by email approval on day two is a feature you did
          not ship.

  [ ]  3. Audit the licences, especially OpenStreetMap. OSM is ODbL, which
          carries share-alike obligations on DERIVED DATABASES, and that
          interacts directly with publishing your own open API (R04). WorldPop
          and Copernicus are attribution licences. Open-Meteo's free tier is
          non-commercial. Choose your project licence with these in front of you.

  [ ]  4. RESOLVE THE BOUNDARY PROBLEM. Your single biggest data risk. Union
          council boundaries for Lahore are not reliably available as open
          geodata. Check OSM admin levels 8 and 9 for actual coverage in your
          target area. If they are thin, fall back to Lahore's towns or tehsils
          and say so plainly. Every feature here assumes a boundary layer
          exists. Find out on day zero whether it does.

  [ ]  5. COUNT THE SENSORS. Query OpenAQ and AQICN for how many stations
          actually report in Lahore right now. The answer decides whether M1 is
          a real interpolation model or an honest uncertainty band over a
          forecast grid. Both are respectable; only one is what you should claim.

  [ ]  6. WRITE THE SANITY GATES BEFORE THE ETL. Lahore district's population
          is roughly 11 million on the 2023 census. If your WorldPop clip sums
          to four, you clipped wrong. Put these assertions in `etl/validate.py`
          and FAIL THE PIPELINE on them. A silently mis-clipped raster produces
          a beautiful map of nothing, and nobody catches it until a judge does.

  [ ]  7. DECIDE THE PRIVACY POLICY FOR CITIZEN PHOTOS. Reports will contain
          faces, number plates, and house numbers. The Code of Conduct forbids
          misusing personal data. Decide now: blur faces and plates
          automatically, strip EXIF beyond the coordinates you need, set a
          retention window, collect no names or phone numbers you do not use.
          Publish it on /about.

  [ ]  8. AGREE THE DESIGN SYSTEM BEFORE THE FIRST COMPONENT. Section 9 goes
          into `tokens.css` and `space.css` on day zero. Retrofitting a spacing
          scale onto forty components at hour thirty is how teams end up
          shipping the inconsistent version.

  [ ]  9. Confirm submission requirements with the organisers: presentation
          length, deck format, whether the repository must be public, whether a
          video is required, and how the demo is run (your laptop, their screen,
          or a shared machine). Design the demo for the ACTUAL constraint.

  [ ] 10. Assemble the physical and human prerequisites: a budget Android to
          test on, a fluent Urdu speaker to review X01 and M12, and at least
          one person who has used MapLibre before.

  [ ] 11. Agree the working rules: branch naming, review or push to main, who
          has deploy rights, WHEN THE CODE FREEZE IS (three hours before
          judging, not thirty minutes), and who presents.

  [ ] 12. STAND UP THE DEPLOYMENT ON DAY ZERO. An empty page on a real URL in
          the first hour is worth more than a perfect local build. Teams that
          leave deployment to the end demo from localhost, and localhost is
          where demos die.

  [ ] 13. Prepare the demo fallbacks: a fixture-mode run that works offline, a
          recorded screen capture of the full flow, a phone hotspot, and the
          laptop charger. In that order of usefulness.

  [ ] 14. VERIFY DOCKER DESKTOP AND WSL2 ON EVERY MACHINE, not just the one
          that runs the ETL. OSRM and tippecanoe are Linux binaries and there
          is no Windows-native path. This is an install, a reboot, and possibly
          a corporate policy problem. Discovering it at hour four costs a day.

  [ ] 15. DECIDE WHERE BUILD ARTIFACTS LIVE. PMTiles plus the WorldPop clip
          plus the parquet files can cross GitHub's 100 MB per-file hard limit
          and its 1 GB repository soft limit. Choose Git LFS or host them in
          Supabase Storage and fetch at build. Deciding this at the first push
          is a bad hour; deciding it now is five minutes.

  [x] 16. FOCUS DISTRICT: LAHORE DISTRICT. DECIDED. The whole district is
          gridded, so the demo's focus area is chosen BY THE DATA from the
          Civic Access Score ranking once the cold path lands, not guessed now.

  [ ] 16b. ESTABLISH WHICH ADMIN LEVEL OSM ACTUALLY CARRIES for Lahore.
          Query Overpass for admin_level 6, 7, 8, and 9 inside the district
          boundary and count complete polygons at each. Use the finest level
          with acceptable coverage and set NEXT_PUBLIC_ADMIN_LEVEL. Union
          councils are what the brief asks for; towns and tehsils are the
          fallback that reliably exists. Print the level in use in the footer
          so the interface never implies a precision the data does not have.
          This is a thirty-minute Overpass query and it de-risks the single
          biggest data unknown in the project.

  [ ] 17. SET THE TIMEZONE POLICY BEFORE THE FIRST ADAPTER. Store UTC, render
          in Asia/Karachi, request `timezone=Asia/Karachi` from Open-Meteo so
          forecast hours align to local days. Write it into time.ts on day one.

  [ ] 18. GENERATE VAPID KEYS for web push and put them in the environment.
          `npx web-push generate-vapid-keys`. Takes one minute and unblocks P04.

  [ ] 19. CONFIRM THE DEMO NUMBERS ARE REAL. Every figure in the demo script
          (Section 23) is a placeholder. As soon as the cold path lands,
          compute the actual exposure and access numbers for your chosen
          district and REWRITE THE SCRIPT around what is true. If the real
          access gap turns out small, the narrative changes, and you want to
          know that on day one rather than at the podium.

  [ ] 20. WRITE THE DEFINITION OF DONE, agreed by everyone: a feature is done
          when it has a test, handles all seven states, works at 360px, has
          provenance on its numbers, exists in both locales, and appears in the
          demo script. Anything else is IN PROGRESS, whatever the person
          building it says.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 22 · DELIVERY ORDER (BATCHED GENERATION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate the codebase in FIVE batches to maintain context and prevent code
drift. After each batch, verify all imports resolve and run the stated gate
before proceeding. Do not regenerate files from previous batches unless
explicitly asked.

BATCH 1: Foundation, tokens, and the design system
  1.  package.json, tsconfig.json, next.config.ts, .env.example
  2.  eslint.config.mjs INCLUDING the content rule (no em dash, no emoji),
      the token rule (no hex outside tokens.css), and the spacing rule
  3.  src/styles/tokens.css        every token, BOTH themes, Section 9
  4.  src/styles/space.css         the 4px scale
  5.  src/styles/type.css          Latin and Urdu stacks
  6.  src/styles/map-theme.json    MapLibre style, both themes
  7.  src/styles/print.css
  8.  config/scoring.json, config/thresholds.json, config/layers.json
  9.  src/lib/env.ts               zod-parsed environment
 10.  src/components/data/StateWrapper.tsx + module.css   ALL SEVEN STATES
 11.  src/components/data/MetricValue.tsx + module.css    reference component
 12.  src/components/data/ProvenanceTag.tsx + module.css
 13.  tests/tokens/parity.spec.ts  every token in both themes
 14.  tests/content/rules.spec.ts  no em dash, no emoji
 15.  LICENCE (MIT) and LICENCE-DATA (ODbL 1.0). See Section 5.2.
  GATE: token parity passes, the theme toggle works in all THREE theme states,
  and MetricValue renders correctly in every one of the seven states.

BATCH 2: Schema, adapters, and the cold path
  Restate in 8 lines or fewer only the Observation and SourceAdapter shapes.
  1.  src/lib/schema/observation.ts, hexcell.ts, report.ts, intent.ts, api.ts
  2.  src/lib/adapters/types.ts, registry.ts
  3.  src/lib/adapters/open-meteo.ts, open-meteo-aq.ts, overpass.ts, nominatim.ts
  4.  src/lib/adapters/openaq.ts, aqicn.ts        serverOnly
  5.  src/lib/adapters/punjab-epa.mock.ts, suthra-punjab.mock.ts, one-map.mock.ts
  6.  src/lib/h3/grid.ts, aggregate.ts, lookup.ts
  7.  src/lib/cache.ts, provenance.ts, format.ts
  8.  src/lib/models/aqi-convert.ts     ADR-9, with breakpoint boundary tests
  9.  src/lib/time.ts                    UTC store, PKT render
 10.  supabase/migrations/001_init.sql   tables, indexes, RLS (Section 6.7)
 11.  etl/00 through etl/09 including 09_reachability.py (ADR-8),
      etl/validate.py, and etl/environment.yml
 12.  tests/contract/ for every adapter
  GATE: contract suite green for all nine adapters, ETL runs end to end,
  population summed over all hexes lands within 10 percent of the census
  figure, reachability_h3.parquet exists and a spot-checked hex has a
  plausible 15-minute set, and a migration test confirms RLS is enabled on
  every table with NO anon write policy.

BATCH 3: Analytics, models, and route handlers
  Restate in 8 lines or fewer only the API response envelope.
  1.  src/lib/analytics/exposure.ts, access.ts, score.ts, hotspots.ts, compare.ts
  2.  src/lib/models/interpolate.ts, flood-index.ts, siting.ts, trust.ts, dedupe.ts
      siting.ts and the what-if handler read reachability_h3.parquet (ADR-8).
      Neither calls a routing engine.
  2b. src/lib/media/upload.ts and process.ts, src/lib/rate-limit.ts
  3.  src/lib/models/smog-forecast.ts    inference only, training is in etl
  4.  src/lib/models/prompts/            M7, M10, M11, M12, versioned files
  5.  All route handlers under src/app/api/v1/
  6.  tests/unit/ for analytics and scoring
  7.  tests/evals/ for M1, M2, M6, M7, M10, M11
  GATE: every shipped model beats its baseline or is disabled with a visible
  fallback, and the M11 groundedness check passes at 100 percent.

BATCH 4: Map, components, and pages
  Generate components before pages.
  1.  src/components/ui/            Button, Sheet, Toggle, Skeleton, Banner, Chip, SeverityChip
  2.  src/components/map/           MapCanvas, LayerRail, HexLayer, Legend, TimeScrubber, MapControls
  3.  src/components/panels/        SelectionPanel, ProfileCard, ForecastStrip, WhyThisValue, ScoreBars
  4.  src/components/tables/        DataTable, SortHeader
  5.  src/components/report/        CaptureStep, CategoryStep, ConfirmStep, TrustBadge
  6.  src/app/layout.tsx, page.tsx (Now)
  7.  src/app/map, area/[id], rankings, compare, plan, forecast
  8.  src/app/report, reports, alerts, sources, about
  9.  src/messages/en.json, ur.json
  GATE: every route renders, every map layer has its table twin, and the app is
  usable end to end at 360px on a real device.

BATCH 5: Accessibility, offline, and the demo harness
  1.  src/lib/i18n/                 config, direction, glossary.ur.json
  2.  public/manifest.webmanifest, public/sw.js
  3.  src/styles/print.css finalised, area/[id]/print.tsx
  4.  tests/a11y/routes.spec.ts
  5.  tests/e2e/demo-script.spec.ts  THE EIGHT BEATS
  6.  docs/ATTRIBUTIONS.md, METHODOLOGY.md, DEMO_SCRIPT.md, RUNBOOK.md
  7.  README.md, CONTRIBUTING.md, .claude/CLAUDE.md
  GATE: zero critical axe violations, a manual keyboard pass completed by hand,
  the whole flow run once on a budget phone, and ALL EIGHT DEMO BEATS PASSING
  IN FIXTURE MODE WITH THE LAPTOP IN AIRPLANE MODE.

Begin now by executing ONLY BATCH 1. Output the complete, runnable code for all
files in Batch 1. Do not proceed to Batch 2 until explicitly instructed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 23 · DEMO SCRIPT (REHEARSE THIS. NINETY SECONDS.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Judges remember one moment. Build backwards from this sequence. Anything that
does not serve it is a stretch goal, whatever else this document says. These
eight beats are also `tests/e2e/demo-script.spec.ts`.

  BEAT 1 · SEARCH A REAL NEIGHBOURHOOD
    Type "Shalimar Town" into the search field.
    No login, no setup, no explanation needed.
    Talking point: "A resident opens this and gets an answer, not a control panel."

  BEAT 2 · THE PROFILE RESOLVES LIVE
    Current AQI appears with the number of residents breathing it right now.
    Talking point: "Never a bare reading. Every number carries its people.
    That is the difference between a measurement and information."

  BEAT 3 · ACCESS BY ROAD, NOT BY CIRCLE
    "Nearest hospital 19 minutes. 12,400 people beyond a 15-minute drive from
    emergency care."
    Talking point: "Every other team draws circles. Circles are wrong in a city
    cut by canals, railways, and the Ravi. This is the real road network."

  BEAT 4 · LOOK FORWARD, NOT JUST AT NOW
    "Smog crossing hazardous in 41 hours. These four union councils, this
    arrival window."
    Talking point: "The theme asks for a predictive view. Open-Meteo gives
    forecast data for free, so there is no excuse not to build it."

  BEAT 5 · THE SYSTEM MAKES A RECOMMENDATION
    "A clinic sited here brings 31,000 of those people inside fifteen minutes.
    Here is the second-best site, and the third."
    Talking point: "This is beyond a dashboard. It is prescriptive, not
    descriptive, and it defends the recommendation with a number."

  BEAT 6 · HAND OVER THE MOUSE
    Let a judge drop their own pin and watch the coverage surface redraw.
    Talking point: say nothing. Let them play.

  BEAT 7 · CLOSE IN URDU, ON A PHONE
    Same brief, right to left, on a budget Android, exported as one page a
    councillor can print.
    Talking point: "A civic tool for Lahore that only speaks English serves the
    people who least need it."

  BEAT 8 · FLIP ON THE OFFICIAL FEED
    Toggle the mocked Punjab EPA adapter on the Sources screen. The map keeps
    working. Nothing was rebuilt.
    Talking point: "The brief asks us to design so an official feed can plug in
    later. Most teams say that on a slide. This is it working."

  IF ASKED "how do you know the smog forecast is right?"
    Show the backtest against the Open-Meteo archive and the baseline it beats.
    If you have not backtested it, say so plainly. A judge who asks and gets a
    shrug discounts everything else you said.

  EVERY NUMBER ABOVE IS A PLACEHOLDER. "12,400 beyond fifteen minutes" and
  "31,000 newly covered" show the SHAPE of the narrative, not results. Compute
  the real figures the moment the cold path lands and rewrite these beats
  around them. Presenting an invented number is the one thing on this page
  that would be dishonest rather than merely unpolished.

  IF ASKED "how do you stop people spamming the reports?"
    Open the trust score breakdown on an unconfirmed report and walk the five
    signals. Point out that low-trust reports are labelled, not hidden.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 24 · KNOWN LIMITATIONS (DOCUMENT HONESTLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These MUST appear in README.md and on /about. Judges reward intellectual
honesty. Claiming the system does everything is a red flag, and a technical
judge trusts the team that draws its own error bars far more than the team
whose interpolated surface implies sensors that do not exist.

  - SENSOR SCARCITY. Lahore has few public air quality stations. Values away
    from a station are interpolated, and the map renders that with hatching and
    a confidence band rather than a smooth surface that implies coverage we do
    not have.

  - NO OFFICIAL FEEDS. Suthra Punjab fleet data, Punjab EPA monitoring, and
    PITB One Map are not open to outside developers. Their adapters exist and
    are mocked. Nothing in this prototype claims to read them.

  - BOUNDARY QUALITY. Union council boundaries for Lahore are not reliably
    available as open geodata. Where OSM coverage is thin we fall back to towns
    or tehsils, and the interface says which unit it is using.

  - FLOOD RISK IS AN INDEX, NOT A PREDICTION. M3 is a rules-based topographic
    wetness index combined with rainfall forecast. It is not a calibrated
    hydrological model and it is labelled as an index everywhere it appears.

  - SINGLE DISTRICT SCOPE. The grid, road graph, and access surface are built
    for one district. Extending to all of Lahore is a rerun of the cold path,
    not a rewrite, but it has not been run.

  - NO GROUND TRUTH FOR REPORT TRUST. M6 ships as weighted rules because a
    hackathon produces no labelled corpus of genuine versus spam reports. The
    upgrade path to a calibrated logistic model is documented in its model card.

  - ENGLISH AND URDU ONLY. Punjabi and other languages spoken in Lahore are
    not supported.

  - POPULATION IS AN ESTIMATE. WorldPop is a modelled raster, not a census
    count. Figures are rounded to reflect that and should never be read as
    exact head counts.

  - ALERTS ARE WEB PUSH AND EMAIL ONLY. SMS was scoped out deliberately. It
    needs a paid gateway and it is the channel that would reach feature-phone
    users, who are among the people most exposed to bad air and flooding. That
    makes it the most valuable thing on the roadmap and the most honest gap to
    name out loud rather than gesture at.

  - NO AUTHENTICATION OR ROLES. Every view is public and reports are submitted
    anonymously by design, so that the tool does not exclude the people it
    exists to serve. A production deployment would need official accounts for
    the resolution workflow, report moderation, and an audit trail.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 25 · LAUNCH CHECKLIST (DO NOT PRESENT UNTIL ALL CHECKED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [ ] Two or more genuinely live data sources render on one map. The brief's
      hard requirement is met and visible.
  [ ] Every token defined in BOTH themes. Parity test green.
  [ ] Theme toggle correct in all three states: light stamped, dark stamped,
      and system unstamped.
  [ ] No em dash anywhere in source, messages, generated output, or the deck.
  [ ] No emoji anywhere in source, messages, generated output, or the deck.
  [ ] No hardcoded hex value outside tokens.css.
  [ ] No spacing value off the 4px scale.
  [ ] Every number on every screen shows a source and a retrieval time.
  [ ] Every map layer has a working table twin at a real URL.
  [ ] All seven data states implemented and visually verified.
  [ ] Estimated values are visibly labelled estimated, with a confidence band.
  [ ] Cells with no nearby sensor render as no data, not as a smoothed value.
  [ ] Civic Access Score formula printed on the Rankings screen with live weights.
  [ ] Score excludes missing components and renormalises. Never substitutes zero.
  [ ] Siting optimiser states its (1 - 1/e) guarantee. Does not claim optimality.
  [ ] Every model labelled ML, RULES, EXACT, STATS, or LLM in the interface.
  [ ] Every model beats its baseline in CI, or ships disabled with a fallback.
  [ ] Groundedness check on generated briefs passes at 100 percent.
  [ ] AQICN token is a REAL token, not `demo`. Verified the readings are Lahore.
  [ ] No API key present in any client bundle. Checked the built output.
  [ ] Urdu complete: every key present in ur.json, RTL correct, reviewed by a
      fluent speaker, Nastaliq line height not clipping.
  [ ] Zero critical axe violations across every route.
  [ ] Full keyboard pass completed by hand, including the map.
  [ ] Whole flow run once on a real budget Android over a throttled connection.
  [ ] Offline mode: cached tiles and last known values with timestamps.
  [ ] Print stylesheet produces a clean one-page neighbourhood summary.
  [ ] Mocked Punjab EPA adapter toggles on stage without breaking the map.
  [ ] ATTRIBUTIONS.md lists every dataset, library, model, and AI-assisted
      contribution with its licence.
  [ ] Limitations from Section 24 published on /about and in the README.
  [ ] Privacy policy for citizen photos published on /about.
  [ ] Deployed to a real URL. Not demoing from localhost.
  [ ] All eight demo beats pass in Playwright, in fixture mode, in airplane mode.
  [ ] Recorded fallback video exists.
  [ ] LICENCE (MIT) and LICENCE-DATA (ODbL 1.0) both present and correct,
      with the full canonical ODbL text appended and the contact email filled.
  [ ] AQICN values appear on the map and in NO export. Verified by calling
      /api/v1/export and grepping the payload for an AQICN sourceId.
  [ ] OpenAQ stations in exports all have redistributionAllowed true.
  [ ] World Air Quality Index attribution shown wherever an AQICN reading is.
  [ ] docs/ATTRIBUTIONS.md complete, including the AI-assistance section.
  [ ] "(c) OpenStreetMap contributors" visible on the map canvas.
  [ ] Export endpoints emit per-layer licences and a Link header to LICENCE-DATA.
  [ ] The admin level actually in use is printed in the interface footer.
  [ ] Row level security enabled on every table, with NO anon write policy.
      Verified by querying pg_policies, not by assuming.
  [ ] Anon key in the browser bundle can read reports and NOTHING else.
      Tested by attempting a write from the browser console.
  [ ] No raw IP, device id, name, or phone number anywhere in the database.
  [ ] Report images are blurred and EXIF-stripped, and the originals deleted.
  [ ] Rate limits active on every public write endpoint, returning 429 with
      Retry-After.
  [ ] Every timestamp stored in UTC and rendered in Asia/Karachi. Checked a
      forecast that crosses local midnight.
  [ ] No AQI value anywhere in analytics, scoring, or the map. Concentration only.
  [ ] What-if pin recomputes coverage with NO network request. Verified in the
      network panel.
  [ ] Every demo number recomputed from real data. No placeholders survive.
  [ ] Presenter can deliver the ninety seconds without looking at notes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF BUILD PROMPT
Endpoint behaviour, authentication, and CORS status in Section 5 were verified
directly against the live services in August 2026, not taken from documentation.
This document follows its own content rules: no em dashes, no emoji.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
