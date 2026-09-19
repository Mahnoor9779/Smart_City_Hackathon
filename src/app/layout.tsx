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
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lahore Civic Nervous System",
  description:
    "Live air quality, population exposure, and access to care across Lahore District, on one map.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1215" },
  ],
};

const LOCALE_INIT_SCRIPT = `(function(){try{var l=localStorage.getItem("lns-locale");if(l==="ur"){document.documentElement.setAttribute("lang","ur");document.documentElement.setAttribute("dir","rtl");}}catch(e){}})();`;

// Production only. Dev chunk URLs are not content-hashed, so a cache-first
// worker would keep serving stale code after every edit. In dev, remove any
// worker left over from an earlier session for the same reason.
const SW_REGISTER_SCRIPT =
  process.env.NODE_ENV === "production"
    ? `(function(){if("serviceWorker"in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){});})}})();`
    : `(function(){if("serviceWorker"in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();})}).catch(function(){});}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = publicEnv.NEXT_PUBLIC_DEFAULT_LOCALE;
  const dir = locale === "ur" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Applies saved locale and theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: LOCALE_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: SW_REGISTER_SCRIPT }} />
      </head>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <LocaleProvider>
          <AppHeader />
          <main id="main">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
