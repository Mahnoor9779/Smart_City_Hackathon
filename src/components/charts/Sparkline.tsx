/**
 * Sparkline
 *
 * Twenty four hours of trend, at glyph size, inside a card.
 *
 * WHY NO HOVER OR AXES. At sixty pixels wide this is a word in a sentence, not a
 * chart: it answers "rising or falling" and nothing more precise. Adding a
 * tooltip would invite a reading the resolution cannot support. The exact
 * numbers live in the card beside it and in the full chart on the area page,
 * which is where precision belongs.
 *
 * It is aria-hidden for the same reason. The trend is stated in text next to it,
 * so a screen reader gets the meaning without being read a list of 24 numbers.
 */

import styles from "./Sparkline.module.css";

export interface SparklineProps {
  values: readonly number[];
  width?: number;
  height?: number;
}

export function Sparkline({ values, width = 96, height = 28 }: SparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 3;

  const x = (i: number) => (i / (values.length - 1)) * (width - pad * 2) + pad;
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  const line = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(values.length - 1).toFixed(1)} ${height} L${x(0).toFixed(1)} ${height} Z`;

  const last = values[values.length - 1] as number;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={styles.svg}
      aria-hidden="true"
      focusable="false"
    >
      <path d={area} className={styles.fill} />
      <path d={line} className={styles.line} />
      {/* The endpoint is emphasised because "where it ends up" is the question
          a sparkline is actually answering. */}
      <circle cx={x(values.length - 1)} cy={y(last)} r={2.5} className={styles.end} />
    </svg>
  );
}

/** Plain-language trend, so the sparkline is never the only carrier. */
export function trendWord(values: readonly number[]): string | null {
  if (values.length < 4) return null;
  const head = values.slice(0, Math.floor(values.length / 3));
  const tail = values.slice(-Math.floor(values.length / 3));
  const avg = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const delta = avg(tail) - avg(head);
  const pct = (delta / (avg(head) || 1)) * 100;
  if (pct > 12) return "rising";
  if (pct < -12) return "falling";
  return "steady";
}
