/**
 * Icon
 *
 * Hand-authored inline SVG, one consistent grid, 1.5 stroke, currentColor.
 *
 * WHY NOT AN ICON LIBRARY. Twelve icons do not justify a dependency, and
 * authoring them here guarantees one stroke weight, one corner treatment, and
 * one optical size across the whole interface, which is the thing that actually
 * makes an icon set look deliberate.
 *
 * WHY NOT EMOJI. Screen readers announce emoji by full Unicode name, they render
 * differently on every platform, and using one as a status marker fails the
 * non-text contrast requirement. An SVG inherits colour, scales cleanly, and
 * takes an accessible name only when it needs one.
 *
 * ACCESSIBILITY. Icons are decorative by default and hidden from screen readers,
 * because they nearly always sit beside a text label that already says the same
 * thing. Pass `title` only when the icon is the sole carrier of meaning.
 */

import type { SVGProps } from "react";

export type IconName =
  | "wind"
  | "people"
  | "hospital"
  | "map"
  | "list"
  | "alert"
  | "clock"
  | "arrowRight"
  | "sun"
  | "moon"
  | "monitor"
  | "layers"
  | "trend"
  | "info"
  | "swap"
  | "chevronDown"
  | "location"
  | "crosshair"
  | "close";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  /** Give the icon an accessible name. Omit when a text label sits beside it. */
  title?: string;
}

const PATHS: Record<IconName, React.ReactNode> = {
  wind: (
    <>
      <path d="M3 8h9a3 3 0 1 0-3-3" />
      <path d="M3 12h13a3 3 0 1 1-3 3" />
      <path d="M3 16h7" />
    </>
  ),
  people: (
    <>
      <path d="M15 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
      <circle cx="8.5" cy="7" r="3.5" />
      <path d="M18 19v-1a4 4 0 0 0-3-3.87" />
      <path d="M14 3.6a3.5 3.5 0 0 1 0 6.8" />
    </>
  ),
  hospital: (
    <>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M2 20h20" />
      <path d="M12 10v6M9 13h6" />
    </>
  ),
  map: (
    <>
      <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path d="M8.5 20.5h7M12 16.5v4" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 7.5l9 4.5 9-4.5z" />
      <path d="M3 12.5 12 17l9-4.5" />
      <path d="M3 17 12 21.5 21 17" />
    </>
  ),
  trend: (
    <>
      <path d="M3 16.5 9 10l4 4 7.5-8" />
      <path d="M15 6h5.5v5.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  swap: (
    <>
      <path d="M4 8h15M15 4l4 4-4 4" />
      <path d="M20 16H5M9 12l-4 4 4 4" />
    </>
  ),
  chevronDown: (
    <path d="M6 9l6 6 6-6" />
  ),
  location: (
    <>
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  crosshair: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  close: (
    <path d="M18 6L6 18M6 6l12 12" />
  ),
};

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}
