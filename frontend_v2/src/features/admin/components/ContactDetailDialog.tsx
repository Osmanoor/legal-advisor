// src/features/admin/components/ContactDetailDialog.tsx

import React, { useEffect, useRef } from 'react';
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
  const hasMarkedAsRead = useRef(false);

  useEffect(() => {
    // If the dialog opens for a 'new' submission and we haven't processed it yet
    if (isOpen && submission && submission.status === 'new' && !hasMarkedAsRead.current) {
      onUpdateStatus(submission.id, 'read');
      hasMarkedAsRead.current = true; // Mark it as processed to prevent re-triggering
    }

    // Reset the guard when the dialog closes
    if (!isOpen) {
      hasMarkedAsRead.current = false;
    }
  }, [isOpen, submission, onUpdateStatus]);

  if (!submission) return null;
  
  const handleManualUpdate = (status: 'new' | 'read' | 'archived') => {
    onUpdateStatus(submission.id, status);
    onClose(); // Explicitly close the dialog after a manual action
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {/* Custom Header */}
        <div className="flex justify-between items-center text-right">
          <h2 className="text-lg font-semibold">رسالة تواصل من: {submission.name}</h2>
          <DialogClose />
        </div>
        
        {/* Info Row */}
        <div className="flex justify-between items-center text-sm text-gray-500 py-2">
            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">{submission.email}</a>
            <span>تم الاستلام في {new Date(submission.submitted_at).toLocaleString()}</span>
        </div>

        <Separator className="my-2"/>

        {/* Message Content */}
        <div className="py-4 space-y-4">
          <div className="p-2 max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap text-right">{submission.message}</p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-4">
            {/* Left-aligned actions */}
            <div className="flex gap-2">
                <a href={`mailto:${submission.email}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-cta text-white shadow hover:bg-cta-hover h-9 px-4 py-2">
                    <Mail className="mr-2 h-4 w-4" /> الرد عبر البريد الإلكتروني
                </a>
            </div>
            {/* Right-aligned actions */}
            <div className="flex gap-2 justify-end">
                {submission.status === 'read' && (
                    <Button onClick={() => handleManualUpdate('new')} disabled={isUpdating}>
                        {isUpdating ? <LoadingSpinner size="sm" /> : <RotateCcw className="ml-2 h-4 w-4"/>}
                        وضع كجديد
                    </Button>
                )}
                
                {submission.status !== 'archived' && (
                     <Button variant="secondary" onClick={() => handleManualUpdate('archived')} disabled={isUpdating}>
                        {isUpdating ? <LoadingSpinner size="sm" /> : <Archive className="ml-2 h-4 w-4"/>}
                        أرشفة
                    </Button>
                )}
                 {submission.status === 'archived' && (
                     <Button variant="ghost" onClick={() => handleManualUpdate('read')} disabled={isUpdating}>
                        <RotateCcw className="ml-2 h-4 w-4"/> نقل إلى قيد المعالجة
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};