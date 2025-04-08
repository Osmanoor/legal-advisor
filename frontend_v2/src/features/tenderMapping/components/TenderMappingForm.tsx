// Updated src/features/tenderMapping/components/TenderMappingForm.tsx

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Updated interface to match the actual data structure
interface WorkType {
  id: string;
  name: string;
}

interface TenderMappingFormProps {
  workTypes: WorkType[];
  isLoading: boolean;
  onSubmit: (values: {
    work_type: string;
    budget: number;
    start_date: string;
    project_duration: number;
  }) => void;
}

export function TenderMappingForm({ workTypes, isLoading, onSubmit }: TenderMappingFormProps) {
  const { t, direction } = useLanguage();
  const [formValues, setFormValues] = useState<{
    work_type: string;
    budget: string;
    start_date: string;
    project_duration: string;
  }>({
    work_type: '',
    budget: '',
    start_date: new Date().toISOString().split('T')[0],
    project_duration: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.work_type || !formValues.budget || !formValues.start_date || !formValues.project_duration) {
      return;
    }
    
    onSubmit({
      work_type: formValues.work_type,
      budget: parseFloat(formValues.budget),
      start_date: formValues.start_date,
      project_duration: parseInt(formValues.project_duration),
    });
  };

  const handleReset = () => {
    setFormValues({
      work_type: '',
      budget: '',
      start_date: new Date().toISOString().split('T')[0],
      project_duration: '',
    });
  };

  // Check if the form is valid
  const isFormValid = formValues.work_type && 
    formValues.budget && 
    formValues.start_date && 
    formValues.project_duration;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tenderMapping.inputs.title')}</CardTitle>
        <CardDescription>{t('tenderMapping.inputs.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Type */}
          <div className="space-y-2">
            <Label htmlFor="work-type" className="text-sm font-medium">نوع العمل</Label>
            <div className="relative">
              <Select
                value={formValues.work_type}
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, work_type: value }))}
              >
                <SelectTrigger 
                  id="work-type"
                  className="w-full text-right"
                  dir={direction}
                >
                  <SelectValue placeholder="اختر نوع العمل" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  align={direction === 'rtl' ? 'end' : 'start'}
                  className="w-full max-h-80 overflow-auto"
                  dir={direction}
                >
                  {workTypes && workTypes.length > 0 ? (
                    workTypes.map((type) => (
                      <SelectItem 
                        key={type.id} 
                        value={type.name}
                        className="text-right"
                      >
                        {type.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>لا توجد أنواع عمل متاحة</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-medium">الميزانية</Label>
            <Input
              id="budget"
              type="number"
              value={formValues.budget}
              onChange={(e) => setFormValues((prev) => ({ ...prev, budget: e.target.value }))}
              placeholder="أدخل الميزانية"
              dir={direction}
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium">تاريخ البدء</Label>
            <Input
              id="start-date"
              type="date"
              value={formValues.start_date}
              onChange={(e) => setFormValues((prev) => ({ ...prev, start_date: e.target.value }))}
              dir="ltr" // Date inputs are always ltr
            />
          </div>

          {/* Project Duration */}
          <div className="space-y-2">
            <Label htmlFor="project-duration" className="text-sm font-medium">مدة المشروع (بالأشهر)</Label>
            <Input
              id="project-duration"
              type="number"
              value={formValues.project_duration}
              onChange={(e) => setFormValues((prev) => ({ ...prev, project_duration: e.target.value }))}
              placeholder="أدخل مدة المشروع"
              dir={direction}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading || !isFormValid}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('tenderMapping.inputs.reset')}
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('tenderMapping.loading')}
                </>
              ) : (
                t('tenderMapping.inputs.submit')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}