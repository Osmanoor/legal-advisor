// src/pages/SearchPage.tsx

import { useState } from 'react';
import { useSearch } from '@/hooks/api/useSearch';
import { SearchResults } from '@/features/search/components/SearchResults';
import { ResourceType } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
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
    isLoading,
    isError,
    error,
    refetch,
    isFetching, // Use isFetching for the loading state to handle refetches
  } = useSearch(searchParams.query, searchParams.type);

  // This handler is passed to the SearchTopBar.
  // It updates the state and triggers a refetch.
  const handleSearch = (newQuery: string, newType: ResourceType) => {
    // We update the state, which will be passed to the useSearch hook.
    // The refetch is triggered because the query key of useSearch will change.
    // However, calling refetch() explicitly ensures it runs immediately.
    setSearchParams({ query: newQuery, type: newType });
    trackEvent({ event: 'search', search_term: newQuery });
    // We need to use a timeout to allow React to update the state before refetching
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
              <h3 className="text-lg font-semibold">Start a Search</h3>
              <p>Enter a query in the bar above to find relevant articles.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}