// src/features/chat/components/ChatHistoryView.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatSession } from '@/types/chat';
import { HistoryItem } from './HistoryItem';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ChatHistoryViewProps {
  sessions: ChatSession[];
  isLoading: boolean;
  onSessionSelect: (sessionId: string) => void;
}

export const ChatHistoryView: React.FC<ChatHistoryViewProps> = ({ sessions, isLoading, onSessionSelect }) => {
  const { t, direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const filteredAndSortedSessions = sessions
    .filter(session => session.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    });

  if (isLoading) {
    return <div className="flex justify-center py-10"><LoadingSpinner /></div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-base font-medium text-text-on-light-muted" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {`${t('chat.historyTitle')} (${sessions.length})`}
        </h3>
        {/* Right-aligned controls wrapper */}
        <div className="flex items-center gap-3">
          {/* Search Box - First on the right */}
          <div className="relative">
            <Input
              type="text"
              placeholder={t('chat.searchHistoryPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-[266px] bg-white border-border-default shadow-sm pr-10"
              dir="rtl"
            />
            <Search size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-on-light-muted" />
          </div>
          {/* Sort By Dropdown - To the left of search */}
          <Select dir={direction} value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-[146px] bg-white border-border-default shadow-sm">
              <ListFilter size={12} className="mx-2 text-text-on-light-muted"/>
              <SelectValue placeholder={t('chat.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* History List */}
      <div className="space-y-3">
        {filteredAndSortedSessions.map(session => (
          <HistoryItem key={session.id} session={session} onClick={onSessionSelect} />
        ))}
      </div>
    </div>
  );
};