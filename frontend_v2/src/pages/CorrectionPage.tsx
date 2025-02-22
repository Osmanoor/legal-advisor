import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCorrection } from '@/hooks/api/useCorrection';
import { useToast } from '@/hooks/useToast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Languages,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CorrectionPage() {
  const { t, language, direction } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en'>('en');
  const { showToast } = useToast();
  const correction = useCorrection();

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      showToast(t('correction.error'), 'error');
      return;
    }

    try {
      const result = await correction.mutateAsync({
        text: inputText,
        language: selectedLanguage,
      });

      if (result.status === 'success') {
        setCorrectedText(result.corrected_text);
        showToast(t('correction.success'), 'success');
      }
    } catch (error) {
      showToast(t('correction.error'), 'error');
    }
  };

  const handleReset = () => {
    setInputText('');
    setCorrectedText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('correction.title')}
          </h1>
          <p className="text-gray-600">
            Enter your text below and select the language for correction
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900">
                {t('correction.inputLabel')}
              </CardTitle>
              <CardDescription>
                {t('correction.inputPlaceholder')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={selectedLanguage}
                  onValueChange={(value: 'ar' | 'en') => setSelectedLanguage(value)}
                >
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <Languages className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('correction.inputPlaceholder')}
                  className="min-h-[200px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-900"
                disabled={!inputText || correction.isPending}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('common.reset')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!inputText || correction.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {correction.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {t('correction.correcting')}
                  </>
                ) : (
                  <>
                    {t('correction.correct')}
                    {direction === 'rtl' ? (
                      <ArrowLeft className="w-4 h-4 ml-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Output Section */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900">
                {t('correction.outputLabel')}
              </CardTitle>
              <CardDescription>
                Corrected text will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {correction.error ? (
                <Alert variant="destructive">
                  <X className="w-4 h-4 mr-2" />
                  <AlertDescription>
                    {t('correction.error')}
                  </AlertDescription>
                </Alert>
              ) : correctedText ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {t('correction.success')}
                    </AlertDescription>
                  </Alert>
                  <div
                    className="p-4 rounded-lg bg-gray-50 min-h-[200px] whitespace-pre-wrap text-gray-900"
                    dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {correctedText}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[200px] text-gray-400 bg-gray-50 rounded-lg">
                  No corrections yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}