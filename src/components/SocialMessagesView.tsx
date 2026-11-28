import React, { useState } from 'react';
import { DirectMessageThread } from '../types';
import {
  Search,
  Send,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  PhoneCall,
  MessageSquare,
} from 'lucide-react';

interface SocialMessagesViewProps {
  threads: DirectMessageThread[];
  selectedThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
  onOpenEmergencyModal: () => void;
}

export const SocialMessagesView: React.FC<SocialMessagesViewProps> = ({
  threads,
  selectedThreadId,
  onSelectThread,
  onSendMessage,
  onOpenEmergencyModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.peerName.toLowerCase().includes(q) ||
      t.peerLocation.toLowerCase().includes(q) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !draft.trim()) return;
    onSendMessage(activeThread.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] min-h-[560px]">
      {/* Left Conversation List */}
      <div
        className={`border-r border-[#1E293B] flex flex-col ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
              <span>Messages</span>
            </h2>
            <button
              type="button"
              onClick={onOpenEmergencyModal}
              className="px-2.5 py-1 rounded-lg bg-[#DC2626]/20 hover:bg-[#DC2626] border border-[#DC2626]/40 text-red-200 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>SOS</span>
            </button>
          </div>
          <div className="flex items-center bg-[#0B1220] border border-[#1E293B] rounded-xl px-3 py-2">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drivers or units..."
              className="bg-transparent text-xs text-white placeholder-[#64748B] focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#1E293B]/60">
          {filteredThreads.map((thread) => {
            const isActive = activeThread?.id === thread.id;
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => {
                  onSelectThread(thread.id);
                  setMobileShowChat(true);
                }}
                className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                  isActive ? 'bg-[#2563EB]/15' : 'hover:bg-[#111C2E]'
                }`}
              >
                <div className="relative shrink-0">
                  {thread.avatarUrl ? (
                    <img
                      src={thread.avatarUrl}
                      alt={thread.peerName}
                      className="w-10 h-10 rounded-full object-cover border border-[#334155]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1E293B] border border-[#334155] text-white font-semibold text-xs flex items-center justify-center">
                      {thread.avatarInitials}
                    </div>
                  )}
                  {thread.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A34A] border-2 border-[#0F172A]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{thread.peerName}</span>
                    <span className="text-[10px] text-[#64748B] shrink-0">{thread.lastTimestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">{thread.lastMessage}</p>
                </div>

                {thread.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Active Conversation */}
      <div
        className={`flex flex-col bg-[#0B1220] ${
          mobileShowChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeThread ? (
          <>
            <div className="px-4 py-3.5 border-b border-[#1E293B] bg-[#0F172A] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 rounded-lg bg-[#1E293B] text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                {activeThread.avatarUrl ? (
                  <img
                    src={activeThread.avatarUrl}
                    alt={activeThread.peerName}
                    className="w-9 h-9 rounded-full object-cover border border-[#334155] shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                    {activeThread.avatarInitials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white truncate">
                      {activeThread.peerName}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span>{activeThread.peerRole}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {activeThread.peerLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-[#2563EB] text-white rounded-br-sm'
                        : 'bg-[#111C2E] border border-[#1E293B] text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 ${
                        msg.sender === 'me' ? 'text-blue-200' : 'text-[#64748B]'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Reply Chips & Input */}
            <div className="p-3.5 border-t border-[#1E293B] bg-[#0F172A] space-y-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  'Sharing live route pin',
                  'Road is clear ahead',
                  'Need breakdown tow',
                ].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => onSendMessage(activeThread.id, quick)}
                    className="px-2.5 py-1 rounded-full bg-[#111C2E] hover:bg-[#1E293B] border border-[#334155] text-[11px] text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
                  >
                    {quick}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${activeThread.peerName}...`}
                  className="flex-1 rounded-full bg-[#0B1220] border border-[#334155] px-4 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
