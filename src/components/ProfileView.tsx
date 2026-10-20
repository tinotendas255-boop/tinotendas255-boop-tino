import React, { useState } from 'react';
import { UserProfile, RoadIncident, NewsStory, RouteOption, UserRole, ZimbabweTown, DriverType } from '../types';
import { PRESET_ROUTES, NEWS_STORIES } from '../data/mockRoadData';
import smartHighwayHero from '../assets/bulawayo_smart_highway.jpg';
import {
  User,
  ShieldCheck,
  MapPin,
  Navigation,
  Bookmark,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Save,
  Plus,
  ExternalLink,
  ArrowRight,
  Truck,
  Bus,
  Car,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  incidents: RoadIncident[];
  bookmarkedNewsIds: string[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectIncident: (incident: RoadIncident) => void;
  onNavigateTab: (tab: string) => void;
  onSelectHighwayOnMap: (highwayCode: string) => void;
  onOpenReportModal: () => void;
  onOpenDriverLoginModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  incidents,
  bookmarkedNewsIds,
  onUpdateProfile,
  onSelectIncident,
  onNavigateTab,
  onSelectHighwayOnMap,
  onOpenReportModal,
  onOpenDriverLoginModal,
}) => {
  const [name, setName] = useState<string>(userProfile.name);
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>(userProfile.phoneOrEmail);
  const [baseTown, setBaseTown] = useState<ZimbabweTown>(userProfile.baseTown);
  const [role, setRole] = useState<UserRole>(userProfile.role);
  const [driverType, setDriverType] = useState<DriverType>(userProfile.driverType || 'commuter');
  const [vehicleModel, setVehicleModel] = useState<string>(userProfile.vehicleModel || '');
  const [companyOrFleet, setCompanyOrFleet] = useState<string>(userProfile.companyOrFleet || '');
  const [activeTab, setActiveTab] = useState<'submissions' | 'saved_routes' | 'bookmarks' | 'settings'>('submissions');
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  React.useEffect(() => {
    setName(userProfile.name);
    setPhoneOrEmail(userProfile.phoneOrEmail);
    setBaseTown(userProfile.baseTown);
    setRole(userProfile.role);
    setDriverType(userProfile.driverType || 'commuter');
    setVehicleModel(userProfile.vehicleModel || '');
    setCompanyOrFleet(userProfile.companyOrFleet || '');
  }, [userProfile]);

  // User's own submissions
  // We match by reporterName or reporterId
  const mySubmissions = incidents.filter(
    (inc) =>
      inc.reporterName.toLowerCase().includes(userProfile.name.toLowerCase().split(' ')[0]) ||
      inc.reporterRole === userProfile.role
  );

  // Saved routes
  const mySavedRoutes = PRESET_ROUTES.filter((r) => userProfile.savedRouteIds.includes(r.id));

  // Bookmarked news
  const myBookmarks = NEWS_STORIES.filter((n) => bookmarkedNewsIds.includes(n.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name: name.trim(),
      phoneOrEmail: phoneOrEmail.trim(),
      baseTown,
      role,
      driverType,
      vehicleModel: vehicleModel.trim(),
      companyOrFleet: companyOrFleet.trim(),
    };
    onUpdateProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const getStatusBadge = (status: RoadIncident['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded">VERIFIED</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded">RESOLVED</span>;
      case 'under_review':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded">UNDER REVIEW</span>;
      case 'dismissed':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-bold rounded">DISMISSED</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-bold rounded">REPORTED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-md flex-shrink-0 group">
            <img
              src={smartHighwayHero}
              alt={userProfile.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{userProfile.name}</h1>
              {userProfile.isVerifiedDriver && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Driver
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1 flex-wrap">
              <span>{userProfile.phoneOrEmail}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Base: <strong className="text-slate-700">{userProfile.baseTown}</strong>
              </span>
              <span>·</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono inline-flex items-center gap-1 ${
                userProfile.driverType === 'truck'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : userProfile.driverType === 'bus'
                  ? 'bg-blue-100 text-blue-950 border border-blue-300'
                  : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
              }`}>
                {userProfile.driverType === 'truck' ? <Truck className="w-3 h-3" /> : userProfile.driverType === 'bus' ? <Bus className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                {userProfile.driverType === 'truck' ? 'Heavy Freight Trucker' : userProfile.driverType === 'bus' ? 'Coach Operator' : 'Citizen Commuter'}
              </span>
              {userProfile.vehicleModel && (
                <span className="text-slate-600 hidden sm:inline">({userProfile.vehicleModel})</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          {onOpenDriverLoginModal && (
            <button
              type="button"
              onClick={onOpenDriverLoginModal}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Switch Driver Type</span>
            </button>
          )}
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex items-center gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>My Submissions ({mySubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_routes')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'saved_routes'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Saved Corridors ({mySavedRoutes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'bookmarks'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarked Stories ({myBookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab: Submissions */}
      {activeTab === 'submissions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                My Community Hazard Reports & Moderation Lifecycle
              </h3>
              <p className="text-xs text-slate-500">
                Track status updates from reported to under review, verified, and resolved.
              </p>
            </div>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No reports submitted yet</p>
              <p className="text-slate-500 mt-0.5">When you report road hazards or toll queues, track them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectIncident(sub)}
                  className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(sub.verificationStatus)}
                      <span className="font-bold text-slate-800">{sub.highway}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{sub.locationName}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{sub.title}</div>
                    <p className="text-slate-600 line-clamp-1">{sub.description}</p>
                    {sub.moderationNotes && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded">
                        <strong>Safety Desk Note:</strong> {sub.moderationNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-shrink-0">
                    <span>{sub.confirmationsCount} confirmations</span>
                    <button className="px-3 py-1.5 bg-slate-900 text-white rounded font-medium">
                      View Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Routes */}
      {activeTab === 'saved_routes' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bookmarked Highway Corridors ({mySavedRoutes.length})
              </h3>
              <p className="text-xs text-slate-500">
                Instant access to toll costs, current roadworks, and travel briefings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySavedRoutes.map((route) => (
              <div
                key={route.id}
                className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-emerald-800">{route.highwayCode}</span>
                    <span>{route.tollCount} ZINARA Gates</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {route.origin} &rarr; {route.destination}
                  </h4>
                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <div>Distance: <strong className="font-mono text-slate-900">{route.distanceKm} km</strong></div>
                    <div>Drive time: <strong className="font-mono text-slate-900">~{Math.floor(route.estMinutes / 60)}h {route.estMinutes % 60}m</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      onSelectHighwayOnMap(route.highwayCode);
                      onNavigateTab('map');
                    }}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                  >
                    View on Map &rarr;
                  </button>

                  <button
                    onClick={() => onNavigateTab('routes')}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded font-medium cursor-pointer"
                  >
                    Full Itinerary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Bookmarked Stories */}
      {activeTab === 'bookmarks' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Saved News & Advisories ({myBookmarks.length})
              </h3>
              <p className="text-xs text-slate-500">
                Saved announcements, toll notices, and safety directives for offline reference.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {myBookmarks.map((story) => (
              <div
                key={story.id}
                onClick={() => onNavigateTab('news')}
                className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">{story.categoryLabel} · {story.publishedAt}</div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{story.title}</h4>
                  <p className="text-slate-600 line-clamp-1">{story.summary}</p>
                </div>

                <span className="text-emerald-700 font-semibold text-xs flex-shrink-0">
                  Read story &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Personal Information & Regional Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Configure your home base and driver profile.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Your Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Phone Number or Email:</label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Primary Base Town / City:</label>
              <select
                value={baseTown}
                onChange={(e) => setBaseTown(e.target.value as ZimbabweTown)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Harare">Harare</option>
                <option value="Bulawayo">Bulawayo</option>
                <option value="Beitbridge">Beitbridge</option>
                <option value="Mutare">Mutare</option>
                <option value="Gweru">Gweru</option>
                <option value="Masvingo">Masvingo</option>
                <option value="Chinhoyi">Chinhoyi</option>
                <option value="Victoria Falls">Victoria Falls</option>
                <option value="Chirundu">Chirundu</option>
                <option value="Kadoma">Kadoma</option>
                <option value="Hwange">Hwange</option>
              </select>
            </div>

            {/* Driver Type Persona Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Driver Classification & Vehicle Type:
                </label>
                {onOpenDriverLoginModal && (
                  <button
                    type="button"
                    onClick={onOpenDriverLoginModal}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Open Preset Login Modal &rarr;</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Determines your tailored landing page widgets, weighbridge queues, toll categories, and highway news dispatches.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Truck */}
                <div
                  onClick={() => {
                    setDriverType('truck');
                    setRole('verified_driver');
                  }}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    driverType === 'truck'
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Heavy Freight</div>
                      <div className="text-[10px] font-mono text-amber-800">Class 5 ($20 USD)</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    Long-haul haulage, weighbridge WIM sensors & diesel bunkering.
                  </div>
                </div>

                {/* Bus */}
                <div
                  onClick={() => {
                    setDriverType('bus');
                    setRole('transport_operator');
                  }}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    driverType === 'bus'
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Intercity Coach</div>
                      <div className="text-[10px] font-mono text-blue-800">Class 3 ($10 USD)</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    Terminal dispatch bays, speed limiters & coach express booms.
                  </div>
                </div>

                {/* Commuter */}
                <div
                  onClick={() => {
                    setDriverType('commuter');
                    setRole('citizen');
                  }}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    driverType === 'commuter'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Citizen Commuter</div>
                      <div className="text-[10px] font-mono text-emerald-800">Class 1 ($4 USD)</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    Urban shortcuts, pothole alerts, family road trips & daily routes.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Vehicle Model / Fleet Rig:</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder={driverType === 'truck' ? 'e.g. Freightliner Argosy 34T' : driverType === 'bus' ? 'e.g. Scania Marcopolo 75-Seater' : 'e.g. Toyota Hilux GD-6 Raider'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Company / Fleet Association:</label>
                <input
                  type="text"
                  value={companyOrFleet}
                  onChange={(e) => setCompanyOrFleet(e.target.value)}
                  placeholder={driverType === 'truck' ? 'e.g. Pioneer Freight' : driverType === 'bus' ? 'e.g. Extra City Luxury Coaches' : 'e.g. Private Motorist'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">User Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="citizen">Citizen Commuter</option>
                <option value="verified_driver">Verified Long-Distance Driver</option>
                <option value="transport_operator">Transport Operator</option>
                <option value="moderator">Highway Safety Moderator</option>
                <option value="news_journalist">News Media & Press Desk</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-950">Accredited News Media / Reporter?</div>
                <div className="text-[11px] text-amber-800">Sign in to the Newsroom Portal to upload official road stories.</div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('publisher')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px] cursor-pointer"
              >
                Press Portal &rarr;
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isSavedNotice && <span className="text-emerald-700 font-bold">Profile updated successfully ✓</span>}
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors cursor-pointer ml-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
