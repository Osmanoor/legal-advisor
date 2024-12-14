import React, { useState } from 'react';
import { ResourceType, Resource } from '../types/search';
import { searchResources } from '../utils/api';
import { SearchBar, TypeFilter, ResourceCard } from '../components/search/SearchComponents';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType>();
  const [results, setResults] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await searchResources({ query: query.trim(), type: selectedType });
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Resources</h1>
      
      <div className="space-y-6 mb-8">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />
        
        <TypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {results.map((resource) => (
            <ResourceCard
              key={resource.number}
              resource={resource}
              searchQuery={query}
            />
          ))}
        </div>
      ) : query && (
        <div className="text-center py-8 text-gray-500">
          No results found for your search.
        </div>
      )}
    </div>
  );
};

export default SearchPage;