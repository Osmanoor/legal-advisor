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
  onUpdateStatus: (id: number, status: 'new' | 'read' | 'archived') => void;
  isUpdatingId: number | null; // To show loading on a specific row
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, onUpdateStatus, isUpdatingId }) => {
  
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
            <TableHead className="text-right">الرسالة</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">تاريخ الإرسال</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className={cn(isUpdatingId === contact.id && "opacity-50")}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
              <TableCell>{getStatusBadge(contact.status)}</TableCell>
              <TableCell>{new Date(contact.submitted_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isUpdatingId === contact.id}>
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                        <div className="flex flex-col space-y-1">
                            <Button variant="ghost" className="w-full justify-start" onClick={() => onUpdateStatus(contact.id, 'read')}>
                                <Check className="mr-2 h-4 w-4"/> Mark as Read
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => onUpdateStatus(contact.id, 'archived')}>
                                <Archive className="mr-2 h-4 w-4"/> Archive
                            </Button>
                             <a href={`mailto:${contact.email}`} className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 hover:text-gray-900 h-9 px-4 py-2 w-full justify-start">
                                <Mail className="mr-2 h-4 w-4"/> Reply
                            </a>
                        </div>
                    </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};