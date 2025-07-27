// File: src/features/admin/components/Users/UserEditDialog.tsx

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers, useAdminUser } from '@/hooks/api/useAdminUsers';
import { useAdminRolesAndPermissions } from '@/hooks/api/useAdminRolesAndPermissions';
import { UserUpdatePayload } from '@/types/user';
import { Dialog, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Trash2, X } from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { PermissionToggle, OverrideState } from './PermissionToggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import UserAvatar from '/public/images/avatars/avatar1.png';

interface UserEditDialogProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const FormSeparatorWithLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 py-4">
        <Separator className="flex-1" />
        <span className="text-sm text-gray-500 whitespace-nowrap">{label}</span>
        <Separator className="flex-1" />
    </div>
);


export const UserEditDialog: React.FC<UserEditDialogProps> = ({ userId, isOpen, onClose }) => {
  const { direction } = useLanguage();
  const { updateUserMutation, deleteUserMutation } = useAdminUsers();
  const { data: user, isLoading: isLoadingUser, error: userError } = useAdminUser(userId);
  const { data: rolesAndPerms, isLoading: isLoadingRoles } = useAdminRolesAndPermissions();
  const { showToast } = useToast();

  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [overrides, setOverrides] = useState<Record<number, OverrideState>>({});
  
  useEffect(() => {
    if (user) {
      setStatus(user.status);
      setRoleId(user.roles[0]?.id);
      const initialOverrides: Record<number, OverrideState> = {};
      user.permission_overrides.forEach(ov => {
        initialOverrides[ov.permission_id] = ov.override_type;
      });
      setOverrides(initialOverrides);
    }
  }, [user]);

  const handleOverrideChange = (permissionId: number, newState: OverrideState) => {
    setOverrides(prev => ({ ...prev, [permissionId]: newState }));
  };

  const handleSave = () => {
    if (!user) return;
    
    const payload: UserUpdatePayload = {};
    
    if (status !== user.status) {
      payload.status = status;
    }
    
    if (roleId !== user.roles[0]?.id) {
        payload.role_ids = roleId ? [roleId] : [];
    }
    
    payload.permission_overrides = Object.entries(overrides)
      .filter(([, state]) => state !== null)
      .map(([permId, state]) => ({
        permission_id: Number(permId),
        override_type: state as 'ALLOW' | 'DENY',
      }));

    if (Object.keys(payload).length === 0 && JSON.stringify(payload.permission_overrides) === JSON.stringify(user.permission_overrides)) {
      showToast("No changes to save.", "info");
      onClose();
      return;
    }

    updateUserMutation.mutate({ userId: user.id, payload }, {
      onSuccess: () => {
        showToast('User updated successfully', 'success');
        onClose();
      },
      onError: (e) => {
        showToast(`Failed to update user: ${(e as Error).message}`, 'error');
      }
    });
  };

  const handleDelete = () => {
    if (!user) return;
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        showToast('User deleted successfully', 'success');
        onClose();
      },
      onError: (e) => {
        showToast(`Failed to delete user: ${(e as Error).message}`, 'error');
      }
    });
  };

  const isUserAdmin = user?.roles.some(r => r.name === 'Admin');
  const isLoading = isLoadingUser || isLoadingRoles;
  const error = userError;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-3xl p-0 flex flex-col max-h-[90vh]" dir={direction}>
        {isLoading ? (
            <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>
        ) : error ? (
            <div className="p-6">
                <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Could not load user data. {error.message}</AlertDescription></Alert>
            </div>
        ) : (
          user && rolesAndPerms && (
            <>
                <div className="flex justify-between items-start p-6 border-b">
                    <div className="flex items-center gap-4 text-right">
                        <img src={UserAvatar} alt={user.fullName} className="w-14 h-14 rounded-full"/>
                        <div>
                            <p className="font-bold text-lg">{user.fullName}</p>
                            <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                        </div>
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200">
                           <X className="h-4 w-4" />
                        </Button>
                    </DialogClose>
                </div>

                <div className="px-6 py-4 space-y-6 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 text-right">
                            <Label htmlFor="status">حالة الحساب</Label>
                            <Select value={status} dir={direction} onValueChange={(value) => setStatus(value as 'active' | 'suspended')}>
                                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2 text-right">
                            <Label htmlFor="role">الدور</Label>
                            <Select value={roleId?.toString()} dir={direction}  onValueChange={(value) => setRoleId(Number(value))}>
                                <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {rolesAndPerms.roles.map(role => (
                                        <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-right pt-6">الصلاحيات</h2>

                    <div>
                        <FormSeparatorWithLabel label="صلاحيات المستخدم" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                            {rolesAndPerms.all_permissions.user.map(p => (
                                <PermissionToggle key={p.id} permission={p} state={overrides[p.id] || null} onChange={(s) => handleOverrideChange(p.id, s)} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <FormSeparatorWithLabel label="صلاحيات المشرف" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                            {rolesAndPerms.all_permissions.admin.map(p => (
                                <PermissionToggle key={p.id} permission={p} state={overrides[p.id] || null} onChange={(s) => handleOverrideChange(p.id, s)} isDisabled={!isUserAdmin} />
                            ))}
                        </div>
                        {!isUserAdmin && <p className="text-xs text-gray-500 text-right mt-2">Admin permissions can only be assigned to users with the 'Admin' role.</p>}
                    </div>
                </div>

                <DialogFooter className="p-6 gap-4 bg-gray-50 border-t flex justify-between shrink-0">
                    <ConfirmationDialog
                        trigger={ <Button variant="danger" disabled={deleteUserMutation.isPending}><Trash2 className="mr-2 h-4 w-4" /> Delete User</Button> }
                        title="Delete User" description={`This will permanently delete the account for ${user.fullName}.`}
                        onConfirm={handleDelete} isConfirming={deleteUserMutation.isPending}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={updateUserMutation.isPending}>
                        {updateUserMutation.isPending ? <LoadingSpinner size="sm"/> : 'Save Changes'}
                        </Button>
                    </div>
                </DialogFooter>
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};