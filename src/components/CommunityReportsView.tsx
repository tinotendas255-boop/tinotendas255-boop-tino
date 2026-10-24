import React, { useState } from 'react';
import { RoadIncident, UserRole } from '../types';
import { AlertTriangle, Filter, Search, ThumbsUp, ThumbsDown, MapPin, CheckCircle2, Clock, Shield, ArrowUpRight } from 'lucide-react';

interface CommunityReportsViewProps {
  incidents: RoadIncident[];
  onSelectIncident: (incident: RoadIncident) => void;
  onOpenReportModal: () => void;
  onVote: (incidentId: string, type: 'confirm' | 'refute') => void;
  currentUserRole: UserRole;
}

export const CommunityReportsView: React.FC<CommunityReportsViewProps> = ({
  incidents,
  onSelectIncident,
  onOpenReportModal,
  onVote,
  currentUserRole,
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [highwayFilter, setHighwayFilter] = useState<string>('all');

  const filtered = incidents.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (highwayFilter !== 'all' && !item.highway.toLowerCase().includes(highwayFilter.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.locationName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      {/* Search and Action Bar */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#F97316]" />
              Community Road Reports & Driver Hazard Feed
            </h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              Crowdsourced alerts from motorists, haulage operators, and intercity commuters across Zimbabwe.
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>+ Report New Incident</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by town, bridge, or hazard..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">All Statuses ({incidents.length})</option>
              <option value="unverified">Pending Verification</option>
              <option value="verified">Verified Reports</option>
              <option value="resolved">Resolved / Cleared</option>
            </select>
          </div>

          <div>
            <select
              value={highwayFilter}
              onChange={(e) => setHighwayFilter(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">All Highways</option>
              <option value="A4">A4 (Harare - Beitbridge)</option>
              <option value="A5">A5 (Harare - Bulawayo)</option>
              <option value="A8">A8 (Bulawayo - Victoria Falls)</option>
              <option value="A1">A1 (Harare - Chirundu)</option>
              <option value="A3">A3 (Harare - Mutare)</option>
              <option value="Harare">Harare Urban</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-12 text-center text-[#64748B]">
            <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#111827]">No incident reports match your criteria</p>
            <p className="text-xs text-[#64748B] mt-1">Try resetting the filters or submit a new report.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-sm hover:border-[#2563EB]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                {/* Meta header */}
                <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1.5 flex-wrap">
                  <span className="font-semibold text-[#2563EB]">{item.highway}</span>
                  <span>·</span>
                  <span className="text-[#111827] font-medium">{item.locationName}</span>
                  <span>·</span>
                  <span className="capitalize">{item.timestamp}</span>
                  <span>·</span>
                  <span className={`font-bold uppercase tracking-wider text-[11px] ${
                    item.severity === 'critical'
                      ? 'text-red-700'
                      : item.severity === 'warning'
                      ? 'text-[#F97316]'
                      : 'text-[#2563EB]'
                  }`}>
                    {item.severity}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectIncident(item)}
                  className="text-base font-bold text-[#111827] leading-snug cursor-pointer hover:text-[#2563EB] transition-colors mb-1.5"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-[#64748B] leading-relaxed mb-3 line-clamp-2">
                  {item.description}
                </p>

                {item.detourAdvice && (
                  <div className="text-xs text-[#111827] bg-[#F97316]/10 border border-[#F97316]/30 rounded px-2.5 py-1 mb-2 inline-block">
                    <span className="font-semibold text-[#F97316]">Detour / Caution:</span> {item.detourAdvice}
                  </div>
                )}

                <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                  <span>Reported by: <span className="font-medium text-[#111827]">{item.reporterName}</span> ({item.reporterRole})</span>
                  <span>·</span>
                  <span>{item.status === 'verified' ? '✓ Verified by Safety Desk' : item.status === 'resolved' ? '✓ Cleared' : '⏳ Pending review'}</span>
                </div>
              </div>

              {/* Voting and Detail Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={() => onVote(item.id, 'confirm')}
                  title="Confirm hazard is still present"
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    item.userVote === 'confirm'
                      ? 'bg-[#16A34A] text-white border-[#16A34A]'
                      : 'bg-[#F1F5F9] hover:bg-slate-100 text-[#111827] border-[#E2E8F0]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{item.confirmationsCount}</span>
                </button>

                <button
                  onClick={() => onVote(item.id, 'refute')}
                  title="Report hazard cleared"
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    item.userVote === 'refute'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-[#F1F5F9] hover:bg-slate-100 text-[#111827] border-[#E2E8F0]'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{item.refutedCount}</span>
                </button>

                <button
                  onClick={() => onSelectIncident(item)}
                  className="px-3.5 py-1.5 bg-[#0B1220] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
