// src/components/ui/switch-rtl.tsx

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

const SwitchRTL = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { direction } = useLanguage();
  
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cta disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-cta data-[state=unchecked]:bg-gray-200",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          direction === 'rtl'
            ? "data-[state=checked]:translate-x-[-20px] data-[state=unchecked]:translate-x-0"
            : "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
});

SwitchRTL.displayName = SwitchPrimitives.Root.displayName;

export { SwitchRTL as Switch };