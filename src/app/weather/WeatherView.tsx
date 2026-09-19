/**
 * WeatherView
 *
 * Client view component for the Weather Dashboard.
 * Shows temperature, wind, humidity, and precipitation for all 5 tehsils
 * with 72-hour temperature forecast sparklines.
 *
 * Fully reactive to bilingual locale (English / Urdu).
 */

"use client";

import { AREAS } from "@/lib/geo/lahore";
import type { WeatherReading } from "@/lib/data/weather";
import { windDirectionLabel, heatSeverity, totalPrecipitation } from "@/lib/data/weather";
import { formatMetric } from "@/lib/format";
import { Sparkline } from "@/components/charts/Sparkline";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n/LocaleContext";
import styles from "./weather.module.css";

interface WeatherViewProps {
  readings: readonly WeatherReading[];
}

/** Compass points in Urdu. Wind direction is where the wind blows from. */
const COMPASS_UR: Record<string, string> = {
  N: "شمال",
  NE: "شمال مشرق",
  E: "مشرق",
  SE: "جنوب مشرق",
  S: "جنوب",
  SW: "جنوب مغرب",
  W: "مغرب",
  NW: "شمال مغرب",
};

function windFromText(dir: string, locale: string): string {
  if (dir === "calm") return locale === "ur" ? "ہوا ساکن" : "calm";
  return locale === "ur" ? `${COMPASS_UR[dir] ?? dir} سے` : `from ${dir}`;
}

export function WeatherView({ readings }: WeatherViewProps) {
  const { t, locale } = useLocale();

  const title = locale === "ur" ? "لاہور کا موسم" : "Lahore Weather";
  const subtitle =
    locale === "ur"
      ? "تمام تحصیلوں کا براہ راست موسمی ڈیٹا، اوپن میٹیو سے"
      : "Live weather across all tehsils, from Open-Meteo";

  const feelsLabel = locale === "ur" ? "محسوس ہوتا ہے" : "Feels like";
  const windLabel = locale === "ur" ? "ہوا" : "Wind";
  const humidLabel = locale === "ur" ? "نمی" : "Humidity";
  const precipLabel = locale === "ur" ? "بارش" : "Precipitation";
  const highLowLabel = locale === "ur" ? "زیادہ / کم" : "High / Low";
  const total72hLabel = locale === "ur" ? "72 گھنٹوں میں کل" : "Total in 72h";
  const heatWarnLabel = locale === "ur" ? "گرمی کا انتباہ" : "Heat Warning";
  const heatCritLabel = locale === "ur" ? "شدید گرمی" : "Extreme Heat";

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lede}>{subtitle}</p>
      </header>

      <div className={styles.grid}>
        {AREAS.map((area) => {
          const r = readings.find((x) => x.areaId === area.id);
          if (!r) return null;
          const aName = t.areas[area.id]?.name ?? area.name;
          const heat = heatSeverity(r.temperature);
          const precip72 = totalPrecipitation(r.precipSeries);
          const tempValues = r.tempSeries.map((s) => s.v);

          return (
            <article key={area.id} className={styles.card} data-heat={heat}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{aName}</h2>
                {heat !== "normal" && (
                  <span
                    className={styles.heatBadge}
                    data-heat={heat}
                  >
                    {heat === "critical" ? heatCritLabel : heatWarnLabel}
                  </span>
                )}
              </div>

              {/* Temperature hero */}
              <div className={styles.tempHero}>
                <span className={styles.tempBig}>
                  {r.temperature !== null
                    ? `${Math.round(r.temperature)}`
                    : "?"}
                </span>
                <span className={styles.tempUnit}>°C</span>
                {r.feelsLike !== null && (
                  <span className={styles.feelsLike}>
                    {feelsLabel} {Math.round(r.feelsLike)}°C
                  </span>
                )}
              </div>

              {/* High / Low */}
              {r.dailyHigh !== null && r.dailyLow !== null && (
                <div className={styles.highLow}>
                  <span className={styles.metaLabel}>{highLowLabel}</span>
                  <span className={styles.metaValue}>
                    {Math.round(r.dailyHigh)}° / {Math.round(r.dailyLow)}°
                  </span>
                </div>
              )}

              {/* Temperature sparkline */}
              {tempValues.length > 4 && (
                <div className={styles.sparkWrap}>
                  <Sparkline values={tempValues} />
                </div>
              )}

              {/* Grid of metrics */}
              <div className={styles.metricsRow}>
                <div className={styles.metric}>
                  <Icon name="wind" size={14} />
                  <span className={styles.metricLabel}>{windLabel}</span>
                  <span className={styles.metricValue}>
                    {r.windSpeed !== null
                      ? `${formatMetric(r.windSpeed)} km/h`
                      : "?"}
                  </span>
                  <span className={styles.metricSub}>
                    {windFromText(windDirectionLabel(r.windDirection), locale)}
                  </span>
                </div>

                <div className={styles.metric}>
                  <Icon name="info" size={14} />
                  <span className={styles.metricLabel}>{humidLabel}</span>
                  <span className={styles.metricValue}>
                    {r.humidity !== null ? `${Math.round(r.humidity)}%` : "?"}
                  </span>
                </div>

                <div className={styles.metric}>
                  <Icon name="trend" size={14} />
                  <span className={styles.metricLabel}>{precipLabel}</span>
                  <span className={styles.metricValue}>
                    {r.precipitation !== null
                      ? `${formatMetric(r.precipitation)} mm`
                      : "0 mm"}
                  </span>
                  <span className={styles.metricSub}>
                    {total72hLabel}: {formatMetric(precip72)} mm
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
