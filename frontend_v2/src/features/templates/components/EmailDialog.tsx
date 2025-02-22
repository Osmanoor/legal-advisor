// src/features/templates/components/EmailDialog.tsx
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface EmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: {
    recipient_email: string;
    subject: string;
    body: string;
    doc_path: string;
  }) => void;
  docPath: string;
  isLoading: boolean;
}

export function EmailDialog({ 
  isOpen, 
  onClose, 
  onSend, 
  docPath, 
  isLoading 
}: EmailDialogProps) {
  const { t, direction } = useLanguage();
  const [formData, setFormData] = useState({
    recipient_email: '',
    subject: '',
    body: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      ...formData,
      doc_path: docPath
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('templates.email.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder={t('templates.email.recipient')}
              value={formData.recipient_email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                recipient_email: e.target.value
              }))}
              required
              dir={direction}
            />
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder={t('templates.email.subject')}
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                subject: e.target.value
              }))}
              required
              dir={direction}
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder={t('templates.email.body')}
              value={formData.body}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                body: e.target.value
              }))}
              required
              dir={direction}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                {t('common.loading')}
              </div>
            ) : (
              t('templates.email.send')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}