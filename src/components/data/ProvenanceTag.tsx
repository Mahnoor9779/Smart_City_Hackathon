/**
 * ProvenanceTag
 *
 * Source, retrieval time, and licence for a single value. Expands to show the
 * method, the confidence, and a link to the source.
 *
 * Fully reactive to bilingual locale (English / Urdu).
 */

"use client";

import { useId, useState } from "react";
import type { Provenance } from "@/lib/types";
import { ageSeconds, relativeAge, formatLocalTime } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./ProvenanceTag.module.css";

export interface ProvenanceTagProps {
  provenance: Provenance;
}

export function ProvenanceTag({ provenance: p }: ProvenanceTagProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { locale } = useLocale();

  return (
    <div className={styles.wrap} data-provenance="true">
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.label}>{locale === "ur" ? "ماخذ" : "Source"}</span>
        <span className={styles.value}>
          {locale === "ur" && p.sourceLabel.includes("Open-Meteo")
            ? "اوپن میٹیو فضائی معیار"
            : p.sourceLabel}
        </span>
        <span className={styles.age}>
          {relativeAge(ageSeconds(p.retrievedAt), locale)}
        </span>
      </button>

      {open && (
        <dl className={styles.panel} id={panelId}>
          <div className={styles.row}>
            <dt>{locale === "ur" ? "حصول کا وقت" : "Retrieved"}</dt>
            <dd>{formatLocalTime(p.retrievedAt)}</dd>
          </div>
          {p.validAt && (
            <div className={styles.row}>
              <dt>{locale === "ur" ? "ریکارڈ کا وقت" : "Reading taken"}</dt>
              <dd>{formatLocalTime(p.validAt)}</dd>
            </div>
          )}
          <div className={styles.row}>
            <dt>{locale === "ur" ? "طریقہ کار" : "Method"}</dt>
            <dd>{methodWording(p.method, locale)}</dd>
          </div>
          <div className={styles.row}>
            <dt>{locale === "ur" ? "درستگی کا تناسب" : "Confidence"}</dt>
            <dd>
              {Math.round(p.confidence * 100)}{" "}
              {locale === "ur" ? "فیصد" : "percent"}
            </dd>
          </div>
          <div className={styles.row}>
            <dt>{locale === "ur" ? "لائسنس" : "Licence"}</dt>
            <dd>
              {p.licenceUrl ? (
                <a
                  className={styles.link}
                  href={p.licenceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.licence}
                </a>
              ) : (
                p.licence
              )}
            </dd>
          </div>
          {!p.exportable && (
            <div className={styles.row}>
              <dt>{locale === "ur" ? "استعمال کی شرائط" : "Reuse"}</dt>
              <dd className={styles.restricted}>
                {locale === "ur"
                  ? "صرف ڈسپلے کے لیے۔ یہ ڈیٹا اوپن ایکسپورٹ میں شامل نہیں۔"
                  : "Display only. This source does not permit redistribution, so this value is excluded from the open data export."}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

/** Method in words a resident would use, not a database enum. */
function methodWording(method: Provenance["method"], locale: "en" | "ur"): string {
  if (locale === "ur") {
    switch (method) {
      case "measured":
        return "براہ راست مانیٹرنگ اسٹیشن سے ریکارڈ شدہ";
      case "interpolated":
        return "قریبی اسٹیشنوں سے تخمینہ شدہ";
      case "modelled":
        return "ماڈل کے حسابی فارمولے پر مبنی";
      case "static":
        return "حوالہ جاتی مستقل ڈیٹا";
    }
  }

  switch (method) {
    case "measured":
      return "Measured directly at a monitoring station";
    case "interpolated":
      return "Estimated from nearby stations";
    case "modelled":
      return "Calculated by a model";
    case "static":
      return "Fixed reference data";
  }
}
