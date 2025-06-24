// File: src/features/chat/components/HistoryItem.tsx

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

  if (dateOnly.getTime() === today.getTime()) return t('chat.today');
  if (dateOnly.getTime() === yesterday.getTime()) return t('chat.yesterday');
  return date.toLocaleDateString('ar-SA', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const HistoryItem: React.FC<HistoryItemProps> = ({ session, onClick }) => {
  const { t, direction } = useLanguage();

  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`More options for session: ${session.id}`);
  };

  return (
    <div
      onClick={() => onClick(session.id)}
      className="flex justify-between items-center p-3 md:p-4 bg-white border border-border-default rounded-lg shadow-sm hover:border-cta hover:bg-cta/5 transition-all cursor-pointer"
    >
      {/* Block 1: Title and Mobile Metadata */}
      <div className="flex-grow flex flex-col items-start text-right overflow-hidden mr-2">
        {/* Title */}
        <p className="w-full text-xs md:text-sm font-light text-text-on-light-strong truncate" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {session.title}
        </p>
        
        {/* Mobile-only Metadata (hidden on medium screens and up) */}
        <div className={`md:hidden flex items-center gap-3 mt-1.5 text-text-on-light-muted ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-1 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Clock size={12} />
            <span>{session.questionCount}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <MessageSquare size={12} />
            <span>{formatRelativeTime(session.lastUpdated, t)}</span>
          </div>
        </div>
      </div>

      {/* Block 2: Options Button and Desktop Metadata */}
      <div className={`flex items-center text-text-on-light-muted flex-shrink-0 ${direction === 'rtl' ? 'flex-row-reverse gap-6' : 'gap-6'}`}>
        
        {/* More Options Button (always visible) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleMoreOptionsClick}
        >
          <MoreVertical size={16} />
        </Button>
        
        {/* Desktop-only Metadata (hidden by default, shown on medium screens and up) */}
        <div className={`hidden md:flex items-center gap-2 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Clock size={14} />
          <span>{session.questionCount}</span>
        </div>
        <div className={`hidden md:flex items-center w-20 gap-2 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <MessageSquare size={14} />
          <span>{formatRelativeTime(session.lastUpdated, t)}</span>
        </div>
      </div>
    </div>
  );
};