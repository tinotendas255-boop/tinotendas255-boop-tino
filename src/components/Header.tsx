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
    <header className="sticky top-0 z-[1500] bg-white border-b border-slate-200 shadow-sm">
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
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-base shadow-sm relative overflow-hidden border border-slate-700">
              <span className="text-emerald-400 font-extrabold">RL</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-500"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-slate-900">RoadLink</span>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded">
                  ZIMBABWE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:block">
                Connecting People. Keeping Zimbabwe Moving.
              </p>
            </div>
          </div>
        </div>

        {/* Live Corridor Status Indicator */}
        <div className="hidden xl:flex items-center gap-4 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>A4 Beitbridge: <span className="font-semibold text-slate-800">400km+ Widened</span></span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>A5 Bulawayo: <span className="font-semibold text-slate-800">Normal Flow</span></span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Active Hazards: <span className="font-semibold text-slate-800">{activeHazardsCount}</span></span>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <button
            onClick={onOpenNotificationsModal}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Notification Centre"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Driver Persona / Login Switcher Button */}
          <button
            onClick={onOpenDriverLoginModal}
            title="Choose Driver Type (Truck, Bus, Citizen Commuter) or Switch Profile"
            className={`px-2.5 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              currentDriverType === 'truck'
                ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                : currentDriverType === 'bus'
                ? 'bg-blue-100 text-blue-950 border-blue-400 hover:bg-blue-200'
                : 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
            }`}
          >
            {currentDriverType === 'truck' ? (
              <Truck className="w-3.5 h-3.5 text-amber-700" />
            ) : currentDriverType === 'bus' ? (
              <Bus className="w-3.5 h-3.5 text-blue-700" />
            ) : (
              <Car className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span className="font-extrabold">
              {currentDriverType === 'truck'
                ? 'Truck Driver'
                : currentDriverType === 'bus'
                ? 'Bus Operator'
                : 'Commuter'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium hidden xl:inline">· Log In / Switch</span>
          </button>

          {/* User Role Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors">
            <span className="text-slate-500 text-[11px] font-medium hidden md:inline">Role:</span>
            <select
              value={currentUserRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setCurrentUserRole(newRole);
                if (newRole === 'news_journalist') {
                  setActiveTab('publisher');
                }
              }}
              className="bg-transparent text-slate-800 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="citizen">Citizen Commuter</option>
              <option value="verified_driver">Verified Long-Haul Driver</option>
              <option value="transport_operator">Transport Operator</option>
              <option value="moderator">Highway Safety Moderator</option>
              <option value="news_journalist">News Media & Press Desk</option>
            </select>
          </div>

          {/* Press & Newsroom Publisher Portal Button */}
          <button
            onClick={() => setActiveTab('publisher')}
            title="News Media & Journalist Publisher Hub"
            className={`px-2.5 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'publisher'
                ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Press Portal</span>
            <span className="px-1 py-0.2 bg-amber-200/80 text-amber-950 text-[9px] font-mono rounded font-bold uppercase">
              Desk
            </span>
          </button>

          {/* Integrations Transparency Button */}
          <button
            onClick={onOpenIntegrationsModal}
            title="Integrations & Architecture Status"
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Integrations</span>
          </button>

          {/* Primary CTA: Report Hazard */}
          <button
            onClick={onOpenReportModal}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Report Hazard</span>
            <span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs (Desktop & Tablet) */}
      <nav className="hidden md:block border-t border-slate-100 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto text-xs py-1.5">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Explore Map</span>
            <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] rounded-full font-mono">
              {activeHazardsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'routes'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Corridors & Tolls</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Community Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('operators')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'operators'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Operators & Fleets</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('moderator')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ml-auto ${
              activeTab === 'moderator'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Moderator Desk</span>
            {unverifiedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] rounded-full font-bold">
                {unverifiedCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
