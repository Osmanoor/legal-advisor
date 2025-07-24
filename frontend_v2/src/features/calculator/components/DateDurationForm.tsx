// src/features/calculator/components/DateDurationForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateConverter } from '@/lib/calculator';
import { DateTime } from 'luxon';
import { trackEvent } from '@/lib/analytics';

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
  // Updated state for separate dates
  const [calculatedGregorianDate, setCalculatedGregorianDate] = useState<string | null>(null);
  const [calculatedHijriDate, setCalculatedHijriDate] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  const handleCalculateEndDate = () => {
    setDurationError(null);
    setCalculatedGregorianDate(null); // Reset dates
    setCalculatedHijriDate(null);

    if (!startDate) {
      setDurationError(t('calculator.common.validation.enterStartDate'));
      return;
    }
    const dDays = durationDays ? parseInt(durationDays) : 0;
    const dMonths = durationMonths ? parseInt(durationMonths) : 0;
    const dYears = durationYears ? parseInt(durationYears) : 0;

    if (isNaN(dDays) || isNaN(dMonths) || isNaN(dYears)) {
        setDurationError(t('calculator.common.validation.invalidNumber'));
        return;
    }
    // Check if all duration fields are effectively zero or empty
    if (dDays === 0 && dMonths === 0 && dYears === 0 && 
        durationDays.trim() === '' && durationMonths.trim() === '' && durationYears.trim() === '') {
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
      
      if (gregorianResult) {
        setCalculatedGregorianDate(gregorianResult);
      }
      if (hijriResult) {
        setCalculatedHijriDate(hijriResult);
      }
      if (!gregorianResult && !hijriResult) {
        setDurationError(t('calculator.common.error'));
      }
      // Track event only if at least one date was successfully calculated
      if (gregorianResult || hijriResult) { 
        trackEvent({ event: 'feature_used', feature_name: 'date_calculator' });
      } else {
        setDurationError(t('calculator.common.error'));
      }

    } catch (e) {
      setDurationError(t('calculator.common.error'));
      console.error("Date duration error:", e);
    }
  };
  
  const handleReset = () => {
    setStartDate('');
    setDurationDays('');
    setDurationMonths('');
    setDurationYears('');
    setCalculatedGregorianDate(null);
    setCalculatedHijriDate(null);
    setDurationError(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch" dir={direction}> {/* items-stretch */}
    {/* Inputs Column */}
      <div className={`space-y-6 ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'} flex flex-col`}>
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
        <div className="flex gap-4 mt-auto pt-4"> {/* mt-auto to push buttons to bottom */}
            <Button onClick={handleReset} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">
                {t('calculator.common.reset')}
            </Button>
            <Button onClick={handleCalculateEndDate} disabled={!startDate || (durationDays.trim() === '' && durationMonths.trim() === '' && durationYears.trim() === '')} className={`${designConfig.buttonClass} w-full`}>
                {t('calculator.date.duration.calculate')}
            </Button>
        </div>
      </div>
      {/* Result Display Column (Styled Card) */}
      <div 
        className={`bg-[#ECFFEA] rounded-lg p-6 min-h-[333px] flex flex-col items-center justify-center text-center ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}
      >
        {durationError ? (
          <p className="text-sm text-red-500" style={{fontFamily: 'var(--font-primary-arabic)'}}>{durationError}</p>
        ) : calculatedGregorianDate || calculatedHijriDate ? (
          <div className="space-y-4">
            {calculatedGregorianDate && (
              <div>
                <span className="block text-black text-sm font-medium" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                  {t('calculator.date.duration.gregorianResultLabel')}
                </span>
                <span className="block text-[#51B749] text-3xl font-bold" style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>
                  {calculatedGregorianDate}
                </span>
              </div>
            )}
            {calculatedHijriDate && (
              <div>
                <span className="block text-black text-sm font-medium" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                  {t('calculator.date.duration.hijriResultLabel')}
                </span>
                <span className="block text-[#51B749] text-3xl font-bold" style={{fontFamily: 'var(--font-primary-arabic)', direction: 'rtl'}}>
                  {calculatedHijriDate}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="block text-gray-600 text-sm font-medium" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                {t('calculator.date.duration.gregorianResultLabel')}
              </span>
              <span className="block text-gray-400 text-3xl font-bold" style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>
                {t('calculator.date.placeholder.gregorian')}
              </span>
            </div>
            <div>
              <span className="block text-gray-600 text-sm font-medium" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                {t('calculator.date.duration.hijriResultLabel')}
              </span>
              <span className="block text-gray-400 text-3xl font-bold" style={{fontFamily: 'var(--font-primary-arabic)', direction: 'rtl'}}>
                {t('calculator.date.placeholder.hijri')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};