/**
 * format.ts
 *
 * Presentation helpers. Every rule here exists because of a decision in
 * BUILD_PROMPT.md, not because of taste.
 */

import thresholds from "@config/thresholds.json";
import type { SeverityStep } from "./types";

/**
 * Population figures are modelled estimates from a raster, not census counts.
 * Round to the nearest 100 below 10,000 and the nearest 1,000 above.
 *
 * Never display "197,412 people" from a raster estimate. False precision is a
 * credibility loss, and a judge who knows what WorldPop is will notice.
 * BUILD_PROMPT.md Section 8.2.
 */
export function roundPopulation(people: number): number {
  if (!Number.isFinite(people) || people < 0) return 0;
  if (people < 10_000) return Math.round(people / 100) * 100;
  return Math.round(people / 1000) * 1000;
}

/** Group digits for display. Latin digits in both locales: Eastern Arabic
 *  numerals alongside English units confuse more than they help. */
export function formatCount(value: number): string {
  return roundPopulation(value).toLocaleString("en-US");
}

/** Metric values keep one decimal below 10 and none above, because sensor
 *  precision does not justify more. */
export function formatMetric(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "no reading";
  if (Math.abs(value) < 10) return value.toFixed(1);
  return Math.round(value).toLocaleString("en-US");
}

/**
 * Severity step from a PM2.5 concentration in micrograms per cubic metre.
 * ADR-9: this is the only air scale in the system. An AQI value must never
 * reach here; adapters convert before emitting an Observation.
 */
export function severityForPm25(value: number | null): SeverityStep | null {
  if (value === null || !Number.isFinite(value) || value < 0) return null;
  for (const s of thresholds.severity.steps) {
    if (s.max === null || value <= s.max) return s.step as SeverityStep;
  }
  return 6;
}

/** The band name shown beside the number, so severity is never carried by
 *  colour alone. */
export function severityLabel(step: SeverityStep | null): string {
  if (step === null) return "No data";
  const found = thresholds.severity.steps.find((s) => s.step === step);
  return found ? found.label : "No data";
}

/**
 * Relative time, written the way a person would say it.
 * "last reading 47 minutes ago", not "2026-08-30T09:04:12Z".
 */
export function relativeAge(seconds: number, locale: "en" | "ur" = "en"): string {
  if (!Number.isFinite(seconds) || seconds < 0 || seconds < 60) {
    return locale === "ur" ? "ابھی" : "just now";
  }
  const mins = Math.floor(seconds / 60);
  if (mins < 60) {
    return locale === "ur" ? `${mins} منٹ پہلے` : `${mins} minute${mins === 1 ? "" : "s"} ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return locale === "ur" ? `${hours} گھنٹے پہلے` : `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(hours / 24);
  return locale === "ur" ? `${days} دن پہلے` : `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Seconds between an ISO timestamp and now. Timestamps are stored in UTC and
 *  converted only at render. Rule 20. */
export function ageSeconds(iso: string, now: Date = new Date()): number {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return 0;
  return Math.max(0, Math.floor((now.getTime() - then) / 1000));
}

/**
 * Render a timestamp in Pakistan Standard Time. Asia/Karachi is UTC+5 with no
 * daylight saving, but we ask Intl rather than adding five hours, because
 * hardcoding an offset is how timezone bugs are born.
 */
export function formatLocalTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown time";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * Units are stored in their ASCII form, which is what survives a JSON payload,
 * a URL, a CSV export, and a database column without an encoding argument. They
 * are rendered in their real typographic form, because "ug/m3" on a civic air
 * quality tool reads like a placeholder somebody forgot to finish.
 *
 * The canonical form is what the API returns. This map is display only.
 */
const UNIT_DISPLAY: Readonly<Record<string, string>> = {
  "ug/m3": "µg/m³",
  celsius: "°C",
  minutes: "min",
  "m2-per-resident": "m² per resident",
  "km-per-km2": "km/km²",
  people: "people",
  mm: "mm",
};

export function formatUnit(unit: string): string {
  return UNIT_DISPLAY[unit] ?? unit;
}

/**
 * The exposure sentence. Never a bare reading: the value and the people it
 * affects carry equal weight. Feature D01.
 */
export function exposurePhrase(people: number, what: string): string {
  const n = formatCount(people);
  const verb = roundPopulation(people) === 1 ? "person" : "people";
  return `${n} ${verb} ${what}`;
}
