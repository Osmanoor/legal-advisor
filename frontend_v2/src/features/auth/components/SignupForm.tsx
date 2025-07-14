// src/features/auth/components/SignupForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { SocialLogins } from './SocialLogins';
import { AxiosError } from 'axios';

export function SignupForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast(t('auth.errorPasswordsDoNotMatch'), 'error');
      return;
    }

    try {
      await register({ fullName, phoneNumber, password });
      // On success, redirect to the confirmation page, passing the phone number.
      navigate('/confirm-account', { state: { phoneNumber } });
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || t('auth.errorGeneric');
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-center mb-6" style={{ fontFamily: 'var(--font-primary-arabic)'}}>
        {t('auth.signupTitle')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">{t('auth.fullName')}</Label>
          <Input
            id="name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('auth.fullNamePlaceholder')}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="signup-phone">رقم الهاتف</Label>
          <Input
            id="signup-phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="أدخل رقم الهاتف"
            required
            dir="ltr"
            autoComplete="tel"
          />
        </div>
        <div>
          <Label htmlFor="signup-password">{t('auth.password')}</Label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            required
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full bg-cta hover:bg-cta-hover" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="sm" /> : t('auth.signup')}
        </Button>
      </form>
      
      {/* Social Logins can be re-enabled if needed */}
      <SocialLogins />
    </div>
  );
}