import { RoadIncident, HighwayCorridor, WeatherTravelAlert, UserProfile, RoutePreviewData, RouteStep } from '../types';

export interface AssistantAnswer {
  reply: string;
  highlightRoute?: string;
  badges: string[];
  routePreview?: RoutePreviewData;
}

export const ROUTE_PREVIEWS: Record<string, RoutePreviewData> = {
  gwanda: {
    routeId: 'route-byogwa',
    origin: 'Bulawayo CBD',
    destination: 'Gwanda (Matabeleland South)',
    highwayCode: 'A6',
    distanceKm: 126,
    estMinutes: 105,
    tollCount: 1,
    tollFeeUsd: 4,
    tollFeeZiG: 110,
    tollPlazas: [{ name: 'Esigodini Toll Plaza (KM 42)', lat: -20.2900, lng: 28.9300 }],
    waypoints: [
      [-20.1550, 28.5833],
      [-20.1750, 28.6100],
      [-20.2100, 28.6900],
      [-20.2900, 28.9300],
      [-20.5800, 28.9800],
      [-20.9333, 29.0000],
    ],
    roadCondition: 'Smooth asphalt · Visible lane markings · Dry corridor',
    hazardsSummary: '0 Active Roadblocks · 0 Accident Obstructions Reported',
    fastestRouteLabel: 'Fastest route · Via Gwanda Rd (A6)',
    steps: [
      { instruction: 'Depart Bulawayo City Hall / CBD south-east via Leopold Takawira Ave', distanceKm: 4, icon: 'start' },
      { instruction: 'Pass Ascot Overpass and merge onto Gwanda Road (A6 Highway)', distanceKm: 18, icon: 'straight' },
      { instruction: 'Pass Kensington suburb service oasis; maintain 100 km/h cruising speed', distanceKm: 20, icon: 'straight' },
      { instruction: 'Approach Esigodini ZINARA Toll Plaza (KM 42) — automated E-Tag and cash lanes operational', distanceKm: 26, icon: 'toll' },
      { instruction: 'Continue past Mbalabala junction (KM 68) — smooth asphalt corridor, 100 km/h limit', distanceKm: 38, icon: 'straight' },
      { instruction: 'Arrive at Gwanda town center (126 km total)', distanceKm: 20, icon: 'destination' },
    ],
  },
  harare: {
    routeId: 'route-hrebyo',
    origin: 'Bulawayo CBD',
    destination: 'Harare CBD',
    highwayCode: 'A5',
    distanceKm: 439,
    estMinutes: 280,
    tollCount: 4,
    tollFeeUsd: 16,
    tollFeeZiG: 440,
    tollPlazas: [
      { name: 'Tree Top Toll Plaza (KM 25)', lat: -19.9800, lng: 28.8200 },
      { name: 'Gweru North Toll Plaza (KM 178)', lat: -19.4500, lng: 29.8167 },
      { name: 'Kadoma Toll Plaza (KM 295)', lat: -18.3333, lng: 29.9167 },
      { name: 'Norton Toll Plaza (KM 397)', lat: -17.8833, lng: 30.7000 },
    ],
    waypoints: [
      [-20.1550, 28.5833],
      [-20.1480, 28.5910],
      [-19.9800, 28.8200],
      [-19.4500, 29.8167],
      [-18.9281, 29.8149],
      [-18.3333, 29.9167],
      [-18.1302, 30.1407],
      [-17.8252, 31.0335],
    ],
    roadCondition: 'Dual carriageway sections · Excellent surface with Ascot contraflow',
    hazardsSummary: 'Ascot resurfacing active · Routine police checks near Shangani',
    fastestRouteLabel: 'National Arterial · Via A5 Highway',
    steps: [
      { instruction: 'Depart Bulawayo east via Leopold Takawira Ave; note single-lane contraflow at Ascot', distanceKm: 6, icon: 'start' },
      { instruction: 'Clear Tree Top Toll Plaza at KM 25 ($4 USD / 110 ZiG)', distanceKm: 19, icon: 'toll' },
      { instruction: 'Cruise along wide dualised sections into Gweru Midlands capital (KM 164)', distanceKm: 139, icon: 'straight' },
      { instruction: 'Pass Kwekwe and Kadoma toll plazas; keep vigilant for agricultural cross-traffic', distanceKm: 132, icon: 'straight' },
      { instruction: 'Clear Norton Toll Plaza (KM 397) and enter Harare via Highfield corridor', distanceKm: 102, icon: 'toll' },
      { instruction: 'Arrive in Harare Central Business District (439 km total)', distanceKm: 41, icon: 'destination' },
    ],
  },
  victoria_falls: {
    routeId: 'route-byovic',
    origin: 'Bulawayo CBD',
    destination: 'Victoria Falls Town',
    highwayCode: 'A8',
    distanceKm: 435,
    estMinutes: 330,
    tollCount: 3,
    tollFeeUsd: 12,
    tollFeeZiG: 330,
    tollPlazas: [
      { name: 'Insuza Toll Plaza (KM 70)', lat: -19.7833, lng: 28.2500 },
      { name: 'Lupane Toll Plaza (KM 165)', lat: -18.9315, lng: 27.8070 },
      { name: 'Hwange Toll Plaza (KM 335)', lat: -18.3644, lng: 26.5983 },
    ],
    waypoints: [
      [-20.1550, 28.5833],
      [-19.7833, 28.2500],
      [-18.9315, 27.8070],
      [-18.3644, 26.5983],
      [-17.9244, 25.8567],
    ],
    roadCondition: 'Asphalt in good condition · Wildlife corridor caution Insuza-Kenmaur',
    hazardsSummary: 'Elephant breeding herd advisory between KM 70-95',
    fastestRouteLabel: 'Scenic Zambezi Corridor · Via A8 Highway',
    steps: [
      { instruction: 'Depart Bulawayo north-west via Victoria Falls Road (A8)', distanceKm: 12, icon: 'start' },
      { instruction: 'Clear Insuza Toll Plaza (KM 70); reduce speed to 60-70 km/h for elephant crossings', distanceKm: 58, icon: 'toll' },
      { instruction: 'Pass Kenmaur and enter Lupane administrative centre (KM 170)', distanceKm: 100, icon: 'straight' },
      { instruction: 'Pass Halfway House Hotel rest oasis and Hwange coal haulage bypass', distanceKm: 165, icon: 'straight' },
      { instruction: 'Arrive at Victoria Falls town and border to Zambia (435 km total)', distanceKm: 100, icon: 'destination' },
    ],
  },
  plumtree: {
    routeId: 'route-byoplum',
    origin: 'Bulawayo CBD',
    destination: 'Plumtree Border Post (Botswana Link)',
    highwayCode: 'A7',
    distanceKm: 100,
    estMinutes: 75,
    tollCount: 1,
    tollFeeUsd: 4,
    tollFeeZiG: 110,
    tollPlazas: [{ name: 'Figtree Toll Plaza (KM 38)', lat: -20.3200, lng: 28.2500 }],
    waypoints: [
      [-20.1550, 28.5833],
      [-20.2400, 28.4500],
      [-20.3200, 28.2500],
      [-20.4000, 28.0500],
      [-20.4800, 27.8200],
    ],
    roadCondition: 'Wide asphalt corridor · Zero reported roadblocks · Clear flow',
    hazardsSummary: 'Border passenger queue normal (<15 min wait)',
    fastestRouteLabel: 'Direct Botswana Link · Via A7 Highway',
    steps: [
      { instruction: 'Depart Bulawayo west via Plumtree Road (A7)', distanceKm: 10, icon: 'start' },
      { instruction: 'Clear Figtree ZINARA Toll Plaza (KM 38) — $4 USD / 110 ZiG', distanceKm: 28, icon: 'toll' },
      { instruction: 'Continue past Marula railway crossing; surface is dry and wide', distanceKm: 34, icon: 'straight' },
      { instruction: 'Arrive at Plumtree Border Terminal / Ramokgwebana crossing (100 km total)', distanceKm: 28, icon: 'destination' },
    ],
  },
  beitbridge: {
    routeId: 'route-byobeit',
    origin: 'Bulawayo CBD',
    destination: 'Beitbridge Border (South Africa Link)',
    highwayCode: 'A6',
    distanceKm: 320,
    estMinutes: 225,
    tollCount: 2,
    tollFeeUsd: 8,
    tollFeeZiG: 220,
    tollPlazas: [
      { name: 'Esigodini Toll Plaza (KM 42)', lat: -20.2900, lng: 28.9300 },
      { name: 'Colleen Bawn Toll Plaza (KM 155)', lat: -21.0667, lng: 29.3667 },
    ],
    waypoints: [
      [-20.1550, 28.5833],
      [-20.2100, 28.6900],
      [-20.2900, 28.9300],
      [-20.5800, 28.9800],
      [-20.9333, 29.0000],
      [-21.0667, 29.3667],
      [-21.5000, 29.6500],
      [-22.2167, 29.9833],
    ],
    roadCondition: 'Good surface · Direct southern corridor avoiding Harare',
    hazardsSummary: 'Truck staging surge at freight terminal approach; private passenger lanes clear',
    fastestRouteLabel: 'Direct Southern Freight Corridor · Via A6 Highway',
    steps: [
      { instruction: 'Depart Bulawayo south-east along A6 Gwanda Road via Esigodini', distanceKm: 42, icon: 'start' },
      { instruction: 'Pass Gwanda town centre (KM 126); top up fuel at Shell or TotalEnergies', distanceKm: 84, icon: 'straight' },
      { instruction: 'Clear Colleen Bawn Toll Plaza (KM 155) and transit West Nicholson', distanceKm: 29, icon: 'toll' },
      { instruction: 'Follow A6 south through Mazunga and Makhado stretches into border approach', distanceKm: 140, icon: 'straight' },
      { instruction: 'Arrive at Beitbridge Border Post / Limpopo Bridge (320 km total)', distanceKm: 25, icon: 'destination' },
    ],
  },
  masvingo: {
    routeId: 'route-byomas',
    origin: 'Bulawayo CBD',
    destination: 'Masvingo / Great Zimbabwe',
    highwayCode: 'A9',
    distanceKm: 280,
    estMinutes: 210,
    tollCount: 2,
    tollFeeUsd: 8,
    tollFeeZiG: 220,
    tollPlazas: [
      { name: 'Esigodini Toll Plaza (KM 42)', lat: -20.2900, lng: 28.9300 },
      { name: 'Zvishavane Toll Plaza (KM 190)', lat: -20.3000, lng: 30.0500 },
    ],
    waypoints: [
      [-20.1550, 28.5833],
      [-20.2900, 28.9300],
      [-20.5800, 28.9800],
      [-20.5500, 29.4000],
      [-20.3000, 30.0500],
      [-20.0744, 30.8328],
    ],
    roadCondition: 'Paved highway · Caution near mining haulage zones in Filabusi & Zvishavane',
    hazardsSummary: 'Moderate mining truck traffic near Zvishavane turnoff',
    fastestRouteLabel: 'Scenic Southern Midlands · Via A6/A9 Highway',
    steps: [
      { instruction: 'Depart Bulawayo south-east on A6 to Mbalabala junction', distanceKm: 68, icon: 'start' },
      { instruction: 'Turn left onto A9 highway toward Filabusi and Zvishavane', distanceKm: 60, icon: 'turn-left' },
      { instruction: 'Transit Zvishavane mining town and clear toll plaza', distanceKm: 72, icon: 'toll' },
      { instruction: 'Arrive in Masvingo ancient city / Great Zimbabwe entrance (280 km total)', distanceKm: 80, icon: 'destination' },
    ],
  },
};

export function detectRoutePreviewFromQuery(query: string): RoutePreviewData | undefined {
  const q = query.toLowerCase();
  if (q.includes('gwanda') || q.includes('esigodini') || (q.includes('a6') && !q.includes('beitbridge'))) {
    return ROUTE_PREVIEWS.gwanda;
  }
  if (q.includes('harare') || q.includes('gweru') || q.includes('kwekwe') || q.includes('kadoma') || q.includes('a5')) {
    return ROUTE_PREVIEWS.harare;
  }
  if (q.includes('victoria falls') || q.includes('vic falls') || q.includes('hwange') || q.includes('lupane') || q.includes('a8')) {
    return ROUTE_PREVIEWS.victoria_falls;
  }
  if (q.includes('plumtree') || q.includes('botswana') || q.includes('figtree') || q.includes('a7')) {
    return ROUTE_PREVIEWS.plumtree;
  }
  if (q.includes('beitbridge') || q.includes('south africa') || q.includes('colleen bawn')) {
    return ROUTE_PREVIEWS.beitbridge;
  }
  if (q.includes('masvingo') || q.includes('zvishavane') || q.includes('filabusi') || q.includes('a9')) {
    return ROUTE_PREVIEWS.masvingo;
  }
  // If user says "route" or "map" or "directions" or "show me on the map", default to Gwanda
  if (
    q.includes('route') ||
    q.includes('directions') ||
    q.includes('show me on the map') ||
    q.includes('show on the map') ||
    q.includes('show on map') ||
    q.includes('google map') ||
    q.includes('navigation')
  ) {
    return ROUTE_PREVIEWS.gwanda;
  }
  return undefined;
}

/**
 * Intelligent domain knowledge analyzer for RoadLink Zimbabwe.
 * Analyzes live incident state, highway corridors, weather alerts, and user queries.
 * Provides accurate, safety-oriented answers for any questions asked.
 */
export function generateRoadAssistantAnswer(
  query: string,
  context: {
    userProfile?: Partial<UserProfile>;
    incidents?: RoadIncident[];
    corridors?: HighwayCorridor[];
    weatherAlerts?: WeatherTravelAlert[];
  }
): AssistantAnswer {
  const q = query.toLowerCase().trim();
  const incidents = context.incidents || [];
  const weatherAlerts = context.weatherAlerts || [];
  const userName = context.userProfile?.name || 'Tinotenda Sibanda';
  const detectedRoute = detectRoutePreviewFromQuery(query);

  // 1. GWANDA ROUTE (A6 Highway Corridor)
  if (
    q.includes('gwanda') ||
    q.includes('esigodini') ||
    (q.includes('a6') && (q.includes('route') || q.includes('road') || q.includes('take') || q.includes('how')))
  ) {
    const gwandaIncidents = incidents.filter(
      (i) =>
        i.status !== 'resolved' &&
        (i.highway.toLowerCase().includes('a6') ||
          i.highway.toLowerCase().includes('gwanda') ||
          i.locationName.toLowerCase().includes('gwanda') ||
          i.locationName.toLowerCase().includes('esigodini'))
    );

    const hasAccident = gwandaIncidents.some((i) => i.category === 'accident' || i.severity === 'critical');
    const hasRoadblock = gwandaIncidents.some(
      (i) => i.category === 'checkpoint' || i.title.toLowerCase().includes('roadblock')
    );

    if (gwandaIncidents.length === 0 || (!hasAccident && !hasRoadblock)) {
      return {
        reply: `Use Gwanda Road (A6 Highway Corridor). There is currently no reported road block or accidents on this route. Traffic is flowing smoothly from Bulawayo through Esigodini into Gwanda (~126 km, estimated travel time 1 hour 45 minutes).

Key details for your trip:
• Road Condition: Asphalt surface is in good condition with visible lane markings.
• ZINARA Toll Plaza: 1 toll gate at Esigodini ($4 USD / 110 ZiG for light vehicles; $6 USD for minibuses). Automated E-Tag lanes active.
• Fuel & Service: Stations operational in Bulawayo CBD, Kensington, and Esigodini center.
• Weather: Clear conditions along the Matabeleland South corridor. Drive safely, ${userName}!`,
        highlightRoute: 'A6',
        badges: ['Route Clear', 'No Roadblocks', 'Zero Accidents'],
        routePreview: ROUTE_PREVIEWS.gwanda,
      };
    } else {
      const incidentList = gwandaIncidents
        .map((i) => `• ${i.title} at ${i.locationName} (${i.severity.toUpperCase()})`)
        .join('\n');
      return {
        reply: `For Gwanda, use Gwanda Road (A6 corridor). Please note the following active advisories:\n${incidentList}\n\nEsigodini toll plaza remains operational ($4 USD). Travel time is approximately 1h 45m. Drive carefully!`,
        highlightRoute: 'A6',
        badges: ['Caution Advised', 'A6 Corridor'],
        routePreview: ROUTE_PREVIEWS.gwanda,
      };
    }
  }

  // 2. HARARE ROUTE (A5 Highway Corridor)
  if (
    q.includes('harare') ||
    q.includes('a5') ||
    q.includes('gweru') ||
    q.includes('kwekwe') ||
    q.includes('kadoma') ||
    q.includes('chegutu')
  ) {
    const a5Incidents = incidents.filter(
      (i) =>
        i.status !== 'resolved' &&
        (i.highway.toLowerCase().includes('a5') ||
          i.locationName.toLowerCase().includes('harare') ||
          i.locationName.toLowerCase().includes('gweru'))
    );

    const activeObstructions = a5Incidents.map((i) => `• ${i.title} at ${i.locationName}`).join('\n');

    return {
      reply: `For Harare from Bulawayo, take the A5 highway via Gweru, Kwekwe, Kadoma, and Chegutu (439 km, estimated travel time 4h 40m).

Current Corridor Status:
• Bulawayo Departure: Single-lane resurfacing contraflow active near Ascot Racecourse flyover on Leopold Takawira Ave. Cecil Avenue bypass is recommended during morning and evening peak hours.
• Toll Plazas (4 total): Tree Top (Bulawayo outskirts), Gweru North, Kadoma, and Norton. Total toll for light passenger vehicles is $16 USD. Automated Tap-and-Go and E-Tag lanes are operating smoothly.
• Checkpoints: Routine police safety checks reported near Shangani; carry your valid driver's licence and fire extinguisher.
${activeObstructions ? `\nActive Reports on A5:\n${activeObstructions}` : '• Roadway Status: Surface is dualised and in good condition between Norton and Harare.'}`,
      highlightRoute: 'A5',
      badges: ['A5 Arterial', 'Resurfacing near Ascot', '4 Toll Plazas'],
      routePreview: ROUTE_PREVIEWS.harare,
    };
  }

  // 3. VICTORIA FALLS & HWANGE (A8 Corridor)
  if (
    q.includes('vic falls') ||
    q.includes('victoria falls') ||
    q.includes('a8') ||
    q.includes('hwange') ||
    q.includes('lupane') ||
    q.includes('insuza')
  ) {
    return {
      reply: `For Victoria Falls from Bulawayo, take the A8 corridor via Insuza, Kenmaur, Lupane, and Hwange (435 km, estimated travel time 5h 30m).

Important Safety Advisory:
• Wildlife Warning: Civil Protection Unit and National Parks have issued an active wildlife advisory between Insuza Toll Plaza (KM 70) and Kenmaur. Elephant breeding herds and kudu are active along the road reserve, especially from dusk to dawn. Maintain speeds under 70 km/h in this stretch.
• Road Condition: Surface is generally good, but caution is advised on wet asphalt sections between Gwayi River and Halfway House.
• Toll Plazas (3 total): Insuza, Lupane, and Hwange ($12 USD total for light vehicles).`,
      highlightRoute: 'A8',
      badges: ['Wildlife Warning', 'A8 Corridor', '3 Toll Plazas'],
      routePreview: ROUTE_PREVIEWS.victoria_falls,
    };
  }

  // 4. PLUMTREE & BOTSWANA (A7 Corridor)
  if (
    q.includes('plumtree') ||
    q.includes('a7') ||
    q.includes('botswana') ||
    q.includes('figtree') ||
    q.includes('marula')
  ) {
    return {
      reply: `For Plumtree and the Botswana border post, take Plumtree Road (A7 corridor, ~100 km, ~1h 15m).
• Corridor Status: The road is clear with no reported accidents, roadworks, or police roadblocks.
• Border Post Queue: Passenger and freight clearance at Plumtree border is flowing normally with average queue delays under 15 minutes.
• Toll Plaza: 1 toll gate at Figtree ($4 USD for light vehicles).`,
      highlightRoute: 'A7',
      badges: ['Clear Corridor', 'Border Normal', 'Figtree Toll'],
      routePreview: ROUTE_PREVIEWS.plumtree,
    };
  }

  // 5. BEITBRIDGE & SOUTH AFRICA BORDER (A6 Corridor South)
  if (q.includes('beitbridge') || q.includes('south africa') || q.includes('colleen bawn')) {
    return {
      reply: `From Bulawayo to Beitbridge Border, use the A6 highway corridor via Gwanda, Colleen Bawn, and West Nicholson (320 km, estimated travel time 3h 45m).
• Status: Driving conditions are good with no severe blockages reported.
• Toll Plazas: Esigodini and Colleen Bawn ($8 USD total for light vehicles).
• Recommendation: Top up fuel in Bulawayo or Gwanda town before proceeding through West Nicholson.`,
      highlightRoute: 'A6',
      badges: ['A6 Corridor', 'Smooth Transit', 'Beitbridge Link'],
      routePreview: ROUTE_PREVIEWS.beitbridge,
    };
  }

  // 6. MASVINGO & MUTARE (A9 / A3 Corridor)
  if (
    q.includes('masvingo') ||
    q.includes('mutare') ||
    q.includes('zvishavane') ||
    q.includes('filabusi') ||
    q.includes('birchenough') ||
    q.includes('a9') ||
    q.includes('a3')
  ) {
    return {
      reply: `For Masvingo & Mutare from Bulawayo:
• To Masvingo: Take A6 south to Mbalabala, then branch onto the A9 through Filabusi and Zvishavane into Masvingo (280 km, ~3h 30m). Exercise caution near Filabusi due to mining haulage vehicles.
• To Mutare: From Masvingo, continue along the A9 across Birchenough Bridge into Mutare (total ~575 km), or travel via A5 to Harare and branch onto the A3 highway.
• Tolls: Standard $4 USD per plaza at designated ZINARA points.`,
      badges: ['A9 Regional Link', 'Mining Truck Caution'],
      routePreview: ROUTE_PREVIEWS.masvingo,
    };
  }

  // 7. ROADBLOCKS, POLICE CHECKPOINTS & VID
  if (
    q.includes('roadblock') ||
    q.includes('road block') ||
    q.includes('checkpoint') ||
    q.includes('police') ||
    q.includes('vid') ||
    q.includes('inspection') ||
    q.includes('zrp')
  ) {
    const checkpoints = incidents.filter(
      (i) => i.status !== 'resolved' && (i.category === 'checkpoint' || i.title.toLowerCase().includes('roadblock'))
    );

    let listText = '';
    if (checkpoints.length > 0) {
      listText = checkpoints.map((c) => `• ${c.title} on ${c.highway} (${c.locationName})`).join('\n');
    } else {
      listText = '• Currently, no abnormal or unscheduled roadblocks are reported on major highways.';
    }

    return {
      reply: `Roadblock & Police Checkpoint Status:
${listText}

Corridor Check:
• Gwanda Road (A6): CLEAR. No reported roadblocks between Bulawayo and Gwanda.
• Plumtree Road (A7): CLEAR. Standard patrol near Figtree only.
• Harare Road (A5): Routine speed enforcement and licensing checks reported near Shangani.

Required Driver Documents in Zimbabwe:
1. Valid Driver's Licence (Class 2 or 4).
2. Up-to-date ZINARA vehicle licence disc & Third-Party insurance.
3. Two SABS-approved red reflective breakdown triangles.
4. An approved 1kg dry powder fire extinguisher.`,
      badges: ['Checkpoints Monitored', 'Gwanda Clear', 'ZRP Status'],
    };
  }

  // 8. ACCIDENTS & ROAD CLOSURES
  if (
    q.includes('accident') ||
    q.includes('crash') ||
    q.includes('collision') ||
    q.includes('overturn') ||
    q.includes('injury') ||
    q.includes('incident')
  ) {
    const activeAccidents = incidents.filter(
      (i) => i.status !== 'resolved' && (i.category === 'accident' || i.severity === 'critical')
    );

    if (activeAccidents.length === 0) {
      return {
        reply: `There are currently NO active critical accidents or road closures reported on major Bulawayo corridors (A5, A6, A7, A8). Traffic is flowing at normal design speeds.

Emergency Road Assistance Numbers:
• ZRP Police Emergency: 999 or +263 29 272 515 (Bulawayo Central)
• MARS Ambulance: +263 77 223 7237
• E-Med Rescue: 0800 322 000 / +263 77 214 7999`,
        badges: ['Zero Major Accidents', 'Corridors Flowing'],
      };
    } else {
      const list = activeAccidents
        .map((a) => `• ${a.title} on ${a.highway} (${a.locationName}) - ${a.severity.toUpperCase()}`)
        .join('\n');
      return {
        reply: `Current Active Road Incidents:\n${list}\n\nEmergency Contacts:\n• ZRP Police: 999 or +263 29 272 515\n• MARS Ambulance: +263 77 223 7237\nPlease slow down when approaching these zones.`,
        badges: ['Active Accidents', 'Emergency Ready'],
      };
    }
  }

  // 9. ZINARA TOLL GATES & FEES
  if (
    q.includes('toll') ||
    q.includes('tollgate') ||
    q.includes('zinara') ||
    q.includes('fee') ||
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('e-tag') ||
    q.includes('how much')
  ) {
    return {
      reply: `Official ZINARA Highway Toll Tariff Structure:
• Light Passenger Vehicles (Sedans, SUVs, Pickups): $4 USD / 110 ZiG
• Minibuses & Kombis: $6 USD
• Buses (Large Coaches): $8 USD
• Heavy Vehicles (3-Axle Trucks): $10 USD
• Haulage (Articulated Trucks): $15 USD

Key Toll Plazas from Bulawayo:
• A6 to Gwanda / Beitbridge: Esigodini ($4), Colleen Bawn ($4)
• A5 to Harare: Tree Top ($4), Gweru North ($4), Kadoma ($4), Norton ($4) = $16 USD Total
• A8 to Victoria Falls: Insuza ($4), Lupane ($4), Hwange ($4) = $12 USD Total
• A7 to Plumtree: Figtree ($4 USD)

Payment Methods: Cash (USD/ZiG), EcoCash, Swipe, and automated ZINARA E-Tag lanes.`,
      badges: ['ZINARA Tariffs', 'E-Tag Lanes Active'],
    };
  }

  // 10. WEATHER, RAIN & THUNDERSTORMS
  if (
    q.includes('weather') ||
    q.includes('rain') ||
    q.includes('storm') ||
    q.includes('wind') ||
    q.includes('flood') ||
    q.includes('cloud') ||
    q.includes('wet')
  ) {
    const alertList = weatherAlerts.map((w) => `• ${w.title} (${w.region}): ${w.advisoryText}`).join('\n\n');

    return {
      reply: `Current Weather & Highway Advisory (MSD Zimbabwe):
${alertList || '• Current weather across Matabeleland is generally fair with intermittent cloud cover.'}

Safe Driving Tips in Wet Conditions:
• Reduce highway speed by 20 km/h on wet asphalt to avoid aquaplaning.
• Turn on low-beam headlights during heavy downpours.
• Avoid crossing flooded bridges or low-level river crossings (e.g. Mzingwane tributaries).`,
      badges: ['MSD Weather Alert', 'Highway Wet Safety'],
    };
  }

  // 11. BULAWAYO CITY TRAFFIC & ASCOT FLYOVER
  if (
    q.includes('ascot') ||
    q.includes('flyover') ||
    q.includes('leopold takawira') ||
    q.includes('khami') ||
    q.includes('luveve') ||
    q.includes('fife') ||
    q.includes('jason moyo') ||
    q.includes('cbd') ||
    q.includes('bulawayo traffic') ||
    q.includes('city')
  ) {
    return {
      reply: `Bulawayo City Traffic & Street Status:
• Ascot Racecourse Flyover (Leopold Takawira Ave): Active dualisation and bridge resurfacing under ERRP II. Traffic is running on a single-lane contraflow with 20 km/h restriction. Expect 5–10 min slowdowns during peak hours.
• Recommended Detours: Use Cecil Avenue or 12th Avenue Extension to avoid Ascot delays.
• Luveve Road & Khami Road: Resurfaced stretches are clear and open. Watch for heavy pedestrian activity around Renkini bus rank.
• Bulawayo CBD: Fife Street, 8th Avenue, and Robert Mugabe Way are flowing smoothly.`,
      badges: ['Bulawayo CBD', 'Ascot Contraflow', 'Cecil Ave Detour'],
    };
  }

  // 12. FUEL & SERVICE STATIONS
  if (
    q.includes('fuel') ||
    q.includes('petrol') ||
    q.includes('diesel') ||
    q.includes('service station') ||
    q.includes('garage') ||
    q.includes('zuva') ||
    q.includes('puma') ||
    q.includes('total') ||
    q.includes('engen')
  ) {
    return {
      reply: `Fuel Availability in Bulawayo:
• Fuel supply is stable across all major franchises (TotalEnergies, Puma, Engen, Zuva) in both USD and ZiG.
• 24-Hour Stations: TotalEnergies on 12th Ave / Robert Mugabe Way, Engen along Plumtree Road, and Puma Belmont.
• Highway Tip: If travelling to Gwanda, top up in Bulawayo or Esigodini; if travelling to Victoria Falls, top up in Bulawayo and Lupane center.`,
      badges: ['Fuel Stable', '24h Stations Active'],
    };
  }

  // 13. BUSES & PUBLIC TRANSPORT
  if (
    q.includes('bus') ||
    q.includes('coach') ||
    q.includes('kombi') ||
    q.includes('transport operator') ||
    q.includes('inter africa') ||
    q.includes('cag') ||
    q.includes('bravo') ||
    q.includes('city bus') ||
    q.includes('renkini')
  ) {
    return {
      reply: `Public Transport & Luxury Coach Information:
• Major Departure Rank: Renkini Long-Distance Bus Rank (6th Ave Ext) and Entumbane Terminal.
• Verified Operators on RoadLink: Inter Africa, CAG Travellers, City Bus Express, Bravo Tours, and Extracity.
• Main Routes:
  - Bulawayo to Harare: Departures every 30 mins (approx. $15–$20 USD).
  - Bulawayo to Gwanda: Frequent kombis and buses from 6th Ave rank ($5–$7 USD).
  - Bulawayo to Victoria Falls: Morning departures from Entumbane ($20 USD).
Check the 'Buses' tab in the navigation menu for operator safety ratings and contacts!`,
      badges: ['Coach Schedules', 'Renkini Hub'],
    };
  }

  // 14. HOW TO REPORT AN INCIDENT
  if (
    q.includes('report') ||
    q.includes('submit') ||
    q.includes('how do i report') ||
    q.includes('log') ||
    q.includes('hazard')
  ) {
    return {
      reply: `How to Report a Road Incident on RoadLink:
1. Tap the green '+ Report Hazard' button in the top bar or bottom navigation.
2. Select category: Accident, Roadwork, Checkpoint, Pothole, or Flooding.
3. Enter the road name or highway (e.g. A6 Gwanda Road or Leopold Takawira Ave).
4. Provide a brief description and indicate if the hazard is ongoing.
5. Optional: Attach a photograph or use your GPS location.
Your report will immediately show as UNVERIFIED on the map and community feed, and will be reviewed by highway moderators for verification.`,
      badges: ['Community Reporting', 'Fast Submission'],
    };
  }

  // 15. SPEED LIMITS & LEGAL REQUIREMENTS
  if (
    q.includes('speed limit') ||
    q.includes('regulation') ||
    q.includes('rules') ||
    q.includes('fire extinguisher') ||
    q.includes('triangles') ||
    q.includes('fine')
  ) {
    return {
      reply: `Zimbabwe Highway Code Speed Limits:
• Urban Areas: 60 km/h (school zones 40 km/h)
• Single-Lane Highways: 100 km/h for passenger cars (80 km/h for heavy trucks and buses)
• Dual Carriageways: 120 km/h for passenger vehicles

Mandatory Vehicle Safety Equipment:
• 2 red reflective breakdown triangles
• 1kg dry chemical powder fire extinguisher
• Valid reflective vest (recommended for night breakdowns)
• Valid ZINARA road licence & vehicle insurance displayed on windscreen.`,
      badges: ['Highway Code', 'Legal Standards'],
    };
  }

  // 16. USER PROFILE & IDENTITY
  if (
    q.includes('who am i') ||
    q.includes('my profile') ||
    q.includes('tinotenda') ||
    q.includes('sibanda') ||
    q.includes('my account')
  ) {
    return {
      reply: `You are logged in as ${userName}, a Verified Long-Haul Driver based in Bulawayo, Zimbabwe.
• Base Location: Bulawayo Metro
• Saved Routes: A6 (Bulawayo–Gwanda), A5 (Harare Arterial), A8 (Victoria Falls)
• Status: Verified Driver with incident reporting privileges.`,
      badges: ['Verified Driver', 'Tinotenda Sibanda'],
    };
  }

  // 17. GREETINGS & INTRODUCTIONS
  if (
    q === 'hello' ||
    q === 'hi' ||
    q === 'hey' ||
    q.startsWith('salibonani') ||
    q.startsWith('mhoro') ||
    q.includes('who are you') ||
    q.includes('what can you do') ||
    q.includes('help')
  ) {
    return {
      reply: `Salibonani, ${userName}! I am RoadLink AI, your real-time Zimbabwean road navigation assistant.

Here is what I can do for you:
• Analyze the safest routes to Gwanda, Harare, Victoria Falls, Plumtree, Beitbridge, and Mutare.
• Check live police checkpoints, VID operations, and roadblocks.
• Report on active traffic accidents, road closures, and bridge contraflows.
• Provide exact ZINARA toll gate fees and automated E-Tag lane status.
• Monitor severe weather, rainstorms, and wildlife crossing hazards.

Try asking: "What's the best route to take to Gwanda?" or "Are there any roadblocks to Harare?".`,
      badges: ['RoadLink AI', 'Ready to Assist'],
    };
  }

  // 18. DYNAMIC INCIDENT SEARCH (Matches any specific road or town mentioned)
  const matchedIncidents = incidents.filter(
    (i) =>
      i.status !== 'resolved' &&
      (q.includes(i.highway.toLowerCase()) ||
        q.includes(i.locationName.toLowerCase()) ||
        q.includes(i.title.toLowerCase()) ||
        q.includes(i.category.toLowerCase()))
  );

  if (matchedIncidents.length > 0) {
    const list = matchedIncidents
      .slice(0, 3)
      .map(
        (m) =>
          `• ${m.title} on ${m.highway} (${m.locationName}): ${m.description} [Status: ${m.status ? m.status.toUpperCase() : 'ACTIVE'}]`
      )
      .join('\n');

    return {
      reply: `Here are the active road reports matching your query:
${list}

Detour Advice: Follow posted signboards or check the Explore Map tab for live satellite bypass routes. Drive safely, ${userName}!`,
      badges: ['Matching Reports Found', 'Live Telemetry'],
    };
  }

  // 19. INTELLIGENT GENERAL TRAVEL ADVISORY
  return {
    reply: `Based on live RoadLink Bulawayo telemetry:
• Major Corridors: Gwanda Road (A6), Plumtree Road (A7), and Harare Highway (A5) are open and operating normally.
• Active Notices: Ascot flyover on Leopold Takawira Ave has single-lane resurfacing contraflow (20 km/h); A8 corridor to Victoria Falls has night wildlife cautions near Insuza.
• Toll Plazas: Operating smoothly with automated E-Tag and cash lanes.

You can ask me specific questions like:
- "What's the best route to take to Gwanda?"
- "Are there any roadblocks to Plumtree?"
- "What are the toll gate fees to Harare?"
- "How is traffic around Ascot flyover?"`,
    badges: ['Bulawayo Telemetry', 'Corridors Operational'],
  };
}
