// src/features/auth/components/Step3_AdditionalInfoForm.tsx

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
    workplace: '', // This field is for UI only, not sent to backend
    linkedin: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const finishFlow = () => {
    completeOnboarding(); // Mark onboarding as finished
    onComplete();         // Navigate to the dashboard
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasDataToSubmit = formData.jobTitle || formData.linkedin;
    if (!hasDataToSubmit) {
      finishFlow(); // If form is empty, treat as a skip
      return;
    }

    updateUserProfileMutation.mutate({
      jobTitle: formData.jobTitle,
      linkedin: formData.linkedin,
      workplace: formData.workplace,
    }, {
      onSuccess: () => {
        showToast("Profile information saved!", "success");
        finishFlow();
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || 'Could not save additional info.';
        showToast(errorMessage, "error");
        finishFlow(); // Still finish onboarding even if optional info fails to save
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
          <Label htmlFor="workplace">جهة العمل</Label>
          <Input id="workplace" name="workplace" value={formData.workplace} onChange={handleChange} placeholder="أدخل اسم جهة العمل" />
        </div>
        <div>
          <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
          <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="أدخل المسمى الوظيفي" />
        </div>
        <div>
          <Label htmlFor="linkedin">حساب لينكدإن</Label>
          <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="أدخل حساب لينكدإن" />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
            <Button type="button" variant="outline" className="w-full h-11" onClick={handleSkip} disabled={updateUserProfileMutation.isPending}>
                تخطي
            </Button>
            <Button type="submit" className="w-full bg-cta hover:bg-cta-hover h-11" disabled={updateUserProfileMutation.isPending}>
                {updateUserProfileMutation.isPending ? <LoadingSpinner size="sm" /> : "تأكيد"}
            </Button>
        </div>
      </form>
    </div>
  );
};