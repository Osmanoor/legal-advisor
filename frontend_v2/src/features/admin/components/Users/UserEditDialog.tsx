// src/features/admin/components/Users/UserEditDialog.tsx

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers, UserUpdatePayload } from '@/hooks/api/useAdminUsers';
import { useAdminRolesAndPermissions } from '@/hooks/api/useAdminRolesAndPermissions';
import { User } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // <-- FIX: Import 'cn' utility
import { ConfirmationDialog } from './ConfirmationDialog'; // <-- FIX: Import Radix-based dialog

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({ user, isOpen, onClose }) => {
  const { direction } = useLanguage();
  const { updateUserMutation, deleteUserMutation } = useAdminUsers();
  const { showToast } = useToast();
  
  const { data: rolesAndPerms, isLoading: isLoadingRoles, error: rolesError } = useAdminRolesAndPermissions();

  const [fullName, setFullName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [permissionOverrides, setPermissionOverrides] = useState<Record<string, 'ALLOW' | 'DENY' | null>>({});

  useEffect(() => {
    if (user && rolesAndPerms) {
      setFullName(user.fullName);
      
      const currentUserRoleName = user.roles[0];
      const userRoleObject = rolesAndPerms.roles.find(r => r.name === currentUserRoleName);
      setSelectedRoleId(userRoleObject ? userRoleObject.id.toString() : '');
      
      // This logic will be fully enabled when the backend provides granular overrides.
      const initialOverrides: Record<string, 'ALLOW' | 'DENY' | null> = {};
      rolesAndPerms.permissions.forEach(p => {
          initialOverrides[p.id.toString()] = null;
      });
      setPermissionOverrides(initialOverrides);

    }
  }, [user, rolesAndPerms]);

  if (!user) return null;
  
  const handlePermissionChange = (permissionId: string) => {
      setPermissionOverrides(prev => {
          const current = prev[permissionId];
          let next: 'ALLOW' | 'DENY' | null = null;
          if (current === null) next = 'ALLOW';
          else if (current === 'ALLOW') next = 'DENY';
          else next = null;
          return { ...prev, [permissionId]: next };
      });
  };

  const handleSave = async () => {
    const payload: UserUpdatePayload = { permission_overrides: [] };
    if (fullName !== user.fullName) payload.fullName = fullName;
    
    const originalRoleId = rolesAndPerms?.roles.find(r => user.roles.includes(r.name))?.id.toString();
    if (selectedRoleId && selectedRoleId !== originalRoleId) payload.role_ids = [Number(selectedRoleId)];
    
    for (const [id, type] of Object.entries(permissionOverrides)) {
        if (type !== null) {
            payload.permission_overrides?.push({ permission_id: Number(id), override_type: type });
        }
    }
    
    if (Object.keys(payload).length === 1 && payload.permission_overrides?.length === 0) {
      showToast("No changes to save.", "info");
      onClose();
      return;
    }

    try {
      await updateUserMutation.mutateAsync({ userId: user.id, payload });
      showToast('User updated successfully', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to update user', 'error');
    }
  };

  const handleDelete = async () => {
      try {
          await deleteUserMutation.mutateAsync(user.id);
          showToast('User deleted successfully', 'success');
          onClose();
      } catch (error) {
          showToast('Failed to delete user', 'error');
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" dir={direction}>
        <DialogHeader className="text-right mb-4">
          <DialogTitle className="text-xl font-bold">Edit User: {user.fullName}</DialogTitle>
          <DialogDescription>Update user details, role, and permissions.</DialogDescription>
        </DialogHeader>

        {isLoadingRoles ? (
            <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
        ) : rolesError ? (
            <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Could not load roles. {rolesError.message}</AlertDescription></Alert>
        ) : (
            <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="space-y-4">
                    <div className="space-y-2 text-right"><Label htmlFor="edit-fullName">Full Name</Label><Input id="edit-fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                    <div className="space-y-2 text-right"><Label>Role</Label><Select dir="rtl" value={selectedRoleId} onValueChange={setSelectedRoleId}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{rolesAndPerms?.roles.map(role => (<SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>))}</SelectContent></Select></div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <Label className="font-semibold">Permission Overrides</Label>
                    <p className="text-xs text-gray-500 text-right">Click to cycle: No Override (default) ‚Üí Allow (green) ‚Üí Deny (red)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rolesAndPerms?.permissions.map(perm => {
                            const overrideState = permissionOverrides[perm.id.toString()];
                            return (
                                <div key={perm.id} className="flex items-center gap-3 p-2 border rounded-md">
                                    <Checkbox 
                                        id={`perm-${perm.id}`}
                                        checked={overrideState === 'ALLOW' || overrideState === 'DENY'}
                                        onCheckedChange={() => handlePermissionChange(perm.id.toString())}
                                        className={cn(
                                            overrideState === 'ALLOW' && 'data-[state=checked]:bg-green-600',
                                            overrideState === 'DENY' && 'data-[state=checked]:bg-red-600',
                                        )}
                                    />
                                    <Label htmlFor={`perm-${perm.id}`} className="flex-1 text-sm text-right cursor-pointer">
                                        {perm.description || perm.name}
                                    </Label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )}

        <DialogFooter className="mt-6 flex justify-between">
          <div>
            <ConfirmationDialog
              trigger={
                <Button variant="danger" disabled={deleteUserMutation.isPending}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete User
                </Button>
              }
              title="Delete User"
              description={`This action cannot be undone. This will permanently delete the user account for ${user.fullName}.`}
              onConfirm={handleDelete}
              confirmText="Yes, delete user"
              isConfirming={deleteUserMutation.isPending}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateUserMutation.isPending || isLoadingRoles}>
              {updateUserMutation.isPending ? <LoadingSpinner size="sm"/> : 'Save Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};