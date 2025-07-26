// src/features/chat/components/MessageBubble.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast'; // Import useToast
import { ChatMessage } from '@/types';
import { ResourceCard } from './ResourceCard';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react'; // Keep only the Copy icon
import UserAvatar from '/public/images/avatars/avatar1.png';
import AssistantAvatar from '/public/images/avatars/assistant-avatar.png';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const { showToast } = useToast(); // Initialize toast hook
  const isUser = message.role === 'user';

  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCopy = () => {
    // Start with the main message content
    let textToCopy = message.content;

    // Append resources if they exist
    if (message.resources && message.resources.length > 0) {
      const resourcesText = message.resources.map(resource => {
        return (
          `\n\n--- ${t('chat.sources')}: ${t('chat.article')} ${resource.metadata.article_number} ---\n` +
          `${t('chat.chapter')}: ${resource.metadata.chapter_name}\n` +
          `${t('chat.content')}:\n${resource.content}`
        );
      }).join('');
      textToCopy += resourcesText;
    }

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(textToCopy);
    showToast(t('correction.copiedToClipboard'), 'success'); // Show success message
  };

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-start">
        <img src={user?.profile_picture_url || UserAvatar} alt="User Avatar" className="w-6 h-6 rounded-full mt-8" />
        <div className="flex flex-col items-start max-w-[80%]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-text-on-light-strong">You</span>
            <span className="inline-block w-px h-4 bg-gray-300 mx-2"></span>
            <span className="text-xs text-text-on-light-muted">{formatTimestamp(message.timestamp)}</span>
          </div>
          <p className="bg-white border border-border-default rounded-xl rounded-br-none p-4 text-sm text-text-on-light-muted text-right">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex items-start gap-3">
      <img src={AssistantAvatar} alt="Assistant Avatar" className="w-6 h-6 rounded-full mt-8" />
      <div className="flex-1 max-w-[80%] bg-white border border-border-default rounded-xl rounded-bl-none p-4 md:p-6">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2 w-full justify-start">
            <span className="text-sm font-medium text-text-on-light-strong">{t('landingPage.solutions.aiAssistant.title')}</span>
            <span className="inline-block w-px h-4 bg-gray-300 mx-2"></span>
            <span className="text-xs text-text-on-light-muted">{formatTimestamp(message.timestamp)}</span>
          </div>
          <p className="w-full text-sm text-text-on-light-muted text-right whitespace-pre-wrap">
            {message.content}
          </p>
          
          {message.resources && message.resources.length > 0 && (
            <div className="w-full space-y-2 mt-4">
              {message.resources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          )}
          
          {/* --- FIX: Render only the Copy button with the new handler --- */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-default w-full justify-start">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-text-on-light-muted h-7 w-7" 
              aria-label={t('chat.copy')}
              onClick={handleCopy}
            >
              <Copy size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};