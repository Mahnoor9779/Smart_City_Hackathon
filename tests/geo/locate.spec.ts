/**
 * locate.spec.ts
 *
 * Tests for geodesic distance calculation and Lahore Tehsil resolution.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  haversineDistanceKm,
  resolveTehsilFromCoords,
  getSavedTehsil,
  saveTehsil,
  clearSavedTehsil,
  TEHSIL_STORAGE_KEY,
} from "../../src/lib/geo/locate";

describe("haversineDistanceKm", () => {
  it("calculates zero distance for identical coordinates", () => {
    const dist = haversineDistanceKm(31.5204, 74.3587, 31.5204, 74.3587);
    expect(dist).toBe(0);
  });

  it("calculates realistic distance between Lahore and Islamabad (~260-280 km)", () => {
    const lahore = { lat: 31.5204, lon: 74.3587 };
    const islamabad = { lat: 33.6844, lon: 73.0479 };
    const dist = haversineDistanceKm(
      lahore.lat,
      lahore.lon,
      islamabad.lat,
      islamabad.lon
    );
    expect(dist).toBeGreaterThan(250);
    expect(dist).toBeLessThan(290);
  });
});

describe("resolveTehsilFromCoords", () => {
  it("resolves coordinate in Model Town / Township area to Model Town Tehsil", () => {
    // Township / Model Town south approx 31.42, 74.33
    const res = resolveTehsilFromCoords(31.42, 74.33);
    expect(res.status).toBe("inside");
    if (res.status === "inside") {
      expect(res.area.id).toBe("model-town");
      expect(res.distanceKm).toBeGreaterThan(0);
    }
  });

  it("resolves coordinate in historic core to Lahore City Tehsil", () => {
    // Near Walled City / Lahore Fort approx 31.588, 74.315
    const res = resolveTehsilFromCoords(31.588, 74.315);
    expect(res.status).toBe("inside");
    if (res.status === "inside") {
      expect(res.area.id).toBe("lahore-city");
    }
  });

  it("resolves coordinate in DHA / Airport area to Lahore Cantonment Tehsil", () => {
    // Near Allama Iqbal Airport approx 31.521, 74.403
    const res = resolveTehsilFromCoords(31.47, 74.48);
    expect(res.status).toBe("inside");
    if (res.status === "inside") {
      expect(res.area.id).toBe("lahore-cantonment");
    }
  });

  it("resolves coordinate in Baghbanpura / Shalimar to Shalimar Tehsil", () => {
    // Near Shalimar Gardens approx 31.586, 74.382
    const res = resolveTehsilFromCoords(31.586, 74.42);
    expect(res.status).toBe("inside");
    if (res.status === "inside") {
      expect(res.area.id).toBe("shalimar");
    }
  });

  it("resolves coordinate in south-west to Raiwind Tehsil", () => {
    // Raiwind center approx 31.25, 74.21
    const res = resolveTehsilFromCoords(31.25, 74.21);
    expect(res.status).toBe("inside");
    if (res.status === "inside") {
      expect(res.area.id).toBe("raiwind");
    }
  });

  it("rejects coordinates outside Lahore District (>80 km from center) while returning closest tehsil", () => {
    // Islamabad (lat 33.68, lon 73.04)
    const res = resolveTehsilFromCoords(33.6844, 73.0479);
    expect(res.status).toBe("outside");
    if (res.status === "outside") {
      expect(res.distanceFromLahoreKm).toBeGreaterThan(80);
      expect(res.area.id).toBeDefined();
    }
  });
});

describe("localStorage persistence helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists and reads saved tehsil", () => {
    expect(getSavedTehsil()).toBeNull();
    saveTehsil("model-town");
    const saved = getSavedTehsil();
    expect(saved).not.toBeNull();
    expect(saved?.areaId).toBe("model-town");
    expect(saved?.savedAt).toBeGreaterThan(0);
  });

  it("clears saved tehsil", () => {
    saveTehsil("lahore-city");
    expect(getSavedTehsil()?.areaId).toBe("lahore-city");
    clearSavedTehsil();
    expect(getSavedTehsil()).toBeNull();
  });
});
