// src/features/calculator/components/DateDurationForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateConverter } from '@/lib/calculator';
import { DateTime } from 'luxon';

interface DateDurationFormProps {
  designConfig: {
    fieldGroupClass: string;
    labelClass: string;
    inputClass: string;
    buttonClass: string;
    resultDisplayContainerClass: string;
    resultLabelClass: string; 
    resultValueClass: string; 
  };
}

export const DateDurationForm: React.FC<DateDurationFormProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [durationYears, setDurationYears] = useState('');
  const [calculatedEndDate, setCalculatedEndDate] = useState('');
  const [durationError, setDurationError] = useState<string | null>(null);

  const handleCalculateEndDate = () => {
    setDurationError(null);
    setCalculatedEndDate('');
    if (!startDate) {
      setDurationError(t('calculator.common.validation.enterStartDate'));
      return;
    }
    // Ensure at least one duration field is a valid number or empty, but not just text
    const dDays = durationDays ? parseInt(durationDays) : 0;
    const dMonths = durationMonths ? parseInt(durationMonths) : 0;
    const dYears = durationYears ? parseInt(durationYears) : 0;

    if (isNaN(dDays) || isNaN(dMonths) || isNaN(dYears) ) {
        setDurationError(t('calculator.common.validation.invalidNumber'));
        return;
    }
     if (dDays === 0 && dMonths === 0 && dYears === 0 && (!durationDays && !durationMonths && !durationYears) ) {
         setDurationError(t('calculator.date.duration.validation.required'));
         return;
     }


    try {
      const start = DateTime.fromISO(startDate);
      if(!start.isValid) {
        setDurationError(t('calculator.common.validation.invalidDate'));
        return;
      }
      const result = DateConverter.calculateEndDate(
        start.toJSDate(),
        {
          days: dDays,
          months: dMonths,
          years: dYears,
        }
      );
      const gregorianResult = DateTime.fromJSDate(result).toISODate();
      const hijriResult = DateConverter.gregorianToHijri(result);
      
      if (gregorianResult && hijriResult) {
        setCalculatedEndDate(t('calculator.date.duration.resultFormat', { gregorian: gregorianResult, hijri: hijriResult }));
      } else {
        setCalculatedEndDate(t('calculator.common.error'));
      }

    } catch (e) {
      setDurationError(t('calculator.common.error'));
      setCalculatedEndDate('');
      console.error("Date duration error:", e);
    }
  };
  
  const handleReset = () => {
    setStartDate('');
    setDurationDays('');
    setDurationMonths('');
    setDurationYears('');
    setCalculatedEndDate('');
    setDurationError(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start" dir={direction}>
      {/* Left Column (Result Display) */}
      <div className={`${designConfig.resultDisplayContainerClass} ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}>
        <span className={designConfig.resultLabelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
          {t('calculator.date.duration.resultLabel')}
        </span>
        <span 
            className={`${designConfig.resultValueClass} text-xl sm:text-2xl md:text-3xl break-all`} // Smaller font, break-all for long string
            style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr', lineHeight: '1.4'}}
        >
          {calculatedEndDate || t('calculator.date.duration.resultPlaceholder')}
        </span>
        {durationError && <p className="text-sm text-red-500 mt-2">{durationError}</p>}
      </div>

      {/* Right Column (Inputs) */}
      <div className={`space-y-6 ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'}`}>
        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="duration-start-date" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.date.duration.start')}
          </Label>
          <Input type="date" id="duration-start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${designConfig.inputClass} text-left`} dir="ltr"/>
        </div>
        
        <div className={designConfig.fieldGroupClass}>
            <Label className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
                {t('calculator.date.duration.duration.label')}
            </Label>
            {/* Inputs for years, months, days aligned to the right due to parent's text-right */}
            <div className={`grid grid-cols-3 gap-3 ${direction === 'rtl' ? '' : 'text-left'}`}>
                <div>
                    <Input type="number" min="0" value={durationYears} onChange={(e) => setDurationYears(e.target.value)} placeholder={t('calculator.date.duration.duration.years')} className={`${designConfig.inputClass} text-center`} dir="rtl"/>
                </div>
                 <div>
                    <Input type="number" min="0" value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} placeholder={t('calculator.date.duration.duration.months')} className={`${designConfig.inputClass} text-center`} dir="rtl"/>
                </div>
                <div>
                    <Input type="number" min="0" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder={t('calculator.date.duration.duration.days')} className={`${designConfig.inputClass} text-center`} dir="rtl"/>
                </div>
            </div>
        </div>
        <div className="flex gap-4 mt-6">
            <Button onClick={handleReset} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">
                {t('calculator.common.reset')}
            </Button>
            <Button onClick={handleCalculateEndDate} disabled={!startDate || (!durationDays && !durationMonths && !durationYears)} className={designConfig.buttonClass}>
                {t('calculator.date.duration.calculate')}
            </Button>
        </div>
      </div>
    </div>
  );
};