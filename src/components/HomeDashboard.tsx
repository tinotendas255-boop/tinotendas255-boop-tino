import React, { useState } from 'react';
import { RoadIncident, NewsStory, RouteOption, WeatherTravelAlert, UserProfile, ZimbabweTown, DriverType, UserRole } from '../types';
import { PRESET_ROUTES, NEWS_STORIES } from '../data/mockRoadData';
import {
  Search,
  Navigation,
  AlertTriangle,
  Newspaper,
  Plus,
  ShieldCheck,
  CloudRain,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Shield,
  Bus,
  Truck,
  Car,
  Scale,
  Fuel,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  PenTool,
  Radio,
  FileText,
  RefreshCw,
} from 'lucide-react';

import smartHighwayHero from '../assets/bulawayo_smart_highway.jpg';
import bulawayo3dMap from '../assets/bulawayo_3d_map.jpg';
import highwayPressPhoto from '../assets/highway_press_photo.jpg';
import { RoadAssistantChat } from './RoadAssistantChat';

interface HomeDashboardProps {
  userProfile: UserProfile;
  incidents: RoadIncident[];
  newsStories: NewsStory[];
  weatherAlerts: WeatherTravelAlert[];
  onNavigateTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onSelectIncident: (incident: RoadIncident) => void;
  onSelectHighwayOnMap: (highwayCode: string) => void;
  onOpenNewsStory: (story: NewsStory) => void;
  onOpenIntegrations: () => void;
  onOpenDriverLoginModal?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  incidents,
  newsStories,
  weatherAlerts,
  onNavigateTab,
  onOpenReportModal,
  onSelectIncident,
  onSelectHighwayOnMap,
  onOpenNewsStory,
  onOpenIntegrations,
  onOpenDriverLoginModal,
  onUpdateProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTownFilter, setSelectedTownFilter] = useState<ZimbabweTown>('Bulawayo');
  const [activeNewsTab, setActiveNewsTab] = useState<'tailored' | 'truck' | 'bus' | 'commuter' | 'all'>('tailored');

  const driverType: DriverType = userProfile.driverType || 'commuter';

  const DRIVER_PRESETS: Record<DriverType, { name: string; vehicle: string; fleet: string; role: UserRole; title: string }> = {
    truck: {
      name: 'Captain Blessing Moyo',
      vehicle: 'Freightliner Argosy 6x4 (34T Superlink)',
      fleet: 'Pioneer & Bakers Logistics',
      role: 'verified_driver',
      title: 'Heavy Freight Trucker',
    },
    bus: {
      name: 'Tendai Chiweshe',
      vehicle: 'Scania Marcopolo G7 (75-Seater Coach)',
      fleet: 'Extra City Luxury Coaches',
      role: 'transport_operator',
      title: 'Intercity Bus Operator',
    },
    commuter: {
      name: 'Tinotenda Sibanda',
      vehicle: 'Toyota Hilux GD-6 Raider 4x4',
      fleet: 'Private Family Motorist',
      role: 'citizen',
      title: 'Citizen Commuter',
    },
  };

  const handleQuickSwitchDriver = (type: DriverType) => {
    if (onUpdateProfile) {
      const preset = DRIVER_PRESETS[type];
      onUpdateProfile({
        ...userProfile,
        driverType: type,
        name: preset.name,
        vehicleModel: preset.vehicle,
        companyOrFleet: preset.fleet,
        role: preset.role,
      });
    }
  };

  // Driver Persona Specific Configuration
  const personaConfig = {
    truck: {
      badge: '🚚 HEAVY FREIGHT & LONG-HAUL LOGISTICS · CLASS 5',
      badgeClass: 'bg-amber-500/25 text-amber-300 border-amber-500/50',
      heroTitle: `Salibonani Captain ${userProfile.name}.`,
      heroSubtitle: `Commercial haulage telemetry, 30+ tonne gross axle regulations, live weighbridge clearance at Esigodini & Beatrice, and Trans-Limpopo freight routing.`,
      searchPlaceholder: `Search freight corridors (A4, A6, A1), weighbridge queues (Esigodini, Beatrice), or diesel staging stops...`,
      popularTags: ['A6 Gwanda Freight', 'Esigodini Weighbridge', 'Beatrice WIM Sensor', 'A4 Beitbridge Cargo', 'West Nicholson Staging'],
      vehicleTag: userProfile.vehicleModel || 'Freightliner Argosy 34T Superlink',
      fleetTag: userProfile.companyOrFleet || 'Commercial Haulage Fleet',
      statusLabel: 'COMMERCIAL RIG',
      icon: Truck,
      avatarBorder: 'border-amber-400',
      btnTheme: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    },
    bus: {
      badge: '🚌 INTERCITY COACH & TRANSIT OPERATIONS · CLASS 3',
      badgeClass: 'bg-blue-500/25 text-blue-300 border-blue-500/50',
      heroTitle: `Salibonani Driver ${userProfile.name}.`,
      heroSubtitle: `Live terminal dispatch bays (Renkini & Road Port), passenger manifest electronic clearance, coach express toll lanes, and speed governor enforcement alerts.`,
      searchPlaceholder: `Search coach routes (A5, A8), departure ranks (Renkini, Road Port), or VID safety checkpoints...`,
      popularTags: ['Renkini Terminal (BYO)', 'Road Port (HRE)', 'A5 Express Coach', 'A8 Victoria Falls', 'Dulivhadzimu Rank'],
      vehicleTag: userProfile.vehicleModel || 'Scania Marcopolo G7 75-Seater',
      fleetTag: userProfile.companyOrFleet || 'Intercity Coach Operator',
      statusLabel: 'PASSENGER FLEET',
      icon: Bus,
      avatarBorder: 'border-blue-400',
      btnTheme: 'bg-blue-600 hover:bg-blue-500 text-white',
    },
    commuter: {
      badge: '🚗 CITIZEN COMMUTER & PRIVATE MOTORIST · CLASS 1',
      badgeClass: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50',
      heroTitle: `Salibonani, ${userProfile.name}.`,
      heroSubtitle: `Urban traffic shortcuts, Ascot flyover & Luveve resurfacing updates, light vehicle toll fees ($4 / 110 ZiG), and emergency roadside assistance.`,
      searchPlaceholder: `Search Bulawayo corridors (A5, A8), Ascot flyover, Plumtree, or hazard keywords...`,
      popularTags: ['A6 Bulawayo - Gwanda', 'Ascot Flyover', 'Luveve Road Phase III', 'A5 Harare', 'Matopos Scenic Route'],
      vehicleTag: userProfile.vehicleModel || 'Toyota Hilux GD-6 Raider 4x4',
      fleetTag: userProfile.companyOrFleet || 'Private Motorist',
      statusLabel: 'VERIFIED MOTORIST',
      icon: Car,
      avatarBorder: 'border-emerald-400',
      btnTheme: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
  }[driverType];

  const PersonaIcon = personaConfig.icon;

  // Dynamic calculated metrics from available records
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const verifiedIncidents = incidents.filter((i) => i.status === 'verified');
  const unverifiedReports = incidents.filter((i) => i.status === 'unverified');

  // Saved routes
  const savedRoutes = PRESET_ROUTES.filter((r) => userProfile.savedRouteIds.includes(r.id));

  // Nearby incidents for selected town / base
  const nearbyIncidents = incidents.filter(
    (inc) =>
      inc.status !== 'resolved' &&
      (inc.town === selectedTownFilter ||
        inc.locationName.toLowerCase().includes(selectedTownFilter.toLowerCase()) ||
        inc.highway.toLowerCase().includes(selectedTownFilter.toLowerCase()))
  );

  // Filtered search results preview
  const searchResults = searchQuery.trim()
    ? incidents.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.highway.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Search Hero with Uploaded Smart Highway Picture */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white min-h-[380px] flex flex-col justify-between p-6 sm:p-8 bg-slate-950">
        {/* Background Smart Highway Image with Telemetry Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={smartHighwayHero}
            alt="Bulawayo Smart Highway Network"
            className="w-full h-full object-cover object-center filter brightness-65 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className={`px-2.5 py-1 rounded-md border font-mono text-[11px] font-bold backdrop-blur-sm ${personaConfig.badgeClass}`}>
              {personaConfig.badge}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300 font-sans normal-case text-xs">
              Home Base: <strong className="text-white">{userProfile.baseTown}</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {personaConfig.heroTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl leading-relaxed">
                {personaConfig.heroSubtitle}
              </p>
            </div>

            {/* Driver Profile Persona Card with Switch Button */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl flex-shrink-0 self-start sm:self-center space-y-2">
              <div className="flex items-center gap-3">
                <div className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 ${personaConfig.avatarBorder} shadow-md flex-shrink-0 bg-slate-950 flex items-center justify-center`}>
                  <img
                    src={smartHighwayHero}
                    alt={userProfile.name}
                    className="w-full h-full object-cover object-center opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                    <PersonaIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
                </div>
                <div className="text-left pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{userProfile.name}</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-bold">
                      {personaConfig.statusLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium truncate max-w-[190px]">
                    {personaConfig.fleetTag}
                  </div>
                  <div className="text-[10px] text-amber-300/90 font-mono truncate max-w-[190px]">
                    {personaConfig.vehicleTag}
                  </div>
                </div>
              </div>

              {/* 1-Click Persona Quick Switch Buttons */}
              <div className="pt-2 border-t border-white/15 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                  <span>Switch Landing Page & News:</span>
                  {onOpenDriverLoginModal && (
                    <button
                      type="button"
                      onClick={onOpenDriverLoginModal}
                      className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                    >
                      Login Modal &rarr;
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchDriver('truck')}
                    className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      driverType === 'truck'
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-white/50'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                    title="Switch to Heavy Freight & Long-Haul Truck Driver"
                  >
                    <Truck className="w-3 h-3" />
                    <span>Truck</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchDriver('bus')}
                    className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      driverType === 'bus'
                        ? 'bg-blue-600 text-white shadow-md ring-1 ring-white/50'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                    title="Switch to Intercity Coach & Bus Operator"
                  >
                    <Bus className="w-3 h-3" />
                    <span>Bus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchDriver('commuter')}
                    className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      driverType === 'commuter'
                        ? 'bg-emerald-600 text-white shadow-md ring-1 ring-white/50'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                    title="Switch to Citizen Commuter & Motorist"
                  >
                    <Car className="w-3 h-3" />
                    <span>Commuter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Search Bar */}
          <div className="relative pt-1 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-300 absolute left-3.5" />
              <input
                type="text"
                placeholder={personaConfig.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/80 backdrop-blur-md border border-white/30 rounded-xl text-sm font-medium text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-lg"
              />
            </div>

            {/* Quick search suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2.5 text-xs text-slate-300">
              <span className="text-[11px] font-semibold text-white">Popular Searches:</span>
              {personaConfig.popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-0.5 bg-white/15 hover:bg-white/25 text-white rounded text-[11px] font-medium transition-colors cursor-pointer backdrop-blur-sm border border-white/10"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="mt-2 bg-white text-slate-900 rounded-xl p-3 shadow-xl border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Matching Incidents & Roads ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div className="text-slate-500 py-2">No matching hazards or roads found. Try searching by highway code (e.g. A4, A5).</div>
                ) : (
                  searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectIncident(item)}
                      className="p-2 hover:bg-slate-50 rounded cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-slate-500 text-[11px]">{item.highway} · {item.locationName}</div>
                      </div>
                      <span className="text-emerald-700 font-semibold text-[11px]">View &rarr;</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => onNavigateTab('routes')}
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between"
            >
              <Navigation className="w-4 h-4 text-emerald-400 mb-1.5" />
              <span className="text-xs font-bold text-white leading-tight">Check Corridor</span>
              <span className="text-[10px] text-slate-400">Tolls & distances</span>
            </button>

            <button
              onClick={() => onNavigateTab('map')}
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between"
            >
              <Compass className="w-4 h-4 text-blue-400 mb-1.5" />
              <span className="text-xs font-bold text-white leading-tight">Explore Map</span>
              <span className="text-[10px] text-slate-400">Live corridor pins</span>
            </button>

            <button
              onClick={() => onNavigateTab('news')}
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between"
            >
              <Newspaper className="w-4 h-4 text-amber-400 mb-1.5" />
              <span className="text-xs font-bold text-white leading-tight">Road Gazette</span>
              <span className="text-[10px] text-slate-400">Driver advisories</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between shadow-sm ${personaConfig.btnTheme}`}
            >
              <Plus className="w-4 h-4 mb-1.5" />
              <span className="text-xs font-bold leading-tight">Report Incident</span>
              <span className="text-[10px] opacity-80">Alert other drivers</span>
            </button>
          </div>
        </div>
      </div>

      {/* DIFFERENTIATED DRIVER TELEMETRY BAR (Specific to Truck, Bus, or Commuter) */}
      {driverType === 'truck' ? (
        /* TRUCK DRIVER TELEMETRY */
        <div className="bg-amber-950 text-white rounded-2xl p-5 border border-amber-800/80 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-800/60 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-200 uppercase tracking-wide text-xs">
                Heavy Freight & Weighbridge Live Telemetry
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-amber-300 font-mono">
              <span>Class 5 Haulage Tariffs Active</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">✓ Automated WIM Sensors Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-amber-900/40 rounded-xl border border-amber-700/50 space-y-1">
              <div className="text-[10px] font-mono text-amber-300/80 uppercase">Esigodini Weighbridge (A6)</div>
              <div className="text-sm font-bold text-white">Normal Flow · 2 Rigs Ahead</div>
              <div className="text-[11px] text-amber-200/90">&lt; 4 min automated axle scan</div>
            </div>

            <div className="p-3 bg-amber-900/40 rounded-xl border border-amber-700/50 space-y-1">
              <div className="text-[10px] font-mono text-amber-300/80 uppercase">Commercial Toll Rate</div>
              <div className="text-sm font-bold text-amber-400 font-mono">$20.00 USD (Class 5)</div>
              <div className="text-[11px] text-amber-200/90">$15.00 for 3-Axle Heavy Rigid</div>
            </div>

            <div className="p-3 bg-amber-900/40 rounded-xl border border-amber-700/50 space-y-1">
              <div className="text-[10px] font-mono text-amber-300/80 uppercase">Bulk Diesel 50 Staging</div>
              <div className="text-sm font-bold text-white">Rutenga & West Nicholson</div>
              <div className="text-[11px] text-amber-200/90">24/7 High-Flow Commercial Bunkering</div>
            </div>

            <div className="p-3 bg-amber-900/40 rounded-xl border border-amber-700/50 space-y-1">
              <div className="text-[10px] font-mono text-amber-300/80 uppercase">Beitbridge Freight Port</div>
              <div className="text-sm font-bold text-emerald-400">45 Min Cargo Processing</div>
              <div className="text-[11px] text-amber-200/90">Electronic Manifest Pre-Clearance</div>
            </div>
          </div>
        </div>
      ) : driverType === 'bus' ? (
        /* BUS OPERATOR TELEMETRY */
        <div className="bg-blue-950 text-white rounded-2xl p-5 border border-blue-800/80 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-800/60 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-blue-200 uppercase tracking-wide text-xs">
                Intercity Coach & Terminal Dispatch Operations
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-blue-300 font-mono">
              <span>Class 3 Coach Tariffs Active</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">✓ Pre-Paid E-Tag Boom Lanes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-blue-900/40 rounded-xl border border-blue-700/50 space-y-1">
              <div className="text-[10px] font-mono text-blue-300/80 uppercase">Renkini Terminal (Bulawayo)</div>
              <div className="text-sm font-bold text-white">High Morning Departure Volume</div>
              <div className="text-[11px] text-blue-200/90">Matabeleland South bays clear</div>
            </div>

            <div className="p-3 bg-blue-900/40 rounded-xl border border-blue-700/50 space-y-1">
              <div className="text-[10px] font-mono text-blue-300/80 uppercase">Coach Bus Toll Fee</div>
              <div className="text-sm font-bold text-blue-400 font-mono">$10.00 USD (Class 3)</div>
              <div className="text-[11px] text-blue-200/90">Dedicated Bus Rapid Lane</div>
            </div>

            <div className="p-3 bg-blue-900/40 rounded-xl border border-blue-700/50 space-y-1">
              <div className="text-[10px] font-mono text-blue-300/80 uppercase">VID Highway Inspections</div>
              <div className="text-sm font-bold text-amber-300">A5 Tree Top Checkpoint</div>
              <div className="text-[11px] text-blue-200/90">Speed Governor (80 km/h cap) Check</div>
            </div>

            <div className="p-3 bg-blue-900/40 rounded-xl border border-blue-700/50 space-y-1">
              <div className="text-[10px] font-mono text-blue-300/80 uppercase">Road Port (Harare)</div>
              <div className="text-sm font-bold text-white">Cross-Border Platforms Active</div>
              <div className="text-[11px] text-blue-200/90">Johannesburg coaches on schedule</div>
            </div>
          </div>
        </div>
      ) : (
        /* CITIZEN COMMUTER TELEMETRY */
        <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800/80 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/60 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-200 uppercase tracking-wide text-xs">
                Citizen Commuter & Family Travel Telemetry
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-emerald-300 font-mono">
              <span>Class 1 Light Motor Vehicles</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">✓ Dual Currency (USD / ZiG)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-700/50 space-y-1">
              <div className="text-[10px] font-mono text-emerald-300/80 uppercase">Light Vehicle Toll Fee</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">$4.00 USD / 110 ZiG</div>
              <div className="text-[11px] text-emerald-200/90">Automated fast boom lanes</div>
            </div>

            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-700/50 space-y-1">
              <div className="text-[10px] font-mono text-emerald-300/80 uppercase">Urban Road Resurfacing</div>
              <div className="text-sm font-bold text-white">Ascot & Luveve Phase III Open</div>
              <div className="text-[11px] text-emerald-200/90">Zero detour delays in Bulawayo</div>
            </div>

            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-700/50 space-y-1">
              <div className="text-[10px] font-mono text-emerald-300/80 uppercase">Local Driving Weather</div>
              <div className="text-sm font-bold text-white">High Visibility · Dry Asphalt</div>
              <div className="text-[11px] text-emerald-200/90">Safety Adhesion Index 94%</div>
            </div>

            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-700/50 space-y-1">
              <div className="text-[10px] font-mono text-emerald-300/80 uppercase">Weekend Scenic Trips</div>
              <div className="text-sm font-bold text-white">A6 Gwanda & Matopos Route</div>
              <div className="text-[11px] text-emerald-200/90">Clear highway flow, zero roadblocks</div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Calculated Statistics Bar (Calculated from available records, not hardcoded) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <div className="text-slate-500 text-[11px]">Active Hazards</div>
            <div className="text-lg font-extrabold text-slate-900 font-mono">{activeIncidents.length}</div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <div className="text-slate-500 text-[11px]">Safety Desk Verified</div>
            <div className="text-lg font-extrabold text-emerald-700 font-mono">{verifiedIncidents.length}</div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <div className="text-slate-500 text-[11px]">Community Pending</div>
            <div className="text-lg font-extrabold text-amber-700 font-mono">{unverifiedReports.length}</div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <div className="text-slate-500 text-[11px]">Weather Alerts</div>
            <div className="text-lg font-extrabold text-blue-700 font-mono">{weatherAlerts.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated just now</span>
          <span>·</span>
          <button
            onClick={onOpenIntegrations}
            className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            Live & Calibrated Feeds
          </button>
        </div>
      </div>

      {/* AI Road Assistant: Instant Route & Roadblock Analysis */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              RoadLink AI Route & Incident Assistant
            </h2>
          </div>
          <span className="text-xs text-slate-500">Ask about Gwanda, Harare, roadblocks & tolls</span>
        </div>
        <RoadAssistantChat
          userProfile={userProfile}
          incidents={incidents}
          weatherAlerts={weatherAlerts}
          onNavigateTab={onNavigateTab}
          onSelectHighway={onSelectHighwayOnMap}
        />
      </div>

      {/* Realistic Bulawayo Digital Twin Corridor Banner with Dashboard Picture */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white relative">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
          <img
            src={smartHighwayHero}
            alt="Bulawayo Smart Highway Network"
            className="w-full h-full object-cover object-center filter contrast-115 brightness-85 group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Floating Telemetry Tags on 3D Map */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-900/90 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              GOOGLE MAPS & 3D REALISTIC CORRIDORS · BULAWAYO
            </span>
            <span className="px-2.5 py-1 bg-slate-900/80 text-white text-xs font-mono rounded-lg border border-white/20 backdrop-blur-md hidden sm:inline-block">
              E28°35' / S20°09'
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
                City of Kings & Queens Freight Arterials
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Bulawayo Highway Network & Dual Carriageways
              </h3>
              <p className="text-xs text-slate-300 max-w-xl line-clamp-2 mt-0.5">
                Authentic Google Maps navigation with live traffic, satellite hybrid imagery, 3D realistic tilt, and real-time hazard markers on A6 (Gwanda), A5 (Harare), A8 (Victoria Falls), and A7 (Plumtree).
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('map')}
              className="px-4 py-2 bg-[#1a73e8] hover:bg-blue-600 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span>Open Google Maps (3D View)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Severe Weather Warnings & Breaking Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weather Travel Warnings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-600" />
              SADC Seasonal Weather & River Warnings
            </h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              DEMO DATA FEED
            </span>
          </div>

          <div className="space-y-2.5">
            {weatherAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{alert.title}</span>
                  <span className="text-[10px] text-slate-500">{alert.issuedAt}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{alert.advisoryText}</p>
                <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>Region: <strong className="text-slate-700">{alert.region}</strong></span>
                  <span>Source: {alert.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breaking & Urgent Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Urgent Highway Alerts & Disruptions
            </h3>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              View on Map &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {activeIncidents.slice(0, 2).map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className="p-3 bg-red-50/50 border border-red-200 rounded-lg text-xs cursor-pointer hover:border-red-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-red-900">{inc.title}</span>
                  <span className="text-[10px] text-slate-500">{inc.timestamp}</span>
                </div>
                <div className="text-slate-700 text-[11px] mb-1.5">{inc.highway} · {inc.locationName}</div>
                {inc.detourAdvice && (
                  <div className="text-[11px] text-red-800 font-medium">
                    Caution: {inc.detourAdvice}
                  </div>
                )}
                <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between">
                  <span>{inc.status === 'verified' ? '✓ Verified by Safety Desk' : '⏳ Community Report'}</span>
                  <span className="text-emerald-700 font-semibold">View details &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE HIGHWAY GAZETTE · TODAY'S NEWSPAPER & ROAD PRESS DASHBOARD */}
      {(() => {
        const allStories: NewsStory[] = newsStories && newsStories.length > 0 ? newsStories : NEWS_STORIES;
        const effectiveNewsPersona: DriverType =
          activeNewsTab === 'all'
            ? driverType
            : activeNewsTab === 'tailored'
            ? driverType
            : (activeNewsTab as DriverType);

        let gazetteEditionTitle: string;
        let gazetteBadge: string;
        let gazetteLeadStory: NewsStory;
        let gazetteWire1: NewsStory;
        let gazetteWire2: NewsStory;

        if (effectiveNewsPersona === 'truck') {
          gazetteEditionTitle = 'COMMERCIAL FREIGHT & HAULAGE DISPATCH';
          gazetteBadge = 'FRONT PAGE LEAD · HEAVY FREIGHT CORRIDOR';
          gazetteLeadStory =
            allStories.find((s: NewsStory) => s.id === 'news-truck-weighbridge') ||
            allStories.find((s: NewsStory) => s.targetAudience?.includes('truck')) ||
            allStories[0];
          gazetteWire1 =
            allStories.find((s: NewsStory) => s.id === 'news-truck-diesel') ||
            allStories.filter((s: NewsStory) => s.id !== gazetteLeadStory?.id)[0] ||
            allStories[1];
          gazetteWire2 =
            allStories.find((s: NewsStory) => s.id === 'news-102') ||
            allStories.filter((s: NewsStory) => s.id !== gazetteLeadStory?.id && s.id !== gazetteWire1?.id)[0] ||
            allStories[2];
        } else if (effectiveNewsPersona === 'bus') {
          gazetteEditionTitle = 'INTERCITY COACH & TRANSIT OPERATIONS DISPATCH';
          gazetteBadge = 'FRONT PAGE LEAD · PASSENGER TRANSIT FLEET';
          gazetteLeadStory =
            allStories.find((s: NewsStory) => s.id === 'news-bus-ranks') ||
            allStories.find((s: NewsStory) => s.targetAudience?.includes('bus')) ||
            allStories[0];
          gazetteWire1 =
            allStories.find((s: NewsStory) => s.id === 'news-bus-safety') ||
            allStories.filter((s: NewsStory) => s.id !== gazetteLeadStory?.id)[0] ||
            allStories[1];
          gazetteWire2 =
            allStories.find((s: NewsStory) => s.id === 'news-101') ||
            allStories.filter((s: NewsStory) => s.id !== gazetteLeadStory?.id && s.id !== gazetteWire1?.id)[0] ||
            allStories[2];
        } else {
          gazetteEditionTitle = 'METROPOLITAN COMMUTER & ROAD SAFETY DISPATCH';
          gazetteBadge = 'FRONT PAGE LEAD · A6 CORRIDOR & URBAN METRO';
          gazetteLeadStory =
            allStories.find((s: NewsStory) => s.id === 'news-lead-a6') ||
            allStories.find((s: NewsStory) => s.targetAudience?.includes('commuter')) ||
            allStories[0];
          gazetteWire1 =
            allStories.find((s: NewsStory) => s.id === 'news-byo-ascot') ||
            allStories.filter((s: NewsStory) => s.id !== gazetteLeadStory?.id)[0] ||
            allStories[1];
          gazetteWire2 =
            allStories.find((s: NewsStory) => s.id === 'news-103') ||
            allStories.filter((s: NewsStory) => s.id !== gazetteLeadStory?.id && s.id !== gazetteWire1?.id)[0] ||
            allStories[2];
        }

        // Corridors tailored to driver
        const prioritizedRoutes =
          driverType === 'truck'
            ? [
                PRESET_ROUTES.find((r) => r.id === 'route-hrebby') || PRESET_ROUTES[0],
                PRESET_ROUTES.find((r) => r.id === 'route-byogwa') || PRESET_ROUTES[1],
                PRESET_ROUTES.find((r) => r.id === 'route-hrechi') || PRESET_ROUTES[2],
              ]
            : driverType === 'bus'
            ? [
                PRESET_ROUTES.find((r) => r.id === 'route-hrebyo') || PRESET_ROUTES[1],
                PRESET_ROUTES.find((r) => r.id === 'route-byovic') || PRESET_ROUTES[2],
                PRESET_ROUTES.find((r) => r.id === 'route-hremut') || PRESET_ROUTES[3] || PRESET_ROUTES[0],
              ]
            : [
                PRESET_ROUTES.find((r) => r.id === 'route-byogwa') || PRESET_ROUTES[0],
                PRESET_ROUTES.find((r) => r.id === 'route-hrebyo') || PRESET_ROUTES[1],
                PRESET_ROUTES.find((r) => r.id === 'route-hremut') || PRESET_ROUTES[2],
              ];

        return (
          <>
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              {/* Newspaper Top Gazette Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-300 text-xs font-mono text-slate-600">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif font-black text-slate-950 text-sm tracking-tight uppercase flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-emerald-800" />
                    The Highway Gazette
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-slate-900">{gazetteEditionTitle}</span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="hidden sm:inline">MONDAY, OCT 19, 2026</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-800 font-semibold hidden md:inline">
                    {driverType === 'truck'
                      ? '✓ Weighbridges Online: Esigodini & Beatrice'
                      : driverType === 'bus'
                      ? '✓ Renkini & Road Port Bays Flowing'
                      : '✓ A6 Gwanda: Clear & Flowing'}
                  </span>
                  <button
                    onClick={() => onNavigateTab('publisher')}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    title="Media Houses & Journalists: Sign up & upload road stories"
                  >
                    <PenTool className="w-3.5 h-3.5 text-amber-900" />
                    <span>Press Portal</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('news')}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Read Gazette</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* News Audience Switcher Bar */}
              <div className="flex items-center gap-2 flex-wrap text-xs pb-1">
                <span className="font-mono text-slate-500 text-[11px] font-bold">News Wire Filter:</span>
                <button
                  type="button"
                  onClick={() => setActiveNewsTab('tailored')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeNewsTab === 'tailored'
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    My Vehicle Wire ({driverType === 'truck' ? '🚚 Truck' : driverType === 'bus' ? '🚌 Coach' : '🚗 Commuter'})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNewsTab('truck')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeNewsTab === 'truck'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  <span>Heavy Freight Wire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNewsTab('bus')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeNewsTab === 'bus'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Bus className="w-3 h-3" />
                  <span>Coach & Transit Wire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNewsTab('commuter')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeNewsTab === 'commuter'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Car className="w-3 h-3" />
                  <span>Commuter Wire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNewsTab('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ml-auto ${
                    activeNewsTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  All Dispatches ({allStories.length})
                </button>
              </div>

              {/* Newspaper Front Page Lead Spotlight */}
              {gazetteLeadStory && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center pt-2">
                  {/* Lead Photo */}
                  <div
                    onClick={() => onNavigateTab('news')}
                    className="lg:col-span-5 relative rounded-xl overflow-hidden border border-slate-300 shadow-sm cursor-pointer group"
                  >
                    <img
                      src={gazetteLeadStory.imageUrl || highwayPressPhoto}
                      alt={gazetteLeadStory.title}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-white/20">
                      {gazetteBadge}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-sans p-2 rounded border border-white/10 line-clamp-2">
                      {gazetteLeadStory.summary}
                    </div>
                  </div>

                  {/* Lead Headline & Teaser */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
                        {gazetteLeadStory.categoryLabel || 'HIGHWAY PRESS HEADLINE DISPATCH'}
                      </span>
                      {gazetteLeadStory.relatedHighway && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold text-[10px] rounded border border-slate-200">
                          {gazetteLeadStory.relatedHighway}
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => onNavigateTab('news')}
                      className="text-xl sm:text-2xl font-serif font-black text-slate-950 tracking-tight leading-snug hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      {gazetteLeadStory.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed line-clamp-3">
                      {gazetteLeadStory.summary}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="font-mono text-slate-500 text-[11px]">
                        By {gazetteLeadStory.author} ({gazetteLeadStory.source}) · {gazetteLeadStory.publishedAt} · {gazetteLeadStory.readTimeMinutes} min read
                      </span>
                      <button
                        onClick={() => onNavigateTab('news')}
                        className="text-xs font-serif font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer flex items-center gap-1"
                      >
                        Read Full Dispatch &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2-Item Quick Wire Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                {gazetteWire1 && (
                  <div
                    onClick={() => onNavigateTab('news')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="font-bold text-emerald-800">{gazetteWire1.categoryLabel || 'CORRIDOR TELEMETRY'}</span>
                      <span>{gazetteWire1.publishedAt}</span>
                    </div>
                    <div className="font-serif font-bold text-slate-900 line-clamp-1">
                      {gazetteWire1.title}
                    </div>
                    <div className="text-[11px] font-serif text-slate-600 line-clamp-2">
                      {gazetteWire1.summary}
                    </div>
                  </div>
                )}

                {gazetteWire2 && (
                  <div
                    onClick={() => onNavigateTab('news')}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="font-bold text-amber-800">{gazetteWire2.categoryLabel || 'HIGHWAY WIRE'}</span>
                      <span>{gazetteWire2.publishedAt}</span>
                    </div>
                    <div className="font-serif font-bold text-slate-900 line-clamp-1">
                      {gazetteWire2.title}
                    </div>
                    <div className="text-[11px] font-serif text-slate-600 line-clamp-2">
                      {gazetteWire2.summary}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Frequently Accessed / Saved Routes Tailored to Driver Type */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                    Recommended Corridors for {driverType === 'truck' ? 'Heavy Freight Hauliers' : driverType === 'bus' ? 'Intercity Passenger Coaches' : 'Citizen Commuters'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live toll gate classifications, transit turnaround times, and corridor safety indices.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('routes')}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  All Corridors & Tolls &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prioritizedRoutes.map((route) => {
                  const hazardsOnRoute = incidents.filter(
                    (i) => i.highway.toLowerCase().includes(route.highwayCode.toLowerCase()) && i.status !== 'resolved'
                  );
                  const tollCost =
                    driverType === 'truck'
                      ? route.tollsCostUsd.haulage
                      : driverType === 'bus'
                      ? route.tollsCostUsd.bus
                      : route.tollsCostUsd.lightVehicle;

                  const tollClassTitle =
                    driverType === 'truck'
                      ? 'Class 5 Heavy Haulage'
                      : driverType === 'bus'
                      ? 'Class 3 Coach / Bus'
                      : 'Class 1 Light Vehicle';

                  return (
                    <div
                      key={route.id}
                      onClick={() => {
                        onSelectHighwayOnMap(route.highwayCode);
                        onNavigateTab('routes');
                      }}
                      className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer bg-slate-50/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="font-bold text-emerald-800 font-mono">{route.highwayCode}</span>
                          <span>{route.tollCount} ZINARA Gates</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">
                          {route.origin} &rarr; {route.destination}
                        </h4>
                        <div className="text-xs text-slate-600 space-y-1">
                          <div>
                            Distance: <strong className="font-mono text-slate-900">{route.distanceKm} km</strong> (~{Math.floor(route.estMinutes / 60)}h {route.estMinutes % 60}m)
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{tollClassTitle} Toll:</span>
                            <strong className="font-mono text-slate-900">${tollCost} USD</strong>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-xs">
                        <span className={`text-[11px] font-semibold ${
                          hazardsOnRoute.length > 0 ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {hazardsOnRoute.length > 0
                            ? `${hazardsOnRoute.length} active hazard${hazardsOnRoute.length > 1 ? 's' : ''}`
                            : '✓ Normal flow'}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1 font-medium">
                          Itinerary <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}

      {/* Nearby Incidents & Community Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nearby Incidents Column (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Incidents in & around {selectedTownFilter}
              </h3>
              <p className="text-xs text-slate-500">Filter regional reports near your current location or route hub.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Location:</span>
              <select
                value={selectedTownFilter}
                onChange={(e) => setSelectedTownFilter(e.target.value as ZimbabweTown)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Harare">Harare</option>
                <option value="Bulawayo">Bulawayo</option>
                <option value="Beitbridge">Beitbridge</option>
                <option value="Mutare">Mutare</option>
                <option value="Gweru">Gweru</option>
                <option value="Masvingo">Masvingo</option>
                <option value="Chinhoyi">Chinhoyi</option>
                <option value="Victoria Falls">Victoria Falls</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {nearbyIncidents.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No active disruptions currently reported in the immediate {selectedTownFilter} sector.
              </div>
            ) : (
              nearbyIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className="p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] mb-1">
                      <span className="font-bold text-slate-800">{incident.highway}</span>
                      <span>·</span>
                      <span>{incident.locationName}</span>
                      <span>·</span>
                      <span className="capitalize">{incident.timestamp}</span>
                    </div>
                    <div className="font-bold text-slate-900">{incident.title}</div>
                    <div className="text-slate-600 text-[11px] line-clamp-1 mt-0.5">{incident.description}</div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 text-[11px]">
                    <span className={`font-semibold uppercase ${
                      incident.severity === 'critical' ? 'text-red-700' : incident.severity === 'warning' ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {incident.severity}
                    </span>
                    <button className="px-2.5 py-1 bg-slate-900 text-white rounded font-medium">
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Public Transport Terminal Status & News Preview (1 Col) */}
        <div className="space-y-4">
          {/* Major Terminal Highlights */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bus className="w-4 h-4 text-emerald-600" />
              Main Public Transport Ranks
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-900">Road Port (Harare CBD)</div>
                <div className="text-slate-600 text-[11px]">Intercity & cross-border coach departures operating normally.</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-900">Renkini Terminal (Bulawayo)</div>
                <div className="text-slate-600 text-[11px]">Matabeleland routes active; morning buses departing on schedule.</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-900">Mbare Musika (Harare)</div>
                <div className="text-slate-600 text-[11px]">High passenger volume on eastern rural routes; police patrol on site.</div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('operators')}
              className="w-full py-1.5 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              Browse Transport Operators &rarr;
            </button>
          </div>

          {/* Top News Teaser */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-slate-700" />
                Latest Road News
              </h3>
              <button
                onClick={() => onNavigateTab('news')}
                className="text-[11px] text-emerald-700 font-semibold cursor-pointer"
              >
                All News &rarr;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {newsStories.slice(0, 2).map((story) => (
                <div
                  key={story.id}
                  onClick={() => onOpenNewsStory(story)}
                  className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="text-[10px] text-slate-500 mb-0.5">{story.categoryLabel} · {story.publishedAt}</div>
                  <div className="font-bold text-slate-900 line-clamp-2 leading-snug">{story.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
