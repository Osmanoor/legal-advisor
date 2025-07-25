// src/pages/CorrectionPage.tsx

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCorrection } from '@/hooks/api/useCorrection';
import { useToast } from '@/hooks/useToast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sparkle, Edit3, Pilcrow } from 'lucide-react';

import { CorrectionEditor, CorrectionProcessState } from '@/features/correction/components/CorrectionEditor';
import { TafqitCalculator } from '@/features/correction/components/TafqitCalculator';

type ActiveCorrectionTab = 'correction' | 'tafqit';

export default function CorrectionPage() {
  const { t, direction } = useLanguage();
  const { showToast } = useToast();
  const correctionMutation = useCorrection();

  const [activeTab, setActiveTab] = useState<ActiveCorrectionTab>('correction');
  const [correctionState, setCorrectionState] = useState<CorrectionProcessState>('writing');
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // --- MODIFIED: This function now accepts the mode ---
  const handleTextApiCall = async (mode: 'correct' | 'enhance') => {
    const plainText = inputText.replace(/<[^>]*>?/gm, '').trim();
    if (!plainText) {
      showToast(t('correction.error'), 'error');
      return;
    }

    setCorrectionState(mode === 'correct' ? 'loadingCorrection' : 'loadingEnhancement');
    
    try {
      // --- MODIFIED: Pass the mode to the mutation ---
      const result = await correctionMutation.mutateAsync({ 
        text: inputText, 
        language: 'ar', 
        mode: mode 
      });

      setOutputText(result.corrected_text);
      setCorrectionState('corrected');
      showToast(mode === 'correct' ? t('correction.success') : t('correction.enhanceSuccess'), 'success');
    } catch (err) {
      showToast(t('correction.error'), 'error');
      setCorrectionState('writing');
    }
  };

  // These functions now pass the correct mode
  const handleCorrectText = () => handleTextApiCall('correct');
  const handleEnhanceText = () => handleTextApiCall('enhance');
  
  const handleReEnter = () => {
    setInputText('');
    setOutputText('');
    setCorrectionState('writing');
  };

  const handleCopyResult = () => {
    const plainTextResult = new DOMParser().parseFromString(outputText, "text/html").body.textContent || "";
    navigator.clipboard.writeText(plainTextResult);
    showToast(t('correction.copiedToClipboard'), 'success');
  };

  const isLoading = correctionState === 'loadingCorrection' || correctionState === 'loadingEnhancement';
  const showActionButtons = activeTab === 'correction';

  return (
    <div className="p-4 md:p-6 lg:p-8" dir={direction}>
      <div className={`mb-6 md:mb-8 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
        <h1
          className="text-design-22 font-medium text-text-on-light-strong"
          style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 500, lineHeight: '130%' }}
        >
          {t('correction.title')}
        </h1>
        <p
          className="text-[14px] text-text-on-light-faint mt-1"
          style={{ fontFamily: 'var(--font-primary-latin)', fontWeight: 400, lineHeight: '150%' }}
        >
          {t('correction.subtitlePlaceholder')}
        </p>
      </div>

      <div className="w-full max-w-[854px] mx-auto">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveCorrectionTab)} className="w-full">
          <TabsList className={`w-full flex mb-6 ${direction === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
            <TabsTrigger value="correction" className="flex-1">
              <div className={`flex items-center justify-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Edit3 className="w-4 h-4" />
                <span>{t('correction.tabTitleCorrect')}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="tafqit" className="flex-1">
              <div className={`flex items-center justify-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Pilcrow className="w-4 h-4" />
                <span>{t('correction.tabTitleTafqit')}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="correction" className="focus-visible:ring-0 focus-visible:ring-offset-0">
            <CorrectionEditor
              state={correctionState}
              onTextChange={setInputText}
              initialContent={inputText}
              resultContent={outputText}
              onCopyResult={handleCopyResult}
            />
          </TabsContent>

          <TabsContent value="tafqit" className="focus-visible:ring-0 focus-visible:ring-offset-0">
            <TafqitCalculator />
          </TabsContent>
        </Tabs>

        {showActionButtons && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center max-w-[808px] mx-auto">
            {correctionState === 'writing' ? (
              <>
                <Button onClick={handleCorrectText} disabled={isLoading} className="flex-1 h-[42px] bg-white text-cta border border-cta rounded-lg hover:bg-cta/10 text-[14px] font-normal" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}>
                  {t('correction.correctTextButton')}
                </Button>
                <Button onClick={handleEnhanceText} disabled={isLoading} className="flex-1 h-[42px] bg-cta text-white rounded-lg hover:bg-cta-hover text-[14px] font-normal flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}>
                  <Sparkle size={16} />
                  {t('correction.enhanceTextButton')}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleReEnter} disabled={isLoading} className="flex-1 h-[42px] bg-white text-cta border border-cta rounded-lg hover:bg-cta/10 text-[14px] font-normal" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}>
                  {t('correction.reEnterButton')}
                </Button>
                <Button onClick={handleEnhanceText} disabled={isLoading} className="flex-1 h-[42px] bg-cta text-white rounded-lg hover:bg-cta-hover text-[14px] font-normal flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}>
                  <Sparkle size={16} />
                  {t('correction.enhanceTextButton')}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}