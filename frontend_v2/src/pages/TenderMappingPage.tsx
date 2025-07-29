// src/pages/TenderMappingPage.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderCalculationResult } from '@/types/tenderMapping';
import { useTenderWorkTypes, useCalculateProcurement } from '@/hooks/api/useTenderMapping';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { TenderMappingForm } from '@/features/tenderMapping/components/TenderMappingForm';
import { TenderReportTabs } from '@/features/tenderMapping/components/TenderReportTabs';

export default function TenderMappingPage() {
  const { t, direction } = useLanguage();
  const [calculationResult, setCalculationResult] = useState<TenderCalculationResult | null>(null);

  const { data: workTypes, isLoading: isLoadingWorkTypes, error: workTypesError } = useTenderWorkTypes();
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
      console.error(t('tenderMapping.error'), error);
    }
  };
  
  const handleResultUpdate = (updatedResult: TenderCalculationResult) => {
    setCalculationResult(updatedResult);
  };

  const handleReset = () => {
    setCalculationResult(null);
  };

  if (isLoadingWorkTypes) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (workTypesError) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{t('tenderMapping.error')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8" dir={direction}>
      <div className="w-full max-w-4xl mx-auto">
        {calculateMutation.isPending ? (
          <div className="flex flex-col items-center justify-center py-20 bg-background-body rounded-lg">
            <LoadingSpinner size="lg" className="mb-4" />
            <p>{t('tenderMapping.calculating')}</p>
          </div>
        ) : calculationResult ? (
          <TenderReportTabs result={calculationResult} onResultUpdate={handleResultUpdate} />
        ) : (
          <TenderMappingForm
            workTypes={workTypes || []}
            isLoading={calculateMutation.isPending}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}