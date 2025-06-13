// src/features/tenderMapping/components/TenderMappingForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface WorkType {
  id: string;
  name: string;
}

interface TenderMappingFormProps {
  workTypes: WorkType[];
  isLoading: boolean;
  onSubmit: (values: {
    work_type: string;
    budget: number;
    start_date: string;
    project_duration: number;
  }) => void;
  onReset: () => void;
}

export function TenderMappingForm({ workTypes, isLoading, onSubmit, onReset }: TenderMappingFormProps) {
  const { t, direction } = useLanguage();
  const [formValues, setFormValues] = useState({
    work_type: '',
    budget: '',
    start_date: new Date().toISOString().split('T')[0],
    project_duration: '',
  });
  
  const handleValueChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit({
      work_type: formValues.work_type,
      budget: parseFloat(formValues.budget),
      start_date: formValues.start_date,
      project_duration: parseInt(formValues.project_duration),
    });
  };

  const isFormValid = formValues.work_type && formValues.budget && formValues.start_date && formValues.project_duration;

  return (
    <div className="w-full">
       <div className="text-center mb-6">
        <h2 className="text-2xl font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {t('tenderMapping.inputs.title')}
        </h2>
        <p className="text-sm text-text-on-light-muted mt-1">
          {t('tenderMapping.inputs.description')}
        </p>
      </div>
      <div className="bg-white border border-inputTheme-border rounded-2xl p-6 md:p-8">
        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2 text-right">
              <Label htmlFor="work_type">{t('tenderMapping.inputs.workType')}</Label>
              <Select dir={direction} value={formValues.work_type} onValueChange={(val) => handleValueChange('work_type', val)}>
                <SelectTrigger id="work_type" className="h-10"><SelectValue placeholder={t('tenderMapping.inputs.workTypePlaceholder')} /></SelectTrigger>
                <SelectContent>{workTypes.map(type => <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="budget">{t('tenderMapping.inputs.budget')}</Label>
              <Input id="budget" type="number" value={formValues.budget} onChange={e => handleValueChange('budget', e.target.value)} placeholder={t('tenderMapping.inputs.budgetPlaceholder')} />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="project_duration">{t('tenderMapping.inputs.projectDuration')}</Label>
              <Input id="project_duration" type="number" value={formValues.project_duration} onChange={e => handleValueChange('project_duration', e.target.value)} placeholder={t('tenderMapping.inputs.projectDurationPlaceholder')} />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="start_date">{t('tenderMapping.inputs.startDate')}</Label>
              <div className="relative">
                <Input id="start_date" type="date" value={formValues.start_date} onChange={e => handleValueChange('start_date', e.target.value)} className="pr-10" dir="ltr" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-on-light-muted" />
              </div>
            </div>
          </div>
          <Button type="submit" disabled={!isFormValid || isLoading} className="w-full h-11 text-base">{t('tenderMapping.inputs.submit')}</Button>
        </form>
      </div>
    </div>
  );
}