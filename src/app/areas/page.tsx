/**
 * Areas. The map screen.
 *
 * Separate from Now because it does a different job: Now answers "how bad is it",
 * this answers "where, and how do they compare".
 *
 * Server component handles caching and data retrieval, then hands off to
 * AreasView for reactive bilingual translations.
 */

import { fetchAirQuality } from "@/lib/data/air";
import { AreasView } from "./AreasView";

export const revalidate = 600;

export default async function AreasPage() {
  const readings = await fetchAirQuality();
  return <AreasView readings={readings} />;
}
