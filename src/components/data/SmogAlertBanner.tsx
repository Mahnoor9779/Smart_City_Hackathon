"use client";

/**
 * SmogAlertBanner
 *
 * 48-Hour Smog Inversion and Arrival Forecast Banner.
 * Transforms passive monitoring into proactive civil defense by detecting
 * upcoming hazardous inversion windows and calculating safe outdoor hours.
 *
 * Fully reactive to bilingual locale (English / Urdu).
 */

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AREAS } from "@/lib/geo/lahore";
import type { AreaReading } from "@/lib/data/air";
import { formatMetric, severityForPm25 } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./SmogAlertBanner.module.css";

interface SmogAlertBannerProps {
  readings: readonly AreaReading[];
}

export function SmogAlertBanner({ readings }: SmogAlertBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLocale();

  // Find the earliest upcoming hazardous peak across all areas in next 48 hours
  let earliestSurgeHour: number | null = null;
  let surgeTehsilIds: string[] = [];
  let highestPeakValue = 0;

  for (const r of readings) {
    const area = AREAS.find((a) => a.id === r.areaId);
    if (!area) continue;

    // Check first 48 hours in series
    for (let h = 0; h < Math.min(r.series.length, 48); h++) {
      const point = r.series[h];
      if (!point) continue;
      const step = severityForPm25(point.v);
      if (step !== null && step >= 4) {
        if (earliestSurgeHour === null || h < earliestSurgeHour) {
          earliestSurgeHour = h;
          surgeTehsilIds = [area.id];
        } else if (h === earliestSurgeHour && !surgeTehsilIds.includes(area.id)) {
          surgeTehsilIds.push(area.id);
        }
      }
      if (point.v > highestPeakValue) {
        highestPeakValue = point.v;
      }
    }
  }

  const surgeTehsilNames = surgeTehsilIds
    .map((id) => t.areas[id]?.name ?? id)
    .slice(0, 2)
    .join(" & ");

  // Calculate safe window and urgency level
  const isSurgeImminent = earliestSurgeHour !== null && earliestSurgeHour <= 18;
  const isCurrentlySevere = readings.some(
    (r) => r.severityStep !== null && r.severityStep >= 4
  );

  // Compute district hourly progression for the next 24 hours
  const hourlyProgression = Array.from({ length: 24 }, (_, h) => {
    let sum = 0;
    let count = 0;
    for (const r of readings) {
      const val = r.series[h]?.v;
      if (typeof val === "number") {
        sum += val;
        count++;
      }
    }
    const mean = count > 0 ? Math.round(sum / count) : 0;
    return {
      hour: h,
      mean,
      step: severityForPm25(mean),
    };
  });

  return (
    <aside
      className={styles.banner}
      data-alert={isCurrentlySevere ? "severe" : isSurgeImminent ? "warning" : "nominal"}
      aria-label="Early warning air quality alert"
    >
      <div className={styles.inner}>
        <div className={styles.badgeCol}>
          <span className={styles.pulseBeacon} aria-hidden="true" />
          <span className={styles.alertType}>
            {isCurrentlySevere
              ? t.alert.hazardActive
              : isSurgeImminent
              ? t.alert.surgeWarning
              : t.alert.radarNominal}
          </span>
        </div>

        <div className={styles.bodyCol}>
          <p className={styles.headline}>
            {earliestSurgeHour !== null
              ? earliestSurgeHour === 0
                ? t.alert.activeNowAcross(surgeTehsilNames)
                : t.alert.surgeArriving(earliestSurgeHour, surgeTehsilNames)
              : t.alert.noExtremeSurge}
          </p>
          <p className={styles.subline}>
            {earliestSurgeHour !== null && earliestSurgeHour > 0
              ? t.alert.safeWindowCloses(earliestSurgeHour, formatMetric(highestPeakValue))
              : t.alert.districtPeakNear(formatMetric(highestPeakValue))}
          </p>
        </div>

        <div className={styles.actionCol}>
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <span>{expanded ? t.alert.hideProjection : t.alert.showProjection}</span>
            <Icon name="trend" size={14} />
          </button>
        </div>
      </div>

      {/* Expandable 24-Hour Timeline Radar */}
      {expanded && (
        <div className={styles.timelineDrawer}>
          <div className={styles.timelineHead}>
            <span className={styles.timelineTitle}>
              {t.alert.hourlyTitle}
            </span>
            <span className={styles.advisoryNote}>
              {t.alert.schoolAdvisory}
            </span>
          </div>

          <div className={styles.track}>
            {hourlyProgression.map((item) => (
              <div key={item.hour} className={styles.tick}>
                <div
                  className={styles.bar}
                  data-step={item.step ?? "none"}
                  style={{ height: `${Math.min(100, Math.max(16, (item.mean / 250) * 100))}%` }}
                  title={`+${item.hour}h: ${item.mean} ug/m3 (${item.step != null ? t.severity[item.step] : t.metrics.noData})`}
                />
                <span className={styles.hourLabel}>
                  {item.hour === 0 ? t.alert.nowTick : `+${item.hour}h`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
