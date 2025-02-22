// src/pages/SearchPage.tsx
import { useState, useCallback } from 'react';
import { useSearch } from '@/hooks/api/useSearch';
import { SearchBar } from '@/features/search/components/SearchBar';
import { SearchFilters } from '@/features/search/components/SearchFilters';
import { SearchResults } from '@/features/search/components/SearchResults';
import { ResourceType } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitch } from '@/components/common/LanguageSwitch';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner  from '@/components/ui/loading-spinner';
import { debounce } from '@/lib/utils';

export default function SearchPage() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType>();
  
  const {
    data: results,
    isLoading,
    isError,
    error,
    refetch
  } = useSearch(query, selectedType);

  // Debounce the search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce(() => {
      if (query.trim()) {
        refetch();
      }
    }, 500),
    [query, refetch]
  );

  const handleSearch = () => {
    if (query.trim()) {
      refetch();
    }
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    // Only search if the query is not empty
    if (newQuery.trim()) {
      debouncedSearch();
    }
  };

  const handleTypeChange = (type: ResourceType) => {
    setSelectedType(type);
    // If we have a query, search with the new type
    if (query.trim()) {
      refetch();
    }
  };


  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white ${
      language === 'ar' ? 'text-right' : 'text-left'
    }`}>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <SearchFilters
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
            />
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            <SearchBar
              query={query}
              onQueryChange={handleQueryChange}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {error?.message || t('common.error')}
                </AlertDescription>
              </Alert>
            ) : results?.data && results.data.length > 0 ? (
              <SearchResults
                results={results.data}
                searchQuery={query}
              />
            ) : query ? (
              <div className="text-center py-12 text-gray-400">
                {t('search.noResults')}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}