import React, { useState, useRef, useEffect } from 'react';
import { RoadIncident, HighwayCorridor, WeatherTravelAlert, UserProfile } from '../types';
import { generateRoadAssistantAnswer } from '../utils/aiRoadKnowledge';
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
  MessageSquare
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  highlightRoute?: string;
  badges?: string[];
}

interface RoadAssistantChatProps {
  userProfile: UserProfile;
  incidents: RoadIncident[];
  corridors?: HighwayCorridor[];
  weatherAlerts: WeatherTravelAlert[];
  onNavigateTab?: (tab: string) => void;
  onSelectHighway?: (highwayCode: string) => void;
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
  isFloatingDrawer = false,
  onClose,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello ${userProfile.name || 'Tinotenda'}! I am RoadLink AI, your real-time Zimbabwean road navigation assistant. Ask me anything about routes, road blocks, accidents, ZINARA tolls, or weather conditions in Bulawayo and across Zimbabwe.`,
      timestamp: 'Just now',
      badges: ['Bulawayo Hub Calibrated', 'Live Database Connected'],
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
    "Are there any roadblocks or accidents to Harare?",
    "How is Victoria Falls road (A8) right now?",
    "Current status of Plumtree road (A7)?",
    "What are the ZINARA toll gate fees?",
    "Is Ascot flyover open in Bulawayo?",
    "Is it raining in Bulawayo?",
    "How do I report a road hazard?",
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
          const assistantMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            highlightRoute: data.highlightRoute,
            badges: data.badges || ['AI Verified', 'Live Telemetry'],
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

      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: answer.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightRoute: answer.highlightRoute,
        badges: answer.badges,
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
        text: `Chat cleared. How can I assist you with your travels from Bulawayo today, ${userProfile.name}?`,
        timestamp: 'Just now',
        badges: ['Ready'],
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-white ${
        isFloatingDrawer ? 'h-[560px] w-full max-w-md' : 'h-[520px] w-full'
      }`}
    >
      {/* Header */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">RoadLink AI Assistant</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold rounded border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Zimbabwe Highway & Bulawayo Route Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearChat}
            title="Reset Conversation"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isFloatingDrawer && onClose && (
            <button
              onClick={onClose}
              title="Close Assistant"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Questions Pill Scroller */}
      <div className="bg-slate-950/50 border-b border-slate-800/80 px-3 py-2 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Quick Ask:
        </span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-full text-[11px] font-medium whitespace-nowrap border border-slate-700/80 transition-colors cursor-pointer"
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
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/70 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Optional badges & actions */}
                {msg.badges && msg.badges.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-1.5">
                    {msg.badges.map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-900/80 text-emerald-300 text-[10px] font-mono rounded border border-emerald-500/30 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {b}
                      </span>
                    ))}
                    {msg.highlightRoute && onNavigateTab && (
                      <button
                        onClick={() => {
                          if (onSelectHighway) onSelectHighway(msg.highlightRoute!);
                          onNavigateTab('map');
                        }}
                        className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>View {msg.highlightRoute} on Map</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 ${isUser ? 'text-emerald-200 text-right' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                  {userProfile.name ? userProfile.name.charAt(0) : 'T'}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-slate-400">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px] text-slate-300 font-mono">Analyzing Bulawayo corridors & incidents...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
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
            placeholder="Ask about Gwanda road, roadblocks, tolls, or routes..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
