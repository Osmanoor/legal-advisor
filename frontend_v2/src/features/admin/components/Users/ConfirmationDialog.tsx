// src/features/admin/components/Users/ConfirmationDialog.tsx
// Updated for i18n

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  isConfirming?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  isConfirming = false,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50">
          <div className="flex items-start gap-4">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="flex-1 text-left">
                <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <Button variant="danger" onClick={onConfirm} disabled={isConfirming}>
              {isConfirming ? t('admin.users.confirmDialog.deleting') : confirmText}
            </Button>
            <Dialog.Close asChild>
              <Button variant="outline">{t('admin.users.confirmDialog.cancel')}</Button>
            </Dialog.Close>
          </div>

          <Dialog.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};