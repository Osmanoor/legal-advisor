// src/features/search/components/SearchTopBar.tsx

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ResourceType } from '@/types';

interface SearchTopBarProps {
  onSearch: (query: string, type: ResourceType) => void;
  isLoading: boolean;
}

export const SearchTopBar: React.FC<SearchTopBarProps> = ({ onSearch, isLoading }) => {
  const { t, direction } = useLanguage();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ResourceType>('Both');

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query, type);
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
      <div className="flex items-center gap-2">
        <Select dir={direction} value={type} onValueChange={(value) => setType(value as ResourceType)}>
          <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200 shadow-sm">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium text-gray-500">تصفية حسب</p>
      </div>

      <div className="flex items-center gap-2 w-full max-w-md">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="المنافسة..."
          className="h-12 text-base"
          dir={direction}
        />
        <Button
          onClick={handleSearchClick}
          disabled={isLoading || !query.trim()}
          size="icon"
          className="w-12 h-12 bg-cta hover:bg-cta-hover shrink-0"
        >
          <Search className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
};