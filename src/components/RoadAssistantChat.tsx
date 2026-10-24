import React, { useState, useRef, useEffect } from 'react';
import { RoadIncident, HighwayCorridor, WeatherTravelAlert, UserProfile, RoutePreviewData } from '../types';
import { generateRoadAssistantAnswer, detectRoutePreviewFromQuery } from '../utils/aiRoadKnowledge';
import { GoogleRouteMapEmbed } from './GoogleRouteMapEmbed';
import {
  Bot,
  Send,
  Sparkles,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Compass,
  ArrowRight,
  User,
  CheckCircle2,
  X,
  MessageSquare,
  Navigation
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  highlightRoute?: string;
  badges?: string[];
  routePreview?: RoutePreviewData;
}

interface RoadAssistantChatProps {
  userProfile: UserProfile;
  incidents: RoadIncident[];
  corridors?: HighwayCorridor[];
  weatherAlerts: WeatherTravelAlert[];
  onNavigateTab?: (tab: string) => void;
  onSelectHighway?: (highwayCode: string) => void;
  onSelectRouteOnMap?: (route: RoutePreviewData) => void;
  isFloatingDrawer?: boolean;
  onClose?: () => void;
  initialQuery?: string;
}

export const RoadAssistantChat: React.FC<RoadAssistantChatProps> = ({
  userProfile,
  incidents,
  corridors = [],
  weatherAlerts,
  onNavigateTab,
  onSelectHighway,
  onSelectRouteOnMap,
  isFloatingDrawer = false,
  onClose,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello ${userProfile.name || 'Tinotenda'}! I am RoadLink AI, your real-time Zimbabwean road navigation assistant. Ask me for any route (like Gwanda, Harare, Victoria Falls, or Plumtree) and I will show you the exact route line, distances, toll plazas, and live road conditions on the map just like Google Maps!`,
      timestamp: 'Just now',
      badges: ['Google Maps Calibrated', 'Live Database Connected'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Suggested questions chips covering key Zimbabwean routes & topics
  const SUGGESTED_QUERIES = [
    "What's the best route to take to Gwanda?",
    "Show route to Victoria Falls on the map",
    "Show route to Harare (A5)",
    "Status of Plumtree road (A7) & Botswana border?",
    "Show route to Beitbridge (A6)",
    "Are there any roadblocks to Gwanda?",
    "What are the ZINARA toll gate fees?",
    "Is Ascot flyover open in Bulawayo?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Attempt backend Gemini API call
      const res = await fetch('/api/road-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          incidents,
          corridors,
          weatherAlerts,
          userTown: userProfile.baseTown,
          userName: userProfile.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          const routePreview = data.routePreview || detectRoutePreviewFromQuery(query);
          const assistantMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            highlightRoute: data.highlightRoute || routePreview?.highwayCode,
            badges: data.badges || ['AI Verified', 'Live Telemetry'],
            routePreview,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      // Backend unavailable or client offline, proceed to comprehensive local knowledge engine
    }

    // 2. Comprehensive client-side domain knowledge engine fallback
    setTimeout(() => {
      const answer = generateRoadAssistantAnswer(query, {
        userProfile,
        incidents,
        corridors,
        weatherAlerts,
      });

      const routePreview = answer.routePreview || detectRoutePreviewFromQuery(query);

      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: answer.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightRoute: answer.highlightRoute || routePreview?.highwayCode,
        badges: answer.badges,
        routePreview,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 300);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Chat cleared. Ask me for any route, map directions, or road alerts from Bulawayo today, ${userProfile.name}!`,
        timestamp: 'Just now',
        badges: ['Ready'],
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col bg-[#0B1220] border border-[#1E293B] rounded-2xl overflow-hidden shadow-2xl text-white ${
        isFloatingDrawer ? 'h-[620px] max-h-[88vh] w-full max-w-lg' : 'h-[580px] w-full'
      }`}
    >
      {/* Header */}
      <div className="bg-[#070B14] border-b border-[#1E293B] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#60A5FA]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">RoadLink AI Assistant</span>
              <span className="px-1.5 py-0.5 bg-[#2563EB]/20 text-[#60A5FA] text-[10px] font-mono font-semibold rounded border border-[#2563EB]/40">
                LIVE MAPS
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">Google-Style Highway Navigation & Corridor Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearChat}
            title="Reset Conversation"
            className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#1E293B] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isFloatingDrawer && onClose && (
            <button
              onClick={onClose}
              title="Close Assistant"
              className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#1E293B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Questions Pill Scroller */}
      <div className="bg-[#070B14]/70 border-b border-[#1E293B] px-3 py-2 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#F97316]" />
          Quick Ask:
        </span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 bg-[#111C2E] hover:bg-[#1E293B] text-slate-200 hover:text-white rounded-full text-[11px] font-medium whitespace-nowrap border border-[#1E293B] transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[92%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-[#2563EB] text-white rounded-tr-none shadow-md shadow-blue-900/30'
                    : 'bg-[#111C2E] text-slate-100 border border-[#1E293B] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Google Maps Style Route Embed */}
                {msg.routePreview && (
                  <GoogleRouteMapEmbed
                    route={msg.routePreview}
                    incidents={incidents}
                    onOpenFullMap={(routeData) => {
                      if (onSelectRouteOnMap) onSelectRouteOnMap(routeData);
                      if (onSelectHighway) onSelectHighway(routeData.highwayCode);
                      if (onNavigateTab) onNavigateTab('map');
                      if (onClose) onClose();
                    }}
                    onOpenRoutePlanner={() => {
                      if (onNavigateTab) onNavigateTab('routes');
                      if (onClose) onClose();
                    }}
                  />
                )}

                {/* Optional badges & quick action buttons */}
                {msg.badges && msg.badges.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex flex-wrap items-center gap-1.5">
                    {msg.badges.map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#070B14] text-[#16A34A] text-[10px] font-mono rounded border border-[#16A34A]/30 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                        {b}
                      </span>
                    ))}
                    {msg.highlightRoute && onNavigateTab && !msg.routePreview && (
                      <button
                        onClick={() => {
                          if (onSelectHighway) onSelectHighway(msg.highlightRoute!);
                          onNavigateTab('map');
                        }}
                        className="px-2 py-0.5 bg-[#2563EB]/20 hover:bg-[#2563EB]/30 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>View {msg.highlightRoute} on Map</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 ${isUser ? 'text-blue-100 text-right' : 'text-[#64748B]'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-[#1E293B] text-white flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5 border border-[#334155]">
                  {userProfile.name ? userProfile.name.charAt(0) : 'T'}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-[#94A3B8]">
            <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-[#111C2E] border border-[#1E293B] rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px] text-slate-300 font-mono">Plotting route & live road telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 bg-[#070B14] border-t border-[#1E293B]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask for route to Gwanda, Victoria Falls, Harare, tolls, or road conditions..."
            className="flex-1 bg-[#111C2E] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors cursor-pointer flex-shrink-0 shadow-md shadow-blue-900/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
