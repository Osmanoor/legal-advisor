// src/features/chat/components/ChatInputBar.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch-rtl';
import { Label } from '@/components/ui/label';
import { Send, Paperclip, Mic, Image as ImageIcon } from 'lucide-react';
import { ChatOptions } from '@/types/chat';

interface ChatInputBarProps {
  onSendMessage: (message: string, options: ChatOptions) => void;
  isLoading: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, isLoading }) => {
  const { t, direction } = useLanguage();
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<ChatOptions>({
    saudiAccent: false,
    reasoning: false, // Keep for potential future use
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

  const attachmentButtons = [
    { Icon: Paperclip, label: t('chat.actions.attachFile') || 'Attach file' }, // Added fallback for t function
    { Icon: ImageIcon, label: t('chat.actions.attachImage') || 'Attach image' }, // Added fallback for t function
    { Icon: Mic, label: t('chat.actions.useMicrophone') || 'Use microphone' }, // Added fallback for t function
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 z-10"> {/* Changed positioning and added z-index */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[654px] h-[172px] bg-white border border-[#F0F2F5] shadow-lg rounded-2xl flex flex-col pt-6 px-6 pb-4 space-y-4" // Replaced custom shadow with shadow-lg
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
                checked={options.saudiAccent}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, saudiAccent: !!checked }))}
              />
              <Label
                htmlFor="saudi-accent-switch"
                className="text-xs text-black font-normal cursor-pointer"
              >
                {t('chat.saudiAccent')}
              </Label>
            </div>
              {attachmentButtons.map(({ Icon, label }) => (
                <Button key={label} type="button" variant="ghost" size="icon" className="text-[#666F8D] hover:bg-gray-100 h-8 w-8" aria-label={label}>
                  <Icon size={16} />
                </Button>
              ))}
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