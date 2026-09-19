/**
 * Weather page. Server component.
 * Fetches live weather from Open-Meteo (keyless) for all 5 tehsils.
 */

import { fetchWeather } from "@/lib/data/weather";
import { WeatherView } from "./WeatherView";

export const revalidate = 600;

export default async function WeatherPage() {
  const readings = await fetchWeather();
  return <WeatherView readings={readings} />;
}
