/**
 * Area profile. The "know your neighbourhood" screen, feature S03.
 *
 * The locator map repeats here at small size, deliberately. On a detail page the
 * reader has usually arrived from a link and needs re-orienting, and a
 * highlighted shape does that faster than a breadcrumb ever will.
 *
 * Server Component fetches data with ISR revalidation, then hands off to
 * the AreaDetailView client component for live reactive Urdu/English i18n.
 */

import { notFound } from "next/navigation";
import { fetchAirQuality } from "@/lib/data/air";
import { AREAS, areaById } from "@/lib/geo/lahore";
import { AreaDetailView } from "./AreaDetailView";

export const revalidate = 600;

export function generateStaticParams() {
  return AREAS.map((a) => ({ id: a.id }));
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const area = areaById(id);
  if (!area) notFound();

  const readings = await fetchAirQuality();
  const reading = readings.find((r) => r.areaId === area.id);

  return <AreaDetailView area={area} reading={reading} readings={readings} />;
}
