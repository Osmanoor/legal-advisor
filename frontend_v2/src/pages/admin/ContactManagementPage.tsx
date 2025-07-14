// src/pages/admin/ContactManagementPage.tsx

import React, { useState, useMemo } from 'react';
import { useAdminContacts } from '@/hooks/api/useAdminContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContactsTable } from '@/features/admin/components/ContactsTable';
import { Search, Filter, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function ContactManagementPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { contactsQuery, updateContactStatusMutation } = useAdminContacts();

  const filteredContacts = useMemo(() => {
    if (!contactsQuery.data) return [];
    if (!searchTerm) return contactsQuery.data;

    return contactsQuery.data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contactsQuery.data, searchTerm]);

  const handleUpdateStatus = async (id: number, status: 'new' | 'read' | 'archived') => {
    try {
      await updateContactStatusMutation.mutateAsync({ id, status });
      showToast('Contact status updated.', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      showToast(`Failed to update status: ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">رسائل التواصل ({contactsQuery.data?.length || 0})</h1>
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
      
      {contactsQuery.isLoading ? (
        <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
      ) : contactsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{contactsQuery.error.message}</AlertDescription>
        </Alert>
      ) : (
        <ContactsTable 
          contacts={filteredContacts} 
          onUpdateStatus={handleUpdateStatus}
          isUpdatingId={updateContactStatusMutation.isPending ? updateContactStatusMutation.variables.id : null}
        />
      )}
    </div>
  );
}