import React, { useState, useEffect, useRef } from 'react';
import {
  NewsStory,
  NewsPublisherProfile,
  RoadIncident,
  ZimbabweHighway,
  ZimbabweTown,
  IncidentSeverity,
} from '../types';
import {
  getStoredPublisherProfile,
  saveStoredPublisherProfile,
} from '../utils/storage';
import highwayPressPhoto from '../assets/highway_press_photo.jpg';
import smartHighwayHero from '../assets/bulawayo_smart_highway.jpg';
import bulawayo3dMap from '../assets/bulawayo_3d_map.jpg';
import {
  Newspaper,
  PenTool,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  MapPin,
  Eye,
  Clock,
  Trash2,
  Edit3,
  Send,
  Plus,
  ArrowRight,
  UserCheck,
  Lock,
  ExternalLink,
  Sparkles,
  X,
  ChevronRight,
  Filter,
  FileText,
  Radio,
  BookOpen,
  LogOut,
  Building2,
  Check,
} from 'lucide-react';

interface NewsPublisherDashboardProps {
  newsStories: NewsStory[];
  onPublishStory: (story: NewsStory) => void;
  onDeleteStory: (storyId: string) => void;
  onUpdateStory: (story: NewsStory) => void;
  incidents: RoadIncident[];
  onNavigateTab: (tab: string) => void;
  onOpenStoryDetail?: (story: NewsStory) => void;
}

// Preset Accredited Media Houses in Zimbabwe for 1-click test sign in
const DEMO_PUBLISHERS: NewsPublisherProfile[] = [
  {
    id: 'pub-chronicle-byo',
    organizationName: 'The Chronicle Zimbabwe',
    reporterName: 'Thabani Ndlovu',
    pressCardNumber: 'ZMC-BYO-2026-441',
    officialEmail: 't.ndlovu@chronicle.co.zw',
    editorialBeat: 'Matabeleland Highways & Trans-Kalahari Corridors',
    cityBureau: 'Bulawayo',
    isZmcAccredited: true,
    articlesPublishedCount: 18,
    totalViews: 94200,
    joinedDate: 'Jan 2026',
    role: 'bureau_chief',
  },
  {
    id: 'pub-herald-hre',
    organizationName: 'The Herald Transport Desk',
    reporterName: 'Farai Mutasa',
    pressCardNumber: 'ZMC-HRE-2026-902',
    officialEmail: 'fmutasa@herald.co.zw',
    editorialBeat: 'National Road Infrastructure & Dualisation',
    cityBureau: 'Harare',
    isZmcAccredited: true,
    articlesPublishedCount: 24,
    totalViews: 142000,
    joinedDate: 'Nov 2025',
    role: 'editor',
  },
  {
    id: 'pub-zbc-wire',
    organizationName: 'ZBC News Highway Wire',
    reporterName: 'Chipo Sibanda',
    pressCardNumber: 'ZMC-NAT-2026-118',
    officialEmail: 'sibandac@zbcnews.co.zw',
    editorialBeat: 'Road Safety, Police Checkpoints & Emergency Alerts',
    cityBureau: 'Bulawayo',
    isZmcAccredited: true,
    articlesPublishedCount: 12,
    totalViews: 68500,
    joinedDate: 'Feb 2026',
    role: 'correspondent',
  },
  {
    id: 'pub-newsday-transit',
    organizationName: 'NewsDay Zimbabwe Transit',
    reporterName: 'Kelvin Moyo',
    pressCardNumber: 'ZMC-HRE-2026-319',
    officialEmail: 'kmoyo@newsday.co.zw',
    editorialBeat: 'Border Logistics, Beitbridge Corridors & Tolls',
    cityBureau: 'Beitbridge',
    isZmcAccredited: true,
    articlesPublishedCount: 9,
    totalViews: 41800,
    joinedDate: 'March 2026',
    role: 'correspondent',
  },
];

const PHOTO_PRESETS = [
  {
    id: 'preset-a6-photo',
    label: 'A6 Gwanda Resurfaced Corridor (Clear Day)',
    url: highwayPressPhoto,
  },
  {
    id: 'preset-byo-smart',
    label: 'Bulawayo Smart Dualisation & Interchange',
    url: smartHighwayHero,
  },
  {
    id: 'preset-map-aerial',
    label: 'Corridor Satellite & Telemetry View',
    url: bulawayo3dMap,
  },
];

const ZIMBABWE_HIGHWAYS: ZimbabweHighway[] = [
  'A6 (Bulawayo - Beitbridge)',
  'A5 (Harare - Bulawayo)',
  'A4 (Harare - Beitbridge)',
  'A7 (Bulawayo - Plumtree)',
  'A8 (Bulawayo - Victoria Falls)',
  'A1 (Harare - Chirundu)',
  'A2 (Harare - Nyamapanda)',
  'A3 (Harare - Mutare)',
  'A9 (Mutare - Masvingo)',
  'Bulawayo Urban',
  'Harare Urban',
  'Other Regional Road',
];

const ZIMBABWE_TOWNS: ZimbabweTown[] = [
  'Bulawayo',
  'Harare',
  'Beitbridge',
  'Gwanda',
  'Esigodini',
  'Gweru',
  'Kwekwe',
  'Kadoma',
  'Masvingo',
  'Mutare',
  'Chinhoyi',
  'Victoria Falls',
  'Hwange',
  'Zvishavane',
  'Plumtree',
  'Karoi',
] as ZimbabweTown[];

export const NewsPublisherDashboard: React.FC<NewsPublisherDashboardProps> = ({
  newsStories,
  onPublishStory,
  onDeleteStory,
  onUpdateStory,
  incidents,
  onNavigateTab,
  onOpenStoryDetail,
}) => {
  // Authentication & Profile State
  const [publisher, setPublisher] = useState<NewsPublisherProfile | null>(() =>
    getStoredPublisherProfile()
  );
  const [authMode, setAuthMode] = useState<'sign_in' | 'sign_up'>('sign_in');

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up form inputs
  const [orgName, setOrgName] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [pressCardNumber, setPressCardNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cityBureau, setCityBureau] = useState<ZimbabweTown>('Bulawayo');
  const [editorialBeat, setEditorialBeat] = useState(
    'A6 Gwanda–Bulawayo Corridor & Matabeleland Road Safety'
  );
  const [role, setRole] = useState<'editor' | 'correspondent' | 'bureau_chief'>('correspondent');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Active Dashboard view
  const [activeView, setActiveView] = useState<'stories' | 'upload' | 'wire' | 'credentials'>(
    'stories'
  );

  // Story Creator & Upload Studio State
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [storySummary, setStorySummary] = useState('');
  const [storyCategory, setStoryCategory] = useState<NewsStory['category']>('safety');
  const [categoryLabel, setCategoryLabel] = useState('Highway Safety');
  const [selectedHighway, setSelectedHighway] = useState<ZimbabweHighway>('A6 (Bulawayo - Beitbridge)');
  const [selectedTown, setSelectedTown] = useState<string>('Bulawayo - Gwanda (A6)');
  const [severity, setSeverity] = useState<IncidentSeverity>('info');
  const [isBreaking, setIsBreaking] = useState(false);
  const [bodyParagraphs, setBodyParagraphs] = useState<string>('');
  const [officialQuote, setOfficialQuote] = useState('');
  const [officialQuoteSource, setOfficialQuoteSource] = useState('');
  const [alternativeRoute, setAlternativeRoute] = useState('');
  const [tagsInput, setTagsInput] = useState('A6 Corridor, Highway Safety, Zimbabwe');

  // Media & Image Upload State
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>(highwayPressPhoto);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('A6 Corridor Esigodini stretch, photojournalism dispatch');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter in Stories List
  const [storyFilter, setStoryFilter] = useState<'all' | 'my_pub' | 'breaking'>('my_pub');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Broadsheet Preview modal
  const [previewStory, setPreviewStory] = useState<NewsStory | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Handle Quick Demo Sign-In
  const handleQuickSignIn = (demoPub: NewsPublisherProfile) => {
    setPublisher(demoPub);
    saveStoredPublisherProfile(demoPub);
    showToast(`Signed in as ${demoPub.reporterName} (${demoPub.organizationName})`);
  };

  // Handle Sign-In submit
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      showToast('Please enter an official press email');
      return;
    }
    // Match existing or create publisher
    const match = DEMO_PUBLISHERS.find(
      (p) => p.officialEmail.toLowerCase() === signInEmail.toLowerCase()
    );
    if (match) {
      setPublisher(match);
      saveStoredPublisherProfile(match);
      showToast(`Welcome back, ${match.reporterName}!`);
    } else {
      // Create session for this email
      const newPub: NewsPublisherProfile = {
        id: `pub-${Date.now().toString(36)}`,
        organizationName: signInEmail.split('@')[1]?.split('.')[0]?.toUpperCase() || 'Independent Press Desk',
        reporterName: signInEmail.split('@')[0]?.replace('.', ' ') || 'Accredited Reporter',
        pressCardNumber: `ZMC-2026-VAL-${Math.floor(1000 + Math.random() * 9000)}`,
        officialEmail: signInEmail,
        editorialBeat: 'National Highways & Transit Telemetry',
        cityBureau: 'Bulawayo',
        isZmcAccredited: true,
        articlesPublishedCount: 1,
        totalViews: 1200,
        joinedDate: 'Oct 2026',
        role: 'correspondent',
      };
      setPublisher(newPub);
      saveStoredPublisherProfile(newPub);
      showToast(`Signed in to Newsroom Desk`);
    }
  };

  // Handle Sign-Up submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !reporterName.trim() || !email.trim()) {
      showToast('Please complete all required fields');
      return;
    }
    const newPub: NewsPublisherProfile = {
      id: `pub-${Date.now().toString(36)}`,
      organizationName: orgName.trim(),
      reporterName: reporterName.trim(),
      pressCardNumber: pressCardNumber.trim() || `ZMC-2026-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      officialEmail: email.trim(),
      editorialBeat: editorialBeat.trim() || 'Highway Safety & Transit',
      cityBureau,
      isZmcAccredited: true,
      articlesPublishedCount: 0,
      totalViews: 0,
      joinedDate: 'Oct 2026',
      role,
    };
    setPublisher(newPub);
    saveStoredPublisherProfile(newPub);
    showToast(`Accreditation verified for ${newPub.organizationName}! Newsroom studio ready.`);
    setActiveView('upload');
  };

  const handleSignOut = () => {
    setPublisher(null);
    saveStoredPublisherProfile(null);
    showToast('Signed out of News Publisher Portal');
  };

  // Image Upload handler (file to base64 DataURL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImageBase64(reader.result);
        setSelectedPhotoPreset('');
        showToast('Photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Pre-fill form from a live road incident report
  const handleAdoptIncidentToStory = (incident: RoadIncident) => {
    setActiveView('upload');
    setStoryTitle(`PRESS REPORT: ${incident.title} on ${incident.highway}`);
    setStorySummary(`Verified traffic alert at ${incident.locationName}: ${incident.description}`);
    setSelectedHighway(incident.highway);
    setSelectedTown(incident.locationName);
    setSeverity(incident.severity);
    setBodyParagraphs(
      `BULAWAYO / NATIONAL ROAD WIRE — Motorists travelling along ${incident.highway} are advised to exercise heightened vigilance following confirmed reports at ${incident.locationName}.\n\nAccording to road telemetry and eyewitness accounts, ${incident.description}. Advisory: ${incident.detourAdvice || 'Exercise caution and maintain safe following distances'}.\n\nTraffic authorities advise drivers to monitor clearance operations.`
    );
    setTagsInput(`${incident.highway}, ${incident.locationName}, Road Alert, RoadLink`);
    setIsBreaking(incident.severity === 'critical');
    showToast(`Loaded details from incident "${incident.title}" into story studio`);
  };

  // Edit existing story
  const handleStartEdit = (story: NewsStory) => {
    setEditingStoryId(story.id);
    setStoryTitle(story.title);
    setStorySummary(story.summary);
    setStoryCategory(story.category);
    setCategoryLabel(story.categoryLabel);
    setSelectedHighway(story.relatedHighway || 'A6 (Bulawayo - Beitbridge)');
    setSelectedTown(story.locationOrRoute);
    setSeverity(story.severity || 'info');
    setBodyParagraphs(story.content.join('\n\n'));
    setCustomImageBase64(story.imageUrl && !PHOTO_PRESETS.some(p => p.url === story.imageUrl) ? story.imageUrl : null);
    setSelectedPhotoPreset(story.imageUrl || highwayPressPhoto);
    setTagsInput(story.tags.join(', '));
    setIsBreaking(story.severity === 'critical');
    setActiveView('upload');
    showToast(`Editing story: "${story.title}"`);
  };

  // Reset form
  const handleResetForm = () => {
    setEditingStoryId(null);
    setStoryTitle('');
    setStorySummary('');
    setBodyParagraphs('');
    setOfficialQuote('');
    setOfficialQuoteSource('');
    setAlternativeRoute('');
    setCustomImageBase64(null);
    setSelectedPhotoPreset(highwayPressPhoto);
    setIsBreaking(false);
  };

  // Publish / Upload story
  const handlePublishStory = (isDraft = false) => {
    if (!publisher) {
      showToast('Please sign in as an accredited publisher first');
      return;
    }
    if (!storyTitle.trim()) {
      showToast('Please enter an article headline');
      return;
    }
    if (!storySummary.trim()) {
      showToast('Please enter a brief story summary / teaser');
      return;
    }

    const paragraphs = bodyParagraphs
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const finalContent = paragraphs.length > 0
      ? paragraphs
      : [storySummary];

    if (officialQuote.trim()) {
      finalContent.push(
        `Official Statement: "${officialQuote.trim()}" — ${officialQuoteSource.trim() || 'Ministry & Police Desk'}`
      );
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const imageUrl = customImageBase64 || selectedPhotoPreset || highwayPressPhoto;

    const storyObject: NewsStory = {
      id: editingStoryId || `news-${Date.now().toString(36)}`,
      title: storyTitle.trim(),
      slug: storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      summary: storySummary.trim(),
      content: finalContent,
      category: storyCategory,
      categoryLabel: categoryLabel || 'Highway Safety',
      locationOrRoute: selectedTown || 'Zimbabwe National Highway System',
      town: publisher.cityBureau,
      severity: isBreaking ? 'critical' : severity,
      author: `${publisher.reporterName} (${publisher.role === 'bureau_chief' ? 'Bureau Chief' : 'Correspondent'})`,
      source: publisher.organizationName,
      sourceUrl: `https://roadlink.co.zw/press/${publisher.id}`,
      publishedAt: 'Just now',
      lastUpdatedAt: 'Just now',
      readTimeMinutes: Math.max(1, Math.ceil(finalContent.join(' ').split(' ').length / 180)),
      imageUrl,
      relatedHighway: selectedHighway,
      alternativeRoute: alternativeRoute.trim() || undefined,
      verificationStatus: publisher.isZmcAccredited ? 'official' : 'verified',
      tags: tags.length > 0 ? tags : ['RoadLink', 'Highway Press'],
    };

    if (editingStoryId) {
      onUpdateStory(storyObject);
      showToast(`Updated "${storyObject.title}" on the live wire!`);
    } else {
      onPublishStory(storyObject);
      showToast(`Published "${storyObject.title}" directly to the National Road Wire!`);

      // Update publisher stats
      const updatedPub: NewsPublisherProfile = {
        ...publisher,
        articlesPublishedCount: publisher.articlesPublishedCount + 1,
        totalViews: publisher.totalViews + 120,
      };
      setPublisher(updatedPub);
      saveStoredPublisherProfile(updatedPub);
    }

    handleResetForm();
    setActiveView('stories');
  };

  // Filtered stories
  const filteredStories = newsStories.filter((s) => {
    if (storyFilter === 'my_pub' && publisher) {
      const matchSource = s.source?.toLowerCase().includes(publisher.organizationName.toLowerCase());
      const matchAuthor = s.author?.toLowerCase().includes(publisher.reporterName.toLowerCase());
      if (!matchSource && !matchAuthor) return false;
    }
    if (storyFilter === 'breaking') {
      if (s.severity !== 'critical') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = s.title.toLowerCase().includes(q);
      const inSummary = s.summary.toLowerCase().includes(q);
      const inAuthor = s.author.toLowerCase().includes(q);
      if (!inTitle && !inSummary && !inAuthor) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-20 right-4 z-[1700] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner / Masthead */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none text-[160px] font-serif font-black">
          PRESS
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Zimbabwe Media Commission · Accredited Press Bureau</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
              RoadLink Newsroom & Press Publisher Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              Dedicated editorial portal for newspapers, broadcasters, transport correspondents, and accredited journalists to upload verified dispatches, road safety bulletins, and live highway telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('home')}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>← Back to Commuter View</span>
            </button>

            {publisher && (
              <button
                onClick={() => {
                  handleResetForm();
                  setActiveView('upload');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Upload New Dispatch</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Bureau Status Strip */}
        {publisher && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-serif font-black text-amber-300 text-base">
                {publisher.organizationName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {publisher.organizationName}
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ZMC Verified
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-2">
                  <span>Byline: <strong className="text-slate-200">{publisher.reporterName}</strong></span>
                  <span>·</span>
                  <span>Bureau: <strong className="text-slate-200">{publisher.cityBureau}</strong></span>
                  <span>·</span>
                  <span className="font-mono text-amber-300/80">{publisher.pressCardNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Published Stories</div>
                <div className="text-base font-bold text-amber-400 font-mono">
                  {newsStories.filter(s => s.source?.toLowerCase().includes(publisher.organizationName.toLowerCase())).length}
                </div>
              </div>
              <div className="text-right border-l border-slate-800 pl-4">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Reader Reach</div>
                <div className="text-base font-bold text-emerald-400 font-mono">
                  {publisher.totalViews.toLocaleString()} reads
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 bg-slate-800 hover:bg-red-950/50 hover:text-red-300 hover:border-red-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ml-2"
                title="Sign out of newsroom account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* IF NOT LOGGED IN: SHOW SIGN UP & SIGN IN PORTAL */}
      {!publisher ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sign In / Sign Up Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {authMode === 'sign_in' ? 'Media Agency Sign In' : 'Accredit New Press Organization'}
                </h2>
              </div>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode('sign_in')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    authMode === 'sign_in' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('sign_up')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    authMode === 'sign_up' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register Press
                </button>
              </div>
            </div>

            {authMode === 'sign_in' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your accredited media credentials to access the newsroom wire and publish bulletins to Zimbabwean road users.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Official Press Email</label>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. newsdesk@chronicle.co.zw or reporter@herald.co.zw"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-800">Password / PIN</label>
                    <span className="text-[11px] text-slate-400">Demo enabled (any password)</span>
                  </div>
                  <input
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Access Newsroom Studio</span>
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  Don't have an agency account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('sign_up')}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    Register your media house
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Register your news publication, radio station, TV desk, or freelance transport reporting brand with RoadLink Zimbabwe.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Media Organization *</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. The Chronicle / NewsDay / B-Metro"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Lead Reporter / Editor *</label>
                    <input
                      type="text"
                      required
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Mthokozisi Dube"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Press Accreditation / ZMC No.</label>
                    <input
                      type="text"
                      value={pressCardNumber}
                      onChange={(e) => setPressCardNumber(e.target.value)}
                      placeholder="e.g. ZMC-BYO-2026-781"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Bureau Base Town *</label>
                    <select
                      value={cityBureau}
                      onChange={(e) => setCityBureau(e.target.value as ZimbabweTown)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                    >
                      {ZIMBABWE_TOWNS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Official Press Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="desk@yourmedia.co.zw"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Account Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create security PIN"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Primary Reporting Beat / Corridor</label>
                  <input
                    type="text"
                    value={editorialBeat}
                    onChange={(e) => setEditorialBeat(e.target.value)}
                    placeholder="e.g. A6 Bulawayo-Gwanda & Trans-Limpopo Freight"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Editorial Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['correspondent', 'editor', 'bureau_chief'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-colors cursor-pointer ${
                          role === r
                            ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {r.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    I confirm this agency adheres to Zimbabwe Media Commission journalistic verification and road safety reporting standards.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!acceptedTerms}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accredit Media House & Enter Studio</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: 1-Click Fast Test Accounts */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-amber-950 uppercase tracking-tight">
                  Instant Test Sign-In (Accredited Outlets)
                </h3>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Click any of these accredited media houses to instantly test publishing, photo uploading, and broadcasting to the road feed:
              </p>

              <div className="space-y-2.5">
                {DEMO_PUBLISHERS.map((pub) => (
                  <button
                    key={pub.id}
                    onClick={() => handleQuickSignIn(pub)}
                    className="w-full text-left p-3.5 bg-white hover:bg-amber-100/50 border border-amber-200 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs hover:shadow-sm group"
                  >
                    <div className="space-y-0.5">
                      <div className="font-serif font-black text-slate-900 text-sm group-hover:text-amber-900 transition-colors">
                        {pub.organizationName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {pub.reporterName} · <span className="font-semibold text-slate-700">{pub.cityBureau} Bureau</span>
                      </div>
                      <div className="text-[10px] font-mono text-amber-700">
                        {pub.editorialBeat}
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-2.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center gap-1">
                      <span>Sign In</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                How RoadLink Newsroom Works
              </h4>
              <ul className="space-y-2 list-disc pl-4 text-[11px] leading-relaxed">
                <li>
                  <strong>Direct Live Wire Broadcast</strong>: Uploaded articles appear immediately in the national road wire and home page news banner.
                </li>
                <li>
                  <strong>Photojournalism Assets</strong>: Upload high-resolution on-scene photos or choose from verified highway imagery.
                </li>
                <li>
                  <strong>Audience Reach</strong>: Dispatches are pushed to long-haul drivers, cross-border coaches, and daily commuters along A6, A5, and A4 corridors.
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* WHEN SIGNED IN: FULL PUBLISHER DASHBOARD & UPLOAD STUDIO */
        <div className="space-y-6">
          {/* Dashboard Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('stories')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'stories'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Published Dispatches ({newsStories.length})</span>
              </button>

              <button
                onClick={() => {
                  handleResetForm();
                  setActiveView('upload');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'upload'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Upload Story Studio</span>
                {editingStoryId && <span className="px-1.5 py-0.2 bg-slate-900 text-white rounded text-[10px]">Editing</span>}
              </button>

              <button
                onClick={() => setActiveView('wire')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'wire'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Radio className="w-4 h-4 text-emerald-500" />
                <span>Live Road Intelligence Wire ({incidents.length})</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Signed in as: <strong className="text-slate-800">{publisher.organizationName}</strong>
            </div>
          </div>

          {/* VIEW 1: UPLOAD STUDIO */}
          {activeView === 'upload' && (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-slate-950 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-amber-600" />
                    <span>{editingStoryId ? 'Edit Highway Dispatch' : 'Upload New Road Article & Press Dispatch'}</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Compose and publish your story directly to commuters and transport operators across Zimbabwe.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {editingStoryId && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const tempStory: NewsStory = {
                        id: 'temp-preview',
                        title: storyTitle || 'Headline Preview',
                        slug: 'preview',
                        summary: storySummary || 'Summary preview...',
                        content: bodyParagraphs.split('\n\n').filter(Boolean),
                        category: storyCategory,
                        categoryLabel: categoryLabel || 'Highway Safety',
                        locationOrRoute: selectedTown || 'Zimbabwe',
                        author: `${publisher.reporterName} (${publisher.role})`,
                        source: publisher.organizationName,
                        publishedAt: 'Just now',
                        lastUpdatedAt: 'Just now',
                        readTimeMinutes: 2,
                        imageUrl: customImageBase64 || selectedPhotoPreset || highwayPressPhoto,
                        verificationStatus: 'official',
                        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
                      };
                      setPreviewStory(tempStory);
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Article</span>
                  </button>
                </div>
              </div>

              {/* Upload Form Elements */}
              <div className="space-y-5">
                {/* Headline & Severity */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-900">Article Headline / Title *</label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-red-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <Flame className="w-3.5 h-3.5" />
                      <span>Tag as Breaking News Bulletin</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="e.g. A6 Bulawayo–Gwanda Corridor Clear: Zero Roadblocks or Incidents Along Esigodini Route"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-serif font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Summary / Teaser */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Summary Teaser (For notification alerts & front page) *</label>
                  <textarea
                    rows={2}
                    required
                    value={storySummary}
                    onChange={(e) => setStorySummary(e.target.value)}
                    placeholder="Brief 1-2 sentence overview for drivers and mobile alerts..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Metadata Row: Category, Highway, Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Category</label>
                    <select
                      value={storyCategory}
                      onChange={(e) => {
                        const val = e.target.value as NewsStory['category'];
                        setStoryCategory(val);
                        const labelMap: Record<string, string> = {
                          safety: 'Highway Safety',
                          roadworks: 'Roadworks & Dualisation',
                          accidents: 'Accident Investigation',
                          congestion: 'Traffic Flow & Delays',
                          closures: 'Closures & Detours',
                          weather: 'Weather & Flooding',
                          public_transit: 'Transit & Coach Fleets',
                          official_announcements: 'ZINARA & Ministry Policies',
                        };
                        setCategoryLabel(labelMap[val] || 'Road News');
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="safety">Highway Safety</option>
                      <option value="roadworks">Roadworks & Dualisation</option>
                      <option value="accidents">Accident Investigation</option>
                      <option value="congestion">Traffic Flow & Delays</option>
                      <option value="closures">Closures & Detours</option>
                      <option value="weather">Weather & Flooding</option>
                      <option value="public_transit">Transit & Coach Fleets</option>
                      <option value="official_announcements">ZINARA & Ministry Policies</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Highway Corridor</label>
                    <select
                      value={selectedHighway}
                      onChange={(e) => setSelectedHighway(e.target.value as ZimbabweHighway)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {ZIMBABWE_HIGHWAYS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Location / Specific Stretch</label>
                    <input
                      type="text"
                      value={selectedTown}
                      onChange={(e) => setSelectedTown(e.target.value)}
                      placeholder="e.g. Esigodini Tollgate / Gwanda North"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Media & Photo Upload Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-700" />
                        Featured Article Photograph (Upload Your Own or Select Preset)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Upload high-quality news photography from the scene or pick from our verified road library.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Photo Presets & Current Image Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    {/* Active Preview */}
                    <div className="sm:col-span-1 relative rounded-xl overflow-hidden border-2 border-amber-500 shadow-sm aspect-video bg-slate-950">
                      <img
                        src={customImageBase64 || selectedPhotoPreset || highwayPressPhoto}
                        alt="Article preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                        Active Lead Photo
                      </div>
                    </div>

                    {/* Preset Buttons */}
                    <div className="sm:col-span-3 grid grid-cols-3 gap-2">
                      {PHOTO_PRESETS.map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setSelectedPhotoPreset(preset.url);
                            setCustomImageBase64(null);
                          }}
                          className={`relative rounded-lg overflow-hidden border cursor-pointer aspect-video group transition-all ${
                            !customImageBase64 && selectedPhotoPreset === preset.url
                              ? 'ring-2 ring-amber-500 border-amber-500'
                              : 'border-slate-300 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-white text-[9px] p-1 truncate font-medium">
                            {preset.label}
                          </div>
                          {!customImageBase64 && selectedPhotoPreset === preset.url && (
                            <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full">
                              <Check className="w-3 h-3 font-bold" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">Photo Caption</label>
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="e.g. Traffic moving smoothly along the A6 corridor near Esigodini"
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Photo Credit</label>
                      <input
                        type="text"
                        defaultValue={`${publisher.organizationName} Road Desk`}
                        className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Full Article Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-900">Full Article Content (Separate paragraphs with double enter) *</label>
                    <span className="text-slate-400 text-[11px]">Markdown / journalistic paragraphs</span>
                  </div>
                  <textarea
                    rows={6}
                    value={bodyParagraphs}
                    onChange={(e) => setBodyParagraphs(e.target.value)}
                    placeholder="Write the full report here. Detail the highway conditions, speed restrictions, weather factors, and advice for motorists..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-serif leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Additional Journalism Metadata: Official Quote & Detour */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Official Authority Quote (Optional)</label>
                    <input
                      type="text"
                      value={officialQuote}
                      onChange={(e) => setOfficialQuote(e.target.value)}
                      placeholder='e.g. "Patrols are maintaining zero tolerance on unroadworthy vehicles."'
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Quote Source / Official Title</label>
                    <input
                      type="text"
                      value={officialQuoteSource}
                      onChange={(e) => setOfficialQuoteSource(e.target.value)}
                      placeholder="e.g. Chief Superintendent, ZRP Traffic Branch"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Alternative Recommended Route (if congested/blocked)</label>
                    <input
                      type="text"
                      value={alternativeRoute}
                      onChange={(e) => setAlternativeRoute(e.target.value)}
                      placeholder="e.g. Use Old Esigodini Loop or Ascot deviation"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. A6, Gwanda, Esigodini, Tollgate, Bulawayo"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Final Submit Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Publishing as: <strong className="text-slate-900">{publisher.reporterName}</strong> for{' '}
                    <strong className="text-slate-900">{publisher.organizationName}</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handlePublishStory(true)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Save as Draft
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePublishStory(false)}
                      className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-md shadow-slate-900/20"
                    >
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>{editingStoryId ? 'Update & Broadcast Live' : 'Publish to National Wire'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: PUBLISHED STORIES / DISPATCHES LIST */}
          {activeView === 'stories' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Filter:</span>
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setStoryFilter('my_pub')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        storyFilter === 'my_pub'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Our Bureau ({newsStories.filter(s => s.source?.toLowerCase().includes(publisher.organizationName.toLowerCase())).length})
                    </button>
                    <button
                      onClick={() => setStoryFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        storyFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All National Dispatches ({newsStories.length})
                    </button>
                    <button
                      onClick={() => setStoryFilter('breaking')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        storyFilter === 'breaking'
                          ? 'bg-white text-red-700 shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Breaking Only
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, bylines, routes..."
                    className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 w-56"
                  />
                  <button
                    onClick={() => {
                      handleResetForm();
                      setActiveView('upload');
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Article</span>
                  </button>
                </div>
              </div>

              {/* Stories Grid */}
              <div className="space-y-3">
                {filteredStories.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900">No Dispatches Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No stories match the active filter. Click "Upload Article" to publish your first dispatch.
                    </p>
                    <button
                      onClick={() => {
                        handleResetForm();
                        setActiveView('upload');
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + Upload New Dispatch
                    </button>
                  </div>
                ) : (
                  filteredStories.map((story) => {
                    const isOwnStory = story.source?.toLowerCase().includes(publisher.organizationName.toLowerCase());

                    return (
                      <div
                        key={story.id}
                        className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-sm ${
                          isOwnStory ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {/* Article Thumbnail */}
                          {story.imageUrl && (
                            <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-200 bg-slate-900">
                              <img
                                src={story.imageUrl}
                                alt={story.title}
                                className="w-full h-full object-cover"
                              />
                              {story.severity === 'critical' && (
                                <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                                  Breaking
                                </span>
                              )}
                            </div>
                          )}

                          {/* Article Details */}
                          <div className="flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-bold text-slate-900 font-serif">
                                {story.source}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-500 text-[11px]">
                                {story.author}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-400 text-[11px]">
                                {story.publishedAt}
                              </span>
                              {isOwnStory && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold font-mono">
                                  Your Bureau
                                </span>
                              )}
                            </div>

                            <h3
                              onClick={() => {
                                if (onOpenStoryDetail) {
                                  onOpenStoryDetail(story);
                                } else {
                                  setPreviewStory(story);
                                }
                              }}
                              className="text-base font-serif font-black text-slate-950 hover:text-amber-700 transition-colors cursor-pointer leading-snug"
                            >
                              {story.title}
                            </h3>

                            <p className="text-xs font-serif text-slate-600 line-clamp-2 leading-relaxed">
                              {story.summary}
                            </p>

                            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">
                                  {story.categoryLabel}
                                </span>
                                {story.relatedHighway && (
                                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-emerald-800 font-bold">
                                    {story.relatedHighway}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setPreviewStory(story)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Public View</span>
                                </button>

                                {isOwnStory && (
                                  <>
                                    <button
                                      onClick={() => handleStartEdit(story)}
                                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Edit</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (confirm(`Unpublish and delete "${story.title}"?`)) {
                                          onDeleteStory(story.id);
                                          showToast(`Deleted "${story.title}" from wire`);
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                      title="Delete story"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: LIVE ROAD INTELLIGENCE WIRE (Source Leads for Reporters) */}
          {activeView === 'wire' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-600" />
                    Live Highway Reports & Telemetry Feed (Reporting Leads)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Active hazards and traffic alerts submitted by drivers. Click "Draft Story from Incident" to prefill an official press release.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                  {incidents.length} Active Feeds
                </div>
              </div>

              <div className="space-y-3">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                        <span className="font-bold text-emerald-800">{incident.highway}</span>
                        <span>·</span>
                        <span>{incident.locationName}</span>
                        <span>·</span>
                        <span className="capitalize">{incident.timestamp}</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                          incident.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{incident.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{incident.description}</p>
                    </div>

                    <button
                      onClick={() => handleAdoptIncidentToStory(incident)}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-xs"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Draft Press Story</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ARTICLE PUBLIC PREVIEW MODAL */}
      {previewStory && (
        <div className="fixed inset-0 z-[1800] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
                <Newspaper className="w-4 h-4 text-emerald-700" />
                <span>Broadsheet Reader Preview</span>
              </div>
              <button
                onClick={() => setPreviewStory(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              {previewStory.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video">
                  <img
                    src={previewStory.imageUrl}
                    alt={previewStory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="font-bold text-emerald-800">{previewStory.source}</span>
                  <span>·</span>
                  <span>{previewStory.publishedAt}</span>
                  <span>·</span>
                  <span>{previewStory.readTimeMinutes} min read</span>
                </div>
                <h2 className="text-2xl font-serif font-black text-slate-950 leading-tight">
                  {previewStory.title}
                </h2>
                <div className="text-xs font-sans text-slate-500">
                  By {previewStory.author}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl text-xs font-serif italic text-slate-800">
                {previewStory.summary}
              </div>

              <div className="space-y-3 font-serif text-slate-800 text-sm leading-relaxed">
                {previewStory.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {previewStory.alternativeRoute && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <strong>Alternative Route:</strong> {previewStory.alternativeRoute}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setPreviewStory(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
