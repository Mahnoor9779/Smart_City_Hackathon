/**
 * env.ts
 *
 * Environment parsed and validated at boot. A missing required key is a startup
 * failure with a clear message, never a runtime `undefined` three screens deep.
 *
 * ADR-7 KEY BOUNDARY. Anything in `serverEnv` holds a secret and may only be
 * read inside src/app/api/. Importing it from a client component is a build
 * error by convention and a review failure in practice: a key in client code is
 * a key you have published.
 */

import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_GRID_VERSION: z.string().min(1).default("v1"),
  NEXT_PUBLIC_FOCUS_DISTRICT: z.string().min(1).default("lahore"),
  /** 9 union council, 7 town, 6 district. Set to the finest level OSM actually
   *  covers, and print it in the interface footer so the map never implies a
   *  precision the data does not have. */
  NEXT_PUBLIC_ADMIN_LEVEL: z.coerce.number().int().min(4).max(11).default(9),
  NEXT_PUBLIC_TILES_URL: z.string().default("/tiles/lahore.pmtiles"),
  NEXT_PUBLIC_DATA_MODE: z.enum(["live", "fixture"]).default("live"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["en", "ur"]).default("en"),
});

const serverSchema = z.object({
  OPENAQ_API_KEY: z.string().optional(),
  AQICN_TOKEN: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default("claude-sonnet-5"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SERVER_SALT: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),
});

function fail(where: string, error: z.ZodError): never {
  const lines = error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`);
  throw new Error(
    `Invalid ${where} environment.\n${lines.join("\n")}\n` +
      `See .env.example for every key this project reads.`
  );
}

/**
 * Next.js inlines NEXT_PUBLIC_ variables at build time only when referenced
 * statically, so they are listed explicitly rather than spread from process.env.
 */
const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_GRID_VERSION: process.env.NEXT_PUBLIC_GRID_VERSION,
  NEXT_PUBLIC_FOCUS_DISTRICT: process.env.NEXT_PUBLIC_FOCUS_DISTRICT,
  NEXT_PUBLIC_ADMIN_LEVEL: process.env.NEXT_PUBLIC_ADMIN_LEVEL,
  NEXT_PUBLIC_TILES_URL: process.env.NEXT_PUBLIC_TILES_URL,
  NEXT_PUBLIC_DATA_MODE: process.env.NEXT_PUBLIC_DATA_MODE,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
});

if (!parsedPublic.success) fail("public", parsedPublic.error);

export const publicEnv = parsedPublic.data;

/** Server-only. Throws if called from the browser, which is the point. */
export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error(
      "getServerEnv was called in the browser. Keyed sources go through a route " +
        "handler in src/app/api. See ADR-7."
    );
  }
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) fail("server", parsed.error);
  return parsed.data;
}

/** Human-readable name for the administrative level in use, printed in the
 *  footer so the interface never implies precision the data lacks. */
export function adminLevelLabel(level: number): string {
  switch (level) {
    case 9:
      return "union council";
    case 8:
      return "town";
    case 7:
      return "tehsil";
    case 6:
      return "district";
    default:
      return `admin level ${level}`;
  }
}
