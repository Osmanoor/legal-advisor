// src/features/search/components/SearchResults.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import type { SearchResource } from "@/types";

interface SearchResultsProps {
  results: SearchResource[];
  searchQuery: string;
}

export function SearchResults({ results, searchQuery }: SearchResultsProps) {
  const { t, direction } = useLanguage();

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
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

  return (
    <div className="space-y-6">
      {results.map((resource) => (
        <Card key={resource.number}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>
                  {t('search.article')} {resource.number}
                </CardTitle>
                <CardDescription>
                  {t('search.chapter')} {resource.chapter.number}: {resource.chapter.name}
                  <br />
                  {t('search.section')} {resource.section.number}: {resource.section.name}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {resource.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{t('search.content')}</h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {highlightText(resource.content, searchQuery)}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">{t('search.summary')}</h4>
              <p className="text-gray-600">
                {highlightText(resource.summary, searchQuery)}
              </p>
            </div>
            
            {resource.keywords.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{t('search.keywords')}</h4>
                <div className="flex flex-wrap gap-2">
                  {resource.keywords.map((keyword) => (
                    <Badge 
                      key={`${resource.number}-keyword-${keyword}`} 
                      variant="outline"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {resource.references.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{t('search.references')}</h4>
                <div className="flex flex-wrap gap-2">
                  {resource.references.map((ref) => (
                    <Badge 
                      key={`${resource.number}-ref-${ref}`} 
                      variant="outline"
                    >
                      #{ref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}