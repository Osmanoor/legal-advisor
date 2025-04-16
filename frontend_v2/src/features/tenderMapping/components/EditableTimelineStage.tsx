// src/features/tenderMapping/components/EditableTimelineStage.tsx

import { useState } from 'react';
import { TenderStage } from '@/types/tenderMapping';
import { CalendarDays, Edit, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch-rtl';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';

interface EditableTimelineStageProps {
  stage: TenderStage;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (updatedStage: TenderStage) => void;
}

export function EditableTimelineStage({
  stage,
  index,
  isEditing,
  onEdit,
  onCancel,
  onSave
}: EditableTimelineStageProps) {
  const { direction } = useLanguage();
  const [editedDuration, setEditedDuration] = useState(stage.duration.toString());
  const [editedIsWorkingDays, setEditedIsWorkingDays] = useState(stage.is_working_days);
  
  const handleSave = () => {
    // Validate duration is a positive number
    const durationValue = parseInt(editedDuration);
    if (isNaN(durationValue) || durationValue < 0) {
      return; // Invalid input
    }
    
    onSave({
      ...stage,
      duration: durationValue,
      is_working_days: editedIsWorkingDays,
      // Keep track of original values in case we need them
      original_duration: stage.original_duration ?? stage.duration
    });
  };
  
  return (
    <div className="flex">
      <div className={`${direction === 'rtl' ? 'ml-4' : 'mr-4'} flex flex-col items-center`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          stage.notes ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {index + 1}
        </div>
        {/* Only show the line if not the last item - assuming 6 stages max */}
        {index < 5 && <div className="w-px h-full bg-gray-200 my-1"></div>}
      </div>
      
      <div className="flex-1">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="font-medium">{stage.name || "مرحلة"}</div>
            
            {!isEditing ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onEdit}
                className="p-1 h-auto"
              >
                <Edit className="w-4 h-4 text-gray-500" />
              </Button>
            ) : (
              <div className={`flex ${direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCancel}
                  className="p-1 h-auto text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSave}
                  className="p-1 h-auto text-green-500"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          {!isEditing ? (
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <CalendarDays className={`w-4 h-4 ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
              <span>
                {stage.start_date || ""} إلى {stage.end_date || ""} ({stage.duration} {stage.is_working_days ? 'أيام عمل' : 'أيام'})
              </span>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <div className={`flex items-center ${direction === 'rtl' ? 'space-x-reverse' : ''} gap-2`}>
                <Input
                  type="number"
                  value={editedDuration}
                  onChange={(e) => setEditedDuration(e.target.value)}
                  className="w-24 h-8 text-sm"
                  min="0"
                  dir="ltr" // Keep numbers as LTR
                />
                
                {/* RTL-friendly switch group */}
                <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                  <Switch
                    id={`working-days-${index}`}
                    checked={editedIsWorkingDays}
                    onCheckedChange={setEditedIsWorkingDays}
                    className="data-[state=checked]:bg-primary-600"
                  />
                  <Label htmlFor={`working-days-${index}`} className="text-sm">
                    أيام عمل
                  </Label>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <CalendarDays className={`w-3 h-3 inline-block ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                <span>
                  {stage.start_date || ""} إلى {stage.end_date || ""}
                </span>
              </div>
            </div>
          )}
          
          {stage.notes && (
            <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              {stage.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}