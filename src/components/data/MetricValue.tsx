/**
 * MetricValue
 *
 * THE MOST IMPORTANT COMPONENT IN THE PROJECT. Every number on every screen
 * renders through it, and its props make provenance structurally mandatory:
 * `provenance` is required, so a number without a source is a TYPE ERROR rather
 * than an oversight. ADR-5, feature R02.
 *
 * Two further rules are enforced here rather than left to discipline:
 *
 *   1. NEVER A BARE READING. The exposure twin renders directly beneath the
 *      value at comparable weight. A reading alone is a measurement; a reading
 *      next to the people it affects is information. Feature D01.
 *
 *   2. SEVERITY IS NEVER COLOUR ALONE. The band name renders as text beside the
 *      swatch, so the value survives greyscale printing and colour vision
 *      deficiency. Feature X02.
 *
 * If the value was not measured directly, the word "estimated" appears beside
 * the number itself, not hidden in a tooltip the reader has to find.
 */

import type { DataState, Exposure, Provenance, SeverityStep } from "@/lib/types";
import { formatMetric, formatUnit, severityLabel } from "@/lib/format";
import { StateWrapper, type SkeletonBlock } from "./StateWrapper";
import { ProvenanceTag } from "./ProvenanceTag";
import styles from "./MetricValue.module.css";

export interface MetricValueProps {
  value: number | null;
  unit: string;
  label: string;
  /** REQUIRED. There is no way to render a number without a source. */
  provenance: Provenance;
  /** The exposure twin. Renders beneath at comparable visual weight. */
  exposure?: Exposure;
  severityStep?: SeverityStep | null;
  size?: "hero" | "default" | "compact";
  state?: DataState;
}

export function MetricValue({
  value,
  unit,
  label,
  provenance,
  exposure,
  severityStep = null,
  size = "default",
  state = { kind: "ready" },
}: MetricValueProps) {
  const estimated = provenance.method !== "measured";
  const bandName = severityLabel(severityStep);

  // The placeholder mirrors the regions this instance actually renders, so the
  // layout does not jump when the data arrives. Label, value, then severity and
  // exposure only if those will be shown, then the provenance line.
  const skeleton: SkeletonBlock[] = [{ width: 45, height: 4 }];
  skeleton.push({ width: 30, height: size === "hero" ? 7 : 6 });
  if (severityStep !== null) skeleton.push({ width: 55, height: 4 });
  if (exposure) skeleton.push({ width: 100, height: 7 });
  skeleton.push({ width: 65, height: 4 });

  return (
    <StateWrapper state={state} label={label} skeleton={skeleton}>
      <figure className={styles.wrap} data-size={size}>
        <figcaption className={styles.label}>{label}</figcaption>

        <div className={styles.valueRow}>
          <span className={styles.value}>{formatMetric(value)}</span>
          {value !== null && (
            <span className={styles.unit}>{formatUnit(unit)}</span>
          )}
          {estimated && value !== null && (
            <span className={styles.estimated}>estimated</span>
          )}
        </div>

        {severityStep !== null && (
          <p className={styles.severity}>
            <span
              className={styles.swatch}
              data-step={severityStep}
              aria-hidden="true"
            />
            <span className={styles.severityLabel}>{bandName}</span>
          </p>
        )}

        {exposure && (
          <p className={styles.exposure}>
            <span className={styles.exposureCount}>
              {exposure.count.toLocaleString("en-US")}
            </span>{" "}
            <span className={styles.exposurePhrase}>{exposure.phrase}</span>
          </p>
        )}

        <ProvenanceTag provenance={provenance} />
      </figure>
    </StateWrapper>
  );
}
