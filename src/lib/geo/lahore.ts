/**
 * lahore.ts
 *
 * Real geometry for Lahore District and its five tehsils, retrieved from
 * OpenStreetMap via Nominatim and Overpass, simplified with Douglas-Peucker,
 * and projected equirectangular with a latitude correction so the shape is not
 * stretched.
 *
 * WHY TEHSILS AND NOT UNION COUNCILS. The pre-development checklist asked which
 * administrative level OSM actually carries for Lahore. Answer, verified by
 * Overpass across the district bounding box: levels 6 and 7 exist, and there are
 * ZERO relations at level 8 or 9. Union councils are not mapped. Tehsils are the
 * finest unit available, so they are the unit this platform uses, and the
 * interface says so rather than implying a precision the data does not have.
 *
 * Sanity check: the five tehsils sum to 1,809 km2 against a district total of
 * roughly 1,772 km2, inside 2 percent.
 *
 * OpenStreetMap data is ODbL. See LICENCE-DATA.
 */

export interface Area {
  id: string;
  name: string;
  fullName: string;
  blurb: string;
  /** SVG path in the shared district viewBox. */
  path: string;
  /** Label anchor inside the shape, same viewBox. */
  centroid: readonly [number, number];
  /** Real centroid in lon, lat. Used for the air quality lookup. */
  lonLat: readonly [number, number];
  areaKm2: number;
  /**
   * Apportioned from the 2023 census district total of about 11.1 million by
   * relative built-up density. An ESTIMATE, labelled as one in the interface,
   * and replaced by a WorldPop raster in Batch 2.
   */
  populationEstimate: number;
}

export const DISTRICT_NAME = "Lahore District";
export const DISTRICT_POPULATION = 11_100_000;
export const ADMIN_LEVEL_LABEL = "tehsil";
export const MAP_VIEWBOX = "0 0 1000 928";

export const DISTRICT_PATH =
  "M0.0 641.5 L31.9 705.6 L17.1 723.0 L95.6 808.8 L116.0 780.1 L128.8 790.7 L140.1 859.1 L157.8 844.0 L183.2 786.0 L216.8 801.9 L221.2 819.5 L236.1 817.0 L243.5 847.3 L227.4 873.1 L238.0 881.5 L235.9 892.9 L219.4 900.6 L262.5 928.0 L280.3 908.8 L303.2 914.2 L318.7 882.8 L373.9 848.5 L374.1 832.5 L413.8 808.5 L453.7 835.4 L497.8 817.1 L535.4 825.4 L555.9 812.6 L606.2 808.9 L636.2 792.1 L618.7 843.2 L628.5 858.2 L654.5 849.2 L669.8 807.6 L672.8 727.5 L694.6 654.4 L711.0 652.5 L717.2 632.4 L743.8 633.3 L757.0 666.2 L802.2 643.4 L841.3 650.6 L843.1 629.0 L891.6 603.1 L895.7 571.4 L917.5 531.1 L945.4 531.2 L950.2 512.6 L981.3 538.3 L1000.0 520.3 L975.2 487.2 L997.8 467.2 L971.7 426.6 L958.5 428.1 L961.3 414.9 L972.2 413.8 L950.0 418.8 L930.8 386.6 L907.6 383.4 L896.2 393.3 L877.6 384.5 L896.0 378.6 L885.0 373.5 L891.2 348.6 L935.5 336.9 L937.8 293.7 L944.6 292.9 L926.0 273.1 L940.1 261.3 L903.5 252.1 L877.7 198.0 L846.9 190.9 L833.2 122.5 L819.1 109.0 L823.5 96.8 L805.8 85.1 L815.4 64.8 L764.3 32.2 L760.2 7.2 L745.1 0.0 L695.1 41.1 L665.9 37.6 L685.3 75.3 L618.2 132.2 L558.4 78.8 L508.4 125.8 L502.7 153.3 L488.2 159.3 L481.9 133.4 L465.0 126.7 L462.2 111.8 L424.4 121.2 L416.1 155.2 L398.9 155.6 L403.1 177.7 L388.9 186.0 L392.2 203.8 L370.4 197.6 L361.6 205.5 L377.8 240.7 L367.4 245.9 L371.8 262.6 L272.5 368.5 L271.8 414.8 L260.6 428.8 L267.3 445.5 L221.0 470.9 L206.1 519.0 L187.4 532.1 L176.9 476.1 L156.8 462.1 L104.5 537.4 L107.5 566.2 L119.5 575.0 L102.3 619.6 L65.7 631.0 L11.2 624.9 L0.0 641.5 Z";

export const AREAS: readonly Area[] = [
  {
    id: "lahore-cantonment",
    name: "Lahore Cantonment",
    fullName: "Lahore Cantonment Tehsil",
    blurb:
      "Cantonment, DHA and the airport corridor along the eastern edge.",
    path:
      "M891.2 348.6 L885.0 373.5 L896.0 378.6 L877.7 383.5 L881.9 389.2 L930.8 386.6 L950.0 418.8 L972.2 413.8 L961.3 414.9 L958.5 428.1 L971.7 426.6 L996.2 463.6 L975.2 487.2 L1000.0 520.3 L981.3 538.3 L950.2 512.6 L945.4 531.2 L917.5 531.1 L895.7 571.4 L891.6 603.1 L843.1 629.0 L841.3 650.6 L802.2 643.4 L757.0 666.2 L743.8 633.3 L717.2 632.4 L711.0 652.5 L694.6 654.4 L686.2 696.9 L662.6 672.5 L627.9 693.7 L606.6 600.6 L608.4 565.0 L629.1 562.7 L659.2 537.5 L641.1 470.2 L653.3 442.7 L567.5 448.3 L551.6 413.5 L508.2 375.8 L533.2 326.4 L517.7 320.3 L528.9 306.2 L515.3 286.0 L577.1 276.3 L608.5 290.3 L607.3 309.5 L647.0 309.9 L661.5 261.9 L764.8 243.6 L764.1 281.3 L775.9 285.1 L756.1 330.8 L769.0 357.3 L799.5 346.7 L796.6 371.0 L836.3 376.6 L841.5 363.7 L864.4 370.6 L877.0 346.1 L891.2 348.6 Z",
    centroid: [744.5, 463.2],
    lonLat: [74.5078, 31.4646],
    areaKm2: 441,
    populationEstimate: 2800000,
  },
  {
    id: "lahore-city",
    name: "Lahore City",
    fullName: "Lahore City Tehsil",
    blurb:
      "The dense historic core, from the Walled City out through Anarkali and Shahdara.",
    path:
      "M402.2 467.7 L408.6 473.3 L406.5 481.3 L443.3 481.9 L447.3 475.2 L429.0 471.2 L414.5 456.8 L418.5 436.9 L436.1 406.8 L414.7 393.7 L424.9 381.7 L416.7 370.5 L420.1 352.8 L457.1 335.7 L450.8 330.4 L458.2 330.1 L463.2 313.2 L479.6 309.1 L475.9 298.0 L480.9 294.4 L487.7 305.1 L517.7 320.3 L528.9 306.2 L515.3 286.0 L481.4 261.4 L482.2 249.4 L508.1 249.6 L526.8 261.1 L526.1 249.0 L533.9 248.6 L528.5 213.7 L539.8 215.1 L542.8 201.5 L542.3 193.9 L535.0 192.1 L541.5 176.4 L538.7 165.1 L548.3 159.9 L579.1 166.5 L577.6 158.1 L587.4 157.7 L581.5 131.5 L592.0 106.8 L571.9 84.0 L558.4 78.8 L508.4 125.8 L511.8 133.1 L502.7 153.3 L488.2 159.3 L481.9 133.4 L465.0 126.7 L462.2 111.8 L447.2 110.1 L439.5 121.4 L434.2 116.4 L424.4 121.2 L425.4 135.5 L416.1 155.2 L398.9 155.6 L403.1 177.7 L388.9 186.0 L392.2 203.8 L383.4 207.9 L370.4 197.6 L361.6 205.5 L377.8 240.7 L367.4 245.9 L371.8 262.6 L334.5 294.1 L272.5 368.5 L271.8 414.8 L260.6 428.8 L267.3 445.5 L259.7 451.1 L257.5 463.9 L271.8 477.2 L293.9 479.1 L310.3 491.8 L329.5 494.7 L334.6 476.3 L354.4 463.3 L379.5 457.7 L402.2 467.7 Z",
    centroid: [414.0, 293.9],
    lonLat: [74.2929, 31.5572],
    areaKm2: 213,
    populationEstimate: 3600000,
  },
  {
    id: "model-town",
    name: "Model Town",
    fullName: "Model Town Tehsil",
    blurb:
      "Model Town, Johar Town and Township across the southern belt.",
    path:
      "M402.2 467.7 L408.6 473.3 L406.5 481.3 L445.3 481.4 L447.6 472.9 L429.0 471.2 L414.5 456.8 L418.5 436.9 L436.1 406.8 L414.7 393.7 L424.9 381.7 L416.7 370.5 L416.8 357.0 L457.1 335.7 L450.8 330.4 L458.2 330.1 L463.2 313.2 L479.6 309.1 L475.9 298.0 L480.9 294.4 L487.7 305.1 L533.2 326.4 L508.2 375.8 L534.4 405.2 L551.6 413.5 L567.5 448.3 L587.4 440.5 L629.2 445.3 L652.1 440.5 L641.5 453.6 L641.1 470.2 L648.2 515.2 L657.2 518.6 L659.2 537.5 L643.2 542.6 L629.1 562.7 L608.4 565.0 L606.6 600.6 L621.7 642.1 L627.9 693.7 L662.6 672.5 L672.8 689.2 L686.2 696.9 L672.8 727.5 L669.8 807.6 L654.5 849.2 L628.5 858.2 L628.8 849.1 L618.7 843.2 L625.7 835.8 L626.1 805.8 L635.6 803.2 L636.2 792.1 L621.3 794.5 L606.2 808.9 L555.9 812.6 L535.4 825.4 L513.7 815.0 L512.9 787.0 L504.1 780.4 L499.5 760.0 L509.9 745.4 L510.0 699.1 L493.5 682.7 L479.1 679.5 L465.2 685.5 L430.3 657.6 L417.1 662.5 L393.7 658.0 L388.0 636.0 L394.2 635.5 L394.1 629.1 L373.0 580.1 L373.7 533.2 L354.5 510.1 L377.8 486.8 L396.3 503.6 L405.1 481.3 L397.7 477.1 L402.2 467.7 Z",
    centroid: [526.8, 581.6],
    lonLat: [74.343, 31.3985],
    areaKm2: 352,
    populationEstimate: 2400000,
  },
  {
    id: "raiwind",
    name: "Raiwind",
    fullName: "Raiwind Tehsil",
    blurb:
      "The rural and peri-urban south west, the least built-up tehsil.",
    path:
      "M259.7 451.1 L257.9 466.6 L271.8 477.2 L293.9 479.1 L310.3 491.8 L329.5 494.7 L334.6 476.3 L354.4 463.3 L379.5 457.7 L399.8 463.6 L397.7 477.1 L405.1 481.3 L396.3 503.6 L377.8 486.8 L354.5 510.1 L373.7 533.2 L373.0 580.1 L394.1 629.1 L394.2 635.5 L388.0 636.0 L393.7 658.0 L417.1 662.5 L430.3 657.6 L469.3 686.8 L479.1 679.5 L493.5 682.7 L513.4 708.9 L506.2 726.4 L509.9 745.4 L499.5 760.0 L504.1 780.4 L512.9 787.0 L513.7 815.0 L453.7 835.4 L413.8 808.5 L403.2 813.3 L374.1 832.5 L373.9 848.5 L350.1 856.8 L318.7 882.8 L303.2 914.2 L280.3 908.8 L263.8 919.3 L262.5 928.0 L219.4 900.6 L235.9 892.9 L238.0 881.5 L227.4 873.1 L243.5 847.3 L232.0 824.8 L236.1 817.0 L221.2 819.5 L216.8 801.9 L199.6 787.7 L183.2 786.0 L168.7 808.5 L171.2 821.2 L157.8 844.0 L140.1 859.1 L128.8 790.7 L116.0 780.1 L103.0 790.8 L95.6 808.8 L17.1 723.0 L31.9 705.6 L0.0 641.5 L11.2 624.9 L65.7 631.0 L81.4 621.4 L102.3 619.6 L119.5 575.0 L116.5 564.5 L107.5 566.2 L104.5 537.4 L156.8 462.1 L176.9 476.1 L187.4 532.1 L194.9 519.0 L206.1 519.0 L210.5 487.5 L221.0 470.9 L259.7 451.1 Z",
    centroid: [261.5, 683.9],
    lonLat: [74.1885, 31.339],
    areaKm2: 505,
    populationEstimate: 700000,
  },
  {
    id: "shalimar",
    name: "Shalimar",
    fullName: "Shalimar Tehsil",
    blurb:
      "Shalimar Gardens, Baghbanpura and the northern industrial fringe.",
    path:
      "M515.3 286.0 L481.4 261.4 L482.2 249.4 L508.1 249.6 L526.8 261.1 L526.1 249.0 L533.9 248.6 L528.5 213.7 L539.8 215.1 L542.8 201.5 L542.3 193.9 L535.0 192.1 L541.5 176.4 L538.7 165.1 L548.3 159.9 L579.1 166.5 L577.6 158.1 L588.6 154.9 L581.1 135.7 L592.0 106.8 L618.2 132.2 L665.2 84.0 L685.3 75.3 L665.2 48.1 L665.9 37.6 L695.1 41.1 L701.8 27.1 L745.4 -0.0 L760.2 7.2 L766.5 19.6 L764.3 32.2 L798.7 47.9 L815.4 64.8 L805.8 85.1 L823.5 96.8 L819.1 109.0 L821.6 117.9 L833.2 122.5 L832.7 145.1 L846.9 190.9 L877.7 198.0 L883.1 205.8 L876.8 209.2 L886.2 215.6 L886.3 228.5 L903.5 252.1 L932.4 264.8 L940.1 261.3 L926.0 273.1 L940.5 282.1 L944.6 292.9 L937.8 293.7 L935.5 336.9 L921.5 342.8 L909.4 339.2 L892.0 348.6 L877.0 346.1 L864.4 370.6 L841.5 363.7 L836.3 376.6 L818.4 367.7 L796.6 371.0 L799.5 346.7 L769.0 357.3 L756.1 330.8 L756.4 322.8 L765.5 317.7 L765.4 298.6 L775.9 285.1 L764.1 281.3 L764.8 243.6 L661.5 261.9 L658.4 289.7 L653.6 287.4 L647.0 309.9 L607.3 309.5 L608.5 290.3 L595.8 289.9 L577.1 276.3 L515.3 286.0 Z",
    centroid: [732.8, 203.2],
    lonLat: [74.4766, 31.5928],
    areaKm2: 298,
    populationEstimate: 1600000,
  },
];

export function areaById(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}
