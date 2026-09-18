"use client";

/**
 * CompareView
 *
 * Interactive side-by-side comparison between two tehsils in Lahore District.
 * Computes live difference bars and population disparity without page reloads.
 *
 * Fully reactive to bilingual locale (English / Urdu).
 */

import { useState } from "react";
import Link from "next/link";
import { DistrictMap } from "@/components/map/DistrictMap";
import { Icon } from "@/components/ui/Icon";
import { AREAS, type Area } from "@/lib/geo/lahore";
import type { AreaReading } from "@/lib/data/air";
import {
  formatMetric,
  formatCount,
} from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./compare.module.css";

interface CompareViewProps {
  initialLeftId: string;
  initialRightId: string;
  readings: readonly AreaReading[];
}

export function CompareView({
  initialLeftId,
  initialRightId,
  readings,
}: CompareViewProps) {
  const [leftId, setLeftId] = useState(initialLeftId);
  const [rightId, setRightId] = useState(initialRightId);
  const { t } = useLocale();

  const fallbackA = AREAS[0] as Area;
  const fallbackB = (AREAS[1] ?? AREAS[0]) as Area;

  const leftArea: Area = AREAS.find((a) => a.id === leftId) ?? fallbackA;
  const rightArea: Area = AREAS.find((a) => a.id === rightId) ?? fallbackB;

  const leftReading = readings.find((r) => r.areaId === leftArea.id);
  const rightReading = readings.find((r) => r.areaId === rightArea.id);

  const leftName = t.areas[leftArea.id]?.name ?? leftArea.name;
  const rightName = t.areas[rightArea.id]?.name ?? rightArea.name;
  const leftBlurb = t.areas[leftArea.id]?.blurb ?? leftArea.blurb;
  const rightBlurb = t.areas[rightArea.id]?.blurb ?? rightArea.blurb;

  function handleSwap() {
    setLeftId(rightId);
    setRightId(leftId);
  }

  // Calculate density
  const leftDensity = Math.round(leftArea.populationEstimate / leftArea.areaKm2);
  const rightDensity = Math.round(
    rightArea.populationEstimate / rightArea.areaKm2
  );

  // PM2.5 delta
  const leftPm = leftReading?.pm25 ?? 0;
  const rightPm = rightReading?.pm25 ?? 0;
  const pmDiff = Math.abs(leftPm - rightPm);
  const leftPmShare = Math.round((leftPm / (leftPm + rightPm || 1)) * 100);
  const rightPmShare = 100 - leftPmShare;

  // Population delta
  const leftPop = leftArea.populationEstimate;
  const rightPop = rightArea.populationEstimate;
  const popRatio = (
    Math.max(leftPop, rightPop) / Math.min(leftPop, rightPop)
  ).toFixed(1);
  const leftPopShare = Math.round((leftPop / (leftPop + rightPop)) * 100);
  const rightPopShare = 100 - leftPopShare;

  // Density delta
  const leftDensityShare = Math.round(
    (leftDensity / (leftDensity + rightDensity || 1)) * 100
  );
  const rightDensityShare = 100 - leftDensityShare;

  return (
    <div className={styles.container}>
      <header className={styles.head}>
        <p className={styles.kicker}>{t.compare.kicker}</p>
        <h1 className={styles.title}>{t.compare.title}</h1>
        <p className={styles.lede}>{t.compare.lede}</p>
      </header>

      {/* Selectors Bar */}
      <div className={styles.selectorsCard}>
        <div className={styles.selectorGroup}>
          <label htmlFor="leftSelect" className={styles.selectorLabel}>
            {t.compare.firstTehsil}
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="leftSelect"
              className={styles.select}
              value={leftId}
              onChange={(e) => setLeftId(e.target.value)}
            >
              {AREAS.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === rightId}>
                  {t.areas[a.id]?.name ?? a.name}
                </option>
              ))}
            </select>
            <span className={styles.selectCaret} aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>

        <button
          type="button"
          className={styles.swapButton}
          onClick={handleSwap}
          aria-label={t.compare.swap}
          title={t.compare.swap}
        >
          <Icon name="swap" size={18} />
        </button>

        <div className={styles.selectorGroup}>
          <label htmlFor="rightSelect" className={styles.selectorLabel}>
            {t.compare.secondTehsil}
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="rightSelect"
              className={styles.select}
              value={rightId}
              onChange={(e) => setRightId(e.target.value)}
            >
              {AREAS.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === leftId}>
                  {t.areas[a.id]?.name ?? a.name}
                </option>
              ))}
            </select>
            <span className={styles.selectCaret} aria-hidden="true">
              <Icon name="chevronDown" size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-side header cards */}
      <div className={styles.sideBySideHeader}>
        <div className={styles.areaHeroCard}>
          <div className={styles.areaHeroTop}>
            <div className={styles.areaHeroText}>
              <p className={styles.areaHeroKicker}>{t.compare.tehsilA}</p>
              <h2 className={styles.areaHeroTitle}>{leftName}</h2>
              <p className={styles.areaHeroBlurb}>{leftBlurb}</p>
            </div>
            <div className={styles.areaHeroMap}>
              <DistrictMap
                readings={readings}
                selectedId={leftArea.id}
                showLabels={false}
                animate={false}
              />
            </div>
          </div>
          <Link href={`/areas/${leftArea.id}`} className={styles.viewProfileLink}>
            <span>{t.compare.viewProfile(leftName)}</span>
            <Icon name="arrowRight" size={14} />
          </Link>
        </div>

        <div className={styles.areaHeroCard}>
          <div className={styles.areaHeroTop}>
            <div className={styles.areaHeroText}>
              <p className={styles.areaHeroKicker}>{t.compare.tehsilB}</p>
              <h2 className={styles.areaHeroTitle}>{rightName}</h2>
              <p className={styles.areaHeroBlurb}>{rightBlurb}</p>
            </div>
            <div className={styles.areaHeroMap}>
              <DistrictMap
                readings={readings}
                selectedId={rightArea.id}
                showLabels={false}
                animate={false}
              />
            </div>
          </div>
          <Link
            href={`/areas/${rightArea.id}`}
            className={styles.viewProfileLink}
          >
            <span>{t.compare.viewProfile(rightName)}</span>
            <Icon name="arrowRight" size={14} />
          </Link>
        </div>
      </div>

      {/* Comparison Metrics Section */}
      <div className={styles.metricsGrid}>
        {/* Metric 1: Air Quality */}
        <div className={styles.metricCard}>
          <div className={styles.metricMeta}>
            <span className={styles.metricTitle}>
              <Icon name="wind" size={16} />
              <span>{t.compare.airQualityTitle}</span>
            </span>
            <span className={styles.metricSummary}>
              {pmDiff === 0
                ? t.compare.identicalAir
                : t.compare.higherAir(
                    leftPm > rightPm ? leftName : rightName,
                    formatMetric(pmDiff)
                  )}
            </span>
          </div>

          <div className={styles.dualReadout}>
            <div className={styles.readoutLeft}>
              <span className={styles.numLarge}>{formatMetric(leftPm)}</span>
              <span className={styles.unitText}>{t.metrics.ugm3}</span>
              <span
                className={styles.badge}
                data-step={leftReading?.severityStep ?? "none"}
              >
                {t.severity[leftReading?.severityStep ?? 1]}
              </span>
            </div>

            <div className={styles.readoutRight}>
              <span className={styles.numLarge}>{formatMetric(rightPm)}</span>
              <span className={styles.unitText}>{t.metrics.ugm3}</span>
              <span
                className={styles.badge}
                data-step={rightReading?.severityStep ?? "none"}
              >
                {t.severity[rightReading?.severityStep ?? 1]}
              </span>
            </div>
          </div>

          {/* Difference Bar */}
          <div className={styles.barTrack}>
            <div
              className={styles.barFillLeft}
              style={{ width: `${leftPmShare}%` }}
              data-step={leftReading?.severityStep ?? "none"}
            />
            <div
              className={styles.barFillRight}
              style={{ width: `${rightPmShare}%` }}
              data-step={rightReading?.severityStep ?? "none"}
            />
          </div>
          <div className={styles.barLabels}>
            <span>{leftName} ({leftPmShare}%)</span>
            <span>{rightName} ({rightPmShare}%)</span>
          </div>
        </div>

        {/* Metric 2: Population Exposure */}
        <div className={styles.metricCard}>
          <div className={styles.metricMeta}>
            <span className={styles.metricTitle}>
              <Icon name="people" size={16} />
              <span>{t.compare.popExposureTitle}</span>
            </span>
            <span className={styles.metricSummary}>
              {leftPop === rightPop
                ? t.compare.equalPop
                : t.compare.higherPop(
                    leftPop > rightPop ? leftName : rightName,
                    popRatio
                  )}
            </span>
          </div>

          <div className={styles.dualReadout}>
            <div className={styles.readoutLeft}>
              <span className={styles.numLarge}>
                {formatCount(leftArea.populationEstimate)}
              </span>
              <span className={styles.unitText}>{t.metrics.residents}</span>
            </div>
            <div className={styles.readoutRight}>
              <span className={styles.numLarge}>
                {formatCount(rightArea.populationEstimate)}
              </span>
              <span className={styles.unitText}>{t.metrics.residents}</span>
            </div>
          </div>

          <div className={styles.barTrack}>
            <div
              className={styles.barFillAccent}
              style={{ width: `${leftPopShare}%` }}
            />
            <div
              className={styles.barFillMuted}
              style={{ width: `${rightPopShare}%` }}
            />
          </div>
          <div className={styles.barLabels}>
            <span>{leftName} ({leftPopShare}%)</span>
            <span>{rightName} ({rightPopShare}%)</span>
          </div>
        </div>

        {/* Metric 3: Population Density */}
        <div className={styles.metricCard}>
          <div className={styles.metricMeta}>
            <span className={styles.metricTitle}>
              <Icon name="map" size={16} />
              <span>{t.compare.densityTitle}</span>
            </span>
            <span className={styles.metricSummary}>
              {leftDensity > rightDensity
                ? t.compare.higherDensity(
                    leftName,
                    Math.round(leftDensity / rightDensity)
                  )
                : t.compare.higherDensity(
                    rightName,
                    Math.round(rightDensity / leftDensity)
                  )}
            </span>
          </div>

          <div className={styles.dualReadout}>
            <div className={styles.readoutLeft}>
              <span className={styles.numLarge}>
                {formatCount(leftDensity)}
              </span>
              <span className={styles.unitText}>{t.metrics.peoplePerKm2}</span>
              <span className={styles.subText}>{t.compare.totalArea(leftArea.areaKm2)}</span>
            </div>
            <div className={styles.readoutRight}>
              <span className={styles.numLarge}>
                {formatCount(rightDensity)}
              </span>
              <span className={styles.unitText}>{t.metrics.peoplePerKm2}</span>
              <span className={styles.subText}>{t.compare.totalArea(rightArea.areaKm2)}</span>
            </div>
          </div>

          <div className={styles.barTrack}>
            <div
              className={styles.barFillAccent}
              style={{ width: `${leftDensityShare}%` }}
            />
            <div
              className={styles.barFillMuted}
              style={{ width: `${rightDensityShare}%` }}
            />
          </div>
          <div className={styles.barLabels}>
            <span>{leftName} ({leftDensityShare}%)</span>
            <span>{rightName} ({rightDensityShare}%)</span>
          </div>
        </div>

        {/* Metric 4: 72-Hour Peak Forecast Risk */}
        <div className={styles.metricCard}>
          <div className={styles.metricMeta}>
            <span className={styles.metricTitle}>
              <Icon name="trend" size={16} />
              <span>{t.compare.peakRiskTitle}</span>
            </span>
            <span className={styles.metricSummary}>
              {t.compare.peakRiskSummary}
            </span>
          </div>

          <div className={styles.dualReadout}>
            <div className={styles.readoutLeft}>
              <span className={styles.numLarge}>
                {formatMetric(leftReading?.peak?.value ?? null)}
              </span>
              <span className={styles.unitText}>{t.metrics.ugm3}</span>
              <span className={styles.subText}>
                {leftReading?.peak
                  ? leftReading.peak.inHours === 0
                    ? t.compare.peakingNow
                    : t.compare.inHours(leftReading.peak.inHours)
                  : t.compare.noForecast}
              </span>
            </div>

            <div className={styles.readoutRight}>
              <span className={styles.numLarge}>
                {formatMetric(rightReading?.peak?.value ?? null)}
              </span>
              <span className={styles.unitText}>{t.metrics.ugm3}</span>
              <span className={styles.subText}>
                {rightReading?.peak
                  ? rightReading.peak.inHours === 0
                    ? t.compare.peakingNow
                    : t.compare.inHours(rightReading.peak.inHours)
                  : t.compare.noForecast}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
