// src/features/calculator/components/VatCalculator.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VATCalculator } from '@/lib/calculator'; // Assuming VATCalculator is in this path
import { VATResult } from '@/types/calculator';
import { trackEvent } from '@/lib/analytics';

interface VatCalculatorProps {
  designConfig: {
    fieldGroupClass: string;
    labelClass: string;
    inputClass: string;
    buttonClass: string;
    selectTriggerClass: string;
    selectContentClass: string;
    selectItemClass: string;
    resultDisplayContainerClass: string;
    resultLabelClass: string; // For "القيمة", "قيمة الضريبة", "المبلغ الكلي"
    resultValueClass: string; // For the numbers like 100, 15, 115
    resultSubValueContainerClass: string;
    resultSubValueRowClass: string;
    resultSubValueLabelClass: string;
    resultSubValueAmountClass: string;
  };
}

type VatOperation = 'total' | 'extract' | 'amount'; // From your original CalculatorPage

export const VatCalculator: React.FC<VatCalculatorProps> = ({ designConfig }) => {
  const { t, direction } = useLanguage();
  const [vatAmountInput, setVatAmountInput] = useState('');
  const [vatRate, setVatRate] = useState('15');
  const [vatResult, setVatResult] = useState<Partial<VATResult>>({});
  const [vatOperation, setVatOperation] = useState<VatOperation>('total');

  const operationOptions = [
    { value: 'total', labelKey: 'calculator.vat.operation.total' },
    { value: 'extract', labelKey: 'calculator.vat.operation.extract' },
    { value: 'amount', labelKey: 'calculator.vat.operation.amount' },
  ];

  const handleCalculateVat = () => {
    if (!vatAmountInput || isNaN(Number(vatAmountInput)) || isNaN(Number(vatRate))) {
      setVatResult({ error: t('calculator.common.validation.invalidNumber') } as any);
      return;
    }
    const amount = Number(vatAmountInput);
    const rate = Number(vatRate);
    let result: Partial<VATResult> = {};

    switch (vatOperation) {
      case 'total':
        const netForTotal = amount;
        const vatForTotal = (netForTotal * rate) / 100;
        result = {
          netAmount: netForTotal,
          vatAmount: vatForTotal,
          totalAmount: netForTotal + vatForTotal,
        };
        break;
      case 'extract':
        const totalForExtract = amount;
        const originalAmount = totalForExtract / (1 + rate / 100);
        const vatExtracted = totalForExtract - originalAmount;
        result = {
          netAmount: originalAmount,
          vatAmount: vatExtracted,
          totalAmount: totalForExtract,
        };
        break;
      case 'amount':
        const totalForAmountCalc = amount;
        const vatPortion = (totalForAmountCalc * rate) / (100 + rate);
        const netFromTotal = totalForAmountCalc - vatPortion;
        result = {
          netAmount: netFromTotal,
          vatAmount: vatPortion,
          totalAmount: totalForAmountCalc,
        };
        break;
    }
    setVatResult(result);
    trackEvent({ event: 'feature_used', feature_name: 'vat_calculator' });
  };
  
  const handleResetVat = () => {
    setVatAmountInput('');
    setVatResult({});
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start" dir={direction}>
      {/* Inputs Column for VAT */}
      <div className={`space-y-5 ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'} flex flex-col`}>
        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="vatOperation" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.vat.operation.label')}
          </Label>
          <Select dir={direction} value={vatOperation} onValueChange={(value) => setVatOperation(value as VatOperation)}>
            <SelectTrigger id="vatOperation" className={designConfig.selectTriggerClass}>
              <SelectValue placeholder={t('calculator.vat.selectOperationPlaceholder')} />
            </SelectTrigger>
            <SelectContent className={designConfig.selectContentClass}>
              {operationOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className={designConfig.selectItemClass}>
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="vatAmountInput" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.vat.amountInputLabel')}
          </Label>
          <Input
            id="vatAmountInput"
            type="number"
            value={vatAmountInput}
            onChange={(e) => setVatAmountInput(e.target.value)}
            placeholder={t('calculator.common.enterAmountPlaceholder')}
            className={designConfig.inputClass}
            dir="rtl"
          />
        </div>
        
        <div className={designConfig.fieldGroupClass}>
          <Label htmlFor="vatRate" className={designConfig.labelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>
            {t('calculator.vat.rateLabel')} (%)
          </Label>
          <Input
            id="vatRate"
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            placeholder="15"
            className={designConfig.inputClass}
            dir="rtl"
          />
        </div>

        <div className="flex gap-4 mt-auto pt-4">
            <Button onClick={handleResetVat} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">
                {t('calculator.common.reset')}
            </Button>
            {/* Corrected Button syntax */}
            <Button onClick={handleCalculateVat} disabled={!vatAmountInput} className={`${designConfig.buttonClass} w-full`}>
                {t('calculator.vat.calculate')}
            </Button>
        </div>
      </div>
      {/* Result Display Column (Styled Card) */}
      <div className={`${designConfig.resultDisplayContainerClass} ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'} bg-[#ECFFEA] rounded-lg p-6 min-h-[333px] flex flex-col justify-center`}>
        {Object.keys(vatResult).length > 0 && !vatResult.error ? (
          <div className="w-full space-y-3">
            {vatResult.netAmount !== undefined && (
              <div className={`${designConfig.resultSubValueRowClass} flex justify-between items-center`}>
                <span className={`${designConfig.resultSubValueLabelClass} text-black`} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.vat.results.netAmountLabel')}</span>
                <span className={`${designConfig.resultSubValueAmountClass} text-[#51B749]`} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{vatResult.netAmount.toFixed(2)}</span>
              </div>
            )}
            {vatResult.vatAmount !== undefined && (
              // Removed border classes for a cleaner look within the card, can be added back if needed
              <div className={`${designConfig.resultSubValueRowClass} flex justify-between items-center py-3 my-3 border-y border-green-200`}>
                <span className={`${designConfig.resultSubValueLabelClass} text-black`} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.vat.results.vatAmountLabel')}</span>
                <span className={`${designConfig.resultSubValueAmountClass} text-[#51B749]`} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{vatResult.vatAmount.toFixed(2)}</span>
              </div>
            )}
            {vatResult.totalAmount !== undefined && (
              <div className={`${designConfig.resultSubValueRowClass} flex justify-between items-center`}>
                <span className={`${designConfig.resultSubValueLabelClass} text-black`} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.vat.results.totalAmountLabel')}</span>
                <span className={`${designConfig.resultSubValueAmountClass} text-[#51B749]`} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{vatResult.totalAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <span className={`${designConfig.resultLabelClass} text-gray-600`} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.common.noResultYet')}</span>
            {vatResult.error && <p className="text-sm text-red-500 mt-2" style={{fontFamily: 'var(--font-primary-arabic)'}}>{vatResult.error}</p>}
          </div>
        )}
      </div>

      
    </div>
  );
};