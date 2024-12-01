export interface Resource {
  content: string;
  metadata: {
    article_number: number;
    chapter_name: string;
    chapter_number: number;
    section_name: string;
    section_number: number;
    summary: string;
  };
}
  
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  resources?: Resource[];
  timestamp: Date;
}
  
  export interface LocaleContent {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    features: {
      [key: string]: string;
    };
    cta: string;
    searchButton: string;
  }
  
  export interface LocaleStrings {
    ar: LocaleContent;
    en: LocaleContent;
  }