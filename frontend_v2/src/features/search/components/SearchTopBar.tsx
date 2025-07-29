// src/features/search/components/SearchTopBar.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter } from 'lucide-react';
import { ResourceType } from '@/types';

interface SearchTopBarProps {
  onSearch: (query: string, type: ResourceType) => void;
  isLoading: boolean;
}

export const SearchTopBar: React.FC<SearchTopBarProps> = ({ onSearch, isLoading }) => {
  const { t, direction } = useLanguage();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ResourceType | undefined>(undefined);

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query, type || 'Both');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const filterOptions = [
    { value: 'Both', labelKey: 'search.types.both' },
    { value: 'System', labelKey: 'search.types.system' },
    { value: 'Regulation', labelKey: 'search.types.regulation' },
  ];

  return (
    <div className="flex justify-between items-center w-full h-[90px] border-b border-gray-200 px-6 bg-white shrink-0">
      <div className="flex items-center gap-2 w-full max-w-xl">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('search.topBarPlaceholder')}
          className="h-12 text-base w-full"
          dir={direction}
        />
        <Button
          onClick={handleSearchClick}
          disabled={isLoading || !query.trim()}
          size="icon"
          className="w-12 h-12 bg-cta hover:bg-cta-hover shrink-0"
          aria-label={t('common.search')}
        >
          <Search className="h-6 w-6 text-white" />
        </Button>
      </div>

      <div className="flex items-center">
        <Select dir={direction} value={type} onValueChange={(value) => setType(value as ResourceType)}>
          <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200 shadow-sm text-gray-700 font-medium">
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-gray-600" />
              <SelectValue placeholder={t('search.filterPlaceholder')} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};