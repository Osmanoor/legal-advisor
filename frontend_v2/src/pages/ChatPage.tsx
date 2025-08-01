// src/pages/ChatPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { useChat } from '@/hooks/api/useChat';
import { ChatMessage, ChatOptions } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sidebar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmationDialog } from '@/features/admin/components/Users/ConfirmationDialog';
import { useToast } from '@/hooks/useToast';

import { WelcomeAndHistoryPrompt } from '@/features/chat/components/WelcomeAndHistoryPrompt';
import { WelcomeSection } from '@/features/chat/components/WelcomeSection';
import { ChatHistoryView } from '@/features/chat/components/ChatHistoryView';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { ChatInputBar } from '@/features/chat/components/ChatInputBar';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuthStore } from '@/stores/authStore';

type ViewMode = 'welcome' | 'history' | 'activeChat';

export default function ChatPage() {
  const { t, direction } = useLanguage();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuthStore();
  
  const [view, setView] = useState<ViewMode>("welcome");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // --- MODIFICATION START: Local state for guest chat history ---
  const [guestMessages, setGuestMessages] = useState<ChatMessage[]>([]);
  // --- MODIFICATION END ---

  const { 
    useChatSessions, 
    useChatMessages, 
    startNewChatMutation, 
    sendMessageMutation,
    deleteSessionMutation
  } = useChat();

  const sessionsQuery = useChatSessions();
  // For authenticated users, this will fetch messages from the cache/API
  const messagesQuery = useChatMessages(activeSessionId);
  
  // --- MODIFICATION START: Determine which message list to show ---
  const currentMessages = isAuthenticated ? messagesQuery.data : guestMessages;
  // --- MODIFICATION END ---

  useEffect(() => {
    if (view === 'activeChat' && currentMessages) {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [currentMessages, view]);

  const handleStartChat = (message: string, options: ChatOptions) => {
    setView("activeChat");
    
    // --- MODIFICATION START: Guest vs. User Logic ---
    if (isAuthenticated) {
      startNewChatMutation.mutate({ message, options }, {
          onSuccess: (newSessionData) => {
              setActiveSessionId(newSessionData.id!);
          },
          onError: () => {
            showToast(t('chat.errorMessages.failed'), "error");
            setView("welcome");
          }
      });
    } else { // Guest logic
      const userMessage: ChatMessage = { id: `guest-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString() };
      setGuestMessages([userMessage]);
      
      startNewChatMutation.mutate({ message, options, history: [] }, {
        onSuccess: (response) => {
            setGuestMessages(response.messages);
        },
        onError: () => {
            showToast(t('chat.errorMessages.failed'), "error");
            setView("welcome");
            setGuestMessages([]);
        }
      });
    }
    // --- MODIFICATION END ---
  };

  const handleSendMessage = (message: string, options: ChatOptions) => {
    // --- MODIFICATION START: Guest vs. User Logic ---
    if (isAuthenticated) {
      if (!activeSessionId) return;
      const optimisticUserMsg: ChatMessage = { id: `temp-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString(), resources: [] };
      queryClient.setQueryData<ChatMessage[]>(['chat', 'messages', activeSessionId], (oldData) => oldData ? [...oldData, optimisticUserMsg] : [optimisticUserMsg]);
      sendMessageMutation.mutate({ sessionId: activeSessionId, message, options });
    } else { // Guest logic
      const userMessage: ChatMessage = { id: `guest-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString() };
      const currentHistory = guestMessages.map(m => ({ role: m.role, content: m.content }));
      
      setGuestMessages(prev => [...prev, userMessage]);

      startNewChatMutation.mutate({ message, options, history: currentHistory }, {
          onSuccess: (response) => {
              // The backend returns the full history, so we replace our local state
              setGuestMessages([...guestMessages, ...response.messages]);
          },
          onError: () => {
              showToast(t('chat.errorMessages.failed'), "error");
              setGuestMessages(prev => prev.slice(0, -1)); // Remove the optimistic message on failure
          }
      });
    }
    // --- MODIFICATION END ---
  };
  
  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setView("activeChat");
    setIsHistoryPanelOpen(false);
  };
  
  const handleCreateNew = () => {
    setActiveSessionId(null);
    setGuestMessages([]); // Clear guest messages as well
    setView('welcome');
    setIsHistoryPanelOpen(false);
  };

  const handleDeleteActiveSession = () => {
    if (!activeSessionId || !isAuthenticated) return;
    deleteSessionMutation.mutate(activeSessionId, {
        onSuccess: () => {
            showToast(t('common.success'), "success");
            handleCreateNew();
        },
        onError: (error) => {
             showToast(`${t('common.error')}: ${error.message}`, "error");
        }
    })
  }

  useEffect(() => {
    document.body.style.overflow = isHistoryPanelOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isHistoryPanelOpen]);

  const renderContent = () => {
    if (view === "activeChat") {
      const activeSessionTitle = isAuthenticated 
        ? (sessionsQuery.data?.find(s => s.id === activeSessionId)?.title || startNewChatMutation.variables?.message || t('chat.newChat'))
        : (guestMessages[0]?.content || t('chat.newChat'));
      
      const isLoading = startNewChatMutation.isPending || (isAuthenticated && activeSessionId && messagesQuery.isLoading);

      return (
        <div className="h-full w-full relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center py-4 border-b border-border-default shrink-0 px-4 md:px-6 bg-background-body/80 backdrop-blur-sm">
              <p className="text-sm w-48 sm:w-auto md:text-base font-medium text-text-on-light-body truncate overflow-hidden">
                {activeSessionTitle}
              </p>
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <Button size="sm" className="bg-cta hover:bg-cta-hover h-8 gap-1 px-2 md:px-4 text-xs" onClick={handleCreateNew}>
                  <Plus size={12} />
                  <span className="hidden md:inline">{t('chat.newChat')}</span>
                </Button>
                {/* --- MODIFICATION: Only show history/delete for authenticated users --- */}
                {isAuthenticated && (
                  <>
                    <ConfirmationDialog
                        trigger={
                            <Button variant="ghost" size="icon" className="text-text-on-light-muted h-8 w-8" disabled={deleteSessionMutation.isPending || !activeSessionId}>
                                <Trash2 size={16} />
                            </Button>
                        }
                        title={t('chat.deleteSessionTitle')}
                        description={t('chat.deleteSessionDescription', { title: activeSessionTitle })}
                        onConfirm={handleDeleteActiveSession}
                        confirmText={t('chat.deleteConfirm')}
                        isConfirming={deleteSessionMutation.isPending}
                    />
                    <Button variant="ghost" size="icon" className="text-text-on-light-muted h-8 w-8" onClick={() => setIsHistoryPanelOpen(true)}>
                      <Sidebar size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 min-h-0">
              {isLoading ? (
                <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>
              ) : (
                currentMessages
                  ?.slice()
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((msg) => <MessageBubble key={msg.id} message={msg} />)
              )}
              {sendMessageMutation.isPending && <div className="flex justify-start"><LoadingSpinner /></div>}
              <div style={{ height: "200px" }} />
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <ChatInputBar onSendMessage={handleSendMessage} isLoading={sendMessageMutation.isPending || startNewChatMutation.isPending} />
        </div>
      );
    }

    return (
      <div className="pt-10 flex flex-col items-center gap-8">
        <WelcomeAndHistoryPrompt 
            currentView={view}
            onViewChange={setView}
            onStartChat={handleStartChat}
            isStartingChat={startNewChatMutation.isPending}
        />
        {view === 'welcome' && (
            <WelcomeSection onSuggestionClick={(q: string) => handleStartChat(q, { language: 'ar' })} />
        )}
        {view === 'history' && isAuthenticated && (
            <ChatHistoryView onSessionSelect={handleSessionSelect} />
        )}
      </div>
    );
  };
  
  const HistoryPanelContent = () => (
    <>
      <div className="p-4 border-b border-border-default flex justify-between items-center shrink-0">
        <h3 className="font-semibold">{t("chat.historyTitle")}</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsHistoryPanelOpen(false)}><X className="w-5 h-5" /></Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessionsQuery.isLoading ? (
          <div className="flex justify-center p-4"><LoadingSpinner /></div>
        ) : (
          sessionsQuery.data?.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSessionSelect(session.id)}
              className={cn("p-2 text-sm rounded-md cursor-pointer truncate text-right", activeSessionId === session.id ? "bg-cta/10 text-cta font-medium" : "hover:bg-gray-100")}
            >
              {session.title}
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="h-full bg-background-body flex" dir={direction}>
      <div className="flex-1 h-full flex flex-col">{renderContent()}</div>
      
      {isHistoryPanelOpen && isAuthenticated && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" style={{ top: "86px" }} onClick={() => setIsHistoryPanelOpen(false)} aria-hidden="true" />
          <aside className={cn("fixed bottom-0 flex flex-col bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out", "w-full max-w-xs sm:max-w-sm", direction === "rtl" ? `left-0 ${isHistoryPanelOpen ? "translate-x-0" : "-translate-x-full"}` : `right-0 ${isHistoryPanelOpen ? "translate-x-0" : "translate-x-full"}`)} style={{ top: "86px" }}>
            <HistoryPanelContent />
          </aside>
        </>
      )}
    </div>
  );
}