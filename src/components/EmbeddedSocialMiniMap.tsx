import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RoadIncident } from '../types';
import { getEffectiveIncidentStatus } from '../utils/mediaHouses';
import {
  Search,
  Plus,
  Minus,
  LocateFixed,
  Maximize2,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface EmbeddedSocialMiniMapProps {
  incidents: RoadIncident[];
  onOpenFullMap: () => void;
  onSelectIncident?: (incident: RoadIncident) => void;
  onOpenReportModal?: () => void;
}

interface QuickPlace {
  name: string;
  coords: [number, number];
  zoom: number;
}

const ZIM_QUICK_PLACES: QuickPlace[] = [
  { name: 'Bulawayo CBD', coords: [-20.15, 28.58], zoom: 12 },
  { name: 'Nketa', coords: [-20.201, 28.515], zoom: 13 },
  { name: 'Mpomoma', coords: [-20.129, 28.528], zoom: 13 },
  { name: 'Emakhandeni', coords: [-20.125, 28.498], zoom: 13 },
  { name: 'A6 Gwanda Road', coords: [-20.195, 28.65], zoom: 11 },
  { name: 'Harare', coords: [-17.8292, 31.0522], zoom: 11 },
  { name: 'Gwanda', coords: [-20.9333, 29.0], zoom: 11 },
  { name: 'Beitbridge', coords: [-22.2167, 30.0], zoom: 11 },
  { name: 'Gweru', coords: [-19.45, 29.8167], zoom: 11 },
  { name: 'Mutare', coords: [-18.9707, 32.6709], zoom: 11 },
  { name: 'Victoria Falls', coords: [-17.9329, 25.8307], zoom: 11 },
];

type MiniPinKind = 'accident' | 'breakdown' | 'emergency' | 'available';

const PIN_STYLES: Record<MiniPinKind, { bg: string; label: string; glyph: string }> = {
  accident: {
    bg: '#DC2626',
    label: 'Accident',
    glyph: '!',
  },
  breakdown: {
    bg: '#F59E0B',
    label: 'Breakdown / Roadwork',
    glyph: '⚠',
  },
  emergency: {
    bg: '#2563EB',
    label: 'Roadblock / Alert',
    glyph: '●',
  },
  available: {
    bg: '#16A34A',
    label: 'Cleared / Available',
    glyph: '✓',
  },
};

function getIncidentPinKind(inc: RoadIncident): MiniPinKind {
  const eff = getEffectiveIncidentStatus(inc);
  if (eff === 'resolved') return 'available';
  if (inc.category === 'accident' || inc.severity === 'critical') return 'accident';
  if (
    inc.category === 'breakdown' ||
    inc.category === 'roadwork' ||
    inc.category === 'pothole' ||
    inc.category === 'flooding' ||
    inc.category === 'weather_hazard'
  ) {
    return 'breakdown';
  }
  return 'emergency';
}

export const EmbeddedSocialMiniMap: React.FC<EmbeddedSocialMiniMapProps> = ({
  incidents,
  onOpenFullMap,
  onSelectIncident,
  onOpenReportModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [locationQuery, setLocationQuery] = useState('');
  const [filterKind, setFilterKind] = useState<'all' | MiniPinKind>('all');
  const [focusedIncidentId, setFocusedIncidentId] = useState<string | null>(null);
  const [mapScope, setMapScope] = useState<'zim' | 'byo'>('zim');

  // Recent reports ordered as active/newest first
  const recentReports = useMemo(() => {
    const valid = incidents.filter((inc) => {
      if (!inc.coordinates) return false;
      const eff = getEffectiveIncidentStatus(inc);
      if (eff === 'dismissed') return false;
      if (filterKind === 'all') return true;
      return getIncidentPinKind(inc) === filterKind;
    });
    return valid;
  }, [incidents, filterKind]);

  const focusedIncident = useMemo(() => {
    if (!focusedIncidentId) return recentReports[0] || null;
    return recentReports.find((r) => r.id === focusedIncidentId) || recentReports[0] || null;
  }, [recentReports, focusedIncidentId]);

  // Initialize Leaflet mini-map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-19.45, 29.55],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 18,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Populate markers from all recent reports
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    recentReports.forEach((inc) => {
      const kind = getIncidentPinKind(inc);
      const style = PIN_STYLES[kind];
      const isSelected = focusedIncident?.id === inc.id;
      const size = isSelected ? 32 : 26;

      const icon = L.divIcon({
        className: 'roadlink-recent-report-pin',
        html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${style.bg};border:${isSelected ? '3px solid #FFFFFF' : '2px solid #FFFFFF'};box-shadow:0 4px 14px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;font-size:${isSelected ? '13px' : '11px'};cursor:pointer;transform:${isSelected ? 'scale(1.08)' : 'scale(1)'};transition:transform 0.15s;">${style.glyph}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker(inc.coordinates, { icon });
      marker.bindTooltip(
        `<div style="font-family:sans-serif;font-size:11px;font-weight:700;color:#0F172A;max-width:220px;white-space:normal;">${inc.title}<div style="font-weight:500;color:#475569;font-size:10px;margin-top:2px;">${inc.highway} · ${inc.timestamp}</div></div>`,
        { direction: 'top', offset: [0, -10] }
      );
      marker.on('click', () => {
        setFocusedIncidentId(inc.id);
        map.flyTo(inc.coordinates, Math.max(map.getZoom(), 10), { duration: 0.55 });
      });
      marker.addTo(layer);
    });
  }, [recentReports, focusedIncident]);

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const q = locationQuery.trim().toLowerCase();
    if (!q || !mapInstanceRef.current) return;

    // First check matching recent report
    const matchingReport = recentReports.find(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.highway.toLowerCase().includes(q) ||
        (r.town || '').toLowerCase().includes(q)
    );
    if (matchingReport) {
      setFocusedIncidentId(matchingReport.id);
      mapInstanceRef.current.flyTo(matchingReport.coordinates, 12, { duration: 0.7 });
      return;
    }

    const match = ZIM_QUICK_PLACES.find((p) => p.name.toLowerCase().includes(q));
    if (match) {
      mapInstanceRef.current.flyTo(match.coords, match.zoom, { duration: 0.7 });
    }
  };

  const handleFocusReport = (inc: RoadIncident) => {
    setFocusedIncidentId(inc.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(inc.coordinates, 11, { duration: 0.65 });
    }
  };

  const handleToggleScope = (scope: 'zim' | 'byo') => {
    setMapScope(scope);
    if (!mapInstanceRef.current) return;
    if (scope === 'byo') {
      mapInstanceRef.current.flyTo([-20.155, 28.575], 12, { duration: 0.65 });
    } else {
      mapInstanceRef.current.flyTo([-19.45, 29.55], 6, { duration: 0.65 });
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => handleToggleScope(mapScope);

  return (
    <section className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-xl">
      {/* Map Header Bar */}
      <div className="px-4 py-3 border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
          <h2 className="text-sm font-semibold text-white tracking-tight truncate">
            Live Interactive Road Map & Recent Reports
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#60A5FA] text-[11px] font-medium tabular-nums shrink-0">
            {recentReports.length} active
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-[#0B1220] border border-[#1E293B] rounded-lg p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleToggleScope('zim')}
              className={`px-2 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                mapScope === 'zim' ? 'bg-[#2563EB] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              All Zimbabwe
            </button>
            <button
              type="button"
              onClick={() => handleToggleScope('byo')}
              className={`px-2 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                mapScope === 'byo' ? 'bg-[#2563EB] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Bulawayo
            </button>
          </div>

          {onOpenReportModal && (
            <button
              type="button"
              onClick={onOpenReportModal}
              className="px-2.5 py-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
            >
              + Report
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFullMap}
            className="px-2.5 py-1.5 rounded-lg bg-[#111C2E] hover:bg-[#1E293B] border border-[#334155] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Maximize2 className="w-3 h-3 text-[#60A5FA]" />
            <span>Full Map</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 py-2 bg-[#0B1220]/70 border-b border-[#1E293B] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        {(
          [
            { id: 'all', label: 'All Reports', dot: 'bg-white' },
            { id: 'accident', label: 'Accidents', dot: 'bg-[#DC2626]' },
            { id: 'emergency', label: 'Roadblocks & Alerts', dot: 'bg-[#2563EB]' },
            { id: 'breakdown', label: 'Breakdowns & Works', dot: 'bg-[#F59E0B]' },
            { id: 'available', label: 'Cleared', dot: 'bg-[#16A34A]' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilterKind(item.id)}
            className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              filterKind === item.id
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#111C2E] text-[#94A3B8] hover:text-white border border-[#1E293B]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${item.dot}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Leaflet Map Canvas */}
      <div className="relative w-full h-[300px] sm:h-[340px] bg-[#0B1220] select-none">
        <div ref={mapContainerRef} className="w-full h-full z-[1]" />

        {/* Top-left floating search box */}
        <form
          onSubmit={handleSearchLocation}
          className="absolute top-3 left-3 z-[400] flex items-center bg-[#0B1220]/90 backdrop-blur-md border border-[#334155] rounded-lg px-2.5 py-1.5 w-48 sm:w-64 shadow-lg"
        >
          <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-2 shrink-0" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search locations or reports..."
            className="bg-transparent text-xs text-white placeholder-[#94A3B8] focus:outline-none w-full"
          />
        </form>

        {/* Bottom-left zoom & locate controls */}
        <div className="absolute bottom-3 left-3 z-[400] flex flex-col gap-1.5">
          <div className="flex flex-col bg-[#0B1220]/90 backdrop-blur-md border border-[#334155] rounded-lg overflow-hidden shadow-lg">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom in"
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#1E293B] transition-colors border-b border-[#334155] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom out"
              className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter map"
            className="w-8 h-8 rounded-lg bg-[#0B1220]/90 backdrop-blur-md border border-[#334155] flex items-center justify-center text-white hover:bg-[#1E293B] shadow-lg transition-colors cursor-pointer"
          >
            <LocateFixed className="w-4 h-4 text-[#60A5FA]" />
          </button>
        </div>

        {/* Bottom-right legend card */}
        <div className="hidden sm:block absolute bottom-3 right-3 z-[400] bg-[#0B1220]/92 backdrop-blur-md border border-[#334155] rounded-xl px-3 py-2 shadow-xl space-y-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shrink-0" />
            <span>Accident</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
            <span>Breakdown</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0" />
            <span>Roadblock / Alert</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
            <span>Cleared</span>
          </div>
        </div>
      </div>

      {/* Selected Report Quick Detail Banner */}
      {focusedIncident && (
        <div className="px-4 py-3 bg-[#111C2E] border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${PIN_STYLES[getIncidentPinKind(focusedIncident)].bg}25` }}
            >
              {getEffectiveIncidentStatus(focusedIncident) === 'verified' ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-[#F97316]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white truncate">
                  {focusedIncident.title}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0B1220] text-[#94A3B8] border border-[#334155]">
                  {getEffectiveIncidentStatus(focusedIncident)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] mt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#3B82F6]" />
                  {focusedIncident.locationName} ({focusedIncident.highway})
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {focusedIncident.timestamp}
                </span>
              </div>
            </div>
          </div>

          {onSelectIncident && (
            <button
              type="button"
              onClick={() => onSelectIncident(focusedIncident)}
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
            >
              <span>Inspect Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Recent Reports Horizontal Strip right inside Map Card */}
      <div className="px-4 py-3 bg-[#0B1220] border-t border-[#1E293B]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Recent Reports (Tap to locate on map)</span>
          </span>
          <button
            type="button"
            onClick={onOpenFullMap}
            className="text-[11px] font-semibold text-[#3B82F6] hover:text-[#60A5FA] cursor-pointer"
          >
            Route & Avoid Obstacles →
          </button>
        </div>

        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
          {recentReports.slice(0, 8).map((inc) => {
            const kind = getIncidentPinKind(inc);
            const style = PIN_STYLES[kind];
            const isSelected = focusedIncident?.id === inc.id;
            return (
              <button
                key={inc.id}
                type="button"
                onClick={() => handleFocusReport(inc)}
                className={`w-56 shrink-0 rounded-xl p-2.5 text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E293B] border-[#3B82F6] shadow-md'
                    : 'bg-[#0F172A] border-[#1E293B] hover:border-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-300">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: style.bg }}
                    />
                    {inc.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-[#64748B] shrink-0">{inc.timestamp}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{inc.title}</div>
                <div className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                  {inc.locationName}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
