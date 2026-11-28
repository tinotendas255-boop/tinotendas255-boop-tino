import React from 'react';
import { SocialCommunity } from '../types';
import {
  PhoneCall,
  MapPin,
  Flame,
  TrendingUp,
  Users,
  Wrench,
  Truck,
  Bus,
  ArrowRight,
  AlertOctagon,
} from 'lucide-react';

interface SocialRightRailProps {
  trendingTopics: { tag: string; postsLabel: string }[];
  communities: SocialCommunity[];
  activeHashtag: string | null;
  onSelectHashtag: (tag: string | null) => void;
  onToggleJoinCommunity: (communityId: string) => void;
  onOpenEmergencyModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const SocialRightRail: React.FC<SocialRightRailProps> = ({
  trendingTopics,
  communities,
  activeHashtag,
  onSelectHashtag,
  onToggleJoinCommunity,
  onOpenEmergencyModal,
  onNavigateTab,
}) => {
  const getCommunityIcon = (iconType: SocialCommunity['iconType']) => {
    switch (iconType) {
      case 'mechanics':
        return <Wrench className="w-4 h-4 text-[#F97316]" />;
      case 'freight':
        return <Truck className="w-4 h-4 text-[#60A5FA]" />;
      case 'commuters':
        return <Bus className="w-4 h-4 text-[#16A34A]" />;
      default:
        return <Users className="w-4 h-4 text-[#3B82F6]" />;
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 sticky top-[68px] h-[calc(100vh-84px)] gap-4 overflow-y-auto no-scrollbar py-2 pl-1">
      {/* 1. Red Emergency Card matching Screenshot */}
      <div className="rounded-2xl bg-gradient-to-br from-[#DC2626] via-[#B91C1C] to-[#991B1B] p-4 shadow-xl border border-red-400/20 text-white">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold tracking-tight leading-tight">Roadside Emergency?</h3>
            <p className="text-xs text-red-100 mt-0.5 leading-snug">
              Connect directly with ZRP, ambulance, or recovery crews.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenEmergencyModal}
          className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-red-50 text-[#0B1220] font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98 whitespace-nowrap"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>Call for Help</span>
        </button>
      </div>

      {/* 2. Live Map Preview Card matching Screenshot */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-md">
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-xs font-bold text-white">Live Map</span>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#16A34A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span>Live</span>
          </span>
        </div>

        {/* Stylized Zimbabwe Highway Network Graphic */}
        <div
          onClick={() => onNavigateTab('map')}
          className="relative h-36 bg-[#070B14] overflow-hidden cursor-pointer group"
        >
          <svg
            viewBox="0 0 320 150"
            className="w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-300"
            aria-hidden="true"
          >
            {/* Subtle Zimbabwe outline polygon */}
            <polygon
              points="75,35 155,15 235,38 258,80 218,128 155,135 95,112 62,72"
              fill="#0B162C"
              stroke="#1D4ED8"
              strokeWidth="1.5"
              strokeOpacity="0.55"
            />
            {/* National Highway Corridor Lines */}
            <polyline
              points="115,92 145,70 185,48 228,62"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <polyline
              points="185,48 182,88 188,125"
              fill="none"
              stroke="#2563EB"
              strokeWidth="1.4"
              strokeOpacity="0.7"
            />
            <polyline
              points="115,92 78,46"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeOpacity="0.65"
            />
            <polyline
              points="115,92 155,120 188,125"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1.2"
              strokeOpacity="0.65"
            />
            {/* Glowing city & highway nodes */}
            <circle cx="115" cy="92" r="5" fill="#2563EB" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="185" cy="48" r="4" fill="#22C55E" />
            <circle cx="228" cy="62" r="3" fill="#F59E0B" />
            <circle cx="188" cy="125" r="3" fill="#EF4444" />
            <circle cx="145" cy="70" r="3" fill="#22C55E" />
            <circle cx="78" cy="46" r="3" fill="#38BDF8" />
          </svg>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigateTab('map');
            }}
            className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-[#0B1220]/90 hover:bg-[#2563EB] border border-[#334155] text-white text-[11px] font-semibold flex items-center gap-1 shadow-lg transition-colors cursor-pointer"
          >
            <span>View Map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Trending in Zimbabwe Card matching Screenshot */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#F97316]" />
            <h3 className="text-xs font-bold text-white">Trending in Zimbabwe</h3>
          </div>
          <button
            type="button"
            onClick={() => onSelectHashtag(null)}
            className="text-[11px] font-semibold text-[#3B82F6] hover:text-[#60A5FA] cursor-pointer"
          >
            {activeHashtag ? 'Reset' : 'See all →'}
          </button>
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((topic) => {
            const isSelected = activeHashtag === topic.tag;
            return (
              <button
                key={topic.tag}
                type="button"
                onClick={() => onSelectHashtag(isSelected ? null : topic.tag)}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#2563EB]/20 border border-[#2563EB]/50'
                    : 'hover:bg-[#1E293B]/60'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">{topic.tag}</div>
                  <div className="text-[11px] text-[#94A3B8] tabular-nums">{topic.postsLabel}</div>
                </div>
                <TrendingUp className="w-4 h-4 text-[#3B82F6] shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Suggested Communities Card matching Screenshot */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-xs font-bold text-white">Suggested Communities</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('communities')}
            className="text-[11px] font-semibold text-[#3B82F6] hover:text-[#60A5FA] cursor-pointer"
          >
            See all →
          </button>
        </div>

        <div className="space-y-3">
          {communities.slice(0, 3).map((comm) => (
            <div key={comm.id} className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center shrink-0">
                  {getCommunityIcon(comm.iconType)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{comm.name}</div>
                  <div className="text-[11px] text-[#94A3B8] tabular-nums">{comm.membersLabel}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleJoinCommunity(comm.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  comm.isJoined
                    ? 'bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/40 hover:bg-[#16A34A]/30'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                {comm.isJoined ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
