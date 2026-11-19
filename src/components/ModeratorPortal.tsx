import React, { useState } from 'react';
import { RoadIncident, ModeratorActionLog, IncidentSeverity, MediaWireDelivery } from '../types';
import {
  CANONICAL_MEDIA_HOUSES,
  getEffectiveIncidentStatus,
  normalizeMediaHouseList,
} from '../utils/mediaHouses';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Megaphone,
  Eye,
  Radio,
  Send,
  Clock,
  Newspaper,
  Check,
} from 'lucide-react';

interface ModeratorPortalProps {
  incidents: RoadIncident[];
  auditLogs: ModeratorActionLog[];
  emergencyBanner: string | null;
  onVerifyIncident: (id: string, note?: string, selectedMediaOutlets?: string[]) => void;
  onDispatchMedia: (id: string, selectedMediaOutlets: string[]) => void;
  onResolveIncident: (id: string, note?: string) => void;
  onDismissIncident: (id: string, reason: string) => void;
  onChangeSeverity: (id: string, newSeverity: IncidentSeverity) => void;
  onUpdateEmergencyBanner: (banner: string | null) => void;
  onOpenIncidentDetail: (incident: RoadIncident) => void;
}

export const ModeratorPortal: React.FC<ModeratorPortalProps> = ({
  incidents,
  auditLogs,
  emergencyBanner,
  onVerifyIncident,
  onDispatchMedia,
  onResolveIncident,
  onDismissIncident,
  onChangeSeverity,
  onUpdateEmergencyBanner,
  onOpenIncidentDetail,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pending' | 'active' | 'resolved' | 'emergency_banner' | 'audit_log'
  >('pending');
  const [bannerInput, setBannerInput] = useState<string>(emergencyBanner || '');
  const [dismissReasonModalId, setDismissReasonModalId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState<string>('Duplicate or unverified information');
  const [noteByIncident, setNoteByIncident] = useState<Record<string, string>>({});
  const [mediaSelectionOverrides, setMediaSelectionOverrides] = useState<Record<string, string[]>>({});

  const pendingReports = incidents.filter((inc) => getEffectiveIncidentStatus(inc) === 'pending');
  const activeReports = incidents.filter((inc) => getEffectiveIncidentStatus(inc) === 'verified');
  const resolvedReports = incidents.filter((inc) => getEffectiveIncidentStatus(inc) === 'resolved');

  const getSelectedOutletsForIncident = (incident: RoadIncident): string[] => {
    if (mediaSelectionOverrides[incident.id]) {
      return mediaSelectionOverrides[incident.id];
    }
    return normalizeMediaHouseList(incident.syndicatedMediaOutlets);
  };

  const toggleOutletForIncident = (incident: RoadIncident, outletName: string) => {
    const current = getSelectedOutletsForIncident(incident);
    const next = current.includes(outletName)
      ? current.filter((o) => o !== outletName)
      : [...current, outletName];
    setMediaSelectionOverrides((prev) => ({ ...prev, [incident.id]: next }));
  };

  const getDispatchBadgeInfo = (
    incident: RoadIncident,
    outletName: string
  ): { label: string; className: string } => {
    const match: MediaWireDelivery | undefined = incident.mediaDispatches?.find(
      (d) => d.outletName.toLowerCase() === outletName.toLowerCase()
    );
    if (!match) {
      return {
        label: 'Not Sent',
        className: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
      };
    }
    if (match.status === 'published') {
      return {
        label: 'Published to Gazette',
        className: 'bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/30',
      };
    }
    if (match.status === 'acknowledged') {
      return {
        label: 'Received & Acknowledged',
        className: 'bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/30',
      };
    }
    if (match.status === 'delivered') {
      return {
        label: 'Delivered to Newsroom',
        className: 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30',
      };
    }
    return {
      label: 'Queued for Admin Approval',
      className: 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30',
    };
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEmergencyBanner(bannerInput.trim() ? bannerInput.trim() : null);
  };

  const handleClearBanner = () => {
    setBannerInput('');
    onUpdateEmergencyBanner(null);
  };

  const handleConfirmDismiss = () => {
    if (dismissReasonModalId) {
      onDismissIncident(dismissReasonModalId, dismissReason);
      setDismissReasonModalId(null);
    }
  };

  const totalDispatchedIncidents = incidents.filter(
    (inc) => (inc.mediaDispatches && inc.mediaDispatches.length > 0) || (inc.syndicatedMediaOutlets && inc.syndicatedMediaOutlets.length > 0)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1220] text-white rounded-2xl p-5 sm:p-6 border border-[#1E293B] shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16A34A] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Highway Safety Administration & Moderator Console</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Corridor Verification & Media Wire Dispatch Desk
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
              Review incoming community hazard reports, verify accuracy, and dispatch official road alerts exclusively to the media houses selected by the reporter or moderator.
            </p>
          </div>

          {/* Tab Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-[#F97316] text-white font-bold shadow-sm'
                  : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <span>Pending Review</span>
              <span className="px-1.5 py-0.2 bg-[#070B14] text-white text-[10px] rounded-full font-mono">
                {pendingReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                  : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <span>Live Verified</span>
              <span className="px-1.5 py-0.2 bg-[#070B14] text-white text-[10px] rounded-full font-mono">
                {activeReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'resolved'
                  ? 'bg-[#16A34A] text-white font-bold shadow-sm'
                  : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <span>Resolved</span>
              <span className="px-1.5 py-0.2 bg-[#070B14] text-white text-[10px] rounded-full font-mono">
                {resolvedReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('emergency_banner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'emergency_banner'
                  ? 'bg-red-600 text-white font-bold shadow-sm'
                  : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Emergency Broadcast</span>
              {emergencyBanner && <span className="w-2 h-2 rounded-full bg-red-300 animate-pulse"></span>}
            </button>

            <button
              onClick={() => setActiveTab('audit_log')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit_log'
                  ? 'bg-[#FFFFFF] text-[#111827] font-bold shadow-sm'
                  : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              <span>Audit Trail</span>
              <span className="px-1.5 py-0.2 bg-[#1E293B] text-white text-[10px] rounded-full font-mono">
                {auditLogs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Media Wire Delivery Summary Strip */}
        <div className="pt-3 border-t border-[#1E293B] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#111C2E] border border-[#1E293B] rounded-lg px-3 py-2">
            <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Awaiting Admin</div>
            <div className="text-base font-bold text-[#F97316] font-mono">{pendingReports.length}</div>
          </div>
          <div className="bg-[#111C2E] border border-[#1E293B] rounded-lg px-3 py-2">
            <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Live Verified</div>
            <div className="text-base font-bold text-[#60A5FA] font-mono">{activeReports.length}</div>
          </div>
          <div className="bg-[#111C2E] border border-[#1E293B] rounded-lg px-3 py-2">
            <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Cleared / Resolved</div>
            <div className="text-base font-bold text-[#16A34A] font-mono">{resolvedReports.length}</div>
          </div>
          <div className="bg-[#111C2E] border border-[#1E293B] rounded-lg px-3 py-2">
            <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Media-Wired Reports</div>
            <div className="text-base font-bold text-white font-mono">{totalDispatchedIncidents}</div>
          </div>
        </div>
      </div>

      {/* Tab: Pending Community Submissions */}
      {activeTab === 'pending' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Incoming Community Reports ({pendingReports.length})
              </h3>
              <p className="text-xs text-[#64748B]">
                Verify reports with patrol teams and dispatch directly to the reporter’s selected media houses.
              </p>
            </div>
          </div>

          {pendingReports.length === 0 ? (
            <div className="py-12 text-center text-[#64748B]">
              <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#111827]">All community reports have been processed</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                New citizen or driver hazard reports will appear here immediately for verification & media routing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReports.map((incident) => {
                const selectedOutlets = getSelectedOutletsForIncident(incident);
                const noteValue = noteByIncident[incident.id] ?? '';

                return (
                  <div
                    key={incident.id}
                    className="p-4 sm:p-5 border border-[#E2E8F0] rounded-xl hover:border-[#2563EB]/40 transition-colors bg-[#F1F5F9]/60 space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-[#F97316]/15 text-[#F97316] font-bold text-[10px] uppercase">
                            Pending Admin Review
                          </span>
                          <span className="font-semibold text-[#111827]">{incident.highway}</span>
                          <span>·</span>
                          <span>{incident.locationName}</span>
                          <span>·</span>
                          <span className="text-[#F97316] font-semibold uppercase">{incident.severity}</span>
                          <span>·</span>
                          <span>{incident.timestamp}</span>
                        </div>

                        <h4 className="text-base font-bold text-[#111827]">{incident.title}</h4>
                        <p className="text-xs text-[#64748B] leading-relaxed">{incident.description}</p>

                        <div className="flex items-center gap-3 text-[11px] text-[#64748B] flex-wrap">
                          <span>
                            Reported by:{' '}
                            <span className="font-semibold text-[#111827]">{incident.reporterName}</span> (
                            {incident.reporterRole.replace('_', ' ')})
                          </span>
                          <span>·</span>
                          <span>{incident.confirmationsCount} driver confirmations</span>
                          {incident.detourAdvice && (
                            <>
                              <span>·</span>
                              <span className="text-[#F97316] font-semibold">Detour: {incident.detourAdvice}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Severity & Quick Inspect */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          aria-label="Adjust severity"
                          value={incident.severity}
                          onChange={(e) => onChangeSeverity(incident.id, e.target.value as IncidentSeverity)}
                          className="bg-[#FFFFFF] border border-[#E2E8F0] text-xs rounded-lg px-2.5 py-1.5 font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        >
                          <option value="critical">Critical</option>
                          <option value="warning">Warning</option>
                          <option value="advisory">Advisory</option>
                          <option value="info">Info</option>
                        </select>

                        <button
                          onClick={() => onOpenIncidentDetail(incident)}
                          className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-slate-100 text-[#111827] border border-[#E2E8F0] rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </div>

                    {/* Media House Routing Panel */}
                    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                          <Radio className="w-4 h-4 text-[#2563EB]" />
                          <span>
                            Media House Recipients ({selectedOutlets.length} selected — only selected outlets receive this dispatch)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#64748B]">
                          Reporter requested: {incident.syndicatedMediaOutlets?.length ? incident.syndicatedMediaOutlets.join(', ') : 'None selected'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {CANONICAL_MEDIA_HOUSES.map((house) => {
                          const isSelected = selectedOutlets.includes(house.canonicalName);
                          const badge = getDispatchBadgeInfo(incident, house.canonicalName);

                          return (
                            <button
                              key={house.id}
                              type="button"
                              onClick={() => toggleOutletForIncident(incident, house.canonicalName)}
                              className={`p-2 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2563EB]/5 border-[#2563EB]/40'
                                  : 'bg-[#F1F5F9]/60 border-[#E2E8F0] opacity-75 hover:opacity-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                    isSelected
                                      ? 'bg-[#2563EB] text-white'
                                      : 'bg-white border border-[#E2E8F0] text-transparent'
                                  }`}
                                >
                                  <Check className="w-3 h-3" />
                                </span>
                                <span className="text-xs font-semibold text-[#111827] truncate">
                                  {house.icon} {house.canonicalName}
                                </span>
                              </div>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold flex-shrink-0 ${badge.className}`}
                              >
                                {isSelected ? (badge.label === 'Not Sent' ? 'Will Send' : badge.label) : 'Skipped'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Moderator Note + Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                      <input
                        type="text"
                        value={noteValue}
                        onChange={(e) =>
                          setNoteByIncident((prev) => ({ ...prev, [incident.id]: e.target.value }))
                        }
                        placeholder="Optional verification / patrol dispatch note..."
                        className="flex-1 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            onVerifyIncident(
                              incident.id,
                              noteValue.trim() || 'Verified via corridor safety patrol',
                              selectedOutlets
                            )
                          }
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {selectedOutlets.length > 0
                              ? `Verify & Deliver to ${selectedOutlets.length} Media`
                              : 'Verify & Publish'}
                          </span>
                        </button>

                        <button
                          onClick={() => setDismissReasonModalId(incident.id)}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Live Verified Hazards */}
      {activeTab === 'active' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Active Verified Hazards on Zimbabwe Corridors ({activeReports.length})
              </h3>
              <p className="text-xs text-[#64748B]">
                Manage live alerts, track media house receipt, relay dispatches to specific outlets, or mark cleared.
              </p>
            </div>
          </div>

          {activeReports.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#64748B]">
              No active verified hazards right now.
            </div>
          ) : (
            <div className="space-y-4">
              {activeReports.map((incident) => {
                const selectedOutlets = getSelectedOutletsForIncident(incident);

                return (
                  <div
                    key={incident.id}
                    className="p-4 border border-[#E2E8F0] rounded-xl hover:border-[#2563EB]/40 transition-colors space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
                          <span className="font-semibold text-[#2563EB]">{incident.highway}</span>
                          <span>·</span>
                          <span>{incident.locationName}</span>
                          <span>·</span>
                          <span className="font-semibold uppercase text-[#111827]">{incident.severity}</span>
                          <span>·</span>
                          <span>{incident.timestamp}</span>
                        </div>

                        <h4
                          onClick={() => onOpenIncidentDetail(incident)}
                          className="text-base font-bold text-[#111827] hover:text-[#2563EB] cursor-pointer"
                        >
                          {incident.title}
                        </h4>
                        <p className="text-xs text-[#64748B]">{incident.description}</p>

                        <div className="flex items-center gap-2 text-[11px] text-[#64748B] flex-wrap">
                          <span className="text-[#16A34A] font-semibold">
                            ✓ Verified by {incident.verifiedBy || 'Operations Desk'}
                          </span>
                          <span>·</span>
                          <span>{incident.confirmationsCount} driver confirmations</span>
                          {incident.mediaDispatchedAt && (
                            <>
                              <span>·</span>
                              <span className="text-[#2563EB] font-semibold">
                                Wired to media {incident.mediaDispatchedAt}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Resolve or Adjust */}
                      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                        <button
                          onClick={() => onOpenIncidentDetail(incident)}
                          className="px-2.5 py-1.5 bg-[#F1F5F9] hover:bg-slate-200 text-[#111827] rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <select
                          value={incident.severity}
                          onChange={(e) => onChangeSeverity(incident.id, e.target.value as IncidentSeverity)}
                          className="bg-[#F1F5F9] border border-[#E2E8F0] text-xs rounded-lg px-2 py-1.5 font-medium text-[#111827] focus:outline-none"
                        >
                          <option value="critical">Critical</option>
                          <option value="warning">Warning</option>
                          <option value="advisory">Advisory</option>
                          <option value="info">Info</option>
                        </select>

                        <button
                          onClick={() =>
                            onResolveIncident(incident.id, 'Hazard cleared; normal traffic flow restored')
                          }
                          className="px-3 py-1.5 bg-[#0B1220] hover:bg-[#2563EB] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Mark Cleared / Resolved
                        </button>
                      </div>
                    </div>

                    {/* Media Dispatch Status & Selective Relay */}
                    <div className="bg-[#F1F5F9]/70 border border-[#E2E8F0] rounded-lg p-3 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#111827] flex items-center gap-1.5">
                          <Newspaper className="w-3.5 h-3.5 text-[#2563EB]" />
                          Media House Wire Delivery ({selectedOutlets.length} selected)
                        </span>
                        <button
                          type="button"
                          onClick={() => onDispatchMedia(incident.id, selectedOutlets)}
                          className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md text-[11px] font-bold cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                        >
                          <Send className="w-3 h-3" />
                          <span>Deliver / Sync Selected Media</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {CANONICAL_MEDIA_HOUSES.map((house) => {
                          const isSelected = selectedOutlets.includes(house.canonicalName);
                          const badge = getDispatchBadgeInfo(incident, house.canonicalName);

                          return (
                            <button
                              key={house.id}
                              type="button"
                              onClick={() => toggleOutletForIncident(incident, house.canonicalName)}
                              className={`px-2 py-1 rounded-md border text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[#FFFFFF] border-[#2563EB]/40 text-[#111827] font-semibold'
                                  : 'bg-[#FFFFFF]/50 border-[#E2E8F0] text-[#64748B]'
                              }`}
                            >
                              <span>{isSelected ? '✓' : '+'}</span>
                              <span>{house.canonicalName}</span>
                              {isSelected && (
                                <span className={`text-[9px] px-1 py-0.2 rounded border font-mono ${badge.className}`}>
                                  {badge.label === 'Not Sent' ? 'Ready' : badge.label}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Resolved History */}
      {activeTab === 'resolved' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#111827]">
              Cleared & Resolved Incidents ({resolvedReports.length})
            </h3>
            <p className="text-xs text-[#64748B]">
              Historical log of cleared corridor hazards and completed roadworks.
            </p>
          </div>

          {resolvedReports.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#64748B]">
              No resolved incidents recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedReports.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 border border-[#E2E8F0] rounded-xl bg-[#F1F5F9]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
                      <span className="px-2 py-0.5 bg-[#16A34A]/15 text-[#16A34A] rounded font-bold text-[10px]">
                        CLEARED
                      </span>
                      <span className="font-semibold text-[#111827]">{incident.highway}</span>
                      <span>·</span>
                      <span>{incident.locationName}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#111827]">{incident.title}</h4>
                    <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{incident.resolvedAt || 'Resolved by Safety Desk'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenIncidentDetail(incident)}
                    className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-100 text-[#111827] rounded-lg text-xs font-semibold cursor-pointer self-start sm:self-center"
                  >
                    View Record
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Emergency Highway Broadcast Banner */}
      {activeTab === 'emergency_banner' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-red-600" />
                Emergency Highway Alert Broadcast
              </h3>
              <p className="text-xs text-[#64748B]">
                Publishes a high-visibility, top-level warning banner across RoadLink Zimbabwe for severe floods, complete corridor closures, or critical multi-vehicle incidents.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Emergency Banner Text:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. CRITICAL WEATHER ALERT: Heavy flash flooding reported at Runde River Bridge on A4 Harare-Beitbridge highway. Heavy freight diverted via Chiredzi. Proceed with extreme caution."
                value={bannerInput}
                onChange={(e) => setBannerInput(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-3 text-xs font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {emergencyBanner && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold uppercase tracking-wider block mb-0.5">Currently Active Broadcast:</span>
                  <span>{emergencyBanner}</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearBanner}
                  className="text-red-700 hover:text-red-900 text-xs font-bold underline cursor-pointer flex-shrink-0"
                >
                  Deactivate
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                {emergencyBanner ? 'Update Broadcast Banner' : 'Publish Emergency Banner'}
              </button>

              {emergencyBanner && (
                <button
                  type="button"
                  onClick={handleClearBanner}
                  className="px-4 py-2 bg-[#F1F5F9] hover:bg-slate-200 text-[#111827] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel Broadcast
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tab: Moderator Audit Log */}
      {activeTab === 'audit_log' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Moderation Action & Media Dispatch Audit Trail
              </h3>
              <p className="text-xs text-[#64748B]">
                Immutable chronological log of all verification, media routing, resolution, and dismissal actions.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0] text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                        log.action === 'verified'
                          ? 'bg-[#16A34A]/15 text-[#16A34A]'
                          : log.action === 'resolved'
                          ? 'bg-[#2563EB]/15 text-[#2563EB]'
                          : log.action === 'dismissed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#F97316]/15 text-[#F97316]'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-[#111827]">{log.incidentTitle}</span>
                  </div>

                  {log.note && <p className="text-[#64748B] mb-1">{log.note}</p>}

                  <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                    <span>
                      Officer: <span className="text-[#111827] font-medium">{log.moderatorName}</span>
                    </span>
                    <span>·</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dismiss Reason Modal */}
      {dismissReasonModalId && (
        <div className="fixed inset-0 z-[2200] bg-[#0B1220]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#111827] mb-2">Dismiss Incident Report</h3>
            <p className="text-xs text-[#64748B] mb-3">
              Please specify the audit reason for dismissing this report.
            </p>

            <select
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#111827] font-medium mb-4 focus:outline-none"
            >
              <option value="Duplicate or unverified information">Duplicate of existing report</option>
              <option value="Hazard cleared prior to patrol arrival">Hazard already cleared</option>
              <option value="Insufficient location details to dispatch">Insufficient landmark or location details</option>
              <option value="Spam or test submission">Erroneous or test submission</option>
            </select>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDismissReasonModalId(null)}
                className="px-3 py-1.5 bg-[#F1F5F9] text-[#64748B] rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDismiss}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-700"
              >
                Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
