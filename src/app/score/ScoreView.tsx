/**
 * ScoreView
 *
 * Civic Access Score dashboard. Ranks all tehsils by their composite score
 * (health, education, air, green space, connectivity) with a transparent
 * breakdown of each component.
 *
 * Air quality uses live data. Other components use baseline estimates
 * (clearly labelled). BUILD_PROMPT.md Section 8.1.
 */

"use client";

import Link from "next/link";
import { AREAS } from "@/lib/geo/lahore";
import type { AreaReading } from "@/lib/data/air";
import { computeCivicScore, type CivicScore } from "@/lib/data/score";
import { formatCount } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./score.module.css";

interface ScoreViewProps {
  readings: readonly AreaReading[];
}

const COMPONENT_LABELS_EN: Record<string, string> = {
  health: "Healthcare",
  education: "Education",
  air: "Air Quality",
  green: "Green Space",
  connectivity: "Roads",
};

const COMPONENT_LABELS_UR: Record<string, string> = {
  health: "صحت تک رسائی",
  education: "تعلیم تک رسائی",
  air: "ہوا کا معیار",
  green: "سبز جگہیں",
  connectivity: "سڑکوں کا جال",
};

export function ScoreView({ readings }: ScoreViewProps) {
  const { t, locale } = useLocale();

  const compLabels =
    locale === "ur" ? COMPONENT_LABELS_UR : COMPONENT_LABELS_EN;

  // Compute scores for all areas
  const scores: (CivicScore & { areaName: string; population: number })[] =
    AREAS.map((area) => {
      const reading = readings.find((r) => r.areaId === area.id);
      const score = computeCivicScore(area.id, reading);
      return {
        ...score,
        areaName: t.areas[area.id]?.name ?? area.name,
        population: area.populationEstimate,
      };
    }).sort((a, b) => b.total - a.total);

  const title =
    locale === "ur" ? "شہری رسائی سکور" : "Civic Access Score";
  const subtitle =
    locale === "ur"
      ? "ہر تحصیل کا 0 سے 100 تک جامع سکور۔ صحت، تعلیم، فضا، سبز جگہوں اور سڑکوں کی بنیاد پر۔"
      : "A composite 0-100 score for each tehsil. Combines health access, education access, air quality, green space, and road connectivity.";
  const estimatedNote =
    locale === "ur"
      ? "ہلکے رنگ کے اجزاء تخمینی ہیں۔ ہوا کا معیار براہ راست ڈیٹا سے ہے۔"
      : "Lighter components are baseline estimates. Air quality uses live data.";
  const weightLabel = locale === "ur" ? "وزن" : "weight";

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lede}>{subtitle}</p>
      </header>

      <div className={styles.cards}>
        {scores.map((s, rank) => (
          <article key={s.areaId} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.rankCol}>
                <span className={styles.rank}>#{rank + 1}</span>
                <span className={styles.grade} data-grade={s.grade}>
                  {s.grade}
                </span>
              </div>

              <div className={styles.nameCol}>
                <h2 className={styles.cardName}>{s.areaName}</h2>
                <span className={styles.pop}>
                  <Icon name="people" size={13} />
                  {formatCount(s.population)} {t.metrics.people}
                </span>
              </div>

              <div className={styles.scoreCol}>
                <span className={styles.scoreBig}>
                  {s.total}
                </span>
                <span className={styles.scoreMax}>/ 100</span>
              </div>
            </div>

            {/* Component breakdown */}
            <div className={styles.breakdown}>
              {s.components.map((comp) => (
                <div key={comp.id} className={styles.compRow}>
                  <span className={styles.compLabel}>
                    {compLabels[comp.id] ?? comp.label}
                    {comp.isEstimated && (
                      <span className={styles.estBadge}>
                        {t.metrics.estimated}
                      </span>
                    )}
                  </span>

                  <div className={styles.compBar}>
                    <div
                      className={styles.compFill}
                      style={{
                        width: `${comp.score}%`,
                        opacity: comp.isEstimated ? 0.5 : 1,
                      }}
                    />
                  </div>

                  <span className={styles.compScore}>{comp.score}</span>

                  <span className={styles.compWeight}>
                    {Math.round(comp.weight * 100)}% {weightLabel}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={`/areas/${s.areaId}`}
              className={styles.viewLink}
            >
              {locale === "ur"
                ? `${s.areaName} کا پروفائل`
                : `View ${s.areaName}`}
              <Icon name="arrowRight" size={14} />
            </Link>
          </article>
        ))}
      </div>

      <p className={styles.footnote}>{estimatedNote}</p>
    </div>
  );
}
