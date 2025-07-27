// File: src/features/admin/components/Users/UserAddDialog.tsx

import React, { useState, useEffect } from 'react';
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
  const { showToast } = useToast();
  const { createUserMutation } = useAdminUsers();
  const { data: rolesAndPerms, isLoading: isLoadingRoles, error: rolesError } = useAdminRolesAndPermissions();

  const [formData, setFormData] = useState<UserCreatePayload>(initialFormState);

  // Reset form when dialog is opened/closed
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

    // Basic Validation
    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.password || !formData.role_id) {
        showToast("Please fill in all required fields.", 'error');
        return;
    }
    if (formData.password.length < 8) {
        showToast("Password must be at least 8 characters long.", "error");
        return;
    }

    // Sanitize payload: only include optional fields if they have a value
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
            showToast("User created successfully!", "success");
            onClose();
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error?: string }>;
            const errorMessage = axiosError.response?.data?.error || 'Failed to create user.';
            showToast(errorMessage, 'error');
        }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between">
            <div className="text-right">
                <DialogTitle className="text-xl">إضافة مستخدم جديد</DialogTitle>
                <DialogDescription>
                    أدخل تفاصيل المستخدم الجديد لإنشاء حساب له.
                </DialogDescription>
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
                    <AlertDescription>Could not load roles. Please try again.</AlertDescription>
                </Alert>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 px-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2 text-right">
                        <Label htmlFor="fullName">الاسم الكامل <span className="text-red-500">*</span></Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 text-right">
                            <Label htmlFor="phoneNumber">رقم الهاتف <span className="text-red-500">*</span></Label>
                            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required/>
                        </div>
                        <div className="space-y-2 text-right">
                            <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                            <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <Label htmlFor="password">كلمة المرور <span className="text-red-500">*</span></Label>
                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <div className="space-y-2 text-right">
                        <Label htmlFor="role_id">الدور <span className="text-red-500">*</span></Label>
                        <Select value={formData.role_id ? formData.role_id.toString() : ''} onValueChange={handleRoleChange}>
                            <SelectTrigger id="role_id"><SelectValue placeholder="اختر دورًا" /></SelectTrigger>
                            <SelectContent>
                                {rolesAndPerms?.roles.map(role => (
                                    <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2 text-right">
                        <Label htmlFor="jobTitle">المسمى الوظيفي (اختياري)</Label>
                        <Input id="jobTitle" name="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} />
                    </div>
                </div>

                <DialogFooter className="p-6 bg-gray-50 border-t mt-4 gap-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button type="submit" disabled={createUserMutation.isPending}>
                        {createUserMutation.isPending ? <LoadingSpinner size="sm" /> : 'إنشاء مستخدم'}
                    </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
};