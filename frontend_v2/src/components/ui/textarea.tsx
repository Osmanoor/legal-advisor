// src/components/ui/textarea.tsx
import * as React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    const { direction } = useLanguage();
    
    return (
      <div>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-border-input bg-background-body px-3 py-2 text-sm shadow-input-shadow ring-offset-background placeholder:text-text-on-light-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cta disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:ring-error",
            className
          )}
          ref={ref}
          dir={direction}
          {...props}
        />
        {error && (
          <p className={`mt-1 text-sm text-error ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";