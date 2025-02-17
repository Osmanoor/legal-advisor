// src/hooks/api/useLibrary.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { FileOrFolder } from '@/types';

interface ViewFileResponse {
  content: string;
  mimeType: string;
}

// List folder contents
export function useLibrary(folderId: string) {
  return useQuery({
    queryKey: ['library', folderId],
    queryFn: async () => {
      const response = await api.get(`/library/list-folder-contents`, {
        params: { folder_id: folderId }
      });
      return response.data as FileOrFolder[];
    },
  });
}

// Search files
export function useLibrarySearch(query: string, recursive: boolean) {
  return useQuery({
    queryKey: ['library', 'search', query, recursive],
    queryFn: async () => {
      const response = await api.get(`/library/search-files`, {
        params: { query, recursive }
      });
      return response.data as FileOrFolder[];
    },
    enabled: !!query,
  });
}

// Download file
export function useFileDownload() {
  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await api.post('/library/download-file', 
        { file_id: fileId },
        { responseType: 'blob' }
      );
      return response.data;
    },
  });
}

// View file
export function useFileView() {
  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await api.post<ViewFileResponse>('/library/view-file', {
        file_id: fileId
      });
      return response.data;
    },
  });
}

// Helper function to convert base64 to blob
export function base64ToBlob(base64Content: string, mimeType: string): Blob {
  const binaryContent = atob(base64Content);
  const bytes = new Uint8Array(binaryContent.length);
  
  for (let i = 0; i < binaryContent.length; i++) {
    bytes[i] = binaryContent.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: mimeType });
}

// Helper function to open file in new tab
export function openFileInNewTab(blob: Blob): void {
  const blobUrl = URL.createObjectURL(blob);
  const viewerWindow = window.open(blobUrl, '_blank');
  
  if (viewerWindow) {
    viewerWindow.onload = () => {
      URL.revokeObjectURL(blobUrl);
    };
  }
}

// Helper function for handling file downloads
export function downloadFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}