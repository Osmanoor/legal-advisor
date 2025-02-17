// src/pages/CorrectionPage.tsx
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCorrection } from '@/hooks/api/useCorrection';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function CorrectionPage() {
  const { t, language, setLanguage } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en'>('en');
  
  const correction = useCorrection();

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      const result = await correction.mutateAsync({
        text: inputText,
        language: selectedLanguage,
      });

      if (result.status === 'success') {
        setCorrectedText(result.corrected_text);
      }
    } catch (error) {
      console.error('Correction error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>{t('correction.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Toggle */}
            <div className="flex items-center justify-end space-x-2">
              <Label htmlFor="language-toggle">
                {selectedLanguage === 'ar' ? 'العربية' : 'English'}
              </Label>
              <Switch
                id="language-toggle"
                checked={selectedLanguage === 'ar'}
                onCheckedChange={(checked) => setSelectedLanguage(checked ? 'ar' : 'en')}
              />
            </div>

            {/* Input Section */}
            <div className="space-y-2">
              <Label>{t('correction.inputLabel')}</Label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('correction.inputPlaceholder')}
                className="min-h-[200px]"
                dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleSubmit}
              disabled={correction.isPending || !inputText.trim()}
              className="w-full"
            >
              {correction.isPending ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>{t('correction.correcting')}</span>
                </div>
              ) : (
                t('correction.correct')
              )}
            </Button>

            {/* Results Section */}
            {correctedText && (
              <div className="space-y-2">
                <Label>{t('correction.outputLabel')}</Label>
                <div 
                  className="p-4 rounded-md bg-slate-700/50 min-h-[200px] whitespace-pre-wrap"
                  dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
                >
                  {correctedText}
                </div>
              </div>
            )}

            {/* Error Display */}
            {correction.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {t('correction.error')}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}