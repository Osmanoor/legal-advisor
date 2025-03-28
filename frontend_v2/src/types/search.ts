export type ResourceType = 'System' | 'Regulation' | 'Both';

export interface Chapter {
  number: number;
  name: string;
}

export interface Section {
  number: number;
  name: string;
}

export interface SearchResource {
  number: number;
  content: string;
  references: number[];
  keywords: string[];
  summary: string;
  section: Section;
  chapter: Chapter;
  type: string;
}

export interface SearchParams {
  query: string;
  type?: ResourceType;
}

export interface SearchResponse {
  data: SearchResource[];
}
