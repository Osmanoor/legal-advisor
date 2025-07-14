// src/pages/ConfirmAccountPage.tsx

import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/features/auth/components/OTPInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { Smartphone } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AxiosError } from 'axios';

export default function ConfirmAccountPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const { verifyPhone, isLoading } = useAuthStore();
  const phoneNumber = location.state?.phoneNumber;

  // Redirect if the page is accessed without a phone number in the state
  if (!phoneNumber) {
    navigate('/login');
    return null; // Render nothing while redirecting
  }

  const handleOtpComplete = async (otp: string) => {
    try {
      await verifyPhone({ phoneNumber, code: otp });
      showToast("Account confirmed successfully!", "success");
      navigate('/chat');
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || "Invalid OTP code. Please try again.";
      showToast(errorMessage, 'error');
    }
  };

  const handleResendCode = async () => {
    // This would typically call another API endpoint.
    // For now, we'll just show a toast.
    showToast("A new code has been sent (mock).", "info");
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <Smartphone className="h-6 w-6 text-cta" />
        </div>
        <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-primary-arabic)'}}>
          تأكيد رقم الهاتف
        </h2>
        <p className="text-gray-600 mb-6">
          تم إرسال رمز التحقق المكون من 6 أرقام إلى رقم هاتفك <strong>{phoneNumber}</strong>
        </p>

        <div className="mb-6">
          <OTPInput 
            length={6} 
            onComplete={handleOtpComplete} 
            isLoading={isLoading} 
          />
        </div>

        {isLoading && <LoadingSpinner className="mt-4 mx-auto" />}

        <p className="text-sm text-gray-500">
          لم تستلم الرمز؟{' '}
          <Button variant="link" className="p-0 h-auto" onClick={handleResendCode} disabled={isLoading}>
            إعادة إرسال الرمز
          </Button>
        </p>
        
        <div className="mt-8">
            <Link to="/login" className="text-sm text-gray-600 hover:text-cta">
              ‚Üê {t('auth.backToLogin')}
            </Link>
        </div>
      </div>
    </AuthLayout>
  );
}