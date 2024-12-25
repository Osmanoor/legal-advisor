export type Language = 'en' | 'ar';

export const translations = {
  en: {
    pageTitle: 'Search Resources',
    searchPlaceholder: 'Enter the name of the file you want to search for...',
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
    deepSearchLabel: 'Deep search (will search through all subfolders recursively.)',
    deepSearchTooltip: 'Deep search ',
    root: 'مكتبة المشتريات',
    article: 'Article',
    chapter: 'Chapter',
    section: 'Section',
  },
  ar: {
    pageTitle: 'البحث في الموارد',
    searchPlaceholder: 'ادخل اسم الملف الذي تريد البحث عنه...',
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
    deepSearchLabel: 'البحث العميق (سيبحث عن الملف في جميع المجلدات الفرعية بشكل تكراري.)',
    deepSearchTooltip: 'البحث العميق سيبحث في جميع المجلدات الفرعية بشكل تكراري.',
    root: 'مكتبة المشتريات',
    article: 'المادة',
    chapter: 'الباب',
    section: 'الفصل',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;