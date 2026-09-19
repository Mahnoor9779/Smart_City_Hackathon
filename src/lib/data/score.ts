/**
 * score.ts
 *
 * Civic Access Score computation. Implements the weighted formula from
 * config/scoring.json using live air quality data and baseline estimates
 * for the remaining four components (health, education, green, connectivity).
 *
 * These baseline estimates are clearly labelled as such in the UI, and will
 * be replaced by computed values when the OSRM cold-path pipeline is built
 * (Batch 2/3).
 */

import scoring from "@config/scoring.json";
import type { AreaReading } from "./air";

/**
 * Baseline estimates per tehsil. These are educated approximations from
 * OpenStreetMap facility density and road network density.
 *
 * They are NOT computed travel times. Every score derived from them is
 * labelled "estimated" in the interface.
 */
const BASELINES: Record<
  string,
  {
    healthMinutes: number;
    educationMinutes: number;
    greenM2PerResident: number;
    roadKmPerKm2: number;
  }
> = {
  "lahore-city": {
    healthMinutes: 8,
    educationMinutes: 6,
    greenM2PerResident: 1.5,
    roadKmPerKm2: 18,
  },
  "lahore-cantonment": {
    healthMinutes: 12,
    educationMinutes: 10,
    greenM2PerResident: 3.2,
    roadKmPerKm2: 14,
  },
  "model-town": {
    healthMinutes: 10,
    educationMinutes: 8,
    greenM2PerResident: 2.8,
    roadKmPerKm2: 15,
  },
  shalimar: {
    healthMinutes: 15,
    educationMinutes: 12,
    greenM2PerResident: 1.8,
    roadKmPerKm2: 12,
  },
  raiwind: {
    healthMinutes: 25,
    educationMinutes: 20,
    greenM2PerResident: 5.5,
    roadKmPerKm2: 7,
  },
};

interface ScoringBand {
  points: { at: number; score: number }[];
  direction: string;
}

/** Linear interpolation along scoring band breakpoints. */
function interpolateScore(value: number, band: ScoringBand): number {
  const pts = band.points;
  if (pts.length === 0) return 0;

  // For "lower-is-better" we use the points as-is
  // For "higher-is-better" we also use the points as-is (they go up)
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;

  if (band.direction === "lower-is-better") {
    if (value <= first.at) return first.score;
    if (value >= last.at) return last.score;
  } else {
    if (value <= first.at) return first.score;
    if (value >= last.at) return last.score;
  }

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    if (value >= a.at && value <= b.at) {
      const frac = (value - a.at) / (b.at - a.at);
      return a.score + frac * (b.score - a.score);
    }
  }

  return last.score;
}

export interface ComponentScore {
  id: string;
  label: string;
  value: number;
  score: number;
  weight: number;
  unit: string;
  isEstimated: boolean;
}

export interface CivicScore {
  areaId: string;
  total: number;
  components: ComponentScore[];
  grade: string;
}

function gradeFromScore(score: number): string {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

export function computeCivicScore(
  areaId: string,
  reading: AreaReading | undefined
): CivicScore {
  const baseline = BASELINES[areaId];
  const weights = scoring.weights as Record<string, number>;
  const bands = scoring.bands as Record<string, ScoringBand>;

  const components: ComponentScore[] = [];

  // Health access
  if (baseline) {
    const healthScore = interpolateScore(baseline.healthMinutes, bands.health!);
    components.push({
      id: "health",
      label: "Healthcare access",
      value: baseline.healthMinutes,
      score: Math.round(healthScore),
      weight: weights.health ?? 0.3,
      unit: "minutes",
      isEstimated: true,
    });
  }

  // Education access
  if (baseline) {
    const eduScore = interpolateScore(
      baseline.educationMinutes,
      bands.education!
    );
    components.push({
      id: "education",
      label: "Education access",
      value: baseline.educationMinutes,
      score: Math.round(eduScore),
      weight: weights.education ?? 0.2,
      unit: "minutes",
      isEstimated: true,
    });
  }

  // Air quality (LIVE data)
  if (reading?.pm25 !== null && reading?.pm25 !== undefined) {
    const airScore = interpolateScore(reading.pm25, bands.air!);
    components.push({
      id: "air",
      label: "Air quality",
      value: reading.pm25,
      score: Math.round(airScore),
      weight: weights.air ?? 0.25,
      unit: "ug/m3",
      isEstimated: false,
    });
  }

  // Green space
  if (baseline) {
    const greenScore = interpolateScore(
      baseline.greenM2PerResident,
      bands.green!
    );
    components.push({
      id: "green",
      label: "Green space",
      value: baseline.greenM2PerResident,
      score: Math.round(greenScore),
      weight: weights.green ?? 0.15,
      unit: "m2-per-resident",
      isEstimated: true,
    });
  }

  // Road connectivity
  if (baseline) {
    const connScore = interpolateScore(
      baseline.roadKmPerKm2,
      bands.connectivity!
    );
    components.push({
      id: "connectivity",
      label: "Road connectivity",
      value: baseline.roadKmPerKm2,
      score: Math.round(connScore),
      weight: weights.connectivity ?? 0.1,
      unit: "km-per-km2",
      isEstimated: true,
    });
  }

  // Renormalize weights to sum to 1.0 (per scoring.json rules)
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const total =
    totalWeight > 0
      ? Math.round(
          components.reduce(
            (sum, c) => sum + c.score * (c.weight / totalWeight),
            0
          )
        )
      : 0;

  return {
    areaId,
    total,
    components,
    grade: gradeFromScore(total),
  };
}
