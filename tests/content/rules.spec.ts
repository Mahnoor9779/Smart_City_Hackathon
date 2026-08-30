/**
 * Platform content rules, enforced as a build gate.
 *
 * These are binding on interface copy, generated text, documentation, and
 * source comments. See BUILD_PROMPT.md Section 10.
 *
 *   NO EM DASHES. They render inconsistently across the Latin and Urdu font
 *   stacks, break awkwardly in right-to-left layout, are handled unpredictably
 *   by screen readers, and are a known tell of unedited machine-generated text,
 *   which matters for a product whose briefs are model written.
 *
 *   NO EMOJI. Screen readers announce them by full Unicode name, turning a
 *   status chip into noise. They render differently on every platform, so a
 *   severity marker becomes a different severity marker on another device.
 *   Using one as a severity or category marker fails the non-text contrast
 *   requirement outright.
 *
 *   NO COLOUR LITERAL outside tokens.css, so both themes stay complete.
 *
 *   NO SPACING VALUE off the 4px scale, so the interface does not drift.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative, extname } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "config", "tests"];
const TEXT_EXT = new Set([".ts", ".tsx", ".css", ".json", ".md"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (TEXT_EXT.has(extname(full))) out.push(full);
  }
  return out;
}

const FILES = SCAN_DIRS.flatMap((d) => {
  const abs = resolve(ROOT, d);
  try {
    return walk(abs);
  } catch {
    return [];
  }
});

function read(f: string): string {
  return readFileSync(f, "utf8");
}

function rel(f: string): string {
  return relative(ROOT, f).replace(/\\/g, "/");
}

describe("content rules", () => {
  it("scans a non-trivial number of files", () => {
    expect(FILES.length).toBeGreaterThan(10);
  });

  it("contains no em dashes anywhere", () => {
    // Referenced by escape so this file does not trip its own rule.
    const EM_DASH = String.fromCharCode(0x2014);
    const offenders: string[] = [];
    for (const f of FILES) {
      read(f)
        .split("\n")
        .forEach((line, i) => {
          if (line.includes(EM_DASH)) offenders.push(`${rel(f)}:${i + 1}`);
        });
    }
    expect(offenders, `em dash found in: ${offenders.join(", ")}`).toEqual([]);
  });

  it("contains no emoji anywhere", () => {
    // Pictographic ranges. Box drawing, arrows in diagrams, and Arabic script
    // are deliberately not emoji and are allowed.
    const EMOJI =
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;
    const offenders: string[] = [];
    for (const f of FILES) {
      read(f)
        .split("\n")
        .forEach((line, i) => {
          if (EMOJI.test(line)) offenders.push(`${rel(f)}:${i + 1}`);
        });
    }
    expect(offenders, `emoji found in: ${offenders.join(", ")}`).toEqual([]);
  });

  it("keeps raw colour to token definitions inside src/styles", () => {
    // A component may never invent a colour. Palettes live in src/styles and
    // may only introduce colour on a line that DEFINES a custom property, so
    // every declaration everywhere reads through var().
    const HEX = /#[0-9a-fA-F]{3,8}\b/;
    const RGBA = /\brgba?\s*\(/;
    const DEFINES_TOKEN = /^\s*--[a-z0-9-]+\s*:/;
    const offenders: string[] = [];
    for (const f of FILES) {
      const r = rel(f);
      if (extname(f) !== ".css") continue;
      if (r.startsWith("tests/")) continue; // tests assert on literals by nature
      const isPalette = r.startsWith("src/styles/");
      read(f)
        .split("\n")
        .forEach((line, i) => {
          const t = line.trim();
          if (t.startsWith("/*") || t.startsWith("*")) return;
          if (!HEX.test(line) && !RGBA.test(line)) return;
          if (isPalette && DEFINES_TOKEN.test(line)) return;
          offenders.push(`${r}:${i + 1}  ${t}`);
        });
    }
    expect(
      offenders,
      `raw colour outside a token definition:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("keeps every spacing value on the 4px scale", () => {
    // Matches padding, margin, and gap declarations carrying a raw px value.
    const DECL = /\b(padding|margin|gap|row-gap|column-gap)[a-z-]*\s*:\s*([^;]+);/g;
    const PX = /(-?\d+(?:\.\d+)?)px/g;
    const offenders: string[] = [];
    for (const f of FILES) {
      if (extname(f) !== ".css") continue;
      const r = rel(f);
      if (r === "src/styles/space.css") continue; // the scale itself
      const src = read(f);
      // The visually-hidden clip idiom needs margin: -1px. It is defined once,
      // in globals.css, and is the single documented exception to the scale.
      const allowClipIdiom = r === "src/app/globals.css";
      let d: RegExpExecArray | null;
      while ((d = DECL.exec(src)) !== null) {
        const value = d[2] as string;
        let p: RegExpExecArray | null;
        while ((p = PX.exec(value)) !== null) {
          const n = Math.abs(parseFloat(p[1] as string));
          if (allowClipIdiom && d[1] === "margin" && value.trim() === "-1px") {
            continue;
          }
          if (n !== 0 && n % 4 !== 0) {
            const line = src.slice(0, d.index).split("\n").length;
            offenders.push(`${r}:${line}  ${d[1]}: ${value.trim()}`);
          }
        }
      }
    }
    expect(
      offenders,
      `spacing off the 4px scale:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("never sets an outer margin on a component root", () => {
    // Spacing between siblings comes from the parent's gap. A component that
    // sets its own outer margin reintroduces collapsing and doubling.
    const offenders: string[] = [];
    for (const f of FILES) {
      if (!f.endsWith(".module.css")) continue;
      read(f)
        .split("\n")
        .forEach((line, i) => {
          const m = /^\s*margin\s*:\s*([^;]+);/.exec(line);
          if (!m) return;
          const v = (m[1] as string).trim();
          if (v === "0" || v.startsWith("0 ") || v === "0 auto") return;
          offenders.push(`${rel(f)}:${i + 1}  margin: ${v}`);
        });
    }
    expect(
      offenders,
      `component sets its own outer margin:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
