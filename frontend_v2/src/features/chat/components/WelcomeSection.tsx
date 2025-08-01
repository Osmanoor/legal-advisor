// src/features/chat/components/WelcomeSection.tsx
// This component was already internationalized. No changes were made.

import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeSectionProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onSuggestionClick }) => {
  const { t } = useLanguage();

  const suggestions = [
    t('chat.suggestions.first'),
    t('chat.suggestions.second'),
    t('chat.suggestions.third'),
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <p className="text-sm text-text-on-light-muted mb-4" style={{fontFamily: 'var(--font-primary-arabic)'}}>
        {t('chat.suggestions.title')}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {suggestions.map((suggestion, index) => (
          <Card
            key={index}
            className="p-4 md:p-6 text-right cursor-pointer hover:border-cta hover:bg-cta/5 transition-colors border-border-default"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <CardContent className="p-0">
              <p className="text-sm font-light text-text-on-light-muted" style={{fontFamily: 'var(--font-primary-arabic)', lineHeight: '150%'}}>
                {suggestion}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};