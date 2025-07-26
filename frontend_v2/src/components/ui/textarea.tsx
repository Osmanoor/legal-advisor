// src/components/ui/textarea.tsx
import * as React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "flex w-full rounded-lg text-sm ring-offset-background placeholder:text-text-on-light-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cta disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "min-h-[80px] border border-border-input bg-background-body px-3 py-2 shadow-input-shadow",
        ghost: "resize-none bg-transparent p-0 shadow-none border-none focus-visible:ring-0 focus-visible:ring-offset-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);


export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, ...props }, ref) => {
    const { direction } = useLanguage();
    
    return (
      <div>
        <textarea
          className={cn(
            textareaVariants({ variant, className }),
            error && "border-error focus-visible:ring-error"
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