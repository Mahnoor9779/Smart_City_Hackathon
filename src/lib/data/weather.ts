/**
 * weather.ts
 *
 * Live weather for every tehsil in Lahore District, from Open-Meteo.
 *
 * Same keyless, CORS-open source as air quality (ADR-7). Provides temperature,
 * wind speed, wind direction, precipitation, and humidity alongside a 72-hour
 * temperature and precipitation forecast.
 */

import thresholds from "@config/thresholds.json";
import { AREAS } from "@/lib/geo/lahore";
import type { Provenance } from "@/lib/types";

const ENDPOINT = "https://api.open-meteo.com/v1/forecast";

export interface WeatherReading {
  areaId: string;
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  precipitation: number | null;
  /** Next 72 hours of temperature, for the trend chart. */
  tempSeries: { t: string; v: number }[];
  /** Next 72 hours of precipitation, for the bar chart. */
  precipSeries: { t: string; v: number }[];
  /** Today's high and low temperature. */
  dailyHigh: number | null;
  dailyLow: number | null;
  provenance: Provenance;
}

interface OpenMeteoWeatherPoint {
  latitude: number;
  longitude: number;
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    precipitation?: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: (number | null)[];
    precipitation?: (number | null)[];
  };
  daily?: {
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
  };
}

function provenanceFor(retrievedAt: string, validAt?: string): Provenance {
  return {
    sourceId: "open-meteo-weather",
    sourceLabel: "Open-Meteo weather forecast",
    retrievedAt,
    ...(validAt ? { validAt } : {}),
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
    method: "interpolated",
    confidence: 0.7,
    exportable: true,
  };
}

function unavailable(areaId: string): WeatherReading {
  return {
    areaId,
    temperature: null,
    feelsLike: null,
    humidity: null,
    windSpeed: null,
    windDirection: null,
    precipitation: null,
    tempSeries: [],
    precipSeries: [],
    dailyHigh: null,
    dailyLow: null,
    provenance: provenanceFor(new Date().toISOString()),
  };
}

/** Compass direction from degrees. */
export function windDirectionLabel(deg: number | null): string {
  if (deg === null || !Number.isFinite(deg)) return "calm";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx] ?? "N";
}

/**
 * One request for all five tehsils. Same batching pattern as air quality.
 */
export async function fetchWeather(): Promise<WeatherReading[]> {
  const lats = AREAS.map((a) => a.lonLat[1]).join(",");
  const lons = AREAS.map((a) => a.lonLat[0]).join(",");
  const url =
    `${ENDPOINT}?latitude=${lats}&longitude=${lons}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation` +
    `&hourly=temperature_2m,precipitation` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&forecast_days=3&timezone=Asia%2FKarachi`;

  let payload: OpenMeteoWeatherPoint[];
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`Open-Meteo returned ${res.status}`);
    const json: unknown = await res.json();
    payload = Array.isArray(json)
      ? (json as OpenMeteoWeatherPoint[])
      : [json as OpenMeteoWeatherPoint];
  } catch {
    return AREAS.map((a) => unavailable(a.id));
  }

  const retrievedAt = new Date().toISOString();

  return AREAS.map((area, i) => {
    const point = payload[i];
    const c = point?.current;

    const rawTimes = point?.hourly?.time ?? [];
    const rawTemps = point?.hourly?.temperature_2m ?? [];
    const rawPrecip = point?.hourly?.precipitation ?? [];

    const tempSeries: { t: string; v: number }[] = [];
    const precipSeries: { t: string; v: number }[] = [];

    for (let h = 0; h < rawTimes.length; h++) {
      const t = rawTimes[h];
      if (typeof t !== "string") continue;
      const temp = rawTemps[h];
      if (typeof temp === "number") tempSeries.push({ t, v: temp });
      const precip = rawPrecip[h];
      if (typeof precip === "number") precipSeries.push({ t, v: precip });
    }

    return {
      areaId: area.id,
      temperature: c?.temperature_2m ?? null,
      feelsLike: c?.apparent_temperature ?? null,
      humidity: c?.relative_humidity_2m ?? null,
      windSpeed: c?.wind_speed_10m ?? null,
      windDirection: c?.wind_direction_10m ?? null,
      precipitation: c?.precipitation ?? null,
      tempSeries,
      precipSeries,
      dailyHigh: point?.daily?.temperature_2m_max?.[0] ?? null,
      dailyLow: point?.daily?.temperature_2m_min?.[0] ?? null,
      provenance: provenanceFor(retrievedAt, c?.time),
    };
  });
}

/** Check if temperature exceeds heat warning thresholds from thresholds.json. */
export function heatSeverity(
  temp: number | null
): "normal" | "warn" | "critical" {
  if (temp === null) return "normal";
  const { warn, critical } = thresholds.alerts.temperature_max;
  if (temp >= critical) return "critical";
  if (temp >= warn) return "warn";
  return "normal";
}

/** Total precipitation across the forecast in mm. */
export function totalPrecipitation(series: { v: number }[]): number {
  return series.reduce((sum, s) => sum + s.v, 0);
}
