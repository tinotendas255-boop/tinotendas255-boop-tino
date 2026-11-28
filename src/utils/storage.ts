import { RoadIncident, ModeratorActionLog, UserProfile, AppNotification, WeatherTravelAlert, NewsStory, NewsPublisherProfile, SocialPost, SocialStory, SocialCommunity, DirectMessageThread } from '../types';
import { INITIAL_INCIDENTS, DEFAULT_USER_PROFILE, INITIAL_NOTIFICATIONS, INITIAL_WEATHER_ALERTS, NEWS_STORIES } from '../data/mockRoadData';
import { INITIAL_SOCIAL_POSTS, INITIAL_SOCIAL_STORIES, INITIAL_COMMUNITIES, INITIAL_DM_THREADS } from '../data/socialData';
import { getEffectiveIncidentStatus, normalizeMediaHouseList } from './mediaHouses';

const STORAGE_KEYS = {
  INCIDENTS: 'roadlink_incidents_v2',
  BOOKMARKS: 'roadlink_bookmarked_news_v2',
  AUDIT_LOGS: 'roadlink_moderator_audit_v2',
  EMERGENCY_BANNER: 'roadlink_emergency_banner_v2',
  USER_PROFILE: 'roadlink_user_profile_v2',
  NOTIFICATIONS: 'roadlink_notifications_v2',
  WEATHER_ALERTS: 'roadlink_weather_alerts_v2',
  NEWS_STORIES: 'roadlink_news_stories_v2',
  PUBLISHER_PROFILE: 'roadlink_publisher_profile_v2',
  SOCIAL_POSTS: 'roadlink_social_posts_v1',
  SOCIAL_STORIES: 'roadlink_social_stories_v1',
  SOCIAL_COMMUNITIES: 'roadlink_social_communities_v1',
  DM_THREADS: 'roadlink_dm_threads_v1',
};

const normalizeIncidentRecord = (inc: RoadIncident): RoadIncident => {
  const effective = getEffectiveIncidentStatus(inc);
  const syncedStatus: RoadIncident['status'] =
    effective === 'verified'
      ? 'verified'
      : effective === 'resolved'
      ? 'resolved'
      : effective === 'dismissed'
      ? 'dismissed'
      : 'unverified';
  const normalizedOutlets = normalizeMediaHouseList(inc.syndicatedMediaOutlets);
  const existingDispatches = inc.mediaDispatches || [];
  const syncedDispatches =
    normalizedOutlets.length > 0
      ? normalizedOutlets.map((outlet) => {
          const existing = existingDispatches.find(
            (d) => d.outletName.toLowerCase() === outlet.toLowerCase()
          );
          if (existing) {
            return { ...existing, outletName: outlet };
          }
          return {
            outletName: outlet,
            status: (effective === 'verified' ? 'delivered' : 'pending_admin') as 'delivered' | 'pending_admin',
            queuedAt: inc.timestamp || 'Recently',
            deliveredAt: effective === 'verified' ? inc.timestamp || 'Recently' : undefined,
          };
        })
      : existingDispatches;

  return {
    ...inc,
    status: syncedStatus,
    syndicatedMediaOutlets: normalizedOutlets.length > 0 ? normalizedOutlets : inc.syndicatedMediaOutlets,
    mediaDispatches: syncedDispatches.length > 0 ? syncedDispatches : inc.mediaDispatches,
  };
};

export const getStoredIncidents = (): RoadIncident[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (!raw) {
      const normalized = INITIAL_INCIDENTS.map(normalizeIncidentRecord);
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(normalized));
      return normalized;
    }
    const parsed = JSON.parse(raw) as RoadIncident[];
    return Array.isArray(parsed) ? parsed.map(normalizeIncidentRecord) : INITIAL_INCIDENTS.map(normalizeIncidentRecord);
  } catch (err) {
    console.error('Failed to load incidents from storage:', err);
    return INITIAL_INCIDENTS.map(normalizeIncidentRecord);
  }
};

export const saveStoredIncidents = (incidents: RoadIncident[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  } catch (err) {
    console.error('Failed to save incidents to storage:', err);
  }
};

export const getStoredUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
      return DEFAULT_USER_PROFILE;
    }
    const parsed = JSON.parse(raw);
    const driverType = parsed.driverType || (parsed.role === 'verified_driver' ? 'truck' : parsed.role === 'transport_operator' ? 'bus' : 'commuter');
    const updated: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      ...parsed,
      driverType,
      name: parsed.name && parsed.name !== 'Tinashe Moyo' ? parsed.name : 'Tinotenda Sibanda',
      baseTown: parsed.baseTown || 'Bulawayo',
    };
    return updated;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
};

export const saveStoredUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
};

export const getStoredNotifications = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveStoredNotifications = (notifications: AppNotification[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
};

export const getStoredWeatherAlerts = (): WeatherTravelAlert[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEATHER_ALERTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WEATHER_ALERTS, JSON.stringify(INITIAL_WEATHER_ALERTS));
      return INITIAL_WEATHER_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_WEATHER_ALERTS;
  }
};

export const getStoredBookmarks = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : ['news-101', 'news-demo-01'];
  } catch {
    return ['news-101', 'news-demo-01'];
  }
};

export const saveStoredBookmarks = (ids: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save bookmarks:', err);
  }
};

export const getStoredAuditLogs = (): ModeratorActionLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      const initialLogs: ModeratorActionLog[] = [
        {
          id: 'log-001',
          incidentId: 'inc-001',
          incidentTitle: 'Dualisation Works & Single-Lane Deviation',
          action: 'verified',
          moderatorName: 'Officer T. Moyo (MoTID)',
          timestamp: '2 hours ago',
          note: 'Confirmed with Chivhu resident road engineer.',
        },
        {
          id: 'log-002',
          incidentId: 'inc-008',
          incidentTitle: 'Minor Shunt Collision Cleared to Shoulder',
          action: 'resolved',
          moderatorName: 'Harare Metro Traffic Control',
          timestamp: '1 hour ago',
          note: 'Vehicles towed to municipal depot; lanes clear.',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveStoredAuditLogs = (logs: ModeratorActionLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save audit logs:', err);
  }
};

export const getEmergencyBanner = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.EMERGENCY_BANNER);
  } catch {
    return null;
  }
};

export const saveEmergencyBanner = (bannerText: string | null): void => {
  try {
    if (bannerText) {
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_BANNER, bannerText);
    } else {
      localStorage.removeItem(STORAGE_KEYS.EMERGENCY_BANNER);
    }
  } catch (err) {
    console.error('Failed to save emergency banner:', err);
  }
};

export const getStoredNewsStories = (): NewsStory[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWS_STORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NEWS_STORIES, JSON.stringify(NEWS_STORIES));
      return NEWS_STORIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.NEWS_STORIES, JSON.stringify(NEWS_STORIES));
      return NEWS_STORIES;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load news stories from storage:', err);
    return NEWS_STORIES;
  }
};

export const saveStoredNewsStories = (stories: NewsStory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NEWS_STORIES, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to save news stories:', err);
  }
};

export const getStoredPublisherProfile = (): NewsPublisherProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PUBLISHER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to load publisher profile:', err);
    return null;
  }
};

export const saveStoredPublisherProfile = (profile: NewsPublisherProfile | null): void => {
  try {
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.PUBLISHER_PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PUBLISHER_PROFILE);
    }
  } catch (err) {
    console.error('Failed to save publisher profile:', err);
  }
};

export const getStoredSocialPosts = (): SocialPost[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOCIAL_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(INITIAL_SOCIAL_POSTS));
      return INITIAL_SOCIAL_POSTS;
    }
    const parsed = JSON.parse(raw) as SocialPost[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SOCIAL_POSTS;
    return parsed.map((post) => {
      const seedMatch = INITIAL_SOCIAL_POSTS.find((s) => s.id === post.id);
      const isOldPromo = post.id === 'post-tino-map' && post.content.includes('RoadLink is the future');
      return {
        ...post,
        avatarUrl: post.avatarUrl || seedMatch?.avatarUrl,
        content: isOldPromo && seedMatch ? seedMatch.content : post.content,
        comments: (post.comments || []).map((c) => {
          const seedComment = seedMatch?.comments.find((sc) => sc.id === c.id);
          return { ...c, avatarUrl: c.avatarUrl || seedComment?.avatarUrl };
        }),
      };
    });
  } catch {
    return INITIAL_SOCIAL_POSTS;
  }
};

export const saveStoredSocialPosts = (posts: SocialPost[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save social posts:', err);
  }
};

export const getStoredSocialStories = (): SocialStory[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOCIAL_STORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_STORIES, JSON.stringify(INITIAL_SOCIAL_STORIES));
      return INITIAL_SOCIAL_STORIES;
    }
    const parsed = JSON.parse(raw) as SocialStory[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SOCIAL_STORIES;
    return parsed.map((story) => {
      const seedMatch = INITIAL_SOCIAL_STORIES.find((s) => s.id === story.id);
      return {
        ...story,
        avatarUrl: story.avatarUrl || seedMatch?.avatarUrl,
        imageUrl: seedMatch?.imageUrl || story.imageUrl,
      };
    });
  } catch {
    return INITIAL_SOCIAL_STORIES;
  }
};

export const saveStoredSocialStories = (stories: SocialStory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_STORIES, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to save social stories:', err);
  }
};

export const getStoredCommunities = (): SocialCommunity[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOCIAL_COMMUNITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_COMMUNITIES, JSON.stringify(INITIAL_COMMUNITIES));
      return INITIAL_COMMUNITIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMMUNITIES;
  } catch {
    return INITIAL_COMMUNITIES;
  }
};

export const saveStoredCommunities = (communities: SocialCommunity[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_COMMUNITIES, JSON.stringify(communities));
  } catch (err) {
    console.error('Failed to save communities:', err);
  }
};

export const getStoredDmThreads = (): DirectMessageThread[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DM_THREADS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DM_THREADS, JSON.stringify(INITIAL_DM_THREADS));
      return INITIAL_DM_THREADS;
    }
    const parsed = JSON.parse(raw) as DirectMessageThread[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_DM_THREADS;
    return parsed.map((t) => {
      const seedMatch = INITIAL_DM_THREADS.find((st) => st.id === t.id);
      return { ...t, avatarUrl: t.avatarUrl || seedMatch?.avatarUrl };
    });
  } catch {
    return INITIAL_DM_THREADS;
  }
};

export const saveStoredDmThreads = (threads: DirectMessageThread[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DM_THREADS, JSON.stringify(threads));
  } catch (err) {
    console.error('Failed to save DM threads:', err);
  }
};

