"use client";

/**
 * RankingsView
 *
 * Client view component for Rankings ("Worst air first").
 * Fully reactive to bilingual locale (English / Urdu).
 */

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { AreaReading } from "@/lib/data/air";
import { districtMean } from "@/lib/data/air";
import { AREAS } from "@/lib/geo/lahore";
import { formatCount, formatMetric } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./rankings.module.css";

interface RankingsViewProps {
  readings: readonly AreaReading[];
}

export function RankingsView({ readings }: RankingsViewProps) {
  const { t, locale } = useLocale();
  const mean = districtMean(readings);

  const rows = AREAS.map((area) => {
    const r = readings.find((x) => x.areaId === area.id);
    return { area, reading: r };
  }).sort((a, b) => (b.reading?.pm25 ?? -1) - (a.reading?.pm25 ?? -1));

  const worstValue = Math.max(...rows.map((r) => r.reading?.pm25 ?? 0), 1);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>{t.rankings.title}</h1>
        <p className={styles.lede}>
          {t.rankings.lede(formatMetric(mean))}
        </p>
      </header>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <caption className="visuallyHidden">
            {t.rankings.title}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.rank}>
                {t.rankings.thRank}
              </th>
              <th scope="col">{t.rankings.thTehsil}</th>
              <th scope="col" className={styles.numCol}>
                {t.rankings.thPm25}
              </th>
              <th scope="col">{t.rankings.thBand}</th>
              <th scope="col" className={styles.numCol}>
                {t.rankings.thPeople}
              </th>
              <th scope="col" className={styles.numCol}>
                {t.rankings.thArea}
              </th>
              <th scope="col">
                <span className="visuallyHidden">{t.rankings.thOpen}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ area, reading }, i) => {
              const aName = t.areas[area.id]?.name ?? area.name;
              return (
                <tr key={area.id}>
                  <td className={styles.rank}>{i + 1}</td>
                  <th scope="row" className={styles.nameCell}>
                    <span
                      className={styles.swatch}
                      data-step={reading?.severityStep ?? "none"}
                      aria-hidden="true"
                    />
                    {aName}
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
                  <td>{t.severity[reading?.severityStep ?? 1]}</td>
                  <td className={styles.numCol}>
                    {formatCount(area.populationEstimate)}
                  </td>
                  <td className={styles.numCol}>
                    {area.areaKm2} {locale === "ur" ? "مربع کلومیٹر" : "km\u00B2"}
                  </td>
                  <td>
                    <Link href={`/areas/${area.id}`} className={styles.open}>
                      <span>{t.rankings.openLink}</span>
                      <Icon name="arrowRight" size={14} className={styles.flip} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.foot}>
        {t.rankings.footnote}
      </p>
    </div>
  );
}
