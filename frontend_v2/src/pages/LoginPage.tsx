// src/pages/LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { MultiStepRegister } from '@/features/auth/components/MultiStepRegister';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { t } = useLanguage();
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // --- MODIFICATION START ---
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let errorMessageKey = 'auth.errorGeneric';
      if (error === 'linkedin_auth_failed') {
        errorMessageKey = 'auth.linkedinAuthFailed';
      } else if (error === 'linkedin_process_failed') {
        errorMessageKey = 'auth.linkedinProcessFailed';
      }
      
      showToast(t(errorMessageKey), 'error');
      
      // Clean the error from the URL to prevent it from showing again on refresh
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showToast, t]);
  // --- MODIFICATION END ---


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