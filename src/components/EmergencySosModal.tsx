import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  AlertOctagon,
  Ambulance,
  Wrench,
  ShieldCheck,
  Crown,
  CheckCircle2,
  MapPin,
  Radio,
} from 'lucide-react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocationLabel: string;
  onDispatchSosAlert: (serviceType: string, notes: string) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  userLocationLabel,
  onDispatchSosAlert,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<'zrp' | 'ambulance' | 'recovery'>('recovery');
  const [sosNotes, setSosNotes] = useState('');
  const [dispatched, setDispatched] = useState(false);

  if (!isOpen) return null;

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const label =
      selectedUnit === 'zrp'
        ? 'ZRP Highway Patrol'
        : selectedUnit === 'ambulance'
        ? 'MARS / National Ambulance (999)'
        : 'AA Zimbabwe & Mechanics Rescue';
    onDispatchSosAlert(label, sosNotes || `Immediate roadside assistance requested near ${userLocationLabel}.`);
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setSosNotes('');
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[3200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0F172A] border border-red-500/40 shadow-2xl overflow-hidden text-white">
        {/* Crimson header */}
        <div className="bg-gradient-to-r from-[#DC2626] to-[#991B1B] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">RoadLink Emergency SOS</h2>
              <p className="text-xs text-red-100">Immediate roadside & traffic emergency dispatch</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleDispatch} className="p-5 space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0B1220] border border-[#1E293B] text-xs text-slate-300">
            <MapPin className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <span>
              Detected Corridor Base: <strong className="text-white">{userLocationLabel}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedUnit('recovery')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedUnit === 'recovery'
                  ? 'bg-[#2563EB]/20 border-[#3B82F6] text-white'
                  : 'bg-[#0B1220] border-[#1E293B] text-slate-300 hover:border-[#334155]'
              }`}
            >
              <Wrench className="w-5 h-5 text-[#F97316] mb-1.5" />
              <div className="text-xs font-bold">Roadside Rescue</div>
              <div className="text-[11px] text-[#94A3B8]">+263 242 752445</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUnit('ambulance')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedUnit === 'ambulance'
                  ? 'bg-[#DC2626]/20 border-[#EF4444] text-white'
                  : 'bg-[#0B1220] border-[#1E293B] text-slate-300 hover:border-[#334155]'
              }`}
            >
              <Ambulance className="w-5 h-5 text-[#EF4444] mb-1.5" />
              <div className="text-xs font-bold">Medical / MARS</div>
              <div className="text-[11px] text-[#94A3B8]">999 / 112 Toll-Free</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUnit('zrp')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedUnit === 'zrp'
                  ? 'bg-[#2563EB]/20 border-[#3B82F6] text-white'
                  : 'bg-[#0B1220] border-[#1E293B] text-slate-300 hover:border-[#334155]'
              }`}
            >
              <Radio className="w-5 h-5 text-[#60A5FA] mb-1.5" />
              <div className="text-xs font-bold">ZRP Traffic</div>
              <div className="text-[11px] text-[#94A3B8]">+263 242 703631</div>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Situation / Landmark Details
            </label>
            <textarea
              value={sosNotes}
              onChange={(e) => setSosNotes(e.target.value)}
              rows={3}
              placeholder="e.g., Tyre blowout 12km past Esigodini towards Gwanda, hazards on, silver sedan..."
              className="w-full rounded-xl bg-[#0B1220] border border-[#334155] px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          {dispatched ? (
            <div className="p-3 rounded-xl bg-[#16A34A]/20 border border-[#16A34A]/40 text-[#4ADE80] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>SOS Alert logged to Moderator Desk & nearby Rescue Responders!</span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Send SOS & Alert Responders</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

interface InfoActionModalProps {
  mode: 'secure' | 'premium' | null;
  onClose: () => void;
  onActivatePremium: () => void;
  isPremiumActive: boolean;
}

export const RoadLinkFeatureModal: React.FC<InfoActionModalProps> = ({
  mode,
  onClose,
  onActivatePremium,
  isPremiumActive,
}) => {
  if (!mode) return null;

  return (
    <div className="fixed inset-0 z-[3200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-2xl overflow-hidden text-white">
        <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {mode === 'secure' ? (
              <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
            ) : (
              <Crown className="w-5 h-5 text-[#FBBF24]" />
            )}
            <h3 className="text-sm font-extrabold">
              {mode === 'secure' ? 'RoadLink Secure Safety Charter' : 'RoadLink Plus · Premium'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-slate-300 leading-relaxed">
          {mode === 'secure' ? (
            <>
              <p>
                Every hazard report, breakdown alert, and media dispatch on RoadLink follows verified community and administrator validation protocols:
              </p>
              <ul className="space-y-2 text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Moderator verification queue before national media syndication.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Approximate area privacy protection when drivers hide exact coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Direct 1-tap routing to ZRP Traffic, TSCZ, and AA Road Rescue.</span>
                </li>
              </ul>
            </>
          ) : (
            <>
              <p>
                Upgrade your RoadLink driver membership to unlock priority highway intelligence and community rewards across Zimbabwe:
              </p>
              <ul className="space-y-2 text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <span>Priority ZINARA toll queue forecasts & detour alerts via SMS/WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <span>Verified Gold Ambassador badge & reward points for confirmed reports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <span>Priority dispatch with Mechanics Hub ZW roadside units.</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => {
                  onActivatePremium();
                  onClose();
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#0B1220] font-extrabold text-xs cursor-pointer"
              >
                {isPremiumActive ? 'RoadLink Premium Active ✓' : 'Activate RoadLink Plus Demo'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
