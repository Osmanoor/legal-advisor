export type Language = 'ar' | 'en';

export type Direction = 'ltr' | 'rtl';

export interface Translation {
  [key: string]: string | Translation;
}

export interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}