import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  RoadIncident,
  IncidentSeverity,
  RoutePreviewData,
  AlternativeRouteOption,
} from '../types';
import {
  ZIMBABWE_NODES,
  computeDynamicRouteWithAlternatives,
  enrichRoutePreviewWithAlternatives,
  findObstaclesAlongPolyline,
  isIncidentActive,
  estimateObstacleDelayMinutes,
} from '../utils/routeEngine';
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
  Maximize2,
  Minimize2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Activity,
  X,
  Coins,
  ArrowUpDown,
  LocateFixed,
  Crosshair,
  GitBranch,
  ShieldCheck,
  Edit3,
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
type MapPickMode = 'none' | 'origin' | 'destination';

const BULAWAYO_CENTER: [number, number] = [-20.1550, 28.5833];

const getObstacleEmoji = (category: string, severity: string) => {
  if (category === 'checkpoint') return '👮';
  if (category === 'accident' || severity === 'critical') return '💥';
  if (category === 'roadwork') return '🚧';
  if (category === 'flooding') return '🌊';
  if (category === 'pothole') return '🕳️';
  if (category === 'breakdown') return '🚛';
  return '⚠️';
};

export const RoadMap: React.FC<RoadMapProps> = ({
  incidents,
  onSelectIncident,
  onRequestReportAtCoord,
  selectedHighwayFilter = 'all',
  activeRoute = null,
  onClearActiveRoute,
  onAskAssistant,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const trafficLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerRef = useRef<L.LayerGroup | null>(null);
  const activeRouteLayerRef = useRef<L.LayerGroup | null>(null);
  const markerByIdRef = useRef<Record<string, L.Marker>>({});

  // Universal Route Planner Inputs (Where you are -> Where you want to go)
  const [originText, setOriginText] = useState<string>('Bulawayo');
  const [destText, setDestText] = useState<string>('');
  const [originCoordsOverride, setOriginCoordsOverride] = useState<[number, number] | null>(null);
  const [destCoordsOverride, setDestCoordsOverride] = useState<[number, number] | null>(null);
  const [focusedField, setFocusedField] = useState<'origin' | 'destination' | null>(null);
  const [mapPickMode, setMapPickMode] = useState<MapPickMode>('none');
  const [isEditingRoute, setIsEditingRoute] = useState<boolean>(true);
  const [routeError, setRouteError] = useState<string>('');

  // Active Route & Alternative Selection state
  const [baseDisplayedRoute, setBaseDisplayedRoute] = useState<RoutePreviewData | null>(activeRoute);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [showRouteSteps, setShowRouteSteps] = useState<boolean>(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState<boolean>(false);

  // Map Layer & View Settings
  const [mapType, setMapType] = useState<GoogleMapType>('hybrid');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [is3dRealisticTilt, setIs3dRealisticTilt] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filters & Search
  const [highwayFilter, setHighwayFilter] = useState<string>(selectedHighwayFilter);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [showLayersDropdown, setShowLayersDropdown] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string>('');

  // Refs for latest callbacks inside Leaflet event listeners
  const mapPickModeRef = useRef<MapPickMode>(mapPickMode);
  mapPickModeRef.current = mapPickMode;
  const onRequestReportRef = useRef(onRequestReportAtCoord);
  onRequestReportRef.current = onRequestReportAtCoord;
  const originTextRef = useRef(originText);
  originTextRef.current = originText;
  const destTextRef = useRef(destText);
  destTextRef.current = destText;
  const originCoordsRef = useRef(originCoordsOverride);
  originCoordsRef.current = originCoordsOverride;
  const destCoordsRef = useRef(destCoordsOverride);
  destCoordsRef.current = destCoordsOverride;
  const incidentsRef = useRef(incidents);
  incidentsRef.current = incidents;

  // Enrich active route dynamically with live obstacles & alternative routes
  const displayedRoute: RoutePreviewData | null = useMemo(() => {
    if (!baseDisplayedRoute) return null;
    // Recompute live obstacles & alternatives if route was generated dynamically or preset
    if (originCoordsOverride || destCoordsOverride) {
      const recomputed = computeDynamicRouteWithAlternatives(
        originCoordsOverride || baseDisplayedRoute.origin,
        destCoordsOverride || baseDisplayedRoute.destination,
        incidents
      );
      if (recomputed) return recomputed;
    }
    return enrichRoutePreviewWithAlternatives(
      { ...baseDisplayedRoute, alternativeRoutes: undefined },
      incidents
    );
  }, [baseDisplayedRoute, incidents, originCoordsOverride, destCoordsOverride]);

  const routeOptions: AlternativeRouteOption[] = useMemo(() => {
    if (!displayedRoute) return [];
    if (displayedRoute.alternativeRoutes && displayedRoute.alternativeRoutes.length > 0) {
      return displayedRoute.alternativeRoutes;
    }
    const obs = findObstaclesAlongPolyline(displayedRoute.waypoints, incidents);
    const delay = obs.reduce((s, o) => s + estimateObstacleDelayMinutes(o), 0);
    return [
      {
        id: 'route-opt-primary',
        label: `Primary via ${displayedRoute.highwayCode}`,
        badgeText: obs.length === 0 ? 'Clear Route' : `${obs.length} Obstacles`,
        isPrimary: true,
        highwayCode: displayedRoute.highwayCode,
        distanceKm: displayedRoute.distanceKm,
        estMinutes: displayedRoute.estMinutes + delay,
        delayMinutes: delay,
        tollCount: displayedRoute.tollCount,
        tollFeeUsd: displayedRoute.tollFeeUsd,
        tollFeeZiG: displayedRoute.tollFeeZiG,
        tollPlazas: displayedRoute.tollPlazas,
        waypoints: displayedRoute.waypoints,
        obstaclesOnRoute: obs,
        avoidedObstacles: [],
        isRecommendedClear: obs.length === 0,
        roadCondition: displayedRoute.roadCondition,
        steps: displayedRoute.steps,
      },
    ];
  }, [displayedRoute, incidents]);

  const activeOption: AlternativeRouteOption | null =
    routeOptions[selectedOptionIndex] || routeOptions[0] || null;

  // Sync when external activeRoute prop updates (e.g. from AI Assistant)
  useEffect(() => {
    if (activeRoute) {
      setOriginCoordsOverride(null);
      setDestCoordsOverride(null);
      setOriginText(activeRoute.origin);
      setDestText(activeRoute.destination);
      setBaseDisplayedRoute(activeRoute);
      setSelectedOptionIndex(0);
      setIsEditingRoute(false);
      setIsCardCollapsed(false);
    }
  }, [activeRoute]);

  useEffect(() => {
    if (selectedHighwayFilter && selectedHighwayFilter !== highwayFilter) {
      setHighwayFilter(selectedHighwayFilter);
    }
  }, [selectedHighwayFilter]);

  // Helper to run route calculation from inputs or overrides
  const runRouteSearch = (
    orig: string | [number, number],
    dest: string | [number, number],
    origLabel?: string,
    destLabel?: string
  ) => {
    setRouteError('');
    const computed = computeDynamicRouteWithAlternatives(orig, dest, incidentsRef.current);
    if (!computed) {
      setRouteError(
        'Could not locate one of those places. Pick from suggestions or tap "Pin on Map".'
      );
      return;
    }
    if (origLabel) computed.origin = origLabel;
    if (destLabel) computed.destination = destLabel;

    setBaseDisplayedRoute(computed);
    setSelectedOptionIndex(0);
    setIsEditingRoute(false);
    setIsCardCollapsed(false);
    setFocusedField(null);
  };

  // Construct Google Maps tile URL based on chosen mode
  const getGoogleTileUrl = (type: GoogleMapType) => {
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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BULAWAYO_CENTER,
      zoom: 12,
      minZoom: 4,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false,
    });

    const googleTile = L.tileLayer(getGoogleTileUrl(mapType), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);
    tileLayerRef.current = googleTile;

    if (showTraffic) {
      const traffic = L.tileLayer('https://mt1.google.com/vt/lyrs=h,traffic&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        opacity: 0.85,
      }).addTo(map);
      trafficLayerRef.current = traffic;
    }

    const corridorsGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    corridorsLayerRef.current = corridorsGroup;
    activeRouteLayerRef.current = routeGroup;
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const mode = mapPickModeRef.current;

      if (mode === 'origin') {
        const coords: [number, number] = [lat, lng];
        const label = `Pinned Start (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
        setOriginCoordsOverride(coords);
        setOriginText(label);
        setMapPickMode('none');
        const currentDest = destCoordsRef.current || destTextRef.current;
        if (currentDest && (typeof currentDest !== 'string' || currentDest.trim().length > 0)) {
          runRouteSearch(coords, currentDest, label);
        }
        return;
      }

      if (mode === 'destination') {
        const coords: [number, number] = [lat, lng];
        const label = `Pinned Destination (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
        setDestCoordsOverride(coords);
        setDestText(label);
        setMapPickMode('none');
        const currentOrig = originCoordsRef.current || originTextRef.current || 'Bulawayo';
        runRouteSearch(currentOrig, coords, undefined, label);
        return;
      }

      if (onRequestReportRef.current) {
        onRequestReportRef.current([lat, lng]);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Map Type Switch
  const handleMapTypeChange = (newType: GoogleMapType) => {
    setMapType(newType);
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(getGoogleTileUrl(newType), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;

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
    } else if (trafficLayerRef.current) {
      mapInstanceRef.current.removeLayer(trafficLayerRef.current);
    }
  };

  // Render subtle Zimbabwe background highway lines when no route is active (or muted when route IS active)
  useEffect(() => {
    if (!corridorsLayerRef.current) return;
    corridorsLayerRef.current.clearLayers();

    const baseOpacity = displayedRoute ? 0.22 : 0.78;

    const corridors = [
      {
        id: 'A6',
        name: 'Gwanda Road (A6 Corridor) — Bulawayo to Gwanda & Beitbridge',
        status: 'Active Monitoring · View obstacles on corridor',
        color: '#2563EB',
        coords: [
          [-20.1550, 28.5833],
          [-20.2100, 28.6900],
          [-20.2900, 28.9300],
          [-20.5800, 28.9800],
          [-20.9333, 29.0000],
          [-21.0667, 29.3667],
          [-22.2167, 29.9833],
        ],
      },
      {
        id: 'A5',
        name: 'Harare Road (A5 Dual Carriageway) — Bulawayo to Gweru & Harare',
        status: 'National Arterial · Flowing',
        color: '#16A34A',
        coords: [
          [-20.1550, 28.5833],
          [-20.1480, 28.5910],
          [-19.9800, 28.8200],
          [-19.4500, 29.8167],
          [-18.9281, 29.8149],
          [-18.3333, 29.9167],
          [-18.1302, 30.1407],
          [-17.8252, 31.0335],
        ],
      },
      {
        id: 'A8',
        name: 'Victoria Falls Road (A8 Corridor) — Bulawayo to Vic Falls',
        status: 'Wildlife Caution near Insuza',
        color: '#F97316',
        coords: [
          [-20.1550, 28.5833],
          [-19.7833, 28.2500],
          [-18.9315, 27.8070],
          [-18.3644, 26.5983],
          [-17.9244, 25.8567],
        ],
      },
      {
        id: 'A7',
        name: 'Plumtree Road (A7 Corridor) — Bulawayo to Botswana',
        status: 'Clear · Border queues under 15m',
        color: '#7C3AED',
        coords: [
          [-20.1550, 28.5833],
          [-20.3200, 28.2500],
          [-20.4800, 27.8200],
        ],
      },
      {
        id: 'A4',
        name: 'Harare–Masvingo–Beitbridge Highway (A4)',
        status: 'North-South Freight Corridor',
        color: '#0EA5E9',
        coords: [
          [-17.8252, 31.0335],
          [-18.2500, 30.8500],
          [-19.0211, 30.8922],
          [-20.0744, 30.8328],
          [-21.2500, 30.7333],
          [-22.2167, 29.9833],
        ],
      },
      {
        id: 'A3',
        name: 'Harare–Mutare Highway (A3)',
        status: 'Eastern Corridor',
        color: '#14B8A6',
        coords: [
          [-17.8252, 31.0335],
          [-18.1853, 31.5519],
          [-18.5278, 32.1284],
          [-18.9707, 32.6709],
        ],
      },
    ];

    corridors.forEach((corridor) => {
      const line = L.polyline(corridor.coords as [number, number][], {
        color: corridor.color,
        weight: displayedRoute ? 3 : 4,
        opacity: baseOpacity,
        lineCap: 'round',
      });
      line.bindTooltip(
        `<strong>${corridor.name}</strong><br/><span style="color:#16A34A;font-weight:bold;">${corridor.status}</span>`,
        { sticky: true, className: 'google-maps-tooltip' }
      );
      line.addTo(corridorsLayerRef.current!);
    });
  }, [displayedRoute]);

  // Render Active Route + Alternative Bypass Routes + Route Callouts + Obstacle Halos
  useEffect(() => {
    if (!activeRouteLayerRef.current || !mapInstanceRef.current) return;
    const layer = activeRouteLayerRef.current;
    layer.clearLayers();

    if (!displayedRoute || routeOptions.length === 0 || !activeOption) return;

    const allBoundsPoints: [number, number][] = [];

    // 1. Draw UNSELECTED alternative routes first (underneath active route) so user sees every alternative clearly!
    routeOptions.forEach((opt, idx) => {
      if (idx === selectedOptionIndex) return;
      if (!opt.waypoints || opt.waypoints.length < 2) return;

      opt.waypoints.forEach((pt) => allBoundsPoints.push(pt));

      const isClearAlt = opt.obstaclesOnRoute.length === 0 || opt.isRecommendedClear;
      const altColor = isClearAlt ? '#16A34A' : '#64748B';

      // White halo casing for visibility on satellite maps
      const casing = L.polyline(opt.waypoints, {
        color: '#FFFFFF',
        weight: 9,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layer);

      // Dashed green/slate alternative line
      const altLine = L.polyline(opt.waypoints, {
        color: altColor,
        weight: 5.5,
        opacity: 0.95,
        dashArray: '10, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layer);

      const switchToAlt = () => setSelectedOptionIndex(idx);
      casing.on('click', switchToAlt);
      altLine.on('click', switchToAlt);

      // Floating clickable pill callout at midpoint of alternative route
      const midIdx = Math.floor(opt.waypoints.length / 2);
      const midPt = opt.waypoints[midIdx] || opt.waypoints[0];
      const hr = Math.floor(opt.estMinutes / 60);
      const min = opt.estMinutes % 60;
      const timeStr = hr > 0 ? `${hr}h ${min}m` : `${min}m`;
      const obsBadge =
        opt.obstaclesOnRoute.length === 0
          ? '✓ Clear Bypass'
          : `⚠️ ${opt.obstaclesOnRoute.length} Obstacles`;

      const altCalloutIcon = L.divIcon({
        className: 'roadlink-alt-route-callout',
        html: `
          <div style="background: #FFFFFF; border: 2px solid ${altColor}; border-radius: 999px; padding: 4px 10px; box-shadow: 0 4px 12px rgba(11,18,32,0.28); white-space: nowrap; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-family: system-ui, sans-serif; transform: translate(-50%, -50%);">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${altColor}; display: inline-block;"></span>
            <span style="font-size: 11px; font-weight: 800; color: #0B1220;">Alt: ${timeStr} (${opt.distanceKm}km)</span>
            <span style="font-size: 10px; font-weight: 700; color: ${altColor}; background: ${
          isClearAlt ? '#DCFCE7' : '#F1F5F9'
        }; padding: 1px 6px; border-radius: 999px;">${obsBadge}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const calloutMarker = L.marker(midPt, { icon: altCalloutIcon, zIndexOffset: 450 }).addTo(layer);
      calloutMarker.on('click', switchToAlt);
    });

    // 2. Draw SELECTED Active Route on top with crisp Navy + Royal Blue casing
    if (activeOption.waypoints.length >= 2) {
      activeOption.waypoints.forEach((pt) => allBoundsPoints.push(pt));

      const hasObstacles = activeOption.obstaclesOnRoute.length > 0;
      const primaryColor = '#2563EB';

      L.polyline(activeOption.waypoints, {
        color: '#0B1220',
        weight: 11,
        opacity: 0.92,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layer);

      L.polyline(activeOption.waypoints, {
        color: primaryColor,
        weight: 6.5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layer);

      // Active route midpoint summary badge
      const midIdx = Math.max(0, Math.floor((activeOption.waypoints.length - 1) * 0.38));
      const midPt = activeOption.waypoints[midIdx] || activeOption.waypoints[0];
      const hr = Math.floor(activeOption.estMinutes / 60);
      const min = activeOption.estMinutes % 60;
      const timeStr = hr > 0 ? `${hr}h ${min}m` : `${min}m`;

      const primaryCalloutIcon = L.divIcon({
        className: 'roadlink-primary-route-callout',
        html: `
          <div style="background: #0B1220; color: #FFFFFF; border: 2px solid #2563EB; border-radius: 999px; padding: 5px 11px; box-shadow: 0 6px 16px rgba(11,18,32,0.45); white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; font-family: system-ui, sans-serif; transform: translate(-50%, -125%);">
            <span style="font-size: 11px; font-weight: 800;">${timeStr} · ${activeOption.distanceKm} km</span>
            <span style="font-size: 10px; font-weight: 700; color: ${
              hasObstacles ? '#FDBA74' : '#86EFAC'
            }; background: rgba(255,255,255,0.12); padding: 1px 6px; border-radius: 999px;">
              ${
                hasObstacles
                  ? `⚠️ ${activeOption.obstaclesOnRoute.length} Obstacle${
                      activeOption.obstaclesOnRoute.length > 1 ? 's' : ''
                    }`
                  : '✓ Clear'
              }
            </span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      L.marker(midPt, { icon: primaryCalloutIcon, zIndexOffset: 500, interactive: false }).addTo(layer);
    }

    // 3. Pulsing Radar Halos & Obstacle Flags for obstacles ON the active route
    activeOption.obstaclesOnRoute.forEach((obs) => {
      const emoji = getObstacleEmoji(obs.category, obs.severity);
      const delay = estimateObstacleDelayMinutes(obs);
      const haloColor =
        obs.severity === 'critical' || obs.category === 'accident'
          ? '#DC2626'
          : obs.category === 'checkpoint'
          ? '#2563EB'
          : '#F97316';

      const pulseIcon = L.divIcon({
        className: 'roadlink-route-obstacle-halo',
        html: `
          <div style="position: relative; width: 54px; height: 54px; pointer-events: none;">
            <div style="position: absolute; inset: 4px; border-radius: 50%; border: 3px solid ${haloColor}; background: ${haloColor}22; animation: ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); background: #0B1220; color: #FFFFFF; border: 1.5px solid ${haloColor}; border-radius: 6px; padding: 2px 6px; font-size: 10px; font-weight: 800; white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,0.45); font-family: system-ui, sans-serif;">
              ${emoji} +${delay}m
            </div>
          </div>
        `,
        iconSize: [54, 54],
        iconAnchor: [27, 27],
      });

      L.marker(obs.coordinates, { icon: pulseIcon, zIndexOffset: 400, interactive: false }).addTo(layer);
    });

    // 4. Origin Pin A (Green)
    const startCoord = activeOption.waypoints[0];
    if (startCoord) {
      const originIcon = L.divIcon({
        className: 'google-nav-origin-pin',
        html: `
          <div style="width: 34px; height: 34px; background: #16A34A; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 14px; font-family: system-ui, sans-serif;">
            A
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker(startCoord, { icon: originIcon, zIndexOffset: 600 })
        .bindTooltip(`<strong>Start:</strong> ${displayedRoute.origin}`, { direction: 'top' })
        .addTo(layer);
    }

    // 5. Destination Pin B (Red/Orange)
    const destCoord = activeOption.waypoints[activeOption.waypoints.length - 1];
    if (destCoord) {
      const destIcon = L.divIcon({
        className: 'google-nav-dest-pin',
        html: `
          <div style="position: relative; width: 36px; height: 46px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">
            <svg viewBox="0 0 32 42" width="36" height="46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 27.2 16 42 16 42C16 42 32 27.2 32 16C32 7.163 24.837 0 16 0Z" fill="#EA4335"/>
              <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
            </svg>
            <div style="position: absolute; top: 8px; left: 0; width: 36px; text-align: center; color: #EA4335; font-size: 14px; font-weight: 900; font-family: system-ui, sans-serif;">
              B
            </div>
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
      });
      L.marker(destCoord, { icon: destIcon, zIndexOffset: 600 })
        .bindTooltip(`<strong>Destination:</strong> ${displayedRoute.destination}`, { direction: 'top' })
        .addTo(layer);
    }

    // 6. Toll Plazas on Active Option
    activeOption.tollPlazas.forEach((toll) => {
      const tollIcon = L.divIcon({
        className: 'google-nav-toll-pin',
        html: `
          <div style="background: #F97316; border: 2px solid #ffffff; border-radius: 6px; padding: 2px 6px; box-shadow: 0 3px 6px rgba(0,0,0,0.35); color: #FFFFFF; font-size: 10px; font-weight: 800; white-space: nowrap; display: flex; align-items: center; gap: 3px; font-family: system-ui, sans-serif;">
            <span>🪙 Toll ($4)</span>
          </div>
        `,
        iconSize: [78, 22],
        iconAnchor: [39, 11],
      });
      L.marker([toll.lat, toll.lng], { icon: tollIcon, zIndexOffset: 420 })
        .bindTooltip(`<strong>${toll.name}</strong><br/>Standard Light Vehicle: $4 USD / 110 ZiG`, {
          direction: 'top',
        })
        .addTo(layer);
    });

    // Fit map cleanly to show BOTH primary and alternative routes
    if (allBoundsPoints.length > 1) {
      const bounds = L.latLngBounds(allBoundsPoints);
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: [40, 80],
        paddingBottomRight: [40, 60],
        maxZoom: 13,
      });
    }
  }, [displayedRoute, routeOptions, activeOption, selectedOptionIndex]);

  // Create Google Pin Icon for all obstacles
  const createGooglePinIcon = (
    severity: IncidentSeverity,
    category: string,
    isResolved: boolean,
    isOnActiveRoute: boolean
  ) => {
    let pinColor = '#EA4335';
    let label = '⚠️';

    if (isResolved) {
      pinColor = '#16A34A';
      label = '✓';
    } else if (severity === 'critical' || category === 'accident') {
      pinColor = '#DC2626';
      label = '💥';
    } else if (category === 'roadwork') {
      pinColor = '#F97316';
      label = '🚧';
    } else if (category === 'checkpoint') {
      pinColor = '#2563EB';
      label = '👮';
    } else if (category === 'flooding') {
      pinColor = '#0284C7';
      label = '🌊';
    } else if (category === 'pothole') {
      pinColor = '#D97706';
      label = '🕳️';
    } else if (category === 'breakdown') {
      pinColor = '#7C3AED';
      label = '🚛';
    }

    const size = isOnActiveRoute ? 38 : 32;
    const height = isOnActiveRoute ? 48 : 42;

    const svgHtml = `
      <div style="position: relative; width: ${size}px; height: ${height}px; cursor: pointer; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));">
        <svg viewBox="0 0 32 42" width="${size}" height="${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16C0 27.2 16 42 16 42C16 42 32 27.2 32 16C32 7.163 24.837 0 16 0Z" fill="${pinColor}" stroke="${
      isOnActiveRoute ? '#0B1220' : '#FFFFFF'
    }" stroke-width="${isOnActiveRoute ? '1.8' : '0'}"/>
          <circle cx="16" cy="15" r="9.5" fill="#FFFFFF"/>
        </svg>
        <div style="position: absolute; top: ${isOnActiveRoute ? '8px' : '7px'}; left: 0; width: ${size}px; text-align: center; font-size: ${
      isOnActiveRoute ? '13px' : '11px'
    }; font-weight: bold; line-height: 1; user-select: none;">
          ${label}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'google-map-pin',
      html: svgHtml,
      iconSize: [size, height],
      iconAnchor: [size / 2, height],
      popupAnchor: [0, -height + 4],
    });
  };

  // Render All Incident / Obstacle Pins
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();
    markerByIdRef.current = {};

    const activeRouteObsIds = new Set((activeOption?.obstaclesOnRoute || []).map((o) => o.id));
    const clearAltIdx = routeOptions.findIndex(
      (opt, idx) => idx !== selectedOptionIndex && opt.obstaclesOnRoute.length < (activeOption?.obstaclesOnRoute.length || 0)
    );

    const filtered = incidents.filter((item) => {
      if (highwayFilter !== 'all' && !item.highway.toLowerCase().includes(highwayFilter.toLowerCase()))
        return false;
      if (severityFilter !== 'all' && item.severity !== severityFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      return true;
    });

    filtered.forEach((incident) => {
      const isResolved = !isIncidentActive(incident);
      const isOnRoute = activeRouteObsIds.has(incident.id);
      const icon = createGooglePinIcon(incident.severity, incident.category, isResolved, isOnRoute);
      const marker = L.marker(incident.coordinates, {
        icon,
        zIndexOffset: isOnRoute ? 550 : 200,
      });

      const delay = estimateObstacleDelayMinutes(incident);
      const popupDiv = document.createElement('div');
      popupDiv.className = 'google-maps-popup-card';
      popupDiv.innerHTML = `
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #111827; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 6px;">
            <span style="font-weight: 800; color: #2563EB; font-size: 10px; text-transform: uppercase;">${incident.highway}</span>
            ${
              isOnRoute
                ? `<span style="background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; padding: 1px 6px; border-radius: 999px; font-size: 9px; font-weight: 800;">ON YOUR ROUTE (+${delay}m)</span>`
                : `<span style="color: #64748B; font-size: 10px;">${incident.timestamp}</span>`
            }
          </div>
          <h3 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0B1220; line-height: 1.3;">${incident.title}</h3>
          <p style="margin: 0 0 6px 0; color: #64748B; font-size: 11px; line-height: 1.35;">${incident.locationName}</p>
          ${
            incident.detourAdvice
              ? `<div style="background: #F1F5F9; border-left: 3px solid #F97316; padding: 5px 7px; border-radius: 4px; font-size: 10px; color: #111827; margin-bottom: 8px;"><strong>Advisory:</strong> ${incident.detourAdvice}</div>`
              : ''
          }
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button id="google-view-incident-${incident.id}" style="flex: 1; padding: 6px 10px; background-color: #2563EB; color: #ffffff; border: none; border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer;">
              Details & Detours
            </button>
            ${
              isOnRoute && clearAltIdx !== -1
                ? `<button id="google-avoid-obstacle-${incident.id}" style="flex: 1; padding: 6px 10px; background-color: #16A34A; color: #ffffff; border: none; border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer;">
                    Use Clear Bypass
                  </button>`
                : ''
            }
          </div>
        </div>
      `;

      marker.bindPopup(popupDiv, { maxWidth: 290 });
      marker.on('popupopen', () => {
        const btn = document.getElementById(`google-view-incident-${incident.id}`);
        if (btn) btn.onclick = () => onSelectIncident(incident);

        const avoidBtn = document.getElementById(`google-avoid-obstacle-${incident.id}`);
        if (avoidBtn && clearAltIdx !== -1) {
          avoidBtn.onclick = () => {
            setSelectedOptionIndex(clearAltIdx);
            marker.closePopup();
          };
        }
      });

      marker.addTo(markersLayerRef.current!);
      markerByIdRef.current[incident.id] = marker;
    });
  }, [
    incidents,
    highwayFilter,
    severityFilter,
    categoryFilter,
    onSelectIncident,
    activeOption,
    routeOptions,
    selectedOptionIndex,
  ]);

  // Zoom & Locate Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const handleUseGpsAsOrigin = () => {
    if (!navigator.geolocation) {
      setGpsStatus('GPS unavailable; using Bulawayo');
      setOriginCoordsOverride(BULAWAYO_CENTER);
      setOriginText('Current Location (Bulawayo)');
      return;
    }
    setGpsStatus('Locking GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setGpsStatus('GPS Locked ✓');
        setOriginCoordsOverride(coords);
        setOriginText(`My GPS Location (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`);
        mapInstanceRef.current?.flyTo(coords, 14, { duration: 1.2 });

        if (destText.trim() || destCoordsOverride) {
          runRouteSearch(
            coords,
            destCoordsOverride || destText,
            `My GPS Location`,
            destText || undefined
          );
        }
      },
      () => {
        setGpsStatus('GPS blocked; defaulted to Bulawayo');
        setOriginCoordsOverride(BULAWAYO_CENTER);
        setOriginText('Current Location (Bulawayo CBD)');
      },
      { timeout: 7000 }
    );
  };

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
          mapInstanceRef.current.flyTo(coords, 14, { duration: 1.3 });
          const userIcon = L.divIcon({
            className: 'google-user-location-pulse',
            html: `
              <div style="position: relative; width: 20px; height: 20px;">
                <div style="position: absolute; inset: 0; background-color: #2563EB; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>
                <div style="position: absolute; inset: -6px; border: 2px solid #2563EB; border-radius: 50%; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          L.marker(coords, { icon: userIcon }).bindTooltip('Your Current Location').addTo(mapInstanceRef.current);
        }
      },
      () => {
        setGpsStatus('GPS denied. Centering Bulawayo.');
        mapInstanceRef.current?.flyTo(BULAWAYO_CENTER, 12);
      },
      { timeout: 7000 }
    );
  };

  const handleSwapEndpoints = () => {
    const prevOrigText = originText;
    const prevDestText = destText;
    const prevOrigCoords = originCoordsOverride;
    const prevDestCoords = destCoordsOverride;

    setOriginText(prevDestText);
    setDestText(prevOrigText);
    setOriginCoordsOverride(prevDestCoords);
    setDestCoordsOverride(prevOrigCoords);

    if (prevDestText.trim() && prevOrigText.trim()) {
      runRouteSearch(prevDestCoords || prevDestText, prevOrigCoords || prevOrigText);
    }
  };

  const handleFocusObstacleOnMap = (obs: RoadIncident) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(obs.coordinates, 14, { duration: 1 });
    const marker = markerByIdRef.current[obs.id];
    if (marker) {
      setTimeout(() => marker.openPopup(), 450);
    }
  };

  // Filtered autocomplete suggestions
  const activeQueryForSuggestions =
    focusedField === 'origin' ? originText : focusedField === 'destination' ? destText : '';

  const placeSuggestions = useMemo(() => {
    if (!focusedField) return [];
    const q = activeQueryForSuggestions.toLowerCase().trim();
    if (!q) return ZIMBABWE_NODES.slice(0, 10);
    return ZIMBABWE_NODES.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.shortName.toLowerCase().includes(q) ||
        n.region.toLowerCase().includes(q) ||
        n.aliases.some((a) => a.includes(q))
    ).slice(0, 8);
  }, [focusedField, activeQueryForSuggestions]);

  const activeObstaclesTotal = incidents.filter(isIncidentActive).length;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xl bg-[#e5e3df] transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-[5000] h-screen rounded-none' : 'h-[560px] sm:h-[660px] lg:h-[760px]'
      }`}
    >
      {/* MAP PICK MODE INSTRUCTION BANNER */}
      {mapPickMode !== 'none' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1250] bg-[#0B1220] text-white px-4 py-2.5 rounded-full shadow-2xl border-2 border-[#F97316] flex items-center gap-3 text-xs font-semibold animate-fade-in max-w-[92vw]">
          <Crosshair className="w-4 h-4 text-[#F97316] animate-pulse flex-shrink-0" />
          <span className="truncate">
            Tap anywhere on the map to set your{' '}
            <strong className="text-[#F97316]">
              {mapPickMode === 'origin' ? 'Starting Location (A)' : 'Destination (B)'}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => setMapPickMode('none')}
            className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded-full text-[11px] font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 1. LEFT OVERLAY PANEL: ROUTE PLANNER + OBSTACLES + ALTERNATIVE ROUTES */}
      {displayedRoute && activeOption && !isEditingRoute ? (
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-[410px] bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#E2E8F0] overflow-hidden font-sans z-[1100] max-h-[84%] flex flex-col">
          {/* Header Bar */}
          <div className="bg-[#0B1220] px-3.5 py-2.5 text-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                <Navigation className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs tracking-wide uppercase block truncate">
                  Route, Obstacles & Bypasses
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsEditingRoute(true)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Change Origin or Destination"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCardCollapsed(!isCardCollapsed)}
                className="p-1 text-white/80 hover:text-white rounded hover:bg-white/15 transition-colors cursor-pointer"
                title={isCardCollapsed ? 'Expand route details' : 'Minimize to see more map'}
              >
                {isCardCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBaseDisplayedRoute(null);
                  setSelectedOptionIndex(0);
                  setIsEditingRoute(true);
                  if (onClearActiveRoute) onClearActiveRoute();
                }}
                className="p-1 text-white/80 hover:text-white rounded hover:bg-white/15 transition-colors cursor-pointer"
                title="Close Directions"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compact Route Endpoints Strip (Always Visible) */}
          <div className="px-3 py-2 bg-[#F1F5F9] border-b border-[#E2E8F0] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-4 h-4 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                A
              </span>
              <span className="font-semibold text-[#111827] truncate">{displayedRoute.origin}</span>
              <span className="text-[#64748B] flex-shrink-0">→</span>
              <span className="w-4 h-4 rounded-full bg-[#EA4335] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                B
              </span>
              <span className="font-semibold text-[#111827] truncate">{displayedRoute.destination}</span>
            </div>
            <span className="text-[11px] font-bold text-[#2563EB] flex-shrink-0 font-mono">
              {Math.floor(activeOption.estMinutes / 60) > 0
                ? `${Math.floor(activeOption.estMinutes / 60)}h ${activeOption.estMinutes % 60}m`
                : `${activeOption.estMinutes}m`}
            </span>
          </div>

          {/* Collapsible Body */}
          {!isCardCollapsed && (
            <div className="overflow-y-auto flex-1 divide-y divide-[#E2E8F0]">
              {/* ROUTE OPTIONS & ALTERNATIVE BYPASSES SWITCHER */}
              <div className="p-3 space-y-2 bg-[#FFFFFF]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#2563EB]" />
                    Route Options ({routeOptions.length})
                  </span>
                  <span className="text-[10px] text-[#64748B]">Tap a route or line on map</span>
                </div>

                <div className="space-y-1.5">
                  {routeOptions.map((opt, idx) => {
                    const isSelected = idx === selectedOptionIndex;
                    const isClear = opt.obstaclesOnRoute.length === 0;
                    const hr = Math.floor(opt.estMinutes / 60);
                    const min = opt.estMinutes % 60;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOptionIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#2563EB] bg-blue-50/70 ring-1 ring-[#2563EB]'
                            : 'border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                isSelected
                                  ? 'bg-[#2563EB]'
                                  : isClear
                                  ? 'bg-[#16A34A]'
                                  : 'bg-[#64748B]'
                              }`}
                            />
                            <span className="font-bold text-xs text-[#111827] truncate">
                              {opt.label}
                            </span>
                          </div>
                          <span className="font-mono font-extrabold text-xs text-[#0B1220] flex-shrink-0">
                            {hr > 0 ? `${hr}h ${min}m` : `${min}m`} · {opt.distanceKm} km
                          </span>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isClear
                                ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                                : 'bg-amber-50 text-[#F97316] border-amber-200'
                            }`}
                          >
                            {isClear ? (
                              <>
                                <ShieldCheck className="w-3 h-3" />
                                <span>{opt.badgeText}</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                <span>{opt.badgeText}</span>
                              </>
                            )}
                          </span>

                          {opt.avoidedObstacles.length > 0 ? (
                            <span className="text-[10px] font-bold text-[#16A34A]">
                              ✓ Avoids {opt.avoidedObstacles.length} obstacle
                              {opt.avoidedObstacles.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                              <Coins className="w-3 h-3 text-[#F97316]" />${opt.tollFeeUsd} Tolls
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OBSTACLES ALONG CURRENTLY SELECTED ROUTE */}
              <div className="p-3 bg-[#F1F5F9]/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 ${
                        activeOption.obstaclesOnRoute.length > 0 ? 'text-[#F97316]' : 'text-[#16A34A]'
                      }`}
                    />
                    Obstacles on Selected Path ({activeOption.obstaclesOnRoute.length})
                  </span>
                </div>

                {activeOption.obstaclesOnRoute.length === 0 ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-[#16A34A] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Clear path! Zero active roadblocks, accidents, or closures along this route.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                    {activeOption.obstaclesOnRoute.map((obs) => {
                      const delay = estimateObstacleDelayMinutes(obs);
                      return (
                        <div
                          key={obs.id}
                          className="p-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-[#111827] leading-snug flex items-start gap-1.5">
                              <span>{getObstacleEmoji(obs.category, obs.severity)}</span>
                              <span>{obs.title}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#F97316] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex-shrink-0">
                              +{delay}m
                            </span>
                          </div>
                          <div className="text-[11px] text-[#64748B] truncate">{obs.locationName}</div>
                          <div className="flex items-center justify-between pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleFocusObstacleOnMap(obs)}
                              className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                            >
                              Locate on Map →
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectIncident(obs)}
                              className="text-[11px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
                            >
                              Full Report
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* One-click CTA to switch to Clear Bypass if current route has obstacles */}
                {activeOption.obstaclesOnRoute.length > 0 &&
                  routeOptions.some(
                    (o, idx) =>
                      idx !== selectedOptionIndex &&
                      o.obstaclesOnRoute.length < activeOption.obstaclesOnRoute.length
                  ) && (
                    <button
                      type="button"
                      onClick={() => {
                        const bestIdx = routeOptions.findIndex(
                          (o, idx) =>
                            idx !== selectedOptionIndex &&
                            o.obstaclesOnRoute.length < activeOption.obstaclesOnRoute.length
                        );
                        if (bestIdx !== -1) setSelectedOptionIndex(bestIdx);
                      }}
                      className="w-full py-2 px-3 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Switch to Clear Alternative Bypass Route</span>
                    </button>
                  )}
              </div>

              {/* TURN-BY-TURN STEPS & AI ACTIONS */}
              <div className="p-3 bg-[#FFFFFF] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setShowRouteSteps(!showRouteSteps)}
                    className="text-[#2563EB] hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {showRouteSteps
                        ? 'Hide Turn-by-Turn Steps'
                        : `View ${activeOption.steps.length} Route Steps`}
                    </span>
                    {showRouteSteps ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {onAskAssistant && (
                    <button
                      type="button"
                      onClick={() =>
                        onAskAssistant(
                          `Give me road safety details for ${displayedRoute.origin} to ${displayedRoute.destination}`
                        )
                      }
                      className="text-[#64748B] hover:text-[#111827] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Ask AI</span>
                    </button>
                  )}
                </div>

                {showRouteSteps && (
                  <div className="max-h-40 overflow-y-auto pt-2 border-t border-[#E2E8F0] space-y-2 text-xs">
                    {activeOption.steps.map((st, i) => (
                      <div key={i} className="flex items-start gap-2 text-[#111827]">
                        <span className="w-5 h-5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#0B1220] text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1 leading-snug">
                          <span>{st.instruction}</span>
                          {st.distanceKm ? (
                            <span className="ml-1.5 text-[10px] font-mono font-bold text-[#16A34A]">
                              ({st.distanceKm} km)
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* UNIVERSAL FROM -> TO ROUTE FINDER + QUICK CHIPS */
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-[410px] z-[1100] flex flex-col gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!destText.trim() && !destCoordsOverride) {
                setRouteError('Please enter or pin where you want to go.');
                return;
              }
              runRouteSearch(
                originCoordsOverride || originText || 'Bulawayo',
                destCoordsOverride || destText
              );
            }}
            className="bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#E2E8F0] p-3 space-y-2 text-[#111827] relative"
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#E2E8F0]">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B1220] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
                Anywhere-to-Anywhere Route & Obstacle Finder
              </span>
              {displayedRoute && (
                <button
                  type="button"
                  onClick={() => setIsEditingRoute(false)}
                  className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Back to Route
                </button>
              )}
            </div>

            {/* ORIGIN INPUT ("Where you are") */}
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                A
              </span>
              <div className="relative flex-1 flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-[#2563EB]">
                <input
                  type="text"
                  value={originText}
                  onFocus={() => setFocusedField('origin')}
                  onChange={(e) => {
                    setOriginText(e.target.value);
                    setOriginCoordsOverride(null);
                    setRouteError('');
                  }}
                  placeholder="Where are you? (e.g. Bulawayo, Harare, GPS)"
                  className="w-full text-xs bg-transparent outline-none text-[#111827] placeholder-[#64748B] font-medium"
                />
                <button
                  type="button"
                  onClick={handleUseGpsAsOrigin}
                  title="Use my current GPS location"
                  className="ml-1 p-1 text-[#2563EB] hover:bg-blue-100 rounded transition-colors cursor-pointer flex-shrink-0"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFocusedField(null);
                    setMapPickMode('origin');
                  }}
                  title="Pin starting location directly on the map"
                  className="ml-0.5 p-1 text-[#F97316] hover:bg-orange-100 rounded transition-colors cursor-pointer flex-shrink-0"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSwapEndpoints}
                title="Swap Origin and Destination"
                className="p-1.5 bg-[#F1F5F9] hover:bg-slate-200 border border-[#E2E8F0] rounded-lg text-[#64748B] cursor-pointer flex-shrink-0"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DESTINATION INPUT ("Where you want to go") */}
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EA4335] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                B
              </span>
              <div className="relative flex-1 flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-[#2563EB]">
                <input
                  type="text"
                  value={destText}
                  onFocus={() => setFocusedField('destination')}
                  onChange={(e) => {
                    setDestText(e.target.value);
                    setDestCoordsOverride(null);
                    setRouteError('');
                  }}
                  placeholder="Where do you want to go? (e.g. Gwanda, Mutare...)"
                  className="w-full text-xs bg-transparent outline-none text-[#111827] placeholder-[#64748B] font-medium"
                />
                {destText && (
                  <button
                    type="button"
                    onClick={() => {
                      setDestText('');
                      setDestCoordsOverride(null);
                    }}
                    className="text-xs text-[#64748B] hover:text-[#111827] px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFocusedField(null);
                    setMapPickMode('destination');
                  }}
                  title="Pin destination directly on the map"
                  className="ml-0.5 p-1 text-[#F97316] hover:bg-orange-100 rounded transition-colors cursor-pointer flex-shrink-0"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Go</span>
              </button>
            </div>

            {routeError && (
              <div className="text-[11px] text-rose-600 font-semibold px-1">{routeError}</div>
            )}

            {/* Autocomplete Dropdown */}
            {focusedField && placeSuggestions.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-xl max-h-44 overflow-y-auto divide-y divide-[#F1F5F9]">
                <div className="px-2.5 py-1 bg-[#F1F5F9] text-[10px] font-bold text-[#64748B] uppercase flex items-center justify-between">
                  <span>
                    Select {focusedField === 'origin' ? 'Starting Place' : 'Destination'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFocusedField(null)}
                    className="text-[#2563EB] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
                {placeSuggestions.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      if (focusedField === 'origin') {
                        setOriginText(node.shortName);
                        setOriginCoordsOverride(null);
                        setFocusedField(destText ? null : 'destination');
                      } else {
                        setDestText(node.shortName);
                        setDestCoordsOverride(null);
                        setFocusedField(null);
                        runRouteSearch(originCoordsOverride || originText || 'Bulawayo', node.shortName);
                      }
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-xs flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="font-semibold text-[#111827]">{node.name}</span>
                    <span className="text-[10px] text-[#64748B]">{node.region}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Quick Category, Presets & Map Layer Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => {
                setOriginText('Bulawayo');
                setDestText('Gwanda');
                setOriginCoordsOverride(null);
                setDestCoordsOverride(null);
                runRouteSearch('Bulawayo', 'Gwanda');
              }}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full font-bold shadow-sm whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              <Navigation className="w-3 h-3" />
              Byo → Gwanda
            </button>

            <button
              type="button"
              onClick={() => {
                setOriginText('Harare');
                setDestText('Mutare');
                setOriginCoordsOverride(null);
                setDestCoordsOverride(null);
                runRouteSearch('Harare', 'Mutare');
              }}
              className="px-3 py-1.5 bg-[#FFFFFF] text-[#111827] hover:bg-[#F1F5F9] rounded-full font-semibold shadow-sm border border-[#E2E8F0] whitespace-nowrap cursor-pointer"
            >
              Harare → Mutare
            </button>

            <button
              type="button"
              onClick={() => {
                setOriginText('Bulawayo');
                setDestText('Harare');
                setOriginCoordsOverride(null);
                setDestCoordsOverride(null);
                runRouteSearch('Bulawayo', 'Harare');
              }}
              className="px-3 py-1.5 bg-[#FFFFFF] text-[#111827] hover:bg-[#F1F5F9] rounded-full font-semibold shadow-sm border border-[#E2E8F0] whitespace-nowrap cursor-pointer"
            >
              Byo → Harare
            </button>

            <button
              type="button"
              onClick={() => {
                setOriginText('Bulawayo');
                setDestText('Victoria Falls');
                setOriginCoordsOverride(null);
                setDestCoordsOverride(null);
                runRouteSearch('Bulawayo', 'Victoria Falls');
              }}
              className="px-3 py-1.5 bg-[#FFFFFF] text-[#111827] hover:bg-[#F1F5F9] rounded-full font-semibold shadow-sm border border-[#E2E8F0] whitespace-nowrap cursor-pointer"
            >
              Byo → Vic Falls
            </button>

            <button
              type="button"
              onClick={() =>
                handleMapTypeChange(
                  mapType === 'hybrid' || mapType === 'satellite' ? 'roadmap' : 'hybrid'
                )
              }
              className={`px-3 py-1.5 rounded-full font-medium shadow-sm border whitespace-nowrap flex items-center gap-1 cursor-pointer transition-all ${
                mapType === 'hybrid' || mapType === 'satellite'
                  ? 'bg-[#0B1220] text-white border-[#0B1220] font-bold'
                  : 'bg-white text-[#111827] border-[#E2E8F0]'
              }`}
            >
              <Layers className="w-3 h-3" />
              {mapType === 'hybrid' || mapType === 'satellite' ? 'Satellite ON' : 'Satellite'}
            </button>

            <button
              type="button"
              onClick={handleToggleTraffic}
              className={`px-3 py-1.5 rounded-full font-medium shadow-sm border whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
                showTraffic
                  ? 'bg-emerald-50 text-[#16A34A] border-emerald-300 font-bold'
                  : 'bg-white text-[#111827] border-[#E2E8F0]'
              }`}
            >
              <Activity className="w-3 h-3" />
              {showTraffic ? 'Traffic ON' : 'Traffic'}
            </button>

            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="px-3 py-1.5 bg-white text-[#111827] hover:bg-[#F1F5F9] rounded-full font-semibold shadow-sm border border-[#E2E8F0] whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3 text-[#64748B]" />
              Obstacles ({activeObstaclesTotal})
            </button>
          </div>
        </div>
      )}

      {/* Filter Drawer Card */}
      {showFilterDrawer && (
        <div className="absolute top-36 left-3 z-[1200] bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-4 max-w-xs w-full text-xs space-y-3 font-sans animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <span className="font-bold text-[#111827] text-sm">Filter Map Obstacles</span>
            <button
              type="button"
              onClick={() => setShowFilterDrawer(false)}
              className="text-[#64748B] hover:text-[#111827] font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="block text-[#64748B] font-medium mb-1">Highway Corridor</label>
            <select
              value={highwayFilter}
              onChange={(e) => setHighwayFilter(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-2 text-[#111827]"
            >
              <option value="all">All National Highways</option>
              <option value="A6">Gwanda–Beitbridge (A6)</option>
              <option value="A5">Harare–Bulawayo (A5)</option>
              <option value="A4">Harare–Beitbridge (A4)</option>
              <option value="A8">Victoria Falls (A8)</option>
              <option value="A7">Plumtree (A7)</option>
              <option value="A3">Harare–Mutare (A3)</option>
              <option value="Bulawayo">Bulawayo Metro Streets</option>
            </select>
          </div>

          <div>
            <label className="block text-[#64748B] font-medium mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-2 text-[#111827]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warnings</option>
              <option value="advisory">Advisories</option>
            </select>
          </div>

          <div>
            <label className="block text-[#64748B] font-medium mb-1">Obstacle Type</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-2 text-[#111827]"
            >
              <option value="all">All Obstacle Types</option>
              <option value="accident">Accidents / Collisions</option>
              <option value="checkpoint">Roadblocks / Police / VID</option>
              <option value="roadwork">Roadworks / Contraflow</option>
              <option value="pothole">Potholes / Surface Damage</option>
              <option value="flooding">Flooding & Water Hazards</option>
              <option value="breakdown">Broken Down Heavy Vehicles</option>
            </select>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Showing matching obstacles</span>
            <button
              type="button"
              onClick={() => {
                setHighwayFilter('all');
                setSeverityFilter('all');
                setCategoryFilter('all');
              }}
              className="text-[#2563EB] font-bold hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* 2. Bottom Left Layer Switcher & Clear Map Legend */}
      <div className="absolute bottom-5 left-3 z-[1000] flex items-end gap-2 max-w-[calc(100vw-80px)]">
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowLayersDropdown(!showLayersDropdown)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg relative cursor-pointer focus:outline-none transition-transform hover:scale-105 bg-[#0B1220] text-white flex flex-col items-center justify-center"
            title="Map Layers & Satellite Mode"
          >
            <Layers className="w-4 h-4 text-emerald-400 mb-0.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Layers</span>
          </button>

          {showLayersDropdown && (
            <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-3 w-48 text-xs font-sans text-[#111827] space-y-2 animate-fade-in">
              <span className="font-bold text-[#0B1220] block text-xs border-b border-[#E2E8F0] pb-1">
                Map Display Mode
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['roadmap', 'satellite', 'hybrid', 'terrain'] as GoogleMapType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      handleMapTypeChange(t);
                      setShowLayersDropdown(false);
                    }}
                    className={`p-2 rounded-lg border text-center font-medium capitalize cursor-pointer transition-colors ${
                      mapType === t
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-bold'
                        : 'border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {t === 'roadmap' ? 'Default' : t}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#E2E8F0] pt-2 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTraffic}
                    onChange={handleToggleTraffic}
                    className="rounded text-[#2563EB] focus:ring-0"
                  />
                  <span>Live Traffic Flow</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Clear Visual Legend Strip */}
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] sm:text-[11px] font-sans text-[#111827] shadow-lg border border-[#E2E8F0] flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <span className="w-4 h-1.5 rounded-full bg-[#2563EB] inline-block border border-[#0B1220]" />
            <span>Selected Route</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <span className="w-4 h-0 border-t-2 border-dashed border-[#16A34A] inline-block" />
            <span>Alternative Bypass</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] ring-2 ring-red-200 inline-block" />
            <span>Obstacle</span>
          </span>
          {gpsStatus && <span className="text-[10px] text-[#16A34A] font-bold">({gpsStatus})</span>}
        </div>
      </div>

      {/* 3. Bottom Right Map Controls Stack */}
      <div className="absolute bottom-5 right-3 z-[1000] flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setIs3dRealisticTilt(!is3dRealisticTilt)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow-md border flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
            is3dRealisticTilt
              ? 'bg-[#2563EB] text-white border-blue-600 ring-2 ring-blue-300'
              : 'bg-white text-[#111827] border-[#E2E8F0] hover:bg-[#F1F5F9]'
          }`}
          title="Toggle 3D Perspective Tilt"
        >
          <span className="font-mono">{is3dRealisticTilt ? '2D' : '3D'}</span>
        </button>

        <button
          type="button"
          onClick={handleLocateMe}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-white hover:bg-[#F1F5F9] text-[#111827] rounded-lg shadow-md border border-[#E2E8F0] flex items-center justify-center cursor-pointer transition-colors"
          title="Center on my location"
        >
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" />
        </button>

        <div className="bg-white rounded-lg shadow-md border border-[#E2E8F0] flex flex-col overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-8 sm:w-10 sm:h-9 flex items-center justify-center text-[#111827] hover:bg-[#F1F5F9] font-bold text-lg transition-colors border-b border-[#E2E8F0] cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-8 sm:w-10 sm:h-9 flex items-center justify-center text-[#111827] hover:bg-[#F1F5F9] font-bold text-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            −
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-white hover:bg-[#F1F5F9] text-[#111827] rounded-lg shadow-md border border-[#E2E8F0] flex items-center justify-center cursor-pointer transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Interactive Map Viewport */}
      <div
        className="w-full h-full transition-all duration-700 ease-out origin-bottom"
        style={{
          perspective: is3dRealisticTilt ? '1000px' : 'none',
        }}
      >
        <div
          ref={mapContainerRef}
          className={`w-full h-full transition-transform duration-700 ease-out ${
            mapPickMode !== 'none' ? 'cursor-crosshair' : ''
          }`}
          style={{
            transform: is3dRealisticTilt ? 'rotateX(34deg) scale(1.06)' : 'none',
          }}
        />
      </div>

      {/* Active 3D Badge Indicator */}
      {is3dRealisticTilt && (
        <div className="hidden sm:flex absolute top-3 right-3 z-[1000] bg-[#0B1220]/90 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xl items-center gap-1.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>3D OBLIQUE TELEMETRY VIEW</span>
        </div>
      )}
    </div>
  );
};
