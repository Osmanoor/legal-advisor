// src/features/admin/components/ContactsTable.tsx

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Using Popover for actions
import { MoreHorizontal, Check, Archive, Mail } from 'lucide-react';
import { ContactSubmission } from '@/hooks/api/useAdminContacts';
import { cn } from '@/lib/utils';

interface ContactsTableProps {
  contacts: ContactSubmission[];
  onViewDetails: (submission: ContactSubmission) => void; // Prop to open the dialog
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, onViewDetails }) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">New</Badge>;
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">البريد الإلكتروني</TableHead>
            <TableHead className="text-right">الرسالة (معاينة)</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">تاريخ الإرسال</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
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