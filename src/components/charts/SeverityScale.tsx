/**
 * SeverityScale
 *
 * The six band ramp with a marker showing where a value sits.
 * Fully reactive to bilingual locale (English / Urdu).
 */

"use client";

import thresholds from "@config/thresholds.json";
import { severityForPm25, formatMetric, severityLabel } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./SeverityScale.module.css";

export interface SeverityScaleProps {
  /** Marker position. Omit for a plain legend. */
  value?: number | null;
  compact?: boolean;
}

export function SeverityScale({ value = null, compact = false }: SeverityScaleProps) {
  const steps = thresholds.severity.steps;
  const activeStep = severityForPm25(value);
  const { t, locale } = useLocale();

  return (
    <div className={styles.wrap} data-compact={compact ? "true" : undefined}>
      <ol className={styles.scale}>
        {steps.map((s) => {
          const isActive = activeStep === s.step;
          const bandName = t.severity[s.step] ?? s.label;
          const bandRange =
            s.max === null
              ? locale === "ur"
                ? "250 اور اس سے زیادہ"
                : "250 and above"
              : locale === "ur"
              ? `${s.max} تک`
              : `up to ${s.max}`;

          return (
            <li
              key={s.step}
              className={styles.band}
              data-step={s.step}
              data-active={isActive ? "true" : undefined}
            >
              <span className={styles.swatch} aria-hidden="true" />
              <span className={styles.bandText}>
                <span className={styles.bandLabel}>{bandName}</span>
                <span className={styles.bandRange}>{bandRange}</span>
              </span>
            </li>
          );
        })}
      </ol>

      {value !== null && activeStep !== null && (
        <p className={styles.marker}>
          {locale === "ur" ? (
            <>
              موجودہ ریڈنگ: <strong>{formatMetric(value)} &micro;g/m&sup3;</strong>،{" "}
              {t.severity[activeStep] ?? severityLabel(activeStep)}۔
            </>
          ) : (
            <>
              Right now: <strong>{formatMetric(value)} &micro;g/m&sup3;</strong>,{" "}
              {(t.severity[activeStep] ?? severityLabel(activeStep)).toLowerCase()}.
            </>
          )}
        </p>
      )}
    </div>
  );
}
