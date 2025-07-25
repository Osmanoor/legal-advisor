// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    const { direction } = useLanguage();
    
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border-input bg-background-body px-3 py-2 text-sm shadow-input-shadow ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-on-light-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cta disabled:cursor-not-allowed disabled:opacity-50",
            icon && (direction === 'rtl' ? 'pl-3 pr-9' : 'pl-9 pr-3'),
            error && "border-error focus-visible:ring-error",
            className
          )}
          dir={direction}
          ref={ref}
          {...props}
        />
        {icon && (
          <div className={`absolute inset-y-0 ${direction === 'rtl' ? 'right-3' : 'left-3'} flex items-center pointer-events-none text-gray-400`}>
            {icon}
          </div>
        )}
        {error && (
          <p className={`mt-1 text-sm text-error ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };