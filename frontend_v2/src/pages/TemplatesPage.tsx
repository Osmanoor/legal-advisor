// src/pages/TemplatesPage.tsx
import { useState } from 'react';
import { useTemplates, Template } from '@/hooks/api/useTemplates';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ChevronLeft } from 'lucide-react';
import { TemplateCard } from '@/features/templates/components/TemplateCard';
import { TemplateForm } from '@/features/templates/components/TemplateForm';
import { EmailDialog } from '@/features/templates/components/EmailDialog';
import { DownloadActions } from '@/features/templates/components/DownloadActions';

export default function TemplatesPage() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedDocPath, setGeneratedDocPath] = useState<string>('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  // Queries and Mutations
  const {
    getAllTemplates,
    generateDocument,
    downloadDocument,
    sendEmail
  } = useTemplates();

  // Handlers
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setGeneratedDocPath('');
  };

  const handleGenerateDocument = async (values: Record<string, string>) => {
    try {
      if (!selectedTemplate) return;

      const result = await generateDocument.mutateAsync({
        templateId: selectedTemplate.id,
        values
      });

      setGeneratedDocPath(result.doc_path);
      showToast(t('templates.generation.success'), 'success');
    } catch (error) {
      showToast(t('templates.generation.error'), 'error' );
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    try {
      await downloadDocument.mutateAsync({
        docPath: generatedDocPath,
        format
      });
      showToast(t('templates.download.success'),'success' );
    } catch (error) {
      showToast(t('templates.download.error'), 'error' );
    }
  };

  const handleSendEmail = async (data: {
    recipient_email: string;
    subject: string;
    body: string;
    doc_path: string;
  }) => {
    try {
      await sendEmail.mutateAsync(data);
      setIsEmailDialogOpen(false);
      showToast(t('templates.email.success'), 'success' );
    } catch (error) {
      showToast(t('templates.email.error'),'error' );
    }
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setGeneratedDocPath('');
  };

  // Loading State
  if (getAllTemplates.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error State
  if (getAllTemplates.error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{t('common.error')}</p>
            <Button onClick={() => getAllTemplates.refetch()}>
              {t('common.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {selectedTemplate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('templates.back')}
            </Button>
          )}
          <h1 className="text-3xl font-bold">
            {selectedTemplate ? selectedTemplate.display_name[language] : t('templates.title')}
          </h1>
        </div>

        {/* Content */}
        {!selectedTemplate ? (
          // Templates Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAllTemplates.data?.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
        ) : (
          // Template Form and Actions
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                {!generatedDocPath ? (
                  <TemplateForm
                    template={selectedTemplate}
                    onSubmit={handleGenerateDocument}
                    isLoading={generateDocument.isPending}
                  />
                ) : (
                  <div className="space-y-6">
                    <p className="text-green-600 text-sm">
                      {t('templates.generation.success')}
                    </p>
                    <DownloadActions
                      onDownloadPDF={() => handleDownload('pdf')}
                      onDownloadDOCX={() => handleDownload('docx')}
                      onEmail={() => setIsEmailDialogOpen(true)}
                      isDownloading={downloadDocument.isPending}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Email Dialog */}
      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSend={handleSendEmail}
        docPath={generatedDocPath}
        isLoading={sendEmail.isPending}
      />
    </div>
  );
}