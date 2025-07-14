// File: src/pages/ConfirmAccountPage.tsx
// @new
// The page for users to confirm their account via OTP.

import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/features/auth/components/OTPInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { MailCheck } from 'lucide-react';

export default function ConfirmAccountPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const email = location.state?.email || 'your-email@example.com'; // Fallback for display

  // Mock OTP verification
  const handleOtpComplete = (otp: string) => {
    console.log("Verifying OTP:", otp);
    // In a real app, you would make an API call here.
    // If successful:
    showToast("Account confirmed successfully!", "success");
    navigate('/additional-info');
    // If not successful:
    // showToast("Invalid OTP code.", "error");
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <MailCheck className="h-6 w-6 text-cta" />
        </div>
        <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-primary-arabic)'}}>
          {t('auth.confirmAccountTitle')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('auth.confirmInstruction', { email })}
        </p>

        <div className="mb-6">
          <OTPInput length={6} onComplete={handleOtpComplete} />
        </div>

        <p className="text-sm text-gray-500">
          {t('auth.didNotReceiveCode')}{' '}
          <Button variant="link" className="p-0 h-auto">
            {t('auth.resendCode')}
          </Button>
        </p>
        
        <div className="mt-8">
            <Link to="/login" className="text-sm text-gray-600 hover:text-cta">
              ← {t('auth.backToLogin')}
            </Link>
        </div>
      </div>
    </AuthLayout>
  );
}