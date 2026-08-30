/**
 * StateWrapper
 *
 * The ONLY place loading, stale, partial, estimated, failed, and offline markup
 * lives. No data component renders its own. BUILD_PROMPT.md Section 13.
 *
 * Most hackathon dashboards implement one of the seven states and break visibly
 * on the other six, usually while a judge is watching. Centralising them here is
 * what makes handling all seven cheap enough that it actually happens.
 *
 * Every message follows the copy rule: say WHAT BROKE, WHAT STILL WORKS, and
 * WHAT TO DO NEXT. Never a bare "no data".
 */

import type { ReactNode } from "react";
import type { DataState } from "@/lib/types";
import { relativeAge, formatLocalTime } from "@/lib/format";
import styles from "./StateWrapper.module.css";

/**
 * One block of the loading placeholder. The caller describes the shape of what
 * is coming, so the skeleton matches the final layout rather than being a
 * generic stack of bars that reflows the moment data lands.
 */
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
  switch (state.kind) {
    case "loading":
      return (
        <div
          className={styles.skeleton}
          role="status"
          aria-live="polite"
          aria-label={`Loading ${label}`}
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
          <span className="visuallyHidden">Loading {label}</span>
        </div>
      );

    case "ready":
      return <div className={styles.ready}>{children}</div>;

    case "stale":
      return (
        <div className={styles.stale} data-state="stale">
          <div className={styles.dimmed}>{children}</div>
          <p className={styles.noteWarn}>
            Last reading {relativeAge(state.ageSeconds)}. Showing the most recent
            value we have.
          </p>
        </div>
      );

    case "partial":
      return (
        <div className={styles.partial} data-state="partial">
          {children}
          <p className={styles.note}>
            {state.total - state.covered} of {state.total} areas have no nearby
            sensor. Those are drawn hatched rather than estimated.
          </p>
        </div>
      );

    case "estimated":
      return (
        <div className={styles.estimated} data-state="estimated">
          {children}
          <p className={styles.noteWarn}>
            Estimated, not measured. Confidence{" "}
            {Math.round(state.confidence * 100)} percent.{" "}
            <a className={styles.link} href={state.methodUrl}>
              How this is calculated
            </a>
          </p>
        </div>
      );

    case "failed":
      return (
        <div className={styles.failed} role="alert" data-state="failed">
          <p className={styles.failedTitle}>{state.what} is unavailable.</p>
          {state.stillWorking.length > 0 && (
            <p className={styles.note}>
              Still working: {state.stillWorking.join(", ")}.
            </p>
          )}
          {state.retry && (
            <button type="button" className={styles.retry} onClick={state.retry}>
              Try again
            </button>
          )}
        </div>
      );

    case "offline":
      return (
        <div className={styles.offline} data-state="offline">
          <div className={styles.dimmed}>{children}</div>
          <p className={styles.noteInfo}>
            You are offline. Showing values saved at{" "}
            {formatLocalTime(state.lastKnownAt)}.
          </p>
        </div>
      );
  }
}
