// src/features/chat/components/HistoryItem.tsx
// Updated for i18n

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreVertical, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/features/admin/components/Users/ConfirmationDialog';
import { DateTime } from 'luxon';

interface HistoryItemProps {
  session: ChatSession;
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  isDeleting: boolean;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ session, onSessionSelect, onSessionDelete, isDeleting }) => {
  const { t, direction } = useLanguage();

  const formatRelativeTime = (isoString: string): string => {
    const date = DateTime.fromISO(isoString);
    if (!date.isValid) return "---"; 
    const now = DateTime.now();
    const today = now.startOf('day');
    const yesterday = now.minus({ days: 1 }).startOf('day');
    if (date >= today) return t('chat.today');
    if (date >= yesterday) return t('chat.yesterday');
    return date.toJSDate().toLocaleDateString('ar-SA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div
      onClick={() => onSessionSelect(session.id)}
      className="flex justify-between items-center p-3 md:p-4 bg-white border border-border-default rounded-lg shadow-sm hover:border-cta hover:bg-cta/5 transition-all cursor-pointer"
    >
      <div className="flex-grow flex flex-col items-start text-right overflow-hidden mr-2">
        <p className="w-full text-xs md:text-sm font-light text-text-on-light-strong truncate" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {session.title}
        </p>
      </div>

      <div className={`flex items-center text-text-on-light-muted flex-shrink-0 ${direction === 'rtl' ? ' gap-4 md:gap-6' : 'flex-row-reverse gap-4 md:gap-6'}`}>
        <div className={`hidden md:flex items-center w-24 gap-2 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Clock size={14} />
          <span>{formatRelativeTime(session.updated_at)}</span>
        </div>
        
        <div className={`hidden md:flex items-center w-20 gap-2 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <MessageSquare size={14} />
          <span>{session.questionCount} {session.questionCount > 1 ? t('chat.questionsCount') : t('chat.questionCount')}</span>
        </div>

        <Popover onOpenChange={(open) => {}}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreVertical size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40" onClick={(e) => e.stopPropagation()}>
            <ConfirmationDialog
                trigger={
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" disabled={isDeleting}>
                        <Trash2 className="mr-2 h-4 w-4"/> {t('common.delete')}
                    </Button>
                }
                title={t('chat.deleteSessionTitle')}
                description={t('chat.deleteSessionDescription', { title: session.title })}
                onConfirm={() => onSessionDelete(session.id)}
                confirmText={t('chat.deleteConfirm')}
                isConfirming={isDeleting}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};