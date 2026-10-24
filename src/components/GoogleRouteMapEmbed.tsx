import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RoutePreviewData, RoadIncident } from '../types';
import {
  MapPin,
  Navigation,
  Clock,
  Coins,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
  Milestone,
  CheckCircle2
} from 'lucide-react';

interface GoogleRouteMapEmbedProps {
  route: RoutePreviewData;
  incidents?: RoadIncident[];
  onOpenFullMap?: (route: RoutePreviewData) => void;
  onOpenRoutePlanner?: (routeId: string) => void;
}

export const GoogleRouteMapEmbed: React.FC<GoogleRouteMapEmbedProps> = ({
  route,
  incidents = [],
  onOpenFullMap,
  onOpenRoutePlanner,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Filter hazards along this route corridor
  const corridorHazards = incidents.filter(
    (inc) =>
      inc.status !== 'resolved' &&
      (inc.highway.toLowerCase().includes(route.highwayCode.toLowerCase()) ||
        inc.locationName.toLowerCase().includes(route.destination.toLowerCase()) ||
        inc.locationName.toLowerCase().includes(route.origin.toLowerCase()))
  );

  const getTileUrl = (type: 'roadmap' | 'hybrid') => {
    return type === 'hybrid'
      ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: route.waypoints[0] || [-20.155, 28.5833],
      zoom: 10,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false, // Prevent page hijacking when scrolling chat
    });

    const tile = L.tileLayer(getTileUrl(mapType), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    tileLayerRef.current = tile;

    // Route Outer Casing (Google dark blue border)
    L.polyline(route.waypoints, {
      color: '#1557b0',
      weight: 8,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Route Main Line (Google Maps royal blue)
    const routeLine = L.polyline(route.waypoints, {
      color: '#1a73e8',
      weight: 5,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Origin Pin (Google A marker / green)
    const startCoord = route.waypoints[0];
    if (startCoord) {
      const originIcon = L.divIcon({
        className: 'google-origin-pin',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; items-center; justify-content: center;">
            <div style="width: 28px; height: 28px; background: #34a853; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px; font-family: Roboto, sans-serif;">
              A
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker(startCoord, { icon: originIcon })
        .bindTooltip(`<strong>Start:</strong> ${route.origin}`, { permanent: false, direction: 'top' })
        .addTo(map);
    }

    // Destination Pin (Google B marker / red)
    const destCoord = route.waypoints[route.waypoints.length - 1];
    if (destCoord) {
      const destIcon = L.divIcon({
        className: 'google-dest-pin',
        html: `
          <div style="position: relative; width: 34px; height: 44px; display: flex; items-center; justify-content: center; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.45));">
            <svg viewBox="0 0 32 42" width="34" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 27.2 16 42 16 42C16 42 32 27.2 32 16C32 7.163 24.837 0 16 0Z" fill="#ea4335"/>
              <circle cx="16" cy="15" r="9" fill="#FFFFFF"/>
            </svg>
            <div style="position: absolute; top: 7px; left: 0; width: 34px; text-align: center; color: #ea4335; font-size: 13px; font-weight: 800; font-family: Roboto, sans-serif;">
              B
            </div>
          </div>
        `,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
      });

      L.marker(destCoord, { icon: destIcon })
        .bindTooltip(`<strong>Destination:</strong> ${route.destination}`, { permanent: false, direction: 'top' })
        .addTo(map);
    }

    // Toll Plaza Pins along route
    route.tollPlazas.forEach((toll) => {
      const tollIcon = L.divIcon({
        className: 'google-toll-pin',
        html: `
          <div style="background: #f9ab00; border: 2px solid #ffffff; border-radius: 6px; padding: 2px 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); color: #202124; font-size: 10px; font-weight: bold; white-space: nowrap; display: flex; align-items: center; gap: 3px;">
            <span>🪙 Toll</span>
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      L.marker([toll.lat, toll.lng], { icon: tollIcon })
        .bindTooltip(`<strong>${toll.name}</strong><br/>Tariff: $${route.tollFeeUsd} USD / ${route.tollFeeZiG} ZiG`, {
          direction: 'top',
        })
        .addTo(map);
    });

    // Corridor Hazards Pins
    corridorHazards.forEach((hazard) => {
      const hazardIcon = L.divIcon({
        className: 'google-hazard-pin',
        html: `
          <div style="background: #ea4335; border: 2px solid #ffffff; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 5px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
            ⚠️
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(hazard.coordinates, { icon: hazardIcon })
        .bindTooltip(`<strong>${hazard.title}</strong><br/>${hazard.locationName}`, { direction: 'top' })
        .addTo(map);
    });

    // Fit Bounds so entire corridor is visible
    if (route.waypoints.length > 0) {
      const bounds = L.latLngBounds(route.waypoints);
      map.fitBounds(bounds, { padding: [25, 25] });
    }

    mapInstanceRef.current = map;
    setIsMapReady(true);

    // Invalidate size to ensure crisp rendering after layout
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [route, mapType]);

  const toggleMapType = () => {
    const nextType = mapType === 'roadmap' ? 'hybrid' : 'roadmap';
    setMapType(nextType);
  };

  const hours = Math.floor(route.estMinutes / 60);
  const minutes = route.estMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours} hr ${minutes > 0 ? `${minutes} min` : ''}` : `${minutes} min`;

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-[#1E293B] bg-[#0B1220] text-white shadow-xl">
      {/* 1. Authentic Google Maps Header Card */}
      <div className="bg-[#070B14] border-b border-[#1E293B] px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Google Maps Icon Badge */}
            <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#4885ed" d="M24 4C14.06 4 6 12.06 6 22c0 13.25 18 22 18 22s18-8.75 18-22c0-9.94-8.06-18-18-18z" />
                <path fill="#34a853" d="M24 4c-9.94 0-18 8.06-18 18 0 7.37 5.03 14.53 11 18.82V27.5h-5V20h5v-5.5c0-4.97 3.03-7.5 7.5-7.5h5.5v7h-3.5c-2.43 0-3.5 1.18-3.5 3.5V20h7l-1 7.5h-6v13.57C36.75 37.1 42 29.89 42 22c0-9.94-8.06-18-18-18z" opacity="0.1" />
                <circle cx="24" cy="20" r="7" fill="#ffffff" />
                <circle cx="24" cy="20" r="4.5" fill="#ea4335" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-white tracking-tight">
                  {route.origin}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-xs sm:text-sm text-[#60A5FA] tracking-tight">
                  {route.destination}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                <span className="font-semibold text-[#60A5FA]">{route.highwayCode} Corridor</span>
                <span>•</span>
                <span className="text-slate-300">{route.fastestRouteLabel || 'Fastest Route'}</span>
              </div>
            </div>
          </div>

          {/* Time & Distance Pill */}
          <div className="text-right flex flex-col items-end flex-shrink-0">
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40 px-2 py-0.5 rounded-md">
              {timeFormatted}
            </span>
            <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5">{route.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* 2. Embedded Leaflet Map */}
      <div className="relative w-full h-[230px] sm:h-[260px] bg-[#e5e3df]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Google Map Layer Switcher */}
        <div className="absolute top-2.5 right-2.5 z-[400] flex items-center gap-1.5">
          <button
            onClick={toggleMapType}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 rounded-md shadow-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#E2E8F0]"
            title="Toggle Satellite Imagery"
          >
            <Layers className="w-3 h-3 text-[#2563EB]" />
            <span>{mapType === 'roadmap' ? 'Satellite' : 'Roadmap'}</span>
          </button>
        </div>

        {/* Live Traffic Indicator Pill */}
        <div className="absolute bottom-2.5 left-2.5 z-[400]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-md border border-[#E2E8F0] text-slate-800 text-[10px] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>Live Traffic: Smooth & Clear</span>
          </div>
        </div>
      </div>

      {/* 3. Trip Specs & Hazards Ribbon */}
      <div className="p-3 bg-[#0B1220] border-t border-[#1E293B] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2 bg-[#111C2E] p-2 rounded-lg border border-[#1E293B]">
          <Coins className="w-4 h-4 text-[#F97316] flex-shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">ZINARA Toll</div>
            <div className="text-[11px] font-bold text-white truncate">
              {route.tollCount > 0 ? `${route.tollCount} Gate ($${route.tollFeeUsd} USD / ${route.tollFeeZiG} ZiG)` : 'Toll Free'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#111C2E] p-2 rounded-lg border border-[#1E293B]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Roadblocks</div>
            <div className="text-[11px] font-bold text-[#16A34A] truncate">
              {corridorHazards.length === 0 ? '0 Reported (Clear)' : `${corridorHazards.length} Advisories`}
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-2 bg-[#111C2E] p-2 rounded-lg border border-[#1E293B]">
          <Milestone className="w-4 h-4 text-[#60A5FA] flex-shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Surface</div>
            <div className="text-[11px] font-bold text-slate-200 truncate">{route.roadCondition.split('·')[0]}</div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="p-3 bg-[#070B14] border-t border-[#1E293B] flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenFullMap && (
            <button
              onClick={() => onOpenFullMap(route)}
              className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-lg shadow-md shadow-blue-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-white" />
              <span>Open in Full Interactive Map</span>
            </button>
          )}

          {route.steps && route.steps.length > 0 && (
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-slate-200 text-xs font-medium rounded-lg border border-[#334155] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showSteps ? 'Hide Maneuvers' : `View ${route.steps.length} Steps`}</span>
              {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {onOpenRoutePlanner && (
          <button
            onClick={() => onOpenRoutePlanner(route.routeId)}
            className="text-[11px] text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Toll Breakdown & Stops</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 5. Expandable Turn-by-Turn Maneuvers List (Google Maps Directions style) */}
      {showSteps && route.steps && route.steps.length > 0 && (
        <div className="bg-[#0B1220] border-t border-[#1E293B] p-3 space-y-2 max-h-56 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-[#2563EB]" />
            <span>Turn-by-Turn Route Guidance:</span>
          </div>

          <div className="space-y-2">
            {route.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-[#111C2E] border border-[#1E293B] flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-400 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="leading-snug">{step.instruction}</div>
                  {step.distanceKm && (
                    <span className="text-[10px] font-mono text-[#16A34A] font-semibold">
                      +{step.distanceKm} km
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
