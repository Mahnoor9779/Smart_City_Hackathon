/**
 * Now, the opening screen.
 *
 * THE RULE THIS SCREEN EXISTS TO OBEY: one number, one sentence, one action.
 *
 * Server component handles efficient caching and data retrieval from Open-Meteo,
 * then hands off to NowView for instant reactive client-side locale switching.
 */

import { fetchAirQuality } from "@/lib/data/air";
import { NowView } from "./NowView";

export const revalidate = 600;

export default async function NowPage() {
  const readings = await fetchAirQuality();
  return <NowView readings={readings} />;
}
