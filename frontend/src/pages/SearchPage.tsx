import React, { useState } from 'react';
import { ResourceType, Resource } from '../types/search';
import { searchResources } from '../utils/api';
import { SearchBar, TypeFilter, ResourceCard, LanguageSwitch } from '../components/search/SearchComponents';
import { Language, translations } from '../utils/translations';
import { Languages } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchPage: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
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
      // Note: We always send English type values to the API
      const apiType = selectedType as ResourceType;
      const response = await searchResources({ query: query.trim(), type: apiType });
      setResults(response.data);
    } catch (err) {
      setError(translations[language].error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link 
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-colors"
          >
            {language === 'ar' ? "مجتمع المشتريات الحكومية" : "Government Procurement Community"}
          </Link>
          <button
            onClick={() => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
          >
            <Languages size={20} />
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <h1 className="text-3xl font-bold">{translations[language].pageTitle}</h1>
        </div>

        <div className="space-y-6 mb-8">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            language={language}
          />

          <TypeFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            language={language}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {error}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {results.map((resource) => (
              <ResourceCard
                key={resource.number}
                resource={resource}
                searchQuery={query}
                language={language}
              />
            ))}
          </div>
        ) : query && (
          <div className="text-center py-8 text-gray-500" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {translations[language].noResults}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;