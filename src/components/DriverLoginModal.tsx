import React, { useState } from 'react';
import { UserProfile, DriverType, UserRole, ZimbabweTown } from '../types';
import {
  Truck,
  Bus,
  Car,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Scale,
  MapPin,
  Building2,
  Phone,
  Fuel,
  ArrowRight,
  PenTool,
  AlertTriangle,
} from 'lucide-react';

interface DriverLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: UserProfile;
  onSelectDriverPersona: (updatedProfile: UserProfile) => void;
  onNavigateTab: (tab: string) => void;
}

const PRESET_DRIVER_PROFILES: {
  type: DriverType;
  title: string;
  badge: string;
  icon: typeof Truck;
  summary: string;
  vehicleModel: string;
  companyOrFleet: string;
  driverName: string;
  baseTown: ZimbabweTown;
  role: UserRole;
  highlights: string[];
  tollClass: string;
  tollFee: string;
  themeColor: string;
}[] = [
  {
    type: 'truck',
    title: 'Heavy Freight & Long-Haul Truck Driver',
    badge: 'COMMERCIAL HAULAGE',
    icon: Truck,
    summary: 'Cross-border logistics, 30+ tonne superlinks, abnormal load corridors, and bulk freight transit.',
    driverName: 'Captain Blessing Moyo',
    companyOrFleet: 'Pioneer & Bakers Logistics',
    vehicleModel: 'Freightliner Argosy 6x4 (34T Superlink)',
    baseTown: 'Bulawayo',
    role: 'verified_driver',
    highlights: [
      'Live weighbridge wait times & axle telemetry (Esigodini & Beatrice)',
      'Class 5 Heavy Haulage toll pass management ($15 - $20 USD)',
      '24/7 guarded overnight truck staging hubs (West Nicholson, Rutenga)',
      'Beitbridge commercial cargo queue telemetry (45 min fast clearance)',
    ],
    tollClass: 'Class 5 (Heavy Haulage)',
    tollFee: '$20.00 USD',
    themeColor: 'amber',
  },
  {
    type: 'bus',
    title: 'Intercity Bus & Public Transit Operator',
    badge: 'PASSENGER FLEET',
    icon: Bus,
    summary: 'Scheduled luxury coaches, cross-border passenger buses, and regional commuter omnibus routes.',
    driverName: 'Tendai Chiweshe',
    companyOrFleet: 'Extra City Luxury Coaches',
    vehicleModel: 'Scania Marcopolo G7 (75-Seater Coach)',
    baseTown: 'Bulawayo',
    role: 'transport_operator',
    highlights: [
      'Live passenger terminal dispatch bay status (Renkini, Road Port)',
      'Dedicated Class 3 bus express tollgate lanes ($10 USD)',
      'Passenger manifest digital check protocol & safety blitz alerts',
      'Scheduled route transit timetables (Bulawayo–Harare 5h 45m)',
    ],
    tollClass: 'Class 3 (Buses / Coaches)',
    tollFee: '$10.00 USD',
    themeColor: 'blue',
  },
  {
    type: 'commuter',
    title: 'Citizen Commuter & Private Motorist',
    badge: 'DAILY COMMUTER',
    icon: Car,
    summary: 'Daily urban driving, family road trips, school runs, and regional weekend travel across Zimbabwe.',
    driverName: 'Tinotenda Sibanda',
    companyOrFleet: 'Private Family Motorist',
    vehicleModel: 'Toyota Hilux GD-6 Raider 4x4',
    baseTown: 'Bulawayo',
    role: 'citizen',
    highlights: [
      'Urban traffic shortcuts & resurfaced corridors (Ascot & Luveve Phase III)',
      'Light vehicle toll tariffs ($4.00 USD or 110 ZiG with fast boom clearance)',
      'Local weather alerts, flash flood warnings & safe driving index',
      'Weekend getaway corridors (A6 Gwanda clear flow, Matopos routes)',
    ],
    tollClass: 'Class 1 (Light Vehicles)',
    tollFee: '$4.00 USD / 110 ZiG',
    themeColor: 'emerald',
  },
];

const ZIMBABWE_TOWNS: ZimbabweTown[] = [
  'Bulawayo',
  'Harare',
  'Beitbridge',
  'Gwanda',
  'Gweru',
  'Mutare',
  'Masvingo',
  'Kwekwe',
  'Chinhoyi',
  'Victoria Falls',
  'Hwange',
  'Kadoma',
  'Zvishavane',
  'Chirundu',
  'Plumtree',
] as ZimbabweTown[];

export const DriverLoginModal: React.FC<DriverLoginModalProps> = ({
  isOpen,
  onClose,
  currentUserProfile,
  onSelectDriverPersona,
  onNavigateTab,
}) => {
  const [selectedType, setSelectedType] = useState<DriverType>(
    currentUserProfile.driverType || 'commuter'
  );
  const [customName, setCustomName] = useState<string>(currentUserProfile.name);
  const [customVehicle, setCustomVehicle] = useState<string>(
    currentUserProfile.vehicleModel || 'Toyota Hilux GD-6 Raider 4x4'
  );
  const [customFleet, setCustomFleet] = useState<string>(
    currentUserProfile.companyOrFleet || 'Private Motorist'
  );
  const [customTown, setCustomTown] = useState<ZimbabweTown>(
    currentUserProfile.baseTown || 'Bulawayo'
  );
  const [customPhone, setCustomPhone] = useState<string>(
    currentUserProfile.phoneOrEmail || '+263 77 348 2914'
  );
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: (typeof PRESET_DRIVER_PROFILES)[0]) => {
    const updated: UserProfile = {
      ...currentUserProfile,
      name: preset.driverName,
      driverType: preset.type,
      role: preset.role,
      vehicleModel: preset.vehicleModel,
      companyOrFleet: preset.companyOrFleet,
      baseTown: preset.baseTown,
      isVerifiedDriver: true,
    };
    onSelectDriverPersona(updated);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleMap: Record<DriverType, UserRole> = {
      truck: 'verified_driver',
      bus: 'transport_operator',
      commuter: 'citizen',
    };

    const updated: UserProfile = {
      ...currentUserProfile,
      name: customName.trim() || 'Driver',
      driverType: selectedType,
      role: roleMap[selectedType],
      vehicleModel: customVehicle.trim() || (selectedType === 'truck' ? 'Freightliner 34T' : selectedType === 'bus' ? 'Intercity Coach' : 'Sedan / SUV'),
      companyOrFleet: customFleet.trim() || (selectedType === 'commuter' ? 'Private Motorist' : 'Commercial Operator'),
      baseTown: customTown,
      phoneOrEmail: customPhone.trim(),
      isVerifiedDriver: true,
    };
    onSelectDriverPersona(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1900] bg-[#0B1220]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-4xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-[#0B1220] text-white p-6 sm:p-8 relative border-b border-[#1E293B]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 text-xs font-bold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Zimbabwe Driver Persona & Identity Login</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              Choose What Type of Driver You Are
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Select your driver type to unlock a personalized landing page and tailored news wire. Long-haul truckers get weighbridge and freight telemetry; bus operators get rank departure boards; citizen commuters get urban traffic shortcuts and pothole advisories.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Persona Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRESET_DRIVER_PROFILES.map((preset) => {
              const Icon = preset.icon;
              const isCurrent = currentUserProfile.driverType === preset.type;

              return (
                <div
                  key={preset.type}
                  className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer text-left relative ${
                    isCurrent
                      ? 'border-[#2563EB] bg-[#2563EB]/5 shadow-md ring-2 ring-[#2563EB]/30'
                      : 'border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#2563EB]/40 hover:bg-[#F1F5F9]'
                  }`}
                  onClick={() => {
                    setSelectedType(preset.type);
                    setCustomName(preset.driverName);
                    setCustomVehicle(preset.vehicleModel);
                    setCustomFleet(preset.companyOrFleet);
                    setCustomTown(preset.baseTown);
                  }}
                >
                  {isCurrent && (
                    <div className="absolute top-3 right-3 bg-[#2563EB] text-white p-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                          preset.type === 'truck'
                            ? 'bg-[#F97316]'
                            : preset.type === 'bus'
                            ? 'bg-[#2563EB]'
                            : 'bg-[#16A34A]'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                          {preset.badge}
                        </span>
                        <h3 className="font-bold text-sm text-[#111827] leading-snug">
                          {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed font-sans">
                      {preset.summary}
                    </p>

                    <div className="p-3 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between font-mono text-[#64748B] text-[10px]">
                        <span>TOLL TARIFF</span>
                        <span className="font-bold text-[#111827]">{preset.tollFee}</span>
                      </div>
                      <div className="text-[#111827] font-medium">
                        {preset.tollClass}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase">
                        Tailored Telemetry Unlocked:
                      </div>
                      <ul className="space-y-1 text-[11px] text-[#64748B] list-disc pl-4 leading-snug">
                        {preset.highlights.slice(0, 2).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyPreset(preset);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        preset.type === 'truck'
                          ? 'bg-[#F97316] hover:bg-orange-600 text-white'
                          : preset.type === 'bus'
                          ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                          : 'bg-[#16A34A] hover:bg-green-700 text-white'
                      }`}
                    >
                      <span>1-Click Log In as {preset.driverName.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-center text-[10px] text-[#64748B] font-mono">
                      {preset.companyOrFleet}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Sign-In Form Accordion / Section */}
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-tight flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  Or Enter Your Custom Driver Information
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Provide your own name, vehicle model, and employer fleet to customize your dashboard profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomizing(!isCustomizing)}
                className="text-xs font-bold text-[#2563EB] hover:text-blue-700 cursor-pointer"
              >
                {isCustomizing ? 'Hide Form ▲' : 'Customize Profile ▼'}
              </button>
            </div>

            {isCustomizing && (
              <form onSubmit={handleCustomSubmit} className="space-y-4 pt-2 border-t border-[#E2E8F0] text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[#111827] block mb-1">Driver Type *</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as DriverType)}
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      <option value="truck">Heavy Freight & Truck Driver</option>
                      <option value="bus">Intercity Bus & Coach Operator</option>
                      <option value="commuter">Citizen Commuter & Motorist</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Tendai Sibanda"
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">Base City / Town</label>
                    <select
                      value={customTown}
                      onChange={(e) => setCustomTown(e.target.value as ZimbabweTown)}
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                      {ZIMBABWE_TOWNS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[#111827] block mb-1">Vehicle Model</label>
                    <input
                      type="text"
                      value={customVehicle}
                      onChange={(e) => setCustomVehicle(e.target.value)}
                      placeholder={selectedType === 'truck' ? 'e.g. Scania R500 6x4' : selectedType === 'bus' ? 'e.g. Yutong 65-Seat' : 'e.g. Toyota Hilux / Corolla'}
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">Fleet / Employer Name</label>
                    <input
                      type="text"
                      value={customFleet}
                      onChange={(e) => setCustomFleet(e.target.value)}
                      placeholder={selectedType === 'commuter' ? 'Private Motorist' : 'e.g. Swift / Extra City / Pioneer'}
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#111827] block mb-1">Phone or Email</label>
                    <input
                      type="text"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="+263 77..."
                      className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Save & Load My Personal Dashboard</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Alternate Roles Quick Switch (Press & Moderator) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0] text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#111827]">Other Roles:</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateTab('publisher');
                }}
                className="px-2.5 py-1 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <PenTool className="w-3 h-3 text-[#F97316]" />
                <span>Accredited Press Newsroom Portal &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateTab('moderator');
                }}
                className="px-2.5 py-1 bg-[#0B1220] hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                <span>Moderator Operations Desk &rarr;</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-[#64748B] hover:text-[#111827] cursor-pointer font-medium"
            >
              Continue without changing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
