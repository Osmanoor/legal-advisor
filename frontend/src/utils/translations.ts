export type Language = 'en' | 'ar';

export const translations = {
  en: {
    pageTitle: 'Search Resources',
    searchPlaceholder: 'Enter search keywords...',
    searchButton: 'Search',
    filterByType: 'Filter by type:',
    typeOptions: {
      Both: 'Both',
      System: 'System',
      Regulation: 'Regulation'
    },
    noResults: 'No results found for your search.',
    error: 'Failed to fetch search results. Please try again.',
    content: 'Content:',
    summary: 'Summary:',
    keywords: 'Keywords:',
    references: 'References:',
    switchToArabic: 'عربي',
    switchToEnglish: 'English'
  },
  ar: {
    pageTitle: 'البحث في الموارد',
    searchPlaceholder: 'ادخل كلمات البحث...',
    searchButton: 'بحث',
    filterByType: 'تصفية حسب النوع:',
    typeOptions: {
      Both: 'الكل',
      System: 'نظام',
      Regulation: 'لائحة'
    },
    noResults: 'لم يتم العثور على نتائج لبحثك.',
    error: 'فشل في جلب نتائج البحث. حاول مرة أخرى.',
    content: 'المحتوى:',
    summary: 'الملخص:',
    keywords: 'الكلمات المفتاحية:',
    references: 'المراجع:',
    switchToArabic: 'عربي',
    switchToEnglish: 'English'
  }
} as const;

export type TranslationKey = keyof typeof translations.en;