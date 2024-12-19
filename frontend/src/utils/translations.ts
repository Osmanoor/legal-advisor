export type Language = 'en' | 'ar';

export const translations = {
  en: {
    pageTitle: 'Search Resources',
    searchPlaceholder: 'Enter search keywords...',
    searchButton: 'Search',
    filterByType: 'Filter by type:',
    typeOptions: {
      Both: 'Both',
      System: 'Government Tenders and Procurement System',
      Regulation: 'Implementing Regulations of the Government Tenders and Procurement System'
    },
    noResults: 'No results found for your search.',
    error: 'Failed to fetch search results. Please try again.',
    content: 'Content:',
    summary: 'Summary:',
    keywords: 'Keywords:',
    references: 'References:',
    switchToArabic: 'عربي',
    switchToEnglish: 'English',
    libraryTitle: 'Library',
    downloadButton: 'Download',
    downloadSuccess: 'File downloaded successfully',
    downloadError: 'Failed to download file',
    openButton: 'Open',
    downloading: 'Downloading...',
    deepSearchLabel: 'Deep search',
  },
  ar: {
    pageTitle: 'البحث في الموارد',
    searchPlaceholder: 'ادخل كلمات البحث...',
    searchButton: 'بحث',
    filterByType: 'تصفية حسب النوع:',
    typeOptions: {
      Both: 'الكل',
      System: 'نظام المنافسات والمشتريات الحكومية',
      Regulation: 'اللائحة التنفيذية لنظام المنافسات والمشتريات الحكومية'
    },
    noResults: 'لم يتم العثور على نتائج لبحثك.',
    error: 'فشل في جلب نتائج البحث. حاول مرة أخرى.',
    content: 'المحتوى:',
    summary: 'الملخص:',
    keywords: 'الكلمات المفتاحية:',
    references: 'المراجع:',
    switchToArabic: 'عربي',
    switchToEnglish: 'English',
    libraryTitle: 'المكتبة',
    downloadButton: 'تنزيل',
    downloadSuccess: 'تم تنزيل الملف بنجاح',
    downloadError: 'فشل تنزيل الملف',
    openButton: 'فتح',
    downloading: 'جاري التحميل...',
    deepSearchLabel: 'بحث عميق',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;