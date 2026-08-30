/**
 * Root layout.
 *
 * Sets locale and text direction, applies the saved theme before first paint,
 * and provides the skip link and landmark regions the accessibility target
 * requires. BUILD_PROMPT.md Section 14.
 */

import type { Metadata, Viewport } from "next";
import { publicEnv } from "@/lib/env";
import { ADMIN_LEVEL_LABEL, AREAS, DISTRICT_NAME } from "@/lib/geo/lahore";
import { THEME_INIT_SCRIPT } from "@/components/ui/ThemeToggle";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lahore Civic Nervous System",
  description:
    "Live air quality, population exposure, and access to care across Lahore District, on one map.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1215" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE;
  const dir = locale === "ur" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Applies a saved theme before first paint so a dark choice does not
            flash light. Runs before React hydrates. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <AppHeader />
        <main id="main">{children}</main>
        <footer>
          {/* The administrative level actually in use is printed here so the
              interface never implies a precision the data does not have. */}
          <p>
            {DISTRICT_NAME} &middot; {AREAS.length} {ADMIN_LEVEL_LABEL}s &middot; grid{" "}
            {publicEnv.NEXT_PUBLIC_GRID_VERSION} &middot; boundaries from OpenStreetMap,
            ODbL &middot; air quality from Open-Meteo, CC BY 4.0
          </p>
          <p>
            OpenStreetMap has no union council boundaries for Lahore, so areas are
            shown at {ADMIN_LEVEL_LABEL} level. Population figures are apportioned
            estimates, not census counts.
          </p>
        </footer>
      </body>
    </html>
  );
}
