/**
 * AnimatedNumber
 *
 * Counts up to the value once, on mount.
 *
 * WHY THIS IS HERE AND NOT EVERYWHERE. A count-up draws the eye, so it is spent
 * on exactly one number per screen: the headline the whole page is about. Used
 * on every figure it would be noise, and worse, a number that moves while you
 * read it is a bug rather than a delight. It never runs on a value that updates
 * in place for the same reason.
 *
 * Respects prefers-reduced-motion by rendering the final value immediately.
 */

"use client";

import { useEffect, useRef, useState } from "react";

export interface AnimatedNumberProps {
  value: number;
  /** Milliseconds. Kept short: this is emphasis, not a loading bar. */
  duration?: number;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  duration = 900,
  decimals = 0,
}: AnimatedNumberProps) {
  const [shown, setShown] = useState(value);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || duration <= 0) {
      setShown(value);
      return;
    }

    const start = performance.now();
    setShown(0);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic. Fast at first, settles gently, so the final value reads
      // as arriving rather than stopping.
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(value * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [value, duration]);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown.toFixed(decimals)}
    </span>
  );
}
