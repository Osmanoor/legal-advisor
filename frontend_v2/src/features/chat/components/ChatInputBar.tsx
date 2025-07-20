// src/features/chat/components/ChatInputBar.tsx

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch-rtl';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { ChatOptions } from '@/types/chat';

interface ChatInputBarProps {
  onSendMessage: (message: string, options: ChatOptions) => void;
  isLoading: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, isLoading }) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  
  const [options, setOptions] = useState<ChatOptions>({
    language: 'ar',
    reasoning: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input, options);
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAccentChange = (checked: boolean) => {
    setOptions(prev => ({
        ...prev,
        language: checked ? 'sa' : 'ar'
    }));
  };

  return (
    // This component's root div is already correctly positioned with 'absolute'
    <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 z-10 bg-gradient-to-t from-background-body via-background-body to-transparent">
      <form
        onSubmit={handleSubmit}
        // FIX: Give the form a consistent height. The outer padding is 1rem (p-4), so 172px + 1rem = 188px total height.
        // We'll use this value for the padding in the parent.
        className="w-full max-w-[654px] h-[172px] bg-white border border-[#F0F2F5] shadow-lg rounded-2xl flex flex-col pt-6 px-6 pb-4 space-y-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          className="w-full h-[68px] resize-none text-right focus:outline-none placeholder:text-[#A9A9A9] text-sm font-normal bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          dir="rtl"
        />

        <div className="w-full h-px border-t border-[#F0F2F5]"></div>

        <div className="flex justify-between items-center h-8">
          <div className={`flex items-center gap-4`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 py-2 px-3 h-8 bg-[#F7F8FA] border border-[#F0F2F5] rounded-lg shadow-[0px_1px_3px_rgba(25,33,61,0.1)]">
              <Switch
                id="saudi-accent-switch"
                checked={options.language === 'sa'}
                onCheckedChange={handleAccentChange}
              />
              <Label
                htmlFor="saudi-accent-switch"
                className="text-xs text-black font-normal cursor-pointer"
              >
                {t('chat.saudiAccent')}
              </Label>
            </div>
            </div>
          </div>
          <div className={`flex items-center`}>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-8 w-[114px] px-4 py-2 flex items-center justify-center gap-1.5 text-xs font-light bg-[#51B749] text-white border border-[#296436] rounded-lg shadow-[0px_2px_5px_rgba(20,88,201,0.17),_inset_0px_-2px_0.3px_rgba(14,56,125,0.18),_inset_0px_2px_1px_rgba(255,255,255,0.22)] hover:bg-[#4AAE43] active:bg-[#40993A]"
            >
              <Send size={12} />
              {t('chat.send')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};