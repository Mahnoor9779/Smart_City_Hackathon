# Attributions

Lahore Civic Nervous System. Smart City Hackathon Lahore, Theme 2, Problem
Statement 1.

The Code of Conduct requires teams to "clearly acknowledge significant
third-party resources, datasets, code, models, or AI-generated content used in
their projects" and forbids violating software, data, or content licences. This
file is that acknowledgement. It is filled in as sources are added, not at the
end.

Code is licensed MIT (see `LICENCE`). Published data is licensed ODbL 1.0
(see `LICENCE-DATA`). This documentation is CC BY 4.0.

**Rule:** a source is added to this file in the same commit that adds its
adapter or its data file. CI diffs the adapter registry against this table and
fails on any source that is missing here.

---

## Data sources

All access and licence facts below were checked against the providers' own
published terms and live endpoints in August 2026.

| Source | Used for | Licence | Redistributable | Attribution required |
|---|---|---|---|---|
| OpenStreetMap (via Overpass, Nominatim, HOT Export, Geofabrik, HDX) | Roads, facilities, boundaries, road graph | ODbL 1.0 | Yes, under ODbL share-alike | Yes |
| WorldPop | Small-area population grid | CC BY 4.0 | Yes | Yes |
| Open-Meteo | Weather, rainfall, PM2.5, PM10, forecast and archive | CC BY 4.0 (data). Free API tier is non-commercial access | Prefer derived aggregates | Yes |
| Copernicus Data Space (Sentinel) | Land surface temperature, NDVI, terrain | Free, full and open with attribution | Yes | Yes |
| OpenAQ | Ground sensor readings | Varies per station. Read from the v3 Licenses resource | **Only where `redistributionAllowed` is true** | Per station |
| AQICN / World Air Quality Index | Live station readings for Lahore | Terms of Service, display only | **No. Excluded from all exports** | Yes |
| Pakistan Bureau of Statistics | 2023 census, district tables | Not stated site-wide | Establish per dataset or exclude | Assume yes |
| Bureau of Statistics Punjab | Provincial statistics | Not stated site-wide | Establish per dataset or exclude | Assume yes |
| Open Data Pakistan | Census figures, Punjab Development Statistics, Lahore property points | Not stated site-wide | Establish per dataset or exclude | Assume yes |

### Required attribution strings

Display these where the corresponding data appears.

**OpenStreetMap**, persistently in the map canvas corner:

> (c) OpenStreetMap contributors

**World Air Quality Index**, wherever an AQICN reading is shown:

> Air quality data from the World Air Quality Index project

Their API also returns an `attributions` array naming the individual monitoring
station operators. Render those alongside the reading.

**Copernicus**, wherever a satellite-derived layer appears:

> Contains modified Copernicus Sentinel data 2026

**WorldPop**, wherever a population figure appears:

> Population estimates from WorldPop, CC BY 4.0

**OpenAQ**, per station, using the `name` and `sourceUrl` returned by the v3
Licenses resource for that station's licence.

### Two hard constraints that came out of reading the terms

**AQICN is display only.** Their Terms of Service state that the data "can not
be redistributed as cached or archived data", "can not be sold or included in
sold packages", and "can not be used in paid applications or services".
Fetching live and rendering in our own interface is ordinary API use. Re-serving
those values to third parties through `/api/v1/export` is redistribution and is
not permitted. The adapter must therefore mark its observations
`exportable: false`, and the export endpoint must drop them.

**OpenAQ is conditional.** Terms vary by station, and OpenAQ exposes this
programmatically: `GET /v3/licenses` returns `commercialUseAllowed`,
`attributionRequired`, `shareAlikeRequired`, `modificationAllowed`,
`redistributionAllowed`, and `sourceUrl` for each licence. The adapter reads the
licence attached to each station and sets `exportable` from
`redistributionAllowed`. This is a machine-checkable gate, not a judgement call.

---

## Software and libraries

Listed at the level of direct dependencies. Full transitive trees are in
`package-lock.json` and `etl/environment.yml`.

| Library | Purpose | Licence |
|---|---|---|
| Next.js | Application framework | MIT |
| React | UI runtime | MIT |
| MapLibre GL JS | Map rendering | BSD 3-Clause |
| PMTiles | Tile archive format and reader | BSD 3-Clause |
| h3-js | Hexagonal spatial index | Apache 2.0 |
| turf.js | Geometry operations | MIT |
| zod | Schema validation | MIT |
| next-intl | Internationalisation | MIT |
| lucide-react | Icons | ISC |
| OSRM | Routing engine, build time only | BSD 2-Clause |
| tippecanoe | Tile generation, build time only | BSD 2-Clause |
| LightGBM | Smog forecast model | MIT |
| geopandas, rasterio, shapely | ETL geoprocessing | BSD 3-Clause |
| pandas, pyarrow | ETL data handling | BSD 3-Clause / Apache 2.0 |
| vitest, Playwright, axe-core | Testing | MIT / Apache 2.0 / MPL 2.0 |

Verify each licence against the installed version before submission. Versions
change and so do licences.

## Fonts

| Font | Used for | Licence |
|---|---|---|
| Archivo | Latin display and interface | SIL Open Font License 1.1 |
| Public Sans | Latin body | SIL Open Font License 1.1 |
| IBM Plex Mono | Data, labels, numerals | SIL Open Font License 1.1 |
| Noto Nastaliq Urdu | Urdu headings | SIL Open Font License 1.1 |
| Noto Sans Arabic | Urdu body and interface | SIL Open Font License 1.1 |

## Models

| Model | Kind | Basis |
|---|---|---|
| M1 AQI surface | Inverse distance weighting, optionally kriging | Trained on station readings from OpenAQ and AQICN |
| M2 Smog forecast | LightGBM residual correction | Trained on the Open-Meteo historical archive |
| M3 Flood index | Rules based, topographic wetness index | Copernicus DEM and rainfall forecast. Not a calibrated hydrological model |
| M5 Siting | Greedy maximum coverage | Deterministic algorithm, no training |
| M6 Report trust | Weighted rules | No training corpus exists. Upgrade path documented in its model card |
| M7, M10, M11, M12 | Large language model | Anthropic Claude, model id set by `LLM_MODEL` |

Model cards with data, method, limits, and measured baselines are in
`docs/model-cards/`.

## AI-assisted contributions

State plainly what was used and where. Fill this in honestly before submission.

- Planning documents, architecture, and this repository's scaffolding were
  drafted with assistance from Anthropic Claude.
- Generated situation briefs (M11) and Urdu localisation (M12) are produced at
  runtime by the model named in `LLM_MODEL` and are labelled as generated in the
  interface.
- `<FILL IN: any other AI assistance used during the build>`

---

## To complete before submission

- [ ] Fill in the project contact email in `LICENCE-DATA` section 6.
- [ ] Record the specific PBS, BoS Punjab, and Open Data Pakistan files actually
      used, with the licence stated for each, or confirm none were exported.
- [ ] Verify every library licence against its installed version.
- [ ] Complete the AI-assisted contributions section.
- [ ] Confirm the export endpoint drops every observation marked
      `exportable: false`.
