import React, { useState } from 'react';
import { AppNotification, UserProfile } from '../types';
import { Bell, CheckCircle2, AlertTriangle, CloudRain, Navigation, Check, X, Settings, ShieldAlert, Sparkles } from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  userProfile: UserProfile;
  onUpdateNotifications: (updated: AppNotification[]) => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  userProfile,
  onUpdateNotifications,
  onUpdateProfile,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'preferences'>('feed');

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    onUpdateNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    onUpdateNotifications(updated);
  };

  const handleClearAll = () => {
    onUpdateNotifications([]);
  };

  const handleTogglePref = (key: keyof UserProfile['notificationPrefs']) => {
    const updated: UserProfile = {
      ...userProfile,
      notificationPrefs: {
        ...userProfile.notificationPrefs,
        [key]: !userProfile.notificationPrefs[key],
      },
    };
    onUpdateProfile(updated);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'critical_incident':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'weather_alert':
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'route_update':
        return <Navigation className="w-4 h-4 text-emerald-600" />;
      case 'announcement':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'report_status':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[2100] bg-[#0B1220]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] max-w-lg w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B1220] text-white flex items-center justify-between border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#F97316]" />
            <div>
              <h2 className="text-base font-bold">Notification Centre</h2>
              <p className="text-[11px] text-slate-300">Road alerts & corridor status updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`py-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Recent Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#2563EB] text-white rounded-full text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preferences'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>
          </div>

          {activeTab === 'feed' && notifications.length > 0 && (
            <div className="flex items-center gap-2 text-[11px]">
              <button
                onClick={handleMarkAllRead}
                className="text-[#64748B] hover:text-[#111827] font-medium cursor-pointer"
              >
                Mark all read
              </button>
              <span className="text-[#E2E8F0]">·</span>
              <button
                onClick={handleClearAll}
                className="text-[#64748B] hover:text-[#111827] font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 max-h-[60vh]">
          {activeTab === 'feed' ? (
            notifications.length === 0 ? (
              <div className="py-12 text-center text-[#64748B] text-xs">
                <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto mb-2" />
                <p className="font-semibold text-[#111827]">You are completely up to date</p>
                <p className="text-[#64748B] mt-0.5">No pending highway alerts or route notices.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    handleMarkAsRead(notif.id);
                    if (notif.linkTab) {
                      onNavigateTab(notif.linkTab);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer text-xs flex items-start gap-3 ${
                    notif.isRead
                      ? 'bg-[#FFFFFF] border-[#E2E8F0] text-[#111827]'
                      : 'bg-[#2563EB]/5 border-[#2563EB]/30 text-[#111827] font-medium shadow-xs'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">{getIconForType(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-[#111827]">{notif.title}</span>
                      <span className="text-[10px] text-[#64748B] flex-shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-[#64748B] text-[11px] leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0 mt-1"></span>
                  )}
                </div>
              ))
            )
          ) : (
            <div className="space-y-4 text-xs">
              <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-3 text-[#64748B] leading-relaxed text-[11px]">
                <strong className="text-[#111827] block mb-0.5">Push Notifications Notice:</strong>
                In-app alerts are actively functioning. Web Push Delivery requires browser VAPID service configuration in production. Customize which alerts you receive below:
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F1F5F9]">
                  <div>
                    <div className="font-bold text-[#111827]">Critical Highway Incidents</div>
                    <div className="text-[#64748B] text-[11px]">Road closures, severe accidents, and bridge washaways.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.notificationPrefs.criticalIncidents}
                    onChange={() => handleTogglePref('criticalIncidents')}
                    className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F1F5F9]">
                  <div>
                    <div className="font-bold text-[#111827]">Severe Weather Warnings</div>
                    <div className="text-[#64748B] text-[11px]">SADC rainfall advisories, low bridge flood alerts, and escarpment fog.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.notificationPrefs.weatherWarnings}
                    onChange={() => handleTogglePref('weatherWarnings')}
                    className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F1F5F9]">
                  <div>
                    <div className="font-bold text-[#111827]">Saved Route Updates</div>
                    <div className="text-[#64748B] text-[11px]">Alerts specifically affecting your bookmarked corridors (e.g. A4, A5).</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.notificationPrefs.savedRoutes}
                    onChange={() => handleTogglePref('savedRoutes')}
                    className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F1F5F9]">
                  <div>
                    <div className="font-bold text-[#111827]">My Community Report Status Changes</div>
                    <div className="text-[#64748B] text-[11px]">Notifications when safety marshals review, verify, or resolve your reports.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.notificationPrefs.reportUpdates}
                    onChange={() => handleTogglePref('reportUpdates')}
                    className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center justify-end text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0B1220] hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
