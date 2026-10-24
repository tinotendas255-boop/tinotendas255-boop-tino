import React from 'react';
import { Home, Map, Newspaper, Users, User, Navigation } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unverifiedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  unverifiedCount,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-[1400] md:hidden bg-[#0B1220]/95 backdrop-blur-md border-t border-[#1E293B] px-2 py-1 shadow-2xl">
      <div className="grid grid-cols-5 gap-1">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#2563EB] font-bold'
              : 'text-[#64748B] hover:text-white font-medium'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Home</span>
        </button>

        {/* Explore Map */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'map'
              ? 'text-[#2563EB] font-bold'
              : 'text-[#64748B] hover:text-white font-medium'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Map</span>
        </button>

        {/* Corridors & Tolls */}
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'routes'
              ? 'text-[#2563EB] font-bold'
              : 'text-[#64748B] hover:text-white font-medium'
          }`}
        >
          <Navigation className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Corridors</span>
        </button>

        {/* Community */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer relative ${
            activeTab === 'community'
              ? 'text-[#2563EB] font-bold'
              : 'text-[#64748B] hover:text-white font-medium'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Community</span>
          {unverifiedCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#F97316]"></span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#2563EB] font-bold'
              : 'text-[#64748B] hover:text-white font-medium'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Profile</span>
        </button>
      </div>
    </div>
  );
};
