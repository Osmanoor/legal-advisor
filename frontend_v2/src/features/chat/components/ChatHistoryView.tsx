// src/features/chat/components/ChatHistoryView.tsx

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { HistoryItem } from './HistoryItem';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useChat } from '@/hooks/api/useChat';
import { useToast } from '@/hooks/useToast';

interface ChatHistoryViewProps {
  onSessionSelect: (sessionId: string) => void;
}

export const ChatHistoryView: React.FC<ChatHistoryViewProps> = ({ onSessionSelect }) => {
  const { t, direction } = useLanguage();
  const { showToast } = useToast();
  const { useChatSessions, deleteSessionMutation } = useChat();
  const { data: sessions, isLoading } = useChatSessions();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const filteredAndSortedSessions = useMemo(() => {
    if (!sessions) return [];
    
    return [...sessions]
      .filter(session => session.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      });
  }, [sessions, searchTerm, sortBy]);

  const handleSessionDelete = (sessionId: string) => {
    deleteSessionMutation.mutate(sessionId, {
        onSuccess: () => {
            showToast("Chat session deleted.", "success");
        },
        onError: (error) => {
            showToast(`Failed to delete session: ${error.message}`, "error");
        }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><LoadingSpinner /></div>;
  }

  return (
    <div className="w-full md:max-w-4xl mx-auto space-y-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-base font-medium text-text-on-light-muted" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {`${t('chat.historyTitle')} (${sessions?.length || 0})`}
        </h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Input
              type="text"
              placeholder={t('chat.searchHistoryPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full sm:w-[266px] bg-white border-border-default shadow-sm pr-10"
              dir="rtl"
            />
            <Search size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-on-light-muted" />
          </div>
          <Select dir={direction} value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-auto sm:w-[146px] bg-white border-border-default shadow-sm">
              <div className="flex items-center gap-2 w-full">
                <ListFilter size={12} className="text-text-on-light-muted"/>
                <SelectValue placeholder={t('chat.sortBy')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredAndSortedSessions.map(session => (
          <HistoryItem 
            key={session.id} 
            session={session} 
            onSessionSelect={onSessionSelect}
            onSessionDelete={handleSessionDelete}
            isDeleting={deleteSessionMutation.isPending && deleteSessionMutation.variables === session.id}
          />
        ))}
      </div>
    </div>
  );
};