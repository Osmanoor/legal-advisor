import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Book, Bookmark } from 'lucide-react';
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

  // Get badge color and icon based on article type
  const getBadgeConfig = (type: string) => {
    const configs = {
      primary: { 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
        icon: FileText,
        hoverColor: 'hover:bg-blue-500/30'
      },
      secondary: { 
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', 
        icon: Book,
        hoverColor: 'hover:bg-purple-500/30'
      },
      supplementary: { 
        color: 'bg-green-500/20 text-green-400 border-green-500/30', 
        icon: Bookmark,
        hoverColor: 'hover:bg-green-500/30'
      },
      default: { 
        color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', 
        icon: FileText,
        hoverColor: 'hover:bg-slate-500/30'
      }
    };
    
    return configs[type as keyof typeof configs] || configs.default;
  };

  const badgeConfig = getBadgeConfig(resource.metadata.article_type);
  const BadgeIcon = badgeConfig.icon;

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
            <div 
              className={`
                px-2 py-1 rounded-md text-xs font-medium border 
                flex items-center gap-1 transition-colors
                ${badgeConfig.color} ${badgeConfig.hoverColor}
                ${language === 'ar' ? 'mr-auto' : 'ml-auto'}
              `}
            >
              <BadgeIcon size={14} />
              <span className="capitalize">{resource.metadata.article_type}</span>
            </div>
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