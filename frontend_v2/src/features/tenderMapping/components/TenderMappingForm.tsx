// src/features/tenderMapping/components/TenderMappingForm.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import '../../calculator/components/DatePicker.css';

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
  
  const handleDateChange = (date: DateObject | null) => {
    if (date) {
      handleValueChange('start_date', date.format("YYYY-MM-DD"));
    } else {
      handleValueChange('start_date', '');
    }
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
    <div className="w-full" dir={direction}>
       <div className={`mb-6 ${direction === 'rtl' ? 'text-right' : 'text-left'}'}`}>
        <h2 className="text-2xl font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {t('tenderMapping.form.title')}
        </h2>
        <p className="text-sm text-text-on-light-muted mt-1">
          {t('tenderMapping.inputs.description')}
        </p>
      </div>
      <div className="bg-white border border-inputTheme-border rounded-2xl p-6 md:p-8">
        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2 text-right">
              <Label htmlFor="work_type">{t('tenderMapping.form.workType')}</Label>
              <Select dir={direction} value={formValues.work_type} onValueChange={(val) => handleValueChange('work_type', val)}>
                <SelectTrigger id="work_type" className="h-10 text-right"><SelectValue placeholder={t('tenderMapping.form.selectWorkType')} /></SelectTrigger>
                <SelectContent>
                  {workTypes.map(type => (
                    <SelectItem 
                      key={type.id} 
                      value={type.name} 
                      className="whitespace-normal text-right"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="budget">{t('tenderMapping.form.budget')}</Label>
              <Input id="budget" type="number" value={formValues.budget} onChange={e => handleValueChange('budget', e.target.value)} placeholder={t('tenderMapping.form.enterBudget')} />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="project_duration">{t('tenderMapping.form.projectDuration')}</Label>
              <Input id="project_duration" type="number" value={formValues.project_duration} onChange={e => handleValueChange('project_duration', e.target.value)} placeholder={t('tenderMapping.form.enterDuration')} />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="start_date">{t('tenderMapping.form.startDate')}</Label>
              <DatePicker
                id="start_date"
                value={formValues.start_date}
                onChange={handleDateChange}
                calendar={gregorian}
                locale={gregorian_en}
                inputClass="date-picker-input"
                format="YYYY-MM-DD"
              />
            </div>
          </div>
          <Button type="submit" disabled={!isFormValid || isLoading} className="w-full h-11 text-base bg-cta">{t('common.submit')}</Button>
        </form>
      </div>
    </div>
  );
}