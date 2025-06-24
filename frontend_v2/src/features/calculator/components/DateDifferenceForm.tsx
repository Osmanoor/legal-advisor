// src/features/calculator/components/DateDifferenceForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateConverter } from '@/lib/calculator';
import { DateDifference } from '@/types/calculator';

interface DateDifferenceFormProps {
  designConfig: {
    fieldGroupClass: string;
    labelClass: string;
    inputClass: string;
    buttonClass: string;
    resultDisplayContainerClass: string;
    resultLabelClass: string; // <<<< Make sure this is here
    // resultValueClass: string; // Not strictly needed for this component's main display
    resultSubValueContainerClass: string;
    resultSubValueRowClass: string;
    resultSubValueLabelClass: string;
    resultSubValueAmountClass: string;
  };
}

export const DateDifferenceForm: React.FC<DateDifferenceFormProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [differenceResult, setDifferenceResult] = useState<Partial<DateDifference>>({});

  const handleCalculateDifference = () => {
    setDifferenceResult({});
    if (!startDate || !endDate) {
      setDifferenceResult({ error: t('calculator.common.validation.selectBothDates') });
      return;
    }
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setDifferenceResult({ error: t('calculator.common.validation.invalidDate') });
        return;
      }
      if (end < start) {
        setDifferenceResult({ error: t('calculator.common.validation.endDateBeforeStart') });
        return;
      }
      const diff = DateConverter.calculateDateDifference(start, end);
      setDifferenceResult(diff);
    } catch (e) {
      setDifferenceResult({ error: t('calculator.common.error') });
      console.error("Date difference error:", e);
    }
  };
  
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setDifferenceResult({});
  };

  // Updated renderDiffPart for new styling
  const renderDiffPart = (value: number | undefined, unitKey: string, isLast: boolean) => {
    if (value === undefined || value === 0) return null; // Optionally hide if value is 0
    return (
      <div className="text-center">
        <span className="block text-black text-sm font-medium" style={{fontFamily: 'var(--font-primary-arabic)'}}>
          {t(unitKey)}
        </span>
        <span className="block text-[#51B749] text-4xl font-bold" style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>
          {value}
        </span>
      </div>
    );
  };

  const hasResults = differenceResult.years !== undefined || differenceResult.months !== undefined || differenceResult.days !== undefined;
  const resultParts = [
    { value: differenceResult.years, unitKey: 'calculator.date.units.years' },
    { value: differenceResult.months, unitKey: 'calculator.date.units.months' },
    { value: differenceResult.days, unitKey: 'calculator.date.units.days' },
  ].filter(part => part.value !== undefined && part.value > 0); // Filter out zero/undefined parts for display


  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch" dir={direction}> {/* Changed items-start to items-stretch */}
    {/* Inputs Column */}
      <div className={`space-y-6 ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'} flex flex-col`}>
        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="diff-start-date" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.date.difference.start')}
          </Label>
          <Input 
            type="date" 
            id="diff-start-date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className={`${designConfig.inputClass} text-left`} // Keep text-left for date input consistency
            dir="ltr" // Dates are typically LTR
          />
        </div>
        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="diff-end-date" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.date.difference.end')}
          </Label>
          <Input 
            type="date" 
            id="diff-end-date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className={`${designConfig.inputClass} text-left`}
            dir="ltr"
          />
        </div>
        <div className="flex gap-4 mt-auto pt-4"> {/* mt-auto to push buttons to bottom */}
            <Button onClick={handleReset} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">
                {t('calculator.common.reset')}
            </Button>
            <Button 
                onClick={handleCalculateDifference} 
                disabled={!startDate || !endDate} 
                className={`${designConfig.buttonClass} w-full`}
            >
                {t('calculator.date.difference.calculate')}
            </Button>
        </div>
      </div>
      {/* Result Display Column (Styled Card) */}
      <div 
        className={`bg-[#ECFFEA] rounded-lg p-6 min-h-[333px] flex flex-col items-center justify-center ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}
      >
        {differenceResult.error ? (
          <p className="text-sm text-red-500 text-center" style={{fontFamily: 'var(--font-primary-arabic)'}}>{differenceResult.error}</p>
        ) : resultParts.length > 0 ? (
            <div className="w-full space-y-4">
                {resultParts.map((part, index) => (
                    <React.Fragment key={part.unitKey}>
                        {renderDiffPart(part.value, part.unitKey, index === resultParts.length - 1)}
                        {/* Optional: add a visual separator if needed, but space-y-4 might be enough */}
                        {/* {index < resultParts.length - 1 && <hr className="border-green-200 my-2" />} */}
                    </React.Fragment>
                ))}
            </div>
        ) : (
            <span className="text-gray-600 text-center" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                {t('calculator.common.noResultYet')}
            </span>
        )}
      </div>

      
    </div>
  );
};