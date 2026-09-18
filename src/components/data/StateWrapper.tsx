/**
 * StateWrapper
 *
 * The ONLY place loading, stale, partial, estimated, failed, and offline markup
 * lives. No data component renders its own. BUILD_PROMPT.md Section 13.
 *
 * Fully reactive to bilingual locale (English / Urdu).
 */

"use client";

import type { ReactNode } from "react";
import type { DataState } from "@/lib/types";
import { relativeAge, formatLocalTime } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./StateWrapper.module.css";

export interface SkeletonBlock {
  /** Percentage of the container width. */
  width: number;
  /** Spacing step, 1 to 9. Maps to the 4px scale. */
  height: 4 | 5 | 6 | 7;
}

const DEFAULT_SKELETON: readonly SkeletonBlock[] = [
  { width: 45, height: 4 },
  { width: 30, height: 6 },
];

export interface StateWrapperProps {
  state: DataState;
  children: ReactNode;
  /** Shape of the loading placeholder, so it matches what replaces it. */
  skeleton?: readonly SkeletonBlock[];
  /** Names the region for screen readers, e.g. "air quality for Shalimar Town". */
  label: string;
}

export function StateWrapper({
  state,
  children,
  skeleton = DEFAULT_SKELETON,
  label,
}: StateWrapperProps) {
  const { locale } = useLocale();

  switch (state.kind) {
    case "loading": {
      const loadText = locale === "ur" ? `${label} لوڈ ہو رہا ہے` : `Loading ${label}`;
      return (
        <div
          className={styles.skeleton}
          role="status"
          aria-live="polite"
          aria-label={loadText}
        >
          {skeleton.map((block, i) => (
            <span
              key={i}
              className={styles.skeletonLine}
              style={{
                width: `${block.width}%`,
                height: `var(--space-${block.height})`,
              }}
            />
          ))}
          <span className="visuallyHidden">{loadText}</span>
        </div>
      );
    }

    case "ready":
      return <div className={styles.ready}>{children}</div>;

    case "stale":
      return (
        <div className={styles.stale} data-state="stale">
          <div className={styles.dimmed}>{children}</div>
          <p className={styles.noteWarn}>
            {locale === "ur"
              ? `آخری ریکارڈ ${relativeAge(state.ageSeconds, locale)}۔ تازہ ترین دستیاب ڈیٹا دکھایا جا رہا ہے۔`
              : `Last reading ${relativeAge(state.ageSeconds, "en")}. Showing the most recent value we have.`}
          </p>
        </div>
      );

    case "partial":
      return (
        <div className={styles.partial} data-state="partial">
          {children}
          <p className={styles.note}>
            {locale === "ur"
              ? `${state.total - state.covered} از ${state.total} علاقوں میں قریبی سینسر موجود نہیں۔`
              : `${state.total - state.covered} of ${state.total} areas have no nearby sensor. Those are drawn hatched rather than estimated.`}
          </p>
        </div>
      );

    case "estimated":
      return (
        <div className={styles.estimated} data-state="estimated">
          {children}
          <p className={styles.noteWarn}>
            {locale === "ur"
              ? `تخمینہ شدہ، براہ راست پیمائش نہیں۔ درستگی کا تناسب ${Math.round(state.confidence * 100)} فیصد۔`
              : `Estimated, not measured. Confidence ${Math.round(state.confidence * 100)} percent. `}
            <a className={styles.link} href={state.methodUrl}>
              {locale === "ur" ? "طریقہ کار کی تفصیل" : "How this is calculated"}
            </a>
          </p>
        </div>
      );

    case "failed":
      return (
        <div className={styles.failed} role="alert" data-state="failed">
          <p className={styles.failedTitle}>
            {locale === "ur"
              ? `${state.what} دستیاب نہیں ہے۔`
              : `${state.what} is unavailable.`}
          </p>
          {state.stillWorking.length > 0 && (
            <p className={styles.note}>
              {locale === "ur"
                ? `دیگر فعال معلومات: ${state.stillWorking.join(", ")}۔`
                : `Still working: ${state.stillWorking.join(", ")}.`}
            </p>
          )}
          {state.retry && (
            <button type="button" className={styles.retry} onClick={state.retry}>
              {locale === "ur" ? "دوبارہ کوشش کریں" : "Try again"}
            </button>
          )}
        </div>
      );

    case "offline":
      return (
        <div className={styles.offline} data-state="offline">
          <div className={styles.dimmed}>{children}</div>
          <p className={styles.noteInfo}>
            {locale === "ur"
              ? `آپ آف لائن ہیں۔ محفوظ شدہ ڈیٹا برائے ${formatLocalTime(state.lastKnownAt)}۔`
              : `You are offline. Showing values saved at ${formatLocalTime(state.lastKnownAt)}.`}
          </p>
        </div>
      );
  }
}
