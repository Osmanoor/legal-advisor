// src/features/auth/components/Step3_SetNewPassword.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { usePasswordReset } from '@/hooks/api/usePasswordReset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AxiosError } from 'axios';
import { Lock } from 'lucide-react';

interface Step3_SetNewPasswordProps {
  onComplete: () => void;
  identifier: string;
  code: string;
}

export const Step3_SetNewPassword: React.FC<Step3_SetNewPasswordProps> = ({ onComplete, identifier, code }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { resetPasswordMutation } = usePasswordReset();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast(t('auth.errorPasswordLength'), 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t('auth.errorPasswordsDoNotMatch'), 'error');
      return;
    }

    resetPasswordMutation.mutate({ identifier, code, newPassword }, {
      onSuccess: (response) => {
        const message = (response.data as { message: string }).message;
        showToast(message, 'success');
        onComplete();
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || t('auth.errorGeneric');
        showToast(errorMessage, 'error');
      }
    });
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Lock className="h-6 w-6 text-cta" />
        </div>
        <h2 className="text-2xl font-semibold">{t('auth.setNewPasswordTitle')}</h2>
        <p className="text-gray-500 mt-2">{t('auth.setNewPasswordInstruction')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="newPassword">{t('auth.newPassword')}</Label>
          <Input 
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('auth.newPasswordPlaceholder')}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
          <Input 
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.confirmNewPasswordPlaceholder')}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-cta hover:bg-cta-hover h-11"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? <LoadingSpinner size="sm" /> : t('auth.resetPasswordAction')}
        </Button>
      </form>
    </div>
  );
};