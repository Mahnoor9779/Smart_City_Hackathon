/**
 * Areas. The map screen.
 *
 * Separate from Now because it does a different job: Now answers "how bad is it",
 * this answers "where, and how do they compare". Cramming both into one screen is
 * what produced the original single-page dashboard nobody could orient in.
 */

import Link from "next/link";
import { DistrictMap } from "@/components/map/DistrictMap";
import { Icon } from "@/components/ui/Icon";
import { fetchAirQuality } from "@/lib/data/air";
import { AREAS, ADMIN_LEVEL_LABEL, DISTRICT_NAME } from "@/lib/geo/lahore";
import { formatMetric, severityLabel, formatCount } from "@/lib/format";
import styles from "./areas.module.css";

export const revalidate = 600;

export default async function AreasPage() {
  const readings = await fetchAirQuality();

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>{DISTRICT_NAME}</h1>
        <p className={styles.lede}>
          Five {ADMIN_LEVEL_LABEL}s, shaded by air quality right now. Select one to
          open its profile.
        </p>
      </header>

      <div className={styles.split}>
        <div className={styles.mapPane}>
          <DistrictMap readings={readings} linkBase="/areas" />
        </div>

        <ul className={styles.list}>
          {AREAS.map((area) => {
            const r = readings.find((x) => x.areaId === area.id);
            return (
              <li key={area.id}>
                <Link href={`/areas/${area.id}`} className={styles.row}>
                  <span
                    className={styles.swatch}
                    data-step={r?.severityStep ?? "none"}
                    aria-hidden="true"
                  />
                  <span className={styles.rowText}>
                    <span className={styles.rowName}>{area.name}</span>
                    <span className={styles.rowMeta}>
                      {formatCount(area.populationEstimate)} people &middot;{" "}
                      {area.areaKm2} km&sup2;
                    </span>
                  </span>
                  <span className={styles.rowValue}>
                    <span className={styles.num}>{formatMetric(r?.pm25 ?? null)}</span>
                    <span className={styles.band}>
                      {severityLabel(r?.severityStep ?? null)}
                    </span>
                  </span>
                  <Icon name="arrowRight" size={16} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
