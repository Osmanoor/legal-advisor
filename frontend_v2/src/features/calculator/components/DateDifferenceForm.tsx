// src/features/calculator/components/DateDifferenceForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCalculatorAPI, CalendarType, DateDifferencePayload } from '@/hooks/api/useCalculator';
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import { DateDifference } from '@/types/calculator';
import { AxiosError } from 'axios';
import LoadingSpinner from '@/components/ui/loading-spinner';
import './DatePicker.css';

interface DateDifferenceFormProps {
  designConfig: {
    fieldGroupClass: string;
    labelClass: string;
    inputClass: string;
    buttonClass: string;
    selectTriggerClass: string;
    selectContentClass: string;
    selectItemClass: string;
  };
}

export const DateDifferenceForm: React.FC<DateDifferenceFormProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const { showToast } = useToast();
  const { dateDifferenceMutation } = useCalculatorAPI();
  
  const [calendarType, setCalendarType] = useState<CalendarType>('gregorian');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [differenceResult, setDifferenceResult] = useState<Partial<DateDifference>>({});

  const handleDateChange = (date: DateObject | null, setter: React.Dispatch<React.SetStateAction<string>>, calendar: CalendarType) => {
    if (date) {
      setter(date.format(calendar === 'hijri' ? "YYYY/MM/DD" : "YYYY-MM-DD"));
    } else {
      setter('');
    }
  };

  const handleCalculateDifference = () => {
    setDifferenceResult({});
    if (!startDate || !endDate) {
      showToast(t('calculator.common.validation.selectBothDates'), 'error');
      return;
    }

    const payload: DateDifferencePayload = { start_date: startDate, end_date: endDate, calendar: calendarType };
    
    dateDifferenceMutation.mutate(payload, {
        onSuccess: (data) => {
            setDifferenceResult(data);
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || t('calculator.common.error');
            setDifferenceResult({ error: errorMessage });
            showToast(errorMessage, 'error');
        }
    });
  };
  
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setDifferenceResult({});
    setCalendarType('gregorian');
  };

  const renderDiffPart = (value: number | undefined, unitKey: string) => {
    if (value === undefined || value === 0) return null;
    return (
      <div className="text-center">
        <span className="block text-black text-sm font-medium" style={{fontFamily: 'var(--font-primary-arabic)'}}>
          {t(unitKey, { count: value.toString() })}
        </span>
        <span className="block text-[#51B749] text-4xl font-bold" style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>
          {value}
        </span>
      </div>
    );
  };

  const resultParts = [
    { value: differenceResult.years, unitKey: 'calculator.date.units.years' },
    { value: differenceResult.months, unitKey: 'calculator.date.units.months' },
    { value: differenceResult.days, unitKey: 'calculator.date.units.days' },
  ].filter(part => part.value !== undefined && part.value > 0);

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch" dir={direction}>
      <div className="space-y-6 flex flex-col">
        <div className={designConfig.fieldGroupClass}>
          <Label className={designConfig.labelClass}>نوع التقويم</Label>
          <Select dir={direction} value={calendarType} onValueChange={(v) => { setCalendarType(v as CalendarType); setStartDate(''); setEndDate(''); }}>
            <SelectTrigger className={designConfig.selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={designConfig.selectContentClass}>
              <SelectItem value="gregorian" className={designConfig.selectItemClass}>ميلادي</SelectItem>
              <SelectItem value="hijri" className={designConfig.selectItemClass}>هجري</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {calendarType === 'gregorian' ? (
          <>
            <div className={designConfig.fieldGroupClass}>
              <Label htmlFor="diff-start-date-gregorian" className={designConfig.labelClass}>{t('calculator.date.difference.start')}</Label>
              <DatePicker
                id="diff-start-date-gregorian"
                value={startDate}
                onChange={(date) => handleDateChange(date as DateObject, setStartDate, 'gregorian')}
                calendar={gregorian}
                locale={gregorian_en}
                inputClass="date-picker-input"
                format="YYYY-MM-DD"
              />
            </div>
            <div className={designConfig.fieldGroupClass}>
              <Label htmlFor="diff-end-date-gregorian" className={designConfig.labelClass}>{t('calculator.date.difference.end')}</Label>
              <DatePicker
                id="diff-end-date-gregorian"
                value={endDate}
                onChange={(date) => handleDateChange(date as DateObject, setEndDate, 'gregorian')}
                calendar={gregorian}
                locale={gregorian_en}
                inputClass="date-picker-input"
                format="YYYY-MM-DD"
              />
            </div>
          </>
        ) : (
          <>
            <div className={designConfig.fieldGroupClass}>
              <Label htmlFor="diff-start-date-hijri" className={designConfig.labelClass}>{t('calculator.date.difference.start')}</Label>
              <DatePicker
                id="diff-start-date-hijri"
                value={startDate}
                onChange={(date) => handleDateChange(date as DateObject, setStartDate, 'hijri')}
                calendar={arabic}
                locale={arabic_ar}
                inputClass="date-picker-input"
                format="YYYY/MM/DD"
              />
            </div>
            <div className={designConfig.fieldGroupClass}>
              <Label htmlFor="diff-end-date-hijri" className={designConfig.labelClass}>{t('calculator.date.difference.end')}</Label>
              <DatePicker
                id="diff-end-date-hijri"
                value={endDate}
                onChange={(date) => handleDateChange(date as DateObject, setEndDate, 'hijri')}
                calendar={arabic}
                locale={arabic_ar}
                inputClass="date-picker-input"
                format="YYYY/MM/DD"
              />
            </div>
          </>
        )}

        <div className="flex gap-4 mt-auto pt-4">
          <Button onClick={handleReset} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">{t('calculator.common.reset')}</Button>
          <Button onClick={handleCalculateDifference} disabled={!startDate || !endDate || dateDifferenceMutation.isPending} className={`${designConfig.buttonClass} w-full`}>{t('calculator.date.difference.calculate')}</Button>
        </div>
      </div>
      <div className="bg-[#ECFFEA] rounded-lg p-6 min-h-[333px] flex flex-col items-center justify-center">
        {dateDifferenceMutation.isPending ? (<LoadingSpinner />) :
         differenceResult.error ? (
          <p className="text-sm text-red-500 text-center">{differenceResult.error}</p>
        ) : resultParts.length > 0 ? (
          <div className="w-full space-y-4">
            {resultParts.map((part) => (
              <React.Fragment key={part.unitKey}>{renderDiffPart(part.value, part.unitKey)}</React.Fragment>
            ))}
          </div>
        ) : (
          <span className="text-gray-600 text-center">{t('calculator.common.noResultYet')}</span>
        )}
      </div>
    </div>
  );
};