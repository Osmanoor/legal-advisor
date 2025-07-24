// src/pages/admin/ContactManagementPage.tsx

import React, { useState, useMemo } from 'react';
import { useAdminContacts, ContactSubmission  } from '@/hooks/api/useAdminContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContactsTable } from '@/features/admin/components/ContactsTable';
import { ContactDetailDialog } from '@/features/admin/components/ContactDetailDialog';
import { Search, Filter, ArrowDownUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { PaginationControls } from '@/components/common/PaginationControls';

const ITEMS_PER_PAGE = 10;

export default function ContactManagementPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // The hook now receives the currentPage
  const { contactsQuery, updateContactStatusMutation } = useAdminContacts(currentPage, ITEMS_PER_PAGE);

  // Filtering is now done on the backend for larger datasets.
  // This frontend filter is good for immediate feedback while typing.
  const filteredContacts = useMemo(() => {
    if (!contactsQuery.data?.submissions) return [];
    if (!searchTerm) return contactsQuery.data.submissions;

    return contactsQuery.data.submissions.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contactsQuery.data, searchTerm]);

  const handleUpdateStatus = (id: number, status: 'new' | 'read' | 'archived') => {
    updateContactStatusMutation.mutate({ id, status }, {
        onSuccess: () => {
            showToast('Contact status updated.', 'success');
            setIsDialogOpen(false);
        },
        onError: (error) => {
            showToast(`Failed to update status: ${error.message}`, 'error');
        }
    });
  };

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedContact(submission);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">رسائل التواصل ({contactsQuery.data?.total || 0})</h1>
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
        <>
            <ContactsTable 
                contacts={filteredContacts} 
                onViewDetails={handleViewDetails}
            />
            <PaginationControls
                currentPage={contactsQuery.data?.current_page || 1}
                totalPages={contactsQuery.data?.pages || 1}
                onPageChange={setCurrentPage}
                totalItems={contactsQuery.data?.total || 0}
                itemsPerPage={ITEMS_PER_PAGE}
            />
        </>
      )}
      <ContactDetailDialog
        submission={selectedContact}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updateContactStatusMutation.isPending}
      />
    </div>
  );
}