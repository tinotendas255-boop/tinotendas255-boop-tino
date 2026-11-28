/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  RoadIncident,
  IncidentSeverity,
  ModeratorActionLog,
  UserProfile,
  AppNotification,
  WeatherTravelAlert,
  NewsStory,
  RoutePreviewData,
  StoryComment,
  MediaWireDelivery,
  SocialPost,
  SocialStory,
  SocialCommunity,
  DirectMessageThread,
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
  getStoredSocialPosts,
  saveStoredSocialPosts,
  getStoredSocialStories,
  saveStoredSocialStories,
  getStoredCommunities,
  saveStoredCommunities,
  getStoredDmThreads,
  saveStoredDmThreads,
} from './utils/storage';
import { INITIAL_TRENDING_TOPICS, CURRENT_USER_AVATAR_IMG } from './data/socialData';
import { computeDynamicRouteWithAlternatives } from './utils/routeEngine';
import { getEffectiveIncidentStatus, normalizeMediaHouseList, normalizeMediaHouseName } from './utils/mediaHouses';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SocialShellSidebar } from './components/SocialShellSidebar';
import { SocialRightRail } from './components/SocialRightRail';
import { SocialLandingFeed } from './components/SocialLandingFeed';
import { SocialMessagesView } from './components/SocialMessagesView';
import { SocialCommunitiesView } from './components/SocialCommunitiesView';
import { EmergencySosModal, RoadLinkFeatureModal } from './components/EmergencySosModal';
import { RoadMap } from './components/RoadMap';
import { RoutePlanner } from './components/RoutePlanner';
import { NewsFeed } from './components/NewsFeed';
import { NewsPublisherDashboard } from './components/NewsPublisherDashboard';
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
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile());

  // Core Road & News Data State (Persisted)
  const [incidents, setIncidents] = useState<RoadIncident[]>([]);
  const [newsStories, setNewsStories] = useState<NewsStory[]>(() => getStoredNewsStories());
  const [bookmarkedNewsIds, setBookmarkedNewsIds] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<ModeratorActionLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherTravelAlert[]>([]);
  const [emergencyBanner, setEmergencyBanner] = useState<string | null>(null);

  // Social Feed, Stories, Communities & Messages State (Persisted)
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => getStoredSocialPosts());
  const [socialStories, setSocialStories] = useState<SocialStory[]>(() => getStoredSocialStories());
  const [communities, setCommunities] = useState<SocialCommunity[]>(() => getStoredCommunities());
  const [dmThreads, setDmThreads] = useState<DirectMessageThread[]>(() => getStoredDmThreads());
  const [selectedDmThreadId, setSelectedDmThreadId] = useState<string>('dm-rescue');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);

  // Modals & Active Selections
  const [selectedIncident, setSelectedIncident] = useState<RoadIncident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportModalCoords, setReportModalCoords] = useState<[number, number] | null>(null);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [isDriverLoginModalOpen, setIsDriverLoginModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [featureModalMode, setFeatureModalMode] = useState<'secure' | 'premium' | null>(null);
  const [isPremiumActive, setIsPremiumActive] = useState<boolean>(false);
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
    setSocialPosts(getStoredSocialPosts());
    setSocialStories(getStoredSocialStories());
    setCommunities(getStoredCommunities());
    setDmThreads(getStoredDmThreads());
  }, []);

  // Save incidents
  const updateIncidents = (newIncidents: RoadIncident[]) => {
    setIncidents(newIncidents);
    saveStoredIncidents(newIncidents);
  };

  // Social Post Handlers
  const handleCreateSocialPost = (
    draft: Omit<SocialPost, 'id' | 'timestamp' | 'likesCount' | 'repostsCount' | 'sharesCount' | 'comments'>
  ) => {
    const created: SocialPost = {
      ...draft,
      id: `post-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      likesCount: 1,
      userLiked: true,
      repostsCount: 0,
      userReposted: false,
      sharesCount: 0,
      comments: [],
    };
    const updated = [created, ...socialPosts];
    setSocialPosts(updated);
    saveStoredSocialPosts(updated);
    showToast('Post published to RoadLink feed!');
  };

  const handleTogglePostLike = (postId: string) => {
    const updated = socialPosts.map((p) => {
      if (p.id !== postId) return p;
      const nextLiked = !p.userLiked;
      return {
        ...p,
        userLiked: nextLiked,
        likesCount: Math.max(0, p.likesCount + (nextLiked ? 1 : -1)),
      };
    });
    setSocialPosts(updated);
    saveStoredSocialPosts(updated);
  };

  const handleTogglePostRepost = (postId: string) => {
    const updated = socialPosts.map((p) => {
      if (p.id !== postId) return p;
      const nextRepost = !p.userReposted;
      return {
        ...p,
        userReposted: nextRepost,
        repostsCount: Math.max(0, p.repostsCount + (nextRepost ? 1 : -1)),
        sharesCount: Math.max(0, p.sharesCount + (nextRepost ? 1 : -1)),
      };
    });
    setSocialPosts(updated);
    saveStoredSocialPosts(updated);
    showToast('Shared update with your Zimbabwe road network.');
  };

  const handleAddSocialComment = (postId: string, text: string) => {
    const updated = socialPosts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [
          ...p.comments,
          {
            id: `sc-${Date.now().toString(36)}`,
            authorName: userProfile.name || 'Tinotenda Sibanda',
            authorHandle: `@${(userProfile.name || 'tinotenda').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            avatarUrl: CURRENT_USER_AVATAR_IMG,
            authorVerified: userProfile.isVerifiedDriver,
            text,
            timestamp: 'Just now',
          },
        ],
      };
    });
    setSocialPosts(updated);
    saveStoredSocialPosts(updated);
    showToast('Comment added.');
  };

  const handleSendPostToDm = (post: SocialPost) => {
    const summaryText = `Shared post from ${post.authorName}: "${post.content.slice(0, 110)}${
      post.content.length > 110 ? '...' : ''
    }"`;
    const targetId = selectedDmThreadId || dmThreads[0]?.id || 'dm-rescue';
    handleSendDmMessage(targetId, summaryText);
    setSelectedDmThreadId(targetId);
    setActiveTab('messages');
    showToast('Post forwarded to Direct Messages.');
  };

  // Stories Handlers
  const handleCreateStory = (storyDraft: Omit<SocialStory, 'id' | 'timestamp' | 'isViewed'>) => {
    const created: SocialStory = {
      ...storyDraft,
      id: `story-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      isViewed: false,
    };
    const updated = [created, ...socialStories];
    setSocialStories(updated);
    saveStoredSocialStories(updated);
    showToast('Story shared for 24 hours!');
  };

  const handleMarkStoryViewed = (storyId: string) => {
    const updated = socialStories.map((s) => (s.id === storyId ? { ...s, isViewed: true } : s));
    setSocialStories(updated);
    saveStoredSocialStories(updated);
  };

  // Communities Toggle
  const handleToggleJoinCommunity = (communityId: string) => {
    const updated = communities.map((c) =>
      c.id === communityId ? { ...c, isJoined: !c.isJoined } : c
    );
    setCommunities(updated);
    saveStoredCommunities(updated);
    const target = updated.find((c) => c.id === communityId);
    if (target) {
      showToast(target.isJoined ? `Joined ${target.name}` : `Left ${target.name}`);
    }
  };

  // Direct Messaging Handlers
  const handleSelectDmThread = (threadId: string) => {
    setSelectedDmThreadId(threadId);
    const updated = dmThreads.map((t) =>
      t.id === threadId ? { ...t, unreadCount: 0 } : t
    );
    setDmThreads(updated);
    saveStoredDmThreads(updated);
  };

  const handleSendDmMessage = (threadId: string, text: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = dmThreads.map((t) => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        unreadCount: 0,
        lastMessage: text,
        lastTimestamp: 'Just now',
        messages: [
          ...t.messages,
          {
            id: `dm-msg-${Date.now().toString(36)}`,
            sender: 'me' as const,
            text,
            timestamp: nowTime,
          },
        ],
      };
    });
    setDmThreads(updated);
    saveStoredDmThreads(updated);
  };

  // Emergency SOS Dispatch Handler
  const handleDispatchSosAlert = (serviceType: string, notes: string) => {
    const sosIncident: RoadIncident = {
      id: `inc-sos-${Date.now().toString(36)}`,
      title: `SOS Assistance Requested: ${serviceType}`,
      category: 'breakdown',
      highway: 'A6 (Bulawayo - Beitbridge)',
      town: userProfile.baseTown || 'Bulawayo',
      locationName: `${userProfile.baseTown || 'Bulawayo'} Corridor SOS`,
      coordinates: [-20.165, 28.59],
      severity: 'critical',
      status: 'unverified',
      verificationStatus: 'reported',
      timestamp: 'Just now',
      isStillOngoing: true,
      description: notes,
      reporterRole: userProfile.role,
      reporterName: userProfile.name || 'RoadLink Motorist',
      confirmationsCount: 1,
      refutedCount: 0,
      helpfulCount: 0,
      sentToAdministrator: true,
    };
    updateIncidents([sosIncident, ...incidents]);
    handleSendDmMessage('dm-rescue', `SOS (${serviceType}): ${notes}`);
    showToast(`Emergency SOS sent to ${serviceType} & Moderator Desk!`);
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

  // Submit New Incident Report (Routes to Admin + Selected Media + Social Feed)
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

    // Mirror report into Social Feed so everyday users can see & comment immediately
    const reporterInitials = (enrichedIncident.reporterName || 'RL')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const mirroredPost: SocialPost = {
      id: `post-inc-${enrichedIncident.id}`,
      authorName: enrichedIncident.reporterName || userProfile.name,
      authorHandle: `@${(enrichedIncident.reporterName || 'motorist').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      authorVerified: enrichedIncident.reporterRole === 'moderator' || enrichedIncident.reporterRole === 'verified_driver',
      authorRoleLabel: selectedOutlets.length > 0 ? `Sent to ${selectedOutlets.join(', ')}` : 'Live Road Alert',
      avatarInitials: reporterInitials,
      avatarUrl: CURRENT_USER_AVATAR_IMG,
      avatarBg: '#F97316',
      timestamp: 'Just now',
      location: `${enrichedIncident.locationName} · ${enrichedIncident.highway}`,
      highway: enrichedIncident.highway,
      content: `${enrichedIncident.title}\n${enrichedIncident.description}${
        selectedOutlets.length > 0 ? `\nPress wire queued: ${selectedOutlets.join(', ')}` : ''
      }`,
      hashtags: ['#RoadLink', '#StaySafeZW', `#${enrichedIncident.highway.split(' ')[0]}`],
      linkedIncidentId: enrichedIncident.id,
      likesCount: 1,
      userLiked: false,
      repostsCount: 0,
      userReposted: false,
      sharesCount: 0,
      comments: [],
    };
    const nextPosts = [mirroredPost, ...socialPosts];
    setSocialPosts(nextPosts);
    saveStoredSocialPosts(nextPosts);

    const mediaText =
      selectedOutlets.length > 0
        ? ` and routed to selected media houses (${selectedOutlets.join(', ')})`
        : '';

    const newNotif: AppNotification = {
      id: `notif-${Date.now().toString(36)}`,
      title: 'Report Submitted to Administrator Desk',
      message: `Report "${enrichedIncident.title}" on ${enrichedIncident.highway} is in the Moderator verification queue${mediaText}.`,
      type: 'report_status',
      timestamp: 'Just now',
      isRead: false,
      linkTab: selectedOutlets.length > 0 ? 'moderator' : 'communities',
    };
    const updatedNotifs = [newNotif, ...notifications];
    handleUpdateNotifications(updatedNotifs);

    showToast(
      selectedOutlets.length > 0
        ? `Submitted to Administrator Desk & wired to ${selectedOutlets.join(', ')}!`
        : 'Hazard report submitted to Administrator verification queue!'
    );
  };

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

  // Active route navigation on map
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
  const unreadMessagesCount = dmThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col font-sans pb-16 lg:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-[3500] bg-[#0F172A] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#3B82F6]/40">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Social Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userProfile.name}
        currentUserRole={userProfile.role}
        setCurrentUserRole={(role) => handleUpdateProfile({ ...userProfile, role })}
        currentDriverType={userProfile.driverType || 'commuter'}
        onOpenDriverLoginModal={() => setIsDriverLoginModalOpen(true)}
        unverifiedCount={unverifiedCount}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        activeHazardsCount={activeHazards.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenReportModal={() => {
          setReportModalCoords(null);
          setIsReportModalOpen(true);
        }}
        onOpenIntegrationsModal={() => setIsIntegrationsModalOpen(true)}
        onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
        emergencyBanner={emergencyBanner}
      />

      {/* Main 3-Column Social Shell */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-5 pt-4 pb-24 lg:py-5 flex items-start gap-5">
        {/* Left Navigation Sidebar */}
        <SocialShellSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadNotificationsCount={unreadNotificationsCount}
          unreadMessagesCount={unreadMessagesCount}
          unverifiedCount={unverifiedCount}
          onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
          onOpenSecureModal={() => setFeatureModalMode('secure')}
          onOpenPremiumModal={() => setFeatureModalMode('premium')}
        />

        {/* Center Main Stage */}
        <div className="flex-1 min-w-0">
          {/* TAB 0: SOCIAL HOME FEED (Matches Screenshot) */}
          {activeTab === 'home' && (
            <SocialLandingFeed
              userProfile={userProfile}
              posts={socialPosts}
              stories={socialStories}
              incidents={incidents}
              searchQuery={searchQuery}
              activeHashtag={activeHashtag}
              onSelectHashtag={setActiveHashtag}
              onCreatePost={handleCreateSocialPost}
              onToggleLike={handleTogglePostLike}
              onToggleRepost={handleTogglePostRepost}
              onAddComment={handleAddSocialComment}
              onSendPostToDm={handleSendPostToDm}
              onCreateStory={handleCreateStory}
              onMarkStoryViewed={handleMarkStoryViewed}
              onOpenReportModal={() => {
                setReportModalCoords(null);
                setIsReportModalOpen(true);
              }}
              onOpenFullMap={() => setActiveTab('map')}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 1: EXPLORE FULL INTERACTIVE MAP & ROUTING */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    Explore Zimbabwe Highway Map & Live Obstacles
                  </h1>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Real-time roadblocks, accidents, dynamic obstacle-avoidance routes, and ZINARA corridors.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="text-[#94A3B8] tabular-nums">
                    <strong className="text-white">{incidents.length}</strong> corridor markers
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReportModalCoords(null);
                      setIsReportModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                  >
                    + Drop Report
                  </button>
                </div>
              </div>

              <div className="text-[#111827]">
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
            </div>
          )}

          {/* TAB: DIRECT MESSAGES */}
          {activeTab === 'messages' && (
            <SocialMessagesView
              threads={dmThreads}
              selectedThreadId={selectedDmThreadId}
              onSelectThread={handleSelectDmThread}
              onSendMessage={handleSendDmMessage}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
          )}

          {/* TAB: COMMUNITIES & ROAD ALERTS */}
          {(activeTab === 'communities' || activeTab === 'community') && (
            <SocialCommunitiesView
              communities={communities}
              onToggleJoinCommunity={handleToggleJoinCommunity}
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onOpenReportModal={() => {
                setReportModalCoords(null);
                setIsReportModalOpen(true);
              }}
              onVote={handleVote}
              currentUserRole={userProfile.role}
              defaultSubTab={activeTab === 'community' ? 'alerts' : 'groups'}
            />
          )}

          {/* TAB: CORRIDORS & TOLLS */}
          {activeTab === 'routes' && (
            <div className="text-[#111827]">
              <RoutePlanner
                incidents={incidents}
                onSelectHighwayOnMap={handleSelectHighwayOnMap}
                onOpenIncidentDetail={(inc) => setSelectedIncident(inc)}
              />
            </div>
          )}

          {/* TAB: HIGHWAY GAZETTE (NEWS) */}
          {activeTab === 'news' && (
            <div className="text-[#111827]">
              <NewsFeed
                newsStories={newsStories}
                bookmarkedIds={bookmarkedNewsIds}
                onToggleBookmark={handleToggleBookmark}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectHighway={(h) => handleSelectHighwayOnMap(h)}
                onAddStoryComment={handleAddStoryComment}
                currentUserProfile={userProfile}
              />
            </div>
          )}

          {/* TAB: SERVICES & TRANSPORT OPERATORS */}
          {activeTab === 'operators' && (
            <div className="text-[#111827]">
              <TransportOperators onSelectRouteOnMap={handleSelectHighwayOnMap} />
            </div>
          )}

          {/* TAB: PROFILE & SUBMISSIONS */}
          {activeTab === 'profile' && (
            <div className="text-[#111827]">
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
            </div>
          )}

          {/* TAB: MODERATOR OPERATIONS DESK */}
          {activeTab === 'moderator' && (
            <div className="text-[#111827]">
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
            </div>
          )}

          {/* TAB: NEWS MEDIA & PRESS PUBLISHER DESK */}
          {activeTab === 'publisher' && (
            <div className="text-[#111827]">
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
            </div>
          )}
        </div>

        {/* Right Rail (Desktop XL on Home Feed) */}
        {activeTab === 'home' && (
          <SocialRightRail
            trendingTopics={INITIAL_TRENDING_TOPICS}
            communities={communities}
            activeHashtag={activeHashtag}
            onSelectHashtag={setActiveHashtag}
            onToggleJoinCommunity={handleToggleJoinCommunity}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Modals */}
      <EmergencySosModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        userLocationLabel={userProfile.baseTown || 'Bulawayo'}
        onDispatchSosAlert={handleDispatchSosAlert}
      />

      <RoadLinkFeatureModal
        mode={featureModalMode}
        onClose={() => setFeatureModalMode(null)}
        isPremiumActive={isPremiumActive}
        onActivatePremium={() => {
          setIsPremiumActive(true);
          showToast('RoadLink Plus Premium activated!');
        }}
      />

      <div className="text-[#111827]">
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
      </div>

      {/* Route Assistant Trigger Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-5 z-[2500]">
        <button
          type="button"
          onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#111C2E] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-full shadow-xl flex items-center gap-2 border border-[#334155] cursor-pointer transition-colors"
          aria-label="Open RoadLink Route Assistant"
        >
          <Bot className="w-4 h-4 text-[#60A5FA]" />
          <span className="hidden sm:inline">Route Assistant</span>
          <span className="sm:hidden">Help</span>
        </button>
      </div>

      {/* Floating RoadLink AI Assistant Drawer */}
      {isAiDrawerOpen && (
        <div className="fixed inset-x-2 sm:inset-x-auto bottom-20 top-16 sm:top-auto sm:bottom-20 sm:right-6 sm:w-[500px] z-[3000] shadow-2xl flex flex-col text-[#111827]">
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
        unreadMessagesCount={unreadMessagesCount}
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
