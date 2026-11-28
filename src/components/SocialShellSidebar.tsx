import React, { useState } from 'react';
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  Users,
  Wrench,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Crown,
  Navigation,
  Newspaper,
  PenTool,
  User,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface SocialShellSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  unverifiedCount: number;
  onOpenNotificationsModal: () => void;
  onOpenSecureModal: () => void;
  onOpenPremiumModal: () => void;
}

export const SocialShellSidebar: React.FC<SocialShellSidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadNotificationsCount,
  unreadMessagesCount,
  unverifiedCount,
  onOpenNotificationsModal,
  onOpenSecureModal,
  onOpenPremiumModal,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isMoreTabActive = ['routes', 'news', 'moderator', 'publisher', 'profile'].includes(activeTab);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-[68px] h-[calc(100vh-84px)] justify-between py-2 pr-2 select-none">
      <div className="space-y-4 overflow-y-auto no-scrollbar pr-1">
        {/* Primary Vertical Navigation */}
        <nav aria-label="Primary Social Navigation" className="space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]/80 text-white shadow-lg shadow-blue-950/50'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]/80 text-white shadow-lg shadow-blue-950/50'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Compass className="w-5 h-5 shrink-0" />
            <span>Explore</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotificationsModal}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#CBD5E1] hover:text-white hover:bg-[#111C2E] transition-all cursor-pointer"
          >
            <span className="flex items-center gap-3.5">
              <Bell className="w-5 h-5 shrink-0" />
              <span>Notifications</span>
            </span>
            {unreadNotificationsCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#DC2626] text-white text-[11px] font-bold tabular-nums flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]/80 text-white shadow-lg shadow-blue-950/50'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <span className="flex items-center gap-3.5">
              <MessageSquare className="w-5 h-5 shrink-0" />
              <span>Messages</span>
            </span>
            {unreadMessagesCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#DC2626] text-white text-[11px] font-bold tabular-nums flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('communities')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'communities' || activeTab === 'community'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]/80 text-white shadow-lg shadow-blue-950/50'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>Communities</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('operators')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'operators'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]/80 text-white shadow-lg shadow-blue-950/50'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Wrench className="w-5 h-5 shrink-0" />
            <span>Services</span>
          </button>

          {/* Expandable More Portals Section */}
          <div className="pt-1 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isMoreTabActive
                  ? 'bg-[#111C2E] text-white border border-[#2563EB]/40'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-[#111C2E]'
              }`}
            >
              <span className="flex items-center gap-3.5">
                <MoreHorizontal className="w-5 h-5 shrink-0" />
                <span>More</span>
              </span>
              <span className="flex items-center gap-1.5">
                {unverifiedCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" title="Pending Moderator Verifications" />
                )}
                {isMoreOpen || isMoreTabActive ? (
                  <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                )}
              </span>
            </button>

            {(isMoreOpen || isMoreTabActive) && (
              <div className="mt-1 ml-2 pl-2 border-l border-[#1E293B] space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('routes')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'routes'
                      ? 'bg-[#2563EB]/20 text-[#60A5FA] font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
                  }`}
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>Corridors & Tolls</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('news')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'news'
                      ? 'bg-[#2563EB]/20 text-[#60A5FA] font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
                  }`}
                >
                  <Newspaper className="w-4 h-4 shrink-0" />
                  <span>Highway Gazette</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('moderator')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'moderator'
                      ? 'bg-[#2563EB]/20 text-[#60A5FA] font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 shrink-0 text-[#16A34A]" />
                    <span>Moderator Desk</span>
                  </span>
                  {unverifiedCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-bold tabular-nums">
                      {unverifiedCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('publisher')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'publisher'
                      ? 'bg-[#F97316]/20 text-[#FB923C] font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
                  }`}
                >
                  <PenTool className="w-4 h-4 shrink-0 text-[#F97316]" />
                  <span>Press & Media Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#2563EB]/20 text-[#60A5FA] font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>My Profile</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Feature Cards matching Screenshot */}
        <div className="space-y-3 pt-2">
          {/* RoadLink Secure Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white leading-tight">RoadLink Secure</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                  Your safety, our priority.
                </p>
                <button
                  type="button"
                  onClick={onOpenSecureModal}
                  className="mt-1.5 text-[11px] font-semibold text-[#3B82F6] hover:text-[#60A5FA] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Go Premium Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-[#FBBF24]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white leading-tight">RoadLink Plus</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                  SMS toll & detour alerts for frequent highway drivers.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenPremiumModal}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] text-[#0B1220] font-semibold text-xs transition-all cursor-pointer shadow-md whitespace-nowrap"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
