// src/features/templates/components/DownloadActions.tsx
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";

interface DownloadActionsProps {
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
  onEmail: () => void;
  isDownloading: boolean;
}

export function DownloadActions({
  onDownloadPDF,
  onDownloadDOCX,
  onEmail,
  isDownloading
}: DownloadActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={onDownloadDOCX}
        disabled={isDownloading}
        variant="outline"
      >
        <Download className="w-4 h-4 mr-2" />
        {t('templates.download.docx')}
      </Button>
      
      <Button
        onClick={onDownloadPDF}
        disabled={isDownloading}
        variant="outline"
      >
        <Download className="w-4 h-4 mr-2" />
        {t('templates.download.pdf')}
      </Button>
      
      <Button onClick={onEmail}>
        <Mail className="w-4 h-4 mr-2" />
        {t('templates.email.button')}
      </Button>
    </div>
  );
}