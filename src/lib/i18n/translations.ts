/**
 * Bilingual translations dictionary (English / Urdu).
 * Provides authentic local Urdu vocabulary for Lahore's civic nervous system.
 *
 * NOTE: All copy strictly adheres to project invariants:
 * - ZERO em dashes.
 * - ZERO emoji.
 * - Authentic civic Urdu terminology tailored for Lahore District.
 */

export type Locale = "en" | "ur";

export interface TranslationDict {
  nav: {
    now: string;
    areas: string;
    rankings: string;
    compare: string;
    district: string;
    tehsilsSuffix: string;
    liveAir: string;
  };
  areas: Record<string, { name: string; blurb: string }>;
  severity: Record<number, string>;
  metrics: {
    airQuality: string;
    population: string;
    area: string;
    peopleBreathing: string;
    peopleLiveHere: string;
    people: string;
    residents: string;
    worstIn3Days: string;
    lastUpdated: string;
    peakingNow: string;
    density: string;
    estimated: string;
    ugm3: string;
    km2: string;
    peoplePerKm2: string;
  };
  home: {
    liveNow: string;
    updatedAgo: (age: string) => string;
    theAirInPlace: string;
    cleanHeadline: string;
    acceptableHeadline: string;
    unhealthySensitiveHeadline: (times: number) => string;
    unhealthyEveryoneHeadline: (times: number) => string;
    veryUnhealthyHeadline: (times: number) => string;
    hazardousHeadline: (times: number) => string;
    unavailableHeadline: string;
    exposedCount: (count: string) => string;
    seeByTehsil: string;
    worstRightNow: (name: string) => string;
    mapCaption: (worstName?: string) => string;
    everyTehsil: string;
    rankThem: string;
    trendOver24h: (trend: string) => string;
    trendRising: string;
    trendFalling: string;
    trendSteady: string;
    whatColoursMean: string;
    scaleExplanation: string;
  };
  alert: {
    hazardActive: string;
    surgeWarning: string;
    radarNominal: string;
    activeNowAcross: (names: string) => string;
    surgeArriving: (hours: number, names: string) => string;
    noExtremeSurge: string;
    safeWindowCloses: (hours: number, peak: string) => string;
    districtPeakNear: (peak: string) => string;
    hideProjection: string;
    showProjection: string;
    hourlyTitle: string;
    schoolAdvisory: string;
    nowTick: string;
  };
  areaDetail: {
    allTehsils: string;
    location: string;
    whereSits: string;
    populationNote: string;
    areaNote: string;
    peakingNowNote: string;
    peakingHoursNote: (hours: number, band: string) => string;
    updateNote: string;
    nextThreeDays: string;
    chartLede: (areaName: string) => string;
    whereSitsScale: string;
    disclaimerNote: string;
    chartNow: string;
    chartPeak: (val: string) => string;
    chartCaptionDefault: string;
    chartInHours: (hours: number) => string;
  };
  rankings: {
    title: string;
    lede: (avg: string) => string;
    thRank: string;
    thTehsil: string;
    thPm25: string;
    thBand: string;
    thPeople: string;
    thArea: string;
    thOpen: string;
    openLink: string;
    footnote: string;
  };
  areasList: {
    title: string;
    lede: string;
  };
  compare: {
    kicker: string;
    title: string;
    lede: string;
    firstTehsil: string;
    secondTehsil: string;
    swap: string;
    tehsilA: string;
    tehsilB: string;
    viewProfile: (name: string) => string;
    airQualityTitle: string;
    identicalAir: string;
    higherAir: (name: string, diff: string) => string;
    popExposureTitle: string;
    equalPop: string;
    higherPop: (name: string, ratio: string) => string;
    densityTitle: string;
    higherDensity: (name: string, ratio: number) => string;
    peakRiskTitle: string;
    peakRiskSummary: string;
    totalArea: (km2: number) => string;
    peakingNow: string;
    inHours: (hours: number) => string;
    noForecast: string;
  };
  locator: {
    notificationTitle: string;
    findMyTehsil: string;
    findDescription: string;
    locateButton: string;
    detectShort: string;
    outsideShort: string;
    locating: string;
    yourTehsil: string;
    basedOnLocation: (distanceKm: number) => string;
    savedLocation: string;
    outsideDistrict: (distanceKm: number) => string;
    permissionDenied: string;
    unavailable: string;
    viewTehsilProfile: string;
    changeLocation: string;
    retry: string;
    yourTehsilChip: string;
    dismiss: string;
  };
}

export const TRANSLATIONS: Record<Locale, TranslationDict> = {
  en: {
    nav: {
      now: "Now",
      areas: "Areas",
      rankings: "Rankings",
      compare: "Compare",
      district: "Lahore District",
      tehsilsSuffix: "tehsils",
      liveAir: "live air quality",
    },
    areas: {
      "lahore-cantonment": {
        name: "Lahore Cantonment",
        blurb: "Cantonment, DHA and the airport corridor along the eastern edge.",
      },
      "lahore-city": {
        name: "Lahore City",
        blurb: "The historic core, Walled City and the dense central business district.",
      },
      "model-town": {
        name: "Model Town",
        blurb: "Model Town, Johar Town and Township across the southern belt.",
      },
      raiwind: {
        name: "Raiwind",
        blurb: "The rural and peri-urban south west, the least built-up tehsil.",
      },
      shalimar: {
        name: "Shalimar",
        blurb: "Shalimar Gardens, Baghbanpura and the northern industrial fringe.",
      },
    },
    severity: {
      1: "Good",
      2: "Moderate",
      3: "Unhealthy for sensitive groups",
      4: "Unhealthy",
      5: "Very Unhealthy",
      6: "Hazardous",
    },
    metrics: {
      airQuality: "Air quality, PM2.5",
      population: "Population",
      area: "Area",
      peopleBreathing: "people breathing it",
      peopleLiveHere: "people live here",
      people: "people",
      residents: "residents",
      worstIn3Days: "Worst in the next 3 days",
      lastUpdated: "Last updated",
      peakingNow: "Peaking now",
      density: "Built-Up Density",
      estimated: "estimated",
      ugm3: "ug/m3",
      km2: "km2",
      peoplePerKm2: "people / km2",
    },
    home: {
      liveNow: "Live now",
      updatedAgo: (age: string) => `updated ${age}`,
      theAirInPlace: "The air in Lahore right now",
      cleanHeadline: "Air is clean across Lahore today. This is as good as it gets here.",
      acceptableHeadline: "Air is acceptable today, though sensitive groups may still notice it.",
      unhealthySensitiveHeadline: (times: number) =>
        `Air is unhealthy for children, older people and anyone with asthma. About ${times} times the level the World Health Organization considers safe.`,
      unhealthyEveryoneHeadline: (times: number) =>
        `Air is unhealthy for everyone, not just sensitive groups. About ${times} times the level the World Health Organization considers safe.`,
      veryUnhealthyHeadline: (times: number) =>
        `Air is very unhealthy. About ${times} times the safe level. Outdoor activity should be limited across the district.`,
      hazardousHeadline: (times: number) =>
        `Air is hazardous. About ${times} times the safe level. This is an emergency level for the whole population.`,
      unavailableHeadline: "Air quality is unavailable right now. The map and area profiles still work.",
      exposedCount: (count: string) => `${count} people live where the air is unhealthy or worse.`,
      seeByTehsil: "See it by tehsil",
      worstRightNow: (name: string) => `Worst right now: ${name}`,
      mapCaption: (worstName?: string) =>
        `Lahore District, shaded by current air quality.${worstName ? ` ${worstName} is worst right now.` : ""}`,
      everyTehsil: "Every tehsil",
      rankThem: "Rank them",
      trendOver24h: (trend: string) => `${trend} over 24h`,
      trendRising: "rising",
      trendFalling: "falling",
      trendSteady: "steady",
      whatColoursMean: "What the colours mean",
      scaleExplanation:
        "Bands follow the US EPA breakpoints for PM2.5. The ramp avoids red and green, which are the hardest pair to tell apart for roughly one in twelve men, and every band is labelled so colour is never the only signal.",
    },
    alert: {
      hazardActive: "Hazard Inversion Active",
      surgeWarning: "Smog Inversion Warning",
      radarNominal: "Air Forecast Radar",
      activeNowAcross: (names: string) => `Unhealthy air active now across ${names}.`,
      surgeArriving: (hours: number, names: string) =>
        `Smog surge arriving in ${hours} hours. ${names} in entry path.`,
      noExtremeSurge: "No extreme hazardous surges forecasted in the next 48 hours.",
      safeWindowCloses: (hours: number, peak: string) =>
        `Safe outdoor window closes in approximately ${hours} hours. Projected peak reaches ${peak} ug/m3.`,
      districtPeakNear: (peak: string) =>
        `Expected peak across district remains near ${peak} ug/m3.`,
      hideProjection: "Hide projection",
      showProjection: "24h Projection",
      hourlyTitle: "District hourly particulate forecast (next 24 hours)",
      schoolAdvisory:
        "School sports advisory: Restrict morning outdoor drills when bars turn dark.",
      nowTick: "Now",
    },
    areaDetail: {
      allTehsils: "All tehsils",
      location: "Location",
      whereSits: "Where this sits in the district",
      populationNote: "Apportioned from the 2023 census district total. An estimate, not a count.",
      areaNote: "Measured from the OpenStreetMap boundary.",
      peakingNowNote: "Peaking now.",
      peakingHoursNote: (hours: number, band: string) =>
        `In about ${hours} hours, reaching ${band.toLowerCase()} levels.`,
      updateNote: "Refreshed every 10 minutes from Open-Meteo.",
      nextThreeDays: "The next three days",
      chartLede: (areaName: string) =>
        `Hourly PM2.5 forecast for ${areaName}. The dashed lines are the health thresholds, so you can see when the air crosses one.`,
      whereSitsScale: "Where this sits on the scale",
      disclaimerNote:
        "Air quality here comes from a model grid of roughly 11 km, which is coarser than this tehsil. The reading is an estimate for the area rather than a measurement taken inside it. Ground sensor readings arrive when the OpenAQ and Punjab EPA adapters land.",
      chartNow: "now",
      chartPeak: (val: string) => `peak ${val}`,
      chartCaptionDefault:
        "Next 72 hours. Hover to read any hour. Lines mark the health thresholds.",
      chartInHours: (hours: number) => (hours === 0 ? "now" : `in ${hours} hours`),
    },
    rankings: {
      title: "Worst air first",
      lede: (avg: string) =>
        `Every tehsil in Lahore District, ranked by PM2.5 right now. The population weighted district average is ${avg} ug/m3.`,
      thRank: "#",
      thTehsil: "Tehsil",
      thPm25: "PM2.5",
      thBand: "Band",
      thPeople: "People",
      thArea: "Area",
      thOpen: "Open profile",
      openLink: "Open",
      footnote:
        "PM2.5 in micrograms per cubic metre, from Open-Meteo, refreshed every ten minutes. Bars are scaled against the worst area, so they compare the five with each other rather than against zero. Population figures are apportioned estimates from the 2023 census district total, not counts. Areas are measured from OpenStreetMap boundaries.",
    },
    areasList: {
      title: "Lahore District",
      lede: "Five tehsils, shaded by air quality right now. Select one to open its profile.",
    },
    compare: {
      kicker: "Inequality analysis",
      title: "Side-by-side comparison",
      lede: "Select two tehsils to examine disparities in air quality, exposure, density, and forecast peaks across Lahore District.",
      firstTehsil: "First tehsil",
      secondTehsil: "Second tehsil",
      swap: "Swap tehsils",
      tehsilA: "Tehsil A",
      tehsilB: "Tehsil B",
      viewProfile: (name: string) => `View ${name} profile`,
      airQualityTitle: "Air Quality (PM2.5 right now)",
      identicalAir: "Both areas have identical current readings.",
      higherAir: (name: string, diff: string) =>
        `${name} has ${diff} ug/m3 higher PM2.5.`,
      popExposureTitle: "Population Exposure",
      equalPop: "Both areas have equal population estimates.",
      higherPop: (name: string, ratio: string) =>
        `${name} has ${ratio}x more residents breathing this air.`,
      densityTitle: "Built-Up Density",
      higherDensity: (name: string, ratio: number) =>
        `${name} is ${ratio}x more densely populated.`,
      peakRiskTitle: "Peak Smog Risk (Next 72 Hours)",
      peakRiskSummary: "Forecasted maximum concentration from Open-Meteo model.",
      totalArea: (km2: number) => `${km2} km2 total`,
      peakingNow: "Peaking now",
      inHours: (hours: number) => `In ${hours} hours`,
      noForecast: "No forecast",
    },
    locator: {
      notificationTitle: "Localize your live alert",
      findMyTehsil: "Know your tehsil",
      findDescription: "Detect your location to see air quality, health risk, and clinic access in your tehsil.",
      locateButton: "Locate my tehsil",
      detectShort: "Detect Tehsil",
      outsideShort: "Outside Lahore",
      locating: "Finding your location...",
      yourTehsil: "Your tehsil",
      basedOnLocation: (dist: number) => `Detected ${dist} km from center`,
      savedLocation: "Saved from previous visit",
      outsideDistrict: (dist: number) => `You appear to be ${dist} km outside Lahore District. Showing whole-city summary.`,
      permissionDenied: "Location permission denied. You can select your tehsil manually below.",
      unavailable: "Location is unavailable on this device. Select your tehsil from the list.",
      viewTehsilProfile: "View tehsil profile",
      changeLocation: "Change",
      retry: "Try again",
      yourTehsilChip: "Your tehsil",
      dismiss: "Dismiss",
    },
  },
  ur: {
    nav: {
      now: "ابھی",
      areas: "علاقے",
      rankings: "درجہ بندی",
      compare: "موازنہ",
      district: "ضلع لاہور",
      tehsilsSuffix: "تحصیلیں",
      liveAir: "براہ راست ہوا کا معیار",
    },
    areas: {
      "lahore-cantonment": {
        name: "لاہور کینٹ",
        blurb: "کینٹ، ڈی ایچ اے اور مشرقی پٹی کے ساتھ ایئرپورٹ راہداری۔",
      },
      "lahore-city": {
        name: "لاہور سٹی",
        blurb: "تاریخی مرکز، اندرون شہر اور گنجان کاروباری علاقہ۔",
      },
      "model-town": {
        name: "ماڈل ٹاؤن",
        blurb: "ماڈل ٹاؤن، جوہر ٹاؤن اور جنوبی پٹی پر پھیلا ہوا ٹاؤن شپ۔",
      },
      raiwind: {
        name: "رائے ونڈ",
        blurb: "دیہی اور نیم شہری جنوب مغرب، سب سے کم آبادی والی تحصیل۔",
      },
      shalimar: {
        name: "شالامار",
        blurb: "شالامار باغ، باغبانپورہ اور شمالی صنعتی علاقہ۔",
      },
    },
    severity: {
      1: "بہتر",
      2: "معتدل",
      3: "حساس افراد کے لیے مضر",
      4: "مضر صحت",
      5: "انتہائی مضر صحت",
      6: "خطرناک",
    },
    metrics: {
      airQuality: "ہوا کا معیار، پی ایم 2.5",
      population: "آبادی",
      area: "رقبہ",
      peopleBreathing: "شہری اس فضا میں سانس لے رہے ہیں",
      peopleLiveHere: "شہری یہاں مقیم ہیں",
      people: "افراد",
      residents: "شہری",
      worstIn3Days: "اگلے 3 دنوں میں بدترین سطح",
      lastUpdated: "تازہ ترین ریکارڈ",
      peakingNow: "اس وقت عروج پر",
      density: "آبادیاتی کثافت",
      estimated: "تخمینہ",
      ugm3: "مائیکروگرام / مکعب میٹر",
      km2: "مربع کلومیٹر",
      peoplePerKm2: "افراد فی مربع کلومیٹر",
    },
    home: {
      liveNow: "براہ راست فضا",
      updatedAgo: (age: string) => `تازہ ترین ${age}`,
      theAirInPlace: "لاہور کی موجودہ فضا",
      cleanHeadline: "آج لاہور بھر میں ہوا صاف ہے۔ یہ فضا کے لیے بہترین معیار ہے۔",
      acceptableHeadline: "آج ہوا کا معیار تسلی بخش ہے، البتہ حساس افراد احتیاط برتیں۔",
      unhealthySensitiveHeadline: (times: number) =>
        `بچوں، بزرگوں اور سانس کے مریضوں کے لیے فضا مضر ہے۔ عالمی ادارہ صحت کی محفوظ حد سے تقریباً ${times} گنا زیادہ۔`,
      unhealthyEveryoneHeadline: (times: number) =>
        `تمام شہریوں کے لیے فضا غیر صحت بخش ہے۔ عالمی ادارہ صحت کی محفوظ حد سے تقریباً ${times} گنا زیادہ۔`,
      veryUnhealthyHeadline: (times: number) =>
        `فضا انتہائی مضر صحت ہے۔ محفوظ حد سے تقریباً ${times} گنا زیادہ۔ ضلع بھر میں کھلی جگہوں پر سرگرمیاں محدود رکھیں۔`,
      hazardousHeadline: (times: number) =>
        `فضا خطرناک ترین سطح پر ہے۔ محفوظ حد سے تقریباً ${times} گنا زیادہ۔ تمام آبادی کے لیے ہنگامی صورتحال۔`,
      unavailableHeadline: "ہوا کے معیار کا ڈیٹا اس وقت دستیاب نہیں ہے۔ نقشہ اور پروفائل فعال ہیں۔",
      exposedCount: (count: string) => `${count} شہری ایسے علاقوں میں مقیم ہیں جہاں فضا مضر صحت یا خطرناک ہے۔`,
      seeByTehsil: "تحصیل کے لحاظ سے جائزہ",
      worstRightNow: (name: string) => `بدترین صورتحال: ${name}`,
      mapCaption: (worstName?: string) =>
        `ضلع لاہور، موجودہ فضائی معیار کے مطابق۔${worstName ? ` ${worstName} میں فضا سب سے زیادہ آلودہ ہے۔` : ""}`,
      everyTehsil: "تمام تحصیلیں",
      rankThem: "درجہ بندی دیکھیں",
      trendOver24h: (trend: string) => `24 گھنٹوں میں ${trend}`,
      trendRising: "بڑھاؤ",
      trendFalling: "کمی",
      trendSteady: "استحکام",
      whatColoursMean: "رنگوں کی علامتیں",
      scaleExplanation:
        "یہ رنگ امریکی ای پی اے کے پی ایم 2.5 معیار کی عکاسی کرتے ہیں۔ ہر رنگ واضح لیبل کے ساتھ ہے تاکہ بینائی کے فرق کے بغیر ہر شہری فوری آگاہ ہو سکے۔",
    },
    alert: {
      hazardActive: "شدید اسموگ کی موجودگی",
      surgeWarning: "اسموگ انورژن انتباہ",
      radarNominal: "فضائی پیش گوئی ریڈار",
      activeNowAcross: (names: string) => `${names} میں اس وقت مضر فضا برقرار ہے۔`,
      surgeArriving: (hours: number, names: string) =>
        `${hours} گھنٹوں میں اسموگ لہر متوقع۔ ${names} اس کے راستے میں ہیں۔`,
      noExtremeSurge: "اگلے 48 گھنٹوں میں کسی غیر معمولی اسموگ لہر کی پیش گوئی نہیں ہے۔",
      safeWindowCloses: (hours: number, peak: string) =>
        `محفوظ بیرونی وقت تقریباً ${hours} گھنٹوں میں ختم ہوگا۔ متوقع عروج ${peak} مائیکروگرام تک پہنچے گا۔`,
      districtPeakNear: (peak: string) =>
        `ضلع بھر میں متوقع زیادہ سے زیادہ سطح ${peak} مائیکروگرام کے قریب رہے گی۔`,
      hideProjection: "پیش گوئی چھپائیں",
      showProjection: "24 گھنٹے کا منظر",
      hourlyTitle: "ضلع کی فی گھنٹہ فضائی پیش گوئی (اگلے 24 گھنٹے)",
      schoolAdvisory:
        "اسکول اور کھیل ایڈوائزری: جب بارز گہرے رنگ کی ہوں تو صبح کی بیرونی مشقیں منسوخ رکھیں۔",
      nowTick: "ابھی",
    },
    areaDetail: {
      allTehsils: "تمام تحصیلیں",
      location: "محل وقوع",
      whereSits: "ضلع میں اس کا جغرافیائی مقام",
      populationNote: "2023 کی مردم شماری کے ضلعی کل سے تخمینہ شدہ۔ ایک اندازہ، قطعی شمار نہیں۔",
      areaNote: "اوپن اسٹریٹ میپ کی سرکاری حدود سے پیمائش شدہ۔",
      peakingNowNote: "اس وقت عروج پر ہے۔",
      peakingHoursNote: (hours: number, band: string) =>
        `تقریباً ${hours} گھنٹوں میں ${band} سطح تک پہنچنے کی پیش گوئی ہے۔`,
      updateNote: "اوپن میٹیو سے ہر 10 منٹ بعد از خود تازہ ترین۔",
      nextThreeDays: "اگلے تین دن",
      chartLede: (areaName: string) =>
        `${areaName} کے لیے پی ایم 2.5 کی فی گھنٹہ پیش گوئی۔ ڈیش والی لکیریں صحت کے لیے محفوظ حدود ہیں۔`,
      whereSitsScale: "پیمانے پر اس کی درجہ بندی",
      disclaimerNote:
        "یہاں ہوا کے معیار کا ڈیٹا تقریباً 11 کلومیٹر کے ماڈل گرڈ پر مبنی ہے۔ زمینی سینسر ڈیٹا جلد منسلک کیا جائے گا۔",
      chartNow: "ابھی",
      chartPeak: (val: string) => `چوٹی ${val}`,
      chartCaptionDefault:
        "اگلے 72 گھنٹے۔ کسی بھی گھنٹے کی ریڈنگ دیکھنے کے لیے ماؤس اوپر لائیں۔ لکیریں صحت کی حدود کو ظاہر کرتی ہیں۔",
      chartInHours: (hours: number) => (hours === 0 ? "ابھی" : `${hours} گھنٹے میں`),
    },
    rankings: {
      title: "سب سے زیادہ آلودہ پہلے",
      lede: (avg: string) =>
        `ضلع لاہور کی تمام تحصیلیں، موجودہ پی ایم 2.5 کے مطابق درجہ بند۔ ضلعی اوسط ${avg} مائیکروگرام ہے۔`,
      thRank: "#",
      thTehsil: "تحصیل",
      thPm25: "پی ایم 2.5",
      thBand: "درجہ",
      thPeople: "آبادی",
      thArea: "رقبہ",
      thOpen: "پروفائل",
      openLink: "کھولیں",
      footnote:
        "پی ایم 2.5 مائیکروگرام فی مکعب میٹر، اوپن میٹیو سے ہر 10 منٹ بعد تازہ ترین۔ بارز بدترین علاقے کے تناسب سے ہیں۔ آبادی کا تخمینہ 2023 کی مردم شماری پر مبنی ہے۔",
    },
    areasList: {
      title: "ضلع لاہور",
      lede: "پانچ تحصیلیں، موجودہ فضائی معیار کے مطابق۔ تفصیلات کے لیے کسی ایک پر کلک کریں۔",
    },
    compare: {
      kicker: "تقابلی تجزیہ",
      title: "تحصیلوں کا باہمی موازنہ",
      lede: "لاہور کے مختلف علاقوں میں ہوا کے معیار، آبادی کے تناسب، کثافت اور آئندہ خطرات کے فرق کا مشاہدہ کریں۔",
      firstTehsil: "پہلی تحصیل",
      secondTehsil: "دوسری تحصیل",
      swap: "تبادلہ کریں",
      tehsilA: "تحصیل الف",
      tehsilB: "تحصیل ب",
      viewProfile: (name: string) => `${name} کا مکمل پروفائل`,
      airQualityTitle: "ہوا کا معیار (موجودہ پی ایم 2.5)",
      identicalAir: "دونوں علاقوں میں ریڈنگ بالکل یکساں ہے۔",
      higherAir: (name: string, diff: string) =>
        `${name} میں پی ایم 2.5 کی مقدار ${diff} مائیکروگرام زیادہ ہے۔`,
      popExposureTitle: "آبادیاتی پھیلاؤ",
      equalPop: "دونوں علاقوں کی آبادی کا تخمینہ یکساں ہے۔",
      higherPop: (name: string, ratio: string) =>
        `${name} میں ${ratio} گنا زیادہ شہری اس فضا میں سانس لے رہے ہیں۔`,
      densityTitle: "آبادیاتی کثافت",
      higherDensity: (name: string, ratio: number) =>
        `${name} ${ratio} گنا زیادہ گنجان آباد ہے۔`,
      peakRiskTitle: "اسموگ عروج کا خطرہ (اگلے 72 گھنٹے)",
      peakRiskSummary: "اوپن میٹیو ماڈل سے متوقع زیادہ سے زیادہ آلودگی۔",
      totalArea: (km2: number) => `کل رقبہ ${km2} مربع کلومیٹر`,
      peakingNow: "اس وقت عروج پر",
      inHours: (hours: number) => `${hours} گھنٹوں میں`,
      noForecast: "پیش گوئی دستیاب نہیں",
    },
    locator: {
      notificationTitle: "اپنے علاقے کا لائیو الرٹ جانیے",
      findMyTehsil: "اپنی تحصیل جانیے",
      findDescription: "اپنی لوکیشن سے اپنی تحصیل کی فضائی کیفیت، صحت کا رسک اور قریبی ہسپتال دیکھیے۔",
      locateButton: "میری تحصیل تلاش کریں",
      detectShort: "تحصیل معلوم کریں",
      outsideShort: "لاہور سے باہر",
      locating: "لوکیشن تلاش کی جا رہی ہے...",
      yourTehsil: "آپ کی تحصیل",
      basedOnLocation: (dist: number) => `مرکز سے ${dist} کلومیٹر کے فاصلے پر`,
      savedLocation: "پچھلے دورے سے محفوظ شدہ",
      outsideDistrict: (dist: number) => `آپ ضلع لاہور سے ${dist} کلومیٹر باہر ہیں۔ پورے شہر کا خلاصہ دکھایا جا رہا ہے۔`,
      permissionDenied: "لوکیشن کی اجازت نہیں ملی۔ آپ نیچے دی گئی فہرست سے اپنی تحصیل منتخب کر سکتے ہیں۔",
      unavailable: "اس ڈیوائس پر لوکیشن دستیاب نہیں ہے۔ فہرست سے تحصیل منتخب کریں۔",
      viewTehsilProfile: "تحصیل کا تفصیلی جائزہ",
      changeLocation: "تبدیل کریں",
      retry: "دوبارہ کوشش کریں",
      yourTehsilChip: "آپ کی تحصیل",
      dismiss: "چھوڑیں",
    },
  },
};
