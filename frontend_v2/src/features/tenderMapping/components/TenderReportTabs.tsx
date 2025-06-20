// src/features/tenderMapping/components/TenderReportTabs.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TenderCalculationResult, TenderDetail } from '@/types/tenderMapping';

// Import tab content components
import { ReportDetailsTab } from './ReportDetailsTab';
import { ReportTimelineTab } from './ReportTimelineTab';
import { ReportRegulationsTab } from './ReportRegulationsTab';

interface TenderReportTabsProps {
  result: TenderCalculationResult;
  onResultUpdate: (updatedResult: TenderCalculationResult) => void;
}

export const TenderReportTabs: React.FC<TenderReportTabsProps> = ({ result, onResultUpdate }) => {
  // --- FIX: Added useLanguage hook to define 't' and 'direction' ---
  const { t, direction } = useLanguage();

  const tabsData = [
    { value: 'details', labelKey: 'tenderMapping.results.tabs.details' },
    { value: 'timeline', labelKey: 'tenderMapping.results.tabs.timeline' },
    { value: 'regulations', labelKey: 'tenderMapping.results.tabs.regulations' },
  ];
  
  const transformResultToDetails = (apiResult: TenderCalculationResult): TenderDetail[] => {
    return [
      { key: 'procurementStyle', label: t('tenderMapping.results.procurementStyle'), value: apiResult.procurement_type, icon: 'FileText' },
      { key: 'stageCount', label: t('tenderMapping.results.stageCount'), value: `${apiResult.stages.length} مراحل`, icon: 'ListOrdered' },
      { key: 'offerSubmission', label: t('tenderMapping.results.offerSubmission'), value: apiResult.file_structure || 'غير محدد', icon: 'Archive' },
      { key: 'offerDuration', label: t('tenderMapping.results.offerDuration'), value: `${apiResult.review_period} أيام`, icon: 'Clock' },
      { key: 'exeedApproval', label: t('tenderMapping.results.exeedApproval'), value: apiResult.performance_guarantee?.toString() || 'غير محدد', icon: 'CheckSquare' },
      { key: 'financeApproval', label: t('tenderMapping.results.financeApproval'), value: 'غير مطلوبة', icon: 'ShieldCheck' }, // Placeholder
      { key: 'totalDuration', label: t('tenderMapping.results.totalDuration'), value: `${apiResult.total_duration} يوم`, icon: 'CalendarDays' },
      { key: 'localContentMechanism', label: t('tenderMapping.results.localContentMechanism'), value: apiResult.sme_priority || 'غير محدد', icon: 'Building' },
    ];
  };

  const competitionDetails = transformResultToDetails(result);

  return (
    <div className="w-full">
      <div className={`text-center mb-6 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} >
        <h2 className="text-2xl font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
          {t('tenderMapping.results.title')}
        </h2>
        <p className="text-sm text-text-on-light-muted mt-1">
          {t('tenderMapping.inputs.description')}
        </p>
      </div>
      
      <Tabs defaultValue="details" dir={direction} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          {tabsData.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="details">
          <ReportDetailsTab details={competitionDetails} />
        </TabsContent>

        <TabsContent value="timeline">
           <ReportTimelineTab stages={result.stages} onResultUpdate={onResultUpdate} result={result}/>
        </TabsContent>

        <TabsContent value="regulations">
          <ReportRegulationsTab 
            summaryPoints={result.regulations_summary || []}
            sources={result.regulations_sources || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};