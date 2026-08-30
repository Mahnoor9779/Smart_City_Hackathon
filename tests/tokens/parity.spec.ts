/**
 * Token parity.
 *
 * Every colour token defined for the light theme must also be defined for dark,
 * and vice versa. A token defined in only one theme is the single most common
 * cause of an unreadable dark mode: the component picks up the light value on a
 * dark ground, or inherits nothing at all.
 *
 * Also asserts the three-state structure, because a design that only handles
 * "light" and "dark" silently breaks for the majority of viewers, who are on
 * the default "system" setting where no data-theme attribute is stamped at all.
 *
 * BUILD_PROMPT.md Section 9.
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

/** Pull the body of a top-level block whose selector matches. */
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

function valuesIn(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    out[(m[1] as string).trim()] = (m[2] as string).trim();
  }
  return out;
}

function tokensIn(body: string): Set<string> {
  const names = new Set<string>();
  const re = /(--[a-z0-9-]+)\s*:/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) names.add(m[1] as string);
  return names;
}

function findBlock(selector: string): string {
  const idx = CSS.indexOf(selector);
  expect(idx, `tokens.css must contain a "${selector}" block`).toBeGreaterThan(-1);
  return blockBody(CSS, idx);
}

const light = tokensIn(findBlock(":root {"));
const mediaDark = tokensIn(findBlock(':root:not([data-theme="light"])'));
const stampedDark = tokensIn(findBlock(':root[data-theme="dark"]'));

describe("theme token parity", () => {
  it("defines a meaningful number of tokens", () => {
    expect(light.size).toBeGreaterThan(40);
  });

  it("defines every light token in the prefers-color-scheme dark block", () => {
    const missing = [...light].filter((t) => !mediaDark.has(t) && !isThemeNeutral(t));
    expect(missing, `missing from the media-query dark block: ${missing.join(", ")}`)
      .toEqual([]);
  });

  it("defines every light token in the data-theme dark block", () => {
    const missing = [...light].filter((t) => !stampedDark.has(t) && !isThemeNeutral(t));
    expect(missing, `missing from the data-theme dark block: ${missing.join(", ")}`)
      .toEqual([]);
  });

  it("introduces no token in a dark block that light does not define", () => {
    const strays = [...new Set([...mediaDark, ...stampedDark])].filter(
      (t) => !light.has(t)
    );
    expect(strays, `defined only in dark: ${strays.join(", ")}`).toEqual([]);
  });

  it("keeps the two dark blocks identical in names", () => {
    expect([...mediaDark].sort()).toEqual([...stampedDark].sort());
  });

  /**
   * And identical in VALUES, which name parity alone does not catch.
   *
   * This matters because the two blocks serve different people. A viewer on the
   * default "system" setting with a dark operating system gets the media-query
   * block. A viewer who clicked "Dark" gets the data-theme block. If the two
   * drift, those two viewers see different colours and nobody notices, because
   * each looks correct in isolation.
   *
   * Found by mutation testing: changing a value in one block passed every
   * assertion until this one existed.
   */
  it("keeps the two dark blocks identical in values", () => {
    const media = valuesIn(findBlock(':root:not([data-theme="light"])'));
    const stamped = valuesIn(findBlock(':root[data-theme="dark"]'));
    const drift: string[] = [];
    for (const [token, value] of Object.entries(media)) {
      if (stamped[token] !== value) {
        drift.push(`${token}: media "${value}" vs stamped "${stamped[token]}"`);
      }
    }
    expect(drift, `dark blocks disagree:\n${drift.join("\n")}`).toEqual([]);
  });

  it("guards the media query so an explicit light choice beats a dark OS", () => {
    expect(CSS).toContain(':root:not([data-theme="light"])');
  });

  it("handles all three theme states", () => {
    expect(CSS).toContain(":root {");
    expect(CSS).toContain("@media (prefers-color-scheme: dark)");
    expect(CSS).toContain(':root[data-theme="dark"]');
  });
});

/**
 * Spacing, radius, and type tokens are theme-neutral by design and live in
 * space.css and type.css, not here. Nothing in tokens.css should be neutral,
 * so this is currently empty and exists to make the intent explicit rather
 * than to excuse omissions.
 */
function isThemeNeutral(_token: string): boolean {
  return false;
}
