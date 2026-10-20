import React from 'react';
import { Phone, Shield, ExternalLink, Heart, Server } from 'lucide-react';

interface FooterProps {
  onOpenIntegrations: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenIntegrations, onNavigateTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-12 text-xs">
      {/* Emergency Roadside Hotlines Bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Zimbabwe National Road Emergency Directory:</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-300 text-[11px]">
            <span>
              <strong className="text-white">ZRP Police Traffic Desk:</strong> +263 242 703631
            </span>
            <span className="text-slate-600">·</span>
            <span>
              <strong className="text-white">Traffic Safety Council (TSCZ):</strong> +263 242 751203
            </span>
            <span className="text-slate-600">·</span>
            <span>
              <strong className="text-white">National Ambulance Services:</strong> 999 / 112
            </span>
            <span className="text-slate-600">·</span>
            <span>
              <strong className="text-white">AA Zimbabwe Road Rescue:</strong> +263 242 752445
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand statement */}
        <div className="space-y-2 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center font-mono text-xs">
              RL
            </span>
            <span>RoadLink Zimbabwe</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Unified digital transport and highway intelligence network for motorists, cross-border haulage operators, and commuter networks across Zimbabwe.
          </p>
        </div>

        {/* Quick Corridor links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
            Key Highway Corridors
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>A4: Harare - Masvingo - Beitbridge</li>
            <li>A5: Harare - Gweru - Bulawayo</li>
            <li>A8: Bulawayo - Hwange - Victoria Falls</li>
            <li>A1: Harare - Karoi - Chirundu</li>
            <li>A3: Harare - Rusape - Mutare</li>
          </ul>
        </div>

        {/* Platform Policy & Transparency */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
            Platform Transparency
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>
              <button
                onClick={onOpenIntegrations}
                className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                <Server className="w-3 h-3 text-emerald-400" />
                <span>Integrations & Demo vs Live Status</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('publisher')}
                className="hover:text-amber-400 transition-colors text-left cursor-pointer flex items-center gap-1 text-amber-500 font-semibold"
              >
                <span>Accredited Press & Newsroom Portal &rarr;</span>
              </button>
            </li>
            <li>Zero false partnership or commercial claims</li>
            <li>Strict [SPONSORED] travel notices standard</li>
            <li>Community crowd verification & audit trails</li>
          </ul>
        </div>

        {/* Legal & Standards */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
            Standards & Safety Pledge
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Data provided is for informational awareness. Always obey physical road signage, traffic marshals, VID officers, and Zimbabwe Republic Police directives on the highway.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-900 py-4 px-4 sm:px-6 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} RoadLink Zimbabwe · Serving Southern African Trade Corridors
      </div>
    </footer>
  );
};
