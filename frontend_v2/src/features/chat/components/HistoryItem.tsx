// src/features/chat/components/HistoryItem.tsx

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreVertical, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/features/admin/components/Users/ConfirmationDialog';

interface HistoryItemProps {
  session: ChatSession;
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void; // Add delete handler prop
  isDeleting: boolean; // Add prop to show loading state
}

// FIX: Renamed prop to onSessionSelect for clarity
export const HistoryItem: React.FC<HistoryItemProps> = ({ session, onSessionSelect, onSessionDelete, isDeleting }) => {
  const { t, direction } = useLanguage();

  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`More options for session: ${session.id}`);
    // Delete logic will be added in a later phase
  };

  const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dateOnly.getTime() === today.getTime()) return t('chat.today');
    if (dateOnly.getTime() === yesterday.getTime()) return t('chat.yesterday');
    return date.toLocaleDateString('ar-SA', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
      <div className={`flex items-center text-text-on-light-muted flex-shrink-0 ${direction === 'rtl' ? 'flex-row-reverse gap-6' : 'gap-6'}`}>
        
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

        <div className={`hidden md:flex items-center w-20 gap-2 text-xs ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Clock size={14} />
          <span>{formatRelativeTime(session.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};