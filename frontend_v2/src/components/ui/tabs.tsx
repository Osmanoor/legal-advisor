// src/components/ui/tabs.tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { direction } = useLanguage();
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-auto items-center justify-center rounded-lg bg-tab-inactiveBg p-1 gap-1.5",
        direction === 'rtl' ? "flex-row-reverse" : "",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { direction } = useLanguage();
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cta",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-tab-activeBg data-[state=active]:text-tab-activeText data-[state=active]:shadow-sm data-[state=active]:font-semibold",
        "data-[state=inactive]:text-tab-inactiveText data-[state=inactive]:font-normal",
        direction === 'rtl' ? "flex-row-reverse" : "",
        className
      )}
      style={{
        fontFamily: direction === 'rtl' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)',
        height: '40px' // Consistent height
      }}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background",
      // Removed the card-like styles from here to make it more flexible.
      // The parent component should now provide the Card or other container.
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };