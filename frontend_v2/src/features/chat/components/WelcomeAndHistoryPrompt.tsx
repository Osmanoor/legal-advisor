import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Send, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatOptions } from '@/types/chat';

interface WelcomeAndHistoryPromptProps {
  currentView: 'welcome' | 'history';
  onViewChange: (view: 'welcome' | 'history') => void;
  onStartChat: (message: string, options: ChatOptions) => void;
  isStartingChat: boolean;
}

export const WelcomeAndHistoryPrompt: React.FC<WelcomeAndHistoryPromptProps> = ({
  currentView,
  onViewChange,
  onStartChat,
  isStartingChat,
}) => {
  const { t } = useLanguage();

  const handlePromptKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() && !isStartingChat) {
      onStartChat(e.currentTarget.value, { language: 'ar', reasoning: false });
    }
  };

  const handleSendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = e.currentTarget.previousSibling as HTMLInputElement;
    if (input && input.value.trim() && !isStartingChat) {
      onStartChat(input.value, { language: 'ar', reasoning: false });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="p-8 md:p-12 border-2 border-border-input rounded-2xl bg-white relative overflow-hidden">
        <div className="absolute z-0 w-[80%] h-[80%] left-1/2 -translate-x-1/2 bottom-[-80%] bg-cta/10 rounded-full filter blur-[100px] pointer-events-none"></div>
        
        <Button
          onClick={() => onViewChange(currentView === 'history' ? 'welcome' : 'history')}
          className={cn(
            "absolute top-5 right-5 h-8 px-4 text-xs gap-2 hover:text-white",
            currentView === "history" ? "bg-cta text-white" : "bg-[#F7F8FA] text-black"
          )}
        >
          <Clock size={14} /> {t("chat.historyButton")}
        </Button>
        
        <div className="relative pt-10 md:pt-0 z-10 flex flex-col items-center text-center gap-6">
          <h2 className="text-2xl font-medium text-text-on-light-strong" style={{ fontFamily: "var(--font-primary-arabic)" }}>
            {t("chat.welcome.title")}
          </h2>
          <p className="text-sm text-text-on-light-faint" style={{ fontFamily: "var(--font-primary-arabic)" }}>
            {t("chat.welcome.description")}
          </p>
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder={t("chat.placeholder")}
              onKeyDown={handlePromptKeyDown}
              className="w-full h-[58px] bg-white border border-border-input rounded-2xl shadow-md pr-5 pl-16 text-right text-sm placeholder:text-text-on-light-placeholder"
              dir="rtl"
            />
            <Button
              className="absolute bg-cta border-primary-dark left-2 top-1/2 -translate-y-1/2 w-10 h-10 p-0"
              onClick={handleSendClick}
              disabled={isStartingChat}
            >
              <Send size={20} className="w-5 h-5 text-text-on-dark" fill="currentColor" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};