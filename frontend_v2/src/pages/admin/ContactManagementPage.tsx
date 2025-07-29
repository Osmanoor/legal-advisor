// src/pages/admin/ContactManagementPage.tsx
// Updated for i18n

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminContacts, ContactSubmission, ContactStatusFilter } from '@/hooks/api/useAdminContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContactsTable } from '@/features/admin/components/ContactsTable';
import { ContactDetailDialog } from '@/features/admin/components/ContactDetailDialog';
import { Search, ArrowDownUp, AlertCircle, Filter } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { PaginationControls } from '@/components/common/PaginationControls';

type SortKey = 'name' | 'submitted_at';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export default function ContactManagementPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [contactFilter, setContactFilter] = useState<ContactStatusFilter>('new');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'submitted_at', direction: 'desc' });
  
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { contactsQuery, updateContactStatusMutation } = useAdminContacts(currentPage, ITEMS_PER_PAGE, contactFilter);

  const sortedAndFilteredContacts = useMemo(() => {
    if (!contactsQuery.data?.submissions) return [];
    let contacts = [...contactsQuery.data.submissions];
    if (searchTerm.trim()) {
      contacts = contacts.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    contacts.sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      let comparison = aValue.localeCompare(bValue, 'ar');
      return sort.direction === 'desc' ? -comparison : comparison;
    });
    return contacts;
  }, [contactsQuery.data, searchTerm, sort]);

  const handleFilterChange = (val: string) => {
    setCurrentPage(1);
    setContactFilter(val as ContactStatusFilter);
  }

  const handleUpdateStatus = (id: number, status: 'new' | 'read' | 'archived') => {
    updateContactStatusMutation.mutate({ id, status }, {
      onSuccess: () => {
        if (status !== 'read') {
            showToast(t('common.success'), 'success');
        }
      },
      onError: (error) => {
        showToast(`${t('common.error')}: ${error.message}`, 'error');
      }
    });
  };

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedContact(submission);
    setIsDialogOpen(true);
  };

  const filterLabels = {
    new: t('admin.contact.statuses.new'),
    read: t('admin.contact.statuses.read'),
    archived: t('admin.contact.statuses.archived'),
    all: t('admin.contact.statuses.all')
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{t('admin.contact.title')} ({contactsQuery.data?.total || 0})</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Input 
              placeholder={t('admin.contact.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Popover>
            <PopoverTrigger asChild><Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button></PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-4 text-right p-2">
                <div className="space-y-2"><Label>{t('admin.contact.filterByStatus')}</Label>
                  <RadioGroup value={contactFilter} onValueChange={handleFilterChange}>
                    {(Object.keys(filterLabels) as (keyof typeof filterLabels)[]).map(key => (
                       <div key={key} className="flex items-center justify-end gap-2"><Label htmlFor={`filter-${key}`}>{filterLabels[key]}</Label><RadioGroupItem value={key} id={`filter-${key}`}/></div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild><Button variant="outline" size="icon"><ArrowDownUp className="w-4 h-4" /></Button></PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-4 text-right p-2">
                <div className="space-y-2"><Label>{t('admin.contact.sortBy')}</Label>
                  <RadioGroup value={sort.key} onValueChange={(v) => setSort(s => ({...s, key: v as SortKey}))}>
                    <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-date">{t('admin.contact.date')}</Label><RadioGroupItem value="submitted_at" id="sort-date"/></div>
                    <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-name">{t('admin.contact.name')}</Label><RadioGroupItem value="name" id="sort-name"/></div>
                  </RadioGroup>
                </div>
                <div className="space-y-2"><Label>{t('admin.contact.direction')}</Label>
                  <RadioGroup value={sort.direction} onValueChange={(v) => setSort(s => ({...s, direction: v as SortDirection}))}>
                    <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-desc">{t('admin.contact.desc')}</Label><RadioGroupItem value="desc" id="sort-desc"/></div>
                    <div className="flex items-center justify-end gap-2"><Label htmlFor="sort-asc">{t('admin.contact.asc')}</Label><RadioGroupItem value="asc" id="sort-asc"/></div>
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
            contacts={sortedAndFilteredContacts} 
            onViewDetails={handleViewDetails}
          />
          {sortedAndFilteredContacts.length > 0 && (
            <div className="mt-8">
              <PaginationControls
                currentPage={contactsQuery.data?.current_page || 1}
                totalPages={contactsQuery.data?.pages || 1}
                onPageChange={setCurrentPage}
                totalItems={contactsQuery.data?.total || 0}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
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