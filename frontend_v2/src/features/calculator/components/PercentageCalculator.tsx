// src/features/calculator/components/PercentageCalculator.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProcurementCalculator } from '@/lib/calculator';
import { PercentageResult } from '@/types/calculator';

interface PercentageCalculatorProps {
  // designConfig is still useful for elements we don't explicitly override here,
  // or as a fallback.
  designConfig: {
    fieldGroupClass: string;
    // We will define most styles directly below for clarity and precision
  };
}

export const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const [baseAmount, setBaseAmount] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [calcResult, setCalcResult] = useState<Partial<PercentageResult>>({});

  const handleCalculate = () => {
    setCalcResult({});
    if (!baseAmount || !newAmount || isNaN(Number(baseAmount)) || isNaN(Number(newAmount)) || Number(baseAmount) === 0) {
      setCalcResult({ error: t('calculator.common.validation.invalidNumberOrZeroBase') });
      return;
    }
    const resultValue = ProcurementCalculator.calculatePercentageChange(
      Number(baseAmount),
      Number(newAmount)
    );
    setCalcResult({ percentage: `${resultValue.toFixed(2)}%` });
  };

  const handleReset = () => {
    setBaseAmount('');
    setNewAmount('');
    setCalcResult({});
  };

  const labelStyle = "block mb-1.5 text-[14px] font-semibold text-text-on-light-strong text-right";
  const inputStyle = "h-[40px] rounded-lg border border-inputTheme-border bg-white shadow-input-shadow px-3 py-2 text-sm placeholder:text-inputTheme-placeholder focus:border-cta focus:ring-cta text-right placeholder:text-right";
  const calculateButtonStyle = "w-full h-[42px] bg-cta text-white rounded-lg hover:bg-cta-hover text-[14px] font-normal";
  const resetButtonStyle = "w-full h-[42px] rounded-lg text-sm font-normal border-cta text-cta hover:bg-cta/10 hover:text-cta-dark";

  return (
    <div className={`grid md:grid-cols-2 gap-6 md:gap-x-8 items-stretch`} dir={direction}>
      
      {/* Input Fields Area (Right column in RTL, Left in LTR) */}
      <div className={`flex flex-col justify-between space-y-5 ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'}`}>
        <div className="space-y-5"> {/* Group for inputs; CSS shows 20px gap (space-y-5) */}
          {/* Input Group 1: المبلغ الأساسي (Base Amount) */}
          <div className={designConfig.fieldGroupClass}> {/* CSS shows 8px gap between label and input */}
            <Label 
              htmlFor="percentageBaseAmount" 
              className={labelStyle} 
              style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 600}} // Explicitly making labels bolder
            >
              {t('calculator.percentage.baseAmount')}
            </Label>
            <Input
              id="percentageBaseAmount"
              type="number"
              value={baseAmount}
              onChange={(e) => setBaseAmount(e.target.value)}
              placeholder={t('calculator.common.enterAmountPlaceholder')}
              className={inputStyle}
              dir="rtl" // Assuming numbers are entered RTL style
            />
          </div>

          {/* Input Group 2: المبلغ الجديد (New Amount) */}
          <div className={designConfig.fieldGroupClass}>
            <Label 
              htmlFor="percentageNewAmount" 
              className={labelStyle} 
              style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 600}}
            >
              {t('calculator.percentage.newAmount')}
            </Label>
            <Input
              id="percentageNewAmount"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder={t('calculator.common.enterAmountPlaceholder')}
              className={inputStyle}
              dir="rtl"
            />
          </div>
        </div>

        {/* Buttons at the bottom of the input column */}
        <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4">
            <Button 
                onClick={handleReset} 
                variant="outline" 
                className={resetButtonStyle}
                style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 400}}
            >
                {t('calculator.common.reset')}
            </Button>
            <Button 
                onClick={handleCalculate} 
                disabled={!baseAmount || !newAmount} 
                className={calculateButtonStyle}
                style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 400}}
            >
                {t('calculator.percentage.calculate')}
            </Button>
        </div>
      </div>

      {/* Result Display Area (Left column in RTL, Right in LTR) - Styled Card */}
      <div 
        className={`bg-[#ECFFEA] rounded-lg min-h-[333px] flex flex-col items-center justify-center text-center p-6 ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}
      >
        {calcResult.error ? (
          <p className="text-sm text-red-500 mt-2" style={{fontFamily: 'var(--font-primary-arabic)'}}>{calcResult.error}</p>
        ) : (
          <>
            <span 
              className="text-[14px] font-normal text-black mb-1" 
              style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 400, lineHeight: '20px'}}
            >
              {t('calculator.percentage.resultLabel')}
            </span>
            <span 
              className="text-5xl font-bold text-[#51B749] leading-none mt-2" 
              style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 'bold', direction: 'ltr' }}
            >
              {calcResult.percentage !== undefined ? calcResult.percentage : "0.00%"}
            </span>
          </>
        )}
      </div>
    </div>
  );
};