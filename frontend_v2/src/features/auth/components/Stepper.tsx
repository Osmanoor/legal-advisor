// src/features/auth/components/Stepper.tsx

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  const { direction } = useLanguage();

  return (
    <div className="flex items-center justify-center w-full max-w-sm mx-auto">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium transition-all duration-300",
                  isCompleted ? "bg-cta border-cta text-white" : "",
                  isActive ? "bg-white border-cta text-cta" : "",
                  !isCompleted && !isActive ? "bg-white border-gray-300 text-gray-400" : ""
                )}
              >
                {isCompleted ? <Check size={18} /> : `0${stepNumber}`}
              </div>
              <p
                className={cn(
                  "mt-2 text-xs font-medium w-24 transition-colors duration-300",
                   isActive || isCompleted ? "text-cta" : "text-gray-500"
                )}
                style={{ fontFamily: 'var(--font-primary-arabic)'}}
              >
                {label}
              </p>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 transition-colors duration-300",
                  isCompleted || isActive ? "bg-cta" : "bg-gray-300"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};