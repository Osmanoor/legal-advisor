// src/features/auth/components/LoginForm.tsx
// Updated for i18n

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { SocialLogins } from './SocialLogins';
import { AxiosError } from 'axios';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useToast();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ loginIdentifier, password, rememberMe });
      navigate('/chat');
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || t('auth.errorInvalidCredentials');
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-center mb-6" style={{ fontFamily: 'var(--font-primary-arabic)'}}>
        {t('auth.loginTitle')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="loginIdentifier">{t('auth.emailOrPhone')}</Label>
          <Input id="loginIdentifier" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
            />
            <Label htmlFor="remember-me" className="font-normal text-sm text-gray-600">
              {t('auth.rememberMe')}
            </Label>
          </div>
          <Link to="/password-reset" className="text-sm font-medium text-cta hover:underline">
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" className="w-full bg-cta hover:bg-cta-hover h-11" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="sm" /> : t('auth.login')}
        </Button>
      </form>

      <SocialLogins />
    </div>
  );
};