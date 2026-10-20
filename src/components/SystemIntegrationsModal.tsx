import React, { useState } from 'react';
import { SYSTEM_INTEGRATIONS_STATUS } from '../data/mockRoadData';
import { ShieldCheck, CheckCircle2, AlertTriangle, Key, Database, Copy, Check, Server, Terminal, Lock } from 'lucide-react';

interface SystemIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_MIGRATION_DDL = `-- =====================================================================
-- ROADLINK ZIMBABWE - PRODUCTION POSTGRESQL / CLOUD SQL SCHEMA MIGRATION
-- Generated for SADC Highway Infrastructure & Incident Management
-- =====================================================================

-- 1. Enable UUID and PostGIS spatial extensions (if available)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Enumerated types for Zimbabwe road system
CREATE TYPE incident_severity_enum AS ENUM ('critical', 'warning', 'advisory', 'info');
CREATE TYPE incident_type_enum AS ENUM ('accident', 'roadwork', 'checkpoint', 'pothole', 'flooding', 'toll_delay', 'breakdown', 'hazard');
CREATE TYPE incident_status_enum AS ENUM ('verified', 'unverified', 'resolved', 'investigating');
CREATE TYPE user_role_enum AS ENUM ('citizen', 'verified_driver', 'transport_operator', 'moderator');

-- 3. Road Incidents & Disruption Records
CREATE TABLE IF NOT EXISTS road_incidents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type incident_type_enum NOT NULL,
    highway VARCHAR(128) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    severity incident_severity_enum NOT NULL DEFAULT 'warning',
    status incident_status_enum NOT NULL DEFAULT 'unverified',
    description TEXT NOT NULL,
    reporter_role user_role_enum NOT NULL DEFAULT 'citizen',
    reporter_name VARCHAR(128) NOT NULL,
    confirmations_count INTEGER NOT NULL DEFAULT 1,
    refuted_count INTEGER NOT NULL DEFAULT 0,
    direction VARCHAR(64) DEFAULT 'Both Directions',
    detour_advice TEXT,
    estimated_clear_time VARCHAR(128),
    verified_by VARCHAR(128),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for rapid spatial and highway queries
CREATE INDEX idx_incidents_highway ON road_incidents(highway);
CREATE INDEX idx_incidents_status ON road_incidents(status);
CREATE INDEX idx_incidents_severity ON road_incidents(severity);
CREATE INDEX idx_incidents_coords ON road_incidents(latitude, longitude);

-- 4. Highway Corridors & ZINARA Plazas
CREATE TABLE IF NOT EXISTS highway_corridors (
    code VARCHAR(16) PRIMARY KEY, -- e.g. 'A4', 'A5'
    name VARCHAR(255) NOT NULL,
    from_city VARCHAR(128) NOT NULL,
    to_city VARCHAR(128) NOT NULL,
    length_km NUMERIC(7,2) NOT NULL,
    surface_condition VARCHAR(128) NOT NULL,
    toll_gates_count INTEGER NOT NULL DEFAULT 0,
    toll_gates JSONB NOT NULL DEFAULT '[]'::jsonb,
    average_speed_kmh INTEGER NOT NULL DEFAULT 80,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. News & Ministerial Advisories
CREATE TABLE IF NOT EXISTS news_stories (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content JSONB NOT NULL,
    category VARCHAR(64) NOT NULL,
    author VARCHAR(128) NOT NULL,
    source VARCHAR(128) NOT NULL,
    read_time_minutes INTEGER NOT NULL DEFAULT 3,
    related_highway VARCHAR(128),
    is_sponsored BOOLEAN NOT NULL DEFAULT FALSE,
    sponsor_name VARCHAR(128),
    tags TEXT[] NOT NULL DEFAULT '{}',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Transport Operators & Fleets
CREATE TABLE IF NOT EXISTS transport_operators (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    fleet_type VARCHAR(128) NOT NULL,
    headquarters VARCHAR(128) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    whatsapp VARCHAR(64),
    email VARCHAR(128) NOT NULL,
    primary_routes TEXT[] NOT NULL DEFAULT '{}',
    main_terminals TEXT[] NOT NULL DEFAULT '{}',
    safety_rating NUMERIC(3,2) NOT NULL DEFAULT 4.5,
    verified_operator BOOLEAN NOT NULL DEFAULT TRUE,
    fleet_size_estimate VARCHAR(64),
    booking_channel VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Moderator Action & Resolution Audit Logs
CREATE TABLE IF NOT EXISTS moderator_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) NOT NULL REFERENCES road_incidents(id) ON DELETE CASCADE,
    incident_title VARCHAR(255) NOT NULL,
    action VARCHAR(32) NOT NULL, -- 'verified', 'resolved', 'severity_changed', 'dismissed'
    moderator_name VARCHAR(128) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Row Level Security (RLS) Policy Example
ALTER TABLE road_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read all incidents" ON road_incidents FOR SELECT USING (true);
CREATE POLICY "Citizens insert unverified incidents" ON road_incidents FOR INSERT WITH CHECK (status = 'unverified');
CREATE POLICY "Moderators manage incidents" ON road_incidents FOR ALL USING (
    current_setting('app.current_user_role', true) = 'moderator'
);
`;

export const SystemIntegrationsModal: React.FC<SystemIntegrationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql_migrations' | 'env_setup'>('status');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SQL_MIGRATION_DDL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  const operationalCount = SYSTEM_INTEGRATIONS_STATUS.filter((s) => s.status === 'operational').length;
  const demoCount = SYSTEM_INTEGRATIONS_STATUS.filter((s) => s.status === 'demo_mode').length;

  return (
    <div className="fixed inset-0 z-[2100] bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 max-w-3xl w-full max-h-[88vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
              <Server className="w-3.5 h-3.5" />
              Integration Transparency & Architecture Center
            </div>
            <h2 className="text-base font-bold">
              Operational Services vs Demo Providers & Credentials
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'status'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrations Status ({operationalCount} Live · {demoCount} Demo)
          </button>
          <button
            onClick={() => setActiveTab('sql_migrations')}
            className={`py-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sql_migrations'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Database Schema (PostgreSQL DDL)
          </button>
          <button
            onClick={() => setActiveTab('env_setup')}
            className={`py-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'env_setup'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Required API Credentials Guide
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[65vh]">
          {/* Tab 1: Integrations Status */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Integrations Transparency Statement:</span>
                RoadLink operates in strict compliance with transparency standards. Features backed by real live browser and map APIs are marked as <strong>Operational</strong>. Features relying on forthcoming external government agency feeds (e.g. ZINARA queue cameras or Meteorological Department telemetry) run in <strong>Demo / Calibrated Simulation Mode</strong> until official API agreements are activated.
              </div>

              <div className="space-y-3">
                {SYSTEM_INTEGRATIONS_STATUS.map((item) => (
                  <div
                    key={item.serviceId}
                    className="p-3.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors bg-white flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        <span className="text-[11px] text-slate-400">· {item.category}</span>
                      </div>
                      <p className="text-slate-600">{item.description}</p>
                      <div className="text-[11px] text-slate-500 pt-1">
                        <span className="font-semibold text-slate-700">Provider:</span> {item.provider}
                      </div>
                      {item.credentialsRequired && (
                        <div className="text-[11px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded inline-block mt-1">
                          Missing Config: {item.credentialsRequired}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {item.status === 'operational' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px] uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          OPERATIONAL
                        </span>
                      ) : item.status === 'demo_mode' ? (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded text-[11px] uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          DEMO / SIMULATION
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded text-[11px] uppercase tracking-wider">
                          REQUIRES CONFIG
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: SQL DDL Migrations */}
          {activeTab === 'sql_migrations' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Ready-to-deploy PostgreSQL / Cloud SQL schema script:
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? 'Copied to Clipboard!' : 'Copy Migration Script'}
                </button>
              </div>

              <pre className="bg-slate-950 text-emerald-400 font-mono text-[11px] p-4 rounded-lg overflow-x-auto max-h-[380px] leading-relaxed border border-slate-800 select-all">
                {SQL_MIGRATION_DDL}
              </pre>
            </div>
          )}

          {/* Tab 3: Environment Credentials Guide */}
          {activeTab === 'env_setup' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  Activating External Highway & Telecom Feeds
                </h4>
                <p className="mb-3">
                  To transition remaining simulated components to live production feeds, configure the following environment keys in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">.env</code>:
                </p>

                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block">ZINARA_PARTNER_API_KEY</span>
                    <span className="text-slate-500 font-sans text-xs">For live automated toll boom queue camera telemetry. Contact ZINARA Enterprise IT for mTLS certificate & API credentials.</span>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block">ZIM_MET_API_KEY</span>
                    <span className="text-slate-500 font-sans text-xs">Direct radar webhook from the Meteorological Services Department for Save and Runde low-lying river bridge flood warnings.</span>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="font-bold text-slate-900 block">AFRICASTALKING_API_KEY / TELCO_SMS_SECRET</span>
                    <span className="text-slate-500 font-sans text-xs">Enables emergency SMS broadcasts to drivers on 2G non-smartphone highway sections across Zimbabwe.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>RoadLink Zimbabwe Architecture v1.0.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
