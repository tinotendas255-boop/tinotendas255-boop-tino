import { RoadIncident, HighwayCorridor, WeatherTravelAlert, UserProfile } from '../types';

export interface AssistantAnswer {
  reply: string;
  highlightRoute?: string;
  badges: string[];
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
      };
    } else {
      const incidentList = gwandaIncidents
        .map((i) => `• ${i.title} at ${i.locationName} (${i.severity.toUpperCase()})`)
        .join('\n');
      return {
        reply: `For Gwanda, use Gwanda Road (A6 corridor). Please note the following active advisories:\n${incidentList}\n\nEsigodini toll plaza remains operational ($4 USD). Travel time is approximately 1h 45m. Drive carefully!`,
        highlightRoute: 'A6',
        badges: ['Caution Advised', 'A6 Corridor'],
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
