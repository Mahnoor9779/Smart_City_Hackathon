"use client";

/**
 * LocaleToggle
 *
 * Segmented control for toggling between English and Urdu (اردو).
 * Accessible button group with real language attributes and keyboard navigation.
 */

import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./LocaleToggle.module.css";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className={styles.group} role="group" aria-label="Language selection">
      <button
        type="button"
        className={styles.button}
        data-active={locale === "en"}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        lang="en"
      >
        EN
      </button>
      <button
        type="button"
        className={styles.button}
        data-active={locale === "ur"}
        onClick={() => setLocale("ur")}
        aria-pressed={locale === "ur"}
        lang="ur"
      >
        اردو
      </button>
    </div>
  );
}
