/**
 * DistrictMap
 *
 * Lahore District drawn from its real OpenStreetMap boundary, with each tehsil
 * shaded by current air quality and the selected one outlined.
 *
 * WHY INLINE SVG AND NOT MAPLIBRE HERE. This map answers one question, "where am
 * I looking", and it has to answer it in the first second on a mid range phone.
 * An SVG of 118 points is about 1.5 KB, renders instantly, needs no tiles, no
 * network, and no JavaScript to appear. The interactive tiled map earns its
 * weight on the dedicated map screen where panning and layers matter. Using the
 * heavy thing here would cost the one moment that has to feel immediate.
 *
 * ACCESSIBILITY. The SVG is a labelled group of buttons, so the whole map is
 * reachable by keyboard and every region announces its name and reading. Colour
 * is never the only channel: the selected region gets a thicker outline, and the
 * reading is always available as text.
 */

import Link from "next/link";
import { AREAS, DISTRICT_PATH, MAP_VIEWBOX, DISTRICT_NAME } from "@/lib/geo/lahore";
import type { AreaReading } from "@/lib/data/air";
import { severityLabel, formatMetric } from "@/lib/format";
import styles from "./DistrictMap.module.css";

export interface DistrictMapProps {
  readings: readonly AreaReading[];
  /** Region to outline. */
  selectedId?: string | undefined;
  /**
   * Base path. When set, each region becomes a link to `${linkBase}/${areaId}`.
   * A string rather than a function because props crossing a server boundary
   * must be serialisable, and a template is all this ever needed.
   */
  linkBase?: string;
  /** Draw-in animation on first paint. Off for small inline uses. */
  animate?: boolean;
  /** Region name labels. Crowded below roughly 320px wide. */
  showLabels?: boolean;
}

export function DistrictMap({
  readings,
  selectedId,
  linkBase,
  animate = true,
  showLabels = true,
}: DistrictMapProps) {
  const byId = new Map(readings.map((r) => [r.areaId, r]));

  return (
    <figure className={styles.wrap}>
      {/*
        The accessible name is an aria-label rather than an SVG <title> element.
        React 19 treats <title> as document metadata and hoists it to <head>,
        which makes an SVG title collide with the page title and breaks
        hydration. aria-label gives the same name with none of that.
      */}
      <svg
        viewBox={MAP_VIEWBOX}
        className={styles.svg}
        data-animate={animate ? "true" : undefined}
        role="img"
        aria-label={`${DISTRICT_NAME}, ${AREAS.length} tehsils shaded by current air quality`}
      >
        {/* District outline. Drawn first so regions sit on top of it. */}
        <path d={DISTRICT_PATH} className={styles.district} />

        {AREAS.map((area, i) => {
          const reading = byId.get(area.id);
          const step = reading?.severityStep ?? null;
          const isSelected = area.id === selectedId;
          const readingText =
            reading?.pm25 == null
              ? "no reading"
              : `${formatMetric(reading.pm25)} micrograms per cubic metre, ${severityLabel(step)}`;
          const label = `${area.name}. ${readingText}`;

          const shape = (
            <path
              d={area.path}
              className={styles.area}
              data-step={step ?? "none"}
              data-selected={isSelected ? "true" : undefined}
              style={{ animationDelay: `${60 + i * 50}ms` }}
            />
          );

          return (
            <g key={area.id} className={styles.region}>
              {linkBase ? (
                <Link href={`${linkBase}/${area.id}`} aria-label={label} className={styles.hit}>
                  {shape}
                </Link>
              ) : (
                <g role="img" aria-label={label}>
                  {shape}
                </g>
              )}
            </g>
          );
        })}

        {/* Selection outline drawn last so it is never overlapped by a neighbour. */}
        {selectedId &&
          AREAS.filter((a) => a.id === selectedId).map((a) => (
            <path key={a.id} d={a.path} className={styles.selectedRing} />
          ))}

        {showLabels &&
          AREAS.map((area, i) => {
            const r = byId.get(area.id);
            return (
              <g
                key={area.id}
                className={styles.labelGroup}
                data-selected={area.id === selectedId ? "true" : undefined}
                style={{ animationDelay: `${240 + i * 50}ms` }}
              >
                <text
                  x={area.centroid[0]}
                  y={area.centroid[1] - 14}
                  className={styles.label}
                >
                  {area.name}
                </text>
                {r?.pm25 != null && (
                  <text
                    x={area.centroid[0]}
                    y={area.centroid[1] + 24}
                    className={styles.labelValue}
                  >
                    {formatMetric(r.pm25)}
                  </text>
                )}
              </g>
            );
          })}
      </svg>
    </figure>
  );
}
