/**
 * Root layout.
 *
 * Sets locale and text direction, applies the saved theme before first paint,
 * and provides the skip link and landmark regions the accessibility target
 * requires. BUILD_PROMPT.md Section 14.
 */

import type { Metadata, Viewport } from "next";
import { publicEnv } from "@/lib/env";
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
      </body>
    </html>
  );
}
