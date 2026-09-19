/**
 * HealthAdvisory
 *
 * Actionable health guidance tied to the current air quality severity level.
 * Every step from 1 (Good) to 6 (Hazardous) gets specific, localized advice
 * for outdoor activity, mask use, and vulnerable group warnings.
 *
 * Feature S03 / X02: severity is never colour alone, and every reading
 * tells you what to DO, not just what it IS.
 */

"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { Icon } from "@/components/ui/Icon";
import type { SeverityStep } from "@/lib/types";
import styles from "./HealthAdvisory.module.css";

interface HealthAdvisoryProps {
  severityStep: SeverityStep | null;
  compact?: boolean;
}

interface Advisory {
  headline: string;
  advice: string[];
  urgency: "safe" | "caution" | "warning" | "danger";
}

function getAdvisoryEn(step: SeverityStep | null): Advisory {
  switch (step) {
    case 1:
      return {
        headline: "Air is safe for all activities",
        advice: [
          "Outdoor exercise is safe for everyone.",
          "Good day to open windows for ventilation.",
        ],
        urgency: "safe",
      };
    case 2:
      return {
        headline: "Acceptable for most people",
        advice: [
          "Unusually sensitive individuals should consider reducing prolonged outdoor exertion.",
          "Most people can continue normal activities.",
        ],
        urgency: "safe",
      };
    case 3:
      return {
        headline: "Reduce outdoor exertion if sensitive",
        advice: [
          "Children, elderly, and people with asthma or heart disease should limit prolonged outdoor exertion.",
          "Keep windows closed if possible.",
          "Consider wearing a well-fitted mask outdoors.",
        ],
        urgency: "caution",
      };
    case 4:
      return {
        headline: "Limit outdoor activity for everyone",
        advice: [
          "Everyone should reduce prolonged outdoor exertion.",
          "Move exercise indoors or reschedule to early morning.",
          "Wear a well-fitted N95 or KN95 mask outdoors.",
          "Keep children indoors during peak hours.",
        ],
        urgency: "warning",
      };
    case 5:
      return {
        headline: "Avoid outdoor activity",
        advice: [
          "Everyone should avoid prolonged outdoor exertion.",
          "Keep all windows and doors closed.",
          "Use air purifiers indoors if available.",
          "N95 mask is essential if you must go outside.",
          "Schools should cancel outdoor activities.",
        ],
        urgency: "danger",
      };
    case 6:
      return {
        headline: "Stay indoors. Emergency level.",
        advice: [
          "Do not go outside unless absolutely necessary.",
          "Seal windows and doors. Run air purifiers.",
          "N95 mask required for any outdoor exposure.",
          "Schools should consider closure.",
          "Seek medical attention if you experience breathing difficulty.",
        ],
        urgency: "danger",
      };
    default:
      return {
        headline: "No air quality data available",
        advice: ["Check back shortly for updated readings."],
        urgency: "safe",
      };
  }
}

function getAdvisoryUr(step: SeverityStep | null): Advisory {
  switch (step) {
    case 1:
      return {
        headline: "تمام سرگرمیوں کے لیے فضا محفوظ ہے",
        advice: [
          "بیرونی ورزش ہر کسی کے لیے محفوظ ہے۔",
          "ہوا کی آمد کے لیے کھڑکیاں کھولنا مناسب ہے۔",
        ],
        urgency: "safe",
      };
    case 2:
      return {
        headline: "زیادہ تر افراد کے لیے قابل قبول",
        advice: [
          "انتہائی حساس افراد طویل بیرونی سرگرمی کم کریں۔",
          "عام شہری معمول کے مطابق سرگرمیاں جاری رکھ سکتے ہیں۔",
        ],
        urgency: "safe",
      };
    case 3:
      return {
        headline: "حساس افراد بیرونی سرگرمی محدود رکھیں",
        advice: [
          "بچے، بزرگ اور سانس کے مریض طویل بیرونی سرگرمی سے گریز کریں۔",
          "ممکن ہو تو کھڑکیاں بند رکھیں۔",
          "باہر ماسک پہننے پر غور کریں۔",
        ],
        urgency: "caution",
      };
    case 4:
      return {
        headline: "ہر شخص بیرونی سرگرمی محدود رکھے",
        advice: [
          "ہر شخص طویل بیرونی سرگرمی کم کرے۔",
          "ورزش گھر کے اندر منتقل کریں۔",
          "باہر N95 یا KN95 ماسک ضرور پہنیں۔",
          "بچوں کو اوقات عروج میں گھر کے اندر رکھیں۔",
        ],
        urgency: "warning",
      };
    case 5:
      return {
        headline: "بیرونی سرگرمی سے مکمل گریز کریں",
        advice: [
          "ہر شخص طویل بیرونی سرگرمی سے مکمل گریز کرے۔",
          "تمام کھڑکیاں اور دروازے بند رکھیں۔",
          "ایئر پیوریفائر استعمال کریں۔",
          "باہر جانا ضروری ہو تو N95 ماسک لازمی ہے۔",
          "اسکولوں میں بیرونی سرگرمیاں منسوخ ہونی چاہئیں۔",
        ],
        urgency: "danger",
      };
    case 6:
      return {
        headline: "گھر سے باہر نہ نکلیں۔ ہنگامی صورتحال۔",
        advice: [
          "انتہائی ضرورت کے بغیر باہر نہ جائیں۔",
          "کھڑکیاں اور دروازے مکمل بند رکھیں۔ ایئر پیوریفائر چلائیں۔",
          "کسی بھی بیرونی جانے پر N95 ماسک لازمی ہے۔",
          "اسکولوں کو بند کرنے پر غور کریں۔",
          "سانس لینے میں دشواری ہو تو فوری طبی مدد حاصل کریں۔",
        ],
        urgency: "danger",
      };
    default:
      return {
        headline: "ہوا کے معیار کا ڈیٹا دستیاب نہیں ہے",
        advice: ["تازہ ترین ریڈنگ کے لیے تھوڑی دیر بعد دیکھیں۔"],
        urgency: "safe",
      };
  }
}

export function HealthAdvisory({
  severityStep,
  compact = false,
}: HealthAdvisoryProps) {
  const { locale } = useLocale();
  const advisory =
    locale === "ur"
      ? getAdvisoryUr(severityStep)
      : getAdvisoryEn(severityStep);

  if (compact && (severityStep === null || severityStep <= 2)) return null;

  const iconName =
    advisory.urgency === "danger" || advisory.urgency === "warning"
      ? "wind"
      : "info";

  return (
    <div
      className={styles.wrap}
      data-urgency={advisory.urgency}
      data-compact={compact ? "true" : undefined}
    >
      <div className={styles.header}>
        <Icon name={iconName} size={18} />
        <h3 className={styles.headline}>{advisory.headline}</h3>
      </div>
      <ul className={styles.list}>
        {advisory.advice.map((item, i) => (
          <li key={i} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
