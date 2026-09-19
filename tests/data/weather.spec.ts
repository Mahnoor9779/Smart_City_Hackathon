import { describe, expect, it } from "vitest";
import {
  heatSeverity,
  totalPrecipitation,
  windDirectionLabel,
} from "@/lib/data/weather";
import thresholds from "@config/thresholds.json";

describe("weather helpers", () => {
  it("maps degrees to the nearest compass point", () => {
    expect(windDirectionLabel(0)).toBe("N");
    expect(windDirectionLabel(90)).toBe("E");
    expect(windDirectionLabel(225)).toBe("SW");
    expect(windDirectionLabel(350)).toBe("N");
    expect(windDirectionLabel(null)).toBe("calm");
  });

  it("uses the heat thresholds from config", () => {
    const { warn, critical } = thresholds.alerts.temperature_max;
    expect(heatSeverity(warn - 0.1)).toBe("normal");
    expect(heatSeverity(warn)).toBe("warn");
    expect(heatSeverity(critical)).toBe("critical");
    expect(heatSeverity(null)).toBe("normal");
  });

  it("sums precipitation", () => {
    expect(totalPrecipitation([{ v: 0.5 }, { v: 1.25 }])).toBe(1.75);
    expect(totalPrecipitation([])).toBe(0);
  });
});
