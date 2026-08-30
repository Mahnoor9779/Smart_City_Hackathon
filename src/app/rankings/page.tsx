/**
 * Rankings. The table twin, feature X03 and D03.
 *
 * A ranked list is a to-do list. It turns a map into "these areas need attention
 * first", which is the output an official can act on, and it is also the
 * accessible equivalent of the map for anyone who cannot use one.
 *
 * A real <table> with a caption and scope attributes, not styled divs, so screen
 * readers announce it as a table and the column relationships survive.
 */

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { fetchAirQuality, districtMean } from "@/lib/data/air";
import { AREAS, ADMIN_LEVEL_LABEL, DISTRICT_NAME } from "@/lib/geo/lahore";
import { formatCount, formatMetric, severityLabel } from "@/lib/format";
import styles from "./rankings.module.css";

export const revalidate = 600;

export default async function RankingsPage() {
  const readings = await fetchAirQuality();
  const mean = districtMean(readings);

  const rows = AREAS.map((area) => {
    const r = readings.find((x) => x.areaId === area.id);
    return { area, reading: r };
  }).sort((a, b) => (b.reading?.pm25 ?? -1) - (a.reading?.pm25 ?? -1));

  // Bars are scaled against the worst value, not against zero, because the
  // question here is "how do these five compare", not "how far above nothing".
  // The axis floor is stated in the footnote so the scaling is never implied.
  const worstValue = Math.max(...rows.map((r) => r.reading?.pm25 ?? 0), 1);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Worst air first</h1>
        <p className={styles.lede}>
          Every {ADMIN_LEVEL_LABEL} in {DISTRICT_NAME}, ranked by PM2.5 right now.
          {mean !== null && (
            <>
              {" "}
              The population weighted district average is{" "}
              <strong>{formatMetric(mean)} &micro;g/m&sup3;</strong>.
            </>
          )}
        </p>
      </header>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <caption className="visuallyHidden">
            Tehsils of {DISTRICT_NAME} ranked by current PM2.5 concentration,
            worst first
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.rank}>
                #
              </th>
              <th scope="col">{ADMIN_LEVEL_LABEL}</th>
              <th scope="col" className={styles.numCol}>
                PM2.5
              </th>
              <th scope="col">Band</th>
              <th scope="col" className={styles.numCol}>
                People
              </th>
              <th scope="col" className={styles.numCol}>
                Area
              </th>
              <th scope="col">
                <span className="visuallyHidden">Open profile</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ area, reading }, i) => (
              <tr key={area.id}>
                <td className={styles.rank}>{i + 1}</td>
                <th scope="row" className={styles.nameCell}>
                  <span
                    className={styles.swatch}
                    data-step={reading?.severityStep ?? "none"}
                    aria-hidden="true"
                  />
                  {area.name}
                </th>
                <td className={styles.numCol}>
                  <span className={styles.valueCell}>
                    <span
                      className={styles.bar}
                      data-step={reading?.severityStep ?? "none"}
                      style={{
                        width: `${((reading?.pm25 ?? 0) / worstValue) * 100}%`,
                      }}
                      aria-hidden="true"
                    />
                    <span className={styles.num}>
                      {formatMetric(reading?.pm25 ?? null)}
                    </span>
                  </span>
                </td>
                <td>{severityLabel(reading?.severityStep ?? null)}</td>
                <td className={styles.numCol}>
                  {formatCount(area.populationEstimate)}
                </td>
                <td className={styles.numCol}>{area.areaKm2} km&sup2;</td>
                <td>
                  <Link href={`/areas/${area.id}`} className={styles.open}>
                    Open
                    <Icon name="arrowRight" size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.foot}>
        PM2.5 in micrograms per cubic metre, from Open-Meteo, refreshed every ten
        minutes. Bars are scaled against the worst area, so they compare the five
        with each other rather than against zero. Population figures are apportioned estimates from the 2023 census
        district total, not counts. Areas are measured from OpenStreetMap
        boundaries.
      </p>
    </div>
  );
}
