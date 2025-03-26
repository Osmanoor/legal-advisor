// src/features/admin/components/EmailsTable.tsx

import { Email } from '@/types/admin';
import { useLanguage } from '@/hooks/useLanguage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EmailsTableProps {
  emails: Email[];
}

export function EmailsTable({ emails }: EmailsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.emails.date')}</TableHead>
            <TableHead>{t('admin.emails.recipient')}</TableHead>
            <TableHead>{t('admin.emails.subject')}</TableHead>
            <TableHead>{t('admin.emails.body')}</TableHead>
            <TableHead>{t('admin.emails.attachment')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email, index) => (
            <TableRow key={index}>
              <TableCell>{email.Date}</TableCell>
              <TableCell>{email.Recipient}</TableCell>
              <TableCell>{email.Subject}</TableCell>
              <TableCell>{email.Body}</TableCell>
              <TableCell>{email.Attachment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}