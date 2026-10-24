import React, { useState } from 'react';
import { RoadIncident, ModeratorActionLog, IncidentSeverity } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Megaphone, Trash2, Edit3, Clock, User, Filter, Eye } from 'lucide-react';

interface ModeratorPortalProps {
  incidents: RoadIncident[];
  auditLogs: ModeratorActionLog[];
  emergencyBanner: string | null;
  onVerifyIncident: (id: string, note?: string) => void;
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
  onResolveIncident,
  onDismissIncident,
  onChangeSeverity,
  onUpdateEmergencyBanner,
  onOpenIncidentDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'emergency_banner' | 'audit_log'>('pending');
  const [bannerInput, setBannerInput] = useState<string>(emergencyBanner || '');
  const [dismissReasonModalId, setDismissReasonModalId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState<string>('Duplicate or unverified information');

  const pendingReports = incidents.filter((inc) => inc.status === 'unverified');
  const activeReports = incidents.filter((inc) => inc.status === 'verified');
  const resolvedReports = incidents.filter((inc) => inc.status === 'resolved');

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B1220] text-white rounded-xl p-5 border border-[#1E293B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16A34A] mb-1">
            <ShieldCheck className="w-4 h-4" />
            Highway Safety Administration & Moderator Console
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Corridor Verification & Incident Operations Desk
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Verification workflow for community hazard reports, emergency highway broadcast banners, and resolution audit records.
          </p>
        </div>

        {/* Tab Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-[#F97316] text-white font-bold'
                : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
            }`}
          >
            <span>Pending Review</span>
            <span className="px-1.5 py-0.2 bg-[#070B14] text-white text-[10px] rounded-full">
              {pendingReports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-[#2563EB] text-white font-bold'
                : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
            }`}
          >
            <span>Live Verified</span>
            <span className="px-1.5 py-0.2 bg-[#070B14] text-white text-[10px] rounded-full">
              {activeReports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('emergency_banner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'emergency_banner'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Emergency Broadcast</span>
            {emergencyBanner && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>}
          </button>

          <button
            onClick={() => setActiveTab('audit_log')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit_log'
                ? 'bg-[#FFFFFF] text-[#111827] font-bold'
                : 'bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8]'
            }`}
          >
            <span>Audit Trail</span>
            <span className="px-1.5 py-0.2 bg-[#1E293B] text-white text-[10px] rounded-full">
              {auditLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab: Pending Community Submissions */}
      {activeTab === 'pending' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Incoming Community Reports ({pendingReports.length})
              </h3>
              <p className="text-xs text-[#64748B]">
                Verify with patrol officers, escalate to live hazard alerts, or dismiss erroneous reports.
              </p>
            </div>
          </div>

          {pendingReports.length === 0 ? (
            <div className="py-12 text-center text-[#64748B]">
              <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#111827]">All community reports have been processed</p>
              <p className="text-xs text-[#64748B] mt-0.5">New driver hazard reports will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 border border-[#E2E8F0] rounded-lg hover:border-blue-300 transition-colors bg-[#F1F5F9]/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
                      <span className="font-semibold text-[#111827]">{incident.highway}</span>
                      <span>·</span>
                      <span>{incident.locationName}</span>
                      <span>·</span>
                      <span className="text-[#F97316] font-semibold uppercase">{incident.severity}</span>
                      <span>·</span>
                      <span>{incident.timestamp}</span>
                    </div>

                    <h4 className="text-base font-bold text-[#111827] mb-1">{incident.title}</h4>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-2">{incident.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                      <span>Reported by: <span className="font-medium text-[#111827]">{incident.reporterName}</span> ({incident.reporterRole})</span>
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

                  {/* Moderator Fast Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onOpenIncidentDetail(incident)}
                      className="px-2.5 py-1.5 bg-[#F1F5F9] hover:bg-slate-200 text-[#111827] rounded text-xs font-medium cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onVerifyIncident(incident.id, 'Verified via corridor safety patrol')}
                      className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verify & Publish
                    </button>

                    <button
                      onClick={() => setDismissReasonModalId(incident.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-medium cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Live Verified Hazards */}
      {activeTab === 'active' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Active Verified Hazards on Zimbabwe Corridors ({activeReports.length})
              </h3>
              <p className="text-xs text-[#64748B]">
                Mark as resolved when road crews finish, or adjust severity for evolving situations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {activeReports.map((incident) => (
              <div
                key={incident.id}
                className="p-4 border border-[#E2E8F0] rounded-lg hover:border-blue-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
                    <span className="font-semibold text-[#2563EB]">{incident.highway}</span>
                    <span>·</span>
                    <span>{incident.locationName}</span>
                    <span>·</span>
                    <span className="font-semibold uppercase text-[#111827]">{incident.severity}</span>
                    <span>·</span>
                    <span>{incident.timestamp}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#111827] mb-1">{incident.title}</h4>
                  <p className="text-xs text-[#64748B] mb-2">{incident.description}</p>

                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span className="text-[#16A34A] font-medium">✓ Verified by {incident.verifiedBy || 'Operations Desk'}</span>
                    <span>·</span>
                    <span>{incident.confirmationsCount} driver confirmations</span>
                  </div>
                </div>

                {/* Resolve or Adjust */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={incident.severity}
                    onChange={(e) => onChangeSeverity(incident.id, e.target.value as IncidentSeverity)}
                    className="bg-[#F1F5F9] border border-[#E2E8F0] text-xs rounded px-2 py-1.5 font-medium text-[#111827] focus:outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="advisory">Advisory</option>
                    <option value="info">Info</option>
                  </select>

                  <button
                    onClick={() => onResolveIncident(incident.id, 'Hazard cleared; normal traffic flow restored')}
                    className="px-3 py-1.5 bg-[#0B1220] hover:bg-[#2563EB] text-white rounded text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Mark Cleared / Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Emergency Highway Broadcast Banner */}
      {activeTab === 'emergency_banner' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-red-600" />
                Emergency Highway Alert Broadcast
              </h3>
              <p className="text-xs text-slate-500">
                Publishes a high-visibility, top-level warning banner across RoadLink Zimbabwe for severe floods, complete corridor closures, or critical multi-vehicle incidents.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Emergency Banner Text:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. CRITICAL WEATHER ALERT: Heavy flash flooding reported at Runde River Bridge on A4 Harare-Beitbridge highway. Heavy freight diverted via Chiredzi. Proceed with extreme caution."
                value={bannerInput}
                onChange={(e) => setBannerInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
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

            <div className="flex items-center gap-3">
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Moderation Action & Resolution Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all verification, resolution, and dismissal actions.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                      log.action === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.action === 'resolved'
                        ? 'bg-blue-100 text-blue-800'
                        : log.action === 'dismissed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-900">{log.incidentTitle}</span>
                  </div>

                  {log.note && <p className="text-slate-600 mb-1">{log.note}</p>}

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Officer: <span className="text-slate-700 font-medium">{log.moderatorName}</span></span>
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
        <div className="fixed inset-0 z-[2200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">Dismiss Incident Report</h3>
            <p className="text-xs text-slate-600 mb-3">
              Please specify the audit reason for dismissing this report.
            </p>

            <select
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium mb-4 focus:outline-none"
            >
              <option value="Duplicate or unverified information">Duplicate of existing report</option>
              <option value="Hazard cleared prior to patrol arrival">Hazard already cleared</option>
              <option value="Insufficient location details to dispatch">Insufficient landmark or location details</option>
              <option value="Spam or test submission">Erroneous or test submission</option>
            </select>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDismissReasonModalId(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDismiss}
                className="px-4 py-1.5 bg-rose-600 text-white rounded text-xs font-bold cursor-pointer hover:bg-rose-700"
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
