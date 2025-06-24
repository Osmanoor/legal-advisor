// src/features/tenderMapping/components/ReportTimelineTab.tsx
import React, { useState, useEffect } from 'react';
import { TenderStage, TenderCalculationResult } from '@/types/tenderMapping';
import { EditableTimelineStage } from './EditableTimelineStage';
import { DateTime } from 'luxon';

interface ReportTimelineTabProps {
  stages: TenderStage[];
  result: TenderCalculationResult;
  onResultUpdate: (updatedResult: TenderCalculationResult) => void;
}

export const ReportTimelineTab: React.FC<ReportTimelineTabProps> = ({ stages: initialStages, result, onResultUpdate }) => {
  const [localStages, setLocalStages] = useState<TenderStage[]>(initialStages);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  useEffect(() => {
    // Add a unique 'id' to each stage if it doesn't exist, for React keys
    const stagesWithIds = initialStages.map((stage, index) => ({
      ...stage,
      id: stage.id || `${stage.name}-${index}`
    }));
    setLocalStages(stagesWithIds);
  }, [initialStages]);

  const recalculateTimeline = (updatedStages: TenderStage[], startIndex: number): TenderStage[] => {
    let currentDate = DateTime.fromISO(updatedStages[startIndex].start_date);
    if (!currentDate.isValid) {
      console.error("Cannot recalculate timeline: initial start date is invalid.", updatedStages[startIndex].start_date);
      return updatedStages;
    }

    for (let i = startIndex; i < updatedStages.length; i++) {
      const stage = { ...updatedStages[i] };
      const isoStartDate = currentDate.toISODate();
      stage.start_date = isoStartDate ?? new Date().toISOString().split('T')[0];

      let daysToAdd = stage.duration;
      let endDate = currentDate as DateTime;

      if (stage.is_working_days) {
        let addedDays = 0;
        while (addedDays < daysToAdd) {
          endDate = endDate.plus({ days: 1 });
          if (endDate.weekday !== 5 && endDate.weekday !== 6) {
            addedDays++;
          }
        }
      } else {
        endDate = endDate.plus({ days: daysToAdd });
      }

      const isoEndDate = endDate.toISODate();
      stage.end_date = isoEndDate ?? stage.start_date;
      
      updatedStages[i] = stage;
      currentDate = endDate;
    }
    return updatedStages;
  };

  const handleSaveStage = (updatedStage: TenderStage) => {
    const stageIndex = localStages.findIndex(s => s.id === updatedStage.id);
    if (stageIndex === -1) return;

    const newStages = [...localStages];
    newStages[stageIndex] = updatedStage;
    
    const recalculatedStages = recalculateTimeline(newStages, stageIndex);
    
    let newTotalDuration = result.total_duration;
    if (recalculatedStages.length > 0) {
        const firstDate = DateTime.fromISO(recalculatedStages[0].start_date);
        const lastDate = DateTime.fromISO(recalculatedStages[recalculatedStages.length - 1].end_date);
        if(firstDate.isValid && lastDate.isValid) {
            newTotalDuration = Math.ceil(lastDate.diff(firstDate, 'days').days);
        }
    }
    
    setLocalStages(recalculatedStages);
    setEditingStageId(null);
    onResultUpdate({ ...result, stages: recalculatedStages, total_duration: newTotalDuration });
  };
  
  return (
    <div className="bg-white border border-inputTheme-border rounded-2xl p-4 md:p-8">
      <div className="flex justify-center">
        <div className="relative flex flex-col items-center w-full max-w-lg">
          {/* --- FIX: Added unique key prop --- */}
          {localStages.map((stage, index) => (
            <div key={stage.id} className="flex w-full items-start">
              <div className="flex flex-col items-center md:mr-6">
                <div className="w-8 h-8 rounded-full bg-background-body border-2 border-gray-300 flex items-center justify-center font-medium text-sm z-10">
                  {String(index + 1).padStart(2, '0')}
                </div>
                {index < localStages.length - 1 && (
                  <div className="w-0.5 h-36 md:h-24 bg-gray-300 -mt-1"></div>
                )}
              </div>
              <div className="flex-grow pb-6 md:pb-12 -mt-1 px-4">
                <EditableTimelineStage
                  stage={stage}
                  isEditing={editingStageId === stage.id}
                  onEditClick={() => setEditingStageId(stage.id)}
                  onSave={handleSaveStage}
                  onCancel={() => setEditingStageId(null)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};