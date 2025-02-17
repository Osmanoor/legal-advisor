// src/features/chat/components/ChatInterface.tsx
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatMessage, ChatOptions } from '@/types';
import { MessageBubble } from './MessageBubble';
import { LoadingIndicator } from './LoadingIndicator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, options: ChatOptions) => void;
  isLoading: boolean;
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading 
}: ChatInterfaceProps) {
  const { t, direction } = useLanguage();
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<ChatOptions>({
    saudiAccent: false,
    reasoning: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formHeight, setFormHeight] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input, options);
      setInput('');
    }
  };

  // Update form height when content changes
  useEffect(() => {
    const updateFormHeight = () => {
      if (formRef.current) {
        setFormHeight(formRef.current.offsetHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateFormHeight);
    if (formRef.current) {
      resizeObserver.observe(formRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative h-screen flex justify-center">
      <div
        className="absolute top-0 bottom-0 w-full max-w-3xl mx-auto overflow-y-auto px-4 md:px-0"
        style={{
          paddingBottom: `${formHeight + 16}px`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="space-y-4 py-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
            />
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900/95 backdrop-blur-sm"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="saudiAccent"
                checked={options.saudiAccent}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, saudiAccent: checked as boolean }))
                }
              />
              <Label htmlFor="saudiAccent">{t('chat.saudiAccent')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="reasoning"
                checked={options.reasoning}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, reasoning: checked as boolean }))
                }
              />
              <Label htmlFor="reasoning">{t('chat.reasoning')}</Label>
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="min-h-[80px] pr-[100px]"
              dir={direction}
            />
            <Button
              type="submit"
              className="absolute bottom-2 right-2"
              disabled={isLoading || !input.trim()}
            >
              <Send className="mr-2 h-4 w-4" />
              {t('chat.send')}
            </Button>
          </div>
        </div>
      </form>

      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}