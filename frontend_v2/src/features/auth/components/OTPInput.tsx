// src/features/auth/components/OTPInput.tsx

import React, { useRef, useState, KeyboardEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length: number;
  // FIX: Changed prop from onComplete to onChange to prevent auto-submission
  onChange: (otp: string) => void; 
  isLoading?: boolean;
}

export function OTPInput({ length, onChange, isLoading = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);

    // Notify the parent component of the change
    const completeOtp = newOtp.join('');
    onChange(completeOtp);

    // Focus next input only, do not submit
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 md:gap-4" dir="ltr">
      {otp.map((data, index) => (
        <Input
          key={index}
          ref={el => { inputRefs.current[index] = el; }}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target, index)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
          onFocus={e => e.target.select()}
          disabled={isLoading}
          className={cn(
            "w-12 h-16 md:w-16 md:h-24 text-2xl md:text-4xl text-center font-bold",
            otp[index] ? "border-cta border-2" : "border-gray-300"
          )}
        />
      ))}
    </div>
  );
}