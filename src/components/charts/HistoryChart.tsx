/**
 * HistoryChart
 *
 * Past 7 days of PM2.5 alongside the existing 72h forecast.
 * A vertical "now" line separates past model values from forecast projection.
 * Horizontal dashed lines mark health thresholds at 12, 35, 55, 150, 250.
 *
 * Pure CSS and SVG, no charting library dependency.
 */

"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./HistoryChart.module.css";

interface HistoryChartProps {
  /** Past observations (oldest first). */
  history: { t: string; v: number }[];
  /** Future forecast (now first). */
  forecast: { t: string; v: number }[];
  areaName: string;
}

const THRESHOLDS = [
  { value: 12, label: "Good" },
  { value: 35, label: "Moderate" },
  { value: 55, label: "Sensitive" },
  { value: 150, label: "Unhealthy" },
  { value: 250, label: "V. Unhealthy" },
];

const W = 900;
const H = 260;
const PAD_L = 44;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 32;

export function HistoryChart({
  history,
  forecast,
  areaName,
}: HistoryChartProps) {
  const { locale } = useLocale();
  const all = [...history, ...forecast];

  if (all.length < 4) return null;

  const nowIndex = history.length;
  const maxVal = Math.max(
    ...all.map((p) => p.v),
    60
  );
  const yMax = Math.ceil(maxVal / 50) * 50;

  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  function x(i: number): number {
    return PAD_L + (i / (all.length - 1)) * plotW;
  }

  function y(v: number): number {
    return PAD_T + plotH - (v / yMax) * plotH;
  }

  // Build SVG path for history (solid) and forecast (dashed)
  function buildPath(points: { v: number }[], startIdx: number): string {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(startIdx + i).toFixed(1)},${y(p.v).toFixed(1)}`)
      .join(" ");
  }

  // Build area fill under the line
  function buildArea(points: { v: number }[], startIdx: number): string {
    if (points.length === 0) return "";
    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(startIdx + i).toFixed(1)},${y(p.v).toFixed(1)}`)
      .join(" ");
    const lastX = x(startIdx + points.length - 1);
    const firstX = x(startIdx);
    const baseY = y(0);
    return `${line} L${lastX.toFixed(1)},${baseY.toFixed(1)} L${firstX.toFixed(1)},${baseY.toFixed(1)} Z`;
  }

  const nowX = x(nowIndex > 0 ? nowIndex - 1 : 0);

  // Day labels
  const dayLabels: { x: number; label: string }[] = [];
  for (let i = 0; i < all.length; i += 24) {
    const point = all[i];
    if (!point) continue;
    const date = new Date(point.t);
    const label = date.toLocaleDateString(locale === "ur" ? "ur-PK" : "en-GB", {
      weekday: "short",
      day: "numeric",
    });
    dayLabels.push({ x: x(i), label });
  }

  const historyTitle = locale === "ur" ? "گزشتہ 7 دن اور اگلے 3 دن" : "Past 7 days and next 3 days";
  const nowLabel = locale === "ur" ? "ابھی" : "Now";
  const pastLabel = locale === "ur" ? "گزشتہ" : "Past";
  const futureLabel = locale === "ur" ? "پیش گوئی" : "Forecast";

  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} data-type="history" />
          {pastLabel}
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} data-type="forecast" />
          {futureLabel}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        role="img"
        aria-label={`${historyTitle}, ${areaName}`}
      >
        {/* Y-axis grid and threshold lines */}
        {THRESHOLDS.map((th) =>
          th.value < yMax ? (
            <g key={th.value}>
              <line
                x1={PAD_L}
                y1={y(th.value)}
                x2={W - PAD_R}
                y2={y(th.value)}
                className={styles.threshold}
              />
              <text
                x={PAD_L - 6}
                y={y(th.value) + 3}
                className={styles.thresholdLabel}
                textAnchor="end"
              >
                {th.value}
              </text>
            </g>
          ) : null
        )}

        {/* Zero line */}
        <line
          x1={PAD_L}
          y1={y(0)}
          x2={W - PAD_R}
          y2={y(0)}
          className={styles.baseline}
        />

        {/* History area fill */}
        {history.length > 0 && (
          <path d={buildArea(history, 0)} className={styles.historyArea} />
        )}

        {/* Forecast area fill */}
        {forecast.length > 0 && (
          <path
            d={buildArea(forecast, nowIndex)}
            className={styles.forecastArea}
          />
        )}

        {/* History line */}
        {history.length > 1 && (
          <path d={buildPath(history, 0)} className={styles.historyLine} />
        )}

        {/* Forecast line */}
        {forecast.length > 1 && (
          <path
            d={buildPath(forecast, nowIndex)}
            className={styles.forecastLine}
          />
        )}

        {/* Now divider */}
        <line
          x1={nowX}
          y1={PAD_T}
          x2={nowX}
          y2={H - PAD_B}
          className={styles.nowLine}
        />
        <text
          x={nowX}
          y={PAD_T - 4}
          className={styles.nowLabel}
          textAnchor="middle"
        >
          {nowLabel}
        </text>

        {/* Day labels */}
        {dayLabels.map((d, i) => (
          <text
            key={i}
            x={d.x}
            y={H - 8}
            className={styles.dayLabel}
            textAnchor="middle"
          >
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
