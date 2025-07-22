// src/pages/admin/UserManagementPage.tsx

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers } from '@/hooks/api/useAdminUsers';
import { UserSummary } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserEditDialog } from '@/features/admin/components/Users/UserEditDialog';
import { Search, MoreVertical, Filter, ArrowDownUp, UserPlus, AlertCircle } from 'lucide-react';
import UserAvatar from '/public/images/avatars/avatar1.png'; // Placeholder

export default function UserManagementPage() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const { usersQuery } = useAdminUsers(currentPage);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (user: UserSummary) => {
    setSelectedUserId(user.id);
    setIsEditDialogOpen(true);
  };
  
  const filteredUsers = useMemo(() => {
    if (!usersQuery.data?.users) return [];
    return usersQuery.data.users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [usersQuery.data, searchTerm]);
  
  const renderStatusBadge = () => {
      return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">المستخدمين ({usersQuery.data?.total || 0})</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
                 <Input 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><ArrowDownUp className="w-4 h-4" /></Button>
             <Button><UserPlus className="mr-2 h-4 w-4"/> إضافة مستخدم</Button>
        </div>
      </div>
      
      {usersQuery.isLoading && (
          <div className="flex justify-center items-center py-20"><LoadingSpinner size="lg" /></div>
      )}

      {usersQuery.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{usersQuery.error.message}</AlertDescription>
          </Alert>
      )}

      {usersQuery.data && (
        <>
          <div className="border rounded-lg overflow-hidden bg-white">
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
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={UserAvatar} alt={user.fullName} className="w-8 h-8 rounded-full" />
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{renderStatusBadge()}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.roles.join(', ')}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination controls can be added here */}
        </>
      )}

      <UserEditDialog
        userId={selectedUserId}
        isOpen={isEditDialogOpen}
        onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedUserId(null);
        }}
      />
    </div>
  );
}