import React, { useState } from 'react';
import { RoadIncident, SocialCommunity, UserRole } from '../types';
import { CommunityReportsView } from './CommunityReportsView';
import { Users, Wrench, Truck, Bus, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SocialCommunitiesViewProps {
  communities: SocialCommunity[];
  onToggleJoinCommunity: (communityId: string) => void;
  incidents: RoadIncident[];
  onSelectIncident: (inc: RoadIncident) => void;
  onOpenReportModal: () => void;
  onVote: (incidentId: string, type: 'confirm' | 'refute') => void;
  currentUserRole: UserRole;
  defaultSubTab?: 'groups' | 'alerts';
}

export const SocialCommunitiesView: React.FC<SocialCommunitiesViewProps> = ({
  communities,
  onToggleJoinCommunity,
  incidents,
  onSelectIncident,
  onOpenReportModal,
  onVote,
  currentUserRole,
  defaultSubTab = 'groups',
}) => {
  const [subTab, setSubTab] = useState<'groups' | 'alerts'>(defaultSubTab);

  const getIcon = (iconType: SocialCommunity['iconType']) => {
    switch (iconType) {
      case 'mechanics':
        return <Wrench className="w-5 h-5 text-[#F97316]" />;
      case 'freight':
        return <Truck className="w-5 h-5 text-[#60A5FA]" />;
      case 'commuters':
        return <Bus className="w-5 h-5 text-[#16A34A]" />;
      default:
        return <Users className="w-5 h-5 text-[#3B82F6]" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Dark Header Switcher */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Zimbabwe Driver Communities & Road Alerts
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Join regional motorist hubs or verify live crowd-reported road incidents.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0B1220] p-1 rounded-xl border border-[#1E293B]">
          <button
            type="button"
            onClick={() => setSubTab('groups')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'groups'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Communities ({communities.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('alerts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              subTab === 'alerts'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hazard Alerts ({incidents.length})</span>
          </button>
        </div>
      </div>

      {subTab === 'groups' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-5 flex flex-col justify-between gap-4 shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#111C2E] border border-[#334155] flex items-center justify-center shrink-0">
                  {getIcon(comm.iconType)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-white truncate">{comm.name}</h3>
                    <span className="text-[11px] font-semibold text-[#60A5FA] tabular-nums shrink-0">
                      {comm.membersLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] block mt-0.5">{comm.category}</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{comm.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setSubTab('alerts')}
                  className="text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] cursor-pointer"
                >
                  View Group Alerts →
                </button>
                <button
                  type="button"
                  onClick={() => onToggleJoinCommunity(comm.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    comm.isJoined
                      ? 'bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40 hover:bg-[#16A34A]/30'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                  }`}
                >
                  {comm.isJoined && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{comm.isJoined ? 'Joined' : 'Join Group'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[#111827]">
          <CommunityReportsView
            incidents={incidents}
            onSelectIncident={onSelectIncident}
            onOpenReportModal={onOpenReportModal}
            onVote={onVote}
            currentUserRole={currentUserRole}
          />
        </div>
      )}
    </div>
  );
};
