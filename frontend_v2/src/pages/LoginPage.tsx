// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { MultiStepRegister } from '@/features/auth/components/MultiStepRegister'; // Import the new component
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

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
              ليس لديك حساب ؟ <span className="font-semibold text-cta mr-1">أنشئ حساب</span>
            </Button>
          </div>
        </>
      ) : (
        <>
          <MultiStepRegister />
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setView('login')} className="text-gray-600 hover:text-cta">
              لديك حساب بالفعل ؟ <span className="font-semibold text-cta mr-1">سجل دخول</span>
            </Button>
          </div>
        </>
      )}
    </AuthLayout>
  );
}