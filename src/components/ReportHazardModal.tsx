import React, { useState } from 'react';
import { RoadIncident, IncidentSeverity, IncidentCategory, ZimbabweHighway, ZimbabweTown, UserRole } from '../types';
import { AlertTriangle, MapPin, Navigation, Camera, X, CheckCircle, ShieldAlert, Car, HardHat, Clock, Calendar } from 'lucide-react';

interface ReportHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: RoadIncident) => void;
  currentUserRole: UserRole;
  initialCoords?: [number, number] | null;
}

const HIGHWAYS: ZimbabweHighway[] = [
  'A4 (Harare - Beitbridge)',
  'A5 (Harare - Bulawayo)',
  'A8 (Bulawayo - Victoria Falls)',
  'A1 (Harare - Chirundu)',
  'A3 (Harare - Mutare)',
  'A6 (Bulawayo - Beitbridge)',
  'A2 (Harare - Nyamapanda)',
  'A7 (Bulawayo - Plumtree)',
  'A9 (Mutare - Masvingo)',
  'Harare Urban',
  'Bulawayo Urban',
  'Other Regional Road',
];

const TOWNS: ZimbabweTown[] = [
  'Harare',
  'Bulawayo',
  'Beitbridge',
  'Mutare',
  'Gweru',
  'Masvingo',
  'Kwekwe',
  'Chinhoyi',
  'Victoria Falls',
  'Chirundu',
  'Kadoma',
  'Hwange',
  'Zvishavane',
  'Marondera',
  'Karoi',
];

const INCIDENT_CATEGORIES: { category: IncidentCategory; label: string; icon: string; defaultSeverity: IncidentSeverity }[] = [
  { category: 'accident', label: 'Accident / Collision', icon: '💥', defaultSeverity: 'critical' },
  { category: 'roadwork', label: 'Roadworks / ERRP II Detour', icon: '🚧', defaultSeverity: 'warning' },
  { category: 'pothole', label: 'Pothole Swarm / Edge Break', icon: '🕳️', defaultSeverity: 'warning' },
  { category: 'congestion', label: 'Toll Queue / Traffic Congestion', icon: '🚗', defaultSeverity: 'advisory' },
  { category: 'checkpoint', label: 'VID / Police Checkpoint', icon: '👮', defaultSeverity: 'info' },
  { category: 'flooding', label: 'Flash Flood / Submerged Bridge', icon: '🌊', defaultSeverity: 'critical' },
  { category: 'breakdown', label: 'Broken Down Heavy Rig', icon: '🚛', defaultSeverity: 'warning' },
  { category: 'closure', label: 'Total Road Closure', icon: '⛔', defaultSeverity: 'critical' },
];

export const ReportHazardModal: React.FC<ReportHazardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUserRole,
  initialCoords,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('pothole');
  const [title, setTitle] = useState<string>('');
  const [highway, setHighway] = useState<ZimbabweHighway>('A4 (Harare - Beitbridge)');
  const [town, setTown] = useState<ZimbabweTown>('Harare');
  const [locationName, setLocationName] = useState<string>('');
  const [coords, setCoords] = useState<[number, number]>(initialCoords || [-17.8252, 31.0335]);
  const [isApproximateLocation, setIsApproximateLocation] = useState<boolean>(false);
  const [severity, setSeverity] = useState<IncidentSeverity>('warning');
  const [direction, setDirection] = useState<'Northbound' | 'Southbound' | 'Eastbound' | 'Westbound' | 'Both Directions'>('Both Directions');
  const [isStillOngoing, setIsStillOngoing] = useState<boolean>(true);
  const [dateObserved, setDateObserved] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeObserved, setTimeObserved] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [description, setDescription] = useState<string>('');
  const [detourAdvice, setDetourAdvice] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsLocked, setGpsLocked] = useState<boolean>(false);
  const [photoAdded, setPhotoAdded] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialCoords) {
      setCoords(initialCoords);
      setGpsLocked(true);
    }
  }, [initialCoords]);

  if (!isOpen) return null;

  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setGpsLocked(true);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert(`Could not acquire GPS: ${err.message}. Using default corridor coordinates.`);
      },
      { timeout: 8000 }
    );
  };

  const handleCategorySelect = (category: IncidentCategory, defaultSev: IncidentSeverity) => {
    setSelectedCategory(category);
    setSeverity(defaultSev);
    if (!title) {
      const found = INCIDENT_CATEGORIES.find((t) => t.category === category);
      if (found) {
        setTitle(`${found.label} on ${highway.split(' ')[0]}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !locationName.trim() || !description.trim()) {
      alert('Please fill in the incident title, specific landmark or location, and description.');
      return;
    }

    const newIncident: RoadIncident = {
      id: `inc-${Date.now().toString(36)}`,
      title: title.trim(),
      category: selectedCategory,
      highway,
      town,
      locationName: locationName.trim(),
      coordinates: coords,
      isApproximateLocation,
      approximateAreaLabel: isApproximateLocation ? `General ${town} area` : undefined,
      severity,
      verificationStatus: currentUserRole === 'moderator' ? 'verified' : 'reported',
      timestamp: 'Just now',
      dateObserved,
      timeObserved,
      isStillOngoing,
      description: description.trim(),
      reporterRole: currentUserRole,
      reporterName: reporterName.trim() || (currentUserRole === 'verified_driver' ? 'Verified Driver' : 'Citizen Commuter'),
      confirmationsCount: 1,
      refutedCount: 0,
      helpfulCount: 1,
      direction,
      detourAdvice: detourAdvice.trim() || undefined,
      verifiedBy: currentUserRole === 'moderator' ? 'Highway Safety Desk' : undefined,
    };

    onSubmit(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 max-w-xl w-full my-8 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Submit Road Hazard or Disruption Report
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Alert fellow motorists and dispatch notification to highway safety marshals.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Incident Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Select Incident Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INCIDENT_CATEGORIES.map((item) => (
                <button
                  type="button"
                  key={item.category}
                  onClick={() => handleCategorySelect(item.category, item.defaultSeverity)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    selectedCategory === item.category
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Highway, Town, Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Highway / Corridor:
              </label>
              <select
                value={highway}
                onChange={(e) => setHighway(e.target.value as ZimbabweHighway)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {HIGHWAYS.map((hw) => (
                  <option key={hw} value={hw}>{hw}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Nearest Town / City:
              </label>
              <select
                value={town}
                onChange={(e) => setTown(e.target.value as ZimbabweTown)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {TOWNS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Direction of Flow:
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Both Directions">Both Directions Affected</option>
                <option value="Northbound">Northbound Only</option>
                <option value="Southbound">Southbound Only</option>
                <option value="Eastbound">Eastbound Only</option>
                <option value="Westbound">Westbound Only</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Short Incident Title:
            </label>
            <input
              type="text"
              placeholder="e.g. Broken down haulage truck blocking northbound lane"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Location & GPS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Landmark, Bridge, or KM Peg:
              </label>
              <button
                type="button"
                onClick={handleFetchGps}
                disabled={isLocating}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                {isLocating ? 'Acquiring GPS...' : gpsLocked ? 'GPS Locked ✓' : 'Use Current GPS'}
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. 10km after Skyline Toll Gate near Beatrice turnoff"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

            <div className="flex items-center justify-between pt-1.5 text-[11px] text-slate-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isApproximateLocation}
                  onChange={(e) => setIsApproximateLocation(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>General approximate area only (coordinates not exact)</span>
              </label>
              <span className="font-mono">[{coords[0].toFixed(4)}, {coords[1].toFixed(4)}]</span>
            </div>
          </div>

          {/* Date and Time Observed & Ongoing status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date Observed:</label>
              <input
                type="date"
                value={dateObserved}
                onChange={(e) => setDateObserved(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Time Observed:</label>
              <input
                type="time"
                value={timeObserved}
                onChange={(e) => setTimeObserved(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ongoing Status:</label>
              <select
                value={isStillOngoing ? 'yes' : 'no'}
                onChange={(e) => setIsStillOngoing(e.target.value === 'yes')}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-semibold"
              >
                <option value="yes">Hazard is Still Ongoing</option>
                <option value="no">Hazard Cleared / Past Event</option>
              </select>
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Severity Level:
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['critical', 'warning', 'advisory', 'info'] as IncidentSeverity[]).map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`py-1.5 px-2 rounded-lg border font-semibold text-center uppercase tracking-wider text-[11px] transition-colors cursor-pointer ${
                    severity === sev
                      ? sev === 'critical'
                        ? 'bg-red-600 text-white border-red-600'
                        : sev === 'warning'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Description & Current Conditions:
            </label>
            <textarea
              rows={3}
              placeholder="Describe road blockage, vehicle types involved, surface conditions, or queue length..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Detour Advice */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Alternative Route or Caution Advice (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Single-lane contraflow; use outer shoulder at 20km/h"
              value={detourAdvice}
              onChange={(e) => setDetourAdvice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Reporter Identification & Dashcam Attachment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Your Name / Reporter Handle:
              </label>
              <input
                type="text"
                placeholder="e.g. Farai K. (Intercity Driver)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Photo Attachment:
              </label>
              <button
                type="button"
                onClick={() => setPhotoAdded(!photoAdded)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  photoAdded
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                {photoAdded ? 'Photo Evidence Attached ✓' : 'Add Roadside Photo'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Publish Report to Network
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
