/**
 * types.ts
 *
 * Display-level types shared across components. The zod schemas that validate
 * data crossing a boundary live in src/lib/schema/ and are added in Batch 2;
 * these are the shapes the interface renders.
 */

/** Metrics the platform understands. ADR-9: air values are always PM2.5 in
 *  micrograms per cubic metre, never an AQI index. */
export type MetricId =
  | "pm2_5"
  | "pm10"
  | "temperature"
  | "precipitation"
  | "wind_speed"
  | "wind_direction"
  | "lst"
  | "ndvi"
  | "population"
  | "access_health_min"
  | "access_education_min"
  | "elevation"
  | "twi";

/** How a value came to exist. "measured" is only for a direct reading at a
 *  station. Everything else must say so in the interface. */
export type Method = "measured" | "interpolated" | "modelled" | "static";

/**
 * Provenance travels with every value. ADR-5.
 *
 * `exportable` is false when the upstream licence forbids redistribution. Such
 * a value may be DISPLAYED but must be dropped by every export endpoint.
 * AQICN is always false. OpenAQ is set per station from that station's
 * `redistributionAllowed`. See LICENCE-DATA section 4.
 */
export interface Provenance {
  sourceId: string;
  sourceLabel: string;
  retrievedAt: string;
  validAt?: string;
  licence: string;
  licenceUrl?: string;
  method: Method;
  confidence: number;
  exportable: boolean;
}

/** Severity steps 1 through 6, keyed to PM2.5 concentration. `null` is no data,
 *  which renders hatched rather than as a value. */
export type SeverityStep = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The seven states every data component handles. BUILD_PROMPT.md Section 13.
 *
 * Most hackathon dashboards implement one of these and break visibly on the
 * other six, usually while a judge is watching.
 */
export type DataState =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "stale"; ageSeconds: number }
  | { kind: "partial"; covered: number; total: number }
  | { kind: "estimated"; confidence: number; methodUrl: string }
  | {
      kind: "failed";
      what: string;
      stillWorking: string[];
      retry?: () => void;
    }
  | { kind: "offline"; lastKnownAt: string };

export type DataStateKind = DataState["kind"];

export const DATA_STATE_KINDS: readonly DataStateKind[] = [
  "loading",
  "ready",
  "stale",
  "partial",
  "estimated",
  "failed",
  "offline",
] as const;

/** The exposure twin. Never render a bare reading: show the value and the
 *  number of people it affects at the same visual weight. */
export interface Exposure {
  count: number;
  phrase: string;
}
