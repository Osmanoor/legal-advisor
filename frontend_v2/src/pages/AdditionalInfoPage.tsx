// File: src/pages/AdditionalInfoPage.tsx
// @new
// The page for collecting optional user information after signup.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function AdditionalInfoPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    workplace: '',
    jobTitle: '',
    linkedin: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call to save additional info
    await new Promise(res => setTimeout(res, 1000));
    console.log("Saving additional info:", formData);
    setIsLoading(false);
    showToast("Profile updated!", "success");
    navigate('/chat'); // Redirect to dashboard
  };
  
  const handleSkip = () => {
    navigate('/chat'); // Redirect to dashboard
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-primary-arabic)'}}>
            {t('auth.additionalInfoTitle')}
            </h2>
            <p className="text-gray-600 mt-2">{t('auth.additionalInfoSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="workplace">{t('auth.workplace')}</Label>
              <Input
                id="workplace"
                name="workplace"
                value={formData.workplace}
                onChange={handleChange}
                placeholder={t('auth.workplacePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">{t('auth.jobTitle')}</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder={t('auth.jobTitlePlaceholder')}
              />
            </div>
             <div>
              <Label htmlFor="linkedin">{t('auth.linkedinAccount')}</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder={t('auth.linkedinPlaceholder')}
              />
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                 <Button type="button" variant="outline" className="w-full" onClick={handleSkip}>
                    {t('auth.skip')}
                </Button>
                <Button type="submit" className="w-full bg-cta hover:bg-cta-hover" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="sm" /> : t('auth.submit')}
                </Button>
            </div>
        </form>
      </div>
    </AuthLayout>
  );
}