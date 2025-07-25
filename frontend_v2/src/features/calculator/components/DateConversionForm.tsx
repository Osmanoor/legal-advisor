// src/features/calculator/components/DateConversionForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { useCalculatorAPI, DateConversionPayload } from '@/hooks/api/useCalculator';
import { AxiosError } from 'axios';
import LoadingSpinner from '@/components/ui/loading-spinner';
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import './DatePicker.css';

interface DateConversionFormProps {
  designConfig: {
    fieldGroupClass: string;
    labelClass: string;
    inputClass: string;
  };
}

export const DateConversionForm: React.FC<DateConversionFormProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const { showToast } = useToast();
  const { convertDateMutation } = useCalculatorAPI();

  const [gregorianDate, setGregorianDate] = useState<DateObject | null>(null);
  const [hijriDate, setHijriDate] = useState<DateObject | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [lastEditedField, setLastEditedField] = useState<'gregorian' | 'hijri'>('gregorian');

  const handleConvert = () => {
    setConversionError(null);
    let payload: DateConversionPayload;

    if (lastEditedField === 'gregorian') {
      if (!gregorianDate) {
        setConversionError(t('calculator.common.validation.enterGregorian'));
        return;
      }
      payload = { date: gregorianDate.format("YYYY-MM-DD"), from_calendar: 'gregorian' };
    } else {
      if (!hijriDate) {
        setConversionError(t('calculator.common.validation.enterHijri'));
        return;
      }
      payload = { date: hijriDate.format("YYYY/MM/DD"), from_calendar: 'hijri' };
    }
    
    convertDateMutation.mutate(payload, {
        onSuccess: (data) => {
            setGregorianDate(new DateObject({ date: data.gregorian, format: "YYYY-MM-DD" }));
            setHijriDate(new DateObject({ date: data.hijri, format: "YYYY/MM/DD", calendar: arabic }));
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || t('calculator.common.error');
            setConversionError(errorMessage);
            showToast(errorMessage, 'error');
        }
    });
  };

  return (
    <div className="space-y-6 py-4 md:py-8" dir={direction}>
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-x-3 justify-center md:justify-around">
        {/* Gregorian Date Input */}
        <div className={`flex-1 ${designConfig.fieldGroupClass} w-full md:max-w-xs`}>
          <Label htmlFor="gregorian-input" className={designConfig.labelClass} style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            {t('calculator.date.conversion.inputLabelGregorian')}
          </Label>
          <DatePicker
            value={gregorianDate}
            onChange={(date) => {
              setGregorianDate(date);
              setLastEditedField('gregorian');
              setConversionError(null);
            }}
            calendar={gregorian}
            locale={gregorian_en}
            inputClass="date-picker-input"
            format="YYYY-MM-DD"
          />
        </div>

        {/* Conversion Button */}
        <div className="flex-shrink-0 mx-auto my-2 md:my-0 md:mx-0 self-center">
          <Button
            onClick={handleConvert}
            variant="outline"
            className="w-14 h-14 md:w-[54px] md:h-[54px] bg-cta text-white rounded-full p-0 flex items-center justify-center shadow-md hover:bg-cta-hover"
            aria-label={t('calculator.date.conversion.convertActionLabel')}
            disabled={convertDateMutation.isPending}
          >
            {convertDateMutation.isPending ? <LoadingSpinner size="sm" /> : <ArrowLeftRight className="w-6 h-6 md:transform-none transform rotate-90" />}
          </Button>
        </div>

        {/* Hijri Date Input */}
        <div className={`flex-1 ${designConfig.fieldGroupClass} w-full md:max-w-xs`}>
          <Label htmlFor="hijri-input" className={designConfig.labelClass} style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            {t('calculator.date.conversion.inputLabelHijri')}
          </Label>
          <DatePicker
             value={hijriDate}
             onChange={(date) => {
               setHijriDate(date);
               setLastEditedField('hijri');
               setConversionError(null);
             }}
             calendar={arabic}
             locale={arabic_ar}
             inputClass="date-picker-input"
             format="YYYY/MM/DD"
          />
        </div>
      </div>
      {conversionError && <p className="text-sm text-red-500 text-center mt-4">{conversionError}</p>}
    </div>
  );
};