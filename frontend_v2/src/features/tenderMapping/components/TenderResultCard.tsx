// src/features/tenderMapping/components/TenderResultCard.tsx

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderCalculationResult, TenderStage } from '@/types/tenderMapping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertCircle, FileText, Users, ShieldCheck, BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableTimelineStage } from './EditableTimelineStage';

interface TenderResultCardProps {
  result: TenderCalculationResult;
  onUpdateResult?: (updatedResult: TenderCalculationResult) => void;
}

export function TenderResultCard({ result, onUpdateResult }: TenderResultCardProps) {
  const { t } = useLanguage();
  const [editingStageIndex, setEditingStageIndex] = useState<number | null>(null);
  const [localStages, setLocalStages] = useState<TenderStage[]>(result.stages || []);
  
  // Safely format a value that might be undefined
  const formatValue = (value: string | number | undefined) => {
    if (value === undefined || value === null) return "غير محدد";
    if (value === 0 || value === "0") return "غير مطلوب";
    if (value === "لم يحدد") return "غير محدد";
    return value;
  };

  // Ensure result exists
  if (!result) {
    return null;
  }

  // Check if there are referenced articles
  const hasReferencedArticles = result.referenced_articles && result.referenced_articles.length > 0;
  const hasReferencedArticlesData = result.referenced_articles_data && result.referenced_articles_data.length > 0;

  // Function to recalculate dates when a stage duration changes
  const recalculateDates = (updatedStages: TenderStage[]): TenderStage[] => {
    // Make a deep copy to avoid direct state mutation
    const stages = JSON.parse(JSON.stringify(updatedStages)) as TenderStage[];
    
    // Only proceed if we have stages
    if (!stages || stages.length === 0) return stages;
    
    // Start from the project start date (first stage's start date)
    let currentDate = new Date(stages[0].start_date);
    
    // For each stage, calculate its end date based on duration
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      stage.start_date = currentDate.toISOString().split('T')[0];
      
      // Calculate end date based on duration and working days setting
      if (stage.is_working_days) {
        // For working days, we need to skip weekends
        let workingDaysCount = 0;
        const tempDate = new Date(currentDate);
        
        while (workingDaysCount < stage.duration) {
          tempDate.setDate(tempDate.getDate() + 1);
          // Skip Friday (5) and Saturday (6)
          const dayOfWeek = tempDate.getDay();
          if (dayOfWeek !== 5 && dayOfWeek !== 6) {
            workingDaysCount++;
          }
        }
        
        stage.end_date = tempDate.toISOString().split('T')[0];
        currentDate = new Date(tempDate);
      } else {
        // For calendar days, simply add the duration
        const tempDate = new Date(currentDate);
        tempDate.setDate(tempDate.getDate() + stage.duration);
        stage.end_date = tempDate.toISOString().split('T')[0];
        currentDate = new Date(tempDate);
      }
      
      // Set the next stage's start date to this stage's end date
      if (i < stages.length - 1) {
        stages[i + 1].start_date = stage.end_date;
      }
    }
    
    return stages;
  };

  // Calculate total duration in days
  const calculateTotalDuration = (stages: TenderStage[]): number => {
    if (!stages || stages.length === 0) return 0;
    
    const startDate = new Date(stages[0].start_date);
    const endDate = new Date(stages[stages.length - 1].end_date);
    
    // Calculate days difference
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Handler for stage edits
  const handleStageEdit = (index: number) => {
    setEditingStageIndex(index);
  };

  // Handler for canceling edits
  const handleStageEditCancel = () => {
    setEditingStageIndex(null);
    // Reset to original stages
    setLocalStages(result.stages || []);
  };

  // Handler for saving stage edits
  const handleStageEditSave = (updatedStage: TenderStage, index: number) => {
    // Update the specific stage
    const newStages = [...localStages];
    newStages[index] = updatedStage;
    
    // Recalculate all dates
    const recalculatedStages = recalculateDates(newStages);
    setLocalStages(recalculatedStages);
    
    // Update total duration
    const newTotalDuration = calculateTotalDuration(recalculatedStages);
    
    // Update the parent component if callback exists
    if (onUpdateResult) {
      onUpdateResult({
        ...result,
        stages: recalculatedStages,
        total_duration: newTotalDuration
      });
    }
    
    setEditingStageIndex(null);
  };

  // Reset all stages to original values
  const handleResetAllStages = () => {
    setLocalStages(result.stages || []);
    setEditingStageIndex(null);
    
    if (onUpdateResult) {
      onUpdateResult(result);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('tenderMapping.results.title')}</CardTitle>
          <Badge variant="default" className="bg-blue-500">
            {result.procurement_type || "غير محدد"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main procurement details */}
          <div className="border rounded-md divide-y">
            <div className="p-3 bg-gray-50 font-medium">
              المعلومات الأساسية
            </div>
            
            <div className="p-3 flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">هيكل الملف:</span> {formatValue(result.file_structure)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <Users className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">المشاركون المطلوبون:</span> {formatValue(result.required_participants)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <ShieldCheck className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">أولوية الشركات الصغيرة والمتوسطة:</span> {formatValue(result.sme_priority)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">الضمان الابتدائي:</span> {formatValue(result.initial_guarantee)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">الضمان النهائي:</span> {formatValue(result.final_guarantee)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">إرشادات التنفيذ:</span> {formatValue(result.implementation_guidelines)}
              </div>
            </div>
          </div>

          {/* Referenced Articles */}
          {(hasReferencedArticles || hasReferencedArticlesData) && (
            <div className="border rounded-md divide-y">
              <div className="p-3 bg-gray-50 font-medium">
                المواد المرجعية
              </div>
              
              {hasReferencedArticles && (
                <div className="p-3 flex items-start">
                  <BookOpen className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">أرقام المواد:</span>{' '}
                    {result.referenced_articles.map((article, index) => (
                      <span key={index} className="inline-block bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-xs mr-2 mb-2">
                        المادة {article}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {hasReferencedArticlesData && (
                <div className="space-y-4 p-3">
                  {result.referenced_articles_data.map((article, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="font-medium text-indigo-700 mb-2">
                        {article.type === 'اللائحة' ? 'اللائحة' : 'النظام'}{' '}
                        {article.number && `- المادة ${article.number}`}
                      </div>
                      {article.title && (
                        <div className="text-sm font-medium mb-1">{article.title}</div>
                      )}
                      {article.content && (
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{article.content}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {localStages && localStages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  الجدول الزمني ({calculateTotalDuration(localStages)} يوم)
                </h3>
                {/* <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetAllStages}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  إعادة تعيين
                </Button> */}
              </div>
              <div className="space-y-3">
                {localStages.map((stage, index) => (
                  <EditableTimelineStage
                    key={index}
                    stage={stage}
                    isEditing={editingStageIndex === index}
                    onEditClick={() => handleStageEdit(index)}
                    onCancel={handleStageEditCancel}
                    onSave={(updatedStage) => handleStageEditSave(updatedStage, index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}