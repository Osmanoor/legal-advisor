// Update to src/pages/TenderMappingPage.tsx

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderCalculationResult } from '@/types/tenderMapping';
import { useTenderWorkTypes, useCalculateProcurement } from '@/hooks/api/useTenderMapping';
import { TenderMappingForm } from '@/features/tenderMapping/components/TenderMappingForm';
import { TenderResultCard } from '@/features/tenderMapping/components/TenderResultCard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function TenderMappingPage() {
  const { t } = useLanguage();
  const [calculationResult, setCalculationResult] = useState<TenderCalculationResult | null>(null);
  
  const { 
    data: workTypes, 
    isLoading: isLoadingWorkTypes, 
    error: workTypesError 
  } = useTenderWorkTypes();
  
  const calculateMutation = useCalculateProcurement();

  const handleSubmit = async (values: {
    work_type: string;
    budget: number;
    start_date: string;
    project_duration: number;
  }) => {
    try {
      const result = await calculateMutation.mutateAsync(values);
      setCalculationResult(result);
    } catch (error) {
      console.error('Error calculating procurement:', error);
    }
  };

  if (isLoadingWorkTypes) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (workTypesError) {
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
            workTypes={workTypes || []}
            isLoading={calculateMutation.isPending}
            onSubmit={handleSubmit}
          />
        </div>

        <div>
          {calculateMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border">
              <LoadingSpinner size="lg" className="mb-4" />
              <p>{t('tenderMapping.loading')}</p>
            </div>
          ) : calculationResult ? (
            <TenderResultCard result={calculationResult} />
          ) : null}
        </div>
      </div>
    </div>
  );
}