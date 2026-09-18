"use client";

/**
 * DistrictMap
 *
 * Lahore District drawn from its real OpenStreetMap boundary, with each tehsil
 * shaded by current air quality and the selected one outlined.
 *
 * Fully reactive to bilingual locale (English / Urdu).
 */

import Link from "next/link";
import { AREAS, DISTRICT_PATH, MAP_VIEWBOX, DISTRICT_NAME } from "@/lib/geo/lahore";
import type { AreaReading } from "@/lib/data/air";
import { severityLabel, formatMetric } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./DistrictMap.module.css";

export interface DistrictMapProps {
  readings: readonly AreaReading[];
  /** Region to outline. */
  selectedId?: string | undefined;
  /**
   * Base path. When set, each region becomes a link to `${linkBase}/${areaId}`.
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
  const { t, locale } = useLocale();
  const byId = new Map(readings.map((r) => [r.areaId, r]));

  const mapDistrictName = locale === "ur" ? t.nav.district : DISTRICT_NAME;

  return (
    <figure className={styles.wrap} dir="ltr">
      <svg
        viewBox={MAP_VIEWBOX}
        className={styles.svg}
        data-animate={animate ? "true" : undefined}
        role="img"
        aria-label={`${mapDistrictName}, ${AREAS.length} ${
          locale === "ur" ? t.nav.tehsilsSuffix : "tehsils"
        }`}
      >
        {/* District outline. Drawn first so regions sit on top of it. */}
        <path d={DISTRICT_PATH} className={styles.district} />

        {AREAS.map((area, i) => {
          const reading = byId.get(area.id);
          const step = reading?.severityStep ?? null;
          const isSelected = area.id === selectedId;
          const aName = t.areas[area.id]?.name ?? area.name;
          const bandName =
            step !== null
              ? t.severity[step] ?? severityLabel(step)
              : "No data";
          const readingText =
            reading?.pm25 == null
              ? "no reading"
              : `${formatMetric(reading.pm25)} &micro;g/m&sup3;, ${bandName}`;
          const label = `${aName}. ${readingText}`;

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
            const aName = t.areas[area.id]?.name ?? area.name;
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
                  {aName}
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
