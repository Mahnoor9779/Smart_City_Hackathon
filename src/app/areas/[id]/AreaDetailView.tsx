"use client";

/**
 * AreaDetailView
 *
 * Client view component for the tehsil profile.
 * Reactively translates all copy, facts, headings, notes, and metrics when
 * toggling between English and Urdu.
 */

import Link from "next/link";
import { DistrictMap } from "@/components/map/DistrictMap";
import { MetricValue } from "@/components/data/MetricValue";
import { Icon } from "@/components/ui/Icon";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { SeverityScale } from "@/components/charts/SeverityScale";
import type { AreaReading } from "@/lib/data/air";
import type { Area } from "@/lib/geo/lahore";
import { formatCount, formatMetric, relativeAge } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./area.module.css";

interface AreaDetailViewProps {
  area: Area;
  reading?: AreaReading;
  readings: readonly AreaReading[];
}

export function AreaDetailView({
  area,
  reading,
  readings,
}: AreaDetailViewProps) {
  const { t, locale } = useLocale();
  const peak = reading?.peak ?? null;

  const areaName = t.areas[area.id]?.name ?? area.name;
  const areaBlurb = t.areas[area.id]?.blurb ?? area.blurb;
  const tehsilLabel = locale === "ur" ? "تحصیل" : "Tehsil";

  return (
    <div className={styles.page}>
      <div className={styles.headerGroup}>
        <nav className={styles.crumb} aria-label="Breadcrumb">
          <Link href="/areas" className={styles.back}>
            <Icon name="arrowRight" size={16} className={styles.flip} />
            {t.areaDetail.allTehsils}
          </Link>
        </nav>

        <header className={styles.head}>
          <div className={styles.headText}>
            <p className={styles.kicker}>{tehsilLabel}</p>
            <h1 className={styles.title}>{areaName}</h1>
            <p className={styles.blurb}>{areaBlurb}</p>

            <div className={styles.metaRow}>
              {reading?.pm25 != null && (
                <span className={styles.pill} data-step={reading.severityStep ?? "none"}>
                  <span className={styles.pillDot} />
                  {formatMetric(reading.pm25)} &micro;g/m&sup3; &middot; {t.severity[reading.severityStep ?? 1]}
                </span>
              )}
              <span className={styles.metaPill}>
                <Icon name="people" size={14} />
                {formatCount(area.populationEstimate)} {t.metrics.people}
              </span>
              <span className={styles.metaPill}>
                <Icon name="map" size={14} />
                {area.areaKm2} {locale === "ur" ? "مربع کلومیٹر" : "km\u00B2"}
              </span>
            </div>
          </div>
          <div className={styles.locator}>
            <div className={styles.locatorMap}>
              <DistrictMap
                readings={readings}
                selectedId={area.id}
                showLabels={false}
                animate={false}
              />
            </div>
            <div className={styles.locatorMeta}>
              <p className={styles.locatorKicker}>{t.areaDetail.location}</p>
              <p className={styles.locatorTitle}>{areaName}</p>
              <p className={styles.locatorCaption}>{t.areaDetail.whereSits}</p>
            </div>
          </div>
        </header>
      </div>

      <section className={styles.stats}>
        <div className={styles.stat}>
          {reading && (
            <MetricValue
              label={t.metrics.airQuality}
              value={reading.pm25}
              unit="ug/m3"
              severityStep={reading.severityStep}
              provenance={reading.provenance}
              size="hero"
              exposure={{
                count: area.populationEstimate,
                phrase: t.metrics.peopleBreathing,
              }}
              state={
                reading.pm25 === null
                  ? {
                      kind: "failed",
                      what: t.metrics.airQuality,
                      stillWorking: ["population", "area size", "the map"],
                    }
                  : { kind: "ready" }
              }
            />
          )}
        </div>

        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>
              <Icon name="people" size={16} /> {t.metrics.population}
            </dt>
            <dd>{formatCount(area.populationEstimate)}</dd>
            <p className={styles.factNote}>{t.areaDetail.populationNote}</p>
          </div>

          <div className={styles.fact}>
            <dt>
              <Icon name="map" size={16} /> {t.metrics.area}
            </dt>
            <dd>
              {area.areaKm2} {locale === "ur" ? "مربع کلومیٹر" : "km\u00B2"}
            </dd>
            <p className={styles.factNote}>{t.areaDetail.areaNote}</p>
          </div>

          {peak && (
            <div className={styles.fact}>
              <dt>
                <Icon name="trend" size={16} /> {t.metrics.worstIn3Days}
              </dt>
              <dd>{formatMetric(peak.value)} &micro;g/m&sup3;</dd>
              <p className={styles.factNote}>
                {peak.inHours === 0
                  ? t.areaDetail.peakingNowNote
                  : t.areaDetail.peakingHoursNote(
                      peak.inHours,
                      t.severity[reading?.severityStep ?? 1] ?? ""
                    )}
              </p>
            </div>
          )}

          {reading && (
            <div className={styles.fact}>
              <dt>
                <Icon name="clock" size={16} /> {t.metrics.lastUpdated}
              </dt>
              <dd>{relativeAge(0, locale)}</dd>
              <p className={styles.factNote}>{t.areaDetail.updateNote}</p>
            </div>
          )}
        </dl>
      </section>

      {reading && reading.series.length > 1 && (
        <section className={styles.chartBlock}>
          <div className={styles.chartHead}>
            <h2 className={styles.h2}>{t.areaDetail.nextThreeDays}</h2>
            <p className={styles.chartLede}>
              {t.areaDetail.chartLede(areaName)}
            </p>
          </div>
          <ForecastChart series={reading.series} areaName={areaName} />
        </section>
      )}

      {reading && (
        <section className={styles.chartBlock}>
          <div className={styles.chartHead}>
            <h2 className={styles.h2}>{t.areaDetail.whereSitsScale}</h2>
          </div>
          <SeverityScale value={reading.pm25} />
        </section>
      )}

      <section className={styles.note}>
        <Icon name="info" size={18} />
        <p>{t.areaDetail.disclaimerNote}</p>
      </section>
    </div>
  );
}
