import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { usePermission } from '@/hooks/usePermission';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { searchablePages } from '@/config/searchablePages';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Search, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeaderSearch({ className }: { className?: string }) {
  const { t, direction } = useLanguage();
  const { canAccess } = usePermission();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const accessiblePages = useMemo(() => {
    return searchablePages.filter(page =>
      // A page with null permission is available to any authenticated user
      page.permission === null ? isAuthenticated : canAccess(page.permission)
    );
  }, [canAccess, isAuthenticated]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerCaseQuery = query.toLowerCase();
    return accessiblePages.filter(page => {
      const name = t(page.nameKey).toLowerCase();
      const keywords = t(page.keywordsKey).toLowerCase();
      return name.includes(lowerCaseQuery) || keywords.includes(lowerCaseQuery);
    });
  }, [query, accessiblePages, t]);
  
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filteredResults[activeIndex]) {
        handleNavigate(filteredResults[activeIndex].path);
      } else if (filteredResults.length > 0) {
        handleNavigate(filteredResults[0].path);
      }
    }
  };

  return (
    <Popover open={isOpen && filteredResults.length > 0} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative w-[240px]", className)}>
           <Search className={`absolute w-5 h-5 text-gray-500 top-1/2 -translate-y-1/2 ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)} // Delay to allow click on result
            onKeyDown={handleKeyDown}
            placeholder={`${t('common.search')}...`}
            className={`h-[34px] w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-cta bg-transparent ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
            style={{ fontFamily: 'var(--font-primary-latin)' }}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-1">
          {filteredResults.map((page, index) => (
            <button
              key={page.path}
              onClick={() => handleNavigate(page.path)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "w-full text-left p-2 rounded-md text-sm flex justify-between items-center",
                direction === 'rtl' ? 'text-right' : 'text-left',
                activeIndex === index ? 'bg-gray-100' : 'hover:bg-gray-100'
              )}
            >
              <span>{t(page.nameKey)}</span>
              {activeIndex === index && <CornerDownLeft className="w-4 h-4 text-gray-500" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}