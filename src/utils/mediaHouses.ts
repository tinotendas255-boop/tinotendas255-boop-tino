import { RoadIncident, ZimbabweTown } from '../types';

export interface CanonicalMediaHouse {
  id: string;
  canonicalName: string;
  tag: string;
  bureauCity: ZimbabweTown;
  icon: string;
  aliases: string[];
  defaultEmail: string;
}

export const CANONICAL_MEDIA_HOUSES: CanonicalMediaHouse[] = [
  {
    id: 'herald',
    canonicalName: 'The Herald',
    tag: 'Zimpapers National Daily',
    bureauCity: 'Harare',
    icon: '📰',
    aliases: ['the herald', 'herald', 'herald transport desk', 'zimpapers'],
    defaultEmail: 'fmutasa@herald.co.zw',
  },
  {
    id: 'zbc',
    canonicalName: 'ZBC News',
    tag: 'Zimbabwe Broadcasting Corporation TV & Radio',
    bureauCity: 'Harare',
    icon: '📺',
    aliases: ['zbc', 'zbc news', 'zbc news highway wire'],
    defaultEmail: 'sibandac@zbcnews.co.zw',
  },
  {
    id: 'chronicle',
    canonicalName: 'The Chronicle',
    tag: 'Bulawayo & Matabeleland Regional Daily',
    bureauCity: 'Bulawayo',
    icon: '🗞️',
    aliases: ['the chronicle', 'chronicle', 'the chronicle zimbabwe'],
    defaultEmail: 't.ndlovu@chronicle.co.zw',
  },
  {
    id: 'starfm',
    canonicalName: 'Star FM',
    tag: 'National Commercial Radio Network',
    bureauCity: 'Harare',
    icon: '📻',
    aliases: ['star fm', 'starfm', 'star fm traffic desk'],
    defaultEmail: 'traffic@starfm.co.zw',
  },
  {
    id: 'newsday',
    canonicalName: 'NewsDay Zimbabwe',
    tag: 'Alpha Media Holdings Daily',
    bureauCity: 'Harare',
    icon: '📄',
    aliases: ['newsday', 'newsday zimbabwe', 'newsday zimbabwe transit'],
    defaultEmail: 'kmoyo@newsday.co.zw',
  },
  {
    id: 'zifm',
    canonicalName: 'ZiFM Stereo',
    tag: 'National News & Talk Radio',
    bureauCity: 'Harare',
    icon: '🎙️',
    aliases: ['zifm', 'zifm stereo', 'zifm stereo news desk'],
    defaultEmail: 'newsdesk@zifmstereo.co.zw',
  },
];

/**
 * Normalizes any legacy or bureau-suffixed outlet string to its canonical media house name.
 */
export function normalizeMediaHouseName(rawName: string): string {
  const lower = rawName.trim().toLowerCase();
  for (const house of CANONICAL_MEDIA_HOUSES) {
    if (
      house.canonicalName.toLowerCase() === lower ||
      house.aliases.some((alias) => lower === alias || lower.includes(alias))
    ) {
      return house.canonicalName;
    }
  }
  return rawName.trim();
}

/**
 * Normalizes and deduplicates a list of selected media outlet names.
 */
export function normalizeMediaHouseList(outlets?: string[]): string[] {
  if (!outlets || outlets.length === 0) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of outlets) {
    const canonical = normalizeMediaHouseName(raw);
    if (canonical && !seen.has(canonical)) {
      seen.add(canonical);
      result.push(canonical);
    }
  }
  return result;
}

/**
 * Checks whether a publisher organization name (or email) belongs to a given selected media outlet.
 */
export function doesPublisherMatchOutlet(
  publisherOrgName: string,
  outletName: string,
  publisherEmail?: string
): boolean {
  const normOrg = normalizeMediaHouseName(publisherOrgName).toLowerCase();
  const normOutlet = normalizeMediaHouseName(outletName).toLowerCase();
  if (normOrg === normOutlet) return true;
  if (normOrg.includes(normOutlet) || normOutlet.includes(normOrg)) return true;

  if (publisherEmail) {
    const emailLower = publisherEmail.toLowerCase();
    const matchedHouse = CANONICAL_MEDIA_HOUSES.find(
      (h) => h.canonicalName.toLowerCase() === normOutlet
    );
    if (matchedHouse && emailLower.includes(matchedHouse.id)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether an incident has been addressed/dispatched to a given media organization.
 */
export function isIncidentAddressedToMedia(
  incident: RoadIncident,
  publisherOrgName: string,
  publisherEmail?: string
): boolean {
  const dispatchedOutlets = new Set<string>();
  if (incident.syndicatedMediaOutlets) {
    for (const o of incident.syndicatedMediaOutlets) {
      dispatchedOutlets.add(o);
    }
  }
  if (incident.mediaDispatches) {
    for (const d of incident.mediaDispatches) {
      dispatchedOutlets.add(d.outletName);
    }
  }

  for (const outlet of dispatchedOutlets) {
    if (doesPublisherMatchOutlet(publisherOrgName, outlet, publisherEmail)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns a consistent effective moderation status across both `verificationStatus` and `status`.
 */
export function getEffectiveIncidentStatus(
  incident: Pick<RoadIncident, 'verificationStatus' | 'status'>
): 'pending' | 'verified' | 'resolved' | 'dismissed' {
  const primary = incident.verificationStatus;
  const fallback = incident.status;

  if (primary === 'dismissed' || fallback === 'dismissed') return 'dismissed';
  if (primary === 'resolved' || fallback === 'resolved') return 'resolved';
  if (primary === 'verified' || fallback === 'verified') return 'verified';
  return 'pending';
}
