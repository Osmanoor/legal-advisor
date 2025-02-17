// src/features/admin/components/ContactsTable.tsx
import { Contact } from '@/types/admin';
import { useLanguage } from '@/hooks/useLanguage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.contacts.date')}</TableHead>
            <TableHead>{t('admin.contacts.name')}</TableHead>
            <TableHead>{t('admin.contacts.email')}</TableHead>
            <TableHead>{t('admin.contacts.message')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact, index) => (
            <TableRow key={index}>
              <TableCell>{contact.Date}</TableCell>
              <TableCell>{contact.Name}</TableCell>
              <TableCell>{contact.Email}</TableCell>
              <TableCell>{contact.Message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}