import React, { useState } from 'react';
import {
  Home,
  Map,
  Navigation,
  Newspaper,
  Users,
  MoreHorizontal,
  User,
  Shield,
  PenTool,
  Truck,
  Server,
  Bell,
  X,
  ChevronRight
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unverifiedCount: number;
  onOpenDriverLoginModal?: () => void;
  onOpenIntegrationsModal?: () => void;
  onOpenNotificationsModal?: () => void;
  unreadNotificationsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  unverifiedCount,
  onOpenDriverLoginModal,
  onOpenIntegrationsModal,
  onOpenNotificationsModal,
  unreadNotificationsCount = 0,
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  // Check if active tab is under the "More" umbrella
  const isMoreActive = ['profile', 'moderator', 'publisher', 'operators'].includes(activeTab);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsMoreSheetOpen(false);
  };

  return (
    <>
      {/* Mobile "More Hub" Slide-up Sheet */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-[2600] md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreSheetOpen(false)}
          />

          {/* Sheet Drawer */}
          <div className="fixed bottom-16 inset-x-0 bg-[#FFFFFF] rounded-t-2xl border-t border-[#E2E8F0] shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200 text-[#111827] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <h3 className="font-bold text-sm text-[#0B1220]">RoadLink Portals & Settings</h3>
              </div>
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {/* Profile & Submissions */}
              <button
                onClick={() => handleSelectTab('profile')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#2563EB]/10 text-[#2563EB] font-bold border border-[#2563EB]/30'
                    : 'hover:bg-[#F1F5F9] text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#2563EB] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Driver Profile & Saved Routes</span>
                    <span className="text-[10px] text-[#64748B]">Submissions, bookmarks & vehicle profile</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </button>

              {/* Highway Safety Moderator Desk */}
              <button
                onClick={() => handleSelectTab('moderator')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'moderator'
                    ? 'bg-[#2563EB]/10 text-[#2563EB] font-bold border border-[#2563EB]/30'
                    : 'hover:bg-[#F1F5F9] text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Moderator Operations Desk</span>
                    <span className="text-[10px] text-[#64748B]">Verify community reports & emergency banners</span>
                  </div>
                </div>
                {unverifiedCount > 0 ? (
                  <span className="px-2 py-0.5 bg-[#F97316] text-white text-[10px] font-bold rounded-full">
                    {unverifiedCount}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                )}
              </button>

              {/* News Media & Press Portal */}
              <button
                onClick={() => handleSelectTab('publisher')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'publisher'
                    ? 'bg-[#2563EB]/10 text-[#2563EB] font-bold border border-[#2563EB]/30'
                    : 'hover:bg-[#F1F5F9] text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 text-[#F97316] flex items-center justify-center">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Press & Journalist Publisher</span>
                    <span className="text-[10px] text-[#64748B]">File news wires & publish traffic bulletins</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </button>

              {/* Fleet Logistics & Transport Operators */}
              <button
                onClick={() => handleSelectTab('operators')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'operators'
                    ? 'bg-[#2563EB]/10 text-[#2563EB] font-bold border border-[#2563EB]/30'
                    : 'hover:bg-[#F1F5F9] text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0B1220]/10 text-[#0B1220] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">Transport Operators & Coach Fleet</span>
                    <span className="text-[10px] text-[#64748B]">Extra City, Pioneer & national carrier directory</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </button>

              <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 mt-2">
                {/* Switch Driver Persona */}
                {onOpenDriverLoginModal && (
                  <button
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onOpenDriverLoginModal();
                    }}
                    className="p-2.5 bg-[#F1F5F9] hover:bg-slate-200 text-[#111827] rounded-xl font-bold text-center flex flex-col items-center gap-1"
                  >
                    <Truck className="w-4 h-4 text-[#F97316]" />
                    <span className="text-[11px]">Switch Persona</span>
                  </button>
                )}

                {/* Notifications Modal */}
                {onOpenNotificationsModal && (
                  <button
                    onClick={() => {
                      setIsMoreSheetOpen(false);
                      onOpenNotificationsModal();
                    }}
                    className="p-2.5 bg-[#F1F5F9] hover:bg-slate-200 text-[#111827] rounded-xl font-bold text-center flex flex-col items-center gap-1 relative"
                  >
                    <Bell className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-[11px]">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-4 w-4 h-4 rounded-full bg-[#F97316] text-white text-[9px] font-bold flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* System Integrations */}
              {onOpenIntegrationsModal && (
                <button
                  onClick={() => {
                    setIsMoreSheetOpen(false);
                    onOpenIntegrationsModal();
                  }}
                  className="w-full mt-1 p-2 bg-[#F1F5F9] hover:bg-slate-200 text-[#64748B] hover:text-[#111827] rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5"
                >
                  <Server className="w-3.5 h-3.5 text-[#2563EB]" />
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
        className="fixed bottom-0 inset-x-0 z-[1400] md:hidden bg-[#0B1220]/95 backdrop-blur-md border-t border-[#1E293B] px-1 py-1 shadow-2xl h-16 flex items-center justify-around"
      >
        <div className="grid grid-cols-6 gap-0.5 w-full">
          {/* 1. Home */}
          <button
            onClick={() => handleSelectTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'home'
                ? 'text-[#2563EB] font-bold'
                : 'text-[#64748B] hover:text-white font-medium'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Home</span>
          </button>

          {/* 2. Explore Map */}
          <button
            onClick={() => handleSelectTab('map')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'map'
                ? 'text-[#2563EB] font-bold'
                : 'text-[#64748B] hover:text-white font-medium'
            }`}
          >
            <Map className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Map</span>
          </button>

          {/* 3. Corridors & Tolls */}
          <button
            onClick={() => handleSelectTab('routes')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'routes'
                ? 'text-[#2563EB] font-bold'
                : 'text-[#64748B] hover:text-white font-medium'
            }`}
          >
            <Navigation className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Corridors</span>
          </button>

          {/* 4. The Highway Gazette (News) */}
          <button
            onClick={() => handleSelectTab('news')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'news'
                ? 'text-[#2563EB] font-bold'
                : 'text-[#64748B] hover:text-white font-medium'
            }`}
          >
            <Newspaper className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Gazette</span>
          </button>

          {/* 5. Community Reports */}
          <button
            onClick={() => handleSelectTab('community')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative min-h-[44px] ${
              activeTab === 'community'
                ? 'text-[#2563EB] font-bold'
                : 'text-[#64748B] hover:text-white font-medium'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Alerts</span>
            {unverifiedCount > 0 && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#F97316]" />
            )}
          </button>

          {/* 6. More / Hub */}
          <button
            onClick={() => setIsMoreSheetOpen(!isMoreSheetOpen)}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative min-h-[44px] ${
              isMoreActive || isMoreSheetOpen
                ? 'text-[#2563EB] font-bold'
                : 'text-[#64748B] hover:text-white font-medium'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">More</span>
            {isMoreActive && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#2563EB]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
