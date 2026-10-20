import { RoadIncident, ModeratorActionLog, UserProfile, AppNotification, WeatherTravelAlert, NewsStory, NewsPublisherProfile } from '../types';
import { INITIAL_INCIDENTS, DEFAULT_USER_PROFILE, INITIAL_NOTIFICATIONS, INITIAL_WEATHER_ALERTS, NEWS_STORIES } from '../data/mockRoadData';

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
};

export const getStoredIncidents = (): RoadIncident[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load incidents from storage:', err);
    return INITIAL_INCIDENTS;
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
