import React, { useRef, useState } from 'react';
import {
  RoadIncident,
  SocialPost,
  SocialStory,
  UserProfile,
} from '../types';
import { CURRENT_USER_AVATAR_IMG } from '../data/socialData';
import { EmbeddedSocialMiniMap } from './EmbeddedSocialMiniMap';
import sunsetStoryImg from '../assets/images/story_sunset_highway_silhouette_1795598334966.jpg';
import rudoSedanImg from '../assets/images/story_modern_sedan_highway_1795598336616.jpg';
import kudaMountainImg from '../assets/images/story_scenic_mountain_pass_1795598336427.jpg';
import smartHighwayImg from '../assets/images/bulawayo_smart_highway_1792223941294.jpg';
import {
  Radio,
  Camera,
  Gauge,
  Route,
  Plus,
  ChevronRight,
  ChevronLeft,
  Globe,
  Zap,
  MessageSquare,
  Send,
  BadgeCheck,
  MapPin,
  X,
  Repeat2,
  AlertTriangle,
  Sparkles,
  Upload,
  MoreHorizontal,
} from 'lucide-react';

interface SocialLandingFeedProps {
  userProfile: UserProfile;
  posts: SocialPost[];
  stories: SocialStory[];
  incidents: RoadIncident[];
  searchQuery: string;
  activeHashtag: string | null;
  onSelectHashtag: (tag: string | null) => void;
  onCreatePost: (post: Omit<SocialPost, 'id' | 'timestamp' | 'likesCount' | 'repostsCount' | 'sharesCount' | 'comments'>) => void;
  onToggleLike: (postId: string) => void;
  onToggleRepost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSendPostToDm: (post: SocialPost) => void;
  onCreateStory: (story: Omit<SocialStory, 'id' | 'timestamp' | 'isViewed'>) => void;
  onMarkStoryViewed: (storyId: string) => void;
  onOpenReportModal: () => void;
  onOpenFullMap: () => void;
  onSelectIncident: (incident: RoadIncident) => void;
  onNavigateTab: (tab: string) => void;
}

const PRESET_PHOTOS = [
  { label: 'Bulawayo Highway', url: smartHighwayImg },
  { label: 'Scenic Sedan', url: rudoSedanImg },
  { label: 'Mountain Pass', url: kudaMountainImg },
  { label: 'Sunset Corridor', url: sunsetStoryImg },
];

const ROAD_STATUS_OPTIONS = [
  'Clear Flow',
  'Slow Traffic',
  'ZRP Checkpoint',
  'Detour Active',
  'Fuel Available',
  'Escarpment Mist',
];

const QUICK_CORRIDORS = [
  'A4 Harare - Beitbridge',
  'A5 Harare - Bulawayo',
  'A6 Bulawayo - Gwanda',
  'A3 Harare - Mutare',
  'A8 Bulawayo - Vic Falls',
  'Bulawayo Urban',
  'Harare Urban',
];

export const SocialLandingFeed: React.FC<SocialLandingFeedProps> = ({
  userProfile,
  posts,
  stories,
  incidents,
  searchQuery,
  activeHashtag,
  onSelectHashtag,
  onCreatePost,
  onToggleLike,
  onToggleRepost,
  onAddComment,
  onSendPostToDm,
  onCreateStory,
  onMarkStoryViewed,
  onOpenReportModal,
  onOpenFullMap,
  onSelectIncident,
  onNavigateTab,
}) => {
  // Dispatch composer state
  const [isComposerExpanded, setIsComposerExpanded] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [composerLocation, setComposerLocation] = useState<string>(userProfile.baseTown || 'Bulawayo, Zimbabwe');
  const [composerHighway, setComposerHighway] = useState<string>('');
  const [composerStatus, setComposerStatus] = useState<string>('');
  const [composerImage, setComposerImage] = useState<string>('');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showCorridorPicker, setShowCorridorPicker] = useState(false);

  // Feed filter state
  const [feedFilter, setFeedFilter] = useState<'all' | 'trending' | 'alerts' | 'media'>('all');

  // Inline comments open state
  const [openCommentsPostIds, setOpenCommentsPostIds] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Stories scroll & modal state
  const storiesScrollRef = useRef<HTMLDivElement | null>(null);
  const [viewingStoryIdx, setViewingStoryIdx] = useState<number | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyLocation, setStoryLocation] = useState<string>(userProfile.baseTown || 'Bulawayo');
  const [storyImageUrl, setStoryImageUrl] = useState<string>(sunsetStoryImg);

  const initials = (userProfile.name || 'RL')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'post' | 'story') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'post') {
          setComposerImage(reader.result);
          setIsComposerExpanded(true);
        } else {
          setStoryImageUrl(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && !composerImage) return;

    const matches: string[] = composerText.match(/#[a-zA-Z0-9_]+/g) ?? [];
    const extractedTags = Array.from(new Set([...matches, '#RoadLink']));

    onCreatePost({
      authorName: userProfile.name || 'Tinotenda Sibanda',
      authorHandle: `@${(userProfile.name || 'tinotenda').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      authorVerified: userProfile.isVerifiedDriver,
      authorRoleLabel:
        userProfile.role === 'moderator'
          ? 'Highway Moderator'
          : userProfile.role === 'news_journalist'
          ? 'Press Desk'
          : userProfile.driverType === 'truck'
          ? 'Long-Haul Driver'
          : 'RoadLink Member',
      avatarInitials: initials,
      avatarUrl: CURRENT_USER_AVATAR_IMG,
      avatarBg: '#2563EB',
      location: composerLocation || userProfile.baseTown,
      highway: composerHighway || undefined,
      feeling: composerStatus || undefined,
      content: composerText.trim(),
      hashtags: extractedTags,
      imageUrl: composerImage || undefined,
    });

    setComposerText('');
    setComposerImage('');
    setComposerStatus('');
    setComposerHighway('');
    setShowPhotoPicker(false);
    setShowStatusPicker(false);
    setShowCorridorPicker(false);
    setIsComposerExpanded(false);
  };

  const handlePublishStory = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStory({
      authorName: (userProfile.name || 'You').split(' ')[0],
      authorHandle: `@${(userProfile.name || 'you').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      avatarInitials: initials,
      avatarUrl: CURRENT_USER_AVATAR_IMG,
      avatarColor: '#2563EB',
      imageUrl: storyImageUrl,
      caption: storyCaption.trim() || 'Checking in live on the Zimbabwe road network.',
      location: storyLocation.trim() || userProfile.baseTown,
    });
    setStoryCaption('');
    setIsCreateStoryOpen(false);
  };

  const toggleComments = (postId: string) => {
    setOpenCommentsPostIds((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSubmitComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setOpenCommentsPostIds((prev) => ({ ...prev, [postId]: true }));
  };

  const scrollStoriesRight = () => {
    storiesScrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
  };

  // Filter posts based on feed filter, active hashtag, and search bar
  const filteredPosts = posts.filter((post) => {
    if (activeHashtag) {
      const hasTag =
        post.hashtags.some((h) => h.toLowerCase() === activeHashtag.toLowerCase()) ||
        post.content.toLowerCase().includes(activeHashtag.toLowerCase());
      if (!hasTag) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        post.authorName.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        (post.location || '').toLowerCase().includes(q) ||
        (post.highway || '').toLowerCase().includes(q) ||
        post.hashtags.some((h) => h.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (feedFilter === 'trending') {
      return post.likesCount >= 100 || post.repostsCount >= 20;
    }
    if (feedFilter === 'alerts') {
      return Boolean(post.linkedIncidentId || post.hasEmbeddedMap);
    }
    if (feedFilter === 'media') {
      return (
        post.authorRoleLabel?.toLowerCase().includes('media') ||
        post.authorHandle.includes('zbc') ||
        post.authorHandle.includes('herald')
      );
    }
    return true;
  });

  const activeViewingStory = viewingStoryIdx !== null ? stories[viewingStoryIdx] : null;

  return (
    <div className="space-y-4 min-w-0">
      {/* 1. ROADLINK PULSE DISPATCH BAR (Original automotive broadcast bar) */}
      <section className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-3.5 sm:p-4 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={CURRENT_USER_AVATAR_IMG}
            alt={userProfile.name}
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#334155]"
          />

          <button
            type="button"
            onClick={() => setIsComposerExpanded(true)}
            className={`flex-1 text-left rounded-xl bg-[#111C2E] hover:bg-[#16233A] border border-[#1E293B] px-4 py-2.5 text-xs sm:text-sm transition-colors cursor-text truncate ${
              composerText ? 'text-white' : 'text-[#94A3B8]'
            }`}
          >
            {composerText || 'Broadcast a road condition, detour tip, or highway update...'}
          </button>

          {/* Unique RoadLink Quick Dispatch Chips */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenReportModal}
              title="Pin Hazard & Notify Moderator + Media Houses"
              className="px-3 py-2 rounded-xl bg-[#F97316]/15 hover:bg-[#F97316]/25 border border-[#F97316]/35 text-xs font-bold text-[#FB923C] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Radio className="w-4 h-4 text-[#F97316]" />
              <span>Pin Hazard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsComposerExpanded(true);
                setShowPhotoPicker((v) => !v);
                setShowStatusPicker(false);
                setShowCorridorPicker(false);
              }}
              className="px-3 py-2 rounded-xl bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-4 h-4 text-[#22C55E]" />
              <span>Road Snap</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsComposerExpanded(true);
                setShowStatusPicker((v) => !v);
                setShowPhotoPicker(false);
                setShowCorridorPicker(false);
              }}
              className="px-3 py-2 rounded-xl bg-[#111C2E] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Gauge className="w-4 h-4 text-[#38BDF8]" />
              <span>Road Status</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Action Row */}
        <div className="flex sm:hidden items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#1E293B]">
          <button
            type="button"
            onClick={onOpenReportModal}
            className="flex-1 py-2 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 text-xs font-bold text-[#FB923C] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Radio className="w-4 h-4 text-[#F97316]" />
            <span>Pin Hazard</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsComposerExpanded(true);
              setShowPhotoPicker(true);
            }}
            className="flex-1 py-2 rounded-xl bg-[#111C2E] text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#22C55E]" />
            <span>Road Snap</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsComposerExpanded(true);
              setShowStatusPicker(true);
            }}
            className="flex-1 py-2 rounded-xl bg-[#111C2E] text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Gauge className="w-4 h-4 text-[#38BDF8]" />
            <span>Status</span>
          </button>
        </div>

        {/* Expanded RoadLink Broadcast Form */}
        {isComposerExpanded && (
          <form onSubmit={handlePublishPost} className="mt-3.5 pt-3.5 border-t border-[#1E293B] space-y-3">
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              rows={3}
              autoFocus
              placeholder="Share traffic flow, checkpoint wait times, road surface conditions, or tag #RoadLink #A6Gwanda..."
              className="w-full rounded-xl bg-[#0B1220] border border-[#334155] px-3.5 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
            />

            {/* Road Status Chip Selector */}
            {showStatusPicker && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#94A3B8]">Select Corridor Traffic Status</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {ROAD_STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setComposerStatus(composerStatus === status ? '' : status)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                        composerStatus === status
                          ? 'bg-[#2563EB]/25 border-[#3B82F6] text-[#60A5FA]'
                          : 'bg-[#0B1220] border-[#1E293B] text-slate-300 hover:border-[#334155]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Corridor Quick Selector */}
            {showCorridorPicker && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#94A3B8]">Tag Highway Corridor</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {QUICK_CORRIDORS.map((corridor) => (
                    <button
                      key={corridor}
                      type="button"
                      onClick={() => setComposerHighway(composerHighway === corridor ? '' : corridor)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                        composerHighway === corridor
                          ? 'bg-[#16A34A]/20 border-[#16A34A] text-[#4ADE80]'
                          : 'bg-[#0B1220] border-[#1E293B] text-slate-300 hover:border-[#334155]'
                      }`}
                    >
                      {corridor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Road Photo Picker */}
            {showPhotoPicker && (
              <div className="space-y-2 rounded-xl bg-[#0B1220] border border-[#1E293B] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">Attach Road Snapshot or Upload</span>
                  <label className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'post')}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_PHOTOS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setComposerImage(preset.url)}
                      className={`relative h-14 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        composerImage === preset.url ? 'border-[#3B82F6]' : 'border-transparent'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {composerImage && (
              <div className="relative rounded-xl overflow-hidden border border-[#1E293B] max-h-52">
                <img src={composerImage} alt="Attachment preview" className="w-full h-44 object-cover" />
                <button
                  type="button"
                  onClick={() => setComposerImage('')}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#0B1220] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <input
                    type="text"
                    value={composerLocation}
                    onChange={(e) => setComposerLocation(e.target.value)}
                    className="bg-transparent text-xs text-white focus:outline-none w-32 sm:w-40"
                    placeholder="Town / Landmark"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCorridorPicker((v) => !v)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Route className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{composerHighway ? composerHighway.split(' ')[0] : 'Tag Highway'}</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F97316]/15 hover:bg-[#F97316]/25 border border-[#F97316]/30 text-[#FB923C] text-[11px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Media & Admin Report</span>
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsComposerExpanded(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold cursor-pointer shadow-md"
                >
                  Broadcast Update
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      {/* 2. CORRIDOR ROAD STORIES STRIP (Instagram-inspired road snapshots) */}
      <section className="relative">
        <div
          ref={storiesScrollRef}
          className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1"
        >
          {/* Share Road Snap Card */}
          <button
            type="button"
            onClick={() => setIsCreateStoryOpen(true)}
            className="relative w-28 sm:w-[118px] h-40 sm:h-44 rounded-2xl overflow-hidden shrink-0 border border-[#334155] bg-[#111C2E] group cursor-pointer shadow-md"
          >
            <img
              src={CURRENT_USER_AVATAR_IMG}
              alt="Share road snapshot"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#0B1220]/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] border-2 border-white/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="mt-2.5 text-xs font-semibold text-white leading-tight text-center">
                Share Road<br />Snap
              </span>
            </div>
          </button>

          {/* Driver Road Story Cards */}
          {stories.map((story, idx) => (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                onMarkStoryViewed(story.id);
                setViewingStoryIdx(idx);
              }}
              className="relative w-28 sm:w-[118px] h-40 sm:h-44 rounded-2xl overflow-hidden shrink-0 border border-[#1E293B] bg-[#0F172A] group cursor-pointer shadow-md text-left"
            >
              <img
                src={story.imageUrl}
                alt={`${story.authorName} road snapshot`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/90 via-transparent to-black/25" />

              {/* Ring avatar top-left */}
              <div
                className={`absolute top-2.5 left-2.5 w-9 h-9 rounded-full p-0.5 ${
                  story.isViewed
                    ? 'bg-slate-500'
                    : 'bg-gradient-to-tr from-[#2563EB] via-[#38BDF8] to-[#F59E0B]'
                }`}
              >
                {story.avatarUrl ? (
                  <img
                    src={story.avatarUrl}
                    alt={story.authorName}
                    className="w-full h-full rounded-full object-cover border border-[#0B1220]"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-[11px] font-semibold text-white border border-[#0B1220]"
                    style={{ backgroundColor: story.avatarColor || '#1D4ED8' }}
                  >
                    {story.avatarInitials}
                  </div>
                )}
              </div>

              {story.highway && (
                <span className="absolute top-2.5 right-2 px-1.5 py-0.5 rounded bg-[#0B1220]/80 border border-white/15 text-[9px] font-bold text-[#60A5FA]">
                  {story.highway.split(' ')[0]}
                </span>
              )}

              <span className="absolute bottom-2.5 left-2.5 right-2 text-xs font-bold text-white truncate drop-shadow">
                {story.authorName}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll Right Arrow */}
        <button
          type="button"
          onClick={scrollStoriesRight}
          aria-label="Scroll road stories"
          className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0F172A]/90 hover:bg-[#2563EB] border border-[#334155] text-white items-center justify-center shadow-xl cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* 3. INTERACTIVE MAP WITH RECENT REPORTS */}
      <EmbeddedSocialMiniMap
        incidents={incidents}
        onOpenFullMap={onOpenFullMap}
        onSelectIncident={onSelectIncident}
        onOpenReportModal={onOpenReportModal}
      />

      {/* 4. STREAM FILTER STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'Corridor Stream' },
              { id: 'trending', label: 'Top Boosted' },
              { id: 'alerts', label: 'Road Alerts' },
              { id: 'media', label: 'Press Wire' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFeedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                feedFilter === tab.id
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-[#0F172A] text-[#94A3B8] hover:text-white border border-[#1E293B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {(activeHashtag || searchQuery.trim()) && (
          <div className="flex items-center gap-2 text-xs">
            {activeHashtag && (
              <button
                type="button"
                onClick={() => onSelectHashtag(null)}
                className="px-2.5 py-1 rounded-lg bg-[#2563EB]/20 border border-[#3B82F6]/40 text-[#60A5FA] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>{activeHashtag}</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {searchQuery.trim() && (
              <span className="text-[11px] text-[#94A3B8]">
                Filtering by "{searchQuery}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* 5. ROADLINK SOCIAL STREAM */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] p-8 text-center">
            <Sparkles className="w-8 h-8 text-[#3B82F6] mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No dispatches match this filter yet</p>
            <p className="text-xs text-[#94A3B8] mt-1">
              Reset filters or broadcast a live corridor update above.
            </p>
            <button
              type="button"
              onClick={() => {
                setFeedFilter('all');
                onSelectHashtag(null);
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
            >
              Show All Updates
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const linkedInc = post.linkedIncidentId
              ? incidents.find((i) => i.id === post.linkedIncidentId)
              : undefined;
            const isCommentsOpen = Boolean(openCommentsPostIds[post.id]);

            return (
              <article
                key={post.id}
                className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-lg"
              >
                {/* Post Header */}
                <div className="p-4 pb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {post.avatarUrl ? (
                      <img
                        src={post.avatarUrl}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#334155]"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 border border-white/15"
                        style={{ backgroundColor: post.avatarBg || '#1D4ED8' }}
                      >
                        {post.avatarInitials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-semibold text-white truncate">
                          {post.authorName}
                        </span>
                        {post.authorVerified && (
                          <BadgeCheck className="w-4 h-4 text-[#3B82F6] shrink-0" />
                        )}
                        {post.highway && (
                          <span className="px-2 py-0.5 rounded-md bg-[#111C2E] border border-[#334155] text-[10px] font-bold text-[#60A5FA]">
                            {post.highway.split(' ')[0]}
                          </span>
                        )}
                        {post.feeling && (
                          <span className="px-2 py-0.5 rounded-md bg-[#16A34A]/15 border border-[#16A34A]/30 text-[10px] font-semibold text-[#4ADE80]">
                            {post.feeling}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mt-0.5">
                        <span>{post.authorHandle}</span>
                        <span>·</span>
                        <span>{post.timestamp}</span>
                        <span>·</span>
                        <Globe className="w-3 h-3" />
                        {post.location && (
                          <>
                            <span>·</span>
                            <span className="truncate">{post.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {linkedInc && (
                      <button
                        type="button"
                        onClick={() => onSelectIncident(linkedInc)}
                        className="px-2.5 py-1 rounded-lg bg-[#F97316]/15 hover:bg-[#F97316]/25 border border-[#F97316]/30 text-[#FB923C] text-[11px] font-bold cursor-pointer whitespace-nowrap"
                      >
                        View Alert
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onNavigateTab('map')}
                      aria-label="Open on map"
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Post Body */}
                <div className="px-4 pb-3 space-y-2">
                  <p className="text-[14.5px] text-slate-100 whitespace-pre-line leading-[1.55]">
                    {post.content}
                  </p>
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.hashtags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => onSelectHashtag(tag)}
                          className="text-xs font-semibold text-[#60A5FA] hover:underline cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photo Media */}
                {post.imageUrl && (
                  <div className="px-4 pb-3">
                    <div className="rounded-xl overflow-hidden border border-[#1E293B] bg-[#070B14]">
                      <img
                        src={post.imageUrl}
                        alt={post.location || 'RoadLink corridor photo'}
                        className="w-full max-h-80 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* RoadLink Pulse Metrics Strip */}
                <div className="px-4 py-2 flex items-center justify-between text-xs text-[#94A3B8] border-t border-[#1E293B]/70">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#2563EB]/20 border border-[#3B82F6]/30 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-[#60A5FA]" />
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {post.likesCount} helpful
                    </span>
                  </div>

                  <div className="flex items-center gap-3 tabular-nums">
                    <button
                      type="button"
                      onClick={() => toggleComments(post.id)}
                      className="hover:text-white cursor-pointer"
                    >
                      {post.comments.length} {post.comments.length === 1 ? 'reply' : 'replies'}
                    </button>
                    <span>{post.repostsCount} echoes</span>
                  </div>
                </div>

                {/* 4-Button RoadLink Motorist Action Bar */}
                <div className="px-2 py-1.5 border-t border-[#1E293B] grid grid-cols-4 gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      post.userLiked
                        ? 'text-[#60A5FA] bg-[#2563EB]/15'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>{post.userLiked ? 'Helpful ✓' : 'Helpful'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleComments(post.id)}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isCommentsOpen
                        ? 'text-white bg-[#1E293B]/80'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Reply</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleRepost(post.id)}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      post.userReposted
                        ? 'text-[#4ADE80] bg-[#16A34A]/15'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60'
                    }`}
                  >
                    <Repeat2 className="w-4 h-4" />
                    <span>{post.userReposted ? 'Echoed' : 'Echo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendPostToDm(post)}
                    className="py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Relay</span>
                  </button>
                </div>

                {/* Inline Replies Drawer */}
                {isCommentsOpen && (
                  <div className="px-4 py-3 bg-[#0B1220] border-t border-[#1E293B] space-y-3">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-[#64748B]">Be the first motorist to reply.</p>
                    ) : (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto">
                        {post.comments.map((c) => (
                          <div key={c.id} className="flex items-start gap-2.5">
                            {c.avatarUrl ? (
                              <img
                                src={c.avatarUrl}
                                alt={c.authorName}
                                className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#334155]"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#1E293B] text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                                {c.authorName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div className="bg-[#111C2E] border border-[#1E293B] rounded-xl px-3 py-2 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white">{c.authorName}</span>
                                {c.authorVerified && (
                                  <BadgeCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                                )}
                                <span className="text-[11px] text-[#64748B] ml-auto">{c.timestamp}</span>
                              </div>
                              <p className="text-[13px] text-slate-200 mt-0.5 leading-snug">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <form
                      onSubmit={(e) => handleSubmitComment(e, post.id)}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        placeholder="Add a road check or motorist reply..."
                        className="flex-1 rounded-xl bg-[#111C2E] border border-[#334155] px-3.5 py-1.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
                      >
                        Reply
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* STORY VIEWER MODAL */}
      {activeViewingStory && viewingStoryIdx !== null && (
        <div className="fixed inset-0 z-[3300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[540px] rounded-3xl overflow-hidden border border-[#334155] bg-[#0B1220] shadow-2xl">
            <img
              src={activeViewingStory.imageUrl}
              alt={activeViewingStory.authorName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />

            <div className="absolute top-3 inset-x-3 space-y-2.5">
              <div className="flex gap-1">
                {stories.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`h-1 flex-1 rounded-full ${
                      idx <= viewingStoryIdx ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  {activeViewingStory.avatarUrl ? (
                    <img
                      src={activeViewingStory.avatarUrl}
                      alt={activeViewingStory.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-white/50 shrink-0"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border border-white/40"
                      style={{ backgroundColor: activeViewingStory.avatarColor || '#2563EB' }}
                    >
                      {activeViewingStory.avatarInitials}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold leading-tight">
                      {activeViewingStory.authorName}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {activeViewingStory.location} · {activeViewingStory.timestamp}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingStoryIdx(null)}
                  className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewingStoryIdx > 0 && (
              <button
                type="button"
                onClick={() => {
                  const nextIdx = viewingStoryIdx - 1;
                  onMarkStoryViewed(stories[nextIdx].id);
                  setViewingStoryIdx(nextIdx);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {viewingStoryIdx < stories.length - 1 && (
              <button
                type="button"
                onClick={() => {
                  const nextIdx = viewingStoryIdx + 1;
                  onMarkStoryViewed(stories[nextIdx].id);
                  setViewingStoryIdx(nextIdx);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="absolute bottom-4 inset-x-4 text-white space-y-2">
              <p className="text-xs leading-relaxed bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                {activeViewingStory.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SHARE ROAD SNAPSHOT MODAL */}
      {isCreateStoryOpen && (
        <div className="fixed inset-0 z-[3300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-2xl overflow-hidden text-white">
            <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between">
              <h3 className="text-sm font-semibold">Share 24h Road Snapshot</h3>
              <button
                type="button"
                onClick={() => setIsCreateStoryOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePublishStory} className="p-5 space-y-3.5">
              <div className="relative h-44 rounded-xl overflow-hidden border border-[#1E293B]">
                <img src={storyImageUrl} alt="Road snapshot preview" className="w-full h-full object-cover" />
                <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-[#0B1220]/90 hover:bg-[#2563EB] text-white text-[11px] font-bold cursor-pointer flex items-center gap-1.5 border border-[#334155]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'story')}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setStoryImageUrl(p.url)}
                    className={`h-12 rounded-lg overflow-hidden border-2 cursor-pointer ${
                      storyImageUrl === p.url ? 'border-[#3B82F6]' : 'border-transparent'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={storyLocation}
                onChange={(e) => setStoryLocation(e.target.value)}
                placeholder="Highway or city location"
                className="w-full rounded-xl bg-[#0B1220] border border-[#334155] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />
              <textarea
                value={storyCaption}
                onChange={(e) => setStoryCaption(e.target.value)}
                rows={2}
                placeholder="Describe current visibility, toll queue, or road condition..."
                className="w-full rounded-xl bg-[#0B1220] border border-[#334155] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateStoryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
                >
                  Publish Road Snap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
