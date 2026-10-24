import React from 'react';
import { UserRole, DriverType } from '../types';
import {
  Map,
  Navigation,
  Newspaper,
  Bus,
  Truck,
  Car,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Server,
  Bell,
  Home,
  User,
  Menu,
  X,
  PenTool
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentDriverType?: DriverType;
  onOpenDriverLoginModal?: () => void;
  unverifiedCount: number;
  unreadNotificationsCount: number;
  activeHazardsCount: number;
  onOpenReportModal: () => void;
  onOpenIntegrationsModal: () => void;
  onOpenNotificationsModal: () => void;
  emergencyBanner: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUserRole,
  setCurrentUserRole,
  currentDriverType = 'commuter',
  onOpenDriverLoginModal,
  unverifiedCount,
  unreadNotificationsCount,
  activeHazardsCount,
  onOpenReportModal,
  onOpenIntegrationsModal,
  onOpenNotificationsModal,
  emergencyBanner,
}) => {
  return (
    <header className="sticky top-0 z-[1500] bg-[#0B1220] border-b border-[#1E293B] shadow-md text-white">
      {/* Emergency Highway Alert Ticker (if active) */}
      {emergencyBanner && (
        <div className="bg-red-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-5xl mx-auto overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping flex-shrink-0"></span>
            <span className="font-extrabold uppercase tracking-wider text-[11px] bg-red-900 px-2 py-0.5 rounded">
              NATIONAL HIGHWAY EMERGENCY
            </span>
            <span className="truncate">{emergencyBanner}</span>
          </div>
        </div>
      )}

      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#070B14] text-white flex items-center justify-center font-bold font-mono text-base shadow-sm relative overflow-hidden border border-[#2563EB]/40">
              <span className="text-[#2563EB] font-black">RL</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#F97316]"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white">RoadLink</span>
                <span className="text-[10px] font-extrabold text-[#60A5FA] uppercase tracking-wider px-1.5 py-0.5 bg-[#2563EB]/20 border border-[#2563EB]/40 rounded">
                  ZIMBABWE
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium tracking-tight mt-0.5 hidden sm:block">
                Connecting People. Keeping Zimbabwe Moving.
              </p>
            </div>
          </div>
        </div>

        {/* Live Corridor Status Indicator */}
        <div className="hidden xl:flex items-center gap-4 text-xs text-[#94A3B8] bg-[#111C2E] border border-[#1E293B] px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            <span>A4 Beitbridge: <span className="font-semibold text-white">400km+ Widened</span></span>
          </div>
          <span className="text-[#334155]">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            <span>A5 Bulawayo: <span className="font-semibold text-white">Normal Flow</span></span>
          </div>
          <span className="text-[#334155]">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
            <span>Active Hazards: <span className="font-semibold text-white">{activeHazardsCount}</span></span>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <button
            onClick={onOpenNotificationsModal}
            className="relative p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
            title="Notification Centre"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F97316] text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Driver Persona / Login Switcher Button */}
          <button
            onClick={onOpenDriverLoginModal}
            title="Choose Driver Type (Truck, Bus, Citizen Commuter) or Switch Profile"
            className={`px-2 sm:px-2.5 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shadow-xs ${
              currentDriverType === 'truck'
                ? 'bg-[#F97316]/15 text-[#FB923C] border-[#F97316]/40 hover:bg-[#F97316]/25'
                : currentDriverType === 'bus'
                ? 'bg-[#2563EB]/15 text-[#60A5FA] border-[#2563EB]/40 hover:bg-[#2563EB]/25'
                : 'bg-[#1E293B] text-slate-200 border-[#334155] hover:bg-[#334155]'
            }`}
          >
            {currentDriverType === 'truck' ? (
              <Truck className="w-3.5 h-3.5 text-[#F97316]" />
            ) : currentDriverType === 'bus' ? (
              <Bus className="w-3.5 h-3.5 text-[#60A5FA]" />
            ) : (
              <Car className="w-3.5 h-3.5 text-[#2563EB]" />
            )}
            <span className="font-extrabold text-white text-[11px] sm:text-xs">
              {currentDriverType === 'truck'
                ? 'Truck'
                : currentDriverType === 'bus'
                ? 'Bus'
                : 'Commuter'}
            </span>
            <span className="text-[10px] text-[#64748B] font-medium hidden xl:inline">· Switch</span>
          </button>

          {/* User Role Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs bg-[#111C2E] border border-[#1E293B] rounded-lg px-2.5 py-1.5 transition-colors">
            <span className="text-[#64748B] text-[11px] font-medium hidden md:inline">Role:</span>
            <select
              value={currentUserRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setCurrentUserRole(newRole);
                if (newRole === 'news_journalist') {
                  setActiveTab('publisher');
                }
              }}
              className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="citizen" className="bg-[#0B1220] text-white">Citizen Commuter</option>
              <option value="verified_driver" className="bg-[#0B1220] text-white">Verified Long-Haul Driver</option>
              <option value="transport_operator" className="bg-[#0B1220] text-white">Transport Operator</option>
              <option value="moderator" className="bg-[#0B1220] text-white">Highway Safety Moderator</option>
              <option value="news_journalist" className="bg-[#0B1220] text-white">News Media & Press Desk</option>
            </select>
          </div>

          {/* Press & Newsroom Publisher Portal Button (Tablet & Desktop) */}
          <button
            onClick={() => setActiveTab('publisher')}
            title="News Media & Journalist Publisher Hub"
            className={`hidden sm:flex px-2.5 py-1.5 border rounded-lg text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'publisher'
                ? 'bg-[#F97316] text-white border-[#EA580C] font-bold shadow-xs'
                : 'bg-[#F97316]/15 hover:bg-[#F97316]/25 text-[#FB923C] border-[#F97316]/40'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="hidden md:inline">Press Portal</span>
            <span className="px-1 py-0.2 bg-[#F97316]/30 text-white text-[9px] font-mono rounded font-bold uppercase">
              Desk
            </span>
          </button>

          {/* Integrations Transparency Button (Desktop) */}
          <button
            onClick={onOpenIntegrationsModal}
            title="Integrations & Architecture Status"
            className="hidden md:flex px-2.5 py-1.5 bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-[#94A3B8] hover:text-white rounded-lg text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Integrations</span>
          </button>

          {/* Primary CTA: Report Hazard */}
          <button
            onClick={onOpenReportModal}
            className="px-2.5 sm:px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-900/30 flex items-center gap-1 sm:gap-1.5 active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Report Hazard</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs (Desktop & Tablet) */}
      <nav className="hidden md:block border-t border-[#1E293B] bg-[#0B1220] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto text-xs py-1.5">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Explore Map</span>
            <span className="px-1.5 py-0.2 bg-[#16A34A] text-white text-[10px] rounded-full font-mono">
              {activeHazardsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'routes'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Corridors & Tolls</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Community Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('operators')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'operators'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Operators & Fleets</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('moderator')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ml-auto ${
              activeTab === 'moderator'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Moderator Desk</span>
            {unverifiedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#F97316] text-white text-[10px] rounded-full font-bold">
                {unverifiedCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
