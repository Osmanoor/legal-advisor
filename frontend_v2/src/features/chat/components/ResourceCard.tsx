// src/features/chat/components/ResourceCard.tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Resource } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-primary-400" size={20} />
            <div>
              <CardTitle className="text-sm">
                {t('chat.article')} {resource.metadata.article_number}
              </CardTitle>
              <p className="text-xs text-slate-400">
                {resource.metadata.chapter_name}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {resource.metadata.article_type}
          </Badge>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium mb-1">{t('chat.content')}</h4>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {resource.content}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">{t('chat.summary')}</h4>
              <p className="text-sm text-slate-300">
                {resource.metadata.summary}
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}