// src/features/calculator/components/DateConversionForm.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { DateConverter } from '@/lib/calculator';
import { DateTime } from 'luxon';

interface DateConversionFormProps {
  designConfig: {
    fieldGroupClass: string;
    labelClass: string;
    inputClass: string;
    // buttonClass is not used by the central swap button directly, but can be kept
  };
}

export const DateConversionForm: React.FC<DateConversionFormProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();

  // State for YYYY-MM-DD format for <input type="date">
  const [gregorianDate, setGregorianDate] = useState<string>('');
  // State for user input for Hijri date, e.g., "1445/08/15"
  const [hijriDateInput, setHijriDateInput] = useState<string>('');
  
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [lastEditedField, setLastEditedField] = useState<'gregorian' | 'hijri' | null>(null);

  const handleGregorianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGregorianDate(e.target.value);
    setLastEditedField('gregorian');
    setConversionError(null); // Clear error on new input
  };

  const handleHijriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHijriDateInput(e.target.value);
    setLastEditedField('hijri');
    setConversionError(null); // Clear error on new input
  };

  const handleConvert = () => {
    setConversionError(null);

    if (lastEditedField === 'gregorian') {
      if (!gregorianDate) {
        setConversionError(t('calculator.common.validation.enterGregorian'));
        setHijriDateInput(''); // Clear other field if source is empty
        return;
      }
      try {
        const dateObj = DateTime.fromISO(gregorianDate);
        if (!dateObj.isValid) {
          setConversionError(t('calculator.common.validation.invalidDate'));
          setHijriDateInput('');
          return;
        }
        const convertedHijri = DateConverter.gregorianToHijri(dateObj.toJSDate());
        setHijriDateInput(convertedHijri || '');
      } catch (e) {
        setConversionError(t('calculator.common.error'));
        setHijriDateInput('');
        console.error("Gregorian to Hijri conversion error:", e);
      }
    } else if (lastEditedField === 'hijri') {
      if (!hijriDateInput.trim()) {
        setConversionError(t('calculator.common.validation.enterHijri'));
        setGregorianDate(''); // Clear other field if source is empty
        return;
      }
      // Validate Hijri format (basic check, YYYY/MM/DD)
      const hijriPattern = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
      if (!hijriPattern.test(hijriDateInput.trim())) {
          setConversionError(t('calculator.common.validation.invalidHijriFormat'));
          setGregorianDate('');
          return;
      }
      if (!DateConverter.isValidHijriDate(hijriDateInput.trim())) {
        setConversionError(t('calculator.common.validation.invalidHijriFormat'));
        setGregorianDate('');
        return;
      }
      try {
        const convertedGregorian = DateConverter.hijriToGregorian(hijriDateInput.trim());
        setGregorianDate(DateTime.fromJSDate(convertedGregorian).toISODate() || '');
      } catch (e) {
        setConversionError(t('calculator.common.error'));
        setGregorianDate('');
        console.error("Hijri to Gregorian conversion error:", e);
      }
    } else {
      // If no field was edited, or to handle a default case (e.g. convert G->H if G has value)
      if (gregorianDate) {
        handleConvertBasedOnGregorian();
      } else if (hijriDateInput) {
        handleConvertBasedOnHijri();
      } else {
         setConversionError(t('calculator.common.validation.enterDateToConvert')); // Add this translation
      }
    }
  };
  
  // Helper functions for clarity if button is clicked without prior field edit focus
  const handleConvertBasedOnGregorian = () => {
      setLastEditedField('gregorian'); // Set context for handleConvert
      // Slight delay to allow state update before calling handleConvert
      setTimeout(handleConvert, 0);
  }
  const handleConvertBasedOnHijri = () => {
      setLastEditedField('hijri'); // Set context for handleConvert
      setTimeout(handleConvert, 0);
  }


  return (
    <div className="space-y-6 py-4 md:py-8" dir={direction}>
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-x-3 justify-center md:justify-around">
        {/* Gregorian Date Input (Right in RTL) */}
        <div className={`flex-1 ${designConfig.fieldGroupClass} w-full md:max-w-xs`}>
          <Label htmlFor="gregorian-input" className={designConfig.labelClass} style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            {t('calculator.date.conversion.inputLabelGregorian')}
          </Label>
          <Input
            type="date"
            id="gregorian-input"
            value={gregorianDate}
            onChange={handleGregorianChange}
            className={`${designConfig.inputClass} text-left`} // Date input usually LTR
            dir="ltr" // Standard for date type input
          />
        </div>

        {/* Conversion Button */}
        <div className="flex-shrink-0 mx-auto my-2 md:my-0 md:mx-0 self-center">
          <Button
            onClick={handleConvert} // Main conversion logic
            variant="outline"
            className="w-14 h-14 md:w-[54px] md:h-[54px] bg-cta text-white rounded-full p-0 flex items-center justify-center shadow-md hover:bg-cta-hover"
            aria-label={t('calculator.date.conversion.convertActionLabel')}
          >
            <ArrowLeftRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Hijri Date Input (Left in RTL) */}
        <div className={`flex-1 ${designConfig.fieldGroupClass} w-full md:max-w-xs`}>
          <Label htmlFor="hijri-input" className={designConfig.labelClass} style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            {t('calculator.date.conversion.inputLabelHijri')}
          </Label>
          <Input
            type="text" // Hijri input is text
            id="hijri-input"
            value={hijriDateInput}
            onChange={handleHijriChange}
            placeholder={t('calculator.date.hijri.placeholder')} // YYYY/MM/DD
            className={`${designConfig.inputClass} text-right`} // Text align right for Hijri
            dir="rtl" // Input direction for Hijri
          />
        </div>
      </div>
      {conversionError && <p className="text-sm text-red-500 text-center mt-4">{conversionError}</p>}
    </div>
  );
};