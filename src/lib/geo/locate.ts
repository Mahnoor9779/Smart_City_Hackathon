/**
 * locate.ts
 *
 * Geodesic distance calculation and Tehsil resolution for Lahore District.
 *
 * CONCEPT: Haversine Formula (Great-Circle Distance).
 * The Earth is curved. Straight Euclidean geometry on latitude/longitude
 * coordinates introduces significant distortion because lines of longitude
 * converge toward the poles. The Haversine formula calculates the true
 * surface distance over an assumed spherical Earth of radius 6,371 km.
 *
 * RESOLUTION PIPELINE:
 * User Coordinates (lat, lon)
 *   -> District Centroid Distance Check (within 45 km threshold)
 *   -> Nearest Tehsil Centroid Comparison
 *   -> Result (Matched Tehsil + Distance, or Outside District)
 */

import { AREAS, type Area } from "./lahore";

/** Earth radius in kilometers (mean radius). */
const EARTH_RADIUS_KM = 6371;

/** Approximate center of Lahore District (lon, lat). */
export const LAHORE_DISTRICT_CENTER: readonly [number, number] = [74.3587, 31.5204];

/** Maximum expected distance from center to district edge in km (with ISP margin). */
export const LAHORE_DISTRICT_MAX_RADIUS_KM = 80;

/** Local storage key for persistent Tehsil selection. */
export const TEHSIL_STORAGE_KEY = "lns-detected-tehsil";

/**
 * Calculates great-circle distance between two points using the Haversine formula.
 *
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lon1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lon2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

export type TehsilResolution =
  | {
      status: "inside";
      area: Area;
      distanceKm: number;
    }
  | {
      status: "outside";
      area: Area;
      distanceFromLahoreKm: number;
    };

/**
 * Resolves a geographic coordinate to the nearest Lahore Tehsil.
 *
 * Calculates the closest Tehsil among the 5 administrative units.
 * If the coordinate is beyond the district threshold (80 km from center),
 * it returns status: "outside" while still providing the closest Tehsil.
 */
export function resolveTehsilFromCoords(
  lat: number,
  lon: number
): TehsilResolution {
  const first = AREAS[0];
  if (!first) {
    throw new Error("No areas configured");
  }
  let closestArea: Area = first;
  let minDistance = Infinity;

  for (const area of AREAS) {
    const [areaLon, areaLat] = area.lonLat;
    const dist = haversineDistanceKm(lat, lon, areaLat, areaLon);
    if (dist < minDistance) {
      minDistance = dist;
      closestArea = area;
    }
  }

  const [centerLon, centerLat] = LAHORE_DISTRICT_CENTER;
  const distFromCenter = haversineDistanceKm(lat, lon, centerLat, centerLon);

  if (distFromCenter > LAHORE_DISTRICT_MAX_RADIUS_KM) {
    return {
      status: "outside",
      area: closestArea,
      distanceFromLahoreKm: Math.round(distFromCenter),
    };
  }

  return {
    status: "inside",
    area: closestArea,
    distanceKm: Math.round(minDistance * 10) / 10,
  };
}

export interface SavedTehsil {
  areaId: string;
  savedAt: number;
}

/**
 * Retrieves the user's previously detected or selected Tehsil from localStorage.
 */
export function getSavedTehsil(): SavedTehsil | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(TEHSIL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.areaId === "string") {
      return parsed as SavedTehsil;
    }
  } catch {
    // Ignore JSON or storage errors
  }
  return null;
}

/**
 * Persists user's Tehsil choice to localStorage.
 */
export function saveTehsil(areaId: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const data: SavedTehsil = {
      areaId,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(TEHSIL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota or privacy mode
  }
}

/**
 * Clears the saved Tehsil from localStorage.
 */
export function clearSavedTehsil(): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(TEHSIL_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
