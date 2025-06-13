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
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start" dir={direction}>
      {/* Left Column (Result Display) */}
      <div className={`${designConfig.resultDisplayContainerClass} ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}>
        {Object.keys(calcResult).length > 0 && !calcResult.error ? (
          <div className="w-full px-4">
            {calcResult.originalAmount !== undefined && (
              <div className={designConfig.resultSubValueRowClass}>
                <span className={designConfig.resultSubValueAmountClass} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{calcResult.originalAmount.toFixed(2)}</span>
                <span className={designConfig.resultSubValueLabelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.amountPercentage.results.originalAmountLabel')}</span> {/* القيمة */}
              </div>
            )}
            {calcResult.adjustmentAmount !== undefined && (
              <div className={`${designConfig.resultSubValueRowClass} my-3 py-3 border-y ${calcResult.originalAmount === undefined ? 'border-t-0' : 'border-resultTheme-divider'}`}>
                <span className={designConfig.resultSubValueAmountClass} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>
                  {calcResult.adjustmentAmount.toFixed(2)} 
                  {/* Display percentage used for adjustment if available and makes sense */}
                  {percentage ? ` (${percentage}%)` : ''}
                </span>
                <span className={designConfig.resultSubValueLabelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.amountPercentage.results.adjustmentAmountLabel')}</span> {/* قيمة التعديل */}
              </div>
            )}
            {calcResult.finalAmount !== undefined && (
              <div className={designConfig.resultSubValueRowClass}>
                <span className={designConfig.resultSubValueAmountClass} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{calcResult.finalAmount.toFixed(2)}</span>
                <span className={designConfig.resultSubValueLabelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.amountPercentage.results.finalAmountLabel')}</span> {/* القيمة النهائية */}
              </div>
            )}
          </div>
        ) : (
           <>
            <span className={designConfig.resultLabelClass}>{t('calculator.common.noResultYet')}</span>
            {calcResult.error && <p className="text-sm text-red-500 mt-2">{calcResult.error}</p>}
          </>
        )}
      </div>

      {/* Right Column (Inputs) */}
      <div className={`space-y-6 ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'}`}>
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

        <div className="flex gap-4 mt-6">
            <Button onClick={handleReset} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">
                {t('calculator.common.reset')}
            </Button>
            <Button onClick={handleCalculate} disabled={!amount || !percentage} className={designConfig.buttonClass}>
                {t('calculator.amountPercentage.calculate')}
            </Button>
        </div>
      </div>
    </div>
  );
};