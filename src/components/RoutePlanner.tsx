import React, { useState } from 'react';
import { RouteOption, RoadIncident, ZimbabweHighway } from '../types';
import { PRESET_ROUTES } from '../data/mockRoadData';
import { Navigation, Clock, ShieldCheck, AlertCircle, Fuel, Coins, ExternalLink, Printer, Share2, Check, ArrowRight } from 'lucide-react';

interface RoutePlannerProps {
  incidents: RoadIncident[];
  onSelectHighwayOnMap: (highwayCode: string) => void;
  onOpenIncidentDetail: (incident: RoadIncident) => void;
}

type VehicleClass = 'lightVehicle' | 'minibus' | 'bus' | 'heavyTruck' | 'haulage';

const VEHICLE_LABELS: Record<VehicleClass, { name: string; ratePerGateUsd: number; ratePerGateZiG: number }> = {
  lightVehicle: { name: 'Light Passenger Car / SUV', ratePerGateUsd: 4, ratePerGateZiG: 110 },
  minibus: { name: 'Commuter Omnibus / Kombi', ratePerGateUsd: 6, ratePerGateZiG: 165 },
  bus: { name: 'Intercity Bus / Coach', ratePerGateUsd: 8, ratePerGateZiG: 220 },
  heavyTruck: { name: 'Heavy Commercial Vehicle (3-Axle)', ratePerGateUsd: 10, ratePerGateZiG: 275 },
  haulage: { name: 'Abnormal / Superlink Haulage', ratePerGateUsd: 20, ratePerGateZiG: 550 },
};

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  incidents,
  onSelectHighwayOnMap,
  onOpenIncidentDetail,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-hrebby');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleClass>('lightVehicle');
  const [customOrigin, setCustomOrigin] = useState<string>('');
  const [customDestination, setCustomDestination] = useState<string>('');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const currentRoute = PRESET_ROUTES.find((r) => r.id === selectedRouteId) || PRESET_ROUTES[0];

  // Incidents on this highway
  const corridorIncidents = incidents.filter(
    (inc) =>
      inc.highway.toLowerCase().includes(currentRoute.highwayCode.toLowerCase()) &&
      inc.status !== 'resolved'
  );

  const vehicleData = VEHICLE_LABELS[selectedVehicle];
  const totalTollsUsd = currentRoute.tollCount * vehicleData.ratePerGateUsd;
  const totalTollsZiG = currentRoute.tollCount * vehicleData.ratePerGateZiG;

  const handleShareItinerary = () => {
    const text = `RoadLink Zimbabwe Corridor Briefing:\nRoute: ${currentRoute.origin} -> ${currentRoute.destination} (${currentRoute.highwayCode})\nDistance: ${currentRoute.distanceKm} km (~${Math.floor(currentRoute.estMinutes / 60)}h ${currentRoute.estMinutes % 60}m)\nTolls: ${currentRoute.tollCount} gates ($${totalTollsUsd} USD / ${totalTollsZiG} ZiG for ${vehicleData.name})\nActive Hazards: ${corridorIncidents.length} reported\nShared via RoadLink Zimbabwe`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handlePrintBriefing = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Route Selector & Vehicle Class Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#2563EB]" />
              National Highway Corridor Navigator & Toll Calculator
            </h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              Accurate highway distances, ZINARA dual-currency toll breakdowns, real-time corridor hazard alerts, and service oasis stops.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareItinerary}
              className="px-3 py-1.5 bg-[#F1F5F9] hover:bg-slate-200 text-[#64748B] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-[#E2E8F0]"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedShare ? 'Copied to Clipboard!' : 'Share Briefing'}
            </button>
            <button
              onClick={handlePrintBriefing}
              className="px-3 py-1.5 bg-[#0B1220] hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Itinerary
            </button>
          </div>
        </div>

        {/* Route Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Select Major Highway Route:
            </label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              {PRESET_ROUTES.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.highwayCode}: {route.origin} → {route.destination} ({route.distanceKm} km)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1.5">
              Vehicle Classification (ZINARA Tariff Matrix):
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value as VehicleClass)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="lightVehicle">Light Passenger Car / SUV ($4 USD / 110 ZiG per gate)</option>
              <option value="minibus">Minibus / Commuter Kombi ($6 USD / 165 ZiG per gate)</option>
              <option value="bus">Intercity Coach / Bus ($8 USD / 220 ZiG per gate)</option>
              <option value="heavyTruck">Heavy Truck (3-Axle) ($10 USD / 275 ZiG per gate)</option>
              <option value="haulage">Superlink / Tri-Axle Haulage ($20 USD / 550 ZiG per gate)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => onSelectHighwayOnMap(currentRoute.highwayCode)}
              className="w-full py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              Focus {currentRoute.highwayCode} on Interactive Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Corridor Summary Card */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              <span>National Corridor {currentRoute.highwayCode}</span>
              <span className="text-[#64748B]">·</span>
              <span>Southern African Development Community (SADC) Arterial</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight mt-1 flex items-center gap-3">
              <span>{currentRoute.origin}</span>
              <ArrowRight className="w-5 h-5 text-[#64748B]" />
              <span>{currentRoute.destination}</span>
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-[#64748B] font-medium">Total Distance</div>
              <div className="text-xl font-extrabold text-[#111827] font-mono">{currentRoute.distanceKm} km</div>
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">Estimated Drive</div>
              <div className="text-xl font-extrabold text-[#111827] font-mono">
                {Math.floor(currentRoute.estMinutes / 60)}h {currentRoute.estMinutes % 60}m
              </div>
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium">Corridor Safety</div>
              <div className="text-xl font-extrabold text-[#16A34A] font-mono">
                {currentRoute.corridorSafetyIndex}/100
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid: Tolls, Roadworks, Active Incidents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {/* ZINARA Toll Gate Calculation */}
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#F97316]" />
                ZINARA Toll Gates ({currentRoute.tollCount})
              </span>
              <span className="text-xs text-[#64748B]">Official Gazetted</span>
            </div>

            <div className="space-y-1.5 mb-4">
              {currentRoute.tollGates.map((gate, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-[#111827] py-1 border-b border-[#E2E8F0] last:border-0">
                  <span className="font-medium">{gate}</span>
                  <span className="font-mono text-[#64748B]">${vehicleData.ratePerGateUsd} / ~{vehicleData.ratePerGateZiG} ZiG</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#64748B]">Total Toll Bill ({vehicleData.name})</div>
                <div className="text-base font-extrabold text-[#111827] font-mono">
                  ${totalTollsUsd} USD <span className="text-xs font-normal text-[#64748B]">or</span> {totalTollsZiG} ZiG
                </div>
              </div>
              <span className="text-[10px] text-[#16A34A] font-medium bg-[#16A34A]/10 border border-[#16A34A]/30 px-2 py-0.5 rounded">
                E-Tag Supported
              </span>
            </div>
          </div>

          {/* Active Hazards on this Route */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Active Corridor Hazards ({corridorIncidents.length})
              </span>
              <span className="text-xs text-[#64748B]">Live Reports</span>
            </div>

            {corridorIncidents.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#64748B] flex flex-col items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#16A34A] mb-2" />
                No active critical hazards reported on {currentRoute.highwayCode} currently. Flowing smoothly.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {corridorIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => onOpenIncidentDetail(inc)}
                    className="p-2.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded hover:border-[#2563EB]/40 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-[#111827] truncate">{inc.title}</span>
                      <span className="text-[10px] text-[#64748B] flex-shrink-0">{inc.timestamp}</span>
                    </div>
                    <div className="text-[#64748B] line-clamp-1 mb-1">{inc.locationName}</div>
                    <div className="text-[11px] text-[#F97316] flex items-center gap-2">
                      <span className="font-semibold">{inc.severity.toUpperCase()}</span>
                      <span>·</span>
                      <span>{inc.confirmationsCount} driver confirmations</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Known Roadwork & Safety Advisories */}
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              Highway Engineering & Rest Stops
            </div>

            <div className="space-y-3 text-xs text-[#111827]">
              <div>
                <span className="font-semibold text-[#111827] block mb-1">ERRP II Highway Upgrades:</span>
                <ul className="list-disc pl-4 space-y-1 text-[#64748B]">
                  {currentRoute.roadworkZones.map((zone, idx) => (
                    <li key={idx}>{zone}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-semibold text-[#111827] block mb-1 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-[#2563EB]" /> Recommended Fuel & Service Stops:
                </span>
                <div className="text-[#64748B] leading-relaxed">
                  {currentRoute.fuelStops.join(' · ')}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] text-[#64748B] text-[11px] leading-relaxed">
                <span className="font-semibold text-[#111827]">Captain's Advisory:</span> {currentRoute.notes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
