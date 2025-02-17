// src/features/chat/components/LoadingIndicator.tsx
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/loading-spinner';

export function LoadingIndicator() {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-[80%] mx-auto">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4 flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          <span>{t('chat.loading')}</span>
        </CardContent>
      </Card>
    </div>
  );
}