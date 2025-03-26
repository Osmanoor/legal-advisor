// src/features/tenderMapping/components/TenderMappingForm.tsx
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderCategory } from '@/types/tenderMapping';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface TenderMappingFormProps {
  categories: TenderCategory[];
  isLoading: boolean;
  onSubmit: (values: Record<string, string>) => void;
}

export function TenderMappingForm({ categories, isLoading, onSubmit }: TenderMappingFormProps) {
  const { t } = useLanguage();
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleChange = (category: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const handleReset = () => {
    setFormValues({});
  };

  // Check if at least one value is selected
  const isFormValid = Object.keys(formValues).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tenderMapping.inputs.title')}</CardTitle>
        <CardDescription>{t('tenderMapping.inputs.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {categories.map((category) => (
            <div key={category.category} className="space-y-2">
              <label className="text-sm font-medium">{category.category}</label>
              <Select
                value={formValues[category.category] || ''}
                onValueChange={(value) => handleChange(category.category, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {category.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
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