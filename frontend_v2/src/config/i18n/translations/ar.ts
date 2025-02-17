// src/config/i18n/translations/ar.ts
export const ar = {
  common: {
    search: 'بحث',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    back: 'رجوع',
    next: 'التالي',
    comingSoon: 'قريباً',
  },
  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
  },
  navigation: {
    home: 'الرئيسية',
    chat: 'المحادثة',
    library: 'المكتبة',
    search: 'البحث',
    calculator: 'الحاسبة',
    admin: 'المشرف',
  },
  procurement: {
    systemName: 'نظام المنافسات والمشتريات الحكومية',
    communityName: 'مجتمع المشتريات الحكومية',
    searchPlaceholder: 'ابحث في النظام...',
  },
  chat: {
    // Welcome Section
    welcome: {
      title: "مساعد مجتمع المشتريات الحكومية الذكي",
      description: "اطرح أسئلتك حول نظام المنافسات والمشتريات الحكومية",
      getStarted: "ابدأ الآن",
    },
    // Chat Interface
    placeholder: "اكتب رسالتك هنا...",
    send: "إرسال",
    sending: "جاري الإرسال...",
    // Message Options
    saudiAccent: "لهجة سعودية",
    reasoning: "التفكير المنطقي",
    // Status Messages
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    connecting: "جاري الاتصال...",
    reconnecting: "جاري إعادة الاتصال...",
    // Resources and Sources
    sources: "المصادر",
    article: "المادة",
    section: "الفصل",
    chapter: "الباب",
    content: "المحتوى",
    summary: "الملخص",
    // Suggested Questions
    suggestions: {
      title: "أو اختر من الأسئلة المقترحة",
      first: "ما هي شروط التأهيل المسبق للمنافسات الحكومية؟",
      second: "كيف يتم تقييم العروض في المنافسات الحكومية؟",
      third: "ما هي مدة سريان الضمان النهائي؟"
    },
    // Error Messages
    errorMessages: {
      failed: "فشل في إرسال الرسالة",
      network: "حدث خطأ في الشبكة",
      retry: "يرجى المحاولة مرة أخرى"
    }
  },
  library: {
    title: 'المكتبة',
    subtitle: 'تصفح وبحث المستندات',
    // Navigation
    root: 'المكتبة الرئيسية',
    goBack: 'العودة للمجلد السابق',
    // Actions
    downloadButton: 'تحميل',
    downloading: 'جاري التحميل...',
    openButton: 'فتح',
    viewButton: 'عرض',
    viewing: 'جاري الفتح...',
    // Search
    searchPlaceholder: 'البحث في الملفات والمجلدات...',
    deepSearch: 'بحث عميق (يشمل المجلدات الفرعية)',
    deepSearchTooltip: 'عند التفعيل، سيتم البحث في جميع المجلدات الفرعية',
    // Status messages
    loading: 'جاري التحميل...',
    error: 'حدث خطأ أثناء تحميل المحتوى',
    viewError: 'خطأ في عرض الملف',
    downloadError: 'خطأ في تحميل الملف',
    noResults: 'لم يتم العثور على ملفات أو مجلدات',
    emptyFolder: 'هذا المجلد فارغ',
    // File types
    folder: 'مجلد',
    file: 'ملف',
    // File information
    lastModified: 'آخر تعديل',
    fileSize: 'حجم الملف',
    // Tooltips
    downloadTooltip: 'تحميل هذا الملف',
    viewTooltip: 'عرض هذا الملف',
    openFolderTooltip: 'فتح هذا المجلد'
  },
  landing: {
    hero: {
      title: 'مجتمع المشتريات الحكومية',
      subtitle: 'نظام المنافسات والمشتريات الحكومية',
      description: 'منصة نضع فيها ما يهم موظفي المشتريات الحكومية وهي منصة غير رسمية ولكن عمل بسيط من زملاء لكم ونرجو ان نقدم من خلالها الفائدة المرجوة ولا تغني اطلاقاً عن العودة للنظام واللائحة والتعاميم ذات العلاقة',
      cta: 'ابدأ الآن',
      learnMore: 'اكتشف المزيد',
    },
    search: {
      placeholder: 'ابحث في النظام...',
    },
    features: {
      search: {
        title: 'بحث متقدم',
        description: 'بحث سهل وسريع في مواد النظام',
      },
      assistant: {
        title: 'مساعد مجتمع المشتريات الذكي',
        description: 'إجابات دقيقة لاستفساراتك في المشتريات الحكومية',
      },
      library: {
        title: 'مكتبة المشتريات',
        description: 'مجموعة شاملة من وثائق المشتريات الحكومية',
      },
    },
    faq: {
      title: 'الأسئلة الشائعة',
      items: [
        {
          question: 'كيف يمكنني البحث في النظام؟',
          answer: 'يمكنك استخدام شريط البحث الرئيسي أو تصفح الأقسام والفصول مباشرة',
        },
        {
          question: 'هل تكفي هذه المنصة عن العودة للنظام و اللائحة و التعاميم ذات العلاقة؟',
          answer: 'لا تكفي المنصة عن العودة للانظمه ذات العلاقه من مصادرها الرسمية ما نقدمه وسيلة مساعدة لا اكثر',
        },
        {
          question: 'كيف يمكنني تحميل النظام كاملاً؟',
          answer: 'يمكنك تحميل النظام كاملاً من قسم مكتبة المشتريات بصيغة PDF',
        },
      ],
    },
    stats: {
      articles: 'مادة في النظام',
      users: 'مستخدم نشط',
      accuracy: 'دقة الإجابات',
    },
    contact: {
      title: 'تواصل معنا',
      form: {
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        message: 'الرسالة',
        send: 'إرسال الرسالة',
        sending: 'جاري الإرسال...',
        success: 'تم إرسال الرسالة بنجاح',
        error: 'فشل في إرسال الرسالة',
        required: 'جميع الحقول مطلوبة',
        invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح'
      }
    },
  },
  search: {
    pageTitle: 'البحث في المواد',
    placeholder: 'ادخل كلمات البحث...',
    filterByType: 'تصفية حسب النوع',
    types: {
      both: 'جميع المصادر',
      system: 'نظام المنافسات والمشتريات الحكومية',
      regulation: 'اللائحة التنفيذية'
    },
    noResults: 'لم يتم العثور على نتائج لبحثك.',
    tryAgain: 'يرجى تجربة كلمات مختلفة أو تغيير عوامل التصفية.',
    errorMessage: 'فشل في جلب نتائج البحث. يرجى المحاولة مرة أخرى.',
    article: 'المادة',
    chapter: 'الباب',
    section: 'الفصل',
    content: 'المحتوى',
    summary: 'الملخص',
    keywords: 'الكلمات المفتاحية',
    references: 'المراجع',
    searching: 'جاري البحث...',
    loadingMore: 'جاري تحميل المزيد من النتائج...',
    filters: {
      title: 'عوامل التصفية',
      clearAll: 'مسح جميع عوامل التصفية',
      apply: 'تطبيق عوامل التصفية'
    }
  },
  admin: {
    login: {
      title: 'تسجيل دخول المشرف',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      submit: 'تسجيل الدخول',
      error: 'بيانات غير صحيحة'
    },
    contacts: {
      title: 'رسائل التواصل',
      date: 'التاريخ',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      message: 'الرسالة',
      export: 'تصدير CSV',
      noData: 'لا توجد رسائل تواصل',
      error: 'فشل في تحميل الرسائل'
    },
    logout: 'تسجيل الخروج'
  },
  correction: {
    title: 'أداة تصحيح النصوص',
    inputLabel: 'أدخل النص للتصحيح',
    inputPlaceholder: 'اكتب أو الصق النص هنا...',
    outputLabel: 'النص المصحح',
    correct: 'تصحيح النص',
    correcting: 'جاري التصحيح...',
    error: 'حدث خطأ أثناء تصحيح النص.',
    success: 'تم تصحيح النص بنجاح.',
  },
  calculator: {
    title: 'أدوات حاسبة المشتريات',
    tabs: {
      percentage: 'النسبة المئوية',
      vat: 'الضريبة',
      amount: 'المبلغ مع نسبة',
      date: 'التواريخ',
      tafqit: 'التفقيط'
    },
    // Percentage Calculator
    percentage: {
      title: 'حساب النسبة المئوية',
      baseAmount: 'المبلغ الأساسي',
      newAmount: 'المبلغ الجديد',
      calculate: 'احسب النسبة',
      result: 'النتيجة'
    },
    // VAT Calculator
    vat: {
      title: 'حساب الضريبة',
      operation: {
        label: 'نوع العملية',
        total: 'حساب المبلغ مع الضريبة',
        extract: 'استخراج المبلغ الأصلي من مبلغ الضريبة',
        amount: 'حساب مبلغ الضريبة'
      },
      amount: 'المبلغ',
      rate: 'نسبة الضريبة',
      calculate: 'احسب',
      results: {
        net: 'المبلغ الصافي',
        vat: 'مبلغ الضريبة',
        total: 'المبلغ الإجمالي'
      }
    },
    // Amount with Percentage
    amountPercentage: {
      title: 'حساب المبلغ مع النسبة',
      amount: 'المبلغ',
      percentage: 'النسبة',
      calculate: 'احسب',
      results: {
        original: 'المبلغ الأصلي',
        adjustment: 'مبلغ التعديل',
        final: 'المبلغ النهائي'
      }
    },
    // Date Calculator
    date: {
      conversion: {
        title: 'تحويل التواريخ'
      },
      gregorian: {
        label: 'التاريخ الميلادي',
        convert: 'حول إلى هجري',
        result: 'التاريخ الهجري'
      },
      hijri: {
        label: 'التاريخ الهجري',
        convert: 'حول إلى ميلادي',
        current: 'التاريخ الهجري الحالي',
        placeholder: 'مثال: 1445/07/29',
        result: 'التاريخ الميلادي'
      },
      difference: {
        title: 'حساب الفرق بين تاريخين',
        start: 'تاريخ البداية',
        end: 'تاريخ النهاية',
        calculate: 'احسب الفرق',
        years: 'السنوات',
        months: 'الشهور',
        days: 'الأيام',
        result: 'الفرق بين التاريخين'
      },
      duration: {
        title: 'حساب تاريخ النهاية',
        start: 'تاريخ البداية',
        duration: {
          label: 'المدة',
          days: 'الأيام',
          months: 'الشهور',
          years: 'السنوات'
        },
        calculate: 'احسب تاريخ النهاية',
        result: 'تاريخ النهاية',
        resultFormat: '{gregorian} (هجري: {hijri})',
        separator: ' و ',
        validation: {
          required: 'يجب إدخال مدة واحدة على الأقل (أيام، شهور، أو سنوات)'
        }
      },
      hijriDuration: {
        title: 'حساب المدة بالتقويم الهجري',
        start: 'تاريخ البداية (هجري)',
        calculate: 'احسب تاريخ النهاية',
        result: 'تاريخ النهاية الهجري',
        placeholder: 'أدخل التاريخ بتنسيق: 1445/07/29'
      },
      units: {
        year: 'سنة',
        years: 'سنوات',
        month: 'شهر',
        months: 'شهور',
        day: 'يوم',
        days: 'أيام'
      }
    },
    // Tafqit
    tafqit: {
      title: 'تفقيط المبلغ',
      amount: 'المبلغ',
      language: 'اللغة',
      languages: {
        arabic: 'العربية',
        english: 'الإنجليزية'
      },
      convert: 'حول إلى كلمات',
      result: 'النتيجة',
      placeholder: 'أدخل المبلغ'
    },
    // Common
    common: {
      validation: {
        required: 'هذا الحقل مطلوب',
        invalidDate: 'تاريخ غير صحيح',
        invalidNumber: 'رقم غير صحيح',
        endDateBeforeStart: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
        positiveNumber: 'يجب أن يكون الرقم موجباً'
      },
      loading: 'جاري الحساب...',
      error: 'حدث خطأ في العملية',
      reset: 'إعادة تعيين',
      calculate: 'احسب',
      back: 'رجوع'
    }
  },
};