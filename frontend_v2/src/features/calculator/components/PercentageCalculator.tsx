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
      setCalcResult({ error: t('calculator.common.validation.invalidNumber') });
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

  // Specific styles for Percentage Calculator based on the new design image
  const labelStyle = "block mb-1.5 text-[14px] font-semibold text-text-on-light-strong text-right"; // Montserrat-Arabic, 14px, weight 400 (but design looks bolder like 500/600) -> using font-semibold
  const inputStyle = "h-[40px] rounded-lg border border-inputTheme-border bg-white shadow-input-shadow px-3 py-2 text-sm placeholder:text-inputTheme-placeholder focus:border-cta focus:ring-cta text-right placeholder:text-right";
  const calculateButtonStyle = "w-full h-[42px] bg-cta text-white rounded-lg hover:bg-cta-hover text-[14px] font-normal"; // font-weight 400
  const resetButtonStyle = "w-full h-[42px] rounded-lg text-sm font-normal border-cta text-cta hover:bg-cta/10 hover:text-cta-dark"; // Ensure cta-dark is defined or adjust hover

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-8 items-stretch`}>
      
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

      {/* Result Display Area (Left column in RTL, Right in LTR) */}
      <div 
        className={`bg-resultTheme-background rounded-lg min-h-[250px] md:h-full md:min-h-[333px] flex flex-col items-center justify-center text-center p-6 ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}
        // CSS: background: #ECFFEA; border-radius: 8px; width: 367px; height: 333px;
      >
        <span 
          className="text-[14px] font-normal text-text-on-light-strong mb-1" // القيمة: 14px, normal weight (400), black
          style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 400, lineHeight: '20px'}}
        >
          {t('calculator.percentage.resultLabel')}
        </span>
        <span 
          className="text-design-52 font-bold text-resultTheme-valueText leading-none mt-2" // 10.00%: 52px, bold, green #51B749
          style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 'bold', direction: 'ltr' }}
        >
          {calcResult.percentage || "0.00%"}
        </span>
        {calcResult.error && <p className="text-sm text-red-500 mt-2">{calcResult.error}</p>}
      </div>

    </div>
  );
};