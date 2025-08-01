// src/pages/SettingsPage.tsx
// Updated for i18n

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUserProfile } from '@/hooks/api/useUserProfile';
import { useAuthMutations } from '@/hooks/api/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Camera, ChevronLeft, Languages, Lock, UploadCloud  } from 'lucide-react';
import { AxiosError } from 'axios';

const FormSeparatorWithLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 py-4">
        <Separator className="flex-1" />
        <span className="text-sm text-gray-500">{label}</span>
        <Separator className="flex-1" />
    </div>
);

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuthStore();
  const { updateUserProfileMutation, uploadAvatarMutation } = useUserProfile();
  const { changePasswordMutation } = useAuthMutations();
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '', email: '', workplace: '', jobTitle: '', linkedin: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmNewPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        workplace: user.workplace || '',
        jobTitle: user.jobTitle || '',
        linkedin: user.linkedin_id || '',
      });
      setPreviewUrl(user.profile_picture_url || null);
    }
  }, [user]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(t('settings.toasts.fileTooLarge'), "error");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = () => {
    if (selectedFile) {
      uploadAvatarMutation.mutate(selectedFile, {
        onSuccess: () => {
            showToast(t('settings.toasts.avatarSuccess'), "success");
            setSelectedFile(null);
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || t('settings.toasts.avatarError');
            showToast(errorMessage, 'error');
            setPreviewUrl(user?.profile_picture_url || null);
            setSelectedFile(null);
        }
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = () => {
    updateUserProfileMutation.mutate(formData, {
        onSuccess: () => showToast(t('settings.toasts.profileSuccess'), 'success'),
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || t('settings.toasts.profileError');
            showToast(errorMessage, 'error');
        }
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
        showToast(t('settings.toasts.passwordLengthError'), "error");
        return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        showToast(t('settings.toasts.passwordMismatchError'), "error");
        return;
    }
    changePasswordMutation.mutate({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
    }, {
        onSuccess: () => {
            showToast(t('settings.toasts.passwordSuccess'), "success");
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || t('settings.toasts.passwordError');
            showToast(errorMessage, 'error');
        }
    });
  };
  
  if (!user) return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <img 
            src={previewUrl || "/images/avatars/avatar1.png"}
            alt={user.fullName} 
            className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif"/>
          <Button size="icon" className="absolute bottom-1 right-1 h-9 w-9 bg-gray-700/80 hover:bg-gray-900/90 rounded-full" onClick={handleAvatarClick} title={t('settings.uploadAction')}>
            <Camera className="h-5 w-5 text-white" />
          </Button>
        </div>
        
        {selectedFile && (
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={handleUploadAvatar} size="sm" className="bg-cta hover:bg-cta-hover" disabled={uploadAvatarMutation.isPending}>
              <UploadCloud className="mr-2 h-4 w-4" />
              {uploadAvatarMutation.isPending ? t('settings.uploading') : t('settings.uploadAction')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setSelectedFile(null); setPreviewUrl(user.profile_picture_url || null); }} disabled={uploadAvatarMutation.isPending}>
              {t('common.cancel')}
            </Button>
          </div>
        )}

        <h1 className="text-3xl font-bold">{user.fullName}</h1>
        <p className="text-md text-gray-500 mt-1">{user.jobTitle || t('settings.jobTitlePlaceholder')}</p>
      </div>
      <Card className="p-6 sm:p-8">
        <div className="space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
            <FormSeparatorWithLabel label={t('settings.basicInfo')} />
            <div className="grid grid-cols-1 gap-y-4 mt-4 mb-8">
              <div className="space-y-1.5 text-right"><Label htmlFor="fullName">{t('settings.name')}</Label><Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="space-y-1.5 text-right"><Label htmlFor="email">{t('settings.email')}</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} /></div>
                <div className="space-y-1.5 text-right"><Label htmlFor="phoneNumber">{t('settings.phone')}</Label><Input id="phoneNumber" name="phoneNumber" value={user.phoneNumber} disabled className="bg-gray-100 cursor-not-allowed" /></div>
              </div>
            </div>
            <FormSeparatorWithLabel label={t('settings.additionalInfo')} />
            <div className="grid grid-cols-1 gap-y-4 mt-4">
              <div className="space-y-1.5 text-right"><Label htmlFor="workplace">{t('settings.workplace')}</Label><Input id="workplace" name="workplace" value={formData.workplace} onChange={handleChange} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="space-y-1.5 text-right"><Label htmlFor="jobTitle">{t('settings.jobTitle')}</Label><Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} /></div>
                <div className="space-y-1.5 text-right"><Label htmlFor="linkedin">{t('settings.linkedin')}</Label><Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} disabled className='bg-gray-100 cursor-not-allowed' /></div>
              </div>
            </div>
            <div className="mt-8 flex w-full"><Button type="submit" className="w-full bg-cta hover:bg-cta-hover" disabled={updateUserProfileMutation.isPending}>{updateUserProfileMutation.isPending ? <LoadingSpinner size="sm" /> : t('settings.save')}</Button></div>
          </form>
          <Separator />
          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger asChild><button className="flex items-center justify-between p-4 border border-[#F0F2F5] rounded-lg hover:bg-gray-50 cursor-pointer w-full text-right"><div className="flex items-center gap-4"><span>{t('settings.changePassword')}</span><Lock className="text-gray-500"/></div><ChevronLeft className="collapsible-chevron" /></button></CollapsibleTrigger>
              <CollapsibleContent className="radix-collapsible-content">
                <form onSubmit={handleChangePassword} className="p-4 border border-t-0 rounded-b-lg space-y-4">
                  <div className="space-y-1.5 text-right"><Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label><Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required/></div>
                  <div className="space-y-1.5 text-right"><Label htmlFor="newPassword">{t('settings.newPassword')}</Label><Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required/></div>
                  <div className="space-y-1.5 text-right"><Label htmlFor="confirmNewPassword">{t('settings.confirmNewPassword')}</Label><Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required/></div>
                  <div className="flex justify-end"><Button type="submit" disabled={changePasswordMutation.isPending}>{changePasswordMutation.isPending ? <LoadingSpinner size="sm"/> : t('settings.updatePassword')}</Button></div>
                </form>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger asChild><button className="flex items-center justify-between p-4 border border-[#F0F2F5] rounded-lg hover:bg-gray-50 cursor-pointer w-full text-right"><div className="flex items-center gap-4"><span>{t('settings.changeLanguage')}</span><Languages className="text-gray-500"/></div><ChevronLeft className="collapsible-chevron" /></button></CollapsibleTrigger>
              <CollapsibleContent className="radix-collapsible-content">
                 <div className="p-4 border border-t-0 rounded-b-lg space-y-2">
                    <RadioGroup defaultValue={language} onValueChange={(value) => setLanguage(value as 'ar' | 'en')} className="flex justify-end gap-6">
                        <div className="flex items-center gap-2"><Label htmlFor="lang-ar">العربية</Label><RadioGroupItem value="ar" id="lang-ar" /></div>
                        <div className="flex items-center gap-2"><Label htmlFor="lang-en">English</Label><RadioGroupItem value="en" id="lang-en" /></div>
                    </RadioGroup>
                 </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </Card>
      <style>{`.collapsible-chevron { transition: transform 0.2s; } [data-state='open'] > .collapsible-chevron { transform: rotate(-90deg); } .radix-collapsible-content { overflow: hidden; transition: height 300ms ease-out; } .radix-collapsible-content[data-state='open'] { animation: slideDown 300ms ease-out; } .radix-collapsible-content[data-state='closed'] { animation: slideUp 300ms ease-out; } @keyframes slideDown { from { height: 0; } to { height: var(--radix-collapsible-content-height); } } @keyframes slideUp { from { height: var(--radix-collapsible-content-height); } to { height: 0; } }`}</style>
    </div>
  );
}