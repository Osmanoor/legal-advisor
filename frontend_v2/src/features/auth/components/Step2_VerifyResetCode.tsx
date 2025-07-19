// src/features/auth/components/Step2_VerifyResetCode.tsx

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { usePasswordReset } from '@/hooks/api/usePasswordReset';
import { Button } from '@/components/ui/button';
import { OTPInput } from './OTPInput';
import { AxiosError } from 'axios';
import { KeyRound } from 'lucide-react';

interface Step2_VerifyResetCodeProps {
  onSuccess: (code: string) => void;
  identifier: string;
}

export const Step2_VerifyResetCode: React.FC<Step2_VerifyResetCodeProps> = ({ onSuccess, identifier }) => {
  const { showToast } = useToast();
  const { verifyCodeMutation } = usePasswordReset();
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    if (otp.length < 6) {
      showToast('Please enter the 6-digit code.', 'error');
      return;
    }

    verifyCodeMutation.mutate({ identifier, code: otp }, {
      onSuccess: () => {
        showToast('Code verified successfully!', 'success');
        onSuccess(otp); // Pass the verified code to the parent for the next step
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || 'An unknown error occurred.';
        showToast(errorMessage, 'error');
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <KeyRound className="h-6 w-6 text-cta" />
        </div>
        <h2 className="text-2xl font-semibold">Enter Verification Code</h2>
        <p className="text-gray-500 mt-2">A 6-digit code was sent to <br/><strong>{identifier}</strong>.</p>
      </div>

      <div className="mb-6">
        <OTPInput 
          length={6} 
          onChange={setOtp} 
          isLoading={verifyCodeMutation.isPending} 
        />
      </div>

      <Button 
        onClick={handleSubmit}
        className="w-full max-w-sm bg-cta hover:bg-cta-hover h-11"
        disabled={verifyCodeMutation.isPending || otp.length < 6}
      >
        {verifyCodeMutation.isPending ? "Verifying..." : "Verify Code"}
      </Button>
    </div>
  );
};