/**
 * PrintButton
 *
 * One-click print trigger for area detail pages. Renders a clean button that
 * invokes window.print() and hides itself during print (via print.css).
 *
 * Feature S03: the one-page neighbourhood summary a councillor can print.
 */

"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { Icon } from "@/components/ui/Icon";
import styles from "./PrintButton.module.css";

/** Stamps the print footer (print.css reads data-print-date on <main>). */
function stampPrintDate() {
  const main = document.getElementById("main");
  if (main) {
    main.dataset.printDate = new Date().toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    });
  }
}

export function PrintButton() {
  const { locale } = useLocale();
  const label = locale === "ur" ? "پرنٹ کریں" : "Print summary";

  // beforeprint also covers Ctrl+P and the browser menu, not just this button.
  useEffect(() => {
    window.addEventListener("beforeprint", stampPrintDate);
    return () => window.removeEventListener("beforeprint", stampPrintDate);
  }, []);

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => window.print()}
      aria-label={label}
    >
      <Icon name="info" size={16} />
      <span>{label}</span>
    </button>
  );
}
