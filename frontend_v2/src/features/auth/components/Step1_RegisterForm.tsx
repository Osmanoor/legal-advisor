// src/features/auth/components/Step1_RegisterForm.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SocialLogins } from './SocialLogins';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AxiosError } from 'axios';
import { useAuthMutations } from '@/hooks/api/useAuth';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneNumberInput.css';

interface Step1_RegisterFormProps {
  onSuccess: (data: { identifier: string; email?: string, phoneNumber?: string }) => void;
}

export const Step1_RegisterForm: React.FC<Step1_RegisterFormProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { registerMutation } = useAuthMutations();
  
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast(t('auth.errorPasswordsDoNotMatch'), 'error');
      return;
    }
    
    const finalEmail = formData.email.trim() ? formData.email.trim() : undefined;
    const finalPhoneNumber = phoneNumber && isPossiblePhoneNumber(phoneNumber) ? phoneNumber : undefined;
    
    if (!finalEmail && !finalPhoneNumber) {
      showToast(t('auth.errorMissingIdentifier'), 'error');
      return;
    }

    const payload = {
        fullName: formData.fullName,
        password: formData.password,
        email: finalEmail,
        phoneNumber: finalPhoneNumber,
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        showToast(t('auth.registrationSuccess'), 'success');
        const primaryIdentifier = finalPhoneNumber || finalEmail || '';
        onSuccess({ 
            identifier: primaryIdentifier,
            email: finalEmail, 
            phoneNumber: finalPhoneNumber 
        });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="fullName">{t('auth.fullName')}</Label>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder={t('auth.fullNamePlaceholder')}/>
        </div>
        <div>
            <Label htmlFor="email">{t('auth.emailOptional')}</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t('auth.emailPlaceholder')}/>
        </div>
        
        <div className="space-y-2 text-right">
          <Label htmlFor="phoneNumber">{t('auth.phoneOptional')}</Label>
          <PhoneInput
            international
            defaultCountry="SA"
            value={phoneNumber}
            onChange={setPhoneNumber}
            className="phone-input-container bg-white theme-light"
            dir="ltr"
          />
        </div>

        <div>
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder={t('auth.passwordPlaceholder')}/>
        </div>
        <div>
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder={t('auth.confirmPasswordPlaceholder')}/>
        </div>

        <Button type="submit" className="w-full bg-cta hover:bg-cta-hover h-11" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? <LoadingSpinner size="sm" /> : t('auth.signup')}
        </Button>
      </form>
      <SocialLogins />
    </div>
  );
};