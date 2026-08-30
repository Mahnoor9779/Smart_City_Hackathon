/**
 * ProvenanceTag
 *
 * Source, retrieval time, and licence for a single value. Expands to show the
 * method, the confidence, and a link to the source.
 *
 * Never a bare icon. The word "Source" is always visible, because provenance
 * nobody can find is the same as no provenance: nobody navigates away to check.
 * Feature R02, ADR-5.
 */

"use client";

import { useId, useState } from "react";
import type { Provenance } from "@/lib/types";
import { ageSeconds, relativeAge, formatLocalTime } from "@/lib/format";
import styles from "./ProvenanceTag.module.css";

export interface ProvenanceTagProps {
  provenance: Provenance;
}

export function ProvenanceTag({ provenance: p }: ProvenanceTagProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={styles.wrap} data-provenance="true">
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.label}>Source</span>
        <span className={styles.value}>{p.sourceLabel}</span>
        <span className={styles.age}>{relativeAge(ageSeconds(p.retrievedAt))}</span>
      </button>

      {open && (
        <dl className={styles.panel} id={panelId}>
          <div className={styles.row}>
            <dt>Retrieved</dt>
            <dd>{formatLocalTime(p.retrievedAt)}</dd>
          </div>
          {p.validAt && (
            <div className={styles.row}>
              <dt>Reading taken</dt>
              <dd>{formatLocalTime(p.validAt)}</dd>
            </div>
          )}
          <div className={styles.row}>
            <dt>Method</dt>
            <dd>{methodWording(p.method)}</dd>
          </div>
          <div className={styles.row}>
            <dt>Confidence</dt>
            <dd>{Math.round(p.confidence * 100)} percent</dd>
          </div>
          <div className={styles.row}>
            <dt>Licence</dt>
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
              <dt>Reuse</dt>
              <dd className={styles.restricted}>
                Display only. This source does not permit redistribution, so this
                value is excluded from the open data export.
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

/** Method in words a resident would use, not a database enum. */
function methodWording(method: Provenance["method"]): string {
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
