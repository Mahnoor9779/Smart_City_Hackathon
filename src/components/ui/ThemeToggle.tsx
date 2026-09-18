/**
 * ThemeToggle
 *
 * Three states, not two: System, Light, Dark. BUILD_PROMPT.md Section 9.
 * Fully reactive to bilingual locale (English / Urdu).
 */

"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { Icon, type IconName } from "./Icon";
import styles from "./ThemeToggle.module.css";

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "lns-theme";

export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const { locale } = useLocale();

  const choices: readonly { value: ThemeChoice; label: string; icon: IconName }[] = [
    {
      value: "system",
      label: locale === "ur" ? "سسٹم کے مطابق" : "Match system",
      icon: "monitor",
    },
    {
      value: "light",
      label: locale === "ur" ? "روشن" : "Light",
      icon: "sun",
    },
    {
      value: "dark",
      label: locale === "ur" ? "تاریک" : "Dark",
      icon: "moon",
    },
  ];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        setChoice(saved);
        applyTheme(saved);
      }
    } catch {
      /* Private windows and blocked site data throw on access */
    }
  }, []);

  function choose(next: ThemeChoice) {
    setChoice(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Ignore */
    }
  }

  return (
    <fieldset className={styles.group}>
      <legend className="visuallyHidden">
        {locale === "ur" ? "تھیم کا انتخاب" : "Colour theme"}
      </legend>
      {choices.map((c) => (
        <label key={c.value} className={styles.option} title={c.label}>
          <input
            type="radio"
            name="theme"
            value={c.value}
            checked={choice === c.value}
            onChange={() => choose(c.value)}
            className={styles.input}
          />
          <span className={styles.pill}>
            <Icon name={c.icon} size={16} />
            <span className="visuallyHidden">{c.label}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

/** Applies a saved theme before first paint so a dark choice does not flash light. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
