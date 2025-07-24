// src/features/search/components/SearchResults.tsx

import type { SearchResource } from "@/types";
import { ResourceCard } from './ResourceCard'; // Import the new component

interface SearchResultsProps {
  results: SearchResource[];
  searchQuery: string;
}

export function SearchResults({ results, searchQuery }: SearchResultsProps) {
  // The logic for rendering and handling actions for each card
  // has been moved to the ResourceCard component.

  return (
    <div className="space-y-6">
      {results.map((resource) => (
        <ResourceCard 
          key={resource.number} 
          resource={resource}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}