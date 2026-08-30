/**
 * SeverityScale
 *
 * The six band ramp with a marker showing where a value sits.
 *
 * WHY THIS EXISTS. The ramp is not the red-to-green scale people expect, because
 * that one fails for roughly one in twelve men. An unfamiliar scale has to be
 * taught somewhere, and a legend that also shows "you are here" teaches it in
 * the moment it is needed rather than in a key nobody reads.
 *
 * Every band carries its numeric boundary, so the scale is legible without
 * colour at all.
 */

import thresholds from "@config/thresholds.json";
import { severityForPm25, severityLabel, formatMetric } from "@/lib/format";
import styles from "./SeverityScale.module.css";

export interface SeverityScaleProps {
  /** Marker position. Omit for a plain legend. */
  value?: number | null;
  compact?: boolean;
}

export function SeverityScale({ value = null, compact = false }: SeverityScaleProps) {
  const steps = thresholds.severity.steps;
  const activeStep = severityForPm25(value);

  return (
    <div className={styles.wrap} data-compact={compact ? "true" : undefined}>
      <ol className={styles.scale}>
        {steps.map((s) => {
          const isActive = activeStep === s.step;
          return (
            <li
              key={s.step}
              className={styles.band}
              data-step={s.step}
              data-active={isActive ? "true" : undefined}
            >
              <span className={styles.swatch} aria-hidden="true" />
              <span className={styles.bandText}>
                <span className={styles.bandLabel}>{s.label}</span>
                <span className={styles.bandRange}>
                  {s.max === null ? "250 and above" : `up to ${s.max}`}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      {value !== null && activeStep !== null && (
        <p className={styles.marker}>
          Right now: <strong>{formatMetric(value)} &micro;g/m&sup3;</strong>,{" "}
          {severityLabel(activeStep).toLowerCase()}.
        </p>
      )}
    </div>
  );
}
