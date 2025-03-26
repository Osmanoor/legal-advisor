// src/features/templates/components/TemplateForm.tsx
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Template } from "@/hooks/api/useTemplates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { tafqit } from "@/lib/tafqit";
import { toWords } from "number-to-words";

interface TemplateFormProps {
  template: Template;
  onSubmit: (values: Record<string, string>) => void;
  isLoading: boolean;
}

export function TemplateForm({ template, onSubmit, isLoading }: TemplateFormProps) {
  const { t, language, direction } = useLanguage();
  const [values, setValues] = useState<Record<string, string>>({});

  // Set default values when component mounts
  useEffect(() => {
    const defaultValues: Record<string, string> = {};
    
    // Process each placeholder for defaults
    template.placeholders.forEach(placeholder => {
      // Set today's date for date fields
      if (placeholder.type === 'date') {
        defaultValues[placeholder.id] = formatDateForInput(new Date());
      }
    });
    
    // Apply defaults if we have any
    if (Object.keys(defaultValues).length > 0) {
      setValues(prev => ({ ...prev, ...defaultValues }));
    }
  }, [template.placeholders]);
  
  // Watch for changes to total_amount_number
  useEffect(() => {
    // Find placeholders with special dependencies
    const amountTextPlaceholder = template.placeholders.find(p => p.source === 'total_amount_number');
    const amountNumberPlaceholder = template.placeholders.find(p => p.id === 'total_amount_number');
    
    if (amountTextPlaceholder && amountNumberPlaceholder && values.total_amount_number) {
      const amount = parseFloat(values.total_amount_number);
      if (!isNaN(amount)) {
        // Convert to words based on language
        const amountInWords = language === 'ar' 
          ? tafqit(amount)
          : toWords(amount);
        
        setValues(prev => ({
          ...prev,
          [amountTextPlaceholder.id]: amountInWords
        }));
      }
    }
  }, [values.total_amount_number, template.placeholders, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };
  
  // Helper function to format date as YYYY-MM-DD for input fields
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to render the appropriate input based on placeholder type
  const renderInput = (placeholder: Template['placeholders'][0]) => {
    const isDisabled = placeholder.source === 'total_amount_number';

    const inputProps = {
      id: placeholder.id,
      value: values[placeholder.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setValues(prev => ({ ...prev, [placeholder.id]: e.target.value })),
      required: placeholder.required,
      dir: direction,
      className: "mt-1",
      placeholder: placeholder.description[language],
      disabled: isDisabled
    };

    switch (placeholder.type) {
      case 'date':
        return <Input type="date" {...inputProps} />;
      case 'number':
      case 'integer':
        return <Input type="number" {...inputProps} />;
      case 'text':
      case 'string':
        if (placeholder.description[language].length > 100) {
          return <Textarea {...inputProps} rows={3} />;
        }
        return <Input type="text" {...inputProps} />;
      default:
        return <Input type="text" {...inputProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {template.placeholders.map((placeholder) => (
        <div key={placeholder.id} className="space-y-2">
          <Label htmlFor={placeholder.id}>
            {placeholder.description[language]}
            {placeholder.required && <span className="text-red-500 ml-1">*</span>}
            {placeholder.source === 'total_amount_number' && (
              <span className="text-gray-500 text-xs ml-2">{t('templates.autoCalculated')}</span>
            )}
          </Label>
          {renderInput(placeholder)}
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