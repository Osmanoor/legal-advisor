// src/features/admin/components/ContactDetailDialog.tsx
// Updated for i18n

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContactSubmission } from '@/hooks/api/useAdminContacts';
import { Mail, Archive, Clock, RotateCcw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';

interface ContactDetailDialogProps {
  submission: ContactSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: 'new' | 'read' | 'archived') => void;
  isUpdating: boolean;
}

export const ContactDetailDialog: React.FC<ContactDetailDialogProps> = ({
  submission,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating,
}) => {
  const { t } = useLanguage();
  const hasMarkedAsRead = useRef(false);

  useEffect(() => {
    if (isOpen && submission && submission.status === 'new' && !hasMarkedAsRead.current) {
      onUpdateStatus(submission.id, 'read');
      hasMarkedAsRead.current = true;
    }
    if (!isOpen) {
      hasMarkedAsRead.current = false;
    }
  }, [isOpen, submission, onUpdateStatus]);

  if (!submission) return null;
  
  const handleManualUpdate = (status: 'new' | 'read' | 'archived') => {
    onUpdateStatus(submission.id, status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <div className="flex justify-between items-center text-right">
          <h2 className="text-lg font-semibold">{t('admin.contact.dialog.title', { name: submission.name })}</h2>
          <DialogClose />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 py-2">
            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">{submission.email}</a>
            <span>{t('admin.contact.dialog.receivedAt', { date: new Date(submission.submitted_at).toLocaleString() })}</span>
        </div>

        <Separator className="my-2"/>

        <div className="py-4 space-y-4">
          <div className="p-2 max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap text-right">{submission.message}</p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-4">
            <div className="flex gap-2">
                <a href={`mailto:${submission.email}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-cta text-white shadow hover:bg-cta-hover h-9 px-4 py-2">
                    <Mail className="mr-2 h-4 w-4" /> {t('admin.contact.dialog.replyViaEmail')}
                </a>
            </div>
            <div className="flex gap-2 justify-end">
                {submission.status === 'read' && (
                    <Button onClick={() => handleManualUpdate('new')} disabled={isUpdating}>
                        {isUpdating ? <LoadingSpinner size="sm" /> : <RotateCcw className="ml-2 h-4 w-4"/>}
                        {t('admin.contact.dialog.markAsNew')}
                    </Button>
                )}
                
                {submission.status !== 'archived' && (
                     <Button variant="secondary" onClick={() => handleManualUpdate('archived')} disabled={isUpdating}>
                        {isUpdating ? <LoadingSpinner size="sm" /> : <Archive className="ml-2 h-4 w-4"/>}
                        {t('admin.contact.dialog.archive')}
                    </Button>
                )}
                 {submission.status === 'archived' && (
                     <Button variant="ghost" onClick={() => handleManualUpdate('read')} disabled={isUpdating}>
                        <RotateCcw className="ml-2 h-4 w-4"/> {t('admin.contact.dialog.moveToNew')}
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};