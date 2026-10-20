import React, { useState } from 'react';
import { TransportOperator } from '../types';
import { TRANSPORT_OPERATORS } from '../data/mockRoadData';
import { Bus, Truck, Phone, MessageSquare, MapPin, ShieldCheck, Search, Filter, ExternalLink, Briefcase, Sparkles, Building2, Layers } from 'lucide-react';

interface TransportOperatorsProps {
  onSelectRouteOnMap?: (routeKeyword: string) => void;
}

export const TransportOperators: React.FC<TransportOperatorsProps> = ({ onSelectRouteOnMap }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showBusinessPreview, setShowBusinessPreview] = useState<boolean>(false);

  const filteredOperators = TRANSPORT_OPERATORS.filter((op) => {
    if (typeFilter !== 'all' && op.type !== typeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = op.name.toLowerCase().includes(q);
      const matchRoutes = op.primaryRoutes.some((r) => r.toLowerCase().includes(q));
      const matchTerminals = op.mainTerminals.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchRoutes && !matchTerminals) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Bus className="w-5 h-5 text-emerald-600" />
              Zimbabwe Transport Operator Directory & Terminal Network
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Verified passenger coaches, cross-border bus lines, commuter associations, and heavy freight hauliers.
            </p>
          </div>

          <button
            onClick={() => setShowBusinessPreview(!showBusinessPreview)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>Operator B2B Architecture Preview</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by operator, route (e.g. Beitbridge, Bulawayo), or rank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Fleets
            </button>
            <button
              onClick={() => setTypeFilter('Intercity Coach')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === 'Intercity Coach'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Intercity Coaches
            </button>
            <button
              onClick={() => setTypeFilter('Cross-Border Bus')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === 'Cross-Border Bus'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Cross-Border Lines
            </button>
            <button
              onClick={() => setTypeFilter('Heavy Freight & Logistics')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                typeFilter === 'Heavy Freight & Logistics'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Heavy Freight
            </button>
          </div>
        </div>
      </div>

      {/* Operator B2B Architecture Preview Box (Ready for future expansion) */}
      {showBusinessPreview && (
        <div className="bg-slate-50 border-2 border-dashed border-emerald-500/50 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Future Capabilities Architecture: Transport Operator Business Suite
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              Specification Draft
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            In accordance with platform guidelines, the following capabilities are pre-architected into the data schema and ready for activation. <strong>Note:</strong> Paid features and advertisements are not mandatory for basic application functionality, and RoadLink does not claim active commercial agreements or paying partnerships that do not currently exist.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                Fleet Telemetry & Tracking
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Integration hooks for GPS OBD-II telematics to automatically map fleet buses on corridors and detect unexpected route stalls.
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Schedule & Terminal Broadcasts
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Direct dispatch tool for bus operators to notify passengers of departure rank changes at Road Port or Renkini, and weather delays.
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Transparent Sponsored Travel
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Strict [SPONSORED TRAVEL INFORMATION] labelling standard protecting community safety feeds from commercial bias.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Operators List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOperators.map((operator) => (
          <div
            key={operator.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with Type & Verified badge */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">{operator.type}</span>
                  <span>·</span>
                  <span>{operator.fleetSizeEstimate}</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>TSCZ Verified</span>
                </div>
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
                {operator.name}
              </h3>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>HQ: {operator.headquarters}</span>
              </div>

              {/* Routes */}
              <div className="mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Primary Highway Routes:
                </span>
                <div className="flex flex-wrap gap-1 text-xs">
                  {operator.primaryRoutes.map((route, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium"
                    >
                      {route}
                    </span>
                  ))}
                </div>
              </div>

              {/* Terminals */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Main Departure Ranks & Depots:
                </span>
                <div className="text-xs text-slate-600">
                  {operator.mainTerminals.join(' · ')}
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${operator.phone}`}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-slate-600" />
                  <span>Call Desk</span>
                </a>

                {operator.whatsapp && (
                  <a
                    href={`https://wa.me/${operator.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-medium transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              <span className="text-[11px] text-slate-400">
                {operator.bookingChannel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
