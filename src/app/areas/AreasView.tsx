"use client";

/**
 * AreasView
 *
 * Client view component for Areas ("All tehsils").
 * Fully reactive to bilingual locale (English / Urdu).
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { DistrictMap } from "@/components/map/DistrictMap";
import { Icon } from "@/components/ui/Icon";
import type { AreaReading } from "@/lib/data/air";
import { AREAS } from "@/lib/geo/lahore";
import { formatMetric, formatCount } from "@/lib/format";
import { getSavedTehsil } from "@/lib/geo/locate";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./areas.module.css";

interface AreasViewProps {
  readings: readonly AreaReading[];
}

export function AreasView({ readings }: AreasViewProps) {
  const { t, locale } = useLocale();
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = getSavedTehsil();
    if (saved) {
      setSavedId(saved.areaId);
    }
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>{t.areasList.title}</h1>
        <p className={styles.lede}>{t.areasList.lede}</p>
      </header>

      <div className={styles.split}>
        <div className={styles.mapPane}>
          <DistrictMap readings={readings} linkBase="/areas" />
        </div>

        <ul className={styles.list}>
          {AREAS.map((area) => {
            const r = readings.find((x) => x.areaId === area.id);
            const aName = t.areas[area.id]?.name ?? area.name;
            const isUserTehsil = savedId === area.id;

            return (
              <li key={area.id}>
                <Link href={`/areas/${area.id}`} className={styles.row}>
                  <span
                    className={styles.swatch}
                    data-step={r?.severityStep ?? "none"}
                    aria-hidden="true"
                  />
                  <span className={styles.rowText}>
                    <span className={styles.rowNameGroup}>
                      <span className={styles.rowName}>{aName}</span>
                      {isUserTehsil && (
                        <span className={styles.yourTehsilBadge}>
                          <Icon name="location" size={12} />
                          {t.locator.yourTehsilChip}
                        </span>
                      )}
                    </span>
                    <span className={styles.rowMeta}>
                      {formatCount(area.populationEstimate)} {t.metrics.people} &middot;{" "}
                      {area.areaKm2} {locale === "ur" ? "مربع کلومیٹر" : "km\u00B2"}
                    </span>
                  </span>
                  <span className={styles.rowValue}>
                    <span className={styles.num}>{formatMetric(r?.pm25 ?? null)}</span>
                    <span className={styles.band}>
                      {t.severity[r?.severityStep ?? 1]}
                    </span>
                  </span>
                  <Icon name="arrowRight" size={16} className={styles.flip} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
