// src/types/resource.ts
export interface FileOrFolder {
    mimeType: string;
    size?: string;
    id: string;
    name: string;
    createdTime: string;
    modifiedTime: string;
  }