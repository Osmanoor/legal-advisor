// src/features/admin/components/Users/UserAddDialog.tsx
// Updated for i18n

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers } from '@/hooks/api/useAdminUsers';
import { useAdminRolesAndPermissions } from '@/hooks/api/useAdminRolesAndPermissions';
import { useToast } from '@/hooks/useToast';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { UserCreatePayload } from '@/types/user';
import { AxiosError } from 'axios';

interface UserAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormState: UserCreatePayload = {
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  jobTitle: '',
  role_id: 0,
};

export const UserAddDialog: React.FC<UserAddDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { createUserMutation } = useAdminUsers();
  const { data: rolesAndPerms, isLoading: isLoadingRoles, error: rolesError } = useAdminRolesAndPermissions();

  const [formData, setFormData] = useState<UserCreatePayload>(initialFormState);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleRoleChange = (roleId: string) => {
    setFormData(prev => ({ ...prev, role_id: Number(roleId) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.password || !formData.role_id) {
        showToast(t('auth.errorGeneric'), 'error');
        return;
    }
    if (formData.password.length < 8) {
        showToast(t('auth.errorPasswordLength', { length: '8' }), "error");
        return;
    }

    const payload: UserCreatePayload = {
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password,
      role_id: formData.role_id,
      ...(formData.email?.trim() && { email: formData.email.trim() }),
      ...(formData.jobTitle?.trim() && { jobTitle: formData.jobTitle.trim() }),
    };

    createUserMutation.mutate(payload, {
        onSuccess: () => {
            showToast(t('common.success'), "success");
            onClose();
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || t('common.error');
            showToast(errorMessage, 'error');
        }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between">
            <div className="text-right">
                <DialogTitle className="text-xl">{t('admin.users.addDialog.title')}</DialogTitle>
                <DialogDescription>{t('admin.users.addDialog.description')}</DialogDescription>
            </div>
            <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 shrink-0">
                    <X className="h-4 w-4" />
                </Button>
            </DialogClose>
        </DialogHeader>

        {isLoadingRoles ? (
             <div className="flex justify-center p-8"><LoadingSpinner /></div>
        ) : rolesError ? (
            <div className="p-6 pt-0">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{t('common.error')}</AlertDescription>
                </Alert>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 px-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2 text-right">
                        <Label htmlFor="fullName">{t('admin.users.addDialog.fullName')} <span className="text-red-500">*</span></Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 text-right">
                            <Label htmlFor="phoneNumber">{t('admin.users.addDialog.phoneNumber')} <span className="text-red-500">*</span></Label>
                            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required/>
                        </div>
                        <div className="space-y-2 text-right">
                            <Label htmlFor="email">{t('admin.users.addDialog.emailOptional')}</Label>
                            <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <Label htmlFor="password">{t('admin.users.addDialog.password')} <span className="text-red-500">*</span></Label>
                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <div className="space-y-2 text-right">
                        <Label htmlFor="role_id">{t('admin.users.addDialog.role')} <span className="text-red-500">*</span></Label>
                        <Select value={formData.role_id ? formData.role_id.toString() : ''} onValueChange={handleRoleChange}>
                            <SelectTrigger id="role_id"><SelectValue placeholder={t('admin.users.addDialog.selectRole')} /></SelectTrigger>
                            <SelectContent>
                                {rolesAndPerms?.roles.map(role => (
                                    <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2 text-right">
                        <Label htmlFor="jobTitle">{t('admin.users.addDialog.jobTitleOptional')}</Label>
                        <Input id="jobTitle" name="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} />
                    </div>
                </div>

                <DialogFooter className="p-6 bg-gray-50 border-t mt-4 gap-4">
                    <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" disabled={createUserMutation.isPending}>
                        {createUserMutation.isPending ? <LoadingSpinner size="sm" /> : t('admin.users.addDialog.createUser')}
                    </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
};