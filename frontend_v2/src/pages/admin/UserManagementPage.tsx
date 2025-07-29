// src/pages/admin/UserManagementPage.tsx
// Updated for i18n

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminUsers } from '@/hooks/api/useAdminUsers';
import { useAdminRolesAndPermissions } from '@/hooks/api/useAdminRolesAndPermissions';
import { UserSummary } from '@/types/user';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaginationControls } from '@/components/common/PaginationControls';
import { UserEditDialog } from '@/features/admin/components/Users/UserEditDialog';
import { UserAddDialog } from '@/features/admin/components/Users/UserAddDialog';

// Icons
import { Search, MoreVertical, Filter, ArrowDownUp, UserPlus, AlertCircle } from 'lucide-react';
import UserAvatar from '/public/images/avatars/avatar1.png';

// Types
type SortKey = 'fullName' | 'created_at';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export default function UserManagementPage() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const { usersQuery } = useAdminUsers(currentPage, ITEMS_PER_PAGE);
  const { data: rolesAndPermsData } = useAdminRolesAndPermissions();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ status: 'all' | 'active' | 'suspended', roleId: string }>({ status: 'all', roleId: 'all' });
  const [sort, setSort] = useState<{ key: SortKey, direction: SortDirection }>({ key: 'created_at', direction: 'desc' });

  const handleEditClick = (user: UserSummary) => {
    setSelectedUserId(user.id);
    setIsEditDialogOpen(true);
  };
  
  const processedUsers = useMemo(() => {
    if (!usersQuery.data?.users) return [];
    let users = [...usersQuery.data.users];
    if (searchTerm.trim()) {
      users = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phoneNumber && user.phoneNumber.includes(searchTerm))
      );
    }
    if (filters.status !== 'all') {
      users = users.filter(user => user.status === filters.status);
    }
    if (filters.roleId !== 'all') {
      users = users.filter(user => user.roles.includes(rolesAndPermsData?.roles.find(r => r.id === parseInt(filters.roleId))?.name || ''));
    }
    users.sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      else if (aValue < bValue) comparison = -1;
      return sort.direction === 'desc' ? -comparison : comparison;
    });
    return users;
  }, [usersQuery.data, searchTerm, filters, sort, rolesAndPermsData]);
  
  const renderStatusBadge = (status: 'active' | 'suspended') => {
      if (status === 'suspended') {
          return <Badge variant="destructive" className="bg-red-100 text-red-700">{t('admin.users.suspended')}</Badge>;
      }
      return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">{t('admin.users.active')}</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{t('admin.users.title')} ({usersQuery.data?.total || 0})</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
                 <Input 
                    placeholder={t('admin.users.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <Popover>
                <PopoverTrigger asChild><Button variant="outline" size="icon" aria-label={t('admin.users.filter')}><Filter className="w-4 h-4" /></Button></PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                    <div className="space-y-4 text-right p-2">
                        <div className="space-y-2"><Label>{t('admin.users.status')}</Label>
                            <RadioGroup value={filters.status} onValueChange={(v) => setFilters(f => ({...f, status: v as any}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="status-all">{t('admin.users.all')}</Label><RadioGroupItem value="all" id="status-all"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="status-active">{t('admin.users.active')}</Label><RadioGroupItem value="active" id="status-active"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="status-suspended">{t('admin.users.suspended')}</Label><RadioGroupItem value="suspended" id="status-suspended"/></div>
                            </RadioGroup>
                        </div>
                         <div className="space-y-2"><Label>{t('admin.users.role')}</Label>
                            <RadioGroup value={filters.roleId} onValueChange={(v) => setFilters(f => ({...f, roleId: v}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="role-all">{t('admin.users.all')}</Label><RadioGroupItem value="all" id="role-all"/></div>
                                {rolesAndPermsData?.roles.map(role => (
                                    <div key={role.id} className="flex items-center justify-end gap-2"><Label htmlFor={`role-${role.id}`}>{role.name}</Label><RadioGroupItem value={role.id.toString()} id={`role-${role.id}`}/></div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild><Button variant="outline" size="icon" aria-label={t('admin.users.sort')}><ArrowDownUp className="w-4 h-4" /></Button></PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                    <div className="space-y-4 text-right p-2">
                        <div className="space-y-2"><Label>{t('admin.users.sort')}</Label>
                            <RadioGroup value={sort.key} onValueChange={(v) => setSort(s => ({...s, key: v as SortKey}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-date">{t('admin.users.dateCreated')}</Label><RadioGroupItem value="created_at" id="sort-date"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-name">{t('admin.users.fullName')}</Label><RadioGroupItem value="fullName" id="sort-name"/></div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2"><Label>{t('admin.users.direction')}</Label>
                           <RadioGroup value={sort.direction} onValueChange={(v) => setSort(s => ({...s, direction: v as SortDirection}))}>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-desc">{t('admin.users.desc')}</Label><RadioGroupItem value="desc" id="sort-desc"/></div>
                                <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-asc">{t('admin.users.asc')}</Label><RadioGroupItem value="asc" id="sort-asc"/></div>
                           </RadioGroup>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

             <Button onClick={() => setIsAddDialogOpen(true)}><UserPlus className="mr-2 h-4 w-4"/> {t('admin.users.addUser')}</Button>
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
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">{t('admin.users.table.name')}</TableHead>
                  <TableHead className="text-right">{t('admin.users.table.status')}</TableHead>
                  <TableHead className="text-right px-6">{t('admin.users.table.emailPhone')}</TableHead>
                  <TableHead className="text-right">{t('admin.users.table.role')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedUsers.length > 0 ? processedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={UserAvatar} alt={user.fullName} className="w-8 h-8 rounded-full" />
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{renderStatusBadge(user.status)}</TableCell>
                    <TableCell className="px-6">{user.phoneNumber || user.email || 'N/A'}</TableCell>
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
                      {t('admin.users.noUsersMatch')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <PaginationControls
            currentPage={usersQuery.data.current_page}
            totalPages={usersQuery.data.pages}
            onPageChange={setCurrentPage}
            totalItems={usersQuery.data.total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
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
      
      <UserAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
}