import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RoadIncident, IncidentSeverity, IncidentType, RoutePreviewData } from '../types';
import { ROUTE_PREVIEWS, detectRoutePreviewFromQuery } from '../utils/aiRoadKnowledge';
import {
  Search,
  Navigation,
  Compass,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Minimize2,
  Filter,
  Eye,
  Sliders,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shield,
  Activity,
  Car,
  Fuel,
  Info,
  X,
  Coins,
  ArrowRight
} from 'lucide-react';

interface RoadMapProps {
  incidents: RoadIncident[];
  onSelectIncident: (incident: RoadIncident) => void;
  onRequestReportAtCoord?: (coords: [number, number]) => void;
  selectedHighwayFilter?: string;
  activeRoute?: RoutePreviewData | null;
  onClearActiveRoute?: () => void;
  onNavigateToNews?: (storyId?: string) => void;
  onAskAssistant?: (query: string) => void;
}

type GoogleMapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

const BULAWAYO_CENTER: [number, number] = [-20.1550, 28.5833]; // Bulawayo City Hall / CBD

const ZIM_TOWNS = [
  { name: 'Bulawayo (Default)', coords: [-20.1550, 28.5833] as [number, number], zoom: 13 },
  { name: 'Gwanda (A6 Link)', coords: [-20.9333, 29.0000] as [number, number], zoom: 13 },
  { name: 'National Corridors', coords: [-19.0154, 29.8549] as [number, number], zoom: 7 },
  { name: 'Harare (A5 End)', coords: [-17.8252, 31.0335] as [number, number], zoom: 12 },
  { name: 'Victoria Falls (A8)', coords: [-17.9244, 25.8567] as [number, number], zoom: 12 },
  { name: 'Plumtree Border (A7)', coords: [-20.4800, 27.8200] as [number, number], zoom: 13 },
  { name: 'Beitbridge Border (A6)', coords: [-22.2167, 29.9833] as [number, number], zoom: 13 },
  { name: 'Gweru (Midlands)', coords: [-19.4500, 29.8167] as [number, number], zoom: 13 },
];

export const RoadMap: React.FC<RoadMapProps> = ({
  incidents,
  onSelectIncident,
  onRequestReportAtCoord,
  selectedHighwayFilter = 'all',
  activeRoute = null,
  onClearActiveRoute,
  onNavigateToNews,
  onAskAssistant,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const trafficLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerRef = useRef<L.LayerGroup | null>(null);
  const activeRouteLayerRef = useRef<L.LayerGroup | null>(null);

  // Active Route Navigation state (just like Google Maps)
  const [displayedRoute, setDisplayedRoute] = useState<RoutePreviewData | null>(activeRoute);
  const [showRouteSteps, setShowRouteSteps] = useState<boolean>(false);

  // Google Maps Layer & View Settings (Defaults to normal view with Satellite Imagery)
  const [mapType, setMapType] = useState<GoogleMapType>('hybrid');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [is3dRealisticTilt, setIs3dRealisticTilt] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTown, setSelectedTown] = useState<string>('Bulawayo');
  const [highwayFilter, setHighwayFilter] = useState<string>(selectedHighwayFilter);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [showLayersDropdown, setShowLayersDropdown] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string>('');

  // Sync displayedRoute when prop updates
  useEffect(() => {
    if (activeRoute) {
      setDisplayedRoute(activeRoute);
    }
  }, [activeRoute]);

  // Update highway filter when prop changes
  useEffect(() => {
    if (selectedHighwayFilter && selectedHighwayFilter !== highwayFilter) {
      setHighwayFilter(selectedHighwayFilter);
    }
  }, [selectedHighwayFilter]);

  // Construct Google Maps tile URL based on chosen mode
  const getGoogleTileUrl = (type: GoogleMapType, labels: boolean) => {
    switch (type) {
      case 'satellite':
        return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      case 'hybrid':
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'terrain':
        return 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      case 'roadmap':
      default:
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
  };

  // Initialize Map with Google Maps look & feel
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered directly on Bulawayo, Zimbabwe
    const map = L.map(mapContainerRef.current, {
      center: BULAWAYO_CENTER,
      zoom: 13,
      minZoom: 4,
      maxZoom: 20,
      zoomControl: false, // We use authentic Google Maps zoom controls
      attributionControl: false,
    });

    // Google Maps base tile
    const googleTile = L.tileLayer(getGoogleTileUrl(mapType, showLabels), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    tileLayerRef.current = googleTile;

    // Live Google Traffic tile layer overlay
    if (showTraffic) {
      const traffic = L.tileLayer('https://mt1.google.com/vt/lyrs=h,traffic&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        opacity: 0.85,
      }).addTo(map);
      trafficLayerRef.current = traffic;
    }

    const corridorsGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);

    corridorsLayerRef.current = corridorsGroup;
    markersLayerRef.current = markersGroup;
    activeRouteLayerRef.current = routeGroup;
    mapInstanceRef.current = map;

    // Click map to report incident at coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (onRequestReportAtCoord) {
        onRequestReportAtCoord([lat, lng]);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Map Type switch (Roadmap, Satellite, Hybrid, Terrain)
  const handleMapTypeChange = (newType: GoogleMapType) => {
    setMapType(newType);
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTile = L.tileLayer(getGoogleTileUrl(newType, showLabels), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;

    // Keep traffic on top if enabled
    if (showTraffic && trafficLayerRef.current) {
      trafficLayerRef.current.bringToFront();
    }
  };

  // Toggle Traffic Layer
  const handleToggleTraffic = () => {
    const next = !showTraffic;
    setShowTraffic(next);
    if (!mapInstanceRef.current) return;

    if (next) {
      if (!trafficLayerRef.current) {
        const traffic = L.tileLayer('https://mt1.google.com/vt/lyrs=h,traffic&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          opacity: 0.85,
        }).addTo(mapInstanceRef.current);
        trafficLayerRef.current = traffic;
      } else {
        trafficLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (trafficLayerRef.current) {
        mapInstanceRef.current.removeLayer(trafficLayerRef.current);
      }
    }
  };

  // Render Zimbabwe Highway Corridors with Google-style route lines
  useEffect(() => {
    if (!corridorsLayerRef.current) return;
    corridorsLayerRef.current.clearLayers();

    const corridors = [
      {
        id: 'A6',
        name: 'Gwanda Road (A6 Corridor) — Bulawayo to Gwanda & Beitbridge',
        status: 'CLEAR · No Roadblocks Reported',
        color: '#1a73e8', // Google Maps route blue
        coords: [
          [-20.1550, 28.5833], // Bulawayo CBD
          [-20.2100, 28.6900], // Kensington
          [-20.2900, 28.9300], // Esigodini (Toll Plaza)
          [-20.5800, 28.9800], // Mbalabala
          [-20.9333, 29.0000], // Gwanda
          [-21.0667, 29.3667], // West Nicholson
          [-22.2167, 29.9833], // Beitbridge Border
        ],
      },
      {
        id: 'A5',
        name: 'Harare Road (A5 Dual Carriageway) — Bulawayo to Gweru & Harare',
        status: 'Resurfacing near Ascot · Flowing Smoothly',
        color: '#34a853', // Google green
        coords: [
          [-20.1550, 28.5833], // Bulawayo CBD
          [-20.1480, 28.5910], // Ascot Overpass
          [-19.9800, 28.8200], // Tree Top Toll Plaza
          [-19.4500, 29.8167], // Gweru
          [-18.9281, 29.8149], // Kwekwe
          [-18.3333, 29.9167], // Kadoma
          [-18.1302, 30.1407], // Chegutu
          [-17.8252, 31.0335], // Harare
        ],
      },
      {
        id: 'A8',
        name: 'Victoria Falls Road (A8 Corridor) — Bulawayo to Vic Falls',
        status: 'Wildlife Warning near Insuza',
        color: '#f9ab00', // Google warning amber
        coords: [
          [-20.1550, 28.5833], // Bulawayo CBD
          [-19.7833, 28.2500], // Insuza Toll Plaza
          [-18.9315, 27.8070], // Lupane
          [-18.3644, 26.5983], // Hwange
          [-17.9244, 25.8567], // Victoria Falls
        ],
      },
      {
        id: 'A7',
        name: 'Plumtree Road (A7 Corridor) — Bulawayo to Plumtree & Botswana',
        status: 'Clear · Border queues under 15m',
        color: '#9334e8', // Purple
        coords: [
          [-20.1550, 28.5833], // Bulawayo CBD
          [-20.3200, 28.2500], // Figtree Toll Plaza
          [-20.4800, 27.8200], // Plumtree Border
        ],
      },
    ];

    corridors.forEach((corridor) => {
      // Glow line underneath
      L.polyline(corridor.coords as [number, number][], {
        color: corridor.color,
        weight: 7,
        opacity: 0.35,
        lineCap: 'round',
      }).addTo(corridorsLayerRef.current!);

      // Main route line (Google navigation style)
      const line = L.polyline(corridor.coords as [number, number][], {
        color: corridor.color,
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
      });

      line.bindTooltip(`<strong>${corridor.name}</strong><br/><span style="color:#10b981;font-weight:bold;">${corridor.status}</span>`, {
        sticky: true,
        className: 'google-maps-tooltip',
      });

      line.addTo(corridorsLayerRef.current!);
    });
  }, []);

  // Render Active Route with Google-Maps navigation line & pins
  useEffect(() => {
    if (!activeRouteLayerRef.current || !mapInstanceRef.current) return;
    const layer = activeRouteLayerRef.current;
    layer.clearLayers();

    if (!displayedRoute) return;

    // 1. Google Maps route casing (dark blue border)
    L.polyline(displayedRoute.waypoints, {
      color: '#1557b0',
      weight: 10,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(layer);

    // 2. Google Maps royal blue route line
    L.polyline(displayedRoute.waypoints, {
      color: '#1a73e8',
      weight: 6,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(layer);

    // 3. Origin Marker A (Green pin)
    const startCoord = displayedRoute.waypoints[0];
    if (startCoord) {
      const originIcon = L.divIcon({
        className: 'google-nav-origin-pin',
        html: `
          <div style="width: 34px; height: 34px; background: #34a853; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 15px; font-family: Roboto, sans-serif;">
            A
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker(startCoord, { icon: originIcon })
        .bindTooltip(`<strong>Start:</strong> ${displayedRoute.origin}`, { permanent: false, direction: 'top' })
        .addTo(layer);
    }

    // 4. Destination Marker B (Red Google pin)
    const destCoord = displayedRoute.waypoints[displayedRoute.waypoints.length - 1];
    if (destCoord) {
      const destIcon = L.divIcon({
        className: 'google-nav-dest-pin',
        html: `
          <div style="position: relative; width: 36px; height: 46px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">
            <svg viewBox="0 0 32 42" width="36" height="46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 27.2 16 42 16 42C16 42 32 27.2 32 16C32 7.163 24.837 0 16 0Z" fill="#ea4335"/>
              <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
            </svg>
            <div style="position: absolute; top: 8px; left: 0; width: 36px; text-align: center; color: #ea4335; font-size: 14px; font-weight: 900; font-family: Roboto, sans-serif;">
              B
            </div>
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
      });
      L.marker(destCoord, { icon: destIcon })
        .bindTooltip(`<strong>Destination:</strong> ${displayedRoute.destination}`, { permanent: false, direction: 'top' })
        .addTo(layer);
    }

    // 5. Toll Plazas on the route
    displayedRoute.tollPlazas.forEach((toll) => {
      const tollIcon = L.divIcon({
        className: 'google-nav-toll-pin',
        html: `
          <div style="background: #f9ab00; border: 2px solid #ffffff; border-radius: 6px; padding: 3px 6px; box-shadow: 0 3px 6px rgba(0,0,0,0.35); color: #202124; font-size: 11px; font-weight: bold; white-space: nowrap; display: flex; align-items: center; gap: 3px;">
            <span>🪙 Toll ($${displayedRoute.tollFeeUsd})</span>
          </div>
        `,
        iconSize: [95, 26],
        iconAnchor: [47, 13],
      });
      L.marker([toll.lat, toll.lng], { icon: tollIcon })
        .bindTooltip(`<strong>${toll.name}</strong><br/>Tariff: $${displayedRoute.tollFeeUsd} USD / ${displayedRoute.tollFeeZiG} ZiG`, { direction: 'top' })
        .addTo(layer);
    });

    // 6. Fit bounds to the route waypoints!
    if (displayedRoute.waypoints.length > 0) {
      const bounds = L.latLngBounds(displayedRoute.waypoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 14 });
    }
  }, [displayedRoute]);

  // Google Maps SVG Marker Icon Generator
  const createGooglePinIcon = (severity: IncidentSeverity, category: string, isResolved: boolean) => {
    let pinColor = '#ea4335'; // Google red
    let label = '⚠️';

    if (isResolved) {
      pinColor = '#34a853'; // Google green
      label = '✓';
    } else if (severity === 'critical') {
      pinColor = '#d93025'; // Darker red
      label = '⛔';
    } else if (category === 'roadwork') {
      pinColor = '#f29900'; // Amber
      label = '🚧';
    } else if (category === 'checkpoint') {
      pinColor = '#1a73e8'; // Google blue
      label = '👮';
    }

    const svgHtml = `
      <div style="position: relative; width: 32px; height: 42px; cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
        <svg viewBox="0 0 32 42" width="32" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16C0 27.2 16 42 16 42C16 42 32 27.2 32 16C32 7.163 24.837 0 16 0Z" fill="${pinColor}"/>
          <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
        </svg>
        <div style="position: absolute; top: 7px; left: 0; width: 32px; text-align: center; font-size: 11px; font-weight: bold; line-height: 1; user-select: none;">
          ${label}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'google-map-pin',
      html: svgHtml,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -38],
    });
  };

  // Render Incidents as Google Map Pins
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    const filtered = incidents.filter((item) => {
      if (highwayFilter !== 'all' && !item.highway.toLowerCase().includes(highwayFilter.toLowerCase())) return false;
      if (severityFilter !== 'all' && item.severity !== severityFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.locationName.toLowerCase().includes(q) && !item.highway.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    filtered.forEach((incident) => {
      const isResolved = incident.status === 'resolved';
      const icon = createGooglePinIcon(incident.severity, incident.category, isResolved);
      const marker = L.marker(incident.coordinates, { icon });

      // Google Maps style popup card
      const popupDiv = document.createElement('div');
      popupDiv.className = 'google-maps-popup-card';
      popupDiv.innerHTML = `
        <div style="font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #202124; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; color: #1a73e8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">${incident.highway}</span>
            <span style="color: #70757a; font-size: 10px;">${incident.timestamp}</span>
          </div>
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #202124; line-height: 1.25;">${incident.title}</h3>
          <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 11px; line-height: 1.4;">${incident.locationName}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 11px; color: #3c4043;">
            <span style="display: flex; align-items: center; gap: 4px;">
              <span style="color: #34a853; font-weight: bold;">●</span>
              ${incident.status === 'verified' ? 'Verified by Traffic Desk' : 'Community Report'}
            </span>
            <span style="color: #70757a;">👍 ${incident.confirmationsCount}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <button id="google-view-incident-${incident.id}" style="flex: 1; padding: 6px 10px; background-color: #1a73e8; color: #ffffff; border: none; border-radius: 4px; font-weight: 600; font-size: 11px; cursor: pointer;">
              View Details & Detours
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupDiv, { maxWidth: 280 });
      marker.on('popupopen', () => {
        const btn = document.getElementById(`google-view-incident-${incident.id}`);
        if (btn) {
          btn.onclick = () => onSelectIncident(incident);
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [incidents, highwayFilter, severityFilter, categoryFilter, searchQuery, onSelectIncident]);

  // Google Maps Zoom Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Locate User (Google crosshair button)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGpsStatus('GPS not available');
      return;
    }
    setGpsStatus('Finding your location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setGpsStatus('Location locked ✓');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(coords, 15, { duration: 1.5 });
          const userIcon = L.divIcon({
            className: 'google-user-location-pulse',
            html: `
              <div style="position: relative; width: 20px; height: 20px;">
                <div style="position: absolute; inset: 0; background-color: #1a73e8; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(26,115,232,0.8);"></div>
                <div style="position: absolute; inset: -6px; border: 2px solid #1a73e8; border-radius: 50%; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          L.marker(coords, { icon: userIcon }).bindTooltip('Your Location').addTo(mapInstanceRef.current);
        }
      },
      () => {
        setGpsStatus('GPS denied. Centering Bulawayo.');
        mapInstanceRef.current?.flyTo(BULAWAYO_CENTER, 13);
      },
      { timeout: 8000 }
    );
  };

  const handleJumpToTown = (coords: [number, number], zoom: number, townName: string) => {
    setSelectedTown(townName);
    mapInstanceRef.current?.flyTo(coords, zoom, { duration: 1.2 });
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-2xl bg-[#e5e3df] transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-[5000] h-screen rounded-none' : 'h-[520px] sm:h-[640px] lg:h-[750px]'
      }`}
    >
      {/* 1. Google Maps Authentic Navigation Directions Card Overlay */}
      {displayedRoute ? (
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-md bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-fade-in font-sans z-[1100] max-h-[82%] flex flex-col">
          {/* Header */}
          <div className="bg-[#2563EB] px-3.5 py-2.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-xs tracking-wide uppercase">Google Maps Navigation</span>
            </div>
            <button
              onClick={() => {
                setDisplayedRoute(null);
                if (onClearActiveRoute) onClearActiveRoute();
              }}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/15 transition-colors cursor-pointer"
              title="Close Directions & Return to Map"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Route Endpoints */}
          <div className="p-3 bg-[#F1F5F9] border-b border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                A
              </div>
              <div className="flex-1 text-xs font-semibold text-[#111827] bg-[#FFFFFF] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg truncate shadow-xs">
                {displayedRoute.origin}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                B
              </div>
              <div className="flex-1 text-xs font-semibold text-[#111827] bg-[#FFFFFF] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg truncate shadow-xs">
                {displayedRoute.destination}
              </div>
            </div>
          </div>

          {/* Live ETA, Highway, and Traffic Stats */}
          <div className="p-3 bg-[#FFFFFF] space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-[#16A34A]">
                    {Math.floor(displayedRoute.estMinutes / 60)} hr {displayedRoute.estMinutes % 60} min
                  </span>
                  <span className="text-xs text-[#64748B] font-semibold font-mono">({displayedRoute.distanceKm} km)</span>
                </div>
                <div className="text-xs text-[#64748B] font-medium mt-0.5 flex items-center gap-1.5">
                  <span className="font-bold text-[#2563EB]">{displayedRoute.highwayCode}</span>
                  <span>•</span>
                  <span>{displayedRoute.fastestRouteLabel || 'Fastest route now'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 px-2 py-1 rounded-md">
                  <Coins className="w-3 h-3 text-[#F97316]" />
                  ${displayedRoute.tollFeeUsd} USD Toll
                </span>
              </div>
            </div>

            {/* Road conditions pill */}
            <div className="text-[11px] text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-2 flex items-center justify-between gap-2">
              <span className="truncate">🛣️ {displayedRoute.roadCondition.split('·')[0]}</span>
              <span className="font-semibold text-[#16A34A] flex-shrink-0">✓ No Roadblocks</span>
            </div>
          </div>

          {/* Actions & Steps */}
          <div className="px-3 pb-3 bg-[#FFFFFF] flex items-center justify-between border-t border-[#E2E8F0] pt-2.5 text-xs">
            {displayedRoute.steps && displayedRoute.steps.length > 0 && (
              <button
                onClick={() => setShowRouteSteps(!showRouteSteps)}
                className="text-[#2563EB] hover:text-[#1D4ED8] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{showRouteSteps ? 'Hide steps' : `View ${displayedRoute.steps.length} Route Steps`}</span>
                {showRouteSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {onAskAssistant && (
              <button
                onClick={() => onAskAssistant(`Tell me more about the route to ${displayedRoute.destination}`)}
                className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Ask AI Details</span>
              </button>
            )}
          </div>

          {/* Turn-by-turn maneuvers drawer */}
          {showRouteSteps && displayedRoute.steps && (
            <div className="max-h-48 overflow-y-auto p-3 bg-slate-50 border-t border-slate-200 space-y-2 text-xs">
              {displayedRoute.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2.5 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="leading-snug">{st.instruction}</div>
                    {st.distanceKm && (
                      <span className="text-[10px] font-mono font-semibold text-emerald-600">
                        +{st.distanceKm} km
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Normal Google Search & Category Chips */
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-96 z-[1000] flex flex-col gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const detected = detectRoutePreviewFromQuery(searchQuery);
              if (detected) {
                setDisplayedRoute(detected);
              }
            }}
            className="bg-white rounded-lg shadow-md border border-slate-200/80 px-3 py-2 flex items-center gap-2 text-slate-800"
          >
            <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or ask route (e.g. Gwanda, Victoria Falls)..."
              className="flex-1 text-sm bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                ✕
              </button>
            )}
            <div className="h-5 w-px bg-slate-200 mx-1"></div>
            <button
              type="button"
              onClick={() => {
                const detected = detectRoutePreviewFromQuery(searchQuery || 'Gwanda');
                if (detected) {
                  setDisplayedRoute(detected);
                } else if (onAskAssistant) {
                  onAskAssistant("What's the best route to take to Gwanda?");
                }
              }}
              title="Directions / Route Assistant"
              className="p-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full transition-colors cursor-pointer flex-shrink-0 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Google Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {/* Satellite View Direct Toggle */}
            <button
              onClick={() => handleMapTypeChange(mapType === 'hybrid' || mapType === 'satellite' ? 'roadmap' : 'hybrid')}
              className={`px-3 py-1.5 rounded-full font-medium shadow-sm border whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                mapType === 'hybrid' || mapType === 'satellite'
                  ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {mapType === 'hybrid' || mapType === 'satellite' ? '🛰️ Satellite ON' : '🛰️ Satellite'}
            </button>

            {/* 3D Tilt Direct Toggle */}
            <button
              onClick={() => setIs3dRealisticTilt(!is3dRealisticTilt)}
              className={`px-3 py-1.5 rounded-full font-medium shadow-sm border whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                is3dRealisticTilt
                  ? 'bg-[#0B1220] text-white border-[#0B1220] font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {is3dRealisticTilt ? '📐 3D Tilt ON' : '📐 3D Tilt'}
            </button>

            {/* Direct Google Maps Route to Gwanda */}
            <button
              onClick={() => {
                setDisplayedRoute(ROUTE_PREVIEWS.gwanda);
              }}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-sm whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-white" />
              Route to Gwanda (A6)
            </button>

            {/* Route to Victoria Falls */}
            <button
              onClick={() => {
                setDisplayedRoute(ROUTE_PREVIEWS.victoria_falls);
              }}
              className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-full font-medium shadow-sm border border-slate-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
              Route to Vic Falls (A8)
            </button>

            <button
              onClick={() => handleJumpToTown(BULAWAYO_CENTER, 13, 'Bulawayo')}
              className={`px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-full font-medium shadow-sm border border-slate-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedTown === 'Bulawayo' ? 'ring-2 ring-[#2563EB] text-[#2563EB] font-bold' : ''
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#ea4335]" />
              Bulawayo Hub
            </button>

            <button
              onClick={handleToggleTraffic}
              className={`px-3 py-1.5 rounded-full font-medium shadow-sm border whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors ${
                showTraffic
                  ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#16A34A]" />
              {showTraffic ? 'Traffic ON' : 'Traffic'}
            </button>

            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-full font-medium shadow-sm border border-slate-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Filter Incidents ({incidents.length})
            </button>
          </div>
        </div>
      )}

      {/* Filter Drawer Card (Optional dropdown) */}
      {showFilterDrawer && (
        <div className="absolute top-28 left-3 z-[1000] bg-white rounded-xl shadow-xl border border-slate-200 p-4 max-w-xs w-full text-xs space-y-3 font-sans animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm">Corridor & Hazard Filters</span>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Highway Corridor</label>
            <select
              value={highwayFilter}
              onChange={(e) => setHighwayFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
            >
              <option value="all">All High Speed Arterials</option>
              <option value="A6">Gwanda Road (A6)</option>
              <option value="A5">Harare Road (A5 Dual)</option>
              <option value="A8">Victoria Falls Road (A8)</option>
              <option value="A7">Plumtree Road (A7)</option>
              <option value="Bulawayo">Bulawayo Metro Streets</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warnings</option>
              <option value="advisory">Advisories</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Incident Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
            >
              <option value="all">All Hazard Types</option>
              <option value="accident">Accidents</option>
              <option value="roadwork">Roadwork / Resurfacing</option>
              <option value="checkpoint">Police Checkpoints / VID</option>
              <option value="pothole">Potholes / Surface Damage</option>
              <option value="flooding">Flooding & Standing Water</option>
            </select>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing matching markers</span>
            <button
              onClick={() => {
                setHighwayFilter('all');
                setSeverityFilter('all');
                setCategoryFilter('all');
              }}
              className="text-[#1a73e8] font-bold hover:underline"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* 2. Google Maps Authentic Bottom Left Layer Switcher (Map vs Satellite) */}
      <div className="absolute bottom-6 left-4 z-[1000] flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowLayersDropdown(!showLayersDropdown)}
            className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg relative group cursor-pointer focus:outline-none transition-transform hover:scale-105"
            title="Google Maps Layers & Satellite Mode"
          >
            {mapType === 'roadmap' ? (
              <div className="w-full h-full bg-[#1b2b34] flex flex-col items-center justify-center text-white">
                <Layers className="w-5 h-5 text-emerald-400 mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Layers</span>
              </div>
            ) : (
              <div className="w-full h-full bg-[#e5e3df] flex flex-col items-center justify-center text-slate-800">
                <Navigation className="w-5 h-5 text-[#1a73e8] mb-0.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Map</span>
              </div>
            )}
          </button>

          {/* Google Layers Popover */}
          {showLayersDropdown && (
            <div className="absolute bottom-20 left-0 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 w-48 text-xs font-sans text-slate-800 space-y-2 animate-fade-in">
              <span className="font-bold text-slate-900 block text-xs border-b border-slate-100 pb-1">
                Map Types
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    handleMapTypeChange('roadmap');
                    setShowLayersDropdown(false);
                  }}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                    mapType === 'roadmap'
                      ? 'border-[#1a73e8] bg-blue-50 text-[#1a73e8] font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => {
                    handleMapTypeChange('satellite');
                    setShowLayersDropdown(false);
                  }}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                    mapType === 'satellite'
                      ? 'border-[#1a73e8] bg-blue-50 text-[#1a73e8] font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => {
                    handleMapTypeChange('hybrid');
                    setShowLayersDropdown(false);
                  }}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                    mapType === 'hybrid'
                      ? 'border-[#1a73e8] bg-blue-50 text-[#1a73e8] font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Hybrid
                </button>
                <button
                  onClick={() => {
                    handleMapTypeChange('terrain');
                    setShowLayersDropdown(false);
                  }}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                    mapType === 'terrain'
                      ? 'border-[#1a73e8] bg-blue-50 text-[#1a73e8] font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Terrain
                </button>
              </div>

              <div className="border-t border-slate-100 pt-2 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTraffic}
                    onChange={handleToggleTraffic}
                    className="rounded text-[#1a73e8] focus:ring-0"
                  />
                  <span>Live Traffic flow</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Google watermark & status */}
        <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[11px] font-sans text-slate-700 shadow-sm border border-slate-200/80 flex items-center gap-2">
          <span className="font-bold text-[#4285F4]">G</span>
          <span className="font-bold text-[#EA4335]">o</span>
          <span className="font-bold text-[#FBBC05]">o</span>
          <span className="font-bold text-[#4285F4]">g</span>
          <span className="font-bold text-[#34A853]">l</span>
          <span className="font-bold text-[#EA4335]">e</span>
          <span className="text-[10px] text-slate-500 font-mono">Bulawayo Telemetry</span>
          {gpsStatus && <span className="text-[10px] text-emerald-700 font-medium">({gpsStatus})</span>}
        </div>
      </div>

      {/* 3. Google Maps Authentic Bottom Right Controls Stack */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col items-center gap-2">
        {/* 3D Realistic Perspective Toggle (Tilts map in 3D) */}
        <button
          onClick={() => setIs3dRealisticTilt(!is3dRealisticTilt)}
          className={`w-10 h-10 rounded-lg shadow-md border flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
            is3dRealisticTilt
              ? 'bg-[#1a73e8] text-white border-blue-600 ring-2 ring-blue-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle 3D Realistic Google Earth Tilt"
        >
          <span className="font-mono">{is3dRealisticTilt ? '2D' : '3D'}</span>
        </button>

        {/* Location Crosshair Target */}
        <button
          onClick={handleLocateMe}
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 rounded-lg shadow-md border border-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          title="Show your location"
        >
          <Compass className="w-5 h-5 text-slate-600" />
        </button>

        {/* Google Street View Pegman */}
        <div
          className="w-10 h-10 bg-white hover:bg-slate-50 text-amber-500 rounded-lg shadow-md border border-slate-200 flex items-center justify-center cursor-pointer transition-colors relative group"
          title="Street View Pegman (Bulawayo Coverage)"
        >
          <div className="w-5 h-5 flex items-center justify-center font-bold text-lg leading-none select-none text-[#f9ab00]">
            🚶
          </div>
          <span className="absolute right-12 top-1.5 px-2 py-1 bg-slate-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Street View Telemetry
          </span>
        </div>

        {/* Zoom In & Out Stack (Exact Google Maps styling) */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg transition-colors border-b border-slate-100 cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            −
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 rounded-lg shadow-md border border-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Interactive Map Viewport with optional 3D Tilt Perspective */}
      <div
        className="w-full h-full transition-all duration-700 ease-out origin-bottom"
        style={{
          perspective: is3dRealisticTilt ? '1000px' : 'none',
        }}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-full transition-transform duration-700 ease-out"
          style={{
            transform: is3dRealisticTilt ? 'rotateX(34deg) scale(1.06)' : 'none',
          }}
        />
      </div>

      {/* Active 3D Badge Indicator */}
      {is3dRealisticTilt && (
        <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>3D REALISTIC OBLIQUE VIEW · BULAWAYO</span>
        </div>
      )}
    </div>
  );
};
