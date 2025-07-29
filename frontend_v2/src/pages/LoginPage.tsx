// src/pages/LoginPage.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { MultiStepRegister } from '@/features/auth/components/MultiStepRegister';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { t } = useLanguage();
  const [view, setView] = useState<'login' | 'register'>('login');

  return (
    <AuthLayout>
      {view === 'login' ? (
        <>
          <LoginForm onSwitchToSignup={() => setView('register')} />
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setView('register')} className="text-gray-600 hover:text-cta">
              {t('auth.noAccountPrompt')} <span className="font-semibold text-cta mr-1">{t('auth.createAccountAction')}</span>
            </Button>
          </div>
        </>
      ) : (
        <>
          <MultiStepRegister />
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setView('login')} className="text-gray-600 hover:text-cta">
              {t('auth.hasAccountPrompt')} <span className="font-semibold text-cta mr-1">{t('auth.login')}</span>
            </Button>
          </div>
        </>
      )}
    </AuthLayout>
  );
}