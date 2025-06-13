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
    downloading: 'جاري التنزيل...',
    sending: 'جاري الإرسال...',
    retry: 'حاول مرة أخرى',
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
    correction: 'تصحيح لغوي',
    templates: 'القوالب',
    journey: 'رحلة التعلم',
    tenderMapping: 'تحديد المنافسات',
    // New Nav Keys from Design
    userReviews: "أراء المستخدمين",
    faq: "الأسئلة الشائعة",
    whatSetsUsApart: "ما يميزنا",
    solutions: "حلولنا",
  },
  procurement: {
    systemName: 'نظام المنافسات والمشتريات الحكومية',
    communityName: 'شبكة المشتريات الحكومية', // Updated from new logo
    searchPlaceholder: 'ابحث في النظام...',
  },
  chat: {
    // Welcome Section
    welcome: {
      title: "مرحباً بك، ماسي",
      description: "اطرح أسئلتك حول نظام المنافسات والمشتريات الحكومية",
      getStarted: "ابدأ الآن",
      
    },
    // Message options and actions
    saudiAccent: "لهجة سعودية",
    reasoning: "التفكير المنطقي",
    sources: "المصادر",
    viewDetails: "عرض التفاصيل", // For source cards
    regenerate: "إعادة إنشاء",
    copy: "نسخ",
    share: "مشاركة",
    bookmark: "حفظ",
    // Chat Interface
    placeholder: "اكتب رسالتك هنا...",
    send: "إرسال",
    sending: "جاري الإرسال...",
    // Status Messages
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    connecting: "جاري الاتصال...",
    reconnecting: "جاري إعادة الاتصال...",
    // Resources and Sources
    article: "المادة",
    section: "الفصل",
    chapter: "الباب",
    content: "المحتوى",
    summary: "الملخص",
    // History View
    historyButton: "السجل",
    historyTitle: "المحادثات",
    searchHistoryPlaceholder: "ابحث عن محادثات",
    sortBy: "ترتيب حسب",
    // Active Chat View
    newChat: "محادثة جديدة",
    chatTitlePlaceholder: "عنوان المحادثة",
    // Suggested Questions
    suggestions: {
      title: "أو اختر من الأسئلة المقترحة",
      first: "ما هي شروط التأهيل المسبق للمنافسات الحكومية؟",
      second: "كيف يتم تقييم العروض في المنافسات الحكومية؟",
      third: "ما هي مدة سريان الضمان النهائي؟"
    },
    // Timestamps & Counts
    questionCount: "سؤال",
    questionsCount: "أسئلة",
    today: "اليوم",
    yesterday: "الأمس",
    // Error Messages
    errorMessages: {
      failed: "فشل في إرسال الرسالة",
      network: "حدث خطأ في الشبكة",
      retry: "يرجى المحاولة مرة أخرى"
    },
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
  // --- START: NEW AND MERGED LANDING PAGE TRANSLATIONS ---
  landingPage: {
    hero: {
      title: 'كل ما يتعلق بالمشتريات الحكومية في مكان واحد',
      description: 'منصة نضع فيها ما يهم موظفي المشتريات الحكومية وهي منصة غير رسمية ولكن عمل بسيط من زملاء لكم ونرجو ان نقدم من خلالها الفائدة المرجوة ولا تغني اطلاقاً عن العودة للنظام واللائحة والتعاميم ذات العلاقة',
      startNowButton: 'أبدأ الان',
      aiAssistantTitle: 'أستخدم الأن المساعد الألي الأكثر تطوراً',
      aiAssistantPlaceholder: 'كيف يمكن أن أساعدك ؟',
      trustedBy: 'مستخدم و محبوب من قبل الأشخاص في الشركات المبدعة',
      // Old keys
      subtitle: 'نظام المنافسات والمشتريات الحكومية', // Old, for reference
      cta: 'ابدأ الآن', // Old, for reference
      learnMore: 'اكتشف المزيد', // Old, for reference
    },
    search: { // Old section
      placeholder: 'ابحث في النظام...',
    },
    solutionsTitle: 'حلولنا',
    solutions: {
      aiAssistant: {
        title: 'المساعد الذكي',
        description: 'إجابات دقيقة لاستفساراتك في المشتريات الحكومية.',
      },
      calculator: {
        title: 'الحاسبة',
        description: 'مجموعة شاملة من الأدوات لحساب النسب والتواريخ.', // Adjusted
      },
      textCorrection: {
        title: 'معالج النصوص',
        description: 'تصحيح الأخطاء الإملائية وتحويل الأرقام إلى نصوص تلقائيًا.',
      },
      procurementSystem: {
        title: 'نظام الطرح', // (Your feature 4)
        description: 'إنشاء تقارير وخرائط طريق كاملة للمنافسات.',
      },
      advancedSearch: {
        title: 'البحث المتقدم', // (Your feature 1, "Smart AI assistant which answer user query...")
        description: 'وصول سريع ودقيق لمستندات النظام واللوائح مع إجابات مدعومة بالذكاء الاصطناعي.',
      },
    },
    featuresTitle: 'ما يميزنا',
    featuresDescription: 'نؤمن بالوضوح، نعمل بكفاءة، ونبني علاقات توريد قائمة على الثقة والسهولة.',
    features: {
      aiAssistant: {
        title: "اسأل.. وجوابك حاضر!",
        description: "مساعد المشتريات الذكي معك في كل استفسار، بكل سهولة وسرعة.",
        readyToHelp: "مرحباً بك، أنا في خدمتك",
        prompt: "كيف يمكن أن أساعدك ؟",
      },
      calculator: {
        title: "احسبها ببساطة.. خطط بثقة",
        description: "حاسبة متطورة تجمع لك كل احتياجاتك في ضغطة زر.",
      },
      everythingInOnePlace: {
        title: "كل ما تحتاجه ... في مكان واحد",
        description: "يجمع لك كل التفاصيل، ويوجهك خطوة بخطوة نحو أفضل القرارات.",
      }
    },
    testimonialsTitle: 'أراء المستخدمين',
    testimonials: {
      person1: {
        name: "علي حسن",
        title: "مدير المشتريات، وزارة البنية التحتية",
        quote: "لقد أحدثت هذه المنصة ثورة في كيفية تعاملنا مع المناقصات الحكومية. المساعد الذكي يقدم إجابات سريعة ودقيقة بناءً على الأنظمة واللوائح، مما يوفر علينا ساعات لا تحصى."
      },
      person2: {
        name: "فاطمة السالم",
        title: "أخصائية عقود، الهيئة الصحية",
        quote: "أداة تصحيح وتحسين النصوص رائعة لضمان خلو مستنداتنا الرسمية من الأخطاء. حاسبة التواريخ أيضًا أداة أساسية يوميًا."
      },
      person3: {
        name: "خالد إبراهيم",
        title: "مسؤول مشتريات، مديرية التعليم",
        quote: "أصبح إنشاء تقارير المنافسات الكاملة مع الجداول الزمنية أمرًا سهلاً للغاية الآن. القدرة على تعديل الجداول الزمنية ميزة كبيرة لإدارة تغييرات المشروع."
      },
      person4: {
        name: "نورة عبد الله",
        title: "مسؤولة مشتريات مبتدئة",
        quote: "بصفتي جديدة في هذا المجال، كانت رحلة التعلم والمساعد الذكي لا تقدر بثمن في فهم أنظمة ولوائح المشتريات المعقدة."
      },
      person5: {
        name: "سعد المطيري",
        title: "رئيس لجنة المناقصات",
        quote: "الشفافية والكفاءة التي توفرها هذه الشبكة جديرة بالثناء. إنها تبسط الالتزام بقوانين المشتريات الحكومية."
      },
      person6: {
        name: "ليلى القحطاني",
        title: "محللة مالية، قسم المشتريات",
        quote: "أدوات الحاسبة دقيقة وتغطي جميع احتياجاتنا، من النسب المئوية إلى حسابات التواريخ المفصلة لتخطيط المشاريع."
      },
      person7: {
        name: "عمر يوسف",
        title: "كبير المشترين، الخدمات البلدية",
        quote: "كان العثور على بنود محددة في اللوائح مهمة شاقة في السابق. البحث الذكي والمساعد الاصطناعي جعلا الأمر سهلاً وسريعًا بشكل ملحوظ. موصى به بشدة!"
      },
      person8: {
        name: "عائشة بكر",
        title: "مستشارة قانونية، قسم المشتريات",
        quote: "تركيز المنصة على الامتثال لقوانين المشتريات الحكومية السعودية واضح. فهم الذكاء الاصطناعي لهذه المستندات مثير للإعجاب."
      },
      person9: {
        name: "فهد الغامدي",
        title: "منسق مشاريع",
        quote: "إدارة خرائط طريق المنافسات ومتطلباتها لم تكن أسهل من أي وقت مضى. هذه الأداة تبقي كل شيء منظمًا وعلى المسار الصحيح."
      },
      person10: {
        name: "ريم الجاسر",
        title: "متدربة في قسم المشتريات",
        quote: "مصدر تعليمي رائع ومجموعة أدوات عملية. لقد ساعدتني على اكتساب الخبرة بسرعة أكبر مما توقعت."
      }
    },
    faqTitle: 'الأسئلة الشائعة',
    faq: {
      q1: {
        question: "هل أستطيع استخدام الحاسبة لحساب جميع أنواع التكاليف؟",
        answer: "نعم، الحاسبة مصممة لتغطية مختلف سيناريوهات التكاليف في المشتريات الحكومية."
      },
      q2: {
        question: "كيف يساعدني مساعد المشتريات في اختيار المورد المناسب؟",
        answer: "يقدم المساعد تحليلات بناءً على معاييرك، ويقترح الموردين الأكثر ملاءمة بناءً على البيانات التاريخية وتقييمات الأداء."
      },
      q3: {
        question: "ما هي أنواع العقود التي يدعمها النظام؟",
        answer: "يدعم النظام مجموعة واسعة من أنواع العقود المتوافقة مع لوائح المشتريات الحكومية السعودية."
      },
      q4: {
        question: "كيف أبدأ رحلتي مع نظام المشتريات؟",
        answer: "لبدء استخدام نظام المشتريات، قم أولاً بإنشاء حساب عبر بوابتنا الإلكترونية بخطوات سهلة وسريعة. بعد تسجيل الدخول، ستجد أمامك واجهة مصممة خصيصًا لتبسيط رحلتك الشرائية. يمكنك الاستعانة بمساعد المشتريات الذكي الذي سيرشدك خطوة بخطوة، بدايةً من تحديد احتياجاتك، مرورًا باختيار المورد الأنسب، ووصولاً إلى إتمام الطلب والموافقة عليه إلكترونيًا."
      },
      q5: {
        question: "هل يتوافق النظام مع لوائح المشتريات الحكومية السعودية؟",
        answer: "بالتأكيد، تم تصميم النظام ليكون متوافقًا تمامًا مع جميع اللوائح والإجراءات الخاصة بالمشتريات الحكومية في المملكة العربية السعودية."
      }
    },
    stats: { // Old section
      articles: 'مادة في النظام',
      users: 'مستخدم نشط',
      accuracy: 'دقة الإجابات',
    },
    contact: { // Old section
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
    footer: {
      loginButton: "سجل دخول الان",
      copyright: "حقوق النشر © {year} . جميع الحقوق محفوظة.",
    }
  },
  // --- END: NEW AND MERGED LANDING PAGE TRANSLATIONS ---
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
    title: 'لوحة المشرف',
    login: {
      title: 'تسجيل دخول المشرف',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      submit: 'تسجيل الدخول',
      error: 'بيانات غير صحيحة'
    },
    tabs: {
      contacts: 'جهات الاتصال',
      emails: 'رسائل البريد الإلكتروني'
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
    emails: {
      title: 'سجلات البريد الإلكتروني',
      date: 'التاريخ',
      recipient: 'المستلم',
      subject: 'الموضوع',
      body: 'الرسالة',
      attachment: 'المرفق',
      export: 'تصدير CSV',
      noData: 'لا توجد سجلات بريد إلكتروني',
      error: 'فشل في تحميل سجلات البريد'
    },
    logout: 'تسجيل الخروج'
  },
  correction: {
    title: 'معالج النصوص',
    subtitlePlaceholder: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed', // Add this key
    inputLabel: 'أدخل النص للتصحيح',
    inputPlaceholder: 'أدخل النص المراد تعديله', // Updated placeholder
    outputLabel: 'النص المصحح',
    correct: 'تصحيح النص',
    correcting: 'جاري التصحيح...',
    enhancing: 'جاري التحسين...', // Add this key
    error: 'حدث خطأ أثناء معالجة النص.', // Updated for generic use
    success: 'تم تصحيح النص بنجاح.',
    enhanceSuccess: 'تم تحسين النص بنجاح.', // Add this key
    copiedToClipboard: 'تم النسخ إلى الحافظة!', // Add this key
    copyError: 'فشل النسخ إلى الحافظة.', // Add this key
    copy: 'نسخ', // Add this key
    // New keys for the new design
    tabTitleCorrect: 'تصحيح النصوص',
    tabTitleTafqit: 'التفقيط',
    enhanceTextButton: 'تحسين النص',
    correctTextButton: 'تصحيح النص',
    reEnterButton: 'إعادة الإدخال',
  },
  calculator: {
    mainTitle: 'تفقد جميع الادوات الحسابية',
    mainSubtitle: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.', // Placeholder subtitle
    tabs: {
      numericalValues: 'القيم الحسابية',
      dates: 'التواريخ',
      // Old tabs
      percentage: 'النسبة المئوية',
      vat: 'الضريبة',
      amount: 'المبلغ مع نسبة',
      tafqit: 'التفقيط'
    },
    selectNumericalType: 'اختر نوع الحساب العددي',
    selectDateType: 'اختر نوع حساب التاريخ',
    selectCalculation: 'اختر نوع العملية',

    subTabs: {
      percentageChange: 'حساب النسبة المئوية',
      vatCalculation: 'حساب ضريبة القيمة المضافة',
      amountWithPercentage: 'حساب المبلغ مع نسبة',
      dateConversion: 'تحويل التواريخ',
      dateDifference: 'الفرق بين تاريخين',
      dateDuration: 'حساب المدة وتاريخ الانتهاء',
    },

    percentage: {
      title: 'حساب النسبة المئوية',
      baseAmount: 'المبلغ الأساسي',
      newAmount: 'المبلغ الجديد',
      calculate: 'احسب النسبة',
      resultLabel: 'القيمة',
      result: 'النتيجة'
    },

    vat: {
      title: 'حساب الضريبة',
      operation: {
        label: 'نوع العملية',
        total: 'حساب الصافي والضريبة من الإجمالي (شامل الضريبة)',
        extract: 'حساب الإجمالي (شامل الضريبة) من الصافي',
        amount: 'حساب مبلغ الضريبة من الصافي'
      },
      selectOperationPlaceholder: 'اختر نوع عملية الضريبة',
      amountInputLabel: 'المبلغ',
      rateLabel: 'نسبة الضريبة',
      calculate: 'احسب الضريبة',
      results: {
        netAmountLabel: 'القيمة', // As per Image 2 "القيمة" for 100
        vatAmountLabel: 'قيمة الضريبة', // As per Image 2
        totalAmountLabel: 'المبلغ الكلي', // As per Image 2
        net: 'المبلغ الصافي',
        vat: 'مبلغ الضريبة',
        total: 'المبلغ الإجمالي'
      }
    },

    amountPercentage: {
      title: 'حساب المبلغ مع النسبة',
      amountLabel: 'المبلغ',
      percentageLabel: 'النسبة',
      calculate: 'احسب',
      results: {
        originalAmountLabel: 'القيمة', // As per Image 3
        adjustmentAmountLabel: 'قيمة التعديل', // As per Image 3
        finalAmountLabel: 'القيمة النهائية', // As per Image 3
        original: 'المبلغ الأصلي',
        adjustment: 'مبلغ التعديل',
        final: 'المبلغ النهائي'
      }
    },

    date: {
      conversion: {
        title: 'تحويل التواريخ',
        gregorianLabel: 'التاريخ الميلادي', // Old
        hijriLabel: 'التاريخ الهجري', // Old
        inputLabelGregorian: 'التاريخ بالميلادي', // New for Image 4
        inputLabelHijri: 'التاريخ بالهجري',       // New for Image 4
        convertToHijri: 'حول إلى هجري',
        convertToGregorian: 'حول إلى ميلادي',
        convertActionLabel: 'تحويل التواريخ',
      },
      difference: {
        title: 'حساب الفرق بين تاريخين',
        start: 'تاريخ البداية',
        end: 'تاريخ النهاية',
        calculate: 'احسب الفرق',
        result: 'الفرق بين التاريخين',
      },
      duration: {
        title: 'حساب تاريخ النهاية',
        start: 'تاريخ البداية',
        duration: {
          label: 'المدة',
          years: 'عدد السنين', // Placeholder for years input from Image 6
          months: 'عدد الشهور',// Placeholder for months input from Image 6
          days: 'عدد الأيام',  // Placeholder for days input from Image 6
        },
        calculate: 'احسب', // "أحسب" from Image 6
        resultLabel: 'تاريخ النهاية المحسوب', // Label for the result display
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
        placeholder: 'أدخل التاريخ بتنسيق: س س س س / ش ش / ي ي' // Updated placeholder
      },
      units: {
        year: 'سنة',
        years: 'سنوات',
        month: 'شهر',
        months: 'شهور',
        day: 'يوم',
        days: 'أيام'
      },
      hijri: {
        label: 'التاريخ الهجري',
        current: 'التاريخ الهجري الحالي',
        placeholder: 'س س س س/ش ش/ي ي', // Generic placeholder
        result: 'التاريخ الميلادي'
      },
      gregorian: {
        label: 'التاريخ الميلادي',
        result: 'التاريخ الهجري'
      }
    },

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
      placeholder: 'أدخل المبلغ',
      resultPlaceholder: 'النتيجة كتابة', // Add this key
  },
    
    common: {
      enterAmountPlaceholder: 'أدخل المبلغ',
      enterPercentagePlaceholder: 'أدخل النسبة',
      noResultYet: 'أدخل القيم للحساب',
      reset: 'إعادة تعيين',
      calculate: 'احسب',
      back: 'رجوع',
      validation: {
        required: 'هذا الحقل مطلوب',
        invalidDate: 'تاريخ غير صحيح',
        invalidNumber: 'رقم غير صحيح أو مبلغ أساسي صفر',
        endDateBeforeStart: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
        positiveNumber: 'يجب أن يكون الرقم موجباً',
        selectBothDates: 'يرجى تحديد تاريخي البداية والنهاية',
        enterStartDate: 'يرجى إدخال تاريخ البداية',
        enterGregorian: 'يرجى إدخال التاريخ الميلادي',
        enterHijri: 'يرجى إدخال التاريخ الهجري',
        invalidHijriFormat: 'صيغة التاريخ الهجري غير صحيحة (س س س س/ش ش/ي ي)',
      }
    }
  },
  templates: {
    title: 'قوالب المستندات',
    placeholders: 'الحقول المطلوبة', // Changed from 'الحقول المطلوبة' in old ar.ts
    generate: 'إنشاء المستند',
    back: 'العودة إلى القوالب', // New
    generation: {
      success: 'تم إنشاء المستند بنجاح',
      error: 'خطأ في إنشاء المستند'
    },
    download: {
      docx: 'تحميل DOCX',
      pdf: 'تحميل PDF',
      success: 'تم تحميل المستند بنجاح',
      error: 'خطأ في تحميل المستند'
    },
    email: {
      button: 'إرسال عبر البريد الإلكتروني',
      title: 'إرسال المستند',
      recipient: 'البريد الإلكتروني للمستلم',
      subject: 'الموضوع',
      body: 'الرسالة',
      send: 'إرسال',
      success: 'تم إرسال البريد الإلكتروني بنجاح',
      error: 'خطأ في إرسال البريد الإلكتروني'
    },
     procurementSystem: {
        title: 'نظام الطرح',
        description: 'مجموعة شاملة من وثائق المشتريات الحكومية.'
    },
    autoCalculated: '(يُحسب تلقائيًا)' // For TemplateForm
  },
  journey: {
    title: 'رحلة التعلم',
    description: 'موارد تعليمية خطوة بخطوة لمحترفي المشتريات',
    levels: 'مستويات الرحلة',
    level: 'المستوى',
    resources: 'الموارد',
    levelDescription: 'وصف المستوى',
    noLevels: 'لم يتم العثور على مستويات للرحلة',
    noResources: 'لم يتم العثور على موارد لهذا المستوى',
    back: 'العودة إلى المستويات',
    viewResource: 'عرض',
    downloadResource: 'تحميل',
    resourceDetails: 'تفاصيل المورد',
    size: 'الحجم',
    type: 'النوع',
    created: 'تاريخ الإنشاء',
    modified: 'تاريخ التعديل',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ أثناء تحميل البيانات',
    yourProgress: 'تقدمك',
    previousLevel: 'المستوى السابق',
    nextLevel: 'المستوى التالي',
    start: 'ابدأ',
    continue: 'متابعة',
    backToJourney: 'العودة إلى الرحلة',
  },
  tenderMapping: {
    title: 'نظام الطرح',
    description: 'اعثر على نوع المنافسة الأنسب بناءً على متطلبات مشروعك',
    
    // Form Inputs
    inputs: {
      title: 'حدد نوع المنافسة',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed', // Placeholder subtitle
      workType: 'نوع العمل',
      workTypePlaceholder: 'اختر نوع العملية',
      budget: 'الميزانية',
      budgetPlaceholder: 'أدخل المبلغ',
      startDate: 'تاريخ البدء',
      startDatePlaceholder: 'أدخل التاريخ',
      projectDuration: 'مدة المشروع (بالأشهر)',
      projectDurationPlaceholder: 'أدخل المدة',
      submit: 'تحديد نوع المنافسة',
      reset: 'إعادة تعيين'
    },
    
    // Result View
    results: {
      title: 'تقرير المنافسة',
      
      // Tabs
      tabs: {
        details: 'تفاصيل المنافسة',
        timeline: 'الجدول الزمني',
        regulations: 'ضوابط عامة'
      },
      
      // Details Tab Labels (example keys)
      procurementStyle: 'أسلوب الطرح',
      stageCount: 'عدد المراحل',
      offerSubmission: 'تقديم العروض',
      offerDuration: 'مدة تقديم العروض',
      exeedApproval: 'موافقة كفاءة الانفاق',
      financeApproval: 'أجازة وزارة المالية',
      totalDuration: 'المدة الإجمالية',
      localContentMechanism: 'الية المحتوى المحلي',

      // Timeline Tab
      workingDays: 'أيام عمل',
      save: 'حفظ',
      cancel: 'إلغاء',
      editDuration: 'تعديل المدة',
      
      // Regulations Tab
      sources: 'المصادر',
      moreDetails: 'المزيد عن التفاصيل',
      system: 'النظام',
      regulation: 'اللائحة',
      
      // General
      noResult: 'لم يتم الع"ور على نوع منافسة مطابق',
      tryAgain: 'يرجى تجربة خيارات مختلفة'
    },
    
    loading: 'جارٍ حساب نوع المنافسة...',
    error: 'حدث خطأ أثناء معالجة طلبك'
  },
};