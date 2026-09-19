/**
 * ExposureTimeline
 *
 * Population exposure hour by hour across the 72h forecast. Bar height is the
 * number of people exposed that hour; bar colour is the severity band. A
 * tehsil has one reading, so exposure is a step: everyone at "Unhealthy" or
 * worse, the sensitive-group share at step 3, nobody below.
 *
 * Feature D01: never a bare reading; every number carries its people.
 */

"use client";

import { severityForPm25 } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./ExposureTimeline.module.css";

interface ExposureTimelineProps {
  /** Hourly PM2.5 forecast values. */
  series: { t: string; v: number }[];
  /** Population of this area. */
  population: number;
}

const W = 900;
const H = 200;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 24;
const PAD_B = 28;

/**
 * Share of residents counted at step 3 ("Unhealthy for sensitive groups").
 * An assumption, not a census figure: children, over-65s and people with
 * respiratory or heart conditions. Printed under the chart.
 */
const SENSITIVE_SHARE = 0.3;
/** Bars with nobody exposed still get a sliver so the hour stays visible. */
const MIN_BAR = 2;

export function ExposureTimeline({
  series,
  population,
}: ExposureTimelineProps) {
  const { locale } = useLocale();

  if (series.length < 4) return null;

  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const barW = Math.max(2, plotW / series.length - 1);

  function exposedAtHour(pm: number): number {
    const step = severityForPm25(pm);
    if (step === null) return 0;
    if (step >= 4) return population;
    if (step === 3) return Math.round(population * SENSITIVE_SHARE);
    return 0;
  }

  const exposed = series.map((s) => exposedAtHour(s.v));

  // Peak is the first hour with the most people exposed, ties broken by PM.
  let peakIdx = 0;
  exposed.forEach((n, i) => {
    const best = exposed[peakIdx] as number;
    if (n > best || (n === best && (series[i]?.v ?? 0) > (series[peakIdx]?.v ?? 0))) {
      peakIdx = i;
    }
  });
  const peakExposed = exposed[peakIdx] ?? 0;
  const hoursAffected = exposed.filter((n) => n > 0).length;

  function x(i: number): number {
    return PAD_L + (i / series.length) * plotW;
  }

  function barHeight(n: number): number {
    if (population <= 0) return MIN_BAR;
    return Math.max(MIN_BAR, (n / population) * plotH);
  }

  const title =
    locale === "ur"
      ? "72 گھنٹوں میں آبادیاتی متاثرین"
      : "Population affected over 72 hours";
  const peakLabel =
    locale === "ur"
      ? `عروج: ${peakExposed.toLocaleString()} متاثرین`
      : `Peak: ${peakExposed.toLocaleString()} people exposed`;
  const note =
    locale === "ur"
      ? `${series.length} میں سے ${hoursAffected} گھنٹوں میں لوگ متاثر۔ مضر صحت یا بدتر پر پوری آبادی، حساس گروہوں کی سطح پر ${Math.round(SENSITIVE_SHARE * 100)}٪ (اندازہ)۔`
      : `People are exposed in ${hoursAffected} of the next ${series.length} hours. Full bar: every resident, at Unhealthy or worse. At the sensitive-groups level we count ${Math.round(SENSITIVE_SHARE * 100)}% of residents, an assumption.`;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {peakExposed > 0 && (
          <span className={styles.peak}>{peakLabel}</span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        role="img"
        aria-label={title}
      >
        {/* Bars */}
        {series.map((s, i) => {
          const step = severityForPm25(s.v);
          const bh = barHeight(exposed[i] ?? 0);
          return (
            <rect
              key={i}
              x={x(i)}
              y={PAD_T + plotH - bh}
              width={barW}
              height={bh}
              rx={1}
              className={styles.bar}
              data-step={step ?? "none"}
              data-peak={i === peakIdx ? "true" : undefined}
            />
          );
        })}

        {/* Peak marker */}
        <line
          x1={x(peakIdx) + barW / 2}
          y1={PAD_T}
          x2={x(peakIdx) + barW / 2}
          y2={PAD_T + plotH - barHeight(peakExposed) - 4}
          className={styles.peakLine}
        />
        <circle
          cx={x(peakIdx) + barW / 2}
          cy={PAD_T + plotH - barHeight(peakExposed) - 4}
          r={3}
          className={styles.peakDot}
        />

        {/* Hour labels every 12 hours */}
        {series.map((s, i) => {
          if (i % 12 !== 0) return null;
          return (
            <text
              key={`l${i}`}
              x={x(i) + barW / 2}
              y={H - 6}
              className={styles.hourLabel}
              textAnchor="middle"
            >
              {i === 0 ? (locale === "ur" ? "ابھی" : "Now") : `${i}h`}
            </text>
          );
        })}

        {/* Baseline */}
        <line
          x1={PAD_L}
          y1={PAD_T + plotH}
          x2={W - PAD_R}
          y2={PAD_T + plotH}
          className={styles.baseline}
        />
      </svg>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
