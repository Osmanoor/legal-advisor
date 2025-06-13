// src/features/tenderMapping/components/ReportRegulationsTab.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderRegulation } from '@/types/tenderMapping';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReportRegulationsTabProps {
  summaryPoints: string[];
  sources: TenderRegulation[];
}

const SourceCard: React.FC<{ source: TenderRegulation }> = ({ source }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-inputTheme-border rounded-lg">
      <div
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="text-xs font-medium text-text-on-light-body">{t('tenderMapping.results.moreDetails')}</span>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-text-on-light-strong text-right flex-1">{source.summary}</p>
          <div className="bg-cta text-white text-[10px] font-medium px-2 py-0.5 rounded">
            {source.type === 'system' ? t('tenderMapping.results.system') : t('tenderMapping.results.regulation')}
          </div>
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
                {source.content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ReportRegulationsTab: React.FC<ReportRegulationsTabProps> = ({ summaryPoints, sources }) => {
  return (
    <div className="bg-white border border-inputTheme-border rounded-2xl p-6 md:p-8 space-y-8">
      {/* Summary Points */}
      <ol className="list-decimal list-inside space-y-3 text-right text-sm text-text-on-light-body" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
        {summaryPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ol>
      
      {/* Sources Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-right" style={{ fontFamily: 'var(--font-primary-arabic)' }}>المصادر</h3>
        <div className="space-y-3">
          {sources.map(source => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </div>
    </div>
  );
};