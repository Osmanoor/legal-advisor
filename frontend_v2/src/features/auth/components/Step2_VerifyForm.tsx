// src/features/auth/components/Step2_VerifyForm.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { OTPInput } from './OTPInput';
import { AxiosError } from 'axios';
import { useAuthMutations } from '@/hooks/api/useAuth';

interface Step2_VerifyFormProps {
  onSuccess: () => void;
  registrationData: {
    identifier: string;
    email?: string;
    phoneNumber?: string;
  };
}

export const Step2_VerifyForm: React.FC<Step2_VerifyFormProps> = ({ onSuccess, registrationData }) => {
  const { t } = useLanguage();
  const { verifyPhoneMutation } = useAuthMutations();
  const { showToast } = useToast();
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    if (otp.length < 6) {
        showToast(t('auth.errorOtpIncomplete'), "error");
        return;
    }

    verifyPhoneMutation.mutate({
      identifier: registrationData.identifier,
      code: otp,
    }, {
      onSuccess: () => {
        showToast(t('auth.verificationSuccess'), 'success');
        onSuccess();
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || t('auth.errorGeneric');
        showToast(errorMessage, 'error');
      }
    });
  };

  const handleChangeNumber = () => {
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col items-center text-center pt-8">
      <p className="text-base text-black mb-8" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
        {t('auth.verifyInstruction', { identifier: registrationData.identifier })}
        <Button variant="link" onClick={handleChangeNumber} className="p-1 text-cta">
          {t('auth.changeNumber')}
        </Button>
      </p>

      <div className="mb-8">
        <OTPInput 
          length={6} 
          onChange={setOtp} 
          isLoading={verifyPhoneMutation.isPending} 
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full max-w-sm bg-cta hover:bg-cta-hover h-11"
        disabled={verifyPhoneMutation.isPending || otp.length < 6}
      >
        {verifyPhoneMutation.isPending ? t('auth.verifying') : t('auth.submit')}
      </Button>
    </div>
  );
};