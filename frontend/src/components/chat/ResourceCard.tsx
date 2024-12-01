import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Resource } from '../../types/chat';

interface Props {
  resource: Resource;
  language: 'ar' | 'en';
}

const ResourceCard: React.FC<Props> = ({ resource, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const labels = {
    ar: {
      chapter: 'الباب',
      section: 'الفصل',
      article: 'المادة',
      summary: 'الملخص'
    },
    en: {
      chapter: 'Chapter',
      section: 'Section',
      article: 'Article',
      summary: 'Summary'
    }
  };

  // Format numbers in Arabic style for Arabic language
  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      return num.toLocaleString('ar-SA');
    }
    return num.toString();
  };

  const formattedChapter = language === 'ar'
    ? `${labels.ar.chapter} ${formatNumber(resource.metadata.chapter_number)} - ${resource.metadata.chapter_name}`
    : `${labels.en.chapter} ${resource.metadata.chapter_number} - ${resource.metadata.chapter_name}`;

  const formattedSection = resource.metadata.section_name && language === 'ar'
    ? `${labels.ar.section} ${formatNumber(resource.metadata.section_number)} - ${resource.metadata.section_name}`
    : resource.metadata.section_name
      ? `${labels.en.section} ${resource.metadata.section_number} - ${resource.metadata.section_name}`
      : '';

  return (
    <div className="border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Metadata Section */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300 unicode-bidi-override">
              {`${labels[language].article} ${formatNumber(resource.metadata.article_number)}`}
            </span>
          </div>
          <div className="flex flex-col gap-1 mt-1 text-sm text-slate-400">
            <span className="unicode-bidi-override">{formattedChapter}</span>
            {formattedSection && <span className="unicode-bidi-override">{formattedSection}</span>}
          </div>
        </div>

        {/* Summary Section */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <span className="text-sm font-medium text-slate-300 mb-1 block">
              {`${labels[language].summary}\u200F:`}
            </span>
            <p className="text-white unicode-bidi-override">
              {resource.metadata.summary}
            </p>
          </div>
          <div className={language === 'ar' ? 'mr-2' : 'ml-2'}>
            {isExpanded ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content Section */}
      {isExpanded && (
        <div 
          className="px-4 pb-4 border-t border-slate-700 pt-4"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <p className="text-white whitespace-pre-wrap unicode-bidi-override">
            {resource.content}
          </p>
        </div>
      )}

    </div>
  );
};

export default ResourceCard;