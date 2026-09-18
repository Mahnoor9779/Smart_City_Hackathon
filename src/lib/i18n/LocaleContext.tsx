"use client";

/**
 * LocaleContext
 *
 * Provides reactive locale switching between English and Urdu.
 * Manages document text direction (ltr/rtl) and font stacks seamlessly.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { TRANSLATIONS, type Locale, type TranslationDict } from "./translations";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDict;
}

const STORAGE_KEY = "lns-locale";

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: TRANSLATIONS.en,
});

export function applyLocale(loc: Locale): void {
  const root = document.documentElement;
  root.setAttribute("lang", loc);
  root.setAttribute("dir", loc === "ur" ? "rtl" : "ltr");
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "ur") {
        setLocaleState(saved);
        applyLocale(saved);
      }
    } catch {
      // Ignore storage access errors in private modes
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    applyLocale(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore
    }
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: TRANSLATIONS[locale],
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
