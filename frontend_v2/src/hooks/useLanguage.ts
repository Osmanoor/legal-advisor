// src/hooks/useLanguage.ts
import { useContext } from 'react';
import { LanguageContext } from '@/providers/LanguageProvider';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  const { language, direction, setLanguage } = context;

  function t(key: string, params?: Record<string, string>, raw = false): string | any {
    const keys = key.split('.');
    let value: any = context?.translations[language];

    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }

    if (raw) return value;

    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (_, key) => params[key] || `{${key}}`);
    }

    return value?.toString() || key;
  }

  return { language, direction, setLanguage, t };
}