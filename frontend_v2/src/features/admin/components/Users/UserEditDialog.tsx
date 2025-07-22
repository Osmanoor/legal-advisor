// src/features/admin/components/Users/UserEditDialog.tsx

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers, useAdminUser } from '@/hooks/api/useAdminUsers';
import { useAdminRolesAndPermissions } from '@/hooks/api/useAdminRolesAndPermissions';
import { AdminDetailedUser, UserUpdatePayload } from '@/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { PermissionToggle, OverrideState } from './PermissionToggle';

interface UserEditDialogProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({ userId, isOpen, onClose }) => {
  const { direction } = useLanguage();
  const { updateUserMutation, deleteUserMutation } = useAdminUsers();
  const { data: user, isLoading: isLoadingUser, error: userError } = useAdminUser(userId);
  const { data: rolesAndPerms, isLoading: isLoadingRoles, error: rolesError } = useAdminRolesAndPermissions();
  const { showToast } = useToast();

  // Local state for form fields
  const [fullName, setFullName] = useState('');
  const [overrides, setOverrides] = useState<Record<number, OverrideState>>({});
  
  // Populate state when user data is fetched
  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
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
    if (fullName !== user.fullName) {
      payload.fullName = fullName;
    }
    
    const changedOverrides = Object.entries(overrides).filter(([permId, state]) => {
      const originalOverride = user.permission_overrides.find(ov => ov.permission_id === Number(permId));
      const originalState = originalOverride ? originalOverride.override_type : null;
      return state !== originalState;
    });

    // We need to send ALL overrides, not just changed ones, as the backend clears them first.
    payload.permission_overrides = Object.entries(overrides)
      .filter(([, state]) => state !== null)
      .map(([permId, state]) => ({
        permission_id: Number(permId),
        override_type: state as 'ALLOW' | 'DENY',
      }));

    if (fullName === user.fullName && changedOverrides.length === 0) {
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
  const error = userError || rolesError;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl" dir={direction}>
        <DialogHeader className="text-right mb-4">
          <DialogTitle className="text-xl font-bold">Edit User: {user?.fullName || 'Loading...'}</DialogTitle>
          <DialogDescription>Update user details and fine-tune their permissions.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
        ) : error ? (
          <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Could not load data. {error.message}</AlertDescription></Alert>
        ) : (
          user && rolesAndPerms && (
            <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2 text-right"><Label htmlFor="edit-fullName">Full Name</Label><Input id="edit-fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
              
              <div>
                <h3 className="font-semibold text-right mb-2">User Feature Permissions</h3>
                <div className="space-y-2">
                  {rolesAndPerms.all_permissions.user.map(p => (
                    <PermissionToggle key={p.id} permission={p} state={overrides[p.id] || null} onChange={(s) => handleOverrideChange(p.id, s)} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-right mb-2">Admin Panel Permissions</h3>
                <div className="space-y-2">
                  {rolesAndPerms.all_permissions.admin.map(p => (
                    <PermissionToggle key={p.id} permission={p} state={overrides[p.id] || null} onChange={(s) => handleOverrideChange(p.id, s)} isDisabled={!isUserAdmin} />
                  ))}
                  {!isUserAdmin && <p className="text-xs text-gray-500 text-right mt-2">Admin permissions can only be assigned to users with the 'Admin' role.</p>}
                </div>
              </div>
            </div>
          )
        )}

        <DialogFooter className="mt-6 flex justify-between">
          <div>
            {user && (
              <ConfirmationDialog
                trigger={ <Button variant="danger" disabled={deleteUserMutation.isPending}><Trash2 className="mr-2 h-4 w-4" /> Delete User</Button> }
                title="Delete User" description={`This will permanently delete the account for ${user.fullName}.`}
                onConfirm={handleDelete} isConfirming={deleteUserMutation.isPending}
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading || updateUserMutation.isPending}>
              {updateUserMutation.isPending ? <LoadingSpinner size="sm"/> : 'Save Changes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};