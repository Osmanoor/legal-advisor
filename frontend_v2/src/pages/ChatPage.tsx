// src/pages/ChatPage.tsx

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useChat } from '@/hooks/api/useChat';
import { ChatOptions } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Send, BookOpen, Plus, Trash2, Sidebar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import all the new and refactored components
import { WelcomeSection } from '@/features/chat/components/WelcomeSection';
import { ChatHistoryView } from '@/features/chat/components/ChatHistoryView';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { ChatInputBar } from '@/features/chat/components/ChatInputBar';
import LoadingSpinner from '@/components/ui/loading-spinner';

type ViewMode = 'welcome' | 'history' | 'activeChat';

export default function ChatPage() {
  const { t, direction } = useLanguage();
  const [view, setView] = useState<ViewMode>('welcome');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  const { sessionsQuery, messagesQuery, sendMessage, startNewChat } = useChat();
  const activeChatMessages = messagesQuery(activeSessionId);

  useEffect(() => {
    if (!activeSessionId) {
      setView('welcome');
    }
  }, [activeSessionId]);

  const handleStartNewChat = async (firstMessage: string, options: ChatOptions) => {
    if (startNewChat.isPending) return;
    try {
      const newSessionId = await startNewChat.mutateAsync({ content: firstMessage, options });
      setActiveSessionId(newSessionId);
      setView('activeChat');
      setIsHistoryPanelOpen(false);
    } catch (error) {
      console.error("Failed to start new chat:", error);
    }
  };

  const handleSendMessage = (message: string, options: ChatOptions) => {
    if (!activeSessionId || sendMessage.isPending) return;
    sendMessage.mutate({ sessionId: activeSessionId, content: message, options });
  };
  
  const handleSessionSelect = (sessionId: string) => {
      setActiveSessionId(sessionId);
      setView('activeChat');
      setIsHistoryPanelOpen(false);
  };

  // --- COMPONENT UPDATED WITH YOUR SNIPPET ---
  const WelcomeAndHistoryPrompt = () => (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-8 md:p-12 border-2 border-border-input rounded-2xl bg-white relative overflow-hidden">
        {/* Corrected blur effect */}
        <div className="absolute z-0 w-[80%] h-[80%] left-1/2 -translate-x-1/2 bottom-[-80%] bg-cta/100 rounded-full filter blur-[100px] pointer-events-none opacity-100"></div>
        
        {/* Corrected History Button position */}
        <Button
            onClick={() => setView(view === 'history' ? 'welcome' : 'history')}
            className={cn(
              "absolute top-5 right-5 h-8 px-4 text-xs gap-2",
              view === 'history' ? 'bg-cta text-white' : 'bg-[#F7F8FA] text-black'
            )}
        >
            <BookOpen size={14} />
            {t('chat.historyButton')}
        </Button>

        {/* Content Container with z-index */}
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center gap-6">
            <h2 className="text-2xl font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
              {t('chat.welcome.title')}
            </h2>
            <p className="text-sm text-text-on-light-faint" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
              {t('chat.welcome.description')}
            </p>
            <div className="w-full max-w-md relative">
              <input
                type="text"
                placeholder={t('chat.placeholder')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleStartNewChat(e.currentTarget.value, { saudiAccent: false, reasoning: false });
                  }
                }}
                className="w-full h-[58px] bg-white border border-border-input rounded-2xl shadow-md pr-5 pl-16 text-right text-sm placeholder:text-text-on-light-placeholder"
                dir="rtl"
              />
              <Button
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0"
                onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                    if (input && input.value.trim()) {
                        handleStartNewChat(input.value, { saudiAccent: false, reasoning: false });
                    }
                }}
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // --- END OF UPDATED COMPONENT ---

  const renderContent = () => {
    switch (view) {
      case 'welcome':
        return (
            <div className="pt-10 flex flex-col items-center gap-8">
              <WelcomeAndHistoryPrompt />
              <WelcomeSection onSuggestionClick={(q) => handleStartNewChat(q, { saudiAccent: false, reasoning: false })} />
            </div>
        );
      case 'history':
        return (
            <div className="pt-10 flex flex-col items-center gap-8">
              <WelcomeAndHistoryPrompt />
              <ChatHistoryView
                sessions={sessionsQuery.data || []}
                isLoading={sessionsQuery.isLoading}
                onSessionSelect={handleSessionSelect}
              />
            </div>
        );
      case 'activeChat':
        return (
          <div className="flex flex-col h-full w-full">
            <div className="flex justify-between items-center p-4 border-b border-border-default">
                <div className="flex items-center gap-4">
                    <Button variant="default" size="sm" className="h-8 gap-1 px-4 text-xs" onClick={() => setActiveSessionId(null)}>
                        <Plus size={12}/>
                        {t('chat.newChat')}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-text-on-light-muted h-8 w-8"><Trash2 size={16}/></Button>
                    <Button variant="ghost" size="icon" className="text-text-on-light-muted h-8 w-8" onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}><Sidebar size={16}/></Button>
                </div>
                <p className="text-base font-medium text-text-on-light-body">
                    {sessionsQuery.data?.find(s => s.id === activeSessionId)?.title || t('chat.chatTitlePlaceholder')}
                </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {activeChatMessages.isLoading && <div className="flex justify-center py-10"><LoadingSpinner /></div>}
                {activeChatMessages.data?.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                {sendMessage.isPending && <div className="flex justify-start"><LoadingSpinner /></div>}
            </div>
            <ChatInputBar onSendMessage={handleSendMessage} isLoading={sendMessage.isPending} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-background-body flex" dir={direction}>
        {view === 'activeChat' && isHistoryPanelOpen && (
            <aside className="w-full max-w-xs border-l border-border-default h-full flex flex-col bg-white">
                <div className="p-4 border-b border-border-default">
                    <h3 className="font-semibold">{t('chat.historyTitle')}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sessionsQuery.data?.map(session => (
                        <div 
                            key={session.id} 
                            onClick={() => handleSessionSelect(session.id)}
                            className={cn('p-2 text-sm rounded-md cursor-pointer truncate text-right', activeSessionId === session.id ? 'bg-cta/10 text-cta font-medium' : 'hover:bg-gray-100')}
                        >
                            {session.title}
                        </div>
                    ))}
                </div>
            </aside>
        )}
        <main className="flex-1 h-full flex flex-col overflow-y-auto">
            {renderContent()}
        </main>
    </div>
  );
}