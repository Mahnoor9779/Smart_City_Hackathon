/**
 * Rankings. The table twin, feature X03 and D03.
 *
 * A ranked list is a to-do list. It turns a map into "these areas need attention
 * first", which is the output an official can act on.
 *
 * Server component handles caching and data retrieval, then hands off to
 * RankingsView for reactive bilingual translations.
 */

import { fetchAirQuality } from "@/lib/data/air";
import { RankingsView } from "./RankingsView";

export const revalidate = 600;

export default async function RankingsPage() {
  const readings = await fetchAirQuality();
  return <RankingsView readings={readings} />;
}
