// src/pages/CalculatorPage.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Percent, CalendarDays, FileText  } from 'lucide-react';

import { PercentageCalculator } from '@/features/calculator/components/PercentageCalculator';
import { VatCalculator } from '@/features/calculator/components/VatCalculator';
import { AmountPercentageCalculator } from '@/features/calculator/components/AmountPercentageCalculator';
import { DateConversionForm } from '@/features/calculator/components/DateConversionForm';
import { DateDifferenceForm } from '@/features/calculator/components/DateDifferenceForm';
import { DateDurationForm } from '@/features/calculator/components/DateDurationForm';
import { WeightedPercentageCalculator } from '@/features/calculator/components/WeightedPercentageCalculator';

type NumericalCalcType = 'percentage' | 'vat' | 'amountPercentage';
type DateCalcType = 'conversion' | 'difference' | 'duration';
type MainCalcTab = 'numericalValues' | 'dates' | 'weightedPercentage';

export default function CalculatorPage() {
  const { t, direction } = useLanguage();
  
  const [activeMainTab, setActiveMainTab] = useState<MainCalcTab>('numericalValues');
  const [selectedNumericalCalc, setSelectedNumericalCalc] = useState<NumericalCalcType>('percentage');
  const [selectedDateCalc, setSelectedDateCalc] = useState<DateCalcType>('conversion');

  const designConfig = {
    fieldGroupClass: "space-y-2 text-right",
    labelClass: "block mb-2 text-[14px] font-normal text-inputTheme-text",
    inputClass: "h-[40px] rounded-lg border border-inputTheme-border bg-white shadow-input-shadow px-3 py-2 text-sm placeholder:text-inputTheme-placeholder focus:border-cta focus:ring-cta text-right placeholder:text-right",
    selectTriggerClass: "h-[40px] rounded-lg border border-inputTheme-border bg-white shadow-input-shadow px-3 text-sm data-[placeholder]:text-inputTheme-placeholder focus:border-cta focus:ring-cta text-right",
    selectContentClass: "bg-white border-inputTheme-border rounded-lg shadow-lg text-right",
    selectItemClass: "justify-end data-[highlighted]:bg-gray-100 data-[state=checked]:bg-cta/10 data-[state=checked]:text-cta",
    buttonClass: "w-full h-[42px] bg-cta text-white rounded-lg hover:bg-cta-hover text-[14px] font-normal",
    resultDisplayContainerClass: "bg-resultTheme-background rounded-lg min-h-[333px] flex flex-col items-center justify-center text-center p-6",
    resultLabelClass: "text-[14px] font-normal text-resultTheme-labelText mb-1",
    resultValueClass: "text-design-52 font-normal text-resultTheme-valueText leading-none mt-2",
    resultSubValueContainerClass: "w-full space-y-1.5 mt-4 pt-4",
    resultSubValueRowClass: "flex justify-between items-center w-full py-2",
    resultSubValueLabelClass: "text-[14px] font-normal text-resultTheme-labelText",
    resultSubValueAmountClass: "text-[32px] font-normal text-resultTheme-valueText leading-tight",
  };

  const numericalCalculatorOptions = [
    { value: 'percentage', labelKey: 'calculator.subTabs.percentageChange' },
    { value: 'vat', labelKey: 'calculator.subTabs.vatCalculation' },
    { value: 'amountPercentage', labelKey: 'calculator.subTabs.amountWithPercentage' },
  ];

  const dateCalculatorOptions = [
    { value: 'conversion', labelKey: 'calculator.subTabs.dateConversion' },
    { value: 'difference', labelKey: 'calculator.subTabs.dateDifference' },
    { value: 'duration', labelKey: 'calculator.subTabs.dateDuration' },
  ];

  const renderNumericalCalculator = () => {
    switch (selectedNumericalCalc) {
      case 'percentage': return <PercentageCalculator designConfig={designConfig} />;
      case 'vat': return <VatCalculator designConfig={designConfig} />;
      case 'amountPercentage': return <AmountPercentageCalculator designConfig={designConfig} />;
      default: return <PercentageCalculator designConfig={designConfig} />;
    }
  };

  const renderDateCalculator = () => {
     switch (selectedDateCalc) {
      case 'conversion': return <DateConversionForm designConfig={designConfig} />;
      case 'difference': return <DateDifferenceForm designConfig={designConfig} />;
      case 'duration': return <DateDurationForm designConfig={designConfig} />;
      default: return <DateConversionForm designConfig={designConfig} />;
    }
  };

  const tabsData = [
    { value: 'numericalValues', labelKey: 'calculator.tabs.numericalValues', Icon: Percent },
    { value: 'dates', labelKey: 'calculator.tabs.dates', Icon: CalendarDays },
    { value: 'weightedPercentage', labelKey: 'calculator.tabs.weightedPercentage', Icon: FileText },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8" dir={direction}>
      <div className={`mb-6 md:mb-8 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
        <h1 
            className="text-design-22 font-medium text-text-on-light-strong"
            style={{fontFamily: 'var(--font-primary-arabic)', fontWeight: 500, lineHeight: '130%'}}
        >
            {t('calculator.mainTitle')}
        </h1>
        <p 
            className="text-[14px] text-text-on-light-faint mt-1"
            style={{fontFamily: 'var(--font-primary-latin)', fontWeight: 400, lineHeight: '150%'}}
        >
            {t('calculator.mainSubtitle')}
        </p>
      </div>

      <div className="w-full max-w-[854px] mx-auto">
        <Tabs defaultValue="numericalValues" value={activeMainTab} onValueChange={(v) => setActiveMainTab(v as MainCalcTab)} className="w-full">
          <TabsList className={`w-full flex mb-6 ${direction === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
            {tabsData.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="flex-1 flex flex-row items-center justify-center"
              >
                <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <tab.Icon className={`w-5 h-5`} />
                    <span>{t(tab.labelKey)}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="numericalValues">
            <div className={`mb-6 md:w-[370px] ${direction === 'rtl' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              <Label 
                htmlFor="numerical-calc-type" 
                className={`${designConfig.labelClass} ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                style={{fontFamily: 'var(--font-primary-arabic)'}}
              >
                {t('calculator.selectNumericalType')}
              </Label>
              <Select
                dir={direction}
                value={selectedNumericalCalc}
                onValueChange={(value) => setSelectedNumericalCalc(value as NumericalCalcType)}
              >
                <SelectTrigger 
                  id="numerical-calc-type" 
                  className={`${designConfig.selectTriggerClass} ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                >
                  <SelectValue placeholder={t('calculator.selectCalculation')} />
                </SelectTrigger>
                <SelectContent className={designConfig.selectContentClass}>
                  {numericalCalculatorOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className={designConfig.selectItemClass} textValue={t(opt.labelKey)}>
                      {t(opt.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {renderNumericalCalculator()}
          </TabsContent>

          <TabsContent value="dates">
             <div className={`mb-6 md:w-[370px] ${direction === 'rtl' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              <Label 
                htmlFor="date-calc-type" 
                className={`${designConfig.labelClass} ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                style={{fontFamily: 'var(--font-primary-arabic)'}}
              >
                {t('calculator.selectDateType')}
              </Label>
              <Select
                dir={direction}
                value={selectedDateCalc}
                onValueChange={(value) => setSelectedDateCalc(value as DateCalcType)}
              >
                <SelectTrigger 
                  id="date-calc-type" 
                  className={`${designConfig.selectTriggerClass} ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                >
                  <SelectValue placeholder={t('calculator.selectCalculation')} />
                </SelectTrigger>
                <SelectContent className={designConfig.selectContentClass}>
                  {dateCalculatorOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className={designConfig.selectItemClass} textValue={t(opt.labelKey)}>
                      {t(opt.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {renderDateCalculator()}
          </TabsContent>
          <TabsContent value="weightedPercentage">
            <WeightedPercentageCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}