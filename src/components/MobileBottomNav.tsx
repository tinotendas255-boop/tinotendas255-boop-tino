import React, { useState } from 'react';
import {
  Home,
  Compass,
  MessageSquare,
  Users,
  MoreHorizontal,
  User,
  Shield,
  PenTool,
  Truck,
  Server,
  Bell,
  X,
  ChevronRight,
  Navigation,
  Newspaper,
  Wrench,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unverifiedCount: number;
  unreadMessagesCount?: number;
  onOpenDriverLoginModal?: () => void;
  onOpenIntegrationsModal?: () => void;
  onOpenNotificationsModal?: () => void;
  unreadNotificationsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  unverifiedCount,
  unreadMessagesCount = 0,
  onOpenDriverLoginModal,
  onOpenIntegrationsModal,
  onOpenNotificationsModal,
  unreadNotificationsCount = 0,
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const isMoreActive = ['profile', 'moderator', 'publisher', 'operators', 'routes', 'news'].includes(activeTab);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsMoreSheetOpen(false);
  };

  return (
    <>
      {/* Mobile "More Hub" Slide-up Sheet */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-[2600] lg:hidden">
          <div
            className="fixed inset-0 bg-[#070B14]/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreSheetOpen(false)}
          />

          <div className="fixed bottom-16 inset-x-0 bg-[#0F172A] rounded-t-2xl border-t border-[#1E293B] shadow-2xl p-4 text-white max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <h3 className="font-bold text-sm text-white">RoadLink Portals & Services</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {/* Roadside Services & Operators */}
              <button
                type="button"
                onClick={() => handleSelectTab('operators')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'operators'
                    ? 'bg-[#2563EB]/20 text-[#60A5FA] font-bold border border-[#2563EB]/40'
                    : 'hover:bg-[#111C2E] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#60A5FA] flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Services & Fleet Operators</span>
                    <span className="text-[10px] text-[#94A3B8]">Roadside recovery, coaches & carriers</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {/* Corridors & Tolls */}
              <button
                type="button"
                onClick={() => handleSelectTab('routes')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'routes'
                    ? 'bg-[#2563EB]/20 text-[#60A5FA] font-bold border border-[#2563EB]/40'
                    : 'hover:bg-[#111C2E] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Corridors & ZINARA Tolls</span>
                    <span className="text-[10px] text-[#94A3B8]">A1–A9 conditions & toll schedules</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {/* Highway Gazette */}
              <button
                type="button"
                onClick={() => handleSelectTab('news')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'news'
                    ? 'bg-[#2563EB]/20 text-[#60A5FA] font-bold border border-[#2563EB]/40'
                    : 'hover:bg-[#111C2E] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 text-[#FBBF24] flex items-center justify-center">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Highway Gazette</span>
                    <span className="text-[10px] text-[#94A3B8]">Official advisories & motorist comments</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {/* Highway Safety Moderator Desk */}
              <button
                type="button"
                onClick={() => handleSelectTab('moderator')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'moderator'
                    ? 'bg-[#2563EB]/20 text-[#60A5FA] font-bold border border-[#2563EB]/40'
                    : 'hover:bg-[#111C2E] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#16A34A]/15 text-[#4ADE80] flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Moderator Desk</span>
                    <span className="text-[10px] text-[#94A3B8]">Verify reports & dispatch to media houses</span>
                  </div>
                </div>
                {unverifiedCount > 0 ? (
                  <span className="px-2 py-0.5 bg-[#F97316] text-white text-[10px] font-bold rounded-full">
                    {unverifiedCount}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                )}
              </button>

              {/* News Media & Press Portal */}
              <button
                type="button"
                onClick={() => handleSelectTab('publisher')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'publisher'
                    ? 'bg-[#2563EB]/20 text-[#60A5FA] font-bold border border-[#2563EB]/40'
                    : 'hover:bg-[#111C2E] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 text-[#FB923C] flex items-center justify-center">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Press & Media Portal</span>
                    <span className="text-[10px] text-[#94A3B8]">Herald, ZBC & Chronicle wire inbox</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {/* Profile */}
              <button
                type="button"
                onClick={() => handleSelectTab('profile')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#2563EB]/20 text-[#60A5FA] font-bold border border-[#2563EB]/40'
                    : 'hover:bg-[#111C2E] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#60A5FA] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">My Profile & Saved Routes</span>
                    <span className="text-[10px] text-[#94A3B8]">Submissions, bookmarks & preferences</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </button>

              <div className="pt-2 border-t border-[#1E293B] grid grid-cols-2 gap-2 mt-2">
                {onOpenDriverLoginModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onOpenDriverLoginModal();
                    }}
                    className="p-2.5 bg-[#111C2E] hover:bg-[#1E293B] text-white rounded-xl font-bold text-center flex flex-col items-center gap-1"
                  >
                    <Truck className="w-4 h-4 text-[#F97316]" />
                    <span className="text-[11px]">Switch Persona</span>
                  </button>
                )}

                {onOpenNotificationsModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onOpenNotificationsModal();
                    }}
                    className="p-2.5 bg-[#111C2E] hover:bg-[#1E293B] text-white rounded-xl font-bold text-center flex flex-col items-center gap-1 relative"
                  >
                    <Bell className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-[11px]">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-4 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {onOpenIntegrationsModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreSheetOpen(false);
                    onOpenIntegrationsModal();
                  }}
                  className="w-full mt-1 p-2 bg-[#111C2E] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5"
                >
                  <Server className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Google Maps & ZINARA Integrations Status</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-[1400] lg:hidden bg-[#0B1220]/95 backdrop-blur-md border-t border-[#1E293B] px-1 py-1 shadow-2xl h-16 flex items-center justify-around"
      >
        <div className="grid grid-cols-5 gap-0.5 w-full">
          <button
            type="button"
            onClick={() => handleSelectTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'home' ? 'text-[#3B82F6] font-bold' : 'text-[#94A3B8] hover:text-white font-medium'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('map')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'map' ? 'text-[#3B82F6] font-bold' : 'text-[#94A3B8] hover:text-white font-medium'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Explore</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('messages')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative min-h-[44px] ${
              activeTab === 'messages' ? 'text-[#3B82F6] font-bold' : 'text-[#94A3B8] hover:text-white font-medium'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Messages</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-4 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('communities')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative min-h-[44px] ${
              activeTab === 'communities' || activeTab === 'community'
                ? 'text-[#3B82F6] font-bold'
                : 'text-[#94A3B8] hover:text-white font-medium'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Groups</span>
            {unverifiedCount > 0 && (
              <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-[#F97316]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMoreSheetOpen(!isMoreSheetOpen)}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative min-h-[44px] ${
              isMoreActive || isMoreSheetOpen
                ? 'text-[#3B82F6] font-bold'
                : 'text-[#94A3B8] hover:text-white font-medium'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
