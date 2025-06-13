// src/features/chat/components/HistoryItem.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { MoreVertical, MessageSquare, Clock } from 'lucide-react';

interface HistoryItemProps {
  session: ChatSession;
  onClick: (sessionId: string) => void;
}

const formatRelativeTime = (isoString: string, t: (key: string) => string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateOnly.getTime() === today.getTime()) {
    return t('chat.today');
  }
  if (dateOnly.getTime() === yesterday.getTime()) {
    return t('chat.yesterday');
  }
  return date.toLocaleDateString('ar-SA', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const HistoryItem: React.FC<HistoryItemProps> = ({ session, onClick }) => {
  const { t } = useLanguage();

  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main onClick from firing
    console.log(`More options for session: ${session.id}`);
    // Placeholder for dropdown menu logic
  };

  return (
    <div
    onClick={() => onClick(session.id)}
    className="flex flex-row-reverse items-center p-4 bg-white border border-border-default rounded-lg shadow-sm hover:border-cta hover:bg-cta/5 transition-all cursor-pointer"
  >
    {/* Options (left in RTL) */}
    <div className="flex flex-row-reverse items-center gap-4 text-text-on-light-muted flex-shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleMoreOptionsClick}
      >
        <MoreVertical size={16} />
      </Button>
      <div className="flex items-center gap-2 text-xs">
        <Clock size={14} />
        <span>{session.questionCount}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <MessageSquare size={14} />
        <span>{formatRelativeTime(session.lastUpdated, t)}</span>
      </div>
    </div>
  
    {/* Title (right in RTL) */}
    <div className="flex-grow text-right px-4">
      <p className="text-sm font-light text-text-on-light-strong truncate" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
        {session.title}
      </p>
    </div>
  </div>
  
  );
};