/**
 * ThemeToggle
 *
 * Three states, not two: System, Light, Dark. BUILD_PROMPT.md Section 9.
 *
 * WHY A SEGMENTED CONTROL AND NOT A CYCLING BUTTON. A single icon button cannot
 * express "follow my system", and someone who chose that deliberately should not
 * lose it by tapping once. Three radios in a group keep all three reachable and
 * keyboard navigable with arrow keys for free.
 *
 * The label is visually hidden rather than removed: the icons carry the meaning
 * on screen, and each radio still has a real accessible name.
 */

"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "./Icon";
import styles from "./ThemeToggle.module.css";

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "lns-theme";
const CHOICES: readonly { value: ThemeChoice; label: string; icon: IconName }[] = [
  { value: "system", label: "Match system", icon: "monitor" },
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
];

export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        setChoice(saved);
        applyTheme(saved);
      }
    } catch {
      /* Private windows and blocked site data throw on access. "system" is
         already correct, so there is nothing to recover. */
    }
  }, []);

  function choose(next: ThemeChoice) {
    setChoice(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Preference is not persisted. The page still renders correctly. */
    }
  }

  return (
    <fieldset className={styles.group}>
      <legend className="visuallyHidden">Colour theme</legend>
      {CHOICES.map((c) => (
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
