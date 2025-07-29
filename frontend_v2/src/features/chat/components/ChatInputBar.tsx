// src/features/chat/components/ChatInputBar.tsx
// This component was already internationalized. No changes were made.

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { ChatOptions } from '@/types/chat';
import { Toggle } from '@/components/ui/toggle';

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

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 z-10 bg-gradient-to-t from-background-body via-background-body to-transparent">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[654px] bg-white border border-[#F0F2F5] shadow-lg rounded-2xl flex flex-col pt-6 px-6 space-y-4"
      >
        <Textarea
          variant="ghost"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          className="flex-grow text-right" 
          dir="rtl"
        />

        <div className="w-full h-px border-t border-[#F0F2F5]"></div>

        <div className="flex justify-between items-center h-8 pb-4">
          <div className="flex items-center gap-2">
            <Toggle
              pressed={options.language === 'sa'}
              onPressedChange={(pressed) => setOptions(prev => ({ ...prev, language: pressed ? 'sa' : 'ar' }))}
            >
              {t('chat.saudiAccent')}
            </Toggle>
            <Toggle
              pressed={options.reasoning}
              onPressedChange={(pressed) => setOptions(prev => ({ ...prev, reasoning: pressed }))}
            >
              {t('chat.reasoning')}
            </Toggle>
          </div>

          <div className="flex items-center">
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-8 w-[114px] px-4 py-2 flex items-center justify-center gap-1.5 text-xs font-light bg-[#51B749] text-white border border-[#296436] rounded-lg shadow-[0px_2px_5px_rgba(20,88,201,0.17),_inset_0px_-2px_0.3px_rgba(14,56,125,0.18),_inset_0px_2px_1px_rgba(255,255,255,0.22)] hover:bg-[#4AAE43] active:bg-[#40993A]"
            >
              {t('chat.send')}
              <Send size={12} />
            </Button>
          </div>
        </div>
      </form>

    </div>
  );
};