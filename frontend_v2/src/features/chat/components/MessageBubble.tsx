// src/features/chat/components/MessageBubble.tsx
import { ChatMessage } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { ResourceCard } from './ResourceCard';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { t, direction } = useLanguage();
  const isUser = message.role === 'user';

  return (
    <div className={`max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      <Card className={`
        ${isUser 
          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0' 
          : 'bg-slate-800/50 border-slate-700'
        }
      `}>
        <CardContent className="p-4">
          <p className="whitespace-pre-wrap">
            {message.content}
          </p>
          
          {message.resources && message.resources.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm text-slate-300">
                {t('chat.sources')}:
              </h4>
              <div className="space-y-2">
                {message.resources.map((resource, index) => (
                  <ResourceCard
                    key={index}
                    resource={resource}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-slate-400 mt-2">
            {new Date(message.timestamp).toLocaleTimeString(
              direction === 'rtl' ? 'ar-SA' : 'en-US'
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}