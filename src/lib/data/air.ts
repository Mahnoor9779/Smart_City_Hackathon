/**
 * air.ts
 *
 * Live air quality for every tehsil in Lahore District, from Open-Meteo.
 *
 * This is the one source that needs no key and sends permissive CORS headers,
 * which is why it is the platform's spine: the map has real data on it from the
 * first minute, with no account, no approval, and nothing to leak. ADR-7.
 *
 * HONESTY ABOUT RESOLUTION. Open-Meteo serves a model grid at roughly 0.1
 * degrees, about 11 km. Lahore District is 61 km across, so several tehsils
 * resolve to the same grid cell. That is why every reading here is marked
 * `interpolated` rather than `measured`, carries a confidence below one, and
 * renders through the "estimated" state. A smooth surface implying per-tehsil
 * sensors would be a lie the interface would tell on our behalf.
 */

import { AREAS } from "@/lib/geo/lahore";
import type { Provenance } from "@/lib/types";
import { severityForPm25 } from "@/lib/format";

const ENDPOINT = "https://air-quality-api.open-meteo.com/v1/air-quality";

export interface AreaReading {
  areaId: string;
  /** PM2.5 in micrograms per cubic metre. The canonical scale, ADR-9. */
  pm25: number | null;
  pm10: number | null;
  severityStep: ReturnType<typeof severityForPm25>;
  /** Next 24 hours, for the sparkline. */
  next24h: number[];
  /** The full 72 hour forecast, hour 0 being now. Drives the forecast chart. */
  series: { t: string; v: number }[];
  /** Highest value in the next 72 hours, and how far away it is. */
  peak: { value: number; inHours: number } | null;
  provenance: Provenance;
}

interface OpenMeteoPoint {
  latitude: number;
  longitude: number;
  current?: { time?: string; pm2_5?: number; pm10?: number };
  hourly?: { time?: string[]; pm2_5?: (number | null)[] };
}

function provenanceFor(retrievedAt: string, validAt?: string): Provenance {
  return {
    sourceId: "open-meteo-aq",
    sourceLabel: "Open-Meteo air quality",
    retrievedAt,
    ...(validAt ? { validAt } : {}),
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
    // The model grid is coarser than a tehsil, so this is never a direct
    // measurement of the area it is shown against.
    method: "interpolated",
    confidence: 0.62,
    exportable: true,
  };
}

/** Reading used when the network is unavailable, so the page still renders. */
function unavailable(areaId: string): AreaReading {
  return {
    areaId,
    pm25: null,
    pm10: null,
    severityStep: null,
    next24h: [],
    series: [],
    peak: null,
    provenance: provenanceFor(new Date().toISOString()),
  };
}

/**
 * One request for all five tehsils. Open-Meteo accepts comma-separated
 * coordinates and returns an array in the same order, which keeps this to a
 * single round trip rather than five.
 */
export async function fetchAirQuality(): Promise<AreaReading[]> {
  const lats = AREAS.map((a) => a.lonLat[1]).join(",");
  const lons = AREAS.map((a) => a.lonLat[0]).join(",");
  const url =
    `${ENDPOINT}?latitude=${lats}&longitude=${lons}` +
    `&current=pm2_5,pm10&hourly=pm2_5&forecast_days=3&timezone=Asia%2FKarachi`;

  let payload: OpenMeteoPoint[];
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`Open-Meteo returned ${res.status}`);
    const json: unknown = await res.json();
    payload = Array.isArray(json) ? (json as OpenMeteoPoint[]) : [json as OpenMeteoPoint];
  } catch {
    // Fail soft. The rest of the dashboard does not depend on this call, and a
    // dead feed must degrade to the "failed" state rather than a blank page.
    return AREAS.map((a) => unavailable(a.id));
  }

  const retrievedAt = new Date().toISOString();

  return AREAS.map((area, i) => {
    const point = payload[i];
    const pm25 = point?.current?.pm2_5 ?? null;
    const rawTimes = point?.hourly?.time ?? [];
    const rawValues = point?.hourly?.pm2_5 ?? [];
    const series: { t: string; v: number }[] = [];
    for (let h = 0; h < rawValues.length; h++) {
      const v = rawValues[h];
      const t = rawTimes[h];
      if (typeof v === "number" && typeof t === "string") series.push({ t, v });
    }
    const hourly = series.map((s) => s.v);

    let peak: AreaReading["peak"] = null;
    if (hourly.length > 0) {
      let best = 0;
      hourly.forEach((v, h) => {
        if (v > (hourly[best] as number)) best = h;
      });
      peak = { value: hourly[best] as number, inHours: best };
    }

    return {
      areaId: area.id,
      pm25,
      pm10: point?.current?.pm10 ?? null,
      severityStep: severityForPm25(pm25),
      next24h: hourly.slice(0, 24),
      series,
      peak,
      provenance: provenanceFor(retrievedAt, point?.current?.time),
    };
  });
}

/**
 * People living where the air is at or worse than a given severity step.
 * Feature D01: never a bare reading, always the reading and who it reaches.
 */
export function peopleAtOrAbove(
  readings: readonly AreaReading[],
  step: number
): number {
  return readings.reduce((total, r) => {
    const area = AREAS.find((a) => a.id === r.areaId);
    if (!area || r.severityStep === null || r.severityStep < step) return total;
    return total + area.populationEstimate;
  }, 0);
}

/** Population-weighted district mean, which is the number that describes the
 *  city rather than an average of five unequal places. */
export function districtMean(readings: readonly AreaReading[]): number | null {
  let num = 0;
  let den = 0;
  for (const r of readings) {
    const area = AREAS.find((a) => a.id === r.areaId);
    if (!area || r.pm25 === null) continue;
    num += r.pm25 * area.populationEstimate;
    den += area.populationEstimate;
  }
  return den === 0 ? null : num / den;
}

export function worstArea(
  readings: readonly AreaReading[]
): AreaReading | undefined {
  return [...readings]
    .filter((r) => r.pm25 !== null)
    .sort((a, b) => (b.pm25 as number) - (a.pm25 as number))[0];
}
