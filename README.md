# Lahore Civic Nervous System

Live air quality, population exposure, and access to care across Lahore
District, on one map.

Built for the **Smart City Hackathon Lahore**, Theme 2 "City Intelligence",
Problem Statement 1: a real-time nervous system for Lahore's civic data.

The governing idea, and the thing that separates this from a dashboard:

> Never show a bare reading. Show the reading, the number of people it affects,
> and what to do about it.

---

## Status

**Batch 1 of 5 is complete and verified.** The design system, the seven data
states, and the provenance model are built and tested. The map, the adapters,
the models, and the real screens are not yet written.

| Batch | Scope | State |
|---|---|---|
| 1 | Design tokens, spacing, type, the seven states, provenance | **Done.** 35 tests passing |
| 2 | Schemas, nine source adapters, H3 helpers, Supabase migration, ETL cold path | Not started |
| 3 | Analytics, models, route handlers | Not started |
| 4 | Map, components, all screens | Not started |
| 5 | Accessibility, Urdu and RTL, offline, demo harness | Not started |

`/` currently renders a **reference gallery**, not the product: every one of the
seven data states, the full severity ramp, and the provenance panel, so the
Batch 1 gate is something you look at rather than something you assert. It is
replaced by the real Now screen in Batch 4.

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

Nothing in `.env.local` is required to run the reference gallery. Keys are only
needed once the keyed adapters land in Batch 2.

### Node version

This project runs on **Node 18.20.4**, pinned in `.nvmrc`. It uses Next 15.5.24
rather than Next 16 because Next 16 requires Node 20 or newer.

Two low-severity build-time advisories remain in the dependency tree, both in
PostCSS and both reachable only when processing attacker-controlled CSS. All CSS
here is authored in this repository, so they are not exploitable in this
application. They resolve on a future move to Node 20 and Next 16, which is
deliberately not being done mid-build.

---

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Full test suite |
| `npm run typecheck` | TypeScript, strict, no emit |
| `npm run lint` | ESLint |
| `npm run check` | Typecheck plus tests, the pre-commit gate |

---

## Project layout

```
BUILD_PROMPT.md          the complete build specification, 26 sections
docs/
  architecture.html      layers, flows, models, file structure
  feature-plan.html      37 features rated and mapped to judging criteria
  ATTRIBUTIONS.md        every dataset, library, font, and model, with licences
config/
  scoring.json           Civic Access Score weights and bands
  thresholds.json        severity, alerts, cache windows, trust cutoff
  layers.json            layer registry, drives the rail and the table twins
src/
  styles/                tokens.css, space.css, type.css, print.css
  lib/                   env, types, format
  components/data/       MetricValue, ProvenanceTag, StateWrapper
  components/ui/         ThemeToggle
  app/                   layout and the reference gallery
tests/
  tokens/                theme parity, contrast, severity ramp ordering
  content/               the platform content rules
```

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
dark map a dark purple hexagon disappears.

Both ramps are asserted strictly monotonic by `tests/tokens/contrast.spec.ts`,
along with WCAG 2.2 AA contrast for every step's text on its own fill. Severity
always carries its band name as text, so it never depends on colour alone.

Steps are keyed to PM2.5 concentration in micrograms per cubic metre, with
boundaries at 12, 35, 55, 150 and 250. The Civic Access Score air bands use the
same breakpoints, so the scale is learned once.

### The seven data states

Every data component handles all of them, and `StateWrapper` is the only place
their markup lives: `loading`, `ready`, `stale`, `partial`, `estimated`,
`failed`, `offline`.

Most hackathon dashboards implement one of these and break visibly on the other
six, usually while a judge is watching.

### Provenance is a type requirement

`MetricValue` requires a `provenance` prop, so a number without a source is a
**type error** rather than an oversight. Every value carries its source,
retrieval time, method, confidence, licence, and an `exportable` flag.

---

## Data sources

Access facts below were verified directly against the live services, not taken
from documentation. Two of them contradict the official hackathon brief.

| Source | Access | Path |
|---|---|---|
| Open-Meteo, weather and air quality | keyless, CORS open | browser, direct |
| Overpass, Nominatim | keyless, CORS open | browser, direct |
| Humanitarian Data Exchange | keyless, CORS open | build time |
| OpenAQ v3 | API key | server route handler |
| AQICN / WAQI | token | server route handler |
| WorldPop, Copernicus, census | open or account | build time, static |

**Two corrections to the brief.** The AQICN path it lists returns 404; the
correct one is `aqicn.org/city/lahore`. WorldPop's REST API moved to
`hub.worldpop.org/rest/data`.

**The AQICN demo token is a trap.** It ignores your query and returns Shanghai
data for any city and any coordinate pair. Testing with it produces
plausible-looking readings that are not Lahore.

### Two redistribution constraints

**AQICN is display only.** Their terms state the data "can not be redistributed
as cached or archived data". Those readings appear on the map and in no export.

**OpenAQ is conditional and machine readable.** `GET /v3/licenses` returns a
`redistributionAllowed` flag per licence, and the adapter gates on it.

This is why the `Observation` record carries a required `exportable` boolean:
the licence question travels with the value rather than being remembered at the
export endpoint.

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

## Testing

```bash
npm test
```

35 tests across three suites: theme token parity, palette contrast and ramp
ordering, and the platform content rules.

The token guards were **mutation tested**. Deliberately removing a token from
one theme, and separately changing a value in only one of the two dark blocks,
were both confirmed to fail the suite. That second case was originally missed,
and the guard exists because mutation testing found the gap.

---

## Known limitations

Documented honestly because a system that claims to do everything is a red flag,
and a judge who finds an overstatement discounts everything else.

- **Sensor scarcity.** Lahore has few public air quality stations. Values away
  from a station are interpolated, rendered with hatching and a confidence band
  rather than a smooth surface implying coverage that does not exist.
- **No official feeds.** Suthra Punjab fleet data, Punjab EPA monitoring, and
  PITB One Map are not open to outside developers. Their adapters exist and are
  mocked. Nothing here claims to read them.
- **Boundary quality.** Union council boundaries for Lahore are not reliably
  available as open geodata. The administrative level is a config value, and the
  level actually in use is printed in the interface footer.
- **Population is an estimate.** WorldPop is a modelled raster, not a census
  count. Figures are rounded to reflect that.
- **Alerts will ship as web push and email only.** SMS needs a paid gateway and
  is named as roadmap rather than gestured at.

---

## Documents

- `BUILD_PROMPT.md` is the specification this is built from. Read it before
  contributing.
- `docs/architecture.html` and `docs/feature-plan.html` open in any browser.
