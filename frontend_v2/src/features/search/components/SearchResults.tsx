// src/features/search/components/SearchResults.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import type { SearchResource } from "@/types";
import { RotateCw, Share2, Copy, Bookmark, MoreVertical } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResource[];
  searchQuery: string;
}

export function SearchResults({ results, searchQuery }: SearchResultsProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    // Escape special regex characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => (
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-green-100 text-green-800 rounded px-1 py-0.5">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        ))}
      </>
    );
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast("Content copied to clipboard!", "success");
  };

  return (
    <div className="space-y-6">
      {results.map((resource) => (
        <div key={resource.number} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          
          <div className="flex justify-end mb-4">
            <Badge className="bg-cta/10 text-cta font-medium border-cta/20">
              {resource.type === 'Regulation' ? 'اللائحة' : 'النظام'}
            </Badge>
          </div>
          
          <div className="text-right space-y-4">
            {/* Title and Hierarchy */}
            <div>
                <h2 className="text-xl font-bold mb-1" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                    {t('search.article')} {resource.number}
                </h2>
                <p className="text-sm text-gray-500" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                    {t('search.chapter')} {resource.chapter.number}: {resource.chapter.name}
                </p>
                <p className="text-sm text-gray-500" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                    {t('search.section')} {resource.section.number}: {resource.section.name}
                </p>
            </div>

            {/* Content */}
            <div>
              <h3 className="font-bold text-md mb-2" style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('search.content')}:</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 300}}>
                {highlightText(resource.content, searchQuery)}
              </p>
            </div>
            
            {/* Summary */}
            <div>
              <h3 className="font-bold text-md mb-2" style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('search.summary')}:</h3>
              <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 300}}>
                {highlightText(resource.summary, searchQuery)}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 h-8 w-8"><RotateCw size={16} /></Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 h-8 w-8" onClick={() => handleCopy(resource.content)}><Copy size={16} /></Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 h-8 w-8"><Share2 size={16} /></Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 h-8 w-8"><Bookmark size={16} /></Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 h-8 w-8"><MoreVertical size={16} /></Button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}