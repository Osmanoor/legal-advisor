// File: src/features/admin/components/Users/UserEditDialog.tsx
// @new

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers } from '@/hooks/api/useAdminUsers';
import { User, Role } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

// Assuming these are the possible statuses you want to manage
type AccountStatus = 'active' | 'suspended';

export const UserEditDialog: React.FC<UserEditDialogProps> = ({ user, isOpen, onClose }) => {
  const { t, direction } = useLanguage();
  const { updateUserMutation } = useAdminUsers();
  const { showToast } = useToast();

  const [role, setRole] = useState<Role>('user');
  const [status, setStatus] = useState<AccountStatus>('active');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      setRole(user.role);
      // This is a placeholder for status, as it's not in the User type yet.
      // We'll add it to the User type if needed, or manage it separately.
      setStatus('active'); 
      
      // Initialize permissions based on the user's current permissions
      const initialPerms: Record<string, boolean> = {
        'manage-other-users': user.permissions.includes('manage:users'),
        'access-general-settings': user.permissions.includes('read:analytics'), // Example mapping
        // ... add other permissions here
      };
      setPermissions(initialPerms);
    }
  }, [user]);

  if (!user) return null;

  const handlePermissionChange = (permKey: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [permKey]: checked }));
  };

  const handleSave = async () => {
    // In a real app, you would map the checkbox state back to your permission strings
    const updatedPermissions = Object.entries(permissions)
        .filter(([, value]) => value)
        .map(([key]) => key.replace(/-/g, ':')); // A simple example

    try {
        await updateUserMutation.mutateAsync({
            id: user.id,
            role: role,
            // permissions: updatedPermissions,
            // Add status if it becomes part of the user model
        });
        showToast('User updated successfully', 'success');
        onClose();
    } catch (error) {
        showToast('Failed to update user', 'error');
    }
  };

  // Define permissions checkboxes for clarity
  const supervisorPermissions = [
      { id: 'manage-other-users', label: 'إدارة الصلاحيات والأدوار للمستخدمين الآخرين' },
      { id: 'access-general-settings', label: 'الوصول إلى إعدادات النظام العامة وتعديلها' }
  ];
  const userPermissions = [
      { id: 'use-ai-assistant', label: 'استخدام المساعد الذكي' },
      { id: 'view-activity-log', label: 'الاطلاع على سجل النشاط' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" dir={direction}>
        <DialogHeader className="text-right mb-6">
          <DialogTitle className="text-xl font-bold">{user.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2 text-right">
                <Label>{t('admin.users.accountStatus') || 'حالة الحساب'}</Label>
                <Select dir="rtl" value={status} onValueChange={(v) => setStatus(v as AccountStatus)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2 text-right">
                <Label>{t('admin.users.role') || 'الدور'}</Label>
                <Select dir="rtl" value={role} onValueChange={(v) => setRole(v as Role)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Permissions Section */}
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold mb-3 text-right">صلاحيات المشرف</h4>
                <div className="space-y-3">
                    {supervisorPermissions.map(perm => (
                        <div key={perm.id} className="flex items-center justify-end gap-3 p-3 bg-gray-50 rounded-md">
                            <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">{perm.label}</Label>
                            <Checkbox id={perm.id} checked={permissions[perm.id] || false} onCheckedChange={(c) => handlePermissionChange(perm.id, !!c)} />
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="font-semibold mb-3 text-right">صلاحيات المستخدم</h4>
                <div className="space-y-3">
                    {userPermissions.map(perm => (
                        <div key={perm.id} className="flex items-center justify-end gap-3 p-3 bg-gray-50 rounded-md">
                            <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">{perm.label}</Label>
                            <Checkbox id={perm.id} checked={permissions[perm.id] || false} onCheckedChange={(c) => handlePermissionChange(perm.id, !!c)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <DialogFooter className="mt-8">
          <Button onClick={handleSave} disabled={updateUserMutation.isPending} className="bg-cta hover:bg-cta-hover">
            {updateUserMutation.isPending ? <LoadingSpinner size="sm"/> : t('common.save')}
          </Button>
          <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};