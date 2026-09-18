"use client";

/**
 * LocationPill
 *
 * Compact header pill for Tehsil location detection.
 * Sits alongside Theme and Locale toggles in the top navigation bar.
 * Keeps the page body completely clean while providing 1-click personalization.
 *
 * Invariants strictly obeyed: ZERO emoji, ZERO em dashes, accessible vector icons.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  resolveTehsilFromCoords,
  getSavedTehsil,
  saveTehsil,
  clearSavedTehsil,
} from "@/lib/geo/locate";
import { areaById, AREAS, type Area } from "@/lib/geo/lahore";
import styles from "./LocationPill.module.css";

type PillStatus = "idle" | "locating" | "resolved" | "outside" | "denied";

export function LocationPill() {
  const router = useRouter();
  const { t } = useLocale();
  const [status, setStatus] = useState<PillStatus>("idle");
  const [detectedArea, setDetectedArea] = useState<Area | null>(null);

  useEffect(() => {
    const saved = getSavedTehsil();
    if (saved) {
      const area = areaById(saved.areaId);
      if (area) {
        setDetectedArea(area);
        setStatus("resolved");
      }
    }
  }, []);

  function handleLocate() {
    if (typeof window === "undefined" || !navigator.geolocation) {
      const defaultArea = areaById("lahore-city") ?? AREAS[0];
      if (defaultArea) {
        saveTehsil(defaultArea.id);
        setDetectedArea(defaultArea);
        setStatus("resolved");
        router.push(`/areas/${defaultArea.id}`);
      }
      return;
    }

    setStatus("locating");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const result = resolveTehsilFromCoords(latitude, longitude);

        // Always resolve to the closest Tehsil in Lahore, save preference, and open that page
        saveTehsil(result.area.id);
        setDetectedArea(result.area);
        setStatus("resolved");
        router.push(`/areas/${result.area.id}`);
      },
      () => {
        // Fallback: If device denies or times out, default to central Lahore (Lahore City)
        const defaultArea = areaById("lahore-city") ?? AREAS[0];
        if (defaultArea) {
          saveTehsil(defaultArea.id);
          setDetectedArea(defaultArea);
          setStatus("resolved");
          router.push(`/areas/${defaultArea.id}`);
        } else {
          setStatus("denied");
          setTimeout(() => setStatus("idle"), 3000);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  function handleClear(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    clearSavedTehsil();
    setDetectedArea(null);
    setStatus("idle");
  }

  if (status === "resolved" && detectedArea) {
    const aName = t.areas[detectedArea.id]?.name ?? detectedArea.name;
    return (
      <div className={styles.wrapper}>
        <Link
          href={`/areas/${detectedArea.id}`}
          className={`${styles.pillBtn} ${styles.pillActive}`}
          title={`${t.locator.yourTehsil}: ${aName}`}
        >
          <Icon name="location" size={14} className={styles.pinIcon} />
          <span className={styles.label}>{aName}</span>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            title={t.locator.changeLocation}
            aria-label={t.locator.changeLocation}
          >
            <Icon name="close" size={12} />
          </button>
        </Link>
      </div>
    );
  }

  if (status === "locating") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.pillBtn}>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{t.locator.locating}</span>
        </div>
      </div>
    );
  }

  if (status === "outside") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.pillBtn}>
          <Icon name="info" size={14} />
          <span>{t.locator.outsideShort}</span>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.pillBtn}>
          <Icon name="alert" size={14} />
          <span>{t.locator.unavailable}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.pillBtn}
        onClick={handleLocate}
        title={t.locator.findDescription}
      >
        <Icon name="crosshair" size={14} />
        <span className={styles.labelLong}>{t.locator.detectShort}</span>
      </button>
    </div>
  );
}
