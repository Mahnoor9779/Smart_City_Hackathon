/**
 * Now, the opening screen.
 *
 * THE RULE THIS SCREEN EXISTS TO OBEY: one number, one sentence, one action.
 *
 * A first time visitor who lands on an empty map with fourteen layer toggles
 * leaves. So this screen answers, before anything else, three questions in
 * order: where is this, how bad is it, and who does it affect. The map and the
 * rankings are the second screen, reached deliberately.
 *
 * Everything here is live. Open-Meteo needs no key and sends permissive CORS
 * headers, so the very first render already carries real readings for Lahore.
 */

import Link from "next/link";
import { DistrictMap } from "@/components/map/DistrictMap";
import { MetricValue } from "@/components/data/MetricValue";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Icon } from "@/components/ui/Icon";
import { Sparkline, trendWord } from "@/components/charts/Sparkline";
import { SeverityScale } from "@/components/charts/SeverityScale";
import {
  fetchAirQuality,
  districtMean,
  worstArea,
  peopleAtOrAbove,
} from "@/lib/data/air";
import { AREAS, areaById, DISTRICT_NAME, ADMIN_LEVEL_LABEL } from "@/lib/geo/lahore";
import { severityForPm25, severityLabel, formatCount, relativeAge, ageSeconds } from "@/lib/format";
import styles from "./page.module.css";

export const revalidate = 600;

/** Plain language, the way a resident would say it. Never a bare number. */
function headlineSentence(step: number | null, mean: number | null): string {
  if (mean === null || step === null) {
    return "Air quality is unavailable right now. The map and area profiles still work.";
  }
  const times = Math.round(mean / 5);
  switch (step) {
    case 1:
      return "Air is clean across Lahore today. This is as good as it gets here.";
    case 2:
      return "Air is acceptable today, though sensitive groups may still notice it.";
    case 3:
      return `Air is unhealthy for children, older people and anyone with asthma. About ${times} times the level the World Health Organization considers safe.`;
    case 4:
      return `Air is unhealthy for everyone, not just sensitive groups. About ${times} times the level the World Health Organization considers safe.`;
    case 5:
      return `Air is very unhealthy. About ${times} times the safe level. Outdoor activity should be limited across the district.`;
    default:
      return `Air is hazardous. About ${times} times the safe level. This is an emergency level for the whole population.`;
  }
}

export default async function NowPage() {
  const readings = await fetchAirQuality();
  const mean = districtMean(readings);
  const step = severityForPm25(mean);
  const worst = worstArea(readings);
  const worstAreaMeta = worst ? areaById(worst.areaId) : undefined;
  const exposed = peopleAtOrAbove(readings, 4);
  const first = readings[0];
  const age = first ? ageSeconds(first.provenance.retrievedAt) : 0;

  return (
    <div className={styles.page}>
      {/* ---------- hero: place, one number, one sentence, one action ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>
            <span className={styles.live} aria-hidden="true" />
            Live now &middot; updated {relativeAge(age)}
          </p>

          <h1 className={styles.title}>
            The air in <span className={styles.place}>Lahore</span> right now
          </h1>

          {mean !== null && step !== null ? (
            <>
              <p className={styles.readout}>
                <span className={styles.big}>
                  <AnimatedNumber value={mean} decimals={0} />
                </span>
                <span className={styles.unit}>
                  <span className={styles.unitValue}>&micro;g/m&sup3;</span>
                  <span className={styles.band} data-step={step}>
                    {severityLabel(step)}
                  </span>
                </span>
              </p>
              <p className={styles.sentence}>{headlineSentence(step, mean)}</p>
              {exposed > 0 && (
                <p className={styles.exposure}>
                  <Icon name="people" size={18} />
                  <span>
                    <strong>{formatCount(exposed)} people</strong> live where the air
                    is unhealthy or worse.
                  </span>
                </p>
              )}
            </>
          ) : (
            <p className={styles.sentence}>{headlineSentence(null, null)}</p>
          )}

          <div className={styles.actions}>
            <Link href="/areas" className={styles.primary}>
              See it by {ADMIN_LEVEL_LABEL}
              <Icon name="arrowRight" size={18} />
            </Link>
            {worstAreaMeta && worst?.pm25 != null && (
              <Link href={`/areas/${worstAreaMeta.id}`} className={styles.secondary}>
                Worst right now: {worstAreaMeta.name}
              </Link>
            )}
          </div>
        </div>

        {/* The map answers "which place is this" without a sentence doing it. */}
        <div className={styles.heroMap}>
          <DistrictMap
            readings={readings}
            linkBase="/areas"
            selectedId={worst?.areaId}
          />
          <p className={styles.mapCaption}>
            {DISTRICT_NAME}, shaded by current air quality.
            {worstAreaMeta ? ` ${worstAreaMeta.name} is worst right now.` : ""}
          </p>
        </div>
      </section>

      {/* ---------- the five areas, each a way in ---------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Every {ADMIN_LEVEL_LABEL}</h2>
          <Link href="/rankings" className={styles.quiet}>
            Rank them
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <ul className={styles.cards}>
          {AREAS.map((area) => {
            const r = readings.find((x) => x.areaId === area.id);
            if (!r) return null;
            return (
              <li key={area.id}>
                <Link href={`/areas/${area.id}`} className={styles.card}>
                  <MetricValue
                    label={area.name}
                    value={r.pm25}
                    unit="ug/m3"
                    severityStep={r.severityStep}
                    provenance={r.provenance}
                    exposure={{
                      count: area.populationEstimate,
                      phrase: "people live here",
                    }}
                    state={
                      r.pm25 === null
                        ? {
                            kind: "failed",
                            what: "This reading",
                            stillWorking: ["the map", "population", "area profiles"],
                          }
                        : { kind: "ready" }
                    }
                  />
                  {r.next24h.length > 1 && (
                    <span className={styles.trend}>
                      <Sparkline values={r.next24h} />
                      <span className={styles.trendWord}>
                        {trendWord(r.next24h)} over 24h
                      </span>
                    </span>
                  )}
                  <span className={styles.cardGo} aria-hidden="true">
                    <Icon name="arrowRight" size={16} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>What the colours mean</h2>
        </div>
        <SeverityScale value={mean} />
        <p className={styles.scaleNote}>
          Bands follow the US EPA breakpoints for PM2.5. The ramp avoids red and
          green, which are the hardest pair to tell apart for roughly one in
          twelve men, and every band is labelled so colour is never the only
          signal.
        </p>
      </section>
    </div>
  );
}
