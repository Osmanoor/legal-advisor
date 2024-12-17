import React from 'react';
import { ResourceType, Resource } from '../../types/search';
import { Language, translations } from '../../utils/translations';

export const LanguageSwitch: React.FC<{
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}> = ({ currentLanguage, onLanguageChange }) => (
  <button
    onClick={() => onLanguageChange(currentLanguage === 'en' ? 'ar' : 'en')}
    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
  >
    {translations[currentLanguage][currentLanguage === 'en' ? 'switchToArabic' : 'switchToEnglish']}
  </button>
);

export const SearchBar: React.FC<{
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  language: Language;
}> = ({ query, onQueryChange, onSearch, language }) => (
  <div className="flex gap-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <input
      type="text"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder={translations[language].searchPlaceholder}
      className="flex-1 px-4 py-2 border rounded-lg bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onKeyDown={(e) => e.key === 'Enter' && onSearch()}
    />
    <button
      onClick={onSearch}
      className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {translations[language].searchButton}
    </button>
  </div>
);

export const TypeFilter: React.FC<{
  selectedType?: ResourceType;
  onTypeChange: (type?: ResourceType) => void;
  language: Language;
}> = ({ selectedType, onTypeChange, language }) => (
  <div className="flex gap-4 items-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <span className="font-medium">{translations[language].filterByType}</span>
    <div className="flex gap-4">
      {(['Both', 'System', 'Regulation'] as const).map((type) => (
        <label key={type} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="type"
            checked={selectedType === type}
            onChange={() => onTypeChange(type)}
            className="w-4 h-4 text-blue-600"
          />
          <span>{translations[language].typeOptions[type]}</span>
        </label>
      ))}
    </div>
  </div>
);

const HighlightedText: React.FC<{
  text: string;
  query: string;
}> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => (
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 rounded px-1">{part}</mark>
        ) : part
      ))}
    </>
  );
};

export const ResourceCard: React.FC<{
  resource: Resource;
  searchQuery: string;
  language: Language;
}> = ({ resource, searchQuery, language }) => (
  <div className="p-6 border rounded-lg shadow-sm transition-shadow bg-slate-700/50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold">#{resource.number}</h3>
        <p className="text-sm text-gray-400">
          {resource.chapter.name} - {resource.section.name}
        </p>
      </div>
      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
        {resource.type}
      </span>
    </div>
    
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">{translations[language].content}</h4>
        <p className="text-gray-300 whitespace-pre-wrap">
          <HighlightedText text={resource.content} query={searchQuery} />
        </p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">{translations[language].summary}</h4>
        <p className="text-gray-300">
          <HighlightedText text={resource.summary} query={searchQuery} />
        </p>
      </div>
      
      {resource.keywords.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">{translations[language].keywords}</h4>
          <div className="flex flex-wrap gap-2">
            {resource.keywords.map((keyword) => (
              <span key={keyword} className="px-2 py-1 text-sm bg-gray-600 rounded">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {resource.references.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">{translations[language].references}</h4>
          <div className="flex flex-wrap gap-2">
            {resource.references.map((ref) => (
              <span key={ref} className="px-2 py-1 text-sm bg-gray-600 rounded">
                #{ref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);