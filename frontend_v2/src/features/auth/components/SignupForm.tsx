// File: src/features/auth/components/SignupForm.tsx
// @new
// The form handling user registration.

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

export function SignupForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast(t('auth.errorPasswordsDoNotMatch'), 'error');
      return;
    }

    try {
      await register({ name, email, password });
      // On success, redirect to the confirmation page
      navigate('/confirm-account', { state: { email } });
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(t('auth.errorGeneric'), 'error');
      }
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.fullNamePlaceholder')}
            required
          />
        </div>
        <div>
          <Label htmlFor="signup-email">{t('auth.email')}</Label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            required
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
          />
        </div>

        <Button type="submit" className="w-full bg-cta hover:bg-cta-hover" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="sm" /> : t('auth.signup')}
        </Button>
      </form>

      <SocialLogins />
    </div>
  );
}