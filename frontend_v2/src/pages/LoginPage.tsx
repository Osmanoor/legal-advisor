// File: src/pages/LoginPage.tsx
// @new
// This page acts as the container for both Login and Signup forms.

import React, { useState } from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/hooks/useLanguage';

export default function LoginPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('login');

  return (
    <AuthLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#ECFFEA] rounded-lg p-1">
          <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
          <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-6">
          <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
        </TabsContent>
        <TabsContent value="signup" className="mt-6">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}