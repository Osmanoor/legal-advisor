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
    { Icon: Paperclip, label: 'Attach file' },
    { Icon: ImageIcon, label: 'Attach image' },
    { Icon: Mic, label: 'Use microphone' },
  ];

  return (
    <div className="bg-background-body p-4 md:p-6 border-t border-border-default">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          className="w-full min-h-[68px] max-h-[200px] bg-white border border-border-default rounded-2xl shadow-sm p-4 text-right resize-none"
          dir="rtl"
        />
        <div className="flex justify-between items-center">
          {/* Right Side Actions (Visually) */}
          <div className={`flex items-center gap-4 ${direction === 'rtl' ? 'order-1' : 'order-2'}`}>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-8 px-4 gap-2 text-xs"
            >
              <Send size={12} />
              {t('chat.send')}
            </Button>
          </div>
          
          {/* Left Side Actions (Visually) */}
          <div className={`flex items-center gap-4 ${direction === 'rtl' ? 'order-2' : 'order-1'}`}>
            <div className="flex items-center gap-3">
              {attachmentButtons.map(({ Icon, label }) => (
                <Button key={label} type="button" variant="ghost" size="icon" className="text-text-on-light-muted h-8 w-8" aria-label={label}>
                  <Icon size={16} />
                </Button>
              ))}
            </div>
            <div className="w-px h-5 bg-border-default"></div>
            <div className="flex items-center gap-2">
              <Switch
                id="saudi-accent-switch"
                checked={options.saudiAccent}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, saudiAccent: !!checked }))}
              />
              <Label htmlFor="saudi-accent-switch" className="text-xs font-normal text-text-on-light-muted" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                {t('chat.saudiAccent')}
              </Label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};