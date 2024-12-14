export type ResourceType = 'System' | 'Regulation' | 'Both';

export interface Chapter {
  number: number;
  name: string;
}

export interface Section {
  number: number;
  name: string;
}

export interface Resource {
  number: number;
  content: string;
  references: number[];
  keywords: string[];
  summary: string;
  section: Section;
  chapter: Chapter;
  type: Exclude<ResourceType, 'Both'>;
}

export interface SearchParams {
  query: string;
  type?: ResourceType;
}

export interface SearchResponse {
  data: Resource[];
}