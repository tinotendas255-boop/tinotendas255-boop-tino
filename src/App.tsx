/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  RoadIncident,
  UserRole,
  IncidentSeverity,
  ModeratorActionLog,
  UserProfile,
  AppNotification,
  WeatherTravelAlert,
  NewsStory,
  RoutePreviewData,
  StoryComment,
  MediaWireDelivery,
} from './types';
import {
  getStoredIncidents,
  saveStoredIncidents,
  getStoredBookmarks,
  saveStoredBookmarks,
  getStoredAuditLogs,
  saveStoredAuditLogs,
  getEmergencyBanner,
  saveEmergencyBanner,
  getStoredUserProfile,
  saveStoredUserProfile,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredWeatherAlerts,
  getStoredNewsStories,
  saveStoredNewsStories,
} from './utils/storage';
import { NEWS_STORIES } from './data/mockRoadData';
import { computeDynamicRouteWithAlternatives } from './utils/routeEngine';
import { getEffectiveIncidentStatus, normalizeMediaHouseList, normalizeMediaHouseName } from './utils/mediaHouses';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { RoadMap } from './components/RoadMap';
import { RoutePlanner } from './components/RoutePlanner';
import { NewsFeed } from './components/NewsFeed';
import { NewsPublisherDashboard } from './components/NewsPublisherDashboard';
import { CommunityReportsView } from './components/CommunityReportsView';
import { TransportOperators } from './components/TransportOperators';
import { ModeratorPortal } from './components/ModeratorPortal';
import { ProfileView } from './components/ProfileView';
import { DriverLoginModal } from './components/DriverLoginModal';
import { ReportHazardModal } from './components/ReportHazardModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { SystemIntegrationsModal } from './components/SystemIntegrationsModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { RoadAssistantChat } from './components/RoadAssistantChat';
import { Footer } from './components/Footer';
import { CheckCircle2, Bot } from 'lucide-react';

export default function App() {
  // Navigation & Role State (Mobile-first defaults to 'home')
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile());

  // Core Data State (Persisted)
  const [incidents, setIncidents] = useState<RoadIncident[]>([]);
  const [newsStories, setNewsStories] = useState<NewsStory[]>(() => getStoredNewsStories());
  const [bookmarkedNewsIds, setBookmarkedNewsIds] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<ModeratorActionLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherTravelAlert[]>([]);
  const [emergencyBanner, setEmergencyBanner] = useState<string | null>(null);

  // Modals & Active Selections
  const [selectedIncident, setSelectedIncident] = useState<RoadIncident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportModalCoords, setReportModalCoords] = useState<[number, number] | null>(null);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [isDriverLoginModalOpen, setIsDriverLoginModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiDrawerInitialQuery, setAiDrawerInitialQuery] = useState<string>('');
  const [selectedHighwayOnMap, setSelectedHighwayOnMap] = useState<string>('all');
  const [activeRouteForMap, setActiveRouteForMap] = useState<RoutePreviewData | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Hydrate on mount
  useEffect(() => {
    setIncidents(getStoredIncidents());
    setNewsStories(getStoredNewsStories());
    setBookmarkedNewsIds(getStoredBookmarks());
    setAuditLogs(getStoredAuditLogs());
    setNotifications(getStoredNotifications());
    setWeatherAlerts(getStoredWeatherAlerts());
    setEmergencyBanner(getEmergencyBanner());
    setUserProfile(getStoredUserProfile());
  }, []);

  // Save incidents
  const updateIncidents = (newIncidents: RoadIncident[]) => {
    setIncidents(newIncidents);
    saveStoredIncidents(newIncidents);
  };

  // News Publisher actions
  const handlePublishNewsStory = (newStory: NewsStory) => {
    const updated = [newStory, ...newsStories.filter((s) => s.id !== newStory.id)];
    setNewsStories(updated);
    saveStoredNewsStories(updated);
    showToast(`Published "${newStory.title}" to the national wire!`);
  };

  const handleUpdateNewsStory = (updatedStory: NewsStory) => {
    const updated = newsStories.map((s) => (s.id === updatedStory.id ? updatedStory : s));
    setNewsStories(updated);
    saveStoredNewsStories(updated);
    showToast(`Updated "${updatedStory.title}"`);
  };

  const handleDeleteNewsStory = (storyId: string) => {
    const updated = newsStories.filter((s) => s.id !== storyId);
    setNewsStories(updated);
    saveStoredNewsStories(updated);
    showToast('Dispatch deleted from national wire');
  };

  // Add Comment to news dispatch / bulletin
  const handleAddStoryComment = (storyId: string, text: string) => {
    const newComment: StoryComment = {
      id: `comm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      userName: userProfile.name || 'Everyday Road User',
      userRole: userProfile.role,
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
    };

    const updated = newsStories.map((story) => {
      if (story.id !== storyId) return story;
      const existing = story.comments || [];
      return {
        ...story,
        comments: [newComment, ...existing],
      };
    });

    setNewsStories(updated);
    saveStoredNewsStories(updated);
    showToast('Your comment was posted to the news bulletin.');
  };

  // Save profile
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveStoredUserProfile(newProfile);
    showToast('Profile and preferences updated.');
  };

  // Save notifications
  const handleUpdateNotifications = (newNotifications: AppNotification[]) => {
    setNotifications(newNotifications);
    saveStoredNotifications(newNotifications);
  };

  // Community Voting
  const handleVote = (incidentId: string, type: 'confirm' | 'refute') => {
    const updated = incidents.map((inc) => {
      if (inc.id !== incidentId) return inc;

      let newConfirm = inc.confirmationsCount;
      let newRefute = inc.refutedCount;

      if (inc.userVote === type) {
        if (type === 'confirm') newConfirm = Math.max(0, newConfirm - 1);
        if (type === 'refute') newRefute = Math.max(0, newRefute - 1);
        return {
          ...inc,
          confirmationsCount: newConfirm,
          refutedCount: newRefute,
          userVote: undefined,
        };
      } else {
        if (inc.userVote === 'confirm') newConfirm = Math.max(0, newConfirm - 1);
        if (inc.userVote === 'refute') newRefute = Math.max(0, newRefute - 1);

        if (type === 'confirm') newConfirm += 1;
        if (type === 'refute') newRefute += 1;

        return {
          ...inc,
          confirmationsCount: newConfirm,
          refutedCount: newRefute,
          userVote: type,
        };
      }
    });

    updateIncidents(updated);

    if (selectedIncident && selectedIncident.id === incidentId) {
      const match = updated.find((i) => i.id === incidentId);
      if (match) setSelectedIncident(match);
    }

    showToast(type === 'confirm' ? 'Thanks for confirming hazard presence!' : 'Flagged as cleared. Safe travels!');
  };

  // Add Comment to incident
  const handleAddComment = (incidentId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now().toString(36)}`,
      userName: userProfile.name,
      userRole: userProfile.role,
      text,
      timestamp: 'Just now',
      isHelpfulVoteCount: 0,
    };

    const updated = incidents.map((inc) => {
      if (inc.id !== incidentId) return inc;
      const existingComments = inc.comments || [];
      return {
        ...inc,
        comments: [newComment, ...existingComments],
      };
    });

    updateIncidents(updated);
    if (selectedIncident && selectedIncident.id === incidentId) {
      const match = updated.find((i) => i.id === incidentId);
      if (match) setSelectedIncident(match);
    }
    showToast('Your update has been shared with motorists.');
  };

  // Submit New Incident Report
  const handleReportSubmit = (newIncident: RoadIncident) => {
    const selectedOutlets = normalizeMediaHouseList(newIncident.syndicatedMediaOutlets);
    const isMod = newIncident.verificationStatus === 'verified';
    const mediaDispatches: MediaWireDelivery[] = selectedOutlets.map((outletName) => ({
      outletName,
      status: isMod ? 'delivered' : 'pending_admin',
      queuedAt: 'Just now',
      deliveredAt: isMod ? 'Just now' : undefined,
      dispatchedBy: isMod ? 'Highway Safety Desk' : undefined,
    }));

    const enrichedIncident: RoadIncident = {
      ...newIncident,
      status: isMod ? 'verified' : 'unverified',
      verificationStatus: isMod ? 'verified' : 'reported',
      sentToAdministrator: true,
      syndicatedMediaOutlets: selectedOutlets,
      mediaDispatches,
    };

    const updated = [enrichedIncident, ...incidents];
    updateIncidents(updated);

    const mediaText =
      selectedOutlets.length > 0
        ? ` and routed to selected media houses (${selectedOutlets.join(', ')})`
        : '';

    // Notify in-app notification center
    const newNotif: AppNotification = {
      id: `notif-${Date.now().toString(36)}`,
      title: 'Report Submitted to Administrator Desk',
      message: `Report "${enrichedIncident.title}" on ${enrichedIncident.highway} is in the Moderator verification queue${mediaText}.`,
      type: 'report_status',
      timestamp: 'Just now',
      isRead: false,
      linkTab: selectedOutlets.length > 0 ? 'moderator' : 'community',
    };
    const updatedNotifs = [newNotif, ...notifications];
    handleUpdateNotifications(updatedNotifs);

    showToast(
      selectedOutlets.length > 0
        ? `Submitted to Administrator Desk & wired to ${selectedOutlets.join(', ')}!`
        : 'Hazard report submitted to Administrator verification queue!'
    );
  };

  // Build updated media dispatches list when moderator verifies or relays to selected outlets
  const buildDeliveredMediaDispatches = (
    existingDispatches: MediaWireDelivery[] | undefined,
    selectedOutlets: string[]
  ): MediaWireDelivery[] => {
    const normalized = normalizeMediaHouseList(selectedOutlets);
    return normalized.map((outletName) => {
      const prev = existingDispatches?.find(
        (d) => normalizeMediaHouseName(d.outletName) === outletName
      );
      if (prev && (prev.status === 'acknowledged' || prev.status === 'published')) {
        return { ...prev, outletName };
      }
      return {
        outletName,
        status: 'delivered',
        queuedAt: prev?.queuedAt || 'Just now',
        deliveredAt: 'Just now',
        dispatchedBy: 'Highway Safety Administrator',
      };
    });
  };

  // Moderator: Verify Incident & Deliver News to Selected Media Houses
  const handleModeratorVerify = (id: string, note?: string, selectedMediaOutlets?: string[]) => {
    const target = incidents.find((i) => i.id === id);
    if (!target) return;

    const finalOutlets = normalizeMediaHouseList(
      selectedMediaOutlets !== undefined ? selectedMediaOutlets : target.syndicatedMediaOutlets
    );
    const updatedDispatches = buildDeliveredMediaDispatches(target.mediaDispatches, finalOutlets);

    const updated = incidents.map((inc) =>
      inc.id === id
        ? {
            ...inc,
            status: 'verified' as const,
            verificationStatus: 'verified' as const,
            verifiedBy: 'Highway Safety Desk Officer',
            moderationNotes: note || 'Verified via patrol report',
            syndicatedMediaOutlets: finalOutlets,
            mediaDispatches: updatedDispatches,
            mediaDispatchedAt: finalOutlets.length > 0 ? 'Just now' : inc.mediaDispatchedAt,
            mediaDispatchedBy: finalOutlets.length > 0 ? 'Highway Safety Administrator' : inc.mediaDispatchedBy,
          }
        : inc
    );
    updateIncidents(updated);

    const mediaSummary =
      finalOutlets.length > 0
        ? ` · Delivered to media houses: ${finalOutlets.join(', ')}`
        : '';

    const newLog: ModeratorActionLog = {
      id: `log-${Date.now().toString(36)}`,
      incidentId: id,
      incidentTitle: target.title,
      action: 'verified',
      moderatorName: 'Duty Marshal',
      timestamp: 'Just now',
      note: `${note || 'Verified via patrol report'}${mediaSummary}`,
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveStoredAuditLogs(updatedLogs);

    if (finalOutlets.length > 0) {
      const dispatchNotif: AppNotification = {
        id: `notif-${Date.now().toString(36)}-media`,
        title: `News Delivered to ${finalOutlets.join(', ')}`,
        message: `Verified dispatch "${target.title}" (${target.highway}) has been delivered to ${finalOutlets.join(', ')} Press Wire Inboxes.`,
        type: 'announcement',
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'publisher',
      };
      handleUpdateNotifications([dispatchNotif, ...notifications]);
    }

    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({
        ...selectedIncident,
        status: 'verified',
        verificationStatus: 'verified',
        verifiedBy: 'Highway Safety Desk Officer',
        syndicatedMediaOutlets: finalOutlets,
        mediaDispatches: updatedDispatches,
      });
    }

    showToast(
      finalOutlets.length > 0
        ? `Verified & delivered news to: ${finalOutlets.join(', ')}`
        : 'Incident verified and promoted to live alert status.'
    );
  };

  // Moderator: Dispatch / Sync Media Houses on an already verified incident
  const handleModeratorDispatchMedia = (id: string, selectedMediaOutlets: string[]) => {
    const target = incidents.find((i) => i.id === id);
    if (!target) return;

    const finalOutlets = normalizeMediaHouseList(selectedMediaOutlets);
    const updatedDispatches = buildDeliveredMediaDispatches(target.mediaDispatches, finalOutlets);

    const updated = incidents.map((inc) =>
      inc.id === id
        ? {
            ...inc,
            syndicatedMediaOutlets: finalOutlets,
            mediaDispatches: updatedDispatches,
            mediaDispatchedAt: finalOutlets.length > 0 ? 'Just now' : undefined,
            mediaDispatchedBy: finalOutlets.length > 0 ? 'Highway Safety Administrator' : undefined,
          }
        : inc
    );
    updateIncidents(updated);

    const newLog: ModeratorActionLog = {
      id: `log-${Date.now().toString(36)}`,
      incidentId: id,
      incidentTitle: target.title,
      action: 'verified',
      moderatorName: 'Duty Marshal',
      timestamp: 'Just now',
      note:
        finalOutlets.length > 0
          ? `Media wire delivered exclusively to: ${finalOutlets.join(', ')}`
          : 'Cleared selected media house recipients',
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveStoredAuditLogs(updatedLogs);

    if (finalOutlets.length > 0) {
      const dispatchNotif: AppNotification = {
        id: `notif-${Date.now().toString(36)}-relay`,
        title: `Media Wire Updated: ${finalOutlets.join(', ')}`,
        message: `"${target.title}" is now available in the Press Wire Inbox for: ${finalOutlets.join(', ')}.`,
        type: 'announcement',
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'publisher',
      };
      handleUpdateNotifications([dispatchNotif, ...notifications]);
    }

    showToast(
      finalOutlets.length > 0
        ? `Dispatched news to: ${finalOutlets.join(', ')}`
        : 'Media recipients updated.'
    );
  };

  // Media House: Acknowledge receipt of wire dispatch
  const handleAcknowledgeMediaDispatch = (incidentId: string, outletName: string) => {
    const canonicalOutlet = normalizeMediaHouseName(outletName);
    const updated = incidents.map((inc) => {
      if (inc.id !== incidentId) return inc;
      const existing = inc.mediaDispatches || [];
      const hasEntry = existing.some(
        (d) => normalizeMediaHouseName(d.outletName) === canonicalOutlet
      );
      const nextDispatches: MediaWireDelivery[] = hasEntry
        ? existing.map((d) =>
            normalizeMediaHouseName(d.outletName) === canonicalOutlet
              ? { ...d, status: 'acknowledged', acknowledgedAt: 'Just now' }
              : d
          )
        : [
            ...existing,
            {
              outletName: canonicalOutlet,
              status: 'acknowledged',
              queuedAt: inc.timestamp || 'Recently',
              deliveredAt: 'Just now',
              acknowledgedAt: 'Just now',
            },
          ];

      return { ...inc, mediaDispatches: nextDispatches };
    });
    updateIncidents(updated);
  };

  // Media House: Mark wire dispatch as published to the National Gazette
  const handleMarkMediaDispatchPublished = (
    incidentId: string,
    outletName: string,
    storyId: string
  ) => {
    const canonicalOutlet = normalizeMediaHouseName(outletName);
    const updated = incidents.map((inc) => {
      if (inc.id !== incidentId) return inc;
      const existing = inc.mediaDispatches || [];
      const hasEntry = existing.some(
        (d) => normalizeMediaHouseName(d.outletName) === canonicalOutlet
      );
      const nextDispatches: MediaWireDelivery[] = hasEntry
        ? existing.map((d) =>
            normalizeMediaHouseName(d.outletName) === canonicalOutlet
              ? {
                  ...d,
                  status: 'published',
                  acknowledgedAt: d.acknowledgedAt || 'Just now',
                  publishedStoryId: storyId,
                  publishedAt: 'Just now',
                }
              : d
          )
        : [
            ...existing,
            {
              outletName: canonicalOutlet,
              status: 'published',
              queuedAt: inc.timestamp || 'Recently',
              deliveredAt: 'Just now',
              acknowledgedAt: 'Just now',
              publishedStoryId: storyId,
              publishedAt: 'Just now',
            },
          ];

      return { ...inc, mediaDispatches: nextDispatches };
    });
    updateIncidents(updated);
  };

  // Moderator: Resolve Incident
  const handleModeratorResolve = (id: string, note?: string) => {
    const target = incidents.find((i) => i.id === id);
    if (!target) return;

    const updated = incidents.map((inc) =>
      inc.id === id
        ? {
            ...inc,
            status: 'resolved' as const,
            verificationStatus: 'resolved' as const,
            isStillOngoing: false,
            resolvedAt: 'Just now by Safety Desk',
          }
        : inc
    );
    updateIncidents(updated);

    const newLog: ModeratorActionLog = {
      id: `log-${Date.now().toString(36)}`,
      incidentId: id,
      incidentTitle: target.title,
      action: 'resolved',
      moderatorName: 'Duty Marshal',
      timestamp: 'Just now',
      note: note || 'Hazard cleared; normal traffic flow restored',
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveStoredAuditLogs(updatedLogs);

    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({
        ...selectedIncident,
        status: 'resolved',
        verificationStatus: 'resolved',
        isStillOngoing: false,
        resolvedAt: 'Just now by Safety Desk',
      });
    }

    showToast('Hazard marked as cleared / resolved.');
  };

  // Moderator: Change Severity
  const handleModeratorChangeSeverity = (id: string, newSeverity: IncidentSeverity) => {
    const target = incidents.find((i) => i.id === id);
    if (!target) return;

    const updated = incidents.map((inc) =>
      inc.id === id ? { ...inc, severity: newSeverity } : inc
    );
    updateIncidents(updated);

    const newLog: ModeratorActionLog = {
      id: `log-${Date.now().toString(36)}`,
      incidentId: id,
      incidentTitle: target.title,
      action: 'severity_changed',
      moderatorName: 'Duty Marshal',
      timestamp: 'Just now',
      note: `Severity adjusted to ${newSeverity.toUpperCase()}`,
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveStoredAuditLogs(updatedLogs);

    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({
        ...selectedIncident,
        severity: newSeverity,
      });
    }

    showToast(`Severity adjusted to ${newSeverity.toUpperCase()}`);
  };

  // Moderator: Dismiss Incident
  const handleModeratorDismiss = (id: string, reason: string = 'Dismissed by safety moderator') => {
    const target = incidents.find((i) => i.id === id);
    if (!target) return;

    const updated = incidents.filter((inc) => inc.id !== id);
    updateIncidents(updated);

    const newLog: ModeratorActionLog = {
      id: `log-${Date.now().toString(36)}`,
      incidentId: id,
      incidentTitle: target.title,
      action: 'dismissed',
      moderatorName: 'Duty Marshal',
      timestamp: 'Just now',
      note: `Dismissed: ${reason}`,
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveStoredAuditLogs(updatedLogs);

    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(null);
    }

    showToast('Incident report dismissed and archived.');
  };

  // Emergency Broadcast Banner
  const handleUpdateEmergencyBanner = (banner: string | null) => {
    setEmergencyBanner(banner);
    saveEmergencyBanner(banner);
    showToast(banner ? 'Emergency alert broadcast activated!' : 'Emergency broadcast deactivated.');
  };

  // Bookmarking News
  const handleToggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarkedNewsIds.includes(id)) {
      updated = bookmarkedNewsIds.filter((item) => item !== id);
      showToast('Article removed from saved bookmarks.', 'info');
    } else {
      updated = [...bookmarkedNewsIds, id];
      showToast('Article saved to your bookmarks!');
    }
    setBookmarkedNewsIds(updated);
    saveStoredBookmarks(updated);
  };

  // Map clicks trigger report modal with prefilled coordinates
  const handleMapClickCoord = (coords: [number, number]) => {
    setReportModalCoords(coords);
    setIsReportModalOpen(true);
  };

  // Highway focus on map from route planner or dashboard
  const handleSelectHighwayOnMap = (highwayCode: string) => {
    setSelectedHighwayOnMap('all');
    const code = highwayCode.toUpperCase();
    let pair: [string, string] | null = null;
    if (code.includes('A6')) pair = ['Bulawayo', 'Gwanda'];
    else if (code.includes('A5')) pair = ['Bulawayo', 'Harare'];
    else if (code.includes('A8')) pair = ['Bulawayo', 'Victoria Falls'];
    else if (code.includes('A7')) pair = ['Bulawayo', 'Plumtree'];
    else if (code.includes('A4')) pair = ['Harare', 'Beitbridge'];
    else if (code.includes('A3')) pair = ['Harare', 'Mutare'];
    else if (code.includes('A9')) pair = ['Bulawayo', 'Masvingo'];
    else if (code.includes('A1')) pair = ['Harare', 'Chirundu'];
    else if (code.includes('A2')) pair = ['Harare', 'Nyamapanda'];

    if (pair) {
      const computed = computeDynamicRouteWithAlternatives(pair[0], pair[1], incidents);
      if (computed) {
        setActiveRouteForMap(computed);
      }
    } else {
      setSelectedHighwayOnMap(highwayCode);
    }
    setActiveTab('map');
  };

  // Active route navigation on map (Google Maps style)
  const handleSelectRouteOnMap = (route: RoutePreviewData) => {
    setActiveRouteForMap(route);
    setSelectedHighwayOnMap(route.highwayCode);
    setActiveTab('map');
  };

  const activeHazards = incidents.filter((i) => {
    const eff = getEffectiveIncidentStatus(i);
    return eff !== 'resolved' && eff !== 'dismissed';
  });
  const unverifiedCount = incidents.filter((i) => getEffectiveIncidentStatus(i) === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#111827] flex flex-col font-sans pb-16 md:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-[3000] bg-[#0B1220] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#E2E8F0]/20 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Main Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUserRole={userProfile.role}
        setCurrentUserRole={(role) => handleUpdateProfile({ ...userProfile, role })}
        currentDriverType={userProfile.driverType || 'commuter'}
        onOpenDriverLoginModal={() => setIsDriverLoginModalOpen(true)}
        unverifiedCount={unverifiedCount}
        unreadNotificationsCount={unreadNotificationsCount}
        activeHazardsCount={activeHazards.length}
        onOpenReportModal={() => {
          setReportModalCoords(null);
          setIsReportModalOpen(true);
        }}
        onOpenIntegrationsModal={() => setIsIntegrationsModalOpen(true)}
        onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
        emergencyBanner={emergencyBanner}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 pb-24 md:py-6">
        {/* TAB 0: HOME DASHBOARD */}
        {activeTab === 'home' && (
          <HomeDashboard
            userProfile={userProfile}
            incidents={incidents}
            newsStories={newsStories}
            weatherAlerts={weatherAlerts}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenReportModal={() => {
              setReportModalCoords(null);
              setIsReportModalOpen(true);
            }}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onSelectHighwayOnMap={handleSelectHighwayOnMap}
            onOpenNewsStory={() => setActiveTab('news')}
            onOpenIntegrations={() => setIsIntegrationsModalOpen(true)}
            onOpenDriverLoginModal={() => setIsDriverLoginModalOpen(true)}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* TAB 1: EXPLORE MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Explore Zimbabwe Highway Map & Incidents
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Real-time geographic markers for roadworks, dualisation contraflows, ZINARA queues, and community alerts.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#64748B]">
                  Showing <strong className="text-[#111827]">{incidents.length}</strong> total corridor markers
                </span>
                <button
                  onClick={() => {
                    setReportModalCoords(null);
                    setIsReportModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm"
                >
                  + Drop Report
                </button>
              </div>
            </div>

            <RoadMap
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onRequestReportAtCoord={handleMapClickCoord}
              selectedHighwayFilter={selectedHighwayOnMap}
              activeRoute={activeRouteForMap}
              onClearActiveRoute={() => setActiveRouteForMap(null)}
              onNavigateToNews={() => setActiveTab('news')}
              onAskAssistant={(query) => {
                setAiDrawerInitialQuery(query);
                setIsAiDrawerOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 2: CORRIDORS & ROUTING */}
        {activeTab === 'routes' && (
          <RoutePlanner
            incidents={incidents}
            onSelectHighwayOnMap={handleSelectHighwayOnMap}
            onOpenIncidentDetail={(inc) => setSelectedIncident(inc)}
          />
        )}

        {/* TAB 3: ROAD NEWS & ADVISORIES (NEWSPAPER & GAZETTE) */}
        {activeTab === 'news' && (
          <NewsFeed
            newsStories={newsStories}
            bookmarkedIds={bookmarkedNewsIds}
            onToggleBookmark={handleToggleBookmark}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectHighway={(h) => handleSelectHighwayOnMap(h)}
            onAddStoryComment={handleAddStoryComment}
            currentUserProfile={userProfile}
          />
        )}

        {/* TAB 4: COMMUNITY REPORTS FEED */}
        {activeTab === 'community' && (
          <CommunityReportsView
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onOpenReportModal={() => {
              setReportModalCoords(null);
              setIsReportModalOpen(true);
            }}
            onVote={handleVote}
            currentUserRole={userProfile.role}
          />
        )}

        {/* TAB 5: TRANSPORT OPERATORS */}
        {activeTab === 'operators' && (
          <TransportOperators
            onSelectRouteOnMap={handleSelectHighwayOnMap}
          />
        )}

        {/* TAB 6: PROFILE & SUBMISSIONS */}
        {activeTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            incidents={incidents}
            bookmarkedNewsIds={bookmarkedNewsIds}
            onUpdateProfile={handleUpdateProfile}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectHighwayOnMap={handleSelectHighwayOnMap}
            onOpenReportModal={() => {
              setReportModalCoords(null);
              setIsReportModalOpen(true);
            }}
            onOpenDriverLoginModal={() => setIsDriverLoginModalOpen(true)}
          />
        )}

        {/* TAB 7: MODERATOR OPERATIONS DESK */}
        {activeTab === 'moderator' && (
          <ModeratorPortal
            incidents={incidents}
            auditLogs={auditLogs}
            emergencyBanner={emergencyBanner}
            onVerifyIncident={handleModeratorVerify}
            onDispatchMedia={handleModeratorDispatchMedia}
            onResolveIncident={handleModeratorResolve}
            onDismissIncident={handleModeratorDismiss}
            onChangeSeverity={handleModeratorChangeSeverity}
            onUpdateEmergencyBanner={handleUpdateEmergencyBanner}
            onOpenIncidentDetail={(inc) => setSelectedIncident(inc)}
          />
        )}

        {/* TAB 8: NEWS MEDIA & PRESS PUBLISHER DESK */}
        {activeTab === 'publisher' && (
          <NewsPublisherDashboard
            newsStories={newsStories}
            onPublishStory={handlePublishNewsStory}
            onDeleteStory={handleDeleteNewsStory}
            onUpdateStory={handleUpdateNewsStory}
            incidents={incidents}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenStoryDetail={() => setActiveTab('news')}
            onAcknowledgeMediaDispatch={handleAcknowledgeMediaDispatch}
            onMarkMediaDispatchPublished={handleMarkMediaDispatchPublished}
          />
        )}
      </main>

      {/* Modals */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        currentUserRole={userProfile.role}
        initialCoords={reportModalCoords}
      />

      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        currentUserRole={userProfile.role}
        onVote={handleVote}
        onAddComment={handleAddComment}
        onModeratorVerify={handleModeratorVerify}
        onModeratorResolve={handleModeratorResolve}
        onModeratorChangeSeverity={handleModeratorChangeSeverity}
        onModeratorDismiss={handleModeratorDismiss}
        onViewOnMap={(inc) => {
          setSelectedHighwayOnMap(inc.highway.split(' ')[0]);
          setActiveTab('map');
        }}
      />

      <SystemIntegrationsModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        userProfile={userProfile}
        onUpdateNotifications={handleUpdateNotifications}
        onUpdateProfile={handleUpdateProfile}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Driver Persona & Identity Login Modal */}
      <DriverLoginModal
        isOpen={isDriverLoginModalOpen}
        onClose={() => setIsDriverLoginModalOpen(false)}
        currentUserProfile={userProfile}
        onSelectDriverPersona={(updatedProfile) => {
          handleUpdateProfile(updatedProfile);
          const driverTitle =
            updatedProfile.driverType === 'truck'
              ? 'Heavy Freight & Long-Haul Trucker'
              : updatedProfile.driverType === 'bus'
              ? 'Intercity Coach & Transit Operator'
              : 'Citizen Commuter & Private Motorist';
          showToast(`Logged in as ${driverTitle}: ${updatedProfile.name}`);
        }}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Floating RoadLink AI Assistant Trigger Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-5 z-[2500]">
        <button
          onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-full shadow-2xl flex items-center gap-2 border border-blue-400/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
          aria-label="Open RoadLink AI Assistant"
        >
          <Bot className="w-4 h-4 text-blue-100 animate-pulse" />
          <span className="hidden xs:inline sm:inline">Ask RoadLink AI</span>
          <span className="xs:hidden sm:hidden">AI</span>
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping"></span>
        </button>
      </div>

      {/* Floating RoadLink AI Assistant Drawer */}
      {isAiDrawerOpen && (
        <div className="fixed inset-x-2 sm:inset-x-auto bottom-20 top-16 sm:top-auto sm:bottom-20 sm:right-6 sm:w-[500px] z-[3000] animate-fade-in shadow-2xl flex flex-col">
          <RoadAssistantChat
            userProfile={userProfile}
            incidents={incidents}
            weatherAlerts={weatherAlerts}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setIsAiDrawerOpen(false);
            }}
            onSelectHighway={(hw) => setSelectedHighwayOnMap(hw)}
            onSelectRouteOnMap={handleSelectRouteOnMap}
            isFloatingDrawer={true}
            onClose={() => setIsAiDrawerOpen(false)}
            initialQuery={aiDrawerInitialQuery}
          />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unverifiedCount={unverifiedCount}
        onOpenDriverLoginModal={() => setIsDriverLoginModalOpen(true)}
        onOpenIntegrationsModal={() => setIsIntegrationsModalOpen(true)}
        onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Footer */}
      <Footer
        onOpenIntegrations={() => setIsIntegrationsModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
