// File: src/pages/admin/UserManagementPage.tsx
// @updated
// Fetches and displays users, and manages the state for the edit dialog.

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers } from '@/hooks/api/useAdminUsers';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserEditDialog } from '@/features/admin/components/Users/UserEditDialog';
import { Search, MoreVertical, Filter, ArrowDownUp } from 'lucide-react';
import UserAvatar from '/public/images/avatars/avatar1.png'; // Placeholder

export default function UserManagementPage() {
  const { t } = useLanguage();
  const { usersQuery } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const filteredUsers = useMemo(() => {
    if (!usersQuery.data) return [];
    return usersQuery.data.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usersQuery.data, searchTerm]);

  const renderStatusBadge = (status: 'active' | 'suspended') => {
      if (status === 'suspended') {
          return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">Suspended</Badge>;
      }
      return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">المستخدمين ({usersQuery.data?.length || 0})</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
                 <Input 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><ArrowDownUp className="w-4 h-4" /></Button>
        </div>
      </div>
      
      {usersQuery.isLoading && (
          <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
      )}

      {usersQuery.error && (
          <Alert variant="destructive"><AlertDescription>{usersQuery.error.message}</AlertDescription></Alert>
      )}

      {usersQuery.data && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-right">الأسم</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">البريد الألكتروني</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead></TableHead> {/* For actions */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={UserAvatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderStatusBadge('active')}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>  
      )}

      <UserEditDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
}