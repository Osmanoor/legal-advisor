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

type ViewMode = 'welcome' | 'history' | 'activeChat';

export default function ChatPage() {
  const { t, direction } = useLanguage();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [view, setView] = useState<ViewMode>("welcome");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    useChatSessions, 
    useChatMessages, 
    startNewChatMutation, 
    sendMessageMutation,
    deleteSessionMutation
  } = useChat();

  const sessionsQuery = useChatSessions();
  const messagesQuery = useChatMessages(activeSessionId);

  useEffect(() => {
    if (view === 'activeChat' && messagesQuery.data) {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [messagesQuery.data, view]);

  const handleStartChat = (message: string, options: ChatOptions) => {
    setView("activeChat");
    
    startNewChatMutation.mutate({ message, options }, {
        onSuccess: (newSessionData) => {
            setActiveSessionId(newSessionData.id);
        },
        onError: () => {
          showToast("Failed to start a new chat session.", "error");
          setView("welcome");
        }
    });
  };

  const handleSendMessage = (message: string, options: ChatOptions) => {
    if (!activeSessionId) return;
    
    const optimisticUserMsg: ChatMessage = { 
      id: `temp-${Date.now()}`, 
      role: 'user', 
      content: message, 
      timestamp: new Date().toISOString(),
      resources: []
    };
    
    queryClient.setQueryData<ChatMessage[]>(['chat', 'messages', activeSessionId], (oldData) => {
        return oldData ? [...oldData, optimisticUserMsg] : [optimisticUserMsg];
    });

    sendMessageMutation.mutate({ sessionId: activeSessionId, message, options });
  };
  
  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setView("activeChat");
    setIsHistoryPanelOpen(false);
  };
  
  const handleCreateNew = () => {
    setActiveSessionId(null);
    setView('welcome');
    setIsHistoryPanelOpen(false);
  };

  const handleDeleteActiveSession = () => {
    if (!activeSessionId) return;
    deleteSessionMutation.mutate(activeSessionId, {
        onSuccess: () => {
            showToast("Chat session deleted.", "success");
            handleCreateNew();
        },
        onError: (error) => {
             showToast(`Failed to delete session: ${error.message}`, "error");
        }
    })
  }

  useEffect(() => {
    document.body.style.overflow = isHistoryPanelOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isHistoryPanelOpen]);

  const renderContent = () => {
    if (view === "activeChat") {
      const activeSessionTitle = sessionsQuery.data?.find(s => s.id === activeSessionId)?.title 
        || startNewChatMutation.variables?.message
        || "New Chat...";
      
      const isLoading = startNewChatMutation.isPending || (activeSessionId && messagesQuery.isLoading);

      return (
        <div className="h-full w-full relative overflow-hidden">
          {/* --- DEFINITIVE FIX: Positioned inside the container and resized --- */}
          {/* <div className="absolute z-0 w-[50%] h-[50%] left-1/2 -translate-y-[-70%] bottom-0px bg-cta rounded-full filter blur-[100px] pointer-events-none"></div> */}

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center py-4 border-b border-border-default shrink-0 px-4 md:px-6 bg-background-body/80 backdrop-blur-sm">
              <p className="text-sm w-48 sm:w-auto md:text-base font-medium text-text-on-light-body truncate overflow-hidden">
                {activeSessionTitle}
              </p>
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <Button size="sm" className="bg-cta hover:bg-cta-hover h-8 gap-1 px-2 md:px-4 text-xs" onClick={handleCreateNew}>
                  <Plus size={12} />
                  <span className="hidden md:inline">New Chat</span>
                </Button>
                <ConfirmationDialog
                    trigger={
                        <Button variant="ghost" size="icon" className="text-text-on-light-muted h-8 w-8" disabled={deleteSessionMutation.isPending || !activeSessionId}>
                            <Trash2 size={16} />
                        </Button>
                    }
                    title="Delete Chat Session"
                    description={`Are you sure you want to permanently delete "${activeSessionTitle}"?`}
                    onConfirm={handleDeleteActiveSession}
                    confirmText="Yes, Delete"
                    isConfirming={deleteSessionMutation.isPending}
                />
                <Button variant="ghost" size="icon" className="text-text-on-light-muted h-8 w-8" onClick={() => setIsHistoryPanelOpen(true)}>
                  <Sidebar size={16} />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 min-h-0">
              {isLoading ? (
                <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>
              ) : (
                messagesQuery.data
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
        {view === 'history' && (
            <ChatHistoryView onSessionSelect={handleSessionSelect} />
        )}
      </div>
    );
  };
  
  const HistoryPanelContent = () => (
    <>
      <div className="p-4 border-b border-border-default flex justify-between items-center shrink-0">
        <h3 className="font-semibold">{t("chat.historyTitle")}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsHistoryPanelOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessionsQuery.isLoading ? (
          <div className="flex justify-center p-4">
            <LoadingSpinner />
          </div>
        ) : (
          sessionsQuery.data?.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSessionSelect(session.id)}
              className={cn(
                "p-2 text-sm rounded-md cursor-pointer truncate text-right",
                activeSessionId === session.id
                  ? "bg-cta/10 text-cta font-medium"
                  : "hover:bg-gray-100"
              )}
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
      
      {isHistoryPanelOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            style={{ top: "86px" }}
            onClick={() => setIsHistoryPanelOpen(false)}
            aria-hidden="true"
          />
          <aside
            className={cn(
              "fixed bottom-0 flex flex-col bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out",
              "w-full max-w-xs sm:max-w-sm",
              direction === "rtl"
                ? `left-0 ${isHistoryPanelOpen ? "translate-x-0" : "-translate-x-full"}`
                : `right-0 ${isHistoryPanelOpen ? "translate-x-0" : "translate-x-full"}`
            )}
            style={{ top: "86px" }}
          >
            <HistoryPanelContent />
          </aside>
        </>
      )}
    </div>
  );
}