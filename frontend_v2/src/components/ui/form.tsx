// src/components/ui/form.tsx
import * as React from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  const { direction } = useLanguage();
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className={`text-sm text-red-500 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
          {error}
        </p>
      )}
    </div>
  );
}