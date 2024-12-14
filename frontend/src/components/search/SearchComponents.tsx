import React from 'react';
import { ResourceType, Resource } from '../../types/search';

export const SearchBar: React.FC<{
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}> = ({ query, onQueryChange, onSearch }) => (
  <div className="flex gap-2">
    <input
      type="text"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Enter search keywords..."
      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      onKeyDown={(e) => e.key === 'Enter' && onSearch()}
    />
    <button
      onClick={onSearch}
      className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Search
    </button>
  </div>
);

export const TypeFilter: React.FC<{
  selectedType?: ResourceType;
  onTypeChange: (type?: ResourceType) => void;
}> = ({ selectedType, onTypeChange }) => (
  <div className="flex gap-4 items-center">
    <span className="font-medium">Filter by type:</span>
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
          <span>{type}</span>
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
}> = ({ resource, searchQuery }) => (
  <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold">#{resource.number}</h3>
        <p className="text-sm text-gray-600">
          {resource.chapter.name} - {resource.section.name}
        </p>
      </div>
      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
        {resource.type}
      </span>
    </div>
    
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Content:</h4>
        <p className="text-gray-700 whitespace-pre-wrap">
          <HighlightedText text={resource.content} query={searchQuery} />
        </p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Summary:</h4>
        <p className="text-gray-700">
          <HighlightedText text={resource.summary} query={searchQuery} />
        </p>
      </div>
      
      {resource.keywords.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Keywords:</h4>
          <div className="flex flex-wrap gap-2">
            {resource.keywords.map((keyword) => (
              <span key={keyword} className="px-2 py-1 text-sm bg-gray-100 rounded">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {resource.references.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">References:</h4>
          <div className="flex flex-wrap gap-2">
            {resource.references.map((ref) => (
              <span key={ref} className="px-2 py-1 text-sm bg-gray-100 rounded">
                #{ref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);