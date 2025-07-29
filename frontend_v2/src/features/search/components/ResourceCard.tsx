// src/features/search/components/ResourceCard.tsx
// Updated for i18n

import React, { useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import type { SearchResource } from '@/types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Loader2 } from 'lucide-react';

interface ResourceCardProps {
  resource: SearchResource;
  searchQuery: string;
}

export function ResourceCard({ resource, searchQuery }: ResourceCardProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
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

  const handleCopy = () => {
    const fullText = `
${t('search.article')} ${resource.number}
${t('search.chapter')} ${resource.chapter.number}: ${resource.chapter.name}
${t('search.section')} ${resource.section.number}: ${resource.section.name}

${t('search.content')}:
${resource.content}

${t('search.summary')}:
${resource.summary}
    `.trim();
    navigator.clipboard.writeText(fullText);
    showToast(t('correction.copiedToClipboard'), "success");
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    cardRef.current.classList.add('is-sharing-mode');

    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 2 });
      if (!blob) throw new Error("Could not generate image.");
      const file = new File([blob], `article-${resource.number}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${t('search.article')} ${resource.number}`,
          text: `From Government Procurement Network: ${resource.chapter.name}`,
        });
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `article-${resource.number}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        showToast(t('common.downloading'), "success");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') { 
        console.error('Sharing failed:', error);
        showToast(t('common.error'), "error");
      }
    } finally {
      cardRef.current.classList.remove('is-sharing-mode');
      setIsSharing(false);
    }
  };

  return (
    <div ref={cardRef} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex justify-end mb-4">
        <Badge className="bg-cta/10 text-cta font-medium border-cta/20">
          {(resource.type?.toLowerCase() === 'regulation' || resource.type === 'اللائحة') 
            ? t('search.types.regulation') 
            : t('search.types.system')}
        </Badge>
      </div>
      
      <div className="text-right space-y-4">
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

        <div>
          <h3 className="font-bold text-md mb-2" style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('search.content')}:</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 300}}>
            {highlightText(resource.content, searchQuery)}
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-md mb-2" style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('search.summary')}:</h3>
          <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 300}}>
            {highlightText(resource.summary, searchQuery)}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 h-8 w-8" onClick={handleCopy} aria-label={t('chat.copy')}><Copy size={16} /></Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 h-8 w-8" onClick={handleShare} disabled={isSharing} aria-label={t('chat.share')}>
              {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
            </Button>
        </div>
      </div>
    </div>
  );
}