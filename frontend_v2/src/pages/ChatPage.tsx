// File: src/pages/ChatPage.tsx

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useChat } from "@/hooks/api/useChat";
import { ChatOptions } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Send, Clock, Plus, Trash2, Sidebar, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { WelcomeSection } from "@/features/chat/components/WelcomeSection";
import { ChatHistoryView } from "@/features/chat/components/ChatHistoryView";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { ChatInputBar } from "@/features/chat/components/ChatInputBar";
import LoadingSpinner from "@/components/ui/loading-spinner";

type ViewMode = "welcome" | "history" | "activeChat";

export default function ChatPage() {
  const { t, direction } = useLanguage();
  const [view, setView] = useState<ViewMode>("welcome");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false); // Single state for all screen sizes

  const { sessionsQuery, messagesQuery, sendMessage, startNewChat } = useChat();
  const activeChatMessages = messagesQuery(activeSessionId);

  useEffect(() => {
    if (!activeSessionId) {
      setView("welcome");
    }
  }, [activeSessionId]);
  const handleStartNewChat = async (
    firstMessage: string,
    options: ChatOptions
  ) => {
    if (!startNewChat.isPending) {
      try {
        const newSessionId = await startNewChat.mutateAsync({
          content: firstMessage,
          options,
        });
        setActiveSessionId(newSessionId);
        setView("activeChat");
        setIsHistoryPanelOpen(false);
      } catch (error) {
        console.error("Failed to start new chat:", error);
      }
    }
  };
  const handleSendMessage = (message: string, options: ChatOptions) => {
    if (activeSessionId && !sendMessage.isPending) {
      sendMessage.mutate({
        sessionId: activeSessionId,
        content: message,
        options,
      });
    }
  };
  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setView("activeChat");
    setIsHistoryPanelOpen(false);
  };

  // Prevent body scroll when the floating panel is open
  useEffect(() => {
    document.body.style.overflow = isHistoryPanelOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isHistoryPanelOpen]);

  const WelcomeAndHistoryPrompt = () => (
    <div className="w-full max-w-3xl mx-auto px-4">
      {" "}
      <div className="p-8 md:p-12 border-2 border-border-input rounded-2xl bg-white relative overflow-hidden">
        {" "}
        <div className="absolute z-0 w-[80%] h-[80%] left-1/2 -translate-x-1/2 bottom-[-80%] bg-cta/100 rounded-full filter blur-[100px] pointer-events-none opacity-100"></div>{" "}
        <Button
          onClick={() => setView(view === "history" ? "welcome" : "history")}
          className={cn(
            "absolute top-5 right-5 h-8 px-4 text-xs gap-2 hover:text-white",
            view === "history" ? "bg-cta text-white" : "bg-[#F7F8FA] text-black"
          )}
        >
          {" "}
          <Clock size={14} /> {t("chat.historyButton")}{" "}
        </Button>{" "}
        <div className="relative pt-10 md:pt-0 z-10 flex flex-col items-center text-center gap-6">
          {" "}
          <h2
            className="text-2xl font-medium text-text-on-light-strong"
            style={{ fontFamily: "var(--font-primary-arabic)" }}
          >
            {t("chat.welcome.title")}
          </h2>{" "}
          <p
            className="text-sm text-text-on-light-faint"
            style={{ fontFamily: "var(--font-primary-arabic)" }}
          >
            {t("chat.welcome.description")}
          </p>{" "}
          <div className="w-full max-w-md relative">
            {" "}
            <input
              type="text"
              placeholder={t("chat.placeholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleStartNewChat(e.currentTarget.value, {
                    saudiAccent: false,
                    reasoning: false,
                  });
                }
              }}
              className="w-full h-[58px] bg-white border border-border-input rounded-2xl shadow-md pr-5 pl-12 text-right text-sm placeholder:text-text-on-light-placeholder"
              dir="rtl"
            />{" "}
            <Button
              className="absolute bg-cta border-primary-dark left-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousSibling as HTMLInputElement;
                if (input && input.value.trim()) {
                  handleStartNewChat(input.value, {
                    saudiAccent: false,
                    reasoning: false,
                  });
                }
              }}
            >
              {" "}
              <Send
                size={20}
                className="w-5 h-5 text-text-on-dark"
                fill="currentColor"
              />{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case "welcome":
        return (
          <div className="pt-10 flex flex-col items-center gap-8">
            {" "}
            <WelcomeAndHistoryPrompt />{" "}
            <WelcomeSection
              onSuggestionClick={(q) =>
                handleStartNewChat(q, { saudiAccent: false, reasoning: false })
              }
            />{" "}
          </div>
        );
      case "history":
        return (
          <div className="pt-10 flex flex-col items-center gap-8">
            {" "}
            <WelcomeAndHistoryPrompt />{" "}
            <ChatHistoryView
              sessions={sessionsQuery.data || []}
              isLoading={sessionsQuery.isLoading}
              onSessionSelect={handleSessionSelect}
            />{" "}
          </div>
        );
      case "activeChat":
        return (
          <div className="flex flex-col h-full w-full relative overflow-hidden">
            {/* === HEADER === */}
            <div className="flex justify-between items-center py-4 border-b border-border-default shrink-0">
              <p className="text-sm w-56 md:w-auto md:text-base font-medium text-text-on-light-body truncate overflow-hidden">
                {sessionsQuery.data?.find((s) => s.id === activeSessionId)
                  ?.title || t("chat.chatTitlePlaceholder")}
              </p>
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-cta h-8 gap-1 px-2 md:px-4 text-xs"
                  onClick={() => setActiveSessionId(null)}
                >
                  <Plus size={12} />
                  <span className="hidden md:inline">{t("chat.newChat")}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-on-light-muted h-8 w-8"
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-on-light-muted h-8 w-8"
                  onClick={() => setIsHistoryPanelOpen((prev) => !prev)}
                >
                  <Sidebar size={16} />
                </Button>
              </div>
            </div>
            {/* === CHAT AREA === */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 min-h-0">
              {activeChatMessages.isLoading && (
                <div className="flex justify-center py-10">
                  <LoadingSpinner />
                </div>
              )}
              {activeChatMessages.data?.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {sendMessage.isPending && (
                <div className="flex justify-start">
                  <LoadingSpinner />
                </div>
              )}
              <div style={{ height: "200px" }} />
            </div>
            {/* === CHAT INPUT === */}
            <div className="absolute z-0 w-[70%] h-[80%] left-1/2 -translate-x-1/2 bottom-[-70%] bg-cta/100 rounded-full filter blur-[100px] pointer-events-none opacity-100"></div>
            <ChatInputBar
              onSendMessage={handleSendMessage}
              isLoading={sendMessage.isPending}
            />
          </div>
        );
      default:
        return null;
    }
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
      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col">{renderContent()}</div>

      {/* MODIFIED: Universal Floating Sidebar for all screen sizes */}
      {isHistoryPanelOpen && (
        <>
          {/* Backdrop (covers area below header) */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            style={{ top: "86px" }} // Starts below the header
            onClick={() => setIsHistoryPanelOpen(false)}
            aria-hidden="true"
          />
          {/* Sliding Panel (also below header) */}
          <aside
            className={cn(
              "fixed bottom-0 flex flex-col bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out",
              "w-full max-w-xs sm:max-w-sm", // Responsive width
              direction === "rtl"
                ? `right-0 ${
                    isHistoryPanelOpen ? "translate-x-0" : "translate-x-full"
                  }`
                : `left-0 ${
                    isHistoryPanelOpen ? "translate-x-0" : "-translate-x-full"
                  }`
            )}
            style={{ top: "86px" }} // Starts below the header
          >
            <HistoryPanelContent />
          </aside>
        </>
      )}
    </div>
  );
}
