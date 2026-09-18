"use client";

/**
 * TehsilLocator
 *
 * Pop-up notification banner for hyper-local tehsil resolution.
 * Positions at the top of the interface to offer instant civic personalization:
 * - Detects user location on click (avoiding prompt fatigue).
 * - Resolves to the nearest administrative Tehsil using Haversine geodesic math.
 * - Displays live local PM2.5, health band, and direct clinic access.
 * - Can be dismissed with a single click.
 *
 * Invariants strictly obeyed: ZERO emoji, ZERO em dashes, accessible vector icons.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  resolveTehsilFromCoords,
  getSavedTehsil,
  saveTehsil,
  clearSavedTehsil,
} from "@/lib/geo/locate";
import { areaById, type Area } from "@/lib/geo/lahore";
import type { AreaReading } from "@/lib/data/air";
import { formatMetric } from "@/lib/format";
import styles from "./TehsilLocator.module.css";

type LocatorState =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "resolved";
      area: Area;
      distanceKm?: number;
      source: "live" | "saved";
    }
  | {
      kind: "outside";
      distanceKm: number;
    }
  | {
      kind: "error";
      errorType: "denied" | "unavailable" | "timeout";
    };

interface TehsilLocatorProps {
  readings: readonly AreaReading[];
  onTehsilResolved?: (areaId: string) => void;
}

export function TehsilLocator({ readings, onTehsilResolved }: TehsilLocatorProps) {
  const { t } = useLocale();
  const [state, setState] = useState<LocatorState>({ kind: "idle" });
  const [dismissed, setDismissed] = useState(false);

  // Read saved Tehsil on client mount
  useEffect(() => {
    const saved = getSavedTehsil();
    if (saved) {
      const area = areaById(saved.areaId);
      if (area) {
        setState({
          kind: "resolved",
          area,
          source: "saved",
        });
        onTehsilResolved?.(area.id);
      }
    }
  }, [onTehsilResolved]);

  function handleLocate() {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState({ kind: "error", errorType: "unavailable" });
      return;
    }

    setState({ kind: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const result = resolveTehsilFromCoords(latitude, longitude);

        if (result.status === "outside") {
          setState({
            kind: "outside",
            distanceKm: result.distanceFromLahoreKm,
          });
        } else {
          saveTehsil(result.area.id);
          setState({
            kind: "resolved",
            area: result.area,
            distanceKm: result.distanceKm,
            source: "live",
          });
          onTehsilResolved?.(result.area.id);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState({ kind: "error", errorType: "denied" });
        } else if (err.code === err.TIMEOUT) {
          setState({ kind: "error", errorType: "timeout" });
        } else {
          setState({ kind: "error", errorType: "unavailable" });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  function handleClear() {
    clearSavedTehsil();
    setState({ kind: "idle" });
  }

  if (dismissed) {
    return null;
  }

  return (
    <aside
      className={styles.banner}
      role="region"
      aria-label={t.locator.yourTehsil}
      aria-live="polite"
    >
      {state.kind === "idle" && (
        <div className={styles.bannerTop}>
          <div className={styles.leadGroup}>
            <div className={styles.iconWrap} aria-hidden="true">
              <Icon name="location" size={20} />
            </div>
            <div className={styles.textGroup}>
              <strong className={styles.title}>{t.locator.notificationTitle}</strong>
              <span className={styles.desc}>{t.locator.findDescription}</span>
            </div>
          </div>
          <div className={styles.actionsGroup}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleLocate}
            >
              <Icon name="crosshair" size={16} />
              {t.locator.locateButton}
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setDismissed(true)}
              title={t.locator.dismiss}
              aria-label={t.locator.dismiss}
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
      )}

      {state.kind === "loading" && (
        <div className={styles.loadingRow}>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{t.locator.locating}</span>
        </div>
      )}

      {state.kind === "resolved" && (
        <>
          <div className={styles.resolvedHeader}>
            <div className={styles.badgeAndMeta}>
              <span className={styles.badge}>
                <Icon name="location" size={14} />
                {t.locator.yourTehsil}
              </span>
              <span className={styles.subInfo}>
                {state.source === "live" && state.distanceKm != null
                  ? t.locator.basedOnLocation(state.distanceKm)
                  : t.locator.savedLocation}
              </span>
            </div>
            <div className={styles.actionsGroup}>
              <button
                type="button"
                className={styles.changeBtn}
                onClick={handleClear}
              >
                {t.locator.changeLocation}
              </button>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setDismissed(true)}
                title={t.locator.dismiss}
                aria-label={t.locator.dismiss}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          </div>

          <div className={styles.resolvedContent}>
            <div>
              <h2 className={styles.areaTitle}>
                {t.areas[state.area.id]?.name ?? state.area.name}
              </h2>
            </div>

            {(() => {
              const reading = readings.find((r) => r.areaId === state.area.id);
              const step = reading?.severityStep ?? 1;
              return (
                <div className={styles.statGroup}>
                  <div>
                    <span className={styles.readingVal}>
                      {formatMetric(reading?.pm25 ?? null)}
                    </span>
                    <span className={styles.unit}>&micro;g/m&sup3;</span>
                  </div>
                  <span className={styles.band} data-step={step}>
                    {t.severity[step]}
                  </span>
                </div>
              );
            })()}

            <div className={styles.resolvedActions}>
              <Link href={`/areas/${state.area.id}`} className={styles.viewLink}>
                {t.locator.viewTehsilProfile}
                <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
        </>
      )}

      {state.kind === "outside" && (
        <div className={styles.notice}>
          <div className={styles.noticeText}>
            <Icon name="info" size={18} />
            <span>{t.locator.outsideDistrict(state.distanceKm)}</span>
          </div>
          <div className={styles.actionsGroup}>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => setState({ kind: "idle" })}
            >
              {t.locator.retry}
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setDismissed(true)}
              title={t.locator.dismiss}
              aria-label={t.locator.dismiss}
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
      )}

      {state.kind === "error" && (
        <div className={styles.notice}>
          <div className={styles.noticeText}>
            <Icon name="alert" size={18} />
            <span>
              {state.errorType === "denied"
                ? t.locator.permissionDenied
                : t.locator.unavailable}
            </span>
          </div>
          <div className={styles.actionsGroup}>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={handleLocate}
            >
              {t.locator.retry}
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setDismissed(true)}
              title={t.locator.dismiss}
              aria-label={t.locator.dismiss}
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
