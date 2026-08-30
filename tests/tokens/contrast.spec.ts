/**
 * Palette contrast and severity ramp ordering.
 *
 * These assert the two claims the design makes that are easy to break and
 * impossible to spot by eye once a palette has forty entries:
 *
 *   1. Text meets WCAG 2.2 AA against the surface it actually sits on, in BOTH
 *      themes. 4.5:1 for body text, 3:1 for interface and graphical objects.
 *
 *   2. The severity ramp is strictly monotonic in perceived luminance, and in
 *      OPPOSITE directions per theme. In light, severity increases with
 *      darkness. In dark, it increases with luminance. The invariant being
 *      preserved is visual weight against the ground, not hue: the worst areas
 *      must be what the eye lands on first, and on a dark map a dark purple
 *      hexagon disappears. A ramp that is merely "different colours" fails
 *      this silently.
 *
 * BUILD_PROMPT.md Sections 9.6 and 14.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const RAW_CSS = readFileSync(resolve(process.cwd(), "src/styles/tokens.css"), "utf8");
/** Comments are stripped before parsing. Both selectors below also appear in
 *  the explanatory header of tokens.css, and matching the comment instead of
 *  the rule made every dark-palette lookup silently return the light block. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

const CSS = stripComments(RAW_CSS);

function blockBody(source: string, startIndex: number): string {
  const open = source.indexOf("{", startIndex);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error("Unbalanced braces in tokens.css");
}

function paletteFrom(selector: string): Record<string, string> {
  const body = blockBody(CSS, CSS.indexOf(selector));
  const out: Record<string, string> = {};
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    out[(m[1] as string).trim()] = (m[2] as string).trim();
  }
  return out;
}

const LIGHT = paletteFrom(":root {");
const DARK = paletteFrom(':root[data-theme="dark"]');

/** Relative luminance per WCAG 2.x. Hex only; rgba tokens are decorative
 *  overlays and are excluded by the callers below. */
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  if (h.length !== 6) throw new Error(`not a 6-digit hex: ${hex}`);
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (l1 + 0.05) / (l2 + 0.05);
}

const THEMES: readonly [string, Record<string, string>][] = [
  ["light", LIGHT],
  ["dark", DARK],
];

describe("text contrast, WCAG 2.2 AA", () => {
  const bodyPairs: readonly [string, string][] = [
    ["--text-primary", "--bg-canvas"],
    ["--text-primary", "--bg-surface"],
    ["--text-primary", "--bg-surface-alt"],
    ["--text-secondary", "--bg-canvas"],
    ["--text-secondary", "--bg-surface"],
    ["--text-tertiary", "--bg-surface"],
    ["--text-on-accent", "--accent"],
  ];

  for (const [themeName, palette] of THEMES) {
    for (const [fg, bg] of bodyPairs) {
      it(`${themeName}: ${fg} on ${bg} reaches 4.5:1`, () => {
        const ratio = contrast(palette[fg] as string, palette[bg] as string);
        expect(
          ratio,
          `${fg} on ${bg} in ${themeName} is ${ratio.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(4.5);
      });
    }

    // Non-text UI components need 3:1 rather than 4.5:1. The focus ring is
    // one: it communicates state and WCAG 1.4.11 applies. Border tokens are
    // decorative separators, not components or graphics needed to understand
    // content, so they are deliberately not asserted here.
    for (const t of ["--focus-ring"]) {
      it(`${themeName}: ${t} reaches 3:1 against the surface`, () => {
        const ratio = contrast(palette[t] as string, palette["--bg-surface"] as string);
        expect(
          ratio,
          `${t} in ${themeName} is ${ratio.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(3);
      });
    }
  }

  it("keeps disabled text below the threshold, so it can never carry meaning", () => {
    for (const [themeName, palette] of THEMES) {
      const ratio = contrast(
        palette["--text-disabled"] as string,
        palette["--bg-surface"] as string
      );
      expect(ratio, `${themeName} disabled text is ${ratio.toFixed(2)}:1`).toBeLessThan(
        4.5
      );
    }
  });
});

describe("severity ramp", () => {
  const steps = [1, 2, 3, 4, 5, 6] as const;

  it("light theme: severity increases with darkness", () => {
    const lums = steps.map((s) => luminance(LIGHT[`--sev-${s}`] as string));
    for (let i = 1; i < lums.length; i++) {
      expect(
        lums[i] as number,
        `step ${i + 1} is not darker than step ${i}`
      ).toBeLessThan(lums[i - 1] as number);
    }
  });

  it("dark theme: severity increases with luminance", () => {
    const lums = steps.map((s) => luminance(DARK[`--sev-${s}`] as string));
    for (let i = 1; i < lums.length; i++) {
      expect(
        lums[i] as number,
        `step ${i + 1} is not brighter than step ${i}`
      ).toBeGreaterThan(lums[i - 1] as number);
    }
  });

  it("gives every step readable text on its own fill", () => {
    for (const [themeName, palette] of THEMES) {
      for (const s of steps) {
        const ratio = contrast(
          palette[`--sev-${s}-on`] as string,
          palette[`--sev-${s}`] as string
        );
        expect(
          ratio,
          `${themeName} step ${s} text is ${ratio.toFixed(2)}:1 on its fill`
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("separates adjacent steps enough to be told apart", () => {
    // Adjacent bands must differ in luminance, which is what keeps the ramp
    // legible under deuteranopia and protanopia and in greyscale print.
    for (const [themeName, palette] of THEMES) {
      const lums = steps.map((s) => luminance(palette[`--sev-${s}`] as string));
      for (let i = 1; i < lums.length; i++) {
        const delta = Math.abs((lums[i] as number) - (lums[i - 1] as number));
        expect(
          delta,
          `${themeName} steps ${i} and ${i + 1} differ by only ${delta.toFixed(4)}`
        ).toBeGreaterThan(0.02);
      }
    }
  });
});
