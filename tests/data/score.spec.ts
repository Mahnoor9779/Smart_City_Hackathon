import { describe, expect, it } from "vitest";
import { computeCivicScore } from "@/lib/data/score";
import type { AreaReading } from "@/lib/data/air";

function reading(pm25: number | null): AreaReading {
  return { pm25 } as unknown as AreaReading;
}

describe("computeCivicScore", () => {
  it("interpolates each band and applies the configured weights", () => {
    // lahore-city baseline: health 8 min, education 6 min, green 1.5, roads 18.
    const s = computeCivicScore("lahore-city", reading(35));
    const byId = Object.fromEntries(s.components.map((c) => [c.id, c.score]));
    expect(byId).toEqual({
      health: 88,
      education: 96,
      air: 80,
      green: 31,
      connectivity: 96,
    });
    // 88*.3 + 96*.2 + 80*.25 + 31*.15 + 96*.1 = 79.85
    expect(s.total).toBe(80);
    expect(s.grade).toBe("A");
  });

  it("marks only the live air component as measured", () => {
    const s = computeCivicScore("lahore-city", reading(35));
    const live = s.components.filter((c) => !c.isEstimated).map((c) => c.id);
    expect(live).toEqual(["air"]);
  });

  it("excludes a missing component and renormalises, never scoring it zero", () => {
    const s = computeCivicScore("lahore-city", reading(null));
    expect(s.components.map((c) => c.id)).not.toContain("air");
    // (26.4 + 19.2 + 4.65 + 9.6) / 0.75 = 79.8
    expect(s.total).toBe(80);
  });

  it("clamps values beyond the last breakpoint", () => {
    const s = computeCivicScore("lahore-city", reading(900));
    expect(s.components.find((c) => c.id === "air")?.score).toBe(0);
  });

  it("returns zero components for an unknown area with no reading", () => {
    const s = computeCivicScore("nowhere", undefined);
    expect(s.components).toEqual([]);
    expect(s.total).toBe(0);
  });
});
