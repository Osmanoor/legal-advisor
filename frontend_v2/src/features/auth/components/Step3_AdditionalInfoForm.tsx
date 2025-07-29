// src/features/auth/components/Step3_AdditionalInfoForm.tsx
// Updated for i18n

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useAuthStore } from '@/stores/authStore';
import { AxiosError } from 'axios';

interface Step3_AdditionalInfoFormProps {
  onComplete: () => void;
}

export const Step3_AdditionalInfoForm: React.FC<Step3_AdditionalInfoFormProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { updateUserProfileMutation } = useUserProfile();
  const { completeOnboarding } = useAuthStore();

  const [formData, setFormData] = useState({
    jobTitle: '',
    workplace: '',
    linkedin: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const finishFlow = () => {
    completeOnboarding();
    onComplete();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasDataToSubmit = formData.jobTitle || formData.linkedin || formData.workplace;
    if (!hasDataToSubmit) {
      finishFlow();
      return;
    }

    updateUserProfileMutation.mutate(formData, {
      onSuccess: () => {
        showToast(t('auth.profileSavedSuccess'), "success");
        finishFlow();
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || t('auth.errorSavingProfile');
        showToast(errorMessage, "error");
        finishFlow();
      }
    });
  };

  const handleSkip = () => {
    finishFlow();
  };
  
  return (
    <div className="w-full pt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="workplace">{t('auth.workplace')}</Label>
          <Input id="workplace" name="workplace" value={formData.workplace} onChange={handleChange} placeholder={t('auth.workplacePlaceholder')} />
        </div>
        <div>
          <Label htmlFor="jobTitle">{t('auth.jobTitle')}</Label>
          <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder={t('auth.jobTitlePlaceholder')} />
        </div>
        <div>
          <Label htmlFor="linkedin">{t('auth.linkedinAccount')}</Label>
          <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder={t('auth.linkedinPlaceholder')} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <Button type="button" variant="outline" className="w-full h-11" onClick={handleSkip} disabled={updateUserProfileMutation.isPending}>
                {t('auth.skip')}
            </Button>
            <Button type="submit" className="w-full bg-cta hover:bg-cta-hover h-11" disabled={updateUserProfileMutation.isPending}>
                {updateUserProfileMutation.isPending ? <LoadingSpinner size="sm" /> : t('auth.submit')}
            </Button>
        </div>
      </form>
    </div>
  );
};