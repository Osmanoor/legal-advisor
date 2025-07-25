// src/features/calculator/components/DateDurationForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCalculatorAPI, CalendarType, EndDatePayload } from '@/hooks/api/useCalculator';
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import { AxiosError } from 'axios';
import LoadingSpinner from '@/components/ui/loading-spinner';
import './DatePicker.css';

interface DateDurationFormProps {
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

export const DateDurationForm: React.FC<DateDurationFormProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const { showToast } = useToast();
  const { endDateMutation } = useCalculatorAPI();

  const [calendarType, setCalendarType] = useState<CalendarType>('gregorian');
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [durationYears, setDurationYears] = useState('');
  const [calculatedGregorianDate, setCalculatedGregorianDate] = useState<string | null>(null);
  const [calculatedHijriDate, setCalculatedHijriDate] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  const handleDateChange = (date: DateObject | null, setter: React.Dispatch<React.SetStateAction<string>>, calendar: CalendarType) => {
    if (date) {
      setter(date.format(calendar === 'hijri' ? "YYYY/MM/DD" : "YYYY-MM-DD"));
    } else {
      setter('');
    }
  };

  const handleCalculateEndDate = () => {
    setDurationError(null);
    setCalculatedGregorianDate(null);
    setCalculatedHijriDate(null);

    if (!startDate) {
      showToast(t('calculator.common.validation.enterStartDate'), 'error');
      return;
    }
    const days = durationDays ? parseInt(durationDays) : 0;
    const months = durationMonths ? parseInt(durationMonths) : 0;
    const years = durationYears ? parseInt(durationYears) : 0;

    if (days === 0 && months === 0 && years === 0 && !durationDays && !durationMonths && !durationYears) {
      showToast(t('calculator.date.duration.validation.required'), 'error');
      return;
    }

    const payload: EndDatePayload = {
      start_date: startDate,
      duration: { days, months, years },
      calendar: calendarType,
    };
    
    endDateMutation.mutate(payload, {
        onSuccess: (data) => {
            setCalculatedGregorianDate(data.gregorian_end_date);
            setCalculatedHijriDate(data.hijri_end_date);
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || t('calculator.common.error');
            setDurationError(errorMessage);
            showToast(errorMessage, 'error');
        }
    });
  };
  
  const handleReset = () => {
    setStartDate('');
    setDurationDays('');
    setDurationMonths('');
    setDurationYears('');
    setCalculatedGregorianDate(null);
    setCalculatedHijriDate(null);
    setDurationError(null);
    setCalendarType('gregorian');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch" dir={direction}>
      <div className="space-y-6 flex flex-col">
         <div className={designConfig.fieldGroupClass}>
          <Label className={designConfig.labelClass}>نوع تقويم البداية</Label>
          <Select dir={direction} value={calendarType} onValueChange={(v) => { setCalendarType(v as CalendarType); setStartDate(''); }}>
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
          <div className={designConfig.fieldGroupClass}>
            <Label htmlFor="duration-start-date-gregorian" className={designConfig.labelClass}>{t('calculator.date.duration.start')}</Label>
            <DatePicker
              id="duration-start-date-gregorian"
              value={startDate}
              onChange={(date) => handleDateChange(date as DateObject, setStartDate, 'gregorian')}
              calendar={gregorian}
              locale={gregorian_en}
              inputClass="date-picker-input"
              format="YYYY-MM-DD"
            />
          </div>
        ) : (
          <div className={designConfig.fieldGroupClass}>
            <Label htmlFor="duration-start-date-hijri" className={designConfig.labelClass}>{t('calculator.date.duration.start')}</Label>
            <DatePicker
              id="duration-start-date-hijri"
              value={startDate}
              onChange={(date) => handleDateChange(date as DateObject, setStartDate, 'hijri')}
              calendar={arabic}
              locale={arabic_ar}
              inputClass="date-picker-input"
              format="YYYY/MM/DD"
            />
          </div>
        )}
        
        <div className={designConfig.fieldGroupClass}>
            <Label className={designConfig.labelClass}>{t('calculator.date.duration.duration.label')}</Label>
            <div className="grid grid-cols-3 gap-3">
                <div><Input type="number" min="0" value={durationYears} onChange={(e) => setDurationYears(e.target.value)} placeholder={t('calculator.date.duration.duration.years')} className={`${designConfig.inputClass} text-center`} dir="rtl"/></div>
                <div><Input type="number" min="0" value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} placeholder={t('calculator.date.duration.duration.months')} className={`${designConfig.inputClass} text-center`} dir="rtl"/></div>
                <div><Input type="number" min="0" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder={t('calculator.date.duration.duration.days')} className={`${designConfig.inputClass} text-center`} dir="rtl"/></div>
            </div>
        </div>
        <div className="flex gap-4 mt-auto pt-4">
            <Button onClick={handleReset} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">{t('calculator.common.reset')}</Button>
            <Button onClick={handleCalculateEndDate} disabled={!startDate || endDateMutation.isPending} className={`${designConfig.buttonClass} w-full`}>{t('calculator.date.duration.calculate')}</Button>
        </div>
      </div>
      <div className="bg-[#ECFFEA] rounded-lg p-6 min-h-[333px] flex flex-col items-center justify-center text-center">
        {endDateMutation.isPending ? (<LoadingSpinner />) :
         durationError ? (
          <p className="text-sm text-red-500">{durationError}</p>
        ) : calculatedGregorianDate || calculatedHijriDate ? (
          <div className="space-y-4">
            {calculatedGregorianDate && (
              <div>
                <span className="block text-black text-sm font-medium">{t('calculator.date.duration.gregorianResultLabel')}</span>
                <span className="block text-[#51B749] text-3xl font-bold" style={{direction: 'ltr'}}>{calculatedGregorianDate}</span>
              </div>
            )}
            {calculatedHijriDate && (
              <div>
                <span className="block text-black text-sm font-medium">{t('calculator.date.duration.hijriResultLabel')}</span>
                <span className="block text-[#51B749] text-3xl font-bold" style={{direction: 'rtl'}}>{calculatedHijriDate}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="block text-gray-600 text-sm font-medium">{t('calculator.date.duration.gregorianResultLabel')}</span>
              <span className="block text-gray-400 text-3xl font-bold" style={{direction: 'ltr'}}>{t('calculator.date.placeholder.gregorian')}</span>
            </div>
            <div>
              <span className="block text-gray-600 text-sm font-medium">{t('calculator.date.duration.hijriResultLabel')}</span>
              <span className="block text-gray-400 text-3xl font-bold" style={{direction: 'rtl'}}>{t('calculator.date.placeholder.hijri')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};