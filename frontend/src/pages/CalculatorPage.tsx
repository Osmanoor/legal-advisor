import React, { useState, ChangeEvent } from 'react';
import { ProcurementCalculator, VATCalculator, DateConverter } from '../utils/calculator';
import { DateTime } from 'luxon';

const CalculatorPage = () => {
  // State for percentage calculator
  const [baseAmount, setBaseAmount] = useState<string>('');
  const [newAmount, setNewAmount] = useState<string>('');
  const [percentageResult, setPercentageResult] = useState<string>('');

  // State for VAT calculator
  const [vatAmount, setVatAmount] = useState<string>('');
  const [vatRate, setVatRate] = useState<string>('15');
  const [vatResult, setVatResult] = useState<{
    netAmount?: number;
    vatAmount?: number;
    totalAmount?: number;
  }>({});
  const [vatOperation, setVatOperation] = useState<'total' | 'extract' | 'amount'>('total');


  // State for amount with percentage
  const [amount, setAmount] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('');
  const [percentageAmountResult, setPercentageAmountResult] = useState<{
    originalAmount?: number;
    adjustmentAmount?: number;
    finalAmount?: number;
  }>({});

  // State for dates
  const [gregorianDate, setGregorianDate] = useState<string>('');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [gregorianResult, setGregorianResult] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateDifference, setDateDifference] = useState<{
    days?: number;
    months?: number;
    years?: number;
  }>({});
  const [durationDays, setDurationDays] = useState<string>('');
  const [durationMonths, setDurationMonths] = useState<string>('');
  const [durationYears, setDurationYears] = useState<string>('');
  const [calculatedEndDate, setCalculatedEndDate] = useState<string>('');


  // State for tafqit
  const [tafqitAmount, setTafqitAmount] = useState<string>('');
  const [tafqitLanguage, setTafqitLanguage] = useState<'ar' | 'en'>('ar');
  const [tafqitResult, setTafqitResult] = useState<string>('');

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('percentage');

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    setter(e.target.value);
  };

  const calculatePercentageChange = () => {
    const result = ProcurementCalculator.calculatePercentageChange(
      Number(baseAmount),
      Number(newAmount)
    );
    setPercentageResult(`${result.toFixed(2)}%`);
  };

  const calculateAmountWithPercentage = () => {
    const result = ProcurementCalculator.calculateAmountWithPercentage(
      Number(amount),
      Number(percentage)
    );
    setPercentageAmountResult(result);
  };

  const convertToWords = () => {
    const result = ProcurementCalculator.numberToWords(Number(tafqitAmount), {
      language: 'ar'
    });
    setTafqitResult(result);
  };
  const calculateVAT = () => {
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

  // Calculate difference between dates
  const convertHijriToGregorian = () => {
    try {
      if (!DateConverter.isValidHijriDate(hijriDate)) {
        alert('الرجاء إدخال تاريخ هجري صحيح');
        return;
      }

      const result = DateConverter.hijriToGregorian(hijriDate);
      setGregorianResult(DateTime.fromJSDate(result).toFormat('yyyy-MM-dd'));
    } catch (error) {
      alert('خطأ في التحويل. الرجاء التأكد من صحة التاريخ');
    }
  };

  // Updated Gregorian to Hijri handler
  const convertGregorianToHijri = () => {
    try {
      if (!gregorianDate) {
        alert('الرجاء إدخال التاريخ الميلادي');
        return;
      }

      const result = DateConverter.gregorianToHijri(new Date(gregorianDate));
      const monthName = DateConverter.getHijriMonthName(parseInt(result.split('/')[1]));
      setHijriDate(`${result} (${monthName})`);
    } catch (error) {
      alert('خطأ في التحويل. الرجاء التأكد من صحة التاريخ');
    }
  };

  // Updated date difference handler
  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      alert('الرجاء إدخال تاريخ البداية والنهاية');
      return;
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (DateTime.fromJSDate(end) < DateTime.fromJSDate(start)) {
        alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
        return;
      }

      const result = DateConverter.calculateDateDifference(start, end);
      setDateDifference(result);
    } catch (error) {
      alert('خطأ في حساب الفرق. الرجاء التأكد من صحة التواريخ');
    }
  };

  // Updated end date calculation handler
  const calculateFutureDate = () => {
    if (!startDate) {
      alert('الرجاء إدخال تاريخ البداية');
      return;
    }
  
    try {
      // Parse the input date string as a local date using Luxon
      const localStartDate = DateTime.fromFormat(startDate, 'yyyy-MM-dd', { zone: 'local' }).toJSDate();
  
      const result = DateConverter.calculateEndDate(
        localStartDate,
        {
          days: durationDays ? parseInt(durationDays) : 0,
          months: durationMonths ? parseInt(durationMonths) : 0,
          years: durationYears ? parseInt(durationYears) : 0
        }
      );
  
      // Show both Gregorian and Hijri dates
      const gregorianResult = DateTime.fromJSDate(result).toFormat('yyyy-MM-dd');
      const hijriResult = DateConverter.gregorianToHijri(result);
      setCalculatedEndDate(`${gregorianResult} (هجري: ${hijriResult})`);
    } catch (error) {
      alert('خطأ في حساب تاريخ النهاية. الرجاء التأكد من المدخلات');
    }
  };
  


  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">أدوات حاسبة المشتريات</h1>

      {/* Simple Tabs */}
      <div className="flex space-x-2 mb-4 border-b">
        {['percentage', 'vat', 'amount', 'date', 'tafqit'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${activeTab === tab
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
              }`}
          >
            {tab === 'percentage' && 'النسبة المئوية'}
            {tab === 'vat' && 'الضريبة'}
            {tab === 'amount' && 'المبلغ مع نسبة'}
            {tab === 'date' && 'التواريخ'}
            {tab === 'tafqit' && 'التفقيط'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Percentage Calculator */}
        {activeTab === 'percentage' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">حساب النسبة المئوية</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">المبلغ الأساسي</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={baseAmount}
                onChange={(e) => handleInputChange(e, setBaseAmount)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">المبلغ الجديد</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={newAmount}
                onChange={(e) => handleInputChange(e, setNewAmount)}
              />
            </div>
            <button
              onClick={calculatePercentageChange}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              احسب النسبة
            </button>
            {percentageResult && (
              <div className="mt-4 p-2 bg-gray-50 rounded">
                النتيجة: {percentageResult}
              </div>
            )}
          </div>
        )}

        {/* VAT Calculator */}
        {activeTab === 'vat' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">حساب الضريبة</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">نوع العملية</label>
              <select
                className="w-full border rounded-md p-2"
                value={vatOperation}
                onChange={(e) => setVatOperation(e.target.value as 'total' | 'extract' | 'amount')}
              >
                <option value="total">حساب المبلغ مع الضريبة</option>
                <option value="extract">استخراج المبلغ الأصلي من مبلغ الضريبة</option>
                <option value="amount">حساب مبلغ الضريبة من المبلغ الإجمالي</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {vatOperation === 'extract' ? 'مبلغ الضريبة' : 'المبلغ'}
              </label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={vatAmount}
                onChange={(e) => handleInputChange(e, setVatAmount)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">نسبة الضريبة</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={vatRate}
                onChange={(e) => handleInputChange(e, setVatRate)}
              />
            </div>
            <button
              onClick={calculateVAT}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              احسب
            </button>
            {Object.keys(vatResult).length > 0 && (
              <div className="mt-4 space-y-2 p-2 bg-gray-50 rounded">
                {vatResult.netAmount !== undefined && (
                  <div>المبلغ الصافي: {vatResult.netAmount.toFixed(2)}</div>
                )}
                {vatResult.vatAmount !== undefined && (
                  <div>مبلغ الضريبة: {vatResult.vatAmount.toFixed(2)}</div>
                )}
                {vatResult.totalAmount !== undefined && (
                  <div>المبلغ الإجمالي: {vatResult.totalAmount.toFixed(2)}</div>
                )}
              </div>
            )}
          </div>
        )}



        {/* Amount with Percentage */}
        {activeTab === 'amount' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">حساب المبلغ مع النسبة</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">المبلغ</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={amount}
                onChange={(e) => handleInputChange(e, setAmount)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">النسبة</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={percentage}
                onChange={(e) => handleInputChange(e, setPercentage)}
              />
            </div>
            <button
              onClick={calculateAmountWithPercentage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              احسب
            </button>
            {Object.keys(percentageAmountResult).length > 0 && (
              <div className="mt-4 space-y-2 p-2 bg-gray-50 rounded">
                <div>المبلغ الأصلي: {percentageAmountResult.originalAmount?.toFixed(2)}</div>
                <div>مبلغ التعديل: {percentageAmountResult.adjustmentAmount?.toFixed(2)}</div>
                <div>المبلغ النهائي: {percentageAmountResult.finalAmount?.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}

        {/* Date Converter */}
        {activeTab === 'date' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">تحويل التواريخ</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Gregorian to Hijri */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">التاريخ الميلادي</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={gregorianDate}
                    onChange={(e) => setGregorianDate(e.target.value)}
                  />
                  <button
                    onClick={convertGregorianToHijri}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    حول إلى هجري
                  </button>
                  {hijriDate && (
                    <div className="mt-2 p-2 bg-gray-50 rounded" dir="rtl">
                      {hijriDate}
                    </div>
                  )}
                </div>

                {/* Hijri to Gregorian */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">التاريخ الهجري</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-left"
                    value={hijriDate}
                    onChange={(e) => setHijriDate(e.target.value)}
                    placeholder="1445/07/29"
                    pattern="\d{4}/\d{2}/\d{2}"
                  />
                  <div className="text-xs text-gray-500">
                    التاريخ الحالي: {DateConverter.getCurrentHijriDate()}
                  </div>
                  <button
                    onClick={convertHijriToGregorian}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    حول إلى ميلادي
                  </button>
                  {gregorianResult && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      {gregorianResult}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date Difference Calculator */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">حساب الفرق بين تاريخين</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">تاريخ البداية</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={startDate}
                    onChange={(e) => handleInputChange(e, setStartDate)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">تاريخ النهاية</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={endDate}
                    onChange={(e) => handleInputChange(e, setEndDate)}
                  />
                </div>
              </div>
              <button
                onClick={calculateDateDifference}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                احسب الفرق
              </button>
              {Object.keys(dateDifference).length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <div>السنوات: {dateDifference.years}</div>
                  <div>الشهور: {dateDifference.months}</div>
                  <div>الأيام: {dateDifference.days}</div>
                </div>
              )}
            </div>

            {/* Calculate End Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">حساب تاريخ النهاية</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium">تاريخ البداية</label>
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={startDate}
                  onChange={(e) => handleInputChange(e, setStartDate)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">الأيام</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={durationDays}
                    onChange={(e) => handleInputChange(e, setDurationDays)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">الشهور</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={durationMonths}
                    onChange={(e) => handleInputChange(e, setDurationMonths)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">السنوات</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={durationYears}
                    onChange={(e) => handleInputChange(e, setDurationYears)}
                  />
                </div>
              </div>
              <button
                onClick={calculateFutureDate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                احسب تاريخ النهاية
              </button>
              {calculatedEndDate && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  تاريخ النهاية: {calculatedEndDate}
                </div>
              )}
            </div>
          </div>
        )}


        {/* Tafqit */}
        {activeTab === 'tafqit' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">تفقيط المبلغ</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">المبلغ</label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={tafqitAmount}
                onChange={(e) => setTafqitAmount(e.target.value)}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">اللغة</label>
              <select
                className="w-full border rounded-md p-2"
                value={tafqitLanguage}
                onChange={(e) => setTafqitLanguage(e.target.value as 'ar' | 'en')}
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <button
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              حول إلى كلمات
            </button>
            {tafqitResult && (
              <div
                className="mt-4 p-2 bg-gray-50 rounded"
                dir={tafqitLanguage === 'ar' ? 'rtl' : 'ltr'}
              >
                {tafqitResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorPage;