// src/providers/LanguageProvider.tsx
import React, { createContext, useEffect, useState } from 'react';
import { en } from '@/config/i18n/translations/en';
import { ar } from '@/config/i18n/translations/ar';
import { DirectionProvider } from '@radix-ui/react-direction'; // <-- Import Radix Provider

export type Language = 'ar' | 'en';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  translations: {
    en: typeof en;
    ar: typeof ar;
  };
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // return (localStorage.getItem('language') as Language) || 'ar';
    return  'ar';
  });

  // const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const direction: Direction = 'rtl' ;

  const translations = {
    en,
    ar,
  };

  const setLanguage = (newLanguage: Language) => {
    // setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, translations }}>
      <DirectionProvider dir={direction}>
        {children}
      </DirectionProvider>
    </LanguageContext.Provider>
  );
}