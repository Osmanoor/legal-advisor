// src/pages/CalculatorPage.tsx
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProcurementCalculator, VATCalculator, DateConverter } from '@/lib/calculator';
import { DateTime } from 'luxon';
import {
  PercentageResult,
  VATResult,
  AmountWithPercentageResult,
  DateDifference
} from '@/types/calculator';

import {
  Calculator,
  Calendar,
  Percent,
  PoundSterling,
  Type
} from 'lucide-react';

export default function CalculatorPage() {
  // Percentage Calculator State
  const [baseAmount, setBaseAmount] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [percentageResult, setPercentageResult] = useState<string>('');

  // VAT Calculator State
  const [vatAmount, setVatAmount] = useState('');
  const [vatRate, setVatRate] = useState('15');
  const [vatResult, setVatResult] = useState<VATResult>({});
  const [vatOperation, setVatOperation] = useState<'total' | 'extract' | 'amount'>('total');

  // Amount with Percentage State
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState('');
  const [percentageAmountResult, setPercentageAmountResult] = useState<AmountWithPercentageResult>({});

  // Date Converter State
  const [gregorianDate, setGregorianDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [gregorianResult, setGregorianResult] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateDifference, setDateDifference] = useState<DateDifference>({});
  const [durationDays, setDurationDays] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [durationYears, setDurationYears] = useState('');
  const [calculatedEndDate, setCalculatedEndDate] = useState('');
  const [hijriStartDate, setHijriStartDate] = useState('');
  const [hijriDurationDays, setHijriDurationDays] = useState('');
  const [hijriDurationMonths, setHijriDurationMonths] = useState('');
  const [hijriDurationYears, setHijriDurationYears] = useState('');
  const [calculatedHijriEndDate, setCalculatedHijriEndDate] = useState('');

  // Tafqit State
  const [tafqitAmount, setTafqitAmount] = useState('');
  const [tafqitLanguage, setTafqitLanguage] = useState<'ar' | 'en'>('ar');
  const [tafqitResult, setTafqitResult] = useState('');

  const { t, language } = useLanguage();

  // Calculation Functions
  const calculatePercentageChange = () => {
    if (!baseAmount || !newAmount) return;
    const result = ProcurementCalculator.calculatePercentageChange(
      Number(baseAmount),
      Number(newAmount)
    );
    setPercentageResult(`${result.toFixed(2)}%`);
  };

  const calculateVAT = () => {
    if (!vatAmount) return;

    switch (vatOperation) {
      case 'total':
        const totalResult = VATCalculator.calculateTotalWithVAT(
          Number(vatAmount),
          Number(vatRate)
        );
        setVatResult(totalResult);
        break;
      case 'extract':
        const extractResult = VATCalculator.extractAmountFromVAT(
          Number(vatAmount),
          Number(vatRate)
        );
        setVatResult(extractResult);
        break;
      case 'amount':
        const amountResult = VATCalculator.calculateVATAmount(
          Number(vatAmount),
          Number(vatRate)
        );
        setVatResult(amountResult);
        break;
    }
  };

  const calculateAmountWithPercentage = () => {
    if (!amount || !percentage) return;
    const result = ProcurementCalculator.calculateAmountWithPercentage(
      Number(amount),
      Number(percentage)
    );
    setPercentageAmountResult(result);
  };

  // Date Functions
  const convertHijriToGregorian = () => {
    try {
      if (!DateConverter.isValidHijriDate(hijriDate)) {
        return;
      }
      const result = DateConverter.hijriToGregorian(hijriDate);
      setGregorianResult(DateTime.fromJSDate(result).toFormat('yyyy-MM-dd'));
    } catch (error) {
      console.error(error);
    }
  };

  const convertGregorianToHijri = () => {
    try {
      if (!gregorianDate) return;
      const result = DateConverter.gregorianToHijri(new Date(gregorianDate));
      const monthName = DateConverter.getHijriMonthName(parseInt(result.split('/')[1]));
      setHijriDate(`${result} (${monthName})`);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateHijriFutureDate = () => {
    try {
      if (!DateConverter.isValidHijriDate(hijriStartDate)) {
        alert(t('calculator.common.validation.invalidDate'));
        return;
      }

      const result = DateConverter.HijricalculateEndDate(
        hijriStartDate,
        {
          days: hijriDurationDays ? parseInt(hijriDurationDays) : 0,
          months: hijriDurationMonths ? parseInt(hijriDurationMonths) : 0,
          years: hijriDurationYears ? parseInt(hijriDurationYears) : 0
        }
      );

      const monthName = DateConverter.getHijriMonthName(parseInt(result.split('/')[1]));
      setCalculatedHijriEndDate(`${result} (${monthName})`);
    } catch (error) {
      alert(t('calculator.common.error'));
    }
  };


  const calculateDateDifference = () => {
    try {
      if (!startDate || !endDate) {
        alert(t('calculator.common.validation.required'));
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validate dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        alert(t('calculator.common.validation.invalidDate'));
        return;
      }

      // Check if end date is after start date
      if (end < start) {
        alert(t('calculator.common.validation.endDateBeforeStart'));
        return;
      }

      const result = DateConverter.calculateDateDifference(start, end);
      setDateDifference(result);
    } catch (error) {
      console.error('Date difference calculation error:', error);
      alert(t('calculator.common.error'));
    }
  };

  const calculateFutureDate = () => {
    try {
      if (!startDate) {
        alert(t('calculator.common.validation.required'));
        return;
      }

      // Parse the input date string as a local date using Luxon
      const start = DateTime.fromFormat(startDate, 'yyyy-MM-dd', { zone: 'local' }).toJSDate();

      if (isNaN(start.getTime())) {
        alert(t('calculator.common.validation.invalidDate'));
        return;
      }

      // Validate at least one duration field is filled
      if (!durationDays && !durationMonths && !durationYears) {
        alert(t('calculator.date.duration.validation.required'));
        return;
      }

      // Calculate end date
      const result = DateConverter.calculateEndDate(
        start,
        {
          days: durationDays ? parseInt(durationDays) : 0,
          months: durationMonths ? parseInt(durationMonths) : 0,
          years: durationYears ? parseInt(durationYears) : 0
        }
      );

      // Format the result with both Gregorian and Hijri dates
      const gregorianResult = DateTime.fromJSDate(result).toFormat('yyyy-MM-dd');
      const hijriResult = DateConverter.gregorianToHijri(result);
      const hijriMonth = DateConverter.getHijriMonthName(parseInt(hijriResult.split('/')[1]));

      setCalculatedEndDate(
        t('calculator.date.duration.resultFormat', {
          gregorian: gregorianResult,
          hijri: `${hijriResult} (${hijriMonth})`
        })
      );

    } catch (error) {
      console.error('Future date calculation error:', error);
      alert(t('calculator.common.error'));
    }
  };

  // Optional: Helper function to format duration for display
  const formatDuration = (years: number, months: number, days: number): string => {
    const parts = [];

    if (years > 0) {
      parts.push(`${years} ${t(years === 1 ? 'calculator.date.duration.year' : 'calculator.date.duration.years')}`);
    }

    if (months > 0) {
      parts.push(`${months} ${t(months === 1 ? 'calculator.date.duration.month' : 'calculator.date.duration.months')}`);
    }

    if (days > 0) {
      parts.push(`${days} ${t(days === 1 ? 'calculator.date.duration.day' : 'calculator.date.duration.days')}`);
    }

    return parts.join(t('calculator.date.duration.separator'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('calculator.title')}
          </h1>
          <p className="text-gray-600">
            Choose a calculator tool to get started
          </p>
        </div>

        <Card className="bg-white shadow-md border-0">
          <CardContent className="p-6">
            <Tabs defaultValue="percentage" className="space-y-6">
              <TabsList className="grid grid-cols-5 gap-4 bg-gray-100 p-1">
                <TabsTrigger
                  value="percentage"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Percent className="w-4 h-4" />
                  <span className="hidden md:inline">{t('calculator.tabs.percentage')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="vat"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Calculator className="w-4 h-4" />
                  <span className="hidden md:inline">{t('calculator.tabs.vat')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="amount"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <PoundSterling className="w-4 h-4" />
                  <span className="hidden md:inline">{t('calculator.tabs.amount')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="date"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden md:inline">{t('calculator.tabs.date')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tafqit"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden md:inline">{t('calculator.tabs.tafqit')}</span>
                </TabsTrigger>
              </TabsList>

              {/* Percentage Calculator Tab */}
              <TabsContent value="percentage" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.percentage.baseAmount')}</Label>
                      <Input
                        type="number"
                        value={baseAmount}
                        onChange={(e) => setBaseAmount(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.percentage.newAmount')}</Label>
                      <Input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <Button
                      onClick={calculatePercentageChange}
                      disabled={!baseAmount || !newAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {t('calculator.percentage.calculate')}
                    </Button>
                  </div>

                  {percentageResult && (
                    <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center">
                      <span className="text-sm text-blue-600 mb-2">{t('calculator.percentage.result')}</span>
                      <span className="text-4xl font-bold text-blue-700">{percentageResult}</span>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* VAT Calculator Tab */}
              <TabsContent value="vat" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.vat.operation.label')}</Label>
                      <Select
                        value={vatOperation}
                        onValueChange={(value: 'total' | 'extract' | 'amount') => setVatOperation(value)}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="total">{t('calculator.vat.operation.total')}</SelectItem>
                          <SelectItem value="extract">{t('calculator.vat.operation.extract')}</SelectItem>
                          <SelectItem value="amount">{t('calculator.vat.operation.amount')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.vat.amount')}</Label>
                      <Input
                        type="number"
                        value={vatAmount}
                        onChange={(e) => setVatAmount(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.vat.rate')}</Label>
                      <Input
                        type="number"
                        value={vatRate}
                        onChange={(e) => setVatRate(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <Button
                      onClick={calculateVAT}
                      disabled={!vatAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {t('calculator.vat.calculate')}
                    </Button>
                  </div>

                  {Object.keys(vatResult).length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                      {vatResult.netAmount !== undefined && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                          <span className="text-gray-600">{t('calculator.vat.results.net')}</span>
                          <span className="text-xl font-semibold text-blue-700">
                            {vatResult.netAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {vatResult.vatAmount !== undefined && (
                        <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                          <span className="text-gray-600">{t('calculator.vat.results.vat')}</span>
                          <span className="text-xl font-semibold text-blue-700">
                            {vatResult.vatAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {vatResult.totalAmount !== undefined && (
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-gray-600">{t('calculator.vat.results.total')}</span>
                          <span className="text-2xl font-bold text-blue-700">
                            {vatResult.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Amount with Percentage Tab */}
              <TabsContent value="amount" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.amountPercentage.amount')}</Label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.amountPercentage.percentage')}</Label>
                      <Input
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <Button
                      onClick={calculateAmountWithPercentage}
                      disabled={!amount || !percentage}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {t('calculator.amountPercentage.calculate')}
                    </Button>
                  </div>

                  {Object.keys(percentageAmountResult).length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                        <span className="text-gray-600">{t('calculator.amountPercentage.results.original')}</span>
                        <span className="text-xl font-semibold text-blue-700">
                          {percentageAmountResult.originalAmount?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                        <span className="text-gray-600">{t('calculator.amountPercentage.results.adjustment')}</span>
                        <span className="text-xl font-semibold text-blue-700">
                          {percentageAmountResult.adjustmentAmount?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600">{t('calculator.amountPercentage.results.final')}</span>
                        <span className="text-2xl font-bold text-blue-700">
                          {percentageAmountResult.finalAmount?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Date Calculator Tab */}
              <TabsContent value="date" className="space-y-8">
                {/* 1. Date Conversion Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {t('calculator.date.conversion.title')}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Gregorian to Hijri */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">{t('calculator.date.gregorian.label')}</Label>
                        <Input
                          type="date"
                          value={gregorianDate}
                          onChange={(e) => setGregorianDate(e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <Button
                        onClick={convertGregorianToHijri}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!gregorianDate}
                      >
                        {t('calculator.date.gregorian.convert')}
                      </Button>

                      {hijriDate && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <span className="block text-sm text-gray-600 mb-1">
                            {t('calculator.date.hijri.result')}
                          </span>
                          <span className="text-lg font-semibold text-blue-700" dir="rtl">
                            {hijriDate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hijri to Gregorian */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">{t('calculator.date.hijri.label')}</Label>
                        <Input
                          type="text"
                          value={hijriDate}
                          onChange={(e) => setHijriDate(e.target.value)}
                          placeholder={t('calculator.date.hijri.placeholder')}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-right"
                          dir="rtl"
                        />
                        
                      </div>

                      <Button
                        onClick={convertHijriToGregorian}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!hijriDate}
                      >
                        {t('calculator.date.hijri.convert')}
                      </Button>

                      {gregorianResult && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <span className="block text-sm text-gray-600 mb-1">
                            {t('calculator.date.gregorian.result')}
                          </span>
                          <span className="text-lg font-semibold text-blue-700">
                            {gregorianResult}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Date Difference Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {t('calculator.date.difference.title')}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Gregorian Date Difference */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.difference.start')}</Label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.difference.end')}</Label>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={calculateDateDifference}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!startDate || !endDate}
                      >
                        {t('calculator.date.difference.calculate')}
                      </Button>

                      {Object.keys(dateDifference).length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('calculator.date.difference.years')}</span>
                            <span className="font-semibold text-blue-700">{dateDifference.years}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('calculator.date.difference.months')}</span>
                            <span className="font-semibold text-blue-700">{dateDifference.months}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('calculator.date.difference.days')}</span>
                            <span className="font-semibold text-blue-700">{dateDifference.days}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hijri Date Difference */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.hijriDuration.start')}</Label>
                          <Input
                            type="text"
                            placeholder={t('calculator.date.hijri.placeholder')}
                            value={hijriStartDate}
                            onChange={(e) => setHijriStartDate(e.target.value)}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-right"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.difference.end')}</Label>
                          <Input
                            type="text"
                            placeholder={t('calculator.date.hijri.placeholder')}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => calculateHijriFutureDate()}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!hijriStartDate || !endDate}
                      >
                        {t('calculator.date.difference.calculate')}
                      </Button>

                      {Object.keys(dateDifference).length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('calculator.date.difference.years')}</span>
                            <span className="font-semibold text-blue-700">{dateDifference.years}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('calculator.date.difference.months')}</span>
                            <span className="font-semibold text-blue-700">{dateDifference.months}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('calculator.date.difference.days')}</span>
                            <span className="font-semibold text-blue-700">{dateDifference.days}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Duration Calculator Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {t('calculator.date.duration.title')}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Gregorian Duration Calculator */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">{t('calculator.date.duration.start')}</Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.duration.duration.days')}</Label>
                          <Input
                            type="number"
                            value={durationDays}
                            onChange={(e) => setDurationDays(e.target.value)}
                            min="0"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.duration.duration.months')}</Label>
                          <Input
                            type="number"
                            value={durationMonths}
                            onChange={(e) => setDurationMonths(e.target.value)}
                            min="0"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.duration.duration.years')}</Label>
                          <Input
                            type="number"
                            value={durationYears}
                            onChange={(e) => setDurationYears(e.target.value)}
                            min="0"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={calculateFutureDate}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!startDate || (!durationDays && !durationMonths && !durationYears)}
                      >
                        {t('calculator.date.duration.calculate')}
                      </Button>

                      {calculatedEndDate && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <span className="block text-sm text-gray-600 mb-1">
                            {t('calculator.date.duration.result')}
                          </span>
                          <span className="text-lg font-semibold text-blue-700">
                            {calculatedEndDate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hijri Duration Calculator */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">{t('calculator.date.hijriDuration.start')}</Label>
                        <Input
                          type="text"
                          placeholder={t('calculator.date.hijri.placeholder')}
                          value={hijriStartDate}
                          onChange={(e) => setHijriStartDate(e.target.value)}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-right"
                          dir="rtl"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.duration.duration.days')}</Label>
                          <Input
                            type="number"
                            value={hijriDurationDays}
                            onChange={(e) => setHijriDurationDays(e.target.value)}
                            min="0"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.duration.duration.months')}</Label>
                          <Input
                            type="number"
                            value={hijriDurationMonths}
                            onChange={(e) => setHijriDurationMonths(e.target.value)}
                            min="0"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">{t('calculator.date.duration.duration.years')}</Label>
                          <Input
                            type="number"
                            value={hijriDurationYears}
                            onChange={(e) => setHijriDurationYears(e.target.value)}
                            min="0"
                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={calculateHijriFutureDate}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!hijriStartDate || (!hijriDurationDays && !hijriDurationMonths && !hijriDurationYears)}
                      >
                        {t('calculator.date.hijriDuration.calculate')}
                      </Button>

                      {calculatedHijriEndDate && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <span className="block text-sm text-gray-600 mb-1">
                            {t('calculator.date.hijriDuration.result')}
                          </span>
                          <span className="text-lg font-semibold text-blue-700" dir="rtl">
                            {calculatedHijriEndDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              {/* Tafqit (Numbers to Words) Tab */}
              <TabsContent value="tafqit" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.tafqit.amount')}</Label>
                      <Input
                        type="number"
                        value={tafqitAmount}
                        onChange={(e) => setTafqitAmount(e.target.value)}
                        step="0.01"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">{t('calculator.tafqit.language')}</Label>
                      <Select
                        value={tafqitLanguage}
                        onValueChange={(value: 'ar' | 'en') => setTafqitLanguage(value)}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">{t('calculator.tafqit.languages.arabic')}</SelectItem>
                          <SelectItem value="en">{t('calculator.tafqit.languages.english')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() => {
                        const result = ProcurementCalculator.numberToWords(
                          Number(tafqitAmount),
                          {
                            language: tafqitLanguage,
                            comma: 'on'
                          }
                        );
                        setTafqitResult(result);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!tafqitAmount}
                    >
                      {t('calculator.tafqit.convert')}
                    </Button>
                  </div>

                  {tafqitResult && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <span className="block text-sm text-gray-600 mb-2">
                        {t('calculator.tafqit.result')}
                      </span>
                      <p
                        className="text-lg font-semibold text-blue-700"
                        dir={tafqitLanguage === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {tafqitResult}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}