// src/features/chat/components/ResourceCard.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Resource } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-border-default rounded-lg text-black">
      <div
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold text-text-on-light-body" style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('chat.article')} {resource.metadata.article_number}
          </span>
          <span className="text-[10px] text-text-on-light-muted">{resource.metadata.chapter_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-cta text-white text-[10px] font-medium px-2 py-0.5 rounded">
            {t('chat.sources')}
          </div>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-border-default">
              <p className="text-xs text-text-on-light-muted whitespace-pre-wrap pt-2 text-right">
                {resource.content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};