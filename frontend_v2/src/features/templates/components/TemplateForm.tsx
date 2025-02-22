// src/features/templates/components/TemplateForm.tsx
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Template } from "@/hooks/api/useTemplates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface TemplateFormProps {
  template: Template;
  onSubmit: (values: Record<string, string>) => void;
  isLoading: boolean;
}

export function TemplateForm({ template, onSubmit, isLoading }: TemplateFormProps) {
  const { t, direction } = useLanguage();
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {template.placeholders.map((placeholder) => (
        <div key={placeholder} className="space-y-2">
          <Label>{placeholder}</Label>
          <Input
            value={values[placeholder] || ''}
            onChange={(e) => setValues(prev => ({
              ...prev,
              [placeholder]: e.target.value
            }))}
            required
            dir={direction}
          />
        </div>
      ))}
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            {t('common.loading')}
          </div>
        ) : (
          t('templates.generate')
        )}
      </Button>
    </form>
  );
}