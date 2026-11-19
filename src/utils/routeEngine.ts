import {
  RoadIncident,
  RoutePreviewData,
  RouteStep,
  AlternativeRouteOption,
} from '../types';

export interface RoadNode {
  id: string;
  name: string;
  shortName: string;
  region: string;
  coords: [number, number];
  aliases: string[];
  isUrbanSuburb?: boolean;
}

export interface RoadEdge {
  from: string;
  to: string;
  highwayCode: string;
  roadName: string;
  distanceKm: number;
  baseMinutes: number;
  tollPlaza?: { name: string; lat: number; lng: number };
  viaPoints?: [number, number][];
  isBypassCorridor?: boolean;
}

export const ZIMBABWE_NODES: RoadNode[] = [
  // Bulawayo Metro & Surrounds
  {
    id: 'bulawayo_cbd',
    name: 'Bulawayo CBD (City Hall)',
    shortName: 'Bulawayo',
    region: 'Bulawayo Metro',
    coords: [-20.1550, 28.5833],
    aliases: ['bulawayo', 'byo', 'city hall', 'cbd', 'leopold takawira', 'renkini', 'fife street', 'bulawayo hub'],
  },
  {
    id: 'bulawayo_ascot',
    name: 'Ascot / Suburbs (Bulawayo East)',
    shortName: 'Ascot (Byo)',
    region: 'Bulawayo Metro',
    coords: [-20.1480, 28.5910],
    aliases: ['ascot', 'suburbs', 'kumalo', 'parklands'],
    isUrbanSuburb: true,
  },
  {
    id: 'bulawayo_cecil_bypass',
    name: 'Hillside / Cecil Ave Bypass (Bulawayo)',
    shortName: 'Hillside / Cecil Ave',
    region: 'Bulawayo Metro',
    coords: [-20.1880, 28.6050],
    aliases: ['hillside', 'cecil avenue', 'cecil ave', 'matsheumhlope', 'burnside'],
    isUrbanSuburb: true,
  },
  {
    id: 'bulawayo_luveve',
    name: 'Luveve / Entumbane (Bulawayo North-West)',
    shortName: 'Luveve / Entumbane',
    region: 'Bulawayo Metro',
    coords: [-20.1150, 28.5250],
    aliases: ['luveve', 'entumbane', 'cowdray park', 'mzilikazi', 'magwegwe'],
    isUrbanSuburb: true,
  },
  {
    id: 'bulawayo_khami',
    name: 'Nkulumane / Belmont (Bulawayo West)',
    shortName: 'Belmont / Nkulumane',
    region: 'Bulawayo Metro',
    coords: [-20.1850, 28.5350],
    aliases: ['belmont', 'nkulumane', 'khami', 'tshabalala', 'nketa'],
    isUrbanSuburb: true,
  },
  {
    id: 'kensington',
    name: 'Kensington (A6 Approach)',
    shortName: 'Kensington',
    region: 'Matabeleland South',
    coords: [-20.2100, 28.6900],
    aliases: ['kensington', 'waterford', 'douglasdale'],
    isUrbanSuburb: true,
  },
  {
    id: 'matopos_kezi',
    name: 'Matopos / Kezi Junction',
    shortName: 'Matopos / Kezi',
    region: 'Matabeleland South',
    coords: [-20.5050, 28.4850],
    aliases: ['matopos', 'matobo', 'kezi', 'maphisa'],
  },
  {
    id: 'esigodini',
    name: 'Esigodini',
    shortName: 'Esigodini',
    region: 'Matabeleland South',
    coords: [-20.2900, 28.9300],
    aliases: ['esigodini', 'essexvale'],
  },
  {
    id: 'mbalabala',
    name: 'Mbalabala Junction',
    shortName: 'Mbalabala',
    region: 'Matabeleland South',
    coords: [-20.5800, 28.9800],
    aliases: ['mbalabala', 'balla balla'],
  },
  {
    id: 'gwanda',
    name: 'Gwanda Town',
    shortName: 'Gwanda',
    region: 'Matabeleland South',
    coords: [-20.9333, 29.0000],
    aliases: ['gwanda', 'jahunda'],
  },
  {
    id: 'west_nicholson',
    name: 'Colleen Bawn / West Nicholson',
    shortName: 'West Nicholson',
    region: 'Matabeleland South',
    coords: [-21.0667, 29.3667],
    aliases: ['colleen bawn', 'west nicholson'],
  },
  {
    id: 'beitbridge',
    name: 'Beitbridge Border Post',
    shortName: 'Beitbridge',
    region: 'Matabeleland South',
    coords: [-22.2167, 29.9833],
    aliases: ['beitbridge', 'south africa', 'musina', 'limpopo'],
  },
  {
    id: 'figtree',
    name: 'Figtree',
    shortName: 'Figtree',
    region: 'Matabeleland South',
    coords: [-20.3200, 28.2500],
    aliases: ['figtree', 'marula'],
  },
  {
    id: 'plumtree',
    name: 'Plumtree Border Post',
    shortName: 'Plumtree',
    region: 'Matabeleland South',
    coords: [-20.4800, 27.8200],
    aliases: ['plumtree', 'botswana', 'francistown', 'ramokgwebana'],
  },
  {
    id: 'insuza',
    name: 'Insuza',
    shortName: 'Insuza',
    region: 'Matabeleland North',
    coords: [-19.7833, 28.2500],
    aliases: ['insuza', 'kenmaur'],
  },
  {
    id: 'lupane',
    name: 'Lupane',
    shortName: 'Lupane',
    region: 'Matabeleland North',
    coords: [-18.9315, 27.8070],
    aliases: ['lupane', 'jotsholo'],
  },
  {
    id: 'hwange',
    name: 'Hwange',
    shortName: 'Hwange',
    region: 'Matabeleland North',
    coords: [-18.3644, 26.5983],
    aliases: ['hwange', 'wankie', 'detema', 'dete'],
  },
  {
    id: 'victoria_falls',
    name: 'Victoria Falls Town',
    shortName: 'Victoria Falls',
    region: 'Matabeleland North',
    coords: [-17.9244, 25.8567],
    aliases: ['victoria falls', 'vic falls', 'livingstone', 'zambia', 'kazungula'],
  },
  {
    id: 'nkayi',
    name: 'Nkayi',
    shortName: 'Nkayi',
    region: 'Matabeleland North',
    coords: [-19.0000, 28.9000],
    aliases: ['nkayi', 'inyathi'],
  },
  {
    id: 'gokwe',
    name: 'Gokwe Centre',
    shortName: 'Gokwe',
    region: 'Midlands',
    coords: [-18.2048, 28.9349],
    aliases: ['gokwe'],
  },
  {
    id: 'shangani',
    name: 'Shangani',
    shortName: 'Shangani',
    region: 'Midlands',
    coords: [-19.7833, 29.3667],
    aliases: ['shangani', 'insiza', 'tree top'],
  },
  {
    id: 'gweru',
    name: 'Gweru City',
    shortName: 'Gweru',
    region: 'Midlands',
    coords: [-19.4500, 29.8167],
    aliases: ['gweru', 'gwelo', 'midlands'],
  },
  {
    id: 'shurugwi',
    name: 'Shurugwi',
    shortName: 'Shurugwi',
    region: 'Midlands',
    coords: [-19.6702, 30.0059],
    aliases: ['shurugwi', 'selukwe'],
  },
  {
    id: 'kwekwe',
    name: 'Kwekwe',
    shortName: 'Kwekwe',
    region: 'Midlands',
    coords: [-18.9281, 29.8149],
    aliases: ['kwekwe', 'redcliff'],
  },
  {
    id: 'kadoma',
    name: 'Kadoma',
    shortName: 'Kadoma',
    region: 'Mashonaland West',
    coords: [-18.3333, 29.9167],
    aliases: ['kadoma', 'gokwe turnoff'],
  },
  {
    id: 'chegutu',
    name: 'Chegutu',
    shortName: 'Chegutu',
    region: 'Mashonaland West',
    coords: [-18.1302, 30.1407],
    aliases: ['chegutu', 'hartley'],
  },
  {
    id: 'norton',
    name: 'Norton',
    shortName: 'Norton',
    region: 'Mashonaland West',
    coords: [-17.8833, 30.7000],
    aliases: ['norton'],
  },
  {
    id: 'harare_cbd',
    name: 'Harare CBD',
    shortName: 'Harare',
    region: 'Harare Metro',
    coords: [-17.8252, 31.0335],
    aliases: ['harare', 'hre', 'samora machel', 'road port', 'mbare', 'avondale', 'borrowdale'],
  },
  {
    id: 'chitungwiza',
    name: 'Chitungwiza',
    shortName: 'Chitungwiza',
    region: 'Harare Metro',
    coords: [-18.0127, 31.0756],
    aliases: ['chitungwiza', 'seke', 'zengeza'],
    isUrbanSuburb: true,
  },
  {
    id: 'beatrice',
    name: 'Beatrice / Skyline',
    shortName: 'Beatrice',
    region: 'Mashonaland East',
    coords: [-18.2500, 30.8500],
    aliases: ['beatrice', 'skyline'],
  },
  {
    id: 'chivhu',
    name: 'Chivhu',
    shortName: 'Chivhu',
    region: 'Mashonaland East',
    coords: [-19.0211, 30.8922],
    aliases: ['chivhu', 'enkeldoorn'],
  },
  {
    id: 'mvuma',
    name: 'Mvuma',
    shortName: 'Mvuma',
    region: 'Midlands',
    coords: [-19.2792, 30.5283],
    aliases: ['mvuma', 'umvuma'],
  },
  {
    id: 'filabusi',
    name: 'Filabusi',
    shortName: 'Filabusi',
    region: 'Matabeleland South',
    coords: [-20.5333, 29.2833],
    aliases: ['filabusi'],
  },
  {
    id: 'zvishavane',
    name: 'Zvishavane',
    shortName: 'Zvishavane',
    region: 'Midlands',
    coords: [-20.3000, 30.0500],
    aliases: ['zvishavane', 'shabani'],
  },
  {
    id: 'masvingo',
    name: 'Masvingo City',
    shortName: 'Masvingo',
    region: 'Masvingo',
    coords: [-20.0744, 30.8328],
    aliases: ['masvingo', 'great zimbabwe', 'fort victoria'],
  },
  {
    id: 'rutenga',
    name: 'Rutenga',
    shortName: 'Rutenga',
    region: 'Masvingo',
    coords: [-21.2500, 30.7333],
    aliases: ['rutenga', 'ngundu', 'mwenezi'],
  },
  {
    id: 'chiredzi',
    name: 'Chiredzi / Triangle',
    shortName: 'Chiredzi',
    region: 'Masvingo',
    coords: [-21.0500, 31.6667],
    aliases: ['chiredzi', 'triangle', 'lowveld'],
  },
  {
    id: 'marondera',
    name: 'Marondera',
    shortName: 'Marondera',
    region: 'Mashonaland East',
    coords: [-18.1853, 31.5519],
    aliases: ['marondera', 'macheke'],
  },
  {
    id: 'rusape',
    name: 'Rusape',
    shortName: 'Rusape',
    region: 'Manicaland',
    coords: [-18.5278, 32.1284],
    aliases: ['rusape', 'headlands'],
  },
  {
    id: 'nyanga',
    name: 'Nyanga',
    shortName: 'Nyanga',
    region: 'Manicaland',
    coords: [-18.2167, 32.7500],
    aliases: ['nyanga', 'juliasdale'],
  },
  {
    id: 'mutare',
    name: 'Mutare / Forbes Border',
    shortName: 'Mutare',
    region: 'Manicaland',
    coords: [-18.9707, 32.6709],
    aliases: ['mutare', 'forbes', 'mozambique', 'manicaland', 'beira'],
  },
  {
    id: 'birchenough',
    name: 'Birchenough Bridge',
    shortName: 'Birchenough',
    region: 'Manicaland',
    coords: [-19.9614, 32.3389],
    aliases: ['birchenough', 'chipinge', 'nyanyadzi'],
  },
  {
    id: 'chinhoyi',
    name: 'Chinhoyi',
    shortName: 'Chinhoyi',
    region: 'Mashonaland West',
    coords: [-17.3667, 30.2000],
    aliases: ['chinhoyi', 'banket'],
  },
  {
    id: 'karoi',
    name: 'Karoi / Makuti',
    shortName: 'Karoi',
    region: 'Mashonaland West',
    coords: [-16.8100, 29.6925],
    aliases: ['karoi', 'makuti', 'kariba'],
  },
  {
    id: 'chirundu',
    name: 'Chirundu Border Post',
    shortName: 'Chirundu',
    region: 'Mashonaland West',
    coords: [-16.0333, 28.8500],
    aliases: ['chirundu', 'lusaka'],
  },
  {
    id: 'bindura',
    name: 'Bindura',
    shortName: 'Bindura',
    region: 'Mashonaland Central',
    coords: [-17.3019, 31.3306],
    aliases: ['bindura', 'mazowe', 'shamva'],
  },
  {
    id: 'nyamapanda',
    name: 'Nyamapanda Border Post',
    shortName: 'Nyamapanda',
    region: 'Mashonaland East',
    coords: [-16.9500, 32.8500],
    aliases: ['nyamapanda', 'mutoko', 'murehwa', 'tete'],
  },
];

const RAW_EDGES: RoadEdge[] = [
  // Bulawayo Metro Local & Bypass Web
  { from: 'bulawayo_cbd', to: 'bulawayo_ascot', highwayCode: 'Bulawayo Urban', roadName: 'Leopold Takawira Ave (via Ascot)', distanceKm: 4, baseMinutes: 7 },
  { from: 'bulawayo_cbd', to: 'bulawayo_cecil_bypass', highwayCode: 'Bulawayo Urban', roadName: '12th Ave / Cecil Ave Bypass', distanceKm: 6, baseMinutes: 9, isBypassCorridor: true },
  { from: 'bulawayo_cecil_bypass', to: 'kensington', highwayCode: 'A6', roadName: 'Cecil Ave → Gwanda Rd Connector', distanceKm: 11, baseMinutes: 12, isBypassCorridor: true },
  { from: 'bulawayo_cecil_bypass', to: 'bulawayo_ascot', highwayCode: 'Bulawayo Urban', roadName: 'Hillside Rd → Ascot Bypass', distanceKm: 5, baseMinutes: 8, isBypassCorridor: true },
  { from: 'bulawayo_ascot', to: 'kensington', highwayCode: 'A6', roadName: 'Gwanda Rd (Ascot Approach)', distanceKm: 13, baseMinutes: 14 },
  { from: 'bulawayo_cbd', to: 'bulawayo_luveve', highwayCode: 'Bulawayo Urban', roadName: 'Luveve Rd', distanceKm: 8, baseMinutes: 12 },
  { from: 'bulawayo_cbd', to: 'bulawayo_khami', highwayCode: 'Bulawayo Urban', roadName: 'Khami / Plumtree Rd', distanceKm: 7, baseMinutes: 11 },
  { from: 'bulawayo_khami', to: 'bulawayo_cecil_bypass', highwayCode: 'Bulawayo Urban', roadName: 'Matopos Rd Cross-City Link', distanceKm: 8, baseMinutes: 11, isBypassCorridor: true },

  // A6 Southern Corridor (Bulawayo -> Gwanda -> Beitbridge)
  {
    from: 'kensington',
    to: 'esigodini',
    highwayCode: 'A6',
    roadName: 'A6 Gwanda Highway (via Esigodini)',
    distanceKm: 28,
    baseMinutes: 24,
    tollPlaza: { name: 'Esigodini Toll Plaza (KM 42)', lat: -20.2900, lng: 28.9300 },
  },
  { from: 'esigodini', to: 'mbalabala', highwayCode: 'A6', roadName: 'A6 Gwanda Highway (Esigodini–Mbalabala)', distanceKm: 34, baseMinutes: 27 },
  { from: 'mbalabala', to: 'gwanda', highwayCode: 'A6', roadName: 'A6 Gwanda Highway (Mbalabala–Gwanda)', distanceKm: 42, baseMinutes: 32 },
  {
    from: 'gwanda',
    to: 'west_nicholson',
    highwayCode: 'A6',
    roadName: 'A6 Beitbridge Rd (Colleen Bawn)',
    distanceKm: 45,
    baseMinutes: 34,
    tollPlaza: { name: 'Colleen Bawn Toll Plaza', lat: -21.0667, lng: 29.3667 },
  },
  { from: 'west_nicholson', to: 'beitbridge', highwayCode: 'A6', roadName: 'A6 Beitbridge Border Highway', distanceKm: 149, baseMinutes: 108 },

  // Genuine Alternative Southern Corridor via Matopos / Kezi (Bypasses A6 Esigodini & Mbalabala obstacles!)
  { from: 'bulawayo_khami', to: 'matopos_kezi', highwayCode: 'Matopos Rd', roadName: 'Matopos–Kezi Scenic Bypass', distanceKm: 46, baseMinutes: 42, isBypassCorridor: true },
  { from: 'bulawayo_cecil_bypass', to: 'matopos_kezi', highwayCode: 'Matopos Rd', roadName: 'Hillside → Matopos Bypass', distanceKm: 44, baseMinutes: 40, isBypassCorridor: true },
  { from: 'matopos_kezi', to: 'gwanda', highwayCode: 'Kezi-Gwanda Rd', roadName: 'Kezi–Tuli–Gwanda Regional Link', distanceKm: 88, baseMinutes: 72, isBypassCorridor: true },

  // A7 Plumtree / Botswana Corridor
  {
    from: 'bulawayo_khami',
    to: 'figtree',
    highwayCode: 'A7',
    roadName: 'A7 Plumtree Highway',
    distanceKm: 34,
    baseMinutes: 28,
    tollPlaza: { name: 'Figtree Toll Plaza (KM 38)', lat: -20.3200, lng: 28.2500 },
  },
  { from: 'figtree', to: 'plumtree', highwayCode: 'A7', roadName: 'A7 Plumtree Border Highway', distanceKm: 59, baseMinutes: 44 },
  { from: 'figtree', to: 'matopos_kezi', highwayCode: 'Regional Link', roadName: 'Figtree–Matopos Connector', distanceKm: 36, baseMinutes: 35, isBypassCorridor: true },

  // A8 Victoria Falls Corridor
  {
    from: 'bulawayo_luveve',
    to: 'insuza',
    highwayCode: 'A8',
    roadName: 'A8 Victoria Falls Highway',
    distanceKm: 62,
    baseMinutes: 48,
    tollPlaza: { name: 'Insuza Toll Plaza (KM 70)', lat: -19.7833, lng: 28.2500 },
  },
  {
    from: 'insuza',
    to: 'lupane',
    highwayCode: 'A8',
    roadName: 'A8 Victoria Falls Highway (Kenmaur–Lupane)',
    distanceKm: 102,
    baseMinutes: 76,
    tollPlaza: { name: 'Lupane Toll Plaza (KM 165)', lat: -18.9315, lng: 27.8070 },
  },
  {
    from: 'lupane',
    to: 'hwange',
    highwayCode: 'A8',
    roadName: 'A8 Victoria Falls Highway (Halfway–Hwange)',
    distanceKm: 165,
    baseMinutes: 120,
    tollPlaza: { name: 'Hwange Toll Plaza (KM 335)', lat: -18.3644, lng: 26.5983 },
  },
  { from: 'hwange', to: 'victoria_falls', highwayCode: 'A8', roadName: 'A8 Victoria Falls Approach', distanceKm: 100, baseMinutes: 78 },

  // Regional Midlands-North Bypass (Bulawayo <-> Nkayi <-> Lupane / Gokwe <-> Kwekwe)
  { from: 'bulawayo_luveve', to: 'nkayi', highwayCode: 'Nkayi Rd', roadName: 'Bulawayo–Nkayi Regional Rd', distanceKm: 145, baseMinutes: 118, isBypassCorridor: true },
  { from: 'nkayi', to: 'lupane', highwayCode: 'Regional Link', roadName: 'Nkayi–Lupane Connector', distanceKm: 118, baseMinutes: 98, isBypassCorridor: true },
  { from: 'nkayi', to: 'gokwe', highwayCode: 'Regional Link', roadName: 'Nkayi–Gokwe Bypass', distanceKm: 108, baseMinutes: 90, isBypassCorridor: true },
  { from: 'gokwe', to: 'kwekwe', highwayCode: 'Gokwe Rd', roadName: 'Gokwe–Kwekwe Arterial', distanceKm: 132, baseMinutes: 102, isBypassCorridor: true },
  { from: 'nkayi', to: 'kwekwe', highwayCode: 'Regional Link', roadName: 'Nkayi–Kwekwe Direct', distanceKm: 120, baseMinutes: 95, isBypassCorridor: true },

  // A5 Bulawayo -> Gweru -> Harare Arterial
  {
    from: 'bulawayo_ascot',
    to: 'shangani',
    highwayCode: 'A5',
    roadName: 'A5 Harare Highway (Tree Top)',
    distanceKm: 96,
    baseMinutes: 66,
    tollPlaza: { name: 'Tree Top Toll Plaza (KM 25)', lat: -19.9800, lng: 28.8200 },
  },
  { from: 'shangani', to: 'gweru', highwayCode: 'A5', roadName: 'A5 Harare Highway (Shangani–Gweru)', distanceKm: 64, baseMinutes: 44 },
  {
    from: 'gweru',
    to: 'kwekwe',
    highwayCode: 'A5',
    roadName: 'A5 Harare Highway (Gweru–Kwekwe)',
    distanceKm: 62,
    baseMinutes: 42,
    tollPlaza: { name: 'Gweru North Toll Plaza', lat: -19.1800, lng: 29.8150 },
  },
  {
    from: 'kwekwe',
    to: 'kadoma',
    highwayCode: 'A5',
    roadName: 'A5 Harare Highway (Kwekwe–Kadoma)',
    distanceKm: 72,
    baseMinutes: 48,
    tollPlaza: { name: 'Kadoma Toll Plaza', lat: -18.3333, lng: 29.9167 },
  },
  { from: 'kadoma', to: 'chegutu', highwayCode: 'A5', roadName: 'A5 Harare Highway (Kadoma–Chegutu)', distanceKm: 38, baseMinutes: 26 },
  {
    from: 'chegutu',
    to: 'norton',
    highwayCode: 'A5',
    roadName: 'A5 Harare Highway (Chegutu–Norton)',
    distanceKm: 65,
    baseMinutes: 42,
    tollPlaza: { name: 'Norton Toll Plaza (KM 397)', lat: -17.8833, lng: 30.7000 },
  },
  { from: 'norton', to: 'harare_cbd', highwayCode: 'A5', roadName: 'A5 Bulawayo Rd → Harare CBD', distanceKm: 40, baseMinutes: 30 },

  // A9 & Southern Cross-Links (Mbalabala / Gweru / Masvingo / Mutare / Beitbridge)
  { from: 'mbalabala', to: 'filabusi', highwayCode: 'A9', roadName: 'A9 Regional Highway (Filabusi)', distanceKm: 36, baseMinutes: 28 },
  { from: 'esigodini', to: 'filabusi', highwayCode: 'Regional Link', roadName: 'Esigodini–Filabusi Connector', distanceKm: 44, baseMinutes: 36, isBypassCorridor: true },
  {
    from: 'filabusi',
    to: 'zvishavane',
    highwayCode: 'A9',
    roadName: 'A9 Masvingo Highway',
    distanceKm: 88,
    baseMinutes: 64,
    tollPlaza: { name: 'Zvishavane Toll Plaza', lat: -20.3000, lng: 30.0500 },
  },
  { from: 'zvishavane', to: 'masvingo', highwayCode: 'A9', roadName: 'A9 Masvingo Approach', distanceKm: 96, baseMinutes: 70 },
  { from: 'gweru', to: 'shurugwi', highwayCode: 'R9', roadName: 'Gweru–Shurugwi Rd', distanceKm: 32, baseMinutes: 26 },
  { from: 'shurugwi', to: 'zvishavane', highwayCode: 'R9', roadName: 'Shurugwi–Zvishavane Rd', distanceKm: 78, baseMinutes: 58 },
  { from: 'shurugwi', to: 'masvingo', highwayCode: 'Regional Link', roadName: 'Shurugwi–Mashava–Masvingo Bypass', distanceKm: 108, baseMinutes: 82, isBypassCorridor: true },
  { from: 'gweru', to: 'mvuma', highwayCode: 'Regional Link', roadName: 'Gweru–Mvuma Highway', distanceKm: 82, baseMinutes: 58 },
  { from: 'mvuma', to: 'chivhu', highwayCode: 'A4', roadName: 'A4 Mvuma–Chivhu', distanceKm: 48, baseMinutes: 34 },
  { from: 'mvuma', to: 'masvingo', highwayCode: 'A4', roadName: 'A4 Mvuma–Masvingo', distanceKm: 94, baseMinutes: 66 },

  // A4 North-South Arterial (Harare -> Masvingo -> Beitbridge)
  {
    from: 'harare_cbd',
    to: 'beatrice',
    highwayCode: 'A4',
    roadName: 'A4 Masvingo Highway (Skyline)',
    distanceKm: 52,
    baseMinutes: 40,
    tollPlaza: { name: 'Skyline Toll Gate (KM 22)', lat: -17.9866, lng: 30.9844 },
  },
  { from: 'harare_cbd', to: 'chitungwiza', highwayCode: 'Harare Urban', roadName: 'Seke Rd', distanceKm: 24, baseMinutes: 26 },
  { from: 'chitungwiza', to: 'beatrice', highwayCode: 'Regional Link', roadName: 'Chitungwiza–Beatrice Bypass', distanceKm: 32, baseMinutes: 28, isBypassCorridor: true },
  {
    from: 'beatrice',
    to: 'chivhu',
    highwayCode: 'A4',
    roadName: 'A4 Masvingo Highway (Beatrice–Chivhu)',
    distanceKm: 92,
    baseMinutes: 64,
    tollPlaza: { name: 'Chivhu Toll Plaza', lat: -18.8800, lng: 30.8800 },
  },
  { from: 'chivhu', to: 'mvuma', highwayCode: 'A4', roadName: 'A4 Chivhu–Mvuma', distanceKm: 48, baseMinutes: 34 },
  { from: 'masvingo', to: 'rutenga', highwayCode: 'A4', roadName: 'A4 Beitbridge Highway (Ngundu–Rutenga)', distanceKm: 135, baseMinutes: 94 },
  {
    from: 'rutenga',
    to: 'beitbridge',
    highwayCode: 'A4',
    roadName: 'A4 Beitbridge Final Stretch',
    distanceKm: 138,
    baseMinutes: 96,
    tollPlaza: { name: 'Lutumba Toll Plaza', lat: -21.9500, lng: 29.9900 },
  },
  { from: 'rutenga', to: 'west_nicholson', highwayCode: 'Regional Link', roadName: 'Rutenga–West Nicholson Cross-Link', distanceKm: 152, baseMinutes: 118, isBypassCorridor: true },

  // Masvingo <-> Birchenough <-> Mutare <-> Chiredzi
  { from: 'masvingo', to: 'birchenough', highwayCode: 'A9', roadName: 'A9 Mutare–Masvingo Highway', distanceKm: 175, baseMinutes: 128 },
  { from: 'masvingo', to: 'chiredzi', highwayCode: 'R2', roadName: 'Masvingo–Chiredzi Lowveld Rd', distanceKm: 198, baseMinutes: 145 },
  { from: 'chiredzi', to: 'rutenga', highwayCode: 'Regional Link', roadName: 'Chiredzi–Rutenga Link', distanceKm: 112, baseMinutes: 88, isBypassCorridor: true },
  { from: 'chiredzi', to: 'birchenough', highwayCode: 'Regional Link', roadName: 'Save Valley–Birchenough Rd', distanceKm: 155, baseMinutes: 120, isBypassCorridor: true },
  { from: 'birchenough', to: 'mutare', highwayCode: 'A9', roadName: 'A9 Eastern Highlands Rd', distanceKm: 125, baseMinutes: 94 },

  // A3 Harare -> Marondera -> Rusape -> Mutare
  {
    from: 'harare_cbd',
    to: 'marondera',
    highwayCode: 'A3',
    roadName: 'A3 Mutare Highway (Ruwa–Marondera)',
    distanceKm: 74,
    baseMinutes: 54,
    tollPlaza: { name: 'Crocodile Motel Toll Plaza', lat: -18.0800, lng: 31.3800 },
  },
  { from: 'marondera', to: 'chivhu', highwayCode: 'Regional Link', roadName: 'Marondera–Wedza–Chivhu Bypass', distanceKm: 118, baseMinutes: 95, isBypassCorridor: true },
  {
    from: 'marondera',
    to: 'rusape',
    highwayCode: 'A3',
    roadName: 'A3 Mutare Highway (Macheke–Rusape)',
    distanceKm: 96,
    baseMinutes: 68,
    tollPlaza: { name: 'Rusape Toll Plaza', lat: -18.4200, lng: 31.9500 },
  },
  { from: 'rusape', to: 'mutare', highwayCode: 'A3', roadName: 'A3 Mutare Highway (Christmas Pass)', distanceKm: 93, baseMinutes: 66 },
  { from: 'rusape', to: 'nyanga', highwayCode: 'R4', roadName: 'Rusape–Nyanga Scenic Loop', distanceKm: 96, baseMinutes: 78, isBypassCorridor: true },
  { from: 'nyanga', to: 'mutare', highwayCode: 'R4', roadName: 'Nyanga–Mutare Mountain Bypass', distanceKm: 104, baseMinutes: 85, isBypassCorridor: true },

  // A1 (Harare -> Chinhoyi -> Karoi -> Chirundu) & A2 (Bindura / Nyamapanda)
  {
    from: 'harare_cbd',
    to: 'chinhoyi',
    highwayCode: 'A1',
    roadName: 'A1 Chirundu Highway (Inkomo–Chinhoyi)',
    distanceKm: 115,
    baseMinutes: 80,
    tollPlaza: { name: 'Inkomo Toll Plaza', lat: -17.6400, lng: 30.6500 },
  },
  { from: 'norton', to: 'chinhoyi', highwayCode: 'Regional Link', roadName: 'Norton–Darwendale–Chinhoyi Bypass', distanceKm: 92, baseMinutes: 72, isBypassCorridor: true },
  { from: 'chinhoyi', to: 'karoi', highwayCode: 'A1', roadName: 'A1 Chirundu Highway (Chinhoyi–Karoi)', distanceKm: 88, baseMinutes: 62 },
  { from: 'karoi', to: 'chirundu', highwayCode: 'A1', roadName: 'A1 Makuti Escarpment → Chirundu', distanceKm: 148, baseMinutes: 115 },
  { from: 'harare_cbd', to: 'bindura', highwayCode: 'A11', roadName: 'Mazowe–Bindura Rd', distanceKm: 88, baseMinutes: 68 },
  {
    from: 'harare_cbd',
    to: 'nyamapanda',
    highwayCode: 'A2',
    roadName: 'A2 Nyamapanda Highway (Murehwa–Mutoko)',
    distanceKm: 235,
    baseMinutes: 175,
    tollPlaza: { name: 'Juru Toll Plaza', lat: -17.6600, lng: 31.4800 },
  },
  { from: 'bindura', to: 'nyamapanda', highwayCode: 'Regional Link', roadName: 'Bindura–Mount Darwin–Nyamapanda Bypass', distanceKm: 205, baseMinutes: 168, isBypassCorridor: true },
  { from: 'marondera', to: 'nyamapanda', highwayCode: 'Regional Link', roadName: 'Marondera–Murehwa Link', distanceKm: 130, baseMinutes: 105, isBypassCorridor: true },
];

// Build symmetric adjacency map
const ADJACENCY: Record<string, RoadEdge[]> = {};
for (const node of ZIMBABWE_NODES) {
  ADJACENCY[node.id] = [];
}
for (const edge of RAW_EDGES) {
  if (ADJACENCY[edge.from] && ADJACENCY[edge.to]) {
    ADJACENCY[edge.from].push(edge);
    ADJACENCY[edge.to].push({
      ...edge,
      from: edge.to,
      to: edge.from,
      viaPoints: edge.viaPoints ? [...edge.viaPoints].reverse() : undefined,
    });
  }
}

export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Perpendicular distance in km from point P to line segment AB (flat-earth local projection)
 */
export function pointToSegmentDistanceKm(
  p: [number, number],
  a: [number, number],
  b: [number, number]
): number {
  const cosLat = Math.cos(((a[0] + b[0]) / 2) * (Math.PI / 180));
  const px = p[1] * cosLat;
  const py = p[0];
  const ax = a[1] * cosLat;
  const ay = a[0];
  const bx = b[1] * cosLat;
  const by = b[0];

  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = 0;
  if (lenSq > 0) {
    t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
  }
  const projLat = ay + t * dy;
  const projLng = (ax + t * dx) / (cosLat || 1);
  return haversineKm(p, [projLat, projLng]);
}

export function isIncidentActive(inc: RoadIncident): boolean {
  return inc.verificationStatus !== 'resolved' && inc.status !== 'resolved';
}

export function estimateObstacleDelayMinutes(inc: RoadIncident): number {
  if (!isIncidentActive(inc)) return 0;
  if (inc.category === 'accident') return inc.severity === 'critical' ? 18 : 10;
  if (inc.category === 'flooding') return 14;
  if (inc.category === 'roadwork') return 9;
  if (inc.category === 'breakdown') return 8;
  if (inc.category === 'checkpoint') return 5;
  if (inc.category === 'pothole') return 6;
  if (inc.category === 'congestion') return 7;
  return inc.severity === 'critical' ? 15 : 6;
}

/**
 * Finds all active obstacles that lie near any segment of the given polyline.
 */
export function findObstaclesAlongPolyline(
  waypoints: [number, number][],
  incidents: RoadIncident[],
  thresholdKm?: number
): RoadIncident[] {
  if (!waypoints || waypoints.length < 2) return [];

  // Compute total polyline length to auto-scale tolerance for urban vs national routes
  let totalKm = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalKm += haversineKm(waypoints[i], waypoints[i + 1]);
  }
  const maxCorridorDistKm = thresholdKm ?? (totalKm < 25 ? 2.5 : totalKm < 120 ? 8.5 : 14);

  const matched: { incident: RoadIncident; minDist: number }[] = [];
  for (const inc of incidents) {
    if (!isIncidentActive(inc)) continue;
    let minDist = Infinity;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const d = pointToSegmentDistanceKm(inc.coordinates, waypoints[i], waypoints[i + 1]);
      if (d < minDist) minDist = d;
    }
    if (minDist <= maxCorridorDistKm) {
      matched.push({ incident: inc, minDist });
    }
  }

  return matched
    .sort((a, b) => {
      const sevRank = (s: string) => (s === 'critical' ? 0 : s === 'warning' ? 1 : s === 'advisory' ? 2 : 3);
      return sevRank(a.incident.severity) - sevRank(b.incident.severity) || a.minDist - b.minDist;
    })
    .map((m) => m.incident);
}

export interface ResolvedPlace {
  label: string;
  coords: [number, number];
  nearestNodeId: string;
  isCustomCoords?: boolean;
}

export function findNearestNode(coords: [number, number]): RoadNode {
  let best = ZIMBABWE_NODES[0];
  let bestDist = Infinity;
  for (const node of ZIMBABWE_NODES) {
    const d = haversineKm(coords, node.coords);
    if (d < bestDist) {
      bestDist = d;
      best = node;
    }
  }
  return best;
}

export function resolvePlaceInput(
  input: string | [number, number],
  fallbackNodeId = 'bulawayo_cbd'
): ResolvedPlace | null {
  if (Array.isArray(input)) {
    const nearest = findNearestNode(input);
    const dist = haversineKm(input, nearest.coords);
    return {
      label: dist < 3 ? nearest.name : `Pinned Point near ${nearest.shortName}`,
      coords: input,
      nearestNodeId: nearest.id,
      isCustomCoords: dist >= 0.4,
    };
  }

  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check if input is "lat, lng"
  const coordMatch = trimmed.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (coordMatch) {
    const coords: [number, number] = [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
    const nearest = findNearestNode(coords);
    return {
      label: `GPS Location near ${nearest.shortName}`,
      coords,
      nearestNodeId: nearest.id,
      isCustomCoords: true,
    };
  }

  const q = trimmed.toLowerCase();

  // Exact node ID or name match
  for (const node of ZIMBABWE_NODES) {
    if (
      node.id === q ||
      node.name.toLowerCase() === q ||
      node.shortName.toLowerCase() === q
    ) {
      return {
        label: node.name,
        coords: node.coords,
        nearestNodeId: node.id,
      };
    }
  }

  // Alias match (prefer longer/more specific match)
  let bestNode: RoadNode | null = null;
  let bestScore = 0;
  for (const node of ZIMBABWE_NODES) {
    const candidates = [node.shortName.toLowerCase(), node.name.toLowerCase(), ...node.aliases];
    for (const alias of candidates) {
      if (q === alias) {
        bestNode = node;
        bestScore = 1000;
        break;
      }
      if (q.includes(alias) && alias.length > bestScore) {
        bestNode = node;
        bestScore = alias.length;
      } else if (alias.includes(q) && q.length >= 3 && q.length > bestScore) {
        bestNode = node;
        bestScore = q.length;
      }
    }
  }

  if (bestNode) {
    return {
      label: bestNode.name,
      coords: bestNode.coords,
      nearestNodeId: bestNode.id,
    };
  }

  // Graceful fallback to fallback node if user says "My Location" / "Here"
  if (q.includes('my location') || q.includes('current location') || q === 'here') {
    const fallback = ZIMBABWE_NODES.find((n) => n.id === fallbackNodeId) || ZIMBABWE_NODES[0];
    return {
      label: `Current Location (${fallback.shortName})`,
      coords: fallback.coords,
      nearestNodeId: fallback.id,
    };
  }

  return null;
}

interface DijkstraResult {
  nodeIds: string[];
  edges: RoadEdge[];
  totalMinutes: number;
  totalKm: number;
}

function runDijkstra(
  startId: string,
  endId: string,
  edgeCostFn: (edge: RoadEdge) => number
): DijkstraResult | null {
  if (!ADJACENCY[startId] || !ADJACENCY[endId]) return null;
  if (startId === endId) {
    return { nodeIds: [startId], edges: [], totalMinutes: 5, totalKm: 2 };
  }

  const dist: Record<string, number> = {};
  const prevNode: Record<string, string | null> = {};
  const prevEdge: Record<string, RoadEdge | null> = {};
  const visited = new Set<string>();

  for (const node of ZIMBABWE_NODES) {
    dist[node.id] = Infinity;
    prevNode[node.id] = null;
    prevEdge[node.id] = null;
  }
  dist[startId] = 0;

  while (true) {
    let u: string | null = null;
    let minVal = Infinity;
    for (const node of ZIMBABWE_NODES) {
      if (!visited.has(node.id) && dist[node.id] < minVal) {
        minVal = dist[node.id];
        u = node.id;
      }
    }
    if (!u || u === endId) break;
    visited.add(u);

    for (const edge of ADJACENCY[u] || []) {
      if (visited.has(edge.to)) continue;
      const cost = edgeCostFn(edge);
      const alt = dist[u] + cost;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prevNode[edge.to] = u;
        prevEdge[edge.to] = edge;
      }
    }
  }

  if (dist[endId] === Infinity) return null;

  const nodeIds: string[] = [];
  const edges: RoadEdge[] = [];
  let curr: string | null = endId;
  while (curr) {
    nodeIds.unshift(curr);
    const e = prevEdge[curr];
    if (e) edges.unshift(e);
    curr = prevNode[curr];
  }

  const totalKm = edges.reduce((acc, e) => acc + e.distanceKm, 0);
  const totalMinutes = edges.reduce((acc, e) => acc + e.baseMinutes, 0);
  return { nodeIds, edges, totalKm, totalMinutes };
}

function buildWaypointsAndMeta(
  result: DijkstraResult,
  originPlace: ResolvedPlace,
  destPlace: ResolvedPlace,
  incidents: RoadIncident[]
): {
  waypoints: [number, number][];
  tollPlazas: { name: string; lat: number; lng: number }[];
  steps: RouteStep[];
  highwayCode: string;
  obstacles: RoadIncident[];
  delayMinutes: number;
  extraKm: number;
} {
  const waypoints: [number, number][] = [];
  const tollPlazas: { name: string; lat: number; lng: number }[] = [];
  const steps: RouteStep[] = [];
  const highwayCounts: Record<string, number> = {};

  if (originPlace.isCustomCoords) {
    waypoints.push(originPlace.coords);
  }

  result.nodeIds.forEach((id, idx) => {
    const n = ZIMBABWE_NODES.find((x) => x.id === id);
    if (n) waypoints.push(n.coords);

    if (idx < result.edges.length) {
      const edge = result.edges[idx];
      if (edge.viaPoints) {
        edge.viaPoints.forEach((vp) => waypoints.push(vp));
      }
      if (edge.tollPlaza) {
        tollPlazas.push(edge.tollPlaza);
      }
      highwayCounts[edge.highwayCode] = (highwayCounts[edge.highwayCode] || 0) + edge.distanceKm;

      const destNode = ZIMBABWE_NODES.find((x) => x.id === edge.to);
      steps.push({
        instruction: `Take ${edge.roadName} toward ${destNode?.shortName || edge.to}${
          edge.tollPlaza ? ` (includes ${edge.tollPlaza.name})` : ''
        }`,
        distanceKm: edge.distanceKm,
        icon: edge.tollPlaza ? 'toll' : idx === 0 ? 'start' : 'straight',
      });
    }
  });

  if (destPlace.isCustomCoords) {
    waypoints.push(destPlace.coords);
  }

  let extraKm = 0;
  if (originPlace.isCustomCoords) {
    const firstNode = ZIMBABWE_NODES.find((n) => n.id === result.nodeIds[0]);
    if (firstNode) extraKm += Math.round(haversineKm(originPlace.coords, firstNode.coords));
  }
  if (destPlace.isCustomCoords) {
    const lastNode = ZIMBABWE_NODES.find((n) => n.id === result.nodeIds[result.nodeIds.length - 1]);
    if (lastNode) extraKm += Math.round(haversineKm(destPlace.coords, lastNode.coords));
  }

  if (steps.length === 0) {
    steps.push({
      instruction: `Travel locally from ${originPlace.label} to ${destPlace.label}`,
      distanceKm: Math.max(2, extraKm),
      icon: 'start',
    });
  } else {
    steps.push({
      instruction: `Arrive at ${destPlace.label}`,
      distanceKm: 0,
      icon: 'destination',
    });
  }

  // Deduplicate nearby identical waypoints
  const cleanWaypoints: [number, number][] = [];
  for (const pt of waypoints) {
    const prev = cleanWaypoints[cleanWaypoints.length - 1];
    if (!prev || haversineKm(prev, pt) > 0.05) {
      cleanWaypoints.push(pt);
    }
  }

  // Pick dominant highway code
  const dominantHighway =
    Object.entries(highwayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Regional Rd';

  const obstacles = findObstaclesAlongPolyline(cleanWaypoints, incidents);
  const delayMinutes = obstacles.reduce((sum, inc) => sum + estimateObstacleDelayMinutes(inc), 0);

  return {
    waypoints: cleanWaypoints,
    tollPlazas,
    steps,
    highwayCode: dominantHighway,
    obstacles,
    delayMinutes,
    extraKm,
  };
}

/**
 * Generates a realistic curved local bypass polyline around obstacles when the highway graph
 * only has a single trunk road in that exact corridor.
 */
function buildLocalDetourWaypoints(
  waypoints: [number, number][],
  obstacles: RoadIncident[]
): [number, number][] {
  if (waypoints.length < 2 || obstacles.length === 0) return waypoints;

  // Determine overall scale so offset looks natural on the map
  let totalKm = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalKm += haversineKm(waypoints[i], waypoints[i + 1]);
  }
  const offsetDeg = totalKm < 25 ? 0.028 : totalKm < 120 ? 0.085 : 0.14;

  const detoured: [number, number][] = [waypoints[0]];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];

    // Check if any obstacle sits along segment a -> b
    const segObstacles = obstacles.filter(
      (obs) => pointToSegmentDistanceKm(obs.coordinates, a, b) <= (totalKm < 25 ? 2.5 : 14)
    );

    if (segObstacles.length > 0) {
      const dx = b[1] - a[1];
      const dy = b[0] - a[0];
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      // Perpendicular unit vector
      const nx = -dy / len;
      const ny = dx / len;

      // Choose side away from the first obstacle
      const obs = segObstacles[0].coordinates;
      const midLat = (a[0] + b[0]) / 2;
      const midLng = (a[1] + b[1]) / 2;
      const dot = (obs[0] - midLat) * ny + (obs[1] - midLng) * nx;
      const sign = dot >= 0 ? -1 : 1;

      const p1: [number, number] = [
        a[0] + dy * 0.25 + sign * ny * offsetDeg * 0.85,
        a[1] + dx * 0.25 + sign * nx * offsetDeg * 0.85,
      ];
      const p2: [number, number] = [
        a[0] + dy * 0.5 + sign * ny * offsetDeg * 1.15,
        a[1] + dx * 0.5 + sign * nx * offsetDeg * 1.15,
      ];
      const p3: [number, number] = [
        a[0] + dy * 0.75 + sign * ny * offsetDeg * 0.85,
        a[1] + dx * 0.75 + sign * nx * offsetDeg * 0.85,
      ];
      detoured.push(p1, p2, p3);
    }
    detoured.push(b);
  }

  return detoured;
}

/**
 * Computes the primary route AND clear alternative bypass routes between ANY two locations in Zimbabwe
 * (or GPS coordinates / map-pinned points), reflecting all live obstacles along each route.
 */
export function computeDynamicRouteWithAlternatives(
  originInput: string | [number, number],
  destInput: string | [number, number],
  incidents: RoadIncident[]
): RoutePreviewData | null {
  const originPlace = resolvePlaceInput(originInput, 'bulawayo_cbd');
  const destPlace = resolvePlaceInput(destInput, 'gwanda');
  if (!originPlace || !destPlace) return null;

  // Handle same-node or direct local route (e.g. user clicked two points in same town or Bulawayo CBD -> Ascot)
  const edgeObstaclePenalty = (edge: RoadEdge): number => {
    const nA = ZIMBABWE_NODES.find((n) => n.id === edge.from);
    const nB = ZIMBABWE_NODES.find((n) => n.id === edge.to);
    if (!nA || !nB) return 0;
    const segObstacles = findObstaclesAlongPolyline([nA.coords, nB.coords], incidents, 11);
    return segObstacles.reduce((sum, inc) => sum + estimateObstacleDelayMinutes(inc) * 14, 0);
  };

  // 1. Primary Shortest/Fastest Route
  const primaryRes = runDijkstra(
    originPlace.nearestNodeId,
    destPlace.nearestNodeId,
    (edge) => edge.baseMinutes + (edge.isBypassCorridor ? 6 : 0)
  );
  if (!primaryRes) return null;

  const primaryMeta = buildWaypointsAndMeta(primaryRes, originPlace, destPlace, incidents);
  const primaryTotalKm = Math.max(2, primaryRes.totalKm + primaryMeta.extraKm);
  const primaryTotalMin = Math.max(5, primaryRes.totalMinutes + Math.round(primaryMeta.extraKm * 1.1));

  const primaryOption: AlternativeRouteOption = {
    id: 'route-opt-primary',
    label: `Primary via ${primaryMeta.highwayCode}`,
    badgeText:
      primaryMeta.obstacles.length === 0
        ? 'Clear Fastest Route'
        : `${primaryMeta.obstacles.length} Obstacle${primaryMeta.obstacles.length > 1 ? 's' : ''} (+${primaryMeta.delayMinutes}m)`,
    isPrimary: true,
    highwayCode: primaryMeta.highwayCode,
    distanceKm: primaryTotalKm,
    estMinutes: primaryTotalMin + primaryMeta.delayMinutes,
    delayMinutes: primaryMeta.delayMinutes,
    tollCount: primaryMeta.tollPlazas.length,
    tollFeeUsd: primaryMeta.tollPlazas.length * 4,
    tollFeeZiG: primaryMeta.tollPlazas.length * 110,
    tollPlazas: primaryMeta.tollPlazas,
    waypoints: primaryMeta.waypoints,
    obstaclesOnRoute: primaryMeta.obstacles,
    avoidedObstacles: [],
    isRecommendedClear: primaryMeta.obstacles.length === 0,
    roadCondition:
      primaryMeta.obstacles.length === 0
        ? `Clear corridor along ${primaryMeta.highwayCode}`
        : `${primaryMeta.obstacles.length} active obstacle(s) detected on ${primaryMeta.highwayCode}`,
    steps: primaryMeta.steps,
  };

  const options: AlternativeRouteOption[] = [primaryOption];
  const primaryEdgeKeys = new Set(primaryRes.edges.map((e) => `${e.from}->${e.to}`));

  // 2. Graph-based Alternative / Obstacle-Avoiding Route
  const altRes = runDijkstra(originPlace.nearestNodeId, destPlace.nearestNodeId, (edge) => {
    const key1 = `${edge.from}->${edge.to}`;
    const key2 = `${edge.to}->${edge.from}`;
    const overlapPenalty = primaryEdgeKeys.has(key1) || primaryEdgeKeys.has(key2) ? edge.baseMinutes * 1.9 + 25 : 0;
    const obsPenalty = edgeObstaclePenalty(edge);
    return edge.baseMinutes + overlapPenalty + obsPenalty;
  });

  if (altRes && altRes.nodeIds.join(',') !== primaryRes.nodeIds.join(',')) {
    const altMeta = buildWaypointsAndMeta(altRes, originPlace, destPlace, incidents);
    const altTotalKm = Math.max(2, altRes.totalKm + altMeta.extraKm);
    const altTotalMin = Math.max(5, altRes.totalMinutes + Math.round(altMeta.extraKm * 1.1));

    const altObstacleIds = new Set(altMeta.obstacles.map((o) => o.id));
    const avoided = primaryMeta.obstacles.filter((o) => !altObstacleIds.has(o.id));

    // Name via distinctive midpoint town
    const viaNodeIds = altRes.nodeIds.filter((id) => !primaryRes.nodeIds.includes(id));
    const viaNode = viaNodeIds.length > 0 ? ZIMBABWE_NODES.find((n) => n.id === viaNodeIds[0]) : null;
    const viaName = viaNode ? viaNode.shortName : altMeta.highwayCode;

    options.push({
      id: 'route-opt-alt-graph',
      label: `Alternative via ${viaName}`,
      badgeText:
        avoided.length > 0
          ? `Avoids ${avoided.length} Obstacle${avoided.length > 1 ? 's' : ''}`
          : altMeta.obstacles.length === 0
          ? 'Clear Alternate Corridor'
          : 'Alternate Corridor',
      isPrimary: false,
      highwayCode: altMeta.highwayCode,
      distanceKm: altTotalKm,
      estMinutes: altTotalMin + altMeta.delayMinutes,
      delayMinutes: altMeta.delayMinutes,
      tollCount: altMeta.tollPlazas.length,
      tollFeeUsd: altMeta.tollPlazas.length * 4,
      tollFeeZiG: altMeta.tollPlazas.length * 110,
      tollPlazas: altMeta.tollPlazas,
      waypoints: altMeta.waypoints,
      obstaclesOnRoute: altMeta.obstacles,
      avoidedObstacles: avoided,
      isRecommendedClear: avoided.length > 0 && altMeta.obstacles.length < primaryMeta.obstacles.length,
      roadCondition:
        avoided.length > 0
          ? `Bypass via ${viaName} avoids: ${avoided.map((a) => a.title).join(', ')}`
          : `Alternative corridor via ${viaName}`,
      steps: altMeta.steps,
    });
  }

  // 3. If Primary has obstacles and no graph alt completely avoided all obstacles, generate a clear Local Detour Bypass!
  const hasClearAlt = options.some((opt, idx) => idx > 0 && opt.obstaclesOnRoute.length === 0);
  if (primaryMeta.obstacles.length > 0 && !hasClearAlt) {
    const detourWaypoints = buildLocalDetourWaypoints(primaryMeta.waypoints, primaryMeta.obstacles);
    const detourExtraKm = Math.max(3, Math.round(primaryTotalKm * 0.09));
    const detourExtraMin = Math.max(6, Math.round(detourExtraKm * 1.1));

    const detourSteps: RouteStep[] = [
      {
        instruction: `Depart ${originPlace.label} on main approach`,
        distanceKm: Math.round(primaryTotalKm * 0.2),
        icon: 'start',
      },
      ...primaryMeta.obstacles.slice(0, 3).map((obs) => ({
        instruction: `🔀 Take local bypass road around "${obs.title}" (${obs.locationName}) — ${
          obs.detourAdvice || 'use parallel secondary link road'
        }`,
        distanceKm: Math.max(2, Math.round(detourExtraKm / Math.max(1, primaryMeta.obstacles.length))),
        icon: 'turn-right' as const,
      })),
      {
        instruction: `Rejoin ${primaryMeta.highwayCode} past obstruction zone and continue to ${destPlace.label}`,
        distanceKm: Math.round(primaryTotalKm * 0.7),
        icon: 'destination',
      },
    ];

    options.push({
      id: 'route-opt-local-detour',
      label: `Local Detour Bypass (Avoids Obstacles)`,
      badgeText: `Bypass All ${primaryMeta.obstacles.length} Obstacle${primaryMeta.obstacles.length > 1 ? 's' : ''}`,
      isPrimary: false,
      highwayCode: `${primaryMeta.highwayCode} Bypass`,
      distanceKm: primaryTotalKm + detourExtraKm,
      estMinutes: primaryTotalMin + detourExtraMin,
      delayMinutes: 0,
      tollCount: primaryMeta.tollPlazas.length,
      tollFeeUsd: primaryMeta.tollPlazas.length * 4,
      tollFeeZiG: primaryMeta.tollPlazas.length * 110,
      tollPlazas: primaryMeta.tollPlazas,
      waypoints: detourWaypoints,
      obstaclesOnRoute: [],
      avoidedObstacles: primaryMeta.obstacles,
      isRecommendedClear: true,
      roadCondition: `Clear local bypass diverting around ${primaryMeta.obstacles.length} active obstacle(s)`,
      steps: detourSteps,
    });
  }

  // Pick the default selected display (Primary by default, with alternatives clearly attached!)
  const hazardsSummary =
    primaryMeta.obstacles.length === 0
      ? '✓ Route completely clear of reported roadblocks or accidents'
      : primaryMeta.obstacles
          .slice(0, 3)
          .map((o) => `${o.category === 'checkpoint' ? '👮' : o.category === 'accident' ? '💥' : '🚧'} ${o.title}`)
          .join(' · ');

  return {
    routeId: `dyn-${originPlace.nearestNodeId}-${destPlace.nearestNodeId}-${Date.now().toString(36)}`,
    origin: originPlace.label,
    destination: destPlace.label,
    highwayCode: primaryOption.highwayCode,
    distanceKm: primaryOption.distanceKm,
    estMinutes: primaryOption.estMinutes,
    tollCount: primaryOption.tollCount,
    tollFeeUsd: primaryOption.tollFeeUsd,
    tollFeeZiG: primaryOption.tollFeeZiG,
    tollPlazas: primaryOption.tollPlazas,
    waypoints: primaryOption.waypoints,
    roadCondition: primaryOption.roadCondition,
    hazardsSummary,
    fastestRouteLabel:
      primaryMeta.obstacles.length > 0
        ? `Alternative bypass available (${options.length} routes)`
        : `${options.length} route option${options.length > 1 ? 's' : ''} available`,
    steps: primaryOption.steps,
    alternativeRoutes: options,
  };
}

/**
 * Enriches any preset RoutePreviewData with live obstacle matches & alternative bypass routes!
 */
export function enrichRoutePreviewWithAlternatives(
  route: RoutePreviewData,
  incidents: RoadIncident[]
): RoutePreviewData {
  if (route.alternativeRoutes && route.alternativeRoutes.length > 0) {
    return route;
  }

  // Try computing full graph alternatives using origin & destination
  const dynamic = computeDynamicRouteWithAlternatives(route.origin, route.destination, incidents);
  if (dynamic && dynamic.alternativeRoutes && dynamic.alternativeRoutes.length > 0) {
    // Keep the rich preset metadata for primary if waypoints match closely
    const primaryObstacles = findObstaclesAlongPolyline(route.waypoints, incidents);
    const primaryDelay = primaryObstacles.reduce((s, o) => s + estimateObstacleDelayMinutes(o), 0);

    const presetPrimary: AlternativeRouteOption = {
      id: 'route-opt-primary',
      label: `Primary via ${route.highwayCode}`,
      badgeText:
        primaryObstacles.length === 0
          ? 'Clear Fastest Route'
          : `${primaryObstacles.length} Obstacle${primaryObstacles.length > 1 ? 's' : ''} (+${primaryDelay}m)`,
      isPrimary: true,
      highwayCode: route.highwayCode,
      distanceKm: route.distanceKm,
      estMinutes: route.estMinutes + primaryDelay,
      delayMinutes: primaryDelay,
      tollCount: route.tollCount,
      tollFeeUsd: route.tollFeeUsd,
      tollFeeZiG: route.tollFeeZiG,
      tollPlazas: route.tollPlazas,
      waypoints: route.waypoints,
      obstaclesOnRoute: primaryObstacles,
      avoidedObstacles: [],
      isRecommendedClear: primaryObstacles.length === 0,
      roadCondition: route.roadCondition,
      steps: route.steps,
    };

    const alts = dynamic.alternativeRoutes.slice(1);
    return {
      ...route,
      alternativeRoutes: [presetPrimary, ...alts],
    };
  }

  return route;
}

/**
 * Parses natural-language origin and destination like:
 * - "from Harare to Mutare"
 * - "Gweru to Beitbridge"
 * - "how do I go to Gwanda" (uses defaultOrigin)
 */
export function parseOriginAndDestinationFromQuery(
  query: string,
  defaultOrigin = 'Bulawayo'
): { origin: string; destination: string } | null {
  const q = query.trim();
  const fromToMatch = q.match(/(?:from\s+)?([a-zA-Z\s]+?)\s+(?:to|->|towards)\s+([a-zA-Z\s]+?)(?:\?|\.|!|$|via|on|avoid)/i);
  if (fromToMatch) {
    const rawOrigin = fromToMatch[1]
      .replace(/^(what's the best route|what is the best route|best route|show route|route|directions|go|drive|travel|get)\s+/i, '')
      .trim();
    const rawDest = fromToMatch[2]
      .replace(/\s+(on the map|on map|please|now)$/i, '')
      .trim();

    const resolvedDest = resolvePlaceInput(rawDest);
    const resolvedOrigin = rawOrigin.length >= 2 ? resolvePlaceInput(rawOrigin) : null;

    if (resolvedDest && resolvedOrigin && resolvedDest.nearestNodeId !== resolvedOrigin.nearestNodeId) {
      return { origin: resolvedOrigin.label, destination: resolvedDest.label };
    }
    if (resolvedDest) {
      return { origin: defaultOrigin, destination: resolvedDest.label };
    }
  }

  // Fallback: look for any Zimbabwe node mentioned in the query
  const mentioned: RoadNode[] = [];
  const lower = q.toLowerCase();
  for (const node of ZIMBABWE_NODES) {
    if (node.isUrbanSuburb) continue;
    const keys = [node.shortName.toLowerCase(), ...node.aliases];
    if (keys.some((k) => k.length >= 4 && lower.includes(k))) {
      mentioned.push(node);
    }
  }

  if (mentioned.length >= 2) {
    return { origin: mentioned[0].name, destination: mentioned[1].name };
  }
  if (mentioned.length === 1) {
    const dest = mentioned[0];
    const originFallback = dest.id === 'bulawayo_cbd' ? 'Harare' : defaultOrigin;
    return { origin: originFallback, destination: dest.name };
  }

  return null;
}
