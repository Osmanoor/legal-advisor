// src/features/calculator/components/VatCalculator.tsx
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VATCalculator } from '@/lib/calculator'; // Assuming VATCalculator is in this path
import { VATResult } from '@/types/calculator';

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
  const [vatAmountInput, setVatAmountInput] = useState(''); // Renamed to avoid conflict
  const [vatRate, setVatRate] = useState('15');
  const [vatResult, setVatResult] = useState<Partial<VATResult>>({}); // Use Partial as not all fields always present
  const [vatOperation, setVatOperation] = useState<VatOperation>('total');

  const operationOptions = [
    { value: 'total', labelKey: 'calculator.vat.operation.total' }, // "حساب المبلغ مع الضريبة"
    { value: 'extract', labelKey: 'calculator.vat.operation.extract' }, // "استخراج المبلغ الأصلي من مبلغ الضريبة"
    { value: 'amount', labelKey: 'calculator.vat.operation.amount' },  // "حساب مبلغ الضريبة"
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
      case 'total': // User inputs amount WITHOUT VAT, we calculate total WITH VAT
        const netForTotal = amount;
        const vatForTotal = (netForTotal * rate) / 100;
        result = {
          netAmount: netForTotal,
          vatAmount: vatForTotal,
          totalAmount: netForTotal + vatForTotal,
        };
        break;
      case 'extract': // User inputs amount WITH VAT, we extract original and VAT amount
        const totalForExtract = amount;
        const originalAmount = totalForExtract / (1 + rate / 100);
        const vatExtracted = totalForExtract - originalAmount;
        result = {
          netAmount: originalAmount, // Original amount is net
          vatAmount: vatExtracted,
          totalAmount: totalForExtract,
        };
        break;
      case 'amount': // User inputs amount (could be net or total depending on interpretation, design is ambiguous)
                     // Let's assume user inputs TOTAL amount, and we calculate VAT portion and Net.
        const totalForAmountCalc = amount;
        const vatPortion = (totalForAmountCalc * rate) / (100 + rate); // VAT from total
        const netFromTotal = totalForAmountCalc - vatPortion;
        result = {
          netAmount: netFromTotal,
          vatAmount: vatPortion,
          totalAmount: totalForAmountCalc,
        };
        break;
    }
    setVatResult(result);
  };
  
  const handleResetVat = () => {
    setVatAmountInput('');
    // setVatRate('15'); // Optionally reset rate
    setVatResult({});
    // setVatOperation('total'); // Optionally reset operation
  };


  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start" dir={direction}>
      {/* Left Column (Result Display for VAT) */}
      <div className={`${designConfig.resultDisplayContainerClass} ${direction === 'rtl' ? 'md:order-2' : 'md:order-1'}`}>
        {Object.keys(vatResult).length > 0 && !vatResult.error ? (
          <div className="w-full px-4">
            {vatResult.netAmount !== undefined && (
              <div className={designConfig.resultSubValueRowClass}>
                <span className={designConfig.resultSubValueAmountClass} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{vatResult.netAmount.toFixed(2)}</span>
                <span className={designConfig.resultSubValueLabelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.vat.results.netAmountLabel')}</span> {/* القيمة */}
              </div>
            )}
            {vatResult.vatAmount !== undefined && (
              <div className={`${designConfig.resultSubValueRowClass} my-3 py-3 border-y ${vatResult.netAmount === undefined ? 'border-t-0' : 'border-resultTheme-divider'}`}>
                <span className={designConfig.resultSubValueAmountClass} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{vatResult.vatAmount.toFixed(2)}</span>
                <span className={designConfig.resultSubValueLabelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.vat.results.vatAmountLabel')}</span> {/* قيمة الضريبة */}
              </div>
            )}
            {vatResult.totalAmount !== undefined && (
              <div className={designConfig.resultSubValueRowClass}>
                <span className={designConfig.resultSubValueAmountClass} style={{fontFamily: 'var(--font-primary-arabic)', direction: 'ltr'}}>{vatResult.totalAmount.toFixed(2)}</span>
                <span className={designConfig.resultSubValueLabelClass} style={{fontFamily: 'var(--font-primary-arabic)'}}>{t('calculator.vat.results.totalAmountLabel')}</span> {/* المبلغ الكلي */}
              </div>
            )}
          </div>
        ) : (
          <>
            <span className={designConfig.resultLabelClass}>{t('calculator.common.noResultYet')}</span>
            {vatResult.error && <p className="text-sm text-red-500 mt-2">{vatResult.error}</p>}
          </>
        )}
      </div>

      {/* Right Column (Inputs for VAT) */}
      <div className={`space-y-5 ${direction === 'rtl' ? 'md:order-1' : 'md:order-2'}`}>
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

        <div className="flex gap-4 mt-6">
            <Button onClick={handleResetVat} variant="outline" className="w-full h-[42px] rounded-lg text-sm font-medium">
                {t('calculator.common.reset')}
            </Button>
            <Button onClick={handleCalculateVat} disabled={!vatAmountInput} className={designConfig.buttonClass}>
                {t('calculator.vat.calculate')}
            </Button>
        </div>
      </div>
    </div>
  );
};