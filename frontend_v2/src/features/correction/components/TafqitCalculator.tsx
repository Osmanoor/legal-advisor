// src/features/correction/components/TafqitCalculator.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { tafqit } from '@/lib/tafqit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

export const TafqitCalculator = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const trackedAmountRef = useRef<string | null>(null);

  const handleCopyToClipboard = () => {
    if (!result || result === t('calculator.tafqit.resultPlaceholder')) return;
    navigator.clipboard.writeText(result);
    showToast(t('correction.copiedToClipboard'), 'success');
  };

  useEffect(() => {
    const convertAmount = () => {
      if (amount.trim() !== '' && !isNaN(Number(amount))) {
        const num = Number(amount);
        const newResult = tafqit(num);
        setResult(tafqit(num));
        // Only track if the result is valid and the amount is different from the last tracked one
        if (newResult && amount.trim() !== trackedAmountRef.current) {
          trackEvent({ event: 'feature_used', feature_name: 'tafqit' });
          trackedAmountRef.current = amount.trim();
        }
      } else {
        setResult('');
      }
    };

    const debouncedConvert = debounce(convertAmount, 300);
    debouncedConvert();
  }, [amount, t]);

  return (
    // This div acts as the main card container for the Tafqit tab
    <div className="bg-white border border-inputTheme-border rounded-2xl shadow-lg p-6 md:p-8 min-h-[400px]">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Row 1: Input */}
        <div className="space-y-2">
          <Label htmlFor="tafqit-amount" className="text-right block mb-1.5 text-[14px] font-normal text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            {t('calculator.tafqit.amount')}
          </Label>
          <Input
            id="tafqit-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('calculator.tafqit.placeholder')}
            className="h-[40px] rounded-lg border border-inputTheme-border bg-white shadow-input-shadow px-3 py-2 text-sm placeholder:text-inputTheme-placeholder focus:border-cta focus:ring-cta text-right placeholder:text-right"
            dir="rtl"
          />
        </div>

        {/* Row 2: Result */}
        <div className="space-y-2">
          <Label className="text-right block mb-1.5 text-[14px] font-normal text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            {t('calculator.tafqit.result')}
          </Label>
          <div className="relative bg-[#ECFFEA] border border-inputTheme-border rounded-lg p-4 min-h-[84px] flex items-center justify-center text-center shadow-input-shadow">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyToClipboard}
              className="absolute top-1/2 -translate-y-1/2 left-3 text-cta hover:bg-cta/10 w-8 h-8"
              aria-label={t('correction.copy')}
              disabled={!result}
            >
              <Copy size={16} />
            </Button>
            <p
              className="text-resultTheme-valueText text-[#51B749] text-[23px] font-medium leading-tight text-center flex-grow mx-10"
              style={{ fontFamily: 'var(--font-primary-arabic)', lineHeight: '130%' }}
              dir="rtl"
            >
              {result || t('calculator.tafqit.resultPlaceholder')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};