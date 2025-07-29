// src/pages/SearchPage.tsx
// Updated for i18n

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSearch } from '@/hooks/api/useSearch';
import { SearchResults } from '@/features/search/components/SearchResults';
import { ResourceType } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { SearchTopBar } from '@/features/search/components/SearchTopBar';
import { trackEvent } from '@/lib/analytics';

export default function SearchPage() {
  const { t } = useLanguage();
  
  const [searchParams, setSearchParams] = useState({ query: '', type: 'Both' as ResourceType });
  
  const {
    data: results,
    isError,
    error,
    refetch,
    isFetching,
  } = useSearch(searchParams.query, searchParams.type);

  const handleSearch = (newQuery: string, newType: ResourceType) => {
    setSearchParams({ query: newQuery, type: newType });
    trackEvent({ event: 'search', search_term: newQuery });
    setTimeout(() => {
        refetch();
    }, 0);
  };

  return (
    <div className="h-full flex flex-col bg-background-body">
      
      <SearchTopBar onSearch={handleSearch} isLoading={isFetching} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {isFetching ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error?.message || t('common.error')}</AlertDescription>
            </Alert>
          ) : results?.data && results.data.length > 0 ? (
            <SearchResults
              results={results.data}
              searchQuery={searchParams.query}
            />
          ) : searchParams.query ? (
            <div className="text-center py-20 text-gray-500">
              <h3 className="text-lg font-semibold">{t('search.noResults')}</h3>
              <p>{t('search.tryAgain')}</p>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <h3 className="text-lg font-semibold">{t('search.startSearchPrompt.title')}</h3>
              <p>{t('search.startSearchPrompt.description')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}