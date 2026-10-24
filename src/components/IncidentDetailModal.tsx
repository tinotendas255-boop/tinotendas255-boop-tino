import React, { useState } from 'react';
import { RoadIncident, UserRole, IncidentSeverity, IncidentComment } from '../types';
import { AlertTriangle, MapPin, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Share2, Compass, Shield, ShieldCheck, ArrowRight, MessageSquare, Flag, Send, Heart } from 'lucide-react';

interface IncidentDetailModalProps {
  incident: RoadIncident | null;
  onClose: () => void;
  currentUserRole: UserRole;
  onVote: (incidentId: string, type: 'confirm' | 'refute') => void;
  onAddComment?: (incidentId: string, text: string) => void;
  onModeratorVerify?: (incidentId: string) => void;
  onModeratorResolve?: (incidentId: string) => void;
  onModeratorChangeSeverity?: (incidentId: string, severity: IncidentSeverity) => void;
  onModeratorDismiss?: (incidentId: string, reason?: string) => void;
  onViewOnMap?: (incident: RoadIncident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  currentUserRole,
  onVote,
  onAddComment,
  onModeratorVerify,
  onModeratorResolve,
  onModeratorChangeSeverity,
  onModeratorDismiss,
  onViewOnMap,
}) => {
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>('');
  const [helpfulGiven, setHelpfulGiven] = useState<boolean>(false);
  const [flagSubmitted, setFlagSubmitted] = useState<boolean>(false);

  if (!incident) return null;

  const handleShare = () => {
    const text = `RoadLink Zimbabwe Alert: [${incident.severity.toUpperCase()}] ${incident.title}\nHighway: ${incident.highway} (${incident.locationName})\nStatus: ${incident.verificationStatus.toUpperCase()}\nAdvice: ${incident.detourAdvice || 'Proceed with caution'}\nShared via RoadLink Zimbabwe`;

    if (navigator.share) {
      navigator.share({
        title: incident.title,
        text,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    if (onAddComment) {
      onAddComment(incident.id, commentInput.trim());
    }
    setCommentInput('');
  };

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="text-red-700 font-bold uppercase tracking-wider text-xs">CRITICAL / ROAD CLOSURE</span>;
      case 'warning':
        return <span className="text-amber-700 font-bold uppercase tracking-wider text-xs">WARNING / DELAYS</span>;
      case 'advisory':
        return <span className="text-blue-700 font-bold uppercase tracking-wider text-xs">ADVISORY / CAUTION</span>;
      case 'info':
        return <span className="text-slate-600 font-bold uppercase tracking-wider text-xs">INFORMATIONAL / CHECKPOINT</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0B1220]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] max-w-xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F1F5F9] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSeverityBadge(incident.severity)}
            <span className="text-[#64748B]">·</span>
            <span className="text-xs text-[#64748B]">{incident.timestamp}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-[#64748B] hover:text-[#111827] rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
              title="Share alert"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-[#64748B] hover:text-[#111827] rounded-md hover:bg-slate-200 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <div className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-1">
              {incident.highway}
            </div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight leading-snug">
              {incident.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{incident.locationName}</span>
              {incident.isApproximateLocation && (
                <span className="text-[#F97316] font-medium">(Approximate Area)</span>
              )}
              <span>·</span>
              <span className="font-mono">[{incident.coordinates[0].toFixed(4)}, {incident.coordinates[1].toFixed(4)}]</span>
            </div>
          </div>

          {/* Verification Banner */}
          <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            incident.verificationStatus === 'verified'
              ? 'bg-[#16A34A]/10 border-[#16A34A]/30 text-[#16A34A]'
              : incident.verificationStatus === 'resolved'
              ? 'bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B]'
              : 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]'
          }`}>
            <div className="flex items-center gap-2">
              {incident.verificationStatus === 'verified' ? (
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              ) : incident.verificationStatus === 'resolved' ? (
                <CheckCircle2 className="w-4 h-4 text-[#64748B]" />
              ) : (
                <Shield className="w-4 h-4 text-[#F97316]" />
              )}
              <div>
                <span className="font-bold">
                  {incident.verificationStatus === 'verified'
                    ? 'Verified by Highway Safety Desk'
                    : incident.verificationStatus === 'resolved'
                    ? 'Hazard Cleared / Resolved'
                    : 'Community Report (Under Moderation Review)'}
                </span>
                {incident.verifiedBy && (
                  <span className="block text-[11px] text-[#16A34A]">Officer: {incident.verifiedBy}</span>
                )}
                {incident.resolvedAt && (
                  <span className="block text-[11px] text-[#64748B]">Cleared: {incident.resolvedAt}</span>
                )}
              </div>
            </div>

            <div className="text-right text-[11px]">
              <div>Reported by: <span className="font-semibold text-[#111827]">{incident.reporterName}</span></div>
              <div className="text-[#64748B] capitalize">{incident.reporterRole.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
              Incident Situation Report
            </h4>
            <p className="text-sm text-[#111827] leading-relaxed bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-3">
              {incident.description}
            </p>
          </div>

          {/* Detour Advice */}
          {incident.detourAdvice && (
            <div>
              <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
                Detour & Driver Safety Advice
              </h4>
              <p className="text-xs text-[#111827] bg-[#F97316]/10 border border-[#F97316]/30 rounded-lg p-3 leading-relaxed">
                {incident.detourAdvice}
              </p>
            </div>
          )}

          {/* Observed Time & Ongoing Status */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#F1F5F9] p-3 rounded-lg border border-[#E2E8F0]">
            <div>
              <span className="text-[#64748B] block">Direction Affected:</span>
              <span className="font-semibold text-[#111827]">{incident.direction || 'Both Directions'}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Ongoing Status:</span>
              <span className={`font-semibold ${incident.isStillOngoing ? 'text-red-700' : 'text-[#16A34A]'}`}>
                {incident.isStillOngoing ? 'Still Active Hazard' : 'Cleared / Resolved'}
              </span>
            </div>
          </div>

          {/* Community Validation & Helpful Reaction */}
          <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#111827]">
                Driver Consensus:
              </span>
              <span className="text-xs text-[#64748B]">
                {incident.confirmationsCount} confirmed · {incident.refutedCount} refuted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onVote(incident.id, 'confirm')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  incident.userVote === 'confirm'
                    ? 'bg-[#16A34A] text-white border-[#16A34A]'
                    : 'bg-[#F1F5F9] hover:bg-slate-100 text-[#111827] border-[#E2E8F0]'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Still There ({incident.confirmationsCount})
              </button>

              <button
                onClick={() => onVote(incident.id, 'refute')}
                className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  incident.userVote === 'refute'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-[#F1F5F9] hover:bg-slate-100 text-[#111827] border-[#E2E8F0]'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Cleared / Refute ({incident.refutedCount})
              </button>
            </div>
          </div>

          {/* Community Comments & Tips Section */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#64748B]" />
                Motorist Updates & Comments ({incident.comments?.length || 0})
              </h4>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {(!incident.comments || incident.comments.length === 0) ? (
                <div className="text-[#64748B] text-xs py-2 italic">
                  No comments yet. Are you on this route? Post a speed or queue condition update.
                </div>
              ) : (
                incident.comments.map((comm) => (
                  <div key={comm.id} className="p-2.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded text-xs space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                      <span className="font-semibold text-[#111827]">{comm.userName}</span>
                      <span>{comm.timestamp}</span>
                    </div>
                    <p className="text-[#111827]">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post comment input */}
            <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Share queue speed, contraflow or road surface advice..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Post
              </button>
            </form>
          </div>

          {/* Moderator Control Box */}
          {currentUserRole === 'moderator' && (
            <div className="pt-3 border-t-2 border-[#E2E8F0] bg-[#F1F5F9] -mx-6 -mb-6 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  Moderator Action Desk
                </span>
                <span className="text-[11px] text-[#64748B]">Authorized Safety Marshall</span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {incident.verificationStatus !== 'verified' && onModeratorVerify && (
                  <button
                    onClick={() => onModeratorVerify(incident.id)}
                    className="px-3 py-1.5 bg-[#16A34A] hover:bg-green-700 text-white font-semibold rounded cursor-pointer transition-colors"
                  >
                    Verify & Broadcast
                  </button>
                )}

                {incident.verificationStatus !== 'resolved' && onModeratorResolve && (
                  <button
                    onClick={() => onModeratorResolve(incident.id)}
                    className="px-3 py-1.5 bg-[#0B1220] hover:bg-slate-800 text-white font-semibold rounded cursor-pointer transition-colors"
                  >
                    Mark as Resolved / Cleared
                  </button>
                )}

                {onModeratorDismiss && (
                  <button
                    onClick={() => onModeratorDismiss(incident.id, 'Dismissed by safety moderator')}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold rounded cursor-pointer transition-colors"
                  >
                    Dismiss Report
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center justify-between text-xs">
          <span className="text-[#64748B]">
            {copiedShare ? '✓ Alert text copied to clipboard!' : 'RoadLink Zimbabwe Network'}
          </span>
          <div className="flex items-center gap-2">
            {onViewOnMap && (
              <button
                onClick={() => {
                  onViewOnMap(incident);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded font-medium cursor-pointer shadow-xs"
              >
                Center on Map
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#0B1220] hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
