// src/features/calculator/components/AmountPercentageCalculator.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProcurementCalculator } from '@/lib/calculator';
import { AmountWithPercentageResult } from '@/types/calculator';

interface AmountPercentageCalculatorProps {
  designConfig: {
    fieldGroupClass: string;
    labelClass: string;
    inputClass: string;
    buttonClass: string;
    resultDisplayContainerClass: string;
    resultLabelClass: string; // Not directly used for main result value, but for sub-labels
    resultValueClass: string; // Not directly used for main result value
    resultSubValueContainerClass: string;
    resultSubValueRowClass: string;
    resultSubValueLabelClass: string;
    resultSubValueAmountClass: string;
  };
}

export const AmountPercentageCalculator: React.FC<AmountPercentageCalculatorProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState('');
  const [calcResult, setCalcResult] = useState<Partial<AmountWithPercentageResult>>({});

  const handleCalculate = () => {
    if (!amount || !percentage || isNaN(Number(amount)) || isNaN(Number(percentage))) {
      setCalcResult({ error: t('calculator.common.validation.invalidNumber') } as any);
      return;
    }
    const result = ProcurementCalculator.calculateAmountWithPercentage(
      Number(amount),
      Number(percentage)
    );
    setCalcResult(result);
  };

  const handleReset = () => {
    setAmount('');
    setPercentage('');
    setCalcResult({});
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch" dir={direction}>
      {/* Column 1: Inputs and Buttons */}
      <div className="space-y-6 flex flex-col">
        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="amountPercAmount" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.amountPercentage.amountLabel')}
          </Label>
          <Input
            id="amountPercAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('calculator.common.enterAmountPlaceholder')}
            className={designConfig.inputClass}
            dir="rtl"
          />
        </div>

        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="amountPercPercentage" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.amountPercentage.percentageLabel')} (%)
          </Label>
          <Input
            id="amountPercPercentage"
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder={t('calculator.common.enterPercentagePlaceholder')}
            className={designConfig.inputClass}
            dir="rtl"
          />
        </div>

        <div className="flex gap-4 mt-auto pt-4"> {/* mt-auto to push buttons to bottom if column is taller */}
            <Button onClick={handleReset} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">
                {t('calculator.common.reset')}
            </Button>
            <Button onClick={handleCalculate} disabled={!amount || !percentage} className={`${designConfig.buttonClass} w-full`}>
                {t('calculator.amountPercentage.calculate')}
            </Button>
        </div>
      </div>

      {/* Column 2: Result Card */}
      <div className="bg-[#ECFFEA] rounded-lg p-6 flex flex-col items-center justify-center min-h-[333px]">
        {calcResult.error ? (
          <p className="text-sm text-red-500 text-center" style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {calcResult.error}
          </p>
        ) : Object.keys(calcResult).length > 0 && calcResult.finalAmount !== undefined ? (
          <>
            <span 
              className="text-black text-sm text-center mb-3" 
              style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 400, lineHeight: '20px'}}
            >
              {t('calculator.amountPercentage.results.finalAmountLabel')} {/* Using existing label, or a new one like "النتيجة" */}
            </span>
            <span 
              className="text-[#51B749] text-5xl text-center font-normal" 
              style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 400, lineHeight: '1.2'}} /* Adjusted line height for readability */
            >
              {calcResult.finalAmount.toFixed(2)}
            </span>
            {/* Optionally, display original amount and adjustment if needed, though the design implies one main result */}
            {/* 
            <div className="text-xs text-gray-600 mt-4 text-center">
              <p>{t('calculator.amountPercentage.results.originalAmountLabel')}: {calcResult.originalAmount?.toFixed(2)}</p>
              <p>{t('calculator.amountPercentage.results.adjustmentAmountLabel')}: {calcResult.adjustmentAmount?.toFixed(2)} ({percentage}%)</p>
            </div>
            */}
          </>
        ) : (
          <span className="text-gray-500 text-center" style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.common.noResultYet')}
          </span>
        )}
      </div>
    </div>
  );
};