/**
 * Score page. Server component.
 * Fetches air quality data and computes Civic Access Scores for all tehsils.
 */

import { fetchAirQuality } from "@/lib/data/air";
import { ScoreView } from "./ScoreView";

export const revalidate = 600;

export default async function ScorePage() {
  const readings = await fetchAirQuality();
  return <ScoreView readings={readings} />;
}
