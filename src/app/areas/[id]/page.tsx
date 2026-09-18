/**
 * Area profile. The "know your neighbourhood" screen, feature S03.
 *
 * The locator map repeats here at small size, deliberately. On a detail page the
 * reader has usually arrived from a link and needs re-orienting, and a
 * highlighted shape does that faster than a breadcrumb ever will.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { DistrictMap } from "@/components/map/DistrictMap";
import { MetricValue } from "@/components/data/MetricValue";
import { Icon } from "@/components/ui/Icon";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { SeverityScale } from "@/components/charts/SeverityScale";
import { fetchAirQuality } from "@/lib/data/air";
import { AREAS, areaById, ADMIN_LEVEL_LABEL } from "@/lib/geo/lahore";
import { formatCount, severityLabel, formatMetric, relativeAge } from "@/lib/format";
import styles from "./area.module.css";

export const revalidate = 600;

export function generateStaticParams() {
  return AREAS.map((a) => ({ id: a.id }));
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const area = areaById(id);
  if (!area) notFound();

  const readings = await fetchAirQuality();
  const reading = readings.find((r) => r.areaId === area.id);
  const peak = reading?.peak ?? null;

  return (
    <div className={styles.page}>
      <div className={styles.headerGroup}>
        <nav className={styles.crumb} aria-label="Breadcrumb">
          <Link href="/areas" className={styles.back}>
            <Icon name="arrowRight" size={16} className={styles.flip} />
            All {ADMIN_LEVEL_LABEL}s
          </Link>
        </nav>

        <header className={styles.head}>
          <div className={styles.headText}>
            <p className={styles.kicker}>{ADMIN_LEVEL_LABEL}</p>
            <h1 className={styles.title}>{area.name}</h1>
            <p className={styles.blurb}>{area.blurb}</p>
          </div>
          <div className={styles.locator}>
            <DistrictMap
              readings={readings}
              selectedId={area.id}
              showLabels={false}
              animate={false}
            />
            <p className={styles.locatorCaption}>Where this sits in the district</p>
          </div>
        </header>
      </div>

      <section className={styles.stats}>
        <div className={styles.stat}>
          {reading && (
            <MetricValue
              label="Air quality, PM2.5"
              value={reading.pm25}
              unit="ug/m3"
              severityStep={reading.severityStep}
              provenance={reading.provenance}
              size="hero"
              exposure={{
                count: area.populationEstimate,
                phrase: "people breathing it",
              }}
              state={
                reading.pm25 === null
                  ? {
                      kind: "failed",
                      what: "Air quality",
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
              <Icon name="people" size={16} /> Population
            </dt>
            <dd>{formatCount(area.populationEstimate)}</dd>
            <p className={styles.factNote}>
              Apportioned from the 2023 census district total. An estimate, not a
              count.
            </p>
          </div>

          <div className={styles.fact}>
            <dt>
              <Icon name="map" size={16} /> Area
            </dt>
            <dd>{area.areaKm2} km&sup2;</dd>
            <p className={styles.factNote}>
              Measured from the OpenStreetMap boundary.
            </p>
          </div>

          {peak && (
            <div className={styles.fact}>
              <dt>
                <Icon name="trend" size={16} /> Worst in the next 3 days
              </dt>
              <dd>{formatMetric(peak.value)} &micro;g/m&sup3;</dd>
              <p className={styles.factNote}>
                {peak.inHours === 0
                  ? "Peaking now."
                  : `In about ${peak.inHours} hours, reaching ${severityLabel(
                      reading?.severityStep ?? null
                    ).toLowerCase()} levels.`}
              </p>
            </div>
          )}

          {reading && (
            <div className={styles.fact}>
              <dt>
                <Icon name="clock" size={16} /> Last updated
              </dt>
              <dd>{relativeAge(0)}</dd>
              <p className={styles.factNote}>
                Refreshed every 10 minutes from Open-Meteo.
              </p>
            </div>
          )}
        </dl>
      </section>

      {reading && reading.series.length > 1 && (
        <section className={styles.chartBlock}>
          <div className={styles.chartHead}>
            <h2 className={styles.h2}>The next three days</h2>
            <p className={styles.chartLede}>
              Hourly PM2.5 forecast for {area.name}. The dashed lines are the
              health thresholds, so you can see when the air crosses one.
            </p>
          </div>
          <ForecastChart series={reading.series} areaName={area.name} />
        </section>
      )}

      {reading && (
        <section className={styles.chartBlock}>
          <div className={styles.chartHead}>
            <h2 className={styles.h2}>Where this sits on the scale</h2>
          </div>
          <SeverityScale value={reading.pm25} />
        </section>
      )}

      <section className={styles.note}>
        <Icon name="info" size={18} />
        <p>
          Air quality here comes from a model grid of roughly 11 km, which is
          coarser than this {ADMIN_LEVEL_LABEL}. The reading is an estimate for the
          area rather than a measurement taken inside it. Ground sensor readings
          arrive when the OpenAQ and Punjab EPA adapters land.
        </p>
      </section>
    </div>
  );
}
