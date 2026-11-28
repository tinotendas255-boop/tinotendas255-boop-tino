import React, { useState, useRef, useEffect } from 'react';
import { UserRole, DriverType } from '../types';
import { CURRENT_USER_AVATAR_IMG } from '../data/socialData';
import {
  Search,
  Home,
  Users,
  Wrench,
  LayoutGrid,
  ChevronDown,
  ShieldCheck,
  PenTool,
  Navigation,
  Newspaper,
  Plus,
  Bell,
  Server,
  Truck,
  Bus,
  Car,
  User,
  X,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentDriverType?: DriverType;
  onOpenDriverLoginModal?: () => void;
  unverifiedCount: number;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  activeHazardsCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenReportModal: () => void;
  onOpenIntegrationsModal: () => void;
  onOpenNotificationsModal: () => void;
  emergencyBanner: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userName,
  currentUserRole,
  setCurrentUserRole,
  currentDriverType = 'commuter',
  onOpenDriverLoginModal,
  unverifiedCount,
  unreadNotificationsCount,
  activeHazardsCount,
  searchQuery,
  onSearchChange,
  onOpenReportModal,
  onOpenIntegrationsModal,
  onOpenNotificationsModal,
  emergencyBanner,
}) => {
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (appsRef.current && !appsRef.current.contains(e.target as Node)) {
        setIsAppsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (userName || 'RL')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-[1500] bg-[#0B1220]/95 backdrop-blur-md border-b border-[#1E293B] text-white">
      {/* Emergency Highway Alert Ticker (if active) */}
      {emergencyBanner && (
        <div className="bg-red-700 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
          <span className="font-extrabold uppercase tracking-wider text-[10px] bg-red-900 px-2 py-0.5 rounded shrink-0">
            NATIONAL HIGHWAY EMERGENCY
          </span>
          <span className="truncate">{emergencyBanner}</span>
        </div>
      )}

      {/* Main Social Top Bar matching screenshot */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-3 sm:gap-5">
        {/* Left: Brand Logo Lockup */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-blue-950/50 border border-blue-400/30">
            <span className="text-white font-black text-base tracking-tighter italic">R</span>
          </div>
          <div className="leading-none">
            <div className="text-[17px] font-bold tracking-tight">
              <span className="text-white">Road</span>
              <span className="text-[#3B82F6]">Link</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-normal mt-0.5 hidden sm:block">
              Zimbabwe Highway Network
            </p>
          </div>
        </button>

        {/* Center: Search RoadLink... */}
        <div className="flex-1 max-w-xl">
          <div className="relative flex items-center bg-[#111C2E] border border-[#1E293B] focus-within:border-[#3B82F6] rounded-full px-3.5 py-2 transition-colors">
            <Search className="w-4 h-4 text-[#94A3B8] mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'home' && e.target.value.trim()) {
                  setActiveTab('home');
                }
              }}
              placeholder="Search highways, road alerts, #tags, or motorists..."
              className="bg-transparent text-xs sm:text-sm text-white placeholder-[#94A3B8] focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-0.5 text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Top Quick Icons + Portals Grid + User Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            title="Home Feed"
            className={`hidden md:flex w-10 h-10 rounded-xl items-center justify-center transition-colors cursor-pointer relative ${
              activeTab === 'home'
                ? 'bg-[#1E293B] text-white'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Home className="w-5 h-5" />
            {activeTab === 'home' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#3B82F6] rounded-full" />
            )}
          </button>

          {/* Quick Communities */}
          <button
            type="button"
            onClick={() => setActiveTab('communities')}
            title="Communities & Road Alerts"
            className={`hidden md:flex w-10 h-10 rounded-xl items-center justify-center transition-colors cursor-pointer relative ${
              activeTab === 'communities' || activeTab === 'community'
                ? 'bg-[#1E293B] text-white'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Users className="w-5 h-5" />
            {(activeTab === 'communities' || activeTab === 'community') && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#3B82F6] rounded-full" />
            )}
          </button>

          {/* Quick Services */}
          <button
            type="button"
            onClick={() => setActiveTab('operators')}
            title="Roadside Services & Operators"
            className={`hidden md:flex w-10 h-10 rounded-xl items-center justify-center transition-colors cursor-pointer relative ${
              activeTab === 'operators'
                ? 'bg-[#1E293B] text-white'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            <Wrench className="w-5 h-5" />
            {activeTab === 'operators' && (
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#3B82F6] rounded-full" />
            )}
          </button>

          {/* Notifications Bell (visible on mobile & tablet where sidebar hidden) */}
          <button
            type="button"
            onClick={onOpenNotificationsModal}
            title="Notifications"
            className="lg:hidden relative w-9 h-9 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#111C2E] flex items-center justify-center cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Portals / Apps Launcher Dropdown */}
          <div ref={appsRef} className="relative">
            <button
              type="button"
              onClick={() => setIsAppsOpen((v) => !v)}
              title="RoadLink Portals & Operations"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer relative ${
                isAppsOpen || ['moderator', 'publisher', 'routes', 'news'].includes(activeTab)
                  ? 'bg-[#1E293B] text-white'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              {unverifiedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F97316]" />
              )}
            </button>

            {isAppsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-2xl p-3 z-[2200] space-y-2">
                <div className="px-2 py-1 flex items-center justify-between border-b border-[#1E293B] pb-2">
                  <span className="text-xs font-extrabold text-white">RoadLink Operations & Portals</span>
                  <span className="text-[10px] font-mono text-[#60A5FA]">{activeHazardsCount} live</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAppsOpen(false);
                      onOpenReportModal();
                    }}
                    className="p-2.5 rounded-xl bg-[#2563EB]/20 hover:bg-[#2563EB]/30 border border-[#2563EB]/40 text-left cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#60A5FA] mb-1" />
                    <div className="font-bold text-white">Report Hazard</div>
                    <div className="text-[10px] text-slate-300">Admin & Media</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAppsOpen(false);
                      setActiveTab('moderator');
                    }}
                    className="p-2.5 rounded-xl bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-left cursor-pointer relative"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#16A34A] mb-1" />
                    <div className="font-bold text-white">Moderator Desk</div>
                    <div className="text-[10px] text-[#94A3B8]">{unverifiedCount} pending</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAppsOpen(false);
                      setActiveTab('publisher');
                    }}
                    className="p-2.5 rounded-xl bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-left cursor-pointer"
                  >
                    <PenTool className="w-4 h-4 text-[#F97316] mb-1" />
                    <div className="font-bold text-white">Press Portal</div>
                    <div className="text-[10px] text-[#94A3B8]">Herald · ZBC · Star</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAppsOpen(false);
                      setActiveTab('routes');
                    }}
                    className="p-2.5 rounded-xl bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-left cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-[#38BDF8] mb-1" />
                    <div className="font-bold text-white">Corridors & Tolls</div>
                    <div className="text-[10px] text-[#94A3B8]">ZINARA fees</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAppsOpen(false);
                      setActiveTab('news');
                    }}
                    className="p-2.5 rounded-xl bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-left cursor-pointer"
                  >
                    <Newspaper className="w-4 h-4 text-[#FBBF24] mb-1" />
                    <div className="font-bold text-white">Highway Gazette</div>
                    <div className="text-[10px] text-[#94A3B8]">News & comments</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAppsOpen(false);
                      onOpenIntegrationsModal();
                    }}
                    className="p-2.5 rounded-xl bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-left cursor-pointer"
                  >
                    <Server className="w-4 h-4 text-[#94A3B8] mb-1" />
                    <div className="font-bold text-white">Integrations</div>
                    <div className="text-[10px] text-[#94A3B8]">System status</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar & Role Switcher Menu */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] cursor-pointer transition-colors"
            >
              <img
                src={CURRENT_USER_AVATAR_IMG}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover border border-[#334155]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F172A] border border-[#334155] shadow-2xl p-3 z-[2200] space-y-2.5 text-xs">
                <div className="px-2 pb-2 border-b border-[#1E293B]">
                  <div className="font-bold text-white truncate">{userName}</div>
                  <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                    {currentDriverType === 'truck' ? (
                      <Truck className="w-3.5 h-3.5 text-[#F97316]" />
                    ) : currentDriverType === 'bus' ? (
                      <Bus className="w-3.5 h-3.5 text-[#60A5FA]" />
                    ) : (
                      <Car className="w-3.5 h-3.5 text-[#3B82F6]" />
                    )}
                    <span className="capitalize">{currentDriverType} Profile</span>
                  </div>
                </div>

                <div>
                  <label className="block px-2 text-[10px] uppercase tracking-wider font-bold text-[#94A3B8] mb-1">
                    Active Portal Role
                  </label>
                  <select
                    value={currentUserRole}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setCurrentUserRole(newRole);
                      if (newRole === 'news_journalist') setActiveTab('publisher');
                      if (newRole === 'moderator') setActiveTab('moderator');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full bg-[#0B1220] border border-[#334155] text-white rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="citizen">Citizen Commuter</option>
                    <option value="verified_driver">Verified Long-Haul Driver</option>
                    <option value="transport_operator">Transport Operator</option>
                    <option value="moderator">Highway Safety Moderator</option>
                    <option value="news_journalist">News Media & Press Desk</option>
                  </select>
                </div>

                <div className="space-y-1 pt-1 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveTab('profile');
                    }}
                    className="w-full px-2.5 py-2 rounded-xl hover:bg-[#1E293B] text-left font-semibold text-white flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#3B82F6]" />
                    <span>My Profile & Saved Routes</span>
                  </button>
                  {onOpenDriverLoginModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenDriverLoginModal();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-[#1E293B] text-left font-semibold text-slate-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Truck className="w-4 h-4 text-[#F97316]" />
                      <span>Switch Driver Persona</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
