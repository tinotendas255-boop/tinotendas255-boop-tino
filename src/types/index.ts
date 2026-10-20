export type IncidentSeverity = 'critical' | 'warning' | 'advisory' | 'info';

export type IncidentCategory =
  | 'accident'
  | 'congestion'
  | 'closure'
  | 'roadwork'
  | 'weather_hazard'
  | 'flooding'
  | 'public_transit'
  | 'fuel_disruption'
  | 'official_announcement'
  | 'checkpoint'
  | 'pothole'
  | 'breakdown'
  | 'general_safety';

export type IncidentType = IncidentCategory;

export type IncidentVerificationStatus =
  | 'reported'
  | 'under_review'
  | 'verified'
  | 'resolved'
  | 'dismissed'
  | 'unverified';

export type UserRole = 'citizen' | 'verified_driver' | 'transport_operator' | 'moderator' | 'news_journalist';

export type ZimbabweTown =
  | 'Harare'
  | 'Bulawayo'
  | 'Beitbridge'
  | 'Mutare'
  | 'Gweru'
  | 'Masvingo'
  | 'Kwekwe'
  | 'Chinhoyi'
  | 'Victoria Falls'
  | 'Chirundu'
  | 'Kadoma'
  | 'Hwange'
  | 'Zvishavane'
  | 'Marondera'
  | 'Karoi';

export type ZimbabweHighway =
  | 'A1 (Harare - Chirundu)'
  | 'A2 (Harare - Nyamapanda)'
  | 'A3 (Harare - Mutare)'
  | 'A4 (Harare - Beitbridge)'
  | 'A5 (Harare - Bulawayo)'
  | 'A6 (Bulawayo - Beitbridge)'
  | 'A7 (Bulawayo - Plumtree)'
  | 'A8 (Bulawayo - Victoria Falls)'
  | 'A9 (Mutare - Masvingo)'
  | 'Harare Urban'
  | 'Bulawayo Urban'
  | 'Other Regional Road';

export interface IncidentComment {
  id: string;
  userName: string;
  userRole: UserRole;
  text: string;
  timestamp: string;
  isHelpfulVoteCount?: number;
}

export interface RoadIncident {
  id: string;
  title: string;
  category: IncidentCategory;
  highway: ZimbabweHighway;
  town?: ZimbabweTown;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  isApproximateLocation?: boolean; // True when only a general area is known
  approximateAreaLabel?: string;
  severity: IncidentSeverity;
  status?: IncidentVerificationStatus;
  verificationStatus: IncidentVerificationStatus;
  timestamp: string;
  dateObserved?: string;
  timeObserved?: string;
  isStillOngoing: boolean;
  description: string;
  reporterRole: UserRole;
  reporterName: string;
  reporterId?: string; // Links to user profile submissions
  confirmationsCount: number;
  refutedCount: number;
  helpfulCount: number;
  flagCount?: number;
  detourAdvice?: string;
  direction?: 'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound' | 'Both Directions';
  estimatedClearTime?: string;
  verifiedBy?: string;
  moderationNotes?: string;
  resolvedAt?: string;
  imageUrl?: string;
  userVote?: 'confirm' | 'refute';
  userFoundHelpful?: boolean;
  comments?: IncidentComment[];
  isDemoData?: boolean;
}

export interface WeatherTravelAlert {
  id: string;
  region: string;
  severity: 'critical' | 'warning' | 'advisory';
  title: string;
  condition: 'Heavy Rain' | 'Flash Flood Risk' | 'Dense Escarpment Mist' | 'Severe Thunderstorm' | 'High Surface Heat';
  affectedHighways: string[];
  issuedAt: string;
  source: string;
  advisoryText: string;
  isDemoData: boolean;
}

export interface HighwayCorridor {
  code: string;
  name: string;
  fromCity: string;
  toCity: string;
  lengthKm: number;
  surfaceCondition: 'Excellent' | 'Good' | 'Under Rehabilitation' | 'Caution: Potholes' | 'Heavy Freight Corridor';
  activeIncidentsCount: number;
  tollGatesCount: number;
  tollGates: string[];
  averageSpeedKmh: number;
  statusColor: 'emerald' | 'amber' | 'rose';
  description: string;
  keyWaypoints: { name: string; lat: number; lng: number }[];
}

export type DriverType = 'truck' | 'bus' | 'commuter';

export interface NewsStory {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  category:
    | 'all'
    | 'accidents'
    | 'congestion'
    | 'closures'
    | 'roadworks'
    | 'weather'
    | 'public_transit'
    | 'fuel'
    | 'official_announcements'
    | 'safety';
  categoryLabel: string;
  locationOrRoute: string;
  town?: string;
  severity?: IncidentSeverity;
  author: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  lastUpdatedAt: string;
  readTimeMinutes: number;
  imageUrl?: string;
  relatedHighway?: ZimbabweHighway;
  relatedIncidentId?: string;
  alternativeRoute?: string;
  isSponsored?: boolean;
  sponsorName?: string;
  isDemoData?: boolean;
  verificationStatus: 'verified' | 'official' | 'community' | 'demo';
  tags: string[];
  targetAudience?: ('truck' | 'bus' | 'commuter' | 'all')[];
}

export interface TransportOperator {
  id: string;
  name: string;
  type: 'Intercity Coach' | 'Cross-Border Bus' | 'Heavy Freight & Logistics' | 'Commuter Omnibus Association';
  headquarters: string;
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  primaryRoutes: string[];
  mainTerminals: string[];
  safetyRating: number; // 1-5
  verifiedOperator: boolean;
  fleetSizeEstimate: string;
  bookingChannel: string;
  isFeaturedPreview?: boolean;
}

export interface RouteOption {
  id: string;
  origin: string;
  destination: string;
  highwayCode: string;
  distanceKm: number;
  estMinutes: number;
  tollCount: number;
  tollsCostUsd: {
    lightVehicle: number;
    minibus: number;
    bus: number;
    heavyTruck: number;
    haulage: number;
  };
  tollGates: string[];
  roadworkZones: string[];
  knownHotspots: string[];
  fuelStops: string[];
  alternativeRoutes?: string[];
  corridorSafetyIndex: number; // 0-100
  notes: string;
  waypoints: [number, number][];
  isSaved?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'critical_incident' | 'weather_alert' | 'route_update' | 'report_status' | 'announcement';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
  relatedId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phoneOrEmail: string;
  baseTown: ZimbabweTown;
  role: UserRole;
  driverType: DriverType;
  vehicleModel?: string;
  companyOrFleet?: string;
  isVerifiedDriver: boolean;
  savedRouteIds: string[];
  followedRegions: string[];
  notificationPrefs: {
    criticalIncidents: boolean;
    weatherWarnings: boolean;
    savedRoutes: boolean;
    reportUpdates: boolean;
  };
}

export interface ModeratorActionLog {
  id: string;
  incidentId: string;
  incidentTitle: string;
  action: 'verified' | 'resolved' | 'severity_changed' | 'dismissed' | 'under_review';
  moderatorName: string;
  timestamp: string;
  note?: string;
}

export interface SystemIntegrationStatus {
  serviceId: string;
  name: string;
  category: 'Mapping' | 'Geolocation' | 'Traffic & Tolls' | 'Weather & Alerts' | 'Storage & Auth';
  status: 'operational' | 'demo_mode' | 'configuration_required';
  provider: string;
  description: string;
  technicalDetails: string;
  credentialsRequired?: string;
}

export interface NewsPublisherProfile {
  id: string;
  organizationName: string;
  reporterName: string;
  pressCardNumber: string; // e.g. ZMC-BYO-2026-441
  officialEmail: string;
  editorialBeat: string;
  cityBureau: ZimbabweTown;
  isZmcAccredited: boolean;
  avatarUrl?: string;
  articlesPublishedCount: number;
  totalViews: number;
  joinedDate: string;
  role: 'editor' | 'correspondent' | 'bureau_chief';
}
