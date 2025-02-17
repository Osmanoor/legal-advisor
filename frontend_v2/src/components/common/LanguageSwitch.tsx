import { useLanguage } from '../../hooks/useLanguage';
import { Languages } from 'lucide-react';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}