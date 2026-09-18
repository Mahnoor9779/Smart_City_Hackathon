"use client";

/**
 * NowView
 *
 * Client view component for the opening screen (Now / Home).
 * Provides 100% reactive bilingual translations (English / Urdu) for the hero,
 * headline health sentences, area cards, sparklines, and colour scale.
 */

import Link from "next/link";
import { DistrictMap } from "@/components/map/DistrictMap";
import { MetricValue } from "@/components/data/MetricValue";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Icon } from "@/components/ui/Icon";
import { Sparkline, trendWord } from "@/components/charts/Sparkline";
import { SeverityScale } from "@/components/charts/SeverityScale";
import { SmogAlertBanner } from "@/components/data/SmogAlertBanner";
import type { AreaReading } from "@/lib/data/air";
import {
  districtMean,
  worstArea,
  peopleAtOrAbove,
} from "@/lib/data/air";
import { AREAS, areaById } from "@/lib/geo/lahore";
import { severityForPm25, formatCount, relativeAge, ageSeconds } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./page.module.css";

interface NowViewProps {
  readings: readonly AreaReading[];
}

export function NowView({ readings }: NowViewProps) {
  const { t, locale } = useLocale();

  const mean = districtMean(readings);
  const step = severityForPm25(mean);
  const worst = worstArea(readings);
  const worstAreaMeta = worst ? areaById(worst.areaId) : undefined;
  const worstAreaName = worstAreaMeta
    ? t.areas[worstAreaMeta.id]?.name ?? worstAreaMeta.name
    : undefined;
  const exposed = peopleAtOrAbove(readings, 4);
  const first = readings[0];
  const age = first ? ageSeconds(first.provenance.retrievedAt) : 0;

  function headlineSentence(st: number | null, mn: number | null): string {
    if (mn === null || st === null) {
      return t.home.unavailableHeadline;
    }
    const times = Math.max(1, Math.round(mn / 5));
    switch (st) {
      case 1:
        return t.home.cleanHeadline;
      case 2:
        return t.home.acceptableHeadline;
      case 3:
        return t.home.unhealthySensitiveHeadline(times);
      case 4:
        return t.home.unhealthyEveryoneHeadline(times);
      case 5:
        return t.home.veryUnhealthyHeadline(times);
      default:
        return t.home.hazardousHeadline(times);
    }
  }

  function localizedTrend(v: readonly number[]): string {
    const raw = trendWord(v);
    if (raw === "rising") return t.home.trendRising;
    if (raw === "falling") return t.home.trendFalling;
    return t.home.trendSteady;
  }

  return (
    <div className={styles.page}>
      <SmogAlertBanner readings={readings} />

      {/* ---------- hero: place, one number, one sentence, one action ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>
            <span className={styles.live} aria-hidden="true" />
            {t.home.liveNow} &middot; {t.home.updatedAgo(relativeAge(age, locale))}
          </p>

          <h1 className={styles.title}>
            {t.home.theAirInPlace}
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
                    {t.severity[step]}
                  </span>
                </span>
              </p>
              <p className={styles.sentence}>{headlineSentence(step, mean)}</p>
              {exposed > 0 && (
                <p className={styles.exposure}>
                  <Icon name="people" size={18} />
                  <span>
                    <strong>{formatCount(exposed)} </strong>
                    {t.home.exposedCount(formatCount(exposed))}
                  </span>
                </p>
              )}
            </>
          ) : (
            <p className={styles.sentence}>{headlineSentence(null, null)}</p>
          )}

          <div className={styles.actions}>
            <Link href="/areas" className={styles.primary}>
              {t.home.seeByTehsil}
              <Icon name="arrowRight" size={18} />
            </Link>
            {worstAreaMeta && worst?.pm25 != null && worstAreaName && (
              <Link href={`/areas/${worstAreaMeta.id}`} className={styles.secondary}>
                {t.home.worstRightNow(worstAreaName)}
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
            {t.home.mapCaption(worstAreaName)}
          </p>
        </div>
      </section>

      {/* ---------- the five areas, each a way in ---------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>{t.home.everyTehsil}</h2>
          <Link href="/rankings" className={styles.quiet}>
            {t.home.rankThem}
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <ul className={styles.cards}>
          {AREAS.map((area) => {
            const r = readings.find((x) => x.areaId === area.id);
            if (!r) return null;
            const aName = t.areas[area.id]?.name ?? area.name;
            return (
              <li key={area.id}>
                <Link href={`/areas/${area.id}`} className={styles.card}>
                  <MetricValue
                    label={aName}
                    value={r.pm25}
                    unit="ug/m3"
                    severityStep={r.severityStep}
                    provenance={r.provenance}
                    exposure={{
                      count: area.populationEstimate,
                      phrase: t.metrics.peopleLiveHere,
                    }}
                    state={
                      r.pm25 === null
                        ? {
                            kind: "failed",
                            what: aName,
                            stillWorking: ["the map", "population", "area profiles"],
                          }
                        : { kind: "ready" }
                    }
                  />
                  {r.next24h.length > 1 && (
                    <span className={styles.trend}>
                      <Sparkline values={r.next24h} />
                      <span className={styles.trendWord}>
                        {t.home.trendOver24h(localizedTrend(r.next24h))}
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
          <h2 className={styles.h2}>{t.home.whatColoursMean}</h2>
        </div>
        <SeverityScale value={mean} />
        <p className={styles.scaleNote}>
          {t.home.scaleExplanation}
        </p>
      </section>
    </div>
  );
}
