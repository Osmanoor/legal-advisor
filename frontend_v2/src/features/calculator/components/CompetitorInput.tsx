// src/features/calculator/components/CompetitorInput.tsx
// Updated for i18n

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Competitor } from '@/types/calculator';
import { cn } from '@/lib/utils';

interface CompetitorInputProps {
  competitor: Competitor;
  index: number;
  onUpdate: (id: number, field: keyof Omit<Competitor, 'id'>, value: string) => void;
  onRemove: (id: number) => void;
  isFirst: boolean;
  separatorLabel: string;
}

const FormSeparatorWithLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 my-4">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="text-sm text-gray-500">{label}</span>
        <div className="flex-1 border-t border-gray-200"></div>
    </div>
);

export const CompetitorInput: React.FC<CompetitorInputProps> = ({ competitor, index, onUpdate, onRemove, isFirst, separatorLabel }) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      {!isFirst && <FormSeparatorWithLabel label={separatorLabel} />}

      <div className="flex items-end gap-4">
        <div className={cn("flex-1 space-y-2 text-right", !isFirst && "w-[calc(100%-44px)]")}>
          <Label htmlFor={`name-${competitor.id}`}>{t('calculator.weighted.competitorName')}</Label>
          <Input 
            id={`name-${competitor.id}`} 
            value={competitor.name} 
            onChange={(e) => onUpdate(competitor.id, 'name', e.target.value)}
            placeholder={t('calculator.weighted.competitorPlaceholder')}
          />
        </div>
        {!isFirst && (
          <Button variant="outline" size="icon" onClick={() => onRemove(competitor.id)} className="h-10 w-10 text-red-500 hover:bg-red-50 hover:border-red-300">
            <Trash2 size={18} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 text-right">
          <Label htmlFor={`tech-score-${competitor.id}`}>{t('calculator.weighted.technicalScore')}</Label>
          <Input 
            id={`tech-score-${competitor.id}`} 
            type="number"
            value={competitor.technicalScore} 
            onChange={(e) => onUpdate(competitor.id, 'technicalScore', e.target.value)}
            placeholder={t('calculator.weighted.scorePlaceholder')}
          />
        </div>
        <div className="space-y-2 text-right">
          <Label htmlFor={`finance-offer-${competitor.id}`}>{t('calculator.weighted.financialOffer')}</Label>
          <Input 
            id={`finance-offer-${competitor.id}`} 
            type="number"
            value={competitor.financialOffer} 
            onChange={(e) => onUpdate(competitor.id, 'financialOffer', e.target.value)}
            placeholder={t('calculator.weighted.offerPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
};