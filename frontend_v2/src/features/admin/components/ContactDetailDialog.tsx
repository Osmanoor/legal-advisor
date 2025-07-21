// src/features/admin/components/ContactDetailDialog.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContactSubmission } from '@/hooks/api/useAdminContacts';
import { Mail, Archive, Clock, RotateCcw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

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
  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-right">
          <DialogTitle>Contact Message from: {submission.name}</DialogTitle>
          <DialogDescription>
            Received on {new Date(submission.submitted_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-sm">
            <strong>Email:</strong> <a href={`mailto:${submission.email}`} className="text-blue-600">{submission.email}</a>
          </div>
          <div className="p-4 bg-gray-50 rounded-md border max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{submission.message}</p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
            {/* Left-aligned actions */}
            <div className="flex gap-2">
                <a href={`mailto:${submission.email}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-primary-600 text-white shadow hover:bg-primary-700 h-9 px-4 py-2">
                    <Mail className="mr-2 h-4 w-4" /> Reply via Email
                </a>
            </div>
            {/* Right-aligned actions */}
            <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>Close</Button>
                
                {/* Mark as read (processing) */}
                {submission.status === 'new' && (
                    <Button onClick={() => onUpdateStatus(submission.id, 'read')} disabled={isUpdating}>
                        {isUpdating ? <LoadingSpinner size="sm" /> : <Clock className="mr-2 h-4 w-4"/>}
                        Mark as Processing
                    </Button>
                )}
                
                {/* Archive */}
                {submission.status !== 'archived' && (
                     <Button variant="secondary" onClick={() => onUpdateStatus(submission.id, 'archived')} disabled={isUpdating}>
                        {isUpdating ? <LoadingSpinner size="sm" /> : <Archive className="mr-2 h-4 w-4"/>}
                        Archive
                    </Button>
                )}
                 {/* Move back to new/pending */}
                {submission.status !== 'new' && (
                     <Button variant="ghost" onClick={() => onUpdateStatus(submission.id, 'new')} disabled={isUpdating}>
                        <RotateCcw className="mr-2 h-4 w-4"/> Move to New
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};