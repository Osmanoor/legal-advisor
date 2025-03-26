// src/hooks/api/useTemplates.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface Placeholder {
  id: string;
  type: string;
  required: boolean;
  description: {
    ar: string;
    en: string;
  };
  source: string;
}

export interface Template {
  id: string;
  filename: string;
  display_name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  placeholders: Placeholder[];
}

interface GenerateDocResponse {
  message: string;
  doc_path: string;
}

interface SendEmailData {
  recipient_email: string;
  subject: string;
  body: string;
  doc_path: string;
}

export function useTemplates() {
  // Get all templates
  const getAllTemplates = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.get<{ templates: Template[] }>('/templates');
      return response.data.templates;
    }
  });

  // Get template details
  const getTemplateDetails = (templateId: string) => 
    useQuery({
      queryKey: ['template-details', templateId],
      queryFn: async () => {
        const response = await api.get<Template>(`/templates/${templateId}`);
        return response.data;
      },
      enabled: !!templateId
    });

  // Generate document
  const generateDocument = useMutation<
    GenerateDocResponse,
    Error,
    { templateId: string; values: Record<string, string> }
  >({
    mutationFn: async ({ templateId, values }) => {
      const response = await api.post(`/templates/${templateId}/generate`, values);
      return response.data;
    }
  });

  // Download document
  const downloadDocument = useMutation<
    void,
    Error,
    { docPath: string; format: 'pdf' | 'docx' }
  >({
    mutationFn: async ({ docPath, format }) => {
      const response = await api.post(
        `/templates/download/${format}`,
        { doc_path: docPath },
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  });

  // Send email
  const sendEmail = useMutation<void, Error, SendEmailData>({
    mutationFn: async (data) => {
      await api.post('/templates/send-email', data);
    }
  });

  return {
    getAllTemplates,
    getTemplateDetails,
    generateDocument,
    downloadDocument,
    sendEmail
  };
}