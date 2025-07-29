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
    reset: 'إعادة تعيين',
  },
  auth: {
    // --- Slogan for AuthLayout ---
    slogan: {
      title: 'كل ما تحتاجه في مجال المشتريات الحكومية',
      subtitle: 'الآن رقمي و سهل'
    },
    
    // --- General Actions & Prompts ---
    login: 'تسجيل دخول',
    signup: 'إنشاء حساب',
    submit: 'تأكيد',
    or: 'أو',
    skip: 'تخطي',
    backToLogin: 'العودة لتسجيل الدخول',
    noAccountPrompt: 'ليس لديك حساب ؟',
    createAccountAction: 'أنشئ حساب',
    hasAccountPrompt: 'لديك حساب بالفعل ؟',

    // --- Login Form ---
    loginTitle: 'تسجيل الدخول',
    emailOrPhone: 'البريد الإلكتروني او رقم الهاتف',
    password: 'كلمة السر',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة السر ؟',
    loginWithGoogle: 'تسجيل دخول عن طريق Google',
    loginWithLinkedIn: 'تسجيل دخول عن طريق LinkedIn',
    
    // --- Registration Flow ---
    signupTitle: 'إنشاء حساب',
    fullName: 'الأسم بالكامل',
    fullNamePlaceholder: 'ادخل الأسم بالكامل',
    emailOptional: 'البريد الألكتروني (اختياري)',
    emailPlaceholder: 'ادخل بريد الاكتروني',
    phoneOptional: 'رقم الهاتف (اختياري)',
    passwordPlaceholder: 'ادخل كلمة السر',
    confirmPassword: 'تأكيد كلمة السر',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة السر',

    // --- Verification Step ---
    verifyInstruction: 'أدخل الرقم السري المرسل لرقم الهاتف {identifier}،',
    changeNumber: 'هل تريد تغيير الرقم ؟',
    verifying: 'جاري التحقق...',
    verifyCode: 'تأكيد الرمز',
    
    // --- Additional Info Step ---
    additionalInfoTitle: 'معلومات إضافية',
    additionalInfoSubtitle: 'نود معرفة المزيد عنك لتحسين تجربتك.',
    jobTitle: 'المسمى الوظيفي',
    jobTitlePlaceholder: 'ادخل المسمى الوظيفي',
    workplace: 'جهة العمل',
    workplacePlaceholder: 'ادخل اسم جهة العمل',
    linkedinAccount: 'حساب لينكدإن',
    linkedinPlaceholder: 'ادخل حساب لينكدإن',

    // --- Password Reset Flow ---
    resetPasswordTitle: 'إعادة ضبط كلمة السر',
    resetPasswordInstruction: 'أدخل بريدك الإلكتروني أو رقم هاتفك وسنرسل لك رمزًا لإعادة تعيين كلمة المرور الخاصة بك.',
    sendResetCode: 'إرسال رمز إعادة التعيين',
    otpPlaceholder: 'أدخل رمز التحقق',
    otpSentTo: 'تم إرسال رمز مكون من 6 أرقام إلى {identifier}.',
    setNewPasswordTitle: 'قم بتعيين كلمة السر الجديدة',
    setNewPasswordInstruction: 'الرجاء إنشاء كلمة مرور جديدة وقوية لحسابك.',
    newPassword: 'كلمة المرور الجديدة',
    newPasswordPlaceholder: 'أدخل كلمة المرور الجديدة',
    confirmNewPasswordPlaceholder: 'تأكيد كلمة المرور الجديدة',
    resetPasswordAction: 'إعادة ضبط كلمة السر',

    // --- Stepper ---
    steps: {
      basicInfo: 'المعلومات الأساسية',
      verification: 'التحقق',
      additionalInfo: 'المعلومات الإضافية'
    },

    // --- Validation, Success & Error Toasts ---
    errorInvalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    errorEmailExists: 'هذا البريد الإلكتروني مسجل بالفعل.',
    errorPasswordLength: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
    errorPasswordsDoNotMatch: 'كلمتا السر غير متطابقتين.',
    errorGeneric: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    errorMissingIdentifier: 'يرجى تقديم بريد إلكتروني أو رقم هاتف صالح.',
    errorOtpIncomplete: 'الرجاء إدخال الرمز المكون من 6 أرقام بالكامل.',
    errorSavingProfile: 'تعذر حفظ المعلومات الإضافية.',
    registrationSuccess: 'تم التسجيل بنجاح! يرجى التحقق من حسابك.',
    verificationSuccess: 'تم التحقق بنجاح!',
    codeVerifiedSuccess: 'تم التحقق من الرمز بنجاح!',
    profileSavedSuccess: 'تم حفظ معلومات الملف الشخصي!',
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
    feedback: "قيمنا",
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
    deleteSessionTitle: "حذف جلسة المحادثة",
    deleteSessionDescription: "هل أنت متأكد أنك تريد حذف '{title}' بشكل دائم؟",
    deleteConfirm: "نعم، احذف",
    you: "أنت",
    assistantName: "المساعد الذكي",
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
        quote: "الشفافية والكفاءة التي توفرها هذه الشبكة جديرة بالثناء. إنها تبسط الالتزام بقوانين المشتريات الحكومية. الشفافية والكفاءة التي توفرها هذه الشبكة جديرة بالثناء. إنها تبسط الالتزام بقوانين المشتريات الحكومية. الشفافية والكفاءة التي توفرها هذه الشبكة جديرة بالثناء. إنها تبسط الالتزام بقوانين المشتريات الحكومية. الشفافية والكفاءة التي توفرها هذه الشبكة جديرة بالثناء. إنها تبسط الالتزام بقوانين المشتريات الحكومية."
      },
      person6: {
        name: "ليلى القحطاني",
        title: "محللة مالية، قسم المشتريات",
        quote: "أدوات الحاسبة دقيقة وتغطي جميع احتياجاتنا، من النسب المئوية إلى حسابات التواريخ المفصلة لتخطيط المشاريع."
      },
      person7: {
        name: "عمر يوسف",
        title: "كبير المشترين، الخدمات البلدية",
        quote: " كان العثور على بنود محددة في اللوائح مهمة شاقة في السابق. البحث الذكي والمساعد الاصطناعي جعلا الأمر سهلاً وسريعًا بشكل ملحوظ. موصى به بشدة!  كان العثور على بنود محددة في اللوائح مهمة شاقة في السابق. البحث الذكي والمساعد الاصطناعي جعلا الأمر سهلاً وسريعًا بشكل ملحوظ. موصى به بشدة! كان العثور على بنود محددة في اللوائح مهمة شاقة في السابق. البحث الذكي والمساعد الاصطناعي جعلا الأمر سهلاً وسريعًا بشكل ملحوظ. موصى به بشدة!"
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
    contact: {
      title: 'تواصل معنا',
      description: 'يسعدنا تواصلكم معنا. يرجى تعبئة النموذج وسنرد عليكم في أقرب وقت.',
      form: {
        name: 'الاسم',
        namePlaceholder: 'أدخل الاسم',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'أدخل بريدك الالكتروني',
        message: 'الرسالة',
        messagePlaceholder: 'فيما ترغب أن نساعدك',
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
    },
    topBarPlaceholder: 'ابحث عن...',
    filterPlaceholder: 'تصفية حسب',
    startSearchPrompt: {
      title: 'ابدأ البحث',
      description: 'أدخل استعلامًا في الشريط أعلاه للعثور على المواد ذات الصلة.'
    }
  },
  admin: {
    // --- NEW ADMIN TRANSLATIONS ---
    sidebar: {
      analytics: 'الأحصائيات',
      userManagement: 'إدارة المستخدمين',
      feedbackManagement: 'إدارة التقييم',
      contactMessages: 'رسائل التواصل',
      generalSettings: 'الإعدادات العامة',
      help: 'المساعدة',
      logout: 'تسجيل الخروج'
    },
    analytics: {
      title: 'الأحصائيات',
      visits: 'عدد الزيارات',
      users: 'عدد المستخدمين',
      mostVisited: 'الصفحة الأكثر زيارة',
      actions: 'الأفعال',
      clicks: 'الضغطات على الموقع',
      toolUsage: 'استخدام الأدوات',
      communication: 'التواصل',
      feedback: 'تسجيل تعليق',
      userTypes: 'نوع المستخدمين',
      guests: 'ضيوف',
      registered: 'مسجلين',
      weeklyVisits: 'الزيارات الأسبوعية',
      errorLoading: 'فشل تحميل بيانات التحليلات. يرجى المحاولة مرة أخرى لاحقًا.'
    },
    contact: {
      title: 'رسائل التواصل',
      searchPlaceholder: 'ابحث بالاسم أو البريد...',
      filterByStatus: 'تصفية حسب الحالة',
      sortBy: 'ترتيب حسب',
      date: 'التاريخ',
      name: 'الاسم',
      direction: 'الاتجاه',
      desc: 'تنازلي',
      asc: 'تصاعدي',
      statuses: {
        new: 'الجديدة',
        read: 'قيد المعالجة',
        archived: 'المؤرشفة',
        all: 'الكل'
      },
      dialog: {
        title: 'رسالة تواصل من: {name}',
        receivedAt: 'تم الاستلام في {date}',
        replyViaEmail: 'الرد عبر البريد الإلكتروني',
        markAsProcessing: 'وضع كقيد المعالجة',
        archive: 'أرشفة',
        moveToNew: 'نقل إلى جديد',
        markAsNew: 'وضع كجديد'
      },
      table: {
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        messagePreview: 'الرسالة (معاينة)',
        status: 'الحالة',
        submittedAt: 'تاريخ الإرسال',
        actions: 'الإجراءات'
      }
    },
    feedback: {
      title: 'إدارة التقييمات',
      searchPlaceholder: 'ابحث بالمستخدم أو التعليق...',
      sortBy: 'ترتيب حسب',
      date: 'التاريخ',
      rating: 'التقييم',
      direction: 'الاتجاه',
      desc: 'تنازلي',
      asc: 'تصاعدي',
      noReviews: 'لم يتم العثور على تقييمات لهذا الفلتر.',
      statuses: {
        pending: 'قيد المراجعة',
        approved: 'الموافق عليها',
        archived: 'المؤرشفة',
        all: 'الكل'
      },
      card: {
        approved: 'موافق عليه',
        archived: 'مؤرشف',
        pending: 'قيد المراجعة'
      },
      dialog: {
        noComment: 'لا يوجد تعليق.',
        userDisplaySettings: 'إعدادات العرض التي اختارها المستخدم:',
        showName: 'إظهار الاسم',
        showJobTitle: 'إظهار المسمى الوظيفي',
        showProfilePicture: 'إظهار صورة الملف الشخصي',
        showWorkplace: 'إظهار جهة العمل',
        archive: 'أرشفة',
        moveToPending: 'نقل إلى قيد المراجعة',
        approve: 'موافقة'
      }
    },
    users: {
      title: 'المستخدمين',
      searchPlaceholder: 'ابحث...',
      filter: 'تصفية',
      sort: 'ترتيب حسب',
      addUser: 'إضافة مستخدم',
      status: 'الحالة',
      role: 'الدور',
      all: 'الكل',
      active: 'نشط',
      suspended: 'موقوف',
      dateCreated: 'تاريخ الإنشاء',
      fullName: 'الاسم الكامل',
      direction: 'الاتجاه',
      desc: 'تنازلي',
      asc: 'تصاعدي',
      noUsersMatch: 'لا يوجد مستخدمون يطابقون عوامل التصفية الحالية.',
      table: {
        name: 'الأسم',
        status: 'الحالة',
        emailPhone: 'البريد / الهاتف',
        role: 'الدور'
      },
      addDialog: {
        title: 'إضافة مستخدم جديد',
        description: 'أدخل تفاصيل المستخدم الجديد لإنشاء حساب له.',
        fullName: 'الاسم الكامل',
        fullNameRequired: 'الاسم الكامل مطلوب',
        phoneNumber: 'رقم الهاتف',
        phoneNumberRequired: 'رقم الهاتف مطلوب',
        emailOptional: 'البريد الإلكتروني (اختياري)',
        password: 'كلمة المرور',
        passwordRequired: 'كلمة المرور مطلوبة',
        role: 'الدور',
        roleRequired: 'الدور مطلوب',
        selectRole: 'اختر دورًا',
        jobTitleOptional: 'المسمى الوظيفي (اختياري)',
        cancel: 'إلغاء',
        createUser: 'إنشاء مستخدم',
        creatingUser: 'جاري إنشاء المستخدم...'
      },
      editDialog: {
        accountStatus: 'حالة الحساب',
        role: 'الدور',
        permissions: 'الصلاحيات',
        userPermissions: 'صلاحيات المستخدم',
        adminPermissions: 'صلاحيات المشرف',
        nonAdminNote: 'لا يمكن تعيين صلاحيات المشرف إلا للمستخدمين الذين لديهم دور "Admin".',
        deleteUser: 'حذف المستخدم',
        saveChanges: 'حفظ التغييرات',
        saving: 'جاري الحفظ...'
      },
      permissionToggle: {
        inherit: 'وراثة',
        allow: 'سماح',
        deny: 'رفض'
      },
      confirmDialog: {
        title: 'حذف المستخدم',
        description: 'سيؤدي هذا إلى حذف حساب {name} بشكل دائم.',
        confirm: 'نعم، احذف',
        deleting: 'جاري الحذف...',
        cancel: 'إلغاء'
      },
    },
    settings: {
      title: 'الإعدادات العامة',
      save: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',
      guestTitle: 'صلاحيات المستخدم الضيف',
      guestDescription: 'تحكم في ما يمكن للزوار المجهولين الوصول إليه وحدود استخدامهم.',
      registeredTitle: 'صلاحيات المستخدم المسجل',
      registeredDescription: 'قم بتعيين الوصول والحدود الافتراضية لجميع المستخدمين المسجلين الدخول.',
      adminTitle: 'صلاحيات المشرف الافتراضية',
      adminDescription: 'قم بتعيين الصلاحيات الافتراضية لجميع المسؤولين (لا يتأثر المشرفون الخارقون).',
      featureAccess: 'الوصول إلى الميزات',
      usageLimits: 'حدود الاستخدام (يوميًا)',
      usageLimitsUnlimited: 'حدود الاستخدام (يوميًا، -1 لغير محدود)',
      adminPanelAccess: 'الوصول إلى لوحة الإدارة',
      unlimitedPlaceholder: '-1 لغير محدود'
    }
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
    mainSubtitle: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى.', // Placeholder subtitle
    tabs: {
      numericalValues: 'القيم الحسابية',
      dates: 'التواريخ',
      weightedPercentage: 'النسبة الموزونة',
    },
    weighted: {
      title: 'حاسبة النسبة الموزونة',
      technicalWeight: 'نسبة التقييم الفني',
      financialWeight: 'نسبة العرض المالي',
      competitorOffers: 'عروض المتنافسين',
      addCompetitor: 'اضافة منافس',
      competitorName: 'أسم المنافس',
      technicalScore: 'التقييم الفني',
      financialOffer: 'العرض المالي (بالريال)',
      competitorPlaceholder: 'اكتب أسم المنافس',
      scorePlaceholder: 'أدخل الرقم',
      offerPlaceholder: 'أدخل الرقم',
      results: {
        title: 'نتائج المنافسة',
        rank: 'الترتيب',
        competitorName: 'أسم المنافس',
        weightedScore: 'النسبة الموزونة',
        anotherCompetition: 'منافسة أخرى'
      },
      validation: {
        allFieldsRequired: 'يرجى ملء جميع الحقول لكل منافس.',
        technicalScoreRange: "التقييم الفني لـ '{name}' يجب أن يكون بين 0 و 100.",
        financialOfferPositive: "العرض المالي لـ '{name}' يجب أن يكون رقمًا موجبًا."
      }
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
        gregorianResultLabel: 'التاريخ الميلادي المتوقع',
        hijriResultLabel: 'التاريخ الهجري المتوقع',
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
      },
      placeholder: { // You might want to create a sub-object for placeholders if you have more
        gregorian: 'س س س س / ش ش / ي ي (ميلادي)',
        hijri: 'س س س س / ش ش / ي ي (هجري)'
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
      reportTitle: 'تقرير المنافسة',
      basicInfo: 'المعلومات الأساسية',
      timelineTitle: 'الجدول الزمني ({duration} يوم)',
      referencedArticles: 'المواد المرجعية',
      articleNumbers: 'أرقام المواد',
      articleNumber: 'المادة {number}',
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
    error: 'حدث خطأ أثناء معالجة طلبك',
    calculating: 'جاري الحساب...',
    form: {
      title: 'حاسبة نوع المنافسة',
      description: 'أدخل تفاصيل المشروع لتحديد نوع المنافسة المناسب',
      workType: 'نوع العمل',
      budget: 'المبلغ (بالريال)',
      startDate: 'تاريخ البدء',
      projectDuration: 'مدة المشروع (بالأشهر)',
      selectWorkType: 'اختر نوع العمل',
      enterBudget: 'أدخل مبلغ المشروع',
      enterDuration: 'أدخل مدة المشروع بالأشهر'
    },
  },
  dashboard: {
    header: {
      profile: 'الملف الشخصي',
      adminDashboard: 'لوحة التحكم للمشرف',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول'
    },
    sidebar: {
      settings: 'الاعدادات',
      help: 'المساعدة',
      logout: 'تسجيل خروج'
    }
  },
  pagination: {
    showingResults: 'عرض {start} إلى {end} من {total} نتائج',
    previous: 'السابق',
    next: 'التالي'
  },
  settings: {
    title: 'الإعدادات',
    jobTitlePlaceholder: 'لم يتم تقديم مسمى وظيفي',
    uploadAction: 'تحميل صورة',
    uploading: 'جاري التحميل...',
    basicInfo: 'المعلومات الاساسية',
    name: 'الاسم',
    email: 'البريد الالكتروني',
    phone: 'رقم الهاتف',
    additionalInfo: 'المعلومات الاضافية',
    workplace: 'جهة العمل',
    jobTitle: 'المسمى الوظيفي',
    linkedin: 'حساب لينكدإن',
    save: 'حفظ',
    changePassword: 'تغيير كلمة السر',
    changeLanguage: 'تغيير اللغة',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    toasts: {
      fileTooLarge: 'الملف كبير جدًا. الحجم الأقصى 5 ميجابايت.',
      avatarSuccess: 'تم تحديث الصورة الشخصية بنجاح!',
      avatarError: 'فشل تحميل الصورة.',
      profileSuccess: 'تم تحديث الملف الشخصي بنجاح!',
      profileError: 'فشل تحديث الملف الشخصي.',
      passwordLengthError: 'يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.',
      passwordMismatchError: 'كلمتا المرور الجديدتان غير متطابقتين.',
      passwordSuccess: 'تم تحديث كلمة المرور بنجاح!',
      passwordError: 'فشل تغيير كلمة المرور.'
    }
  },
  feedback: {
    title: 'التقييم والملاحظات',
    subtitle: 'نحن نقدر رأيك! يرجى أخذ لحظة لتقييم تجربتك.',
    form: {
      rating: 'التقييم',
      comments: 'ملاحظاتك',
      commentsPlaceholder: 'أكتب ملاحظاتك هنا',
      settings: 'الإعدادت',
      showName: 'إظهار الاسم',
      showJobTitle: 'إظهار المسمى الوظيفي',
      showProfilePicture: 'إظهار صورة البروفايل',
      showWorkplace: 'إظهار جهة العمل',
      submit: 'إرسال التقييم',
      submitting: 'جاري الإرسال...'
    },
    toasts: {
      ratingRequired: 'يرجى تحديد تقييم قبل الإرسال.',
      success: 'شكرا لملاحظاتك!',
      error: 'فشل إرسال التقييم.'
    }
  },
};