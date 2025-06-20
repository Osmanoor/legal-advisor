// src/features/tenderMapping/components/EditableTimelineStage.tsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderStage } from '@/types/tenderMapping';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch-rtl';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Calendar, Check, X } from 'lucide-react';

interface EditableTimelineStageProps {
  stage: TenderStage;
  isEditing: boolean;
  onEditClick: () => void;
  onSave: (updatedStage: TenderStage) => void;
  onCancel: () => void;
}

export const EditableTimelineStage: React.FC<EditableTimelineStageProps> = ({
  stage,
  isEditing,
  onEditClick,
  onSave,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [duration, setDuration] = useState(stage.duration.toString());
  const [isWorkingDays, setIsWorkingDays] = useState(stage.is_working_days);

  // Reset local state if the parent stage prop changes (e.g., on a global reset)
  useEffect(() => {
    setDuration(stage.duration.toString());
    setIsWorkingDays(stage.is_working_days);
  }, [stage]);

  const handleSave = () => {
    const durationValue = parseInt(duration, 10);
    if (!isNaN(durationValue) && durationValue >= 0) {
      onSave({
        ...stage,
        duration: durationValue,
        is_working_days: isWorkingDays,
      });
    }
  };

  return (
    <div className="bg-white border border-inputTheme-border rounded-lg p-4">
      <div className="flex justify-between items-start gap-4">
        {/* Title and Date Info */}
        <div className="flex-grow text-right">
          <p className="text-sm font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            {stage.name}
          </p>
          <div className="flex items-center flex-row-reverse justify-end gap-2 mt-1 text-xs text-text-on-light-muted">
            <span>{`${stage.start_date} إلى ${stage.end_date} (${stage.duration} أيام)`}</span>
            <Calendar size={14} className='text-cta'/>
          </div>
        </div>
        
        {/* Edit Icon */}
        <Button variant="ghost" size="icon" className="w-8 h-8 text-cta" onClick={onEditClick}>
          <Edit2 size={16} />
        </Button>
      </div>

      {/* Collapsible Edit Section */}
      {isEditing && (
        <div className="mt-4 pt-4 border-t border-border-default space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
             <div className="flex items-center gap-2">
                <Checkbox
                    id={`working-days-${stage.id}`}
                    checked={isWorkingDays}
                    onCheckedChange={(checked) => setIsWorkingDays(!!checked)}
                />
                <Label htmlFor={`working-days-${stage.id}`} className="text-xs font-light" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                    {t('tenderMapping.results.workingDays')}
                </Label>
            </div>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-9 w-40 text-sm text-center"
              placeholder={t('tenderMapping.results.editDuration')}
              min="0"
              dir="ltr"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>{t('tenderMapping.results.cancel')}</Button>
            <Button size="sm" onClick={handleSave}>{t('tenderMapping.results.save')}</Button>
          </div>
        </div>
      )}
    </div>
  );
};