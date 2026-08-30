/**
 * ForecastChart
 *
 * Seventy two hours of PM2.5 for one area.
 *
 * WHY THIS FORM. The data's job is change over time against a threshold, so it
 * is a line with an area fill, one series, one axis. The thing that makes it
 * useful rather than decorative is the THRESHOLD LINES: a resident does not care
 * that the number is 78, they care whether it crosses into unhealthy and when.
 * Only thresholds inside the visible range are drawn, so the chart adapts to a
 * clean day and a smog day without either looking empty or unreadable.
 *
 * DELIBERATELY NOT DONE. No second y-axis, ever. No number on every point, only
 * the peak is direct-labelled. No rainbow: one hue, and severity is carried by
 * the threshold bands rather than by recolouring the line, so the line stays one
 * readable stroke.
 *
 * ACCESSIBILITY. The series is summarised in the figure's accessible name, and
 * the same numbers exist as text in the facts beside it, so nothing here is
 * available only as a picture. Hovering is an enhancement, never the only route.
 */

"use client";

import { useId, useMemo, useState } from "react";
import thresholds from "@config/thresholds.json";
import { formatMetric, severityLabel, severityForPm25 } from "@/lib/format";
import styles from "./ForecastChart.module.css";

export interface ForecastChartProps {
  series: readonly { t: string; v: number }[];
  areaName: string;
}

const W = 720;
const H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

export function ForecastChart({ series, areaName }: ForecastChartProps) {
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const model = useMemo(() => {
    if (series.length < 2) return null;

    const values = series.map((p) => p.v);
    const maxV = Math.max(...values);
    const minV = Math.min(...values);
    // Anchor the floor at zero when the data is already close to it, otherwise
    // give the line room to breathe without exaggerating small changes.
    const yMax = Math.ceil((maxV * 1.12) / 10) * 10;
    const yMin = minV < yMax * 0.35 ? 0 : Math.floor((minV * 0.88) / 10) * 10;

    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (i / (series.length - 1)) * plotW;
    const y = (v: number) =>
      PAD.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;

    const line = series
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.v).toFixed(1)}`)
      .join(" ");
    const area =
      `${line} L${x(series.length - 1).toFixed(1)} ${(PAD.top + plotH).toFixed(1)}` +
      ` L${x(0).toFixed(1)} ${(PAD.top + plotH).toFixed(1)} Z`;

    // Only thresholds that actually fall inside the visible range.
    const bands = thresholds.severity.steps
      .filter((s) => s.max !== null && s.max > yMin && s.max < yMax)
      .map((s) => ({ value: s.max as number, label: s.label, y: y(s.max as number) }));

    let peakIndex = 0;
    values.forEach((v, i) => {
      if (v > (values[peakIndex] as number)) peakIndex = i;
    });

    // A tick every twelve hours keeps the axis readable at this width.
    const ticks = series
      .map((p, i) => ({ i, t: p.t }))
      .filter((d) => d.i % 12 === 0);

    return { x, y, line, area, bands, yMin, yMax, peakIndex, ticks, plotH, plotW };
  }, [series]);

  if (!model) {
    return (
      <p className={styles.empty}>
        No forecast available for {areaName} right now.
      </p>
    );
  }

  const { x, y, line, area, bands, peakIndex, ticks, plotH } = model;
  const active = hover ?? null;
  const activePoint = active !== null ? series[active] : undefined;
  const peakPoint = series[peakIndex];

  const summary =
    `PM2.5 forecast for ${areaName}, next 72 hours. ` +
    `Now ${formatMetric(series[0]?.v ?? null)}, ` +
    `peak ${formatMetric(peakPoint?.v ?? null)} micrograms per cubic metre ` +
    `in about ${peakIndex} hours.`;

  return (
    <figure className={styles.figure}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        role="img"
        aria-label={summary}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          const ratio = (px - PAD.left) / (W - PAD.left - PAD.right);
          const i = Math.round(ratio * (series.length - 1));
          setHover(i >= 0 && i < series.length ? i : null);
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className={styles.fillTop} />
            <stop offset="100%" className={styles.fillBottom} />
          </linearGradient>
        </defs>

        {/* Threshold lines. The point of the chart: where the health limits sit. */}
        {bands.map((b) => (
          <g key={b.value} className={styles.band}>
            <line x1={PAD.left} x2={W - PAD.right} y1={b.y} y2={b.y} />
            <text x={W - PAD.right} y={b.y - 6} className={styles.bandLabel}>
              {b.label} {b.value}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#${gradientId})`} className={styles.areaFill} />
        <path d={line} className={styles.line} />

        {/* Selective direct label: the peak only, never a number on every point. */}
        <g className={styles.peak}>
          <circle cx={x(peakIndex)} cy={y(peakPoint?.v ?? 0)} r={4.5} />
          <text
            x={x(peakIndex)}
            y={y(peakPoint?.v ?? 0) - 12}
            className={styles.peakLabel}
          >
            peak {formatMetric(peakPoint?.v ?? null)}
          </text>
        </g>

        {/* Now marker, so "left of this is history" is never ambiguous. */}
        <line
          x1={x(0)}
          x2={x(0)}
          y1={PAD.top}
          y2={PAD.top + plotH}
          className={styles.now}
        />

        {ticks.map((d) => (
          <text key={d.i} x={x(d.i)} y={H - 8} className={styles.tick}>
            {d.i === 0 ? "now" : `+${d.i}h`}
          </text>
        ))}

        {active !== null && activePoint && (
          <g className={styles.cursor}>
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={PAD.top + plotH}
            />
            <circle cx={x(active)} cy={y(activePoint.v)} r={5} />
          </g>
        )}
      </svg>

      <figcaption className={styles.caption}>
        {activePoint ? (
          <span className={styles.readout}>
            <strong>{formatMetric(activePoint.v)} &micro;g/m&sup3;</strong>
            <span className={styles.readoutBand}>
              {severityLabel(severityForPm25(activePoint.v))}
            </span>
            <span className={styles.readoutTime}>
              {active === 0 ? "now" : `in ${active} hours`}
            </span>
          </span>
        ) : (
          <span>
            Next 72 hours. Hover to read any hour. Lines mark the health
            thresholds.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
