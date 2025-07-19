// src/features/auth/components/Step2_VerifyForm.tsx

import React, { useState } from 'react'; // Import useState
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { OTPInput } from './OTPInput';
import { AxiosError } from 'axios';
import { useAuthMutations } from '@/hooks/api/useAuth';

interface Step2_VerifyFormProps {
  onSuccess: () => void;
  registrationData: {
    identifier: string; // The primary identifier
    email?: string;
    phoneNumber?: string;
  };
}

export const Step2_VerifyForm: React.FC<Step2_VerifyFormProps> = ({ onSuccess, registrationData }) => {
  const { t } = useLanguage();
  const { verifyPhoneMutation } = useAuthMutations();
  const { showToast } = useToast();

  // FIX: Add local state to hold the OTP value
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    if (otp.length < 6 || verifyPhoneMutation.isPending) {
        if (otp.length < 6) {
            showToast("Please enter the complete 6-digit code.", "error");
        }
        return;
    }

    verifyPhoneMutation.mutate({
      identifier: registrationData.identifier,
      code: otp,
    }, {
      onSuccess: () => {
        showToast('Phone verified successfully!', 'success');
        onSuccess(); // This now correctly fires only after a successful API call
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || "Invalid verification code.";
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
        أدخل الرقم السري المرسل لرقم الهاتف {registrationData.identifier}، 
        <Button variant="link" onClick={handleChangeNumber} className="p-1 text-cta">
          هل تريد تغيير الرقم ؟
        </Button>
      </p>

      <div className="mb-8">
        {/* FIX: Pass the setOtp function to the onChange prop */}
        <OTPInput 
          length={6} 
          onChange={setOtp} 
          isLoading={verifyPhoneMutation.isPending} 
        />
      </div>

      {/* FIX: This button now triggers the submission */}
      <Button
        onClick={handleSubmit}
        className="w-full max-w-sm bg-cta hover:bg-cta-hover h-11"
        disabled={verifyPhoneMutation.isPending || otp.length < 6}
      >
        {verifyPhoneMutation.isPending ? "جاري التحقق..." : "تأكيد"}
      </Button>
    </div>
  );
};