// src/features/chat/components/WelcomeSection.tsx
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeSectionProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function WelcomeSection({ onSuggestionClick }: WelcomeSectionProps) {
  const { t } = useLanguage();

  const suggestions = [
    t('chat.suggestions.first'),
    t('chat.suggestions.second'),
    t('chat.suggestions.third')
  ];

  return (
    <div className="flex flex-col items-center py-12 px-4 text-white">
      <div className="w-24 h-24 rounded-full bg-primary-600/10 flex items-center justify-center mb-6">
        <MessageSquare className="w-12 h-12 text-primary-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
        {t('chat.welcome.title')}
      </h1>
      
      <p className="text-slate-300 mb-8 text-center max-w-2xl">
        {t('chat.welcome.description')}
      </p>

      <div className="w-full max-w-4xl grid gap-4 md:grid-cols-3">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index}
            className="bg-slate-800/50 border-slate-700 hover:border-primary-500 transition-colors cursor-pointer"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <CardContent className="p-6">
              <p>{suggestion}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}