# Lahore Civic Nervous System

Live air quality, population exposure, weather, and civic access across Lahore
District's five tehsils, in English and Urdu.

Built for the **Smart City Hackathon Lahore**, Theme 2 "City Intelligence",
Problem Statement 1: a real-time nervous system for Lahore's civic data.

The governing idea, and the thing that separates this from a dashboard:

> Never show a bare reading. Show the reading, the number of people it affects,
> and what to do about it.

---

## Contents

1. [Quick start](#quick-start)
2. [How to use the app](#how-to-use-the-app)
3. [Features](#features)
4. [What is real and what is estimated](#what-is-real-and-what-is-estimated)
5. [Status](#status)
6. [Scripts](#scripts)
7. [Project layout](#project-layout)
8. [Rules the build enforces](#rules-the-build-enforces)
9. [Design system](#design-system)
10. [Data sources](#data-sources)
11. [Testing](#testing)
12. [Known limitations](#known-limitations)
13. [Licensing](#licensing)

---

## Quick start

You need **Node.js 18.18 or newer** and npm. Node 22 is recommended and pinned
in `.nvmrc`; the build is also verified on Node 18.20.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

**No API keys are needed.** Every feature that ships today reads from
Open-Meteo, which is keyless. The variables in `.env.example` belong to adapters
that are planned but not yet built (OpenAQ, AQICN, Supabase, Claude briefs, web
push), and the app runs with all of them empty.

### Running the production build

Offline mode only works in a production build, so use this to try it or to
demo on a laptop:

```bash
npm run build
npm start
```

Then open http://localhost:3000 as before.

### Deploying

The app is a standard Next.js 15 project and deploys to Vercel as is. Pages are
statically generated and refresh their data every 10 minutes, so no server-side
configuration is required.

---

## How to use the app

The header has two rows. The top row holds the brand and three controls:
**Detect Tehsil**, the **EN / اردو** language switch, and the theme switch
(match system, light, dark). The second row holds the six sections, described
below in the order they appear.

### Now (home page, `/`)

The one-screen answer to "how is the air in Lahore right now?"

- The big number is the **district average PM2.5** in micrograms per cubic
  metre, weighted by population, with its health band (Good to Hazardous).
- Below it: how many times over the WHO safe level that is, and **how many
  people** live where the air is Unhealthy or worse.
- The **smog early-warning banner** at the top has three states: Unhealthy air
  active now, a surge forecast to arrive within the next 48 hours (with how
  many hours are left before it), or all clear. It names the affected tehsils
  and the expected peak. Expand it for an hour-by-hour strip of the next 24
  hours.
- When the air is at "Unhealthy for sensitive groups" or worse, a **health
  advice card** says what to do: masks, windows, children, exercise.
- The **district map** shades each tehsil by its reading. **Hover over a tehsil,
  or Tab to it with the keyboard**, to see its name, reading, band and
  population. Click it to open that tehsil's page.
- Below the map, one card per tehsil. Click any card to open its page.

### Areas (`/areas`) and a tehsil page (`/areas/model-town` and so on)

`/areas` lists all five tehsils. Opening one shows its full profile:

- **Headline pills:** current PM2.5 and band, population, area in square km.
- **Air quality card** with the source, how old the reading is, and whether it
  is measured or estimated.
- **Worst in the next 3 days:** the peak forecast value, how many hours away it
  is, and which band it reaches.
- **The next three days:** an hourly forecast chart with the health thresholds
  drawn as dashed lines. Hover to read any hour.
- **Where this sits on the scale:** all six bands with the current one marked.
- **Health advice** for the current band.
- **Past 7 days and next 3 days:** one line, solid for the past and dashed for
  the forecast, split at a "NOW" marker.
- **Population affected over 72 hours:** one bar per hour. Bar height is the
  number of people exposed, colour is the band. The note under the chart states
  the assumption behind it.
- **Print summary** (top right): prints or saves a clean PDF of the page for a
  councillor or official. Navigation and buttons are hidden, colours are kept,
  and the footer is stamped with the date and the data source. Pressing Ctrl+P
  gives the same result.

### Rankings (`/rankings`)

All five tehsils in one table, **worst air first**: rank, PM2.5 with a bar for
quick comparison, band, population, area, and a link to each profile. On a
phone the table scrolls sideways inside its box.

### Compare (`/compare`)

Pick two tehsils from the two dropdowns (the **Swap** button flips them) and see
them side by side: which has worse air and by how much, which has more people
exposed and by what ratio, which is denser, and when each one's forecast peak
arrives. Each side links to its full profile.

### Weather (`/weather`)

One card per tehsil with the current temperature, feels-like, today's high and
low, a 72-hour temperature sparkline, wind speed and direction, humidity, rain
now, and total rain expected over 72 hours. A **Heat Warning** badge appears at
42 C and **Extreme Heat** at 46 C (limits in `config/thresholds.json`).

### Score (`/score`)

The **Civic Access Score**, 0 to 100, one card per tehsil, ranked best first,
with a letter grade (A to F). Each card breaks the score into its five parts
and their weights:

| Part | Weight | What it measures |
|---|---|---|
| Healthcare | 30% | Minutes to the nearest hospital or health unit |
| Air quality | 25% | PM2.5 right now (**live**) |
| Education | 20% | Minutes to the nearest school |
| Green space | 15% | Square metres of park per resident (WHO minimum is 9) |
| Roads | 10% | Road km per square km |

Parts marked **ESTIMATED** are baseline estimates, not computed values. See
[What is real and what is estimated](#what-is-real-and-what-is-estimated).
Weights and bands live in `config/scoring.json`. If a part is missing, it is
left out and the other weights are rescaled. It is never counted as zero.

### Detect Tehsil (header button)

Press it and allow location access when the browser asks. The app works out
which tehsil you are in and shows its reading and band, with a link to its
page. If you are outside Lahore District it tells you how far away you are. If
you deny permission nothing breaks; the button simply offers to try again.

### Language and theme

- **EN / اردو** switches every label, number format and page direction.
  Urdu renders right to left. The choice is remembered.
- The **theme switch** has three states: match your system, always light,
  always dark. The choice is remembered and applied before the page draws, so
  there is no flash.

### Offline and installing

In a production build (`npm run build && npm start`, or the deployed site):

- Pages you have opened are **saved on the device**. If the connection drops,
  opening them again shows the last copy you saw instead of an error.
- A page you have **never** opened shows a "You are offline" page.
- Browsers that support it offer **Install app** (in Chrome or Edge, the icon in
  the address bar). The installed app opens in its own window with the Lahore
  Civic Nervous System icon.

---

## Features

| Feature | Where | Data |
|---|---|---|
| District air quality, population exposure, 48-hour smog early warning | `/` | Open-Meteo, live |
| Interactive district map with hover and keyboard tooltips | `/`, tehsil pages | Open-Meteo, OSM boundaries |
| Tehsil profiles | `/areas`, `/areas/[id]` | Open-Meteo, census estimate |
| 72-hour forecast chart | Tehsil pages | Open-Meteo, live |
| 7-day history next to the 3-day forecast | Tehsil pages | Open-Meteo, live |
| Hour-by-hour population exposure | Tehsil pages | Open-Meteo plus population estimate |
| Health advice by band | `/`, tehsil pages | Severity bands in `config/thresholds.json` |
| Print or PDF summary | Tehsil pages | Page content |
| Rankings, worst first | `/rankings` | Open-Meteo, live |
| Side-by-side comparison | `/compare` | Open-Meteo, live |
| Weather and heat warnings | `/weather` | Open-Meteo, live |
| Civic Access Score | `/score` | Live air plus baseline estimates |
| Detect my tehsil | Header | Browser location, computed on the device |
| English and Urdu, right to left | Everywhere | |
| Light, dark and system themes | Everywhere | |
| Offline pages and installable app | Everywhere, production build | Service worker |

---

## What is real and what is estimated

Stated plainly because a judge who finds an overstatement discounts everything
else.

- **Live:** PM2.5, PM10, the 72-hour air forecast, the past 7 days, and all
  weather values. Fetched from Open-Meteo and refreshed every 10 minutes.
- **Modelled, not measured:** Open-Meteo air quality comes from a model grid of
  about 11 km, coarser than a tehsil. Every reading says "ESTIMATED", and the
  7-day history is labelled "Past", not "Observed".
- **Estimated baselines:** in the Civic Access Score, healthcare minutes,
  education minutes, green space and road density are hand-set approximations
  per tehsil (`src/lib/data/score.ts`). They are labelled ESTIMATED on screen
  and will be replaced by computed travel times once the OSRM road-graph
  pipeline is built.
- **Assumption:** the exposure chart counts 30% of residents as affected at the
  "Unhealthy for sensitive groups" level (children, over-65s, people with heart
  or lung conditions). That share is an assumption, not a census figure, and
  the chart says so.
- **Population:** apportioned from the 2023 census district total, not counted
  per tehsil. Shown as an estimate.

---

## Status

The core product runs end to end on live data. The planned H3 hexagon grid,
travel-time isochrones, citizen reports, keyed sources and AI briefs are not
built yet.

| Area | State |
|---|---|
| Design tokens, seven data states, provenance model | Done |
| Now, Areas, tehsil profiles, Rankings, Compare | Done |
| Weather, Civic Access Score, health advice | Done |
| History, exposure timeline, map tooltips, print | Done |
| English and Urdu, right to left, three themes | Done |
| Offline shell and installable app | Done |
| OpenAQ and AQICN station adapters (need keys) | Not started |
| H3 hexagon grid and MapLibre map | Not started |
| Hospital and school travel times (OSRM) | Not started |
| Citizen reports (Supabase) | Not started |
| AI situation briefs (Claude) | Not started |

---

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Full test suite |
| `npm run typecheck` | TypeScript, strict, no emit |
| `npm run lint` | ESLint |
| `npm run check` | Typecheck plus tests, the pre-commit gate |

`npm run build` also runs ESLint, and fails on an unused variable. Run it before
pushing, not just `npm test`.

---

## Project layout

```
BUILD_PROMPT.md            the complete build specification
docs/
  architecture.html        layers, flows, models, file structure
  feature-plan.html        features rated and mapped to judging criteria
  ATTRIBUTIONS.md          every dataset, library, font, and model, with licences
config/
  scoring.json             Civic Access Score weights and bands
  thresholds.json          severity bands, alert and heat limits, cache windows
  layers.json              layer registry
public/
  sw.js                    service worker: offline pages
  manifest.json            install metadata
  offline.html             shown for pages never opened before
  icon-192.png, icon-512.png
src/
  app/                     one folder per page: areas, compare, rankings,
                           score, weather; NowView.tsx is the home page
  components/
    charts/                ForecastChart, HistoryChart, ExposureTimeline,
                           SeverityScale, Sparkline
    data/                  MetricValue, ProvenanceTag, StateWrapper,
                           HealthAdvisory, SmogAlertBanner
    geo/                   TehsilLocator
    layout/                AppHeader, LocationPill
    map/                   DistrictMap
    ui/                    Icon, ThemeToggle, LocaleToggle, PrintButton
  lib/
    data/                  air.ts, weather.ts, score.ts: fetching and maths
    geo/                   lahore.ts: tehsil boundaries, centroids, population
    i18n/                  English and Urdu strings, locale context
    format.ts, types.ts, env.ts
  styles/                  tokens.css, space.css, type.css, print.css
tests/
  content/                 platform content rules
  data/                    score and weather maths
  geo/                     location lookup
  tokens/                  theme parity, contrast, severity ramp ordering
```

### Where to change things

- **A label or translation:** `src/lib/i18n/translations.ts`
- **A severity band, alert or heat limit:** `config/thresholds.json`
- **Score weights or bands:** `config/scoring.json`
- **Score baselines per tehsil:** `BASELINES` in `src/lib/data/score.ts`
- **A colour:** `src/styles/tokens.css`, in both themes

---

## Rules the build enforces

These are not style preferences. Each one fails `npm test`.

**No em dashes.** They render inconsistently across the Latin and Urdu font
stacks, break awkwardly in right-to-left layout, are handled unpredictably by
screen readers, and are a known tell of unedited machine-generated text, which
matters for a product whose briefs are model written.

**No emoji.** Screen readers announce them by full Unicode name, turning a
status chip into noise. They render differently on every platform, so a severity
marker becomes a different severity marker on another device. Using one as a
severity or category marker fails the non-text contrast requirement outright.

**No raw colour outside a token definition in `src/styles/`.** Every component
reads through `var()`, so both themes stay complete.

**No undefined custom property.** A `var(--name)` that no stylesheet defines
fails silently in the browser: a fill turns black, a colour turns inherited.
The suite fails instead.

**No severity fill used as text colour.** `--sev-1` to `--sev-6` are fills.
The light end is pale in the light theme and dark in the dark theme, so as text
it disappears. Text on a severity fill uses the matching `--sev-N-on` token.

**Every token defined in both themes, with identical values in the two dark
blocks.** A viewer on the default "system" setting with a dark operating system
gets the media-query block; a viewer who clicked "Dark" gets the `data-theme`
block. If those drift, two people see different colours and each looks correct
in isolation.

**No spacing value off the 4px scale, and no component sets its own outer
margin.** Sibling spacing comes from the parent's `gap`. This is what stops the
collapsed and doubled margins that make an interface look uneven in exactly the
screenshot that ends up in the deck.

---

## Design system

### Three theme states, not two

An explicit choice stamps `data-theme` on the root element. The default "system"
setting stamps **nothing**, so only `prefers-color-scheme` separates light from
dark there. `src/styles/tokens.css` handles all three, and the theme is applied
before first paint so a saved dark choice does not flash light.

### The severity ramp inverts between themes

In light, severity increases with **darkness**. In dark, it increases with
**luminance**. The invariant being preserved is visual weight against the
ground, not hue: the worst areas must be what the eye lands on first, and on a
dark map a dark purple area disappears.

Both ramps are asserted strictly monotonic by `tests/tokens/contrast.spec.ts`,
along with WCAG 2.2 AA contrast for every step's text on its own fill. Severity
always carries its band name as text, so it never depends on colour alone.

Steps are keyed to PM2.5 concentration in micrograms per cubic metre, with
boundaries at 12, 35, 55, 150 and 250. The Civic Access Score air bands use the
same breakpoints, so the scale is learned once.

### The seven data states

Every data component handles all of them, and `StateWrapper` is the only place
their markup lives: `loading`, `ready`, `stale`, `partial`, `estimated`,
`failed`, `offline`. A missing reading shows "No data", never a default band.

### Provenance is a type requirement

`MetricValue` requires a `provenance` prop, so a number without a source is a
**type error** rather than an oversight. Every value carries its source,
retrieval time, method, confidence, licence, and an `exportable` flag.

### Time zones

Open-Meteo returns Lahore wall-clock times with no offset. They are compared as
strings against Open-Meteo's own "current" time, never parsed with `new Date()`,
because the server's time zone (UTC on Vercel) would shift the past and forecast
split by five hours.

---

## Data sources

Access facts below were verified directly against the live services, not taken
from documentation. Two of them contradict the official hackathon brief.

| Source | Access | Used for | State |
|---|---|---|---|
| Open-Meteo air quality | keyless | PM2.5, PM10, forecast, 7-day history | In use |
| Open-Meteo forecast | keyless | Temperature, wind, humidity, rain | In use |
| OpenStreetMap | keyless | Tehsil boundaries (built into `lahore.ts`) | In use |
| 2023 census | open | District population, apportioned per tehsil | In use |
| Overpass, Nominatim | keyless, CORS open | Facilities, search | Planned |
| OpenAQ v3 | API key | Ground station readings | Planned |
| AQICN / WAQI | token | Station AQI | Planned |
| WorldPop, Copernicus, HDX | open | Population grid, heat, terrain | Planned |

**Two corrections to the brief.** The AQICN path it lists returns 404; the
correct one is `aqicn.org/city/lahore`. WorldPop's REST API moved to
`hub.worldpop.org/rest/data`.

**The AQICN demo token is a trap.** It ignores your query and returns Shanghai
data for any city and any coordinate pair. Testing with it produces
plausible-looking readings that are not Lahore.

### Two redistribution constraints

**AQICN is display only.** Their terms state the data "can not be redistributed
as cached or archived data". Those readings will appear on the map and in no
export.

**OpenAQ is conditional and machine readable.** `GET /v3/licenses` returns a
`redistributionAllowed` flag per licence, and the adapter will gate on it.

This is why the `Observation` record carries a required `exportable` boolean:
the licence question travels with the value rather than being remembered at the
export endpoint.

---

## Testing

```bash
npm test
```

55 tests across six suites:

- **Content rules:** em dashes, emoji, raw colour, 4px spacing, outer margins,
  undefined custom properties, severity fills as text.
- **Token parity:** every token defined in every theme block.
- **Contrast and ramp:** WCAG 2.2 AA for text, severity ramp ordering per theme.
- **Score maths:** band interpolation, weights, renormalisation when a part is
  missing, clamping.
- **Weather helpers:** compass directions, heat limits read from config, rain
  totals.
- **Location:** distance and tehsil lookup.

The token guards were **mutation tested**. Deliberately removing a token from
one theme, and separately changing a value in only one of the two dark blocks,
were both confirmed to fail the suite. The two newest content rules were checked
the same way, by reintroducing the bug each one guards against.

---

## Known limitations

- **Model data, not sensors.** All air quality is Open-Meteo model output on an
  11 km grid. Ground station adapters (OpenAQ, Punjab EPA) are not built.
- **Score baselines are estimates.** Four of the five score parts are hand-set
  per tehsil until real travel times are computed.
- **Five tehsils, not neighbourhoods.** The planned hexagon grid would give
  about 2,400 cells; today the smallest unit is the tehsil.
- **No official feeds.** Suthra Punjab fleet data, Punjab EPA monitoring, and
  PITB One Map are not open to outside developers. Nothing here claims to read
  them.
- **Population is an estimate.** Apportioned from the census district total,
  rounded to reflect that.
- **Offline needs a first visit.** A page is only available offline after it
  has been opened once online.
- **Alerts will ship as web push and email only.** SMS needs a paid gateway and
  is named as roadmap rather than gestured at.

---

## Licensing

Dual licensed, which is the standard civic-technology arrangement.

- **Code: MIT.** See `LICENCE`.
- **Published data: ODbL 1.0.** See `LICENCE-DATA`, which includes the full
  canonical licence text.
- **Documentation: CC BY 4.0.**

Layers derived from the OpenStreetMap road graph are a Derivative Database under
ODbL, so exports carry its share-alike clause. That clause reaches the
**database, never the software**, which is why the application stays MIT.

Every dataset, library, font, and model is recorded in `docs/ATTRIBUTIONS.md`,
as the Code of Conduct requires.

---

## Documents

- `BUILD_PROMPT.md` is the specification this is built from. Read it before
  contributing.
- `docs/architecture.html` and `docs/feature-plan.html` open in any browser.
