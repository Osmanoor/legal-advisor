// src/pages/TenderMappingPage.tsx
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderMappingResult } from '@/types/tenderMapping';
import { useTenderCategories, useTenderMap } from '@/hooks/api/useTenderMapping';
import { TenderMappingForm } from '@/features/tenderMapping/components/TenderMappingForm';
import { TenderResultCard } from '@/features/tenderMapping/components/TenderResultCard';
import { SaveRuleForm } from '@/features/tenderMapping/components/SaveRuleForm';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function TenderMappingPage() {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [mappingResult, setMappingResult] = useState<TenderMappingResult | null>(null);
  
  const { 
    data: categories, 
    isLoading: isLoadingCategories, 
    error: categoriesError 
  } = useTenderCategories();
  
  const tenderMapMutation = useTenderMap();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setInputs(values);
      const result = await tenderMapMutation.mutateAsync(values);
      setMappingResult(result);
    } catch (error) {
      console.error('Error mapping tender type:', error);
    }
  };

  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('tenderMapping.error')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('tenderMapping.title')}</h1>
        <p className="text-gray-500">{t('tenderMapping.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TenderMappingForm
            categories={categories || []}
            isLoading={tenderMapMutation.isPending}
            onSubmit={handleSubmit}
          />
          
          {mappingResult && (
            <div className="mt-8">
              <SaveRuleForm 
                result={mappingResult} 
                inputs={inputs}
              />
            </div>
          )}
        </div>

        <div>
          {tenderMapMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border">
              <LoadingSpinner size="lg" className="mb-4" />
              <p>{t('tenderMapping.loading')}</p>
            </div>
          ) : mappingResult ? (
            <TenderResultCard result={mappingResult} />
          ) : null}
        </div>
      </div>
    </div>
  );
}