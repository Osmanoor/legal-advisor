// src/features/tenderMapping/components/ProcurementCalculatorForm.tsx

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface WorkType {
  id: string;
  name: string;
}

interface ProcurementCalculatorFormProps {
  workTypes: WorkType[];
  isLoading: boolean;
  onSubmit: (values: {
    work_type: string;
    budget: number;
    start_date: string;
    project_duration: number;
  }) => void;
}

export function ProcurementCalculatorForm({ 
  workTypes, 
  isLoading, 
  onSubmit 
}: ProcurementCalculatorFormProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    work_type: '',
    budget: 0,
    start_date: new Date().toISOString().split('T')[0],
    project_duration: 6
  });

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleReset = () => {
    setValues({
      work_type: '',
      budget: 0,
      start_date: new Date().toISOString().split('T')[0],
      project_duration: 6
    });
  };

  // Check if at least work_type and budget are set
  const isFormValid = !!values.work_type && values.budget > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>حاسبة نوع المنافسة</CardTitle>
        <CardDescription>أدخل تفاصيل المشروع لتحديد نوع المنافسة المناسب</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="work_type">نوع العمل</Label>
            <Select
              value={values.work_type}
              onValueChange={(value) => handleChange('work_type', value)}
            >
              <SelectTrigger id="work_type">
                <SelectValue placeholder="اختر نوع العمل" />
              </SelectTrigger>
              <SelectContent>
                {workTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Input */}
          <div className="space-y-2">
            <Label htmlFor="budget">المبلغ (بالريال)</Label>
            <Input
              id="budget"
              type="number"
              min="0"
              value={values.budget || ''}
              onChange={(e) => handleChange('budget', Number(e.target.value))}
              placeholder="أدخل مبلغ المشروع"
            />
          </div>

          {/* Start Date Input */}
          <div className="space-y-2">
            <Label htmlFor="start_date">تاريخ البدء</Label>
            <Input
              id="start_date"
              type="date"
              value={values.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
            />
          </div>

          {/* Project Duration Input */}
          <div className="space-y-2">
            <Label htmlFor="project_duration">مدة المشروع (بالأشهر)</Label>
            <Input
              id="project_duration"
              type="number"
              min="1"
              value={values.project_duration}
              onChange={(e) => handleChange('project_duration', Number(e.target.value))}
              placeholder="أدخل مدة المشروع بالأشهر"
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
              إعادة تعيين
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  جاري الحساب...
                </>
              ) : (
                'حساب نوع المنافسة'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}