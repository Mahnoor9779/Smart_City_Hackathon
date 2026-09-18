/**
 * Compare page.
 *
 * Side-by-side tehsil inequality analysis. Fetches live air quality readings
 * and passes them to the interactive CompareView component.
 */

import type { Metadata } from "next";
import { fetchAirQuality } from "@/lib/data/air";
import { CompareView } from "./CompareView";

export const metadata: Metadata = {
  title: "Compare Tehsils | Lahore Civic Nervous System",
  description:
    "Side-by-side comparison of air quality, population exposure, and peak risk between tehsils in Lahore District.",
};

export const revalidate = 600;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}) {
  const params = await searchParams;
  const left = params.left || "lahore-city";
  const right = params.right || "raiwind";

  const readings = await fetchAirQuality();

  return (
    <CompareView
      initialLeftId={left}
      initialRightId={right}
      readings={readings}
    />
  );
}
