// src/features/admin/components/ContactsTable.tsx
// Updated for i18n

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ContactSubmission } from '@/hooks/api/useAdminContacts';

interface ContactsTableProps {
  contacts: ContactSubmission[];
  onViewDetails: (submission: ContactSubmission) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, onViewDetails }) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{t('admin.contact.statuses.new')}</Badge>;
      case 'read':
        return <Badge variant="secondary">{t('admin.contact.statuses.read')}</Badge>;
      case 'archived':
        return <Badge variant="outline">{t('admin.contact.statuses.archived')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-right">{t('admin.contact.table.name')}</TableHead>
            <TableHead className="text-right">{t('admin.contact.table.email')}</TableHead>
            <TableHead className="text-right">{t('admin.contact.table.messagePreview')}</TableHead>
            <TableHead className="text-right">{t('admin.contact.table.status')}</TableHead>
            <TableHead className="text-right">{t('admin.contact.table.submittedAt')}</TableHead>
            <TableHead className="text-center">{t('admin.contact.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
              <TableCell>{getStatusBadge(contact.status)}</TableCell>
              <TableCell>{new Date(contact.submitted_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(contact)}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};