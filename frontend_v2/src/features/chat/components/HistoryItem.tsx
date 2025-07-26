// src/features/chat/components/HistoryItem.tsx

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreVertical, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/features/admin/components/Users/ConfirmationDialog';
import { DateTime } from 'luxon'; // <-- IMPORT LUXON

interface HistoryItemProps {
  session: ChatSession;
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  isDeleting: boolean;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ session, onSessionSelect, onSessionDelete, isDeleting }) => {
  const { t, direction } = useLanguage();

  const formatRelativeTime = (isoString: string): string => {
    // --- FIX: Use Luxon for robust date parsing ---
    const date = DateTime.fromISO(isoString);
    if (!date.isValid) {
      // Fallback for any unexpected invalid date format
      return "---"; 
    }

    const now = DateTime.now();
    const today = now.startOf('day');
    const yesterday = now.minus({ days: 1 }).startOf('day');

    if (date >= today) {
      return t('chat.today');
    }
    if (date >= yesterday) {
      return t('chat.yesterday');
    }
    // Convert Luxon object to JS Date for locale-specific formatting
    return date.toJSDate().toLocaleDateString('ar-SA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    // --- END FIX ---
  };

  return (
    <div
      onClick={() => onSessionSelect(session.id)}
      className="flex justify-between items-center p-3 md:p-4 bg-white border border-border-default rounded-lg shadow-sm hover:border-cta hover:bg-cta/5 transition-all cursor-pointer"
    >
      {/* Title (Takes up remaining space) */}
      <div className="flex-grow flex flex-col items-start text-right overflow-hidden mr-2">
        <p className="w-full text-xs md:text-sm font-light text-text-on-light-strong truncate" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {session.title}
        </p>
      </div>

      {/* Right side container for metadata and actions */}
      <div className={`flex items-center text-text-on-light-muted flex-shrink-0 ${direction === 'rtl' ? ' gap-4 md:gap-6' : 'flex-row-reverse gap-4 md:gap-6'}`}>
        
        {/* Date */}
        <div className={`hidden md:flex items-center w-24 gap-2 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Clock size={14} />
          <span>{formatRelativeTime(session.updated_at)}</span>
        </div>
        
        {/* Message Count */}
        <div className={`hidden md:flex items-center w-20 gap-2 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <MessageSquare size={14} />
          <span>{session.questionCount} {session.questionCount > 1 ? t('chat.questionsCount') : t('chat.questionCount')}</span>
        </div>

        {/* Options Popover */}
        <Popover onOpenChange={(open) => { if (open) { /* stop propagation if needed */ }}}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreVertical size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40" onClick={(e) => e.stopPropagation()}>
            <ConfirmationDialog
                trigger={
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" disabled={isDeleting}>
                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                    </Button>
                }
                title="Delete Chat Session"
                description={`Are you sure you want to permanently delete "${session.title}"? This action cannot be undone.`}
                onConfirm={() => onSessionDelete(session.id)}
                confirmText="Yes, Delete"
                isConfirming={isDeleting}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};