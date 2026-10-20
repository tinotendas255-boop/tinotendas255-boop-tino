import React, { useState, useEffect } from 'react';
import { NewsStory, ZimbabweHighway, ZimbabweTown } from '../types';
import { NEWS_STORIES } from '../data/mockRoadData';
import highwayPressPhoto from '../assets/highway_press_photo.jpg';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Filter,
  ArrowUpRight,
  Clock,
  Newspaper,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Printer,
  Volume2,
  VolumeX,
  Send,
  CheckCircle2,
  Eye,
  FileText,
  Radio,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  PenTool,
  Truck,
  Bus,
  Car
} from 'lucide-react';

interface NewsFeedProps {
  newsStories?: NewsStory[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onSelectHighway?: (highway: ZimbabweHighway) => void;
  onSelectStory?: (story: NewsStory) => void;
  onNavigateTab?: (tab: string) => void;
}

type NewsCategoryFilter =
  | 'all'
  | 'accidents'
  | 'congestion'
  | 'closures'
  | 'roadworks'
  | 'weather'
  | 'public_transit'
  | 'fuel'
  | 'official_announcements'
  | 'safety'
  | 'bookmarked';

const CATEGORY_TABS: { id: NewsCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Updates' },
  { id: 'accidents', label: 'Accidents & Collisions' },
  { id: 'congestion', label: 'Traffic Congestion' },
  { id: 'closures', label: 'Road Closures' },
  { id: 'roadworks', label: 'Roadworks & Maintenance' },
  { id: 'weather', label: 'Flooding & Weather' },
  { id: 'public_transit', label: 'Public Transport' },
  { id: 'fuel', label: 'Fuel & Disruptions' },
  { id: 'official_announcements', label: 'Official Announcements' },
  { id: 'safety', label: 'Road Safety News' },
  { id: 'bookmarked', label: 'Saved Clippings' },
];

export const NewsFeed: React.FC<NewsFeedProps> = ({
  newsStories,
  bookmarkedIds,
  onToggleBookmark,
  onSelectHighway,
  onSelectStory,
  onNavigateTab,
}) => {
  const stories = newsStories && newsStories.length > 0 ? newsStories : NEWS_STORIES;

  // View mode: 'paper' (Newspaper Broadsheet edition) or 'dashboard' (Interactive Card Grid)
  const [viewMode, setViewMode] = useState<'paper' | 'dashboard'>('paper');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<NewsCategoryFilter>('all');
  const [activeAudienceFilter, setActiveAudienceFilter] = useState<'all' | 'truck' | 'bus' | 'commuter'>('all');
  const [selectedTownFilter, setSelectedTownFilter] = useState<string>('all');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('all');
  const [activeStoryModal, setActiveStoryModal] = useState<NewsStory | null>(null);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  // Citizen Press Tip Modal state
  const [isTipModalOpen, setIsTipModalOpen] = useState<boolean>(false);
  const [tipHeadline, setTipHeadline] = useState<string>('');
  const [tipCorridor, setTipCorridor] = useState<string>('A6 (Bulawayo - Gwanda - Beitbridge)');
  const [tipTown, setTipTown] = useState<string>('Bulawayo');
  const [tipDetails, setTipDetails] = useState<string>('');
  const [tipReporter, setTipReporter] = useState<string>('Tinotenda Sibanda');
  const [tipSuccess, setTipSuccess] = useState<boolean>(false);

  // Audio simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 500);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Breaking urgent alert stories
  const breakingStories = stories.filter((s) => s.severity === 'critical');
  const leadStory =
    activeAudienceFilter === 'truck'
      ? stories.find((s) => s.id === 'news-truck-weighbridge') ||
        stories.find((s) => s.targetAudience?.includes('truck')) ||
        stories[0]
      : activeAudienceFilter === 'bus'
      ? stories.find((s) => s.id === 'news-bus-ranks') ||
        stories.find((s) => s.targetAudience?.includes('bus')) ||
        stories[0]
      : activeAudienceFilter === 'commuter'
      ? stories.find((s) => s.id === 'news-lead-a6') ||
        stories.find((s) => s.targetAudience?.includes('commuter')) ||
        stories[0]
      : stories.find((s) => s.id === 'news-lead-a6') || stories[0];

  const byoStories = stories.filter((s) => s.town?.includes('Bulawayo') || s.locationOrRoute.includes('Bulawayo') || s.tags.includes('Bulawayo'));
  const nationalStories = stories.filter((s) => s.id !== leadStory?.id && !byoStories.some((b) => b.id === s.id));

  // Filtered stories for dashboard view
  const filteredStories = stories.filter((story) => {
    // Audience filter
    if (activeAudienceFilter !== 'all') {
      const isAudienceMatch =
        story.targetAudience?.includes(activeAudienceFilter) ||
        story.targetAudience?.includes('all') ||
        (activeAudienceFilter === 'truck' &&
          (story.category === 'fuel' ||
            story.tags.includes('Trucking') ||
            story.tags.includes('Freight') ||
            story.tags.includes('Weighbridge') ||
            story.tags.includes('Haulage'))) ||
        (activeAudienceFilter === 'bus' &&
          (story.category === 'public_transit' ||
            story.tags.includes('Bus Operators') ||
            story.tags.includes('Coach Safety') ||
            story.tags.includes('Transit'))) ||
        (activeAudienceFilter === 'commuter' &&
          (story.tags.includes('Urban Transit') ||
            story.tags.includes('Bulawayo') ||
            story.tags.includes('Road Clear')));
      if (!isAudienceMatch) return false;
    }
    // Category filter
    if (activeCategory === 'bookmarked') {
      if (!bookmarkedIds.includes(story.id)) return false;
    } else if (activeCategory !== 'all' && story.category !== activeCategory) {
      return false;
    }

    // Town filter
    if (selectedTownFilter !== 'all') {
      if (
        !story.locationOrRoute.toLowerCase().includes(selectedTownFilter.toLowerCase()) &&
        !(story.town && story.town.toLowerCase().includes(selectedTownFilter.toLowerCase()))
      ) {
        return false;
      }
    }

    // Severity filter
    if (selectedSeverityFilter !== 'all' && story.severity !== selectedSeverityFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = story.title.toLowerCase().includes(q);
      const matchSummary = story.summary.toLowerCase().includes(q);
      const matchLocation = story.locationOrRoute.toLowerCase().includes(q);
      const matchTags = story.tags.some((t) => t.toLowerCase().includes(q));
      const matchHighway = story.relatedHighway?.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchLocation && !matchTags && !matchHighway) return false;
    }

    return true;
  });

  const handleShareStory = (story: NewsStory) => {
    const shareText = `📰 ${story.title}\n\n${story.summary}\n\nSource: ${story.source}\nRead on RoadLink Zimbabwe Highway Gazette: https://roadlink.co.zw/news/${story.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: story.title,
          text: story.summary,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handlePrintStory = () => {
    window.print();
  };

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipHeadline.trim() || !tipDetails.trim()) return;
    setTipSuccess(true);
    setTimeout(() => {
      setTipSuccess(false);
      setIsTipModalOpen(false);
      setTipHeadline('');
      setTipDetails('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          NEWSPAPER NAMEPLATE & MASTHEAD HEADER
      ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm">
        {/* Top Gazette Weather & Status Line */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-300 text-[11px] font-mono text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">BULAWAYO & NATIONAL MORNING EDITION</span>
            <span aria-hidden="true">·</span>
            <span>VOL. 44, NO. 108</span>
            <span aria-hidden="true">·</span>
            <span>MONDAY, OCTOBER 19, 2026</span>
          </div>
          <div className="flex items-center gap-4 font-semibold text-slate-800">
            <span className="flex items-center gap-1 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              A6 Gwanda Corridor: Clear & Flowing
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Weather: 26°C Clear Sky</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Toll Base: $4 USD / 110 ZiG</span>
          </div>
        </div>

        {/* Grand Broadsheet Masthead */}
        <div className="py-5 text-center border-b-2 border-slate-900">
          <div className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-emerald-800 uppercase mb-1">
            ZIMBABWE NATIONAL TRANSPORT PRESS & OFFICIAL MOTORIST DISPATCH
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-950 uppercase select-none">
            The Highway Gazette
          </h1>
          <p className="text-xs sm:text-sm font-serif italic text-slate-600 mt-1 max-w-2xl mx-auto">
            "Connecting People. Reporting Highway Truths. Keeping Zimbabwe Moving Safely."
          </p>
        </div>

        {/* View Mode Bar & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
          {/* Dual Edition View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('paper')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'paper'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Newspaper Broadsheet View</span>
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Feed & Filters</span>
            </button>
          </div>

          {/* Right Tools: Submit Tip & Bookmarks Count */}
          <div className="flex items-center gap-2">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('publisher')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Sign in or register your media house to upload stories"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Media Publisher Portal</span>
              </button>
            )}

            <button
              onClick={() => setIsTipModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-200" />
              <span>Submit Press Tip</span>
            </button>

            <button
              onClick={() => {
                setViewMode('dashboard');
                setActiveCategory('bookmarked');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-600" />
              <span>Saved Clippings ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Driver Persona Audience Wire Filter Strip */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-slate-500 font-bold text-[11px] uppercase mr-1">
              Driver News Wire:
            </span>
            <button
              onClick={() => setActiveAudienceFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeAudienceFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Wires
            </button>
            <button
              onClick={() => setActiveAudienceFilter('truck')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeAudienceFilter === 'truck'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Heavy Freight & Trucker Wire</span>
            </button>
            <button
              onClick={() => setActiveAudienceFilter('bus')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeAudienceFilter === 'bus'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Intercity Coach & Transit Wire</span>
            </button>
            <button
              onClick={() => setActiveAudienceFilter('commuter')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeAudienceFilter === 'commuter'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Citizen Commuter Wire</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden md:inline">
            {activeAudienceFilter === 'truck'
              ? 'Showing freight, axle load & bulk diesel dispatches'
              : activeAudienceFilter === 'bus'
              ? 'Showing coach terminals, speed limits & transit news'
              : activeAudienceFilter === 'commuter'
              ? 'Showing urban corridors, potholes & daily travel news'
              : 'Showing all national highway news'}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          LIVE PRESS WIRE / BREAKING NEWS TICKER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-slate-950 text-white rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden shadow-sm border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Press Wire:</span>
        </div>
        <div className="overflow-x-auto scrollbar-none whitespace-nowrap text-xs text-slate-200 flex items-center gap-6">
          <span className="flex items-center gap-1">
            <strong className="text-emerald-400 font-mono">[A6 GWANDA]</strong> Road completely clear past Esigodini; zero unannounced checkpoints.
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <strong className="text-blue-400 font-mono">[BULAWAYO]</strong> Ascot flyover approach resurfacing completed; all 4 lanes flowing.
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <strong className="text-amber-400 font-mono">[ZINARA]</strong> Skyline & Norton automated e-tag boomless lanes reduce delays to 15s.
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <strong className="text-emerald-400 font-mono">[BEITBRIDGE]</strong> Automated commercial freight bypass operational; border queue clears.
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: NEWSPAPER BROADSHEET EDITION (THE NEWS PAPER)
      ───────────────────────────────────────────────────────────── */}
      {viewMode === 'paper' && (
        <div className="space-y-6">
          {/* FRONT PAGE HERO STORY & LEAD DISPATCH */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Lead Headline & Article (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="text-emerald-800 font-bold uppercase tracking-wider">FRONT PAGE LEAD STORY</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadStory.locationOrRoute}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadStory.publishedAt}</span>
                </div>

                <h2
                  onClick={() => setActiveStoryModal(leadStory)}
                  className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-950 leading-tight hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  {leadStory.title}
                </h2>

                <p className="text-sm sm:text-base font-serif italic text-slate-700 leading-relaxed border-l-4 border-slate-900 pl-4 py-1">
                  "{leadStory.summary}"
                </p>

                {/* Drop-cap editorial paragraph preview */}
                <div className="text-sm text-slate-800 font-serif leading-relaxed space-y-3">
                  <p>
                    <span className="float-left text-5xl font-serif font-black pr-2.5 text-slate-950 leading-none">
                      M
                    </span>
                    otorists travelling between Bulawayo and Gwanda can look forward to smooth and uninterrupted travel conditions today. Joint traffic surveillance reports confirm that the entire 126 km stretch along the A6 national highway remains completely clear of unannounced roadblocks, military checkpoints, and accident obstructions.
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    Travel time is currently averaging 1 hour 45 minutes for private light passenger vehicles operating at standard legal highway speeds (80–100 km/h). Weather along the corridor is clear with high visibility and dry asphalt.
                  </p>
                </div>

                {/* Lead Story Action Bar */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveStoryModal(leadStory)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Read Full Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setIsPlayingAudio(!isPlayingAudio);
                        if (!isPlayingAudio) setActiveStoryModal(leadStory);
                      }}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? 'Listening...' : 'Listen to Report'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBookmark(leadStory.id)}
                      className="p-2 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Bookmark Clipping"
                    >
                      {bookmarkedIds.includes(leadStory.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShareStory(leadStory)}
                      className="p-2 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Share Article"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Impact Press Photo with Caption (5 Cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative rounded-xl overflow-hidden border-2 border-slate-900 shadow-md group">
                  <img
                    src={highwayPressPhoto}
                    alt="A6 Gwanda Corridor Zimbabwe Highway"
                    className="w-full h-64 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-white/20">
                    PRESS PHOTO · A6 CORRIDOR
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-serif leading-snug">
                  <span className="font-bold text-slate-900 block mb-0.5">FIG 1.1: A6 Corridor Clear Toward Gwanda:</span>
                  Modern signage and newly resurfaced carriageway at the approach to Esigodini and Gwanda. Real-time traffic cameras report 0 collisions and standard toll flow.
                  <span className="block mt-1 text-[11px] font-mono text-slate-500">Photo Credit: Highway Gazette Field Correspondent.</span>
                </div>
              </div>
            </div>
          </div>

          {/* BROADSHEET THREE-COLUMN SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* COLUMN 1: BULAWAYO & MATABELELAND METRO DESK */}
            <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="pb-2 border-b-2 border-slate-900 flex items-center justify-between">
                  <h3 className="font-serif font-black text-slate-950 text-base uppercase tracking-tight flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    Bulawayo Metro Desk
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">LOCAL REPORTING</span>
                </div>

                {byoStories.slice(0, 3).map((story) => (
                  <article
                    key={story.id}
                    onClick={() => setActiveStoryModal(story)}
                    className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <span>{story.locationOrRoute}</span>
                      <span>·</span>
                      <span>{story.publishedAt}</span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm leading-snug hover:text-emerald-800 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-serif line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                  </article>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 text-center">
                <button
                  onClick={() => {
                    setViewMode('dashboard');
                    setSelectedTownFilter('Bulawayo');
                  }}
                  className="text-xs font-serif font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                >
                  All Bulawayo Dispatches &rarr;
                </button>
              </div>
            </div>

            {/* COLUMN 2: NATIONAL CORRIDORS & ERRP II GAZETTE */}
            <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="pb-2 border-b-2 border-slate-900 flex items-center justify-between">
                  <h3 className="font-serif font-black text-slate-950 text-base uppercase tracking-tight flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    Infrastructure & ERRP II
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">GOVT GAZETTE</span>
                </div>

                {nationalStories.slice(0, 3).map((story) => (
                  <article
                    key={story.id}
                    onClick={() => setActiveStoryModal(story)}
                    className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <span>{story.categoryLabel}</span>
                      <span>·</span>
                      <span>{story.readTimeMinutes} min read</span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm leading-snug hover:text-emerald-800 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-serif line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                  </article>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 text-center">
                <button
                  onClick={() => {
                    setViewMode('dashboard');
                    setActiveCategory('roadworks');
                  }}
                  className="text-xs font-serif font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
                >
                  View Roadworks & Toll Releases &rarr;
                </button>
              </div>
            </div>

            {/* COLUMN 3: OFFICIAL TRAVEL CLASSIFIEDS & TOLL NOTICES */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="pb-2 border-b-2 border-slate-900 flex items-center justify-between">
                <h3 className="font-serif font-black text-slate-950 text-base uppercase tracking-tight flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-800" />
                  Official Travel Gazette
                </h3>
                <span className="text-[10px] font-mono text-slate-500">SCHEDULES</span>
              </div>

              {/* ZINARA Toll Rates Notice */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-900 block font-serif">ZINARA Official Toll Tariffs (2026):</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700">
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 block">Light Vehicles:</span>
                    <strong className="text-slate-900">$4.00 USD / 110 ZiG</strong>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 block">Minibuses (PSV):</span>
                    <strong className="text-slate-900">$7.00 USD / 195 ZiG</strong>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 block">Buses (Coaches):</span>
                    <strong className="text-slate-900">$10.00 USD / 275 ZiG</strong>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 block">Heavy Haulage:</span>
                    <strong className="text-slate-900">$15.00 USD / 415 ZiG</strong>
                  </div>
                </div>
              </div>

              {/* Police & VID Legal Notice */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold font-serif">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>ZRP Traffic Highway Directive</span>
                </div>
                <p className="text-[11px] text-amber-950 font-serif leading-relaxed">
                  All intercity and private motorists must carry: 2 reflective breakdown triangles, functional 1kg fire extinguisher, and spare wheel. VID spot testing in progress along A5 and A8 corridors.
                </p>
              </div>

              {/* Highway Emergency Dispatch Numbers */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5">
                <span className="font-bold text-slate-900 font-serif block">Emergency Highway Desks:</span>
                <div className="text-[11px] font-mono text-slate-600 space-y-1">
                  <div>• ZRP National Traffic Desk: <strong className="text-slate-900">+263 242 703 631</strong></div>
                  <div>• Bulawayo Central Police: <strong className="text-slate-900">+263 292 725 15</strong></div>
                  <div>• MARS Ambulance: <strong className="text-slate-900">0800 11 000 / 0242 771 221</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: INTERACTIVE NEWS DASHBOARD & CARD FEED
      ───────────────────────────────────────────────────────────── */}
      {viewMode === 'dashboard' && (
        <div className="space-y-5">
          {/* Dashboard Search & Multi-Filter Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-emerald-700" />
                  National Road News Feed
                </h3>
                <p className="text-xs text-slate-500">Filter official dispatches, hazard investigations, and transport announcements.</p>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search road name, town, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Town / Corridor:</label>
                <select
                  value={selectedTownFilter}
                  onChange={(e) => setSelectedTownFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none"
                >
                  <option value="all">All Towns & Corridors</option>
                  <option value="Bulawayo">Bulawayo</option>
                  <option value="Gwanda">Gwanda</option>
                  <option value="Harare">Harare</option>
                  <option value="Beitbridge">Beitbridge</option>
                  <option value="Mutare">Mutare</option>
                  <option value="Gweru">Gweru</option>
                  <option value="Victoria Falls">Victoria Falls</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Severity Filter:</label>
                <select
                  value={selectedSeverityFilter}
                  onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical / Emergency</option>
                  <option value="warning">Warning / Detour</option>
                  <option value="advisory">Advisory</option>
                  <option value="info">Informational</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSelectedTownFilter('all');
                    setSelectedSeverityFilter('all');
                  }}
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>

            {/* 10 Interactive Category Tabs (Buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 text-xs pb-1 scrollbar-none">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'bookmarked' && ` (${bookmarkedIds.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Critical Disruption Banner */}
          {breakingStories.length > 0 && activeCategory === 'all' && !searchQuery.trim() && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Breaking Highway Disruption Alert
                </span>
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  DEMO DATA NOTICE
                </span>
              </div>

              {breakingStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStoryModal(story)}
                  className="p-3 bg-white border border-red-100 rounded-xl cursor-pointer hover:border-red-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-red-900 text-sm leading-snug">{story.title}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">{story.summary}</div>
                  </div>
                  <span className="text-red-700 font-semibold whitespace-nowrap flex items-center gap-1">
                    View Alert &rarr;
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* News Card Grid */}
          {filteredStories.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
              <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-800 text-sm">No stories match your filter criteria</p>
              <p className="text-slate-500 mt-1">Try resetting the category or clearing the search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStories.map((story) => {
                const isSaved = bookmarkedIds.includes(story.id);

                return (
                  <div
                    key={story.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Clean unboxed metadata with typographic separators (NO PILLS) */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-800">{story.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{story.publishedAt}</span>
                          <span aria-hidden="true">·</span>
                          <span>{story.readTimeMinutes} min</span>
                        </div>

                        <button
                          onClick={() => onToggleBookmark(story.id)}
                          title={isSaved ? 'Remove bookmark' : 'Bookmark story'}
                          className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer p-1"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Headline */}
                      <h3
                        onClick={() => setActiveStoryModal(story)}
                        className="text-base font-bold text-slate-900 tracking-tight leading-snug hover:text-emerald-700 transition-colors cursor-pointer mb-2"
                      >
                        {story.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                        {story.summary}
                      </p>

                      {/* Location or Route */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Route: <strong className="text-slate-700">{story.locationOrRoute}</strong></span>
                      </div>
                    </div>

                    {/* Footer with Source & Read Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Source: <strong className="text-slate-700 font-medium">{story.source}</strong>
                      </span>

                      <button
                        onClick={() => setActiveStoryModal(story)}
                        className="font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        View Details
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STORY DETAIL & READER MODAL (FULL NEWSPAPER ARTICLE)
      ───────────────────────────────────────────────────────────── */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-900 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header Masthead Bar */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-serif font-black text-xs uppercase tracking-wider text-slate-900">
                  The Highway Gazette
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-mono text-slate-500">{activeStoryModal.publishedAt}</span>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-2">
                {/* Font Size Selector */}
                <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-mono">
                  <button
                    onClick={() => setReaderFontSize('sm')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${readerFontSize === 'sm' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setReaderFontSize('base')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${readerFontSize === 'base' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setReaderFontSize('lg')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${readerFontSize === 'lg' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'}`}
                  >
                    A+
                  </button>
                </div>

                {/* Print button */}
                <button
                  onClick={handlePrintStory}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Print Newspaper Article"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Bookmark button */}
                <button
                  onClick={() => onToggleBookmark(activeStoryModal.id)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Bookmark"
                >
                  {bookmarkedIds.includes(activeStoryModal.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                {/* Share button */}
                <button
                  onClick={() => handleShareStory(activeStoryModal)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  onClick={() => setActiveStoryModal(null)}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-900 rounded-lg text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Audio Reader Simulated Bar */}
            <div className="bg-emerald-950 text-white px-6 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? 'Pause Audio' : 'Listen to Dispatch'}</span>
                </button>
                <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
                  {isPlayingAudio ? `Transmitting broadcast audio: ${audioProgress}%` : 'Voice readout bulletin'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">RoadLink Audio Wire</span>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-serif">
              {/* Optional Photo */}
              {activeStoryModal.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-300">
                  <img
                    src={activeStoryModal.imageUrl}
                    alt={activeStoryModal.title}
                    className="w-full h-56 sm:h-72 object-cover"
                  />
                  <div className="p-2 bg-slate-50 text-[11px] text-slate-600 font-sans border-t border-slate-200">
                    Official Gazette Press Asset · Captured along {activeStoryModal.locationOrRoute}
                  </div>
                </div>
              )}

              {/* Title & Byline */}
              <div>
                <div className="text-xs font-mono text-emerald-800 uppercase font-bold mb-1">
                  {activeStoryModal.categoryLabel} · {activeStoryModal.locationOrRoute}
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 tracking-tight leading-tight">
                  {activeStoryModal.title}
                </h1>
              </div>

              {/* Byline and Source */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-slate-600 pb-3 border-b border-slate-200">
                <span>By <strong>{activeStoryModal.author}</strong></span>
                <span>·</span>
                <span>Source: <strong>{activeStoryModal.source}</strong></span>
                <span>·</span>
                <span>Verification: <strong className="capitalize text-emerald-800">{activeStoryModal.verificationStatus}</strong></span>
              </div>

              {/* Alternative Route if present */}
              {activeStoryModal.alternativeRoute && (
                <div className="p-3 bg-slate-50 border-l-4 border-emerald-700 rounded-r-lg font-sans text-xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Navigational Advisory:</span>
                  <p className="text-slate-700">{activeStoryModal.alternativeRoute}</p>
                </div>
              )}

              {/* Story Paragraphs with reader font size */}
              <div
                className={`space-y-4 text-slate-800 leading-relaxed ${
                  readerFontSize === 'sm'
                    ? 'text-xs'
                    : readerFontSize === 'lg'
                    ? 'text-lg'
                    : 'text-sm sm:text-base'
                }`}
              >
                {activeStoryModal.content.map((paragraph, idx) => (
                  <p key={idx} className={idx === 0 ? 'first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:pr-2' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-sans text-slate-500">
                <span className="font-bold text-slate-700">Tags:</span>
                <span>{activeStoryModal.tags.join(' · ')}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-sans text-slate-600">
              <span>{shareSuccess ? '✓ Link & citation copied to clipboard!' : 'The Highway Gazette · Verified Transport Dispatch'}</span>
              <button
                onClick={() => setActiveStoryModal(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold cursor-pointer transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CITIZEN PRESS TIP / EYEWITNESS DISPATCH MODAL
      ───────────────────────────────────────────────────────────── */}
      {isTipModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-900 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900 font-serif">Submit Eyewitness Press Tip</h3>
              </div>
              <button
                onClick={() => setIsTipModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {tipSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900 font-serif">Press Tip Submitted!</h4>
                <p className="text-xs text-slate-600">
                  Thank you, Tinotenda! Your eyewitness report has been forwarded to The Highway Gazette newsroom desk for editorial verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTip} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Headline or News Event:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A6 corridor clear past Esigodini; normal flow observed"
                    value={tipHeadline}
                    onChange={(e) => setTipHeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Corridor:</label>
                    <select
                      value={tipCorridor}
                      onChange={(e) => setTipCorridor(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                    >
                      <option value="A6 (Bulawayo - Gwanda - Beitbridge)">A6 (Bulawayo - Gwanda)</option>
                      <option value="A5 (Harare - Bulawayo)">A5 (Harare - Bulawayo)</option>
                      <option value="A8 (Bulawayo - Victoria Falls)">A8 (Bulawayo - Vic Falls)</option>
                      <option value="A7 (Bulawayo - Plumtree)">A7 (Bulawayo - Plumtree)</option>
                      <option value="Bulawayo Urban">Bulawayo Urban</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Town / Hub:</label>
                    <input
                      type="text"
                      value={tipTown}
                      onChange={(e) => setTipTown(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eyewitness Observation Details:</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what you observed on the road (traffic speed, weather, checkpoints, or obstacles)..."
                    value={tipDetails}
                    onChange={(e) => setTipDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reporter Name:</label>
                  <input
                    type="text"
                    value={tipReporter}
                    onChange={(e) => setTipReporter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTipModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Gazette Newsroom</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
