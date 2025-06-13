// src/config/i18n/translations/en.ts
export const en = {
  common: {
    search: 'Search',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    comingSoon: 'Coming Soon',
    downloading: 'Downloading...',
    sending: 'Sending...',
    retry: 'Try Again',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
  },
  navigation: {
    home: 'Home',
    chat: 'Chat',
    library: 'Library',
    search: 'Search',
    calculator: 'Calculator',
    admin: 'Admin',
    correction: 'Correction', // Corrected from 'correction' to 'Correction' for consistency
    templates: 'Templates',
    journey: 'Learning Journey',
    tenderMapping: 'Tender Mapping',
    // New Nav Keys from Design
    userReviews: "Reviews",
    faq: "FAQ",
    whatSetsUsApart: "Features", // Or "What Sets Us Apart"
    solutions: "Solutions",
  },
  procurement: {
    systemName: 'Government Procurement System',
    communityName: 'Government Procurement Network', // Updated to match design logo text "شبكة المشتريات الحكومية"
    searchPlaceholder: 'Search regulations...',
  },
  chat: {
    // Welcome Section
    welcome: {
      title: "Smart Government Procurement Assistant",
      description: "Ask your questions about the Government Procurement System",
      getStarted: "Get Started",
    },
    // Chat Interface
    placeholder: "Type your message here...",
    send: "Send",
    sending: "Sending...",
    // Message Options
    saudiAccent: "Saudi Accent",
    reasoning: "Logical Reasoning",
    // Status Messages
    loading: "Loading...",
    error: "An error occurred",
    connecting: "Connecting...",
    reconnecting: "Reconnecting...",
    // Resources and Sources
    sources: "Sources",
    article: "Article",
    section: "Section",
    chapter: "Chapter",
    content: "Content",
    summary: "Summary",
    // Suggested Questions
    suggestions: {
      title: "Or choose from suggested questions",
      first: "What are the pre-qualification requirements for government tenders?",
      second: "How are bids evaluated in government tenders?",
      third: "What is the validity period of the final guarantee?"
    },
    // Error Messages
    errorMessages: {
      failed: "Failed to send message",
      network: "Network error occurred",
      retry: "Please try again"
    }
  },
  library: {
    title: 'Library',
    subtitle: 'Browse and search documents',
    // Navigation
    root: 'Library Root',
    goBack: 'Back to Parent Folder',
    // Actions
    downloadButton: 'Download',
    downloading: 'Downloading...',
    openButton: 'Open',
    viewButton: 'View',
    viewing: 'Opening...',
    // Search
    searchPlaceholder: 'Search for files and folders...',
    deepSearch: 'Deep search (include subfolders)',
    deepSearchTooltip: 'When enabled, search will look through all subfolders',
    // Status messages
    loading: 'Loading...',
    error: 'An error occurred while loading the content',
    viewError: 'Error viewing file',
    downloadError: 'Error downloading file',
    noResults: 'No files or folders found',
    emptyFolder: 'This folder is empty',
    // File types
    folder: 'Folder',
    file: 'File',
    // File information
    lastModified: 'Last modified',
    fileSize: 'File size',
    // Tooltips
    downloadTooltip: 'Download this file',
    viewTooltip: 'View this file',
    openFolderTooltip: 'Open this folder'
  },
  // --- START: NEW AND MERGED LANDING PAGE TRANSLATIONS ---
  landingPage: {
    hero: {
      title: 'Everything Related to Government Procurement in One Place', // New design title
      description: 'A platform where we place what matters to government procurement employees. It is an unofficial platform but a simple effort from your colleagues. We hope to provide the intended benefit through it, but it does not substitute in any way for referring to the system, regulations, and related circulars.', // New design description
      startNowButton: 'Start Now', // For the main header CTA
      aiAssistantTitle: 'Use the most advanced AI assistant now',
      aiAssistantPlaceholder: 'How can I help you?',
      trustedBy: 'Used and loved by people in innovative companies',
      // Old keys, kept for potential reuse or if other components still use them
      subtitle: 'Government Procurement & Competition System', // Old, can be removed if not used
      cta: 'Get Started', // Old, replaced by startNowButton for header
      learnMore: 'Learn More', // Old, might be used for other buttons
    },
    search: { // Old section, can be removed if not used
      placeholder: 'Search regulations...',
    },
    solutionsTitle: 'Our Solutions', // New title for the features section
    solutions: {
      aiAssistant: { // Maps to "المساعد الذكي"
        title: 'Smart Assistant',
        description: 'Accurate answers for your government procurement inquiries.',
      },
      calculator: { // Maps to "الحاسبة"
        title: 'Calculator',
        description: 'Comprehensive suite for percentage and date calculations.', // Adjusted description to be more accurate
      },
      textCorrection: { // Maps to "معالج النصوص"
        title: 'Text Processor',
        description: 'Correct spelling errors and convert numbers to text automatically.',
      },
      procurementSystem: { // Maps to "نظام الطرح" (Your feature 4)
        title: 'Procurement System',
        description: 'Generate full reports and roadmaps for competitions.',
      },
      advancedSearch: { // Maps to "البحث المتقدم" (Your feature "Smart AI assistant which answer user query")
        title: 'Advanced Search & AI Query', // Merged concept
        description: 'Quick and accurate access to system and regulation documents, with AI-powered answers.',
      },
    },
    featuresTitle: 'What Sets Us Apart', // For the sticky cards section title
    featuresDescription: 'We believe in clarity, work efficiently, and build supply relationships based on trust and ease.',
    features: { // For sticky cards content
      aiAssistant: { // First sticky card
        title: "Ask... and your answer is ready!",
        description: "The smart procurement assistant is with you for every inquiry, with ease and speed.",
        readyToHelp: "Welcome, I am at your service",
        prompt: "How can I help you?",
      },
      calculator: { // Second sticky card
        title: "Calculate it simply... Plan with confidence",
        description: "An advanced calculator that gathers all your needs at the click of a button.",
      },
      everythingInOnePlace: { // Third sticky card
        title: "Everything you need... in one place",
        description: "It gathers all the details for you, and guides you step-by-step towards the best decisions.",
      }
    },
    testimonialsTitle: 'User Reviews',
    testimonials: {
      person1: {
        name: "Ali Hassan",
        title: "Procurement Manager, Ministry of Infrastructure",
        quote: "This platform has revolutionized how we handle government tenders. The AI assistant provides quick, accurate answers based on regulations, saving us countless hours."
      },
      person2: {
        name: "Fatima Al-Salem",
        title: "Contract Specialist, Health Authority",
        quote: "The text correction and enhancement tool is fantastic for ensuring our official documents are flawless. The date calculator is also a daily essential."
      },
      person3: {
        name: "Khalid Ibrahim",
        title: "Purchasing Officer, Education Directorate",
        quote: "Generating full competition reports with timelines is now incredibly straightforward. The ability to edit timelines is a huge plus for managing project changes."
      },
      person4: {
        name: "Noura Abdullah",
        title: "Junior Procurement Officer",
        quote: "As someone new to the field, the learning journey and the smart assistant have been invaluable in understanding complex procurement systems and regulations."
      },
      person5: {
        name: "Saad Al-Mutairi",
        title: "Head of Tenders Committee",
        quote: "The transparency and efficiency brought by this network are commendable. It simplifies the adherence to government procurement laws."
      },
      person6: {
        name: "Layla Al-Qahtani",
        title: "Financial Analyst, Procurement Department",
        quote: "The calculation tools are precise and cover all our needs, from percentages to detailed date computations for project planning."
      },
      person7: {
        name: "Omar Youssef",
        title: "Senior Buyer, Municipal Services",
        quote: "Finding specific clauses in regulations used to be a daunting task. The smart search and AI assistant have made it remarkably easy and fast. Highly recommended!"
      },
      person8: {
        name: "Aisha Bakr",
        title: "Legal Advisor, Procurement Division",
        quote: "The platform's focus on compliance with Saudi Arabian procurement laws is evident. The AI's understanding of these documents is impressive."
      },
      person9: {
        name: "Fahd Al-Ghamdi",
        title: "Project Coordinator",
        quote: "Managing competition roadmaps and requirements has never been smoother. This tool keeps everything organized and on track."
      },
      person10: {
        name: "Reem Al-Jasser",
        title: "Procurement Intern",
        quote: "A great learning resource and a practical toolset. It's helped me get up to speed much faster than I expected."
      }
    },
    faqTitle: 'Frequently Asked Questions',
    faq: {
      q1: {
        question: "Can I use the calculator to calculate all types of costs?",
        answer: "Yes, the calculator is designed to cover various cost scenarios in government procurement."
      },
      q2: {
        question: "How does the procurement assistant help me choose the right supplier?",
        answer: "The assistant provides analysis based on your criteria and suggests the most suitable suppliers based on historical data and performance evaluations."
      },
      q3: {
        question: "What types of contracts does the system support?",
        answer: "The system supports a wide range of contract types compliant with Saudi government procurement regulations."
      },
      q4: {
        question: "How do I start my journey with the procurement system?",
        answer: "To start using the procurement system, first create an account through our electronic portal in easy and quick steps. After logging in, you will find an interface specifically designed to simplify your purchasing journey. You can use the smart procurement assistant that will guide you step-by-step, starting from identifying your needs, through choosing the most suitable supplier, to completing the order and approving it electronically."
      },
      q5: {
        question: "Is the system compliant with Saudi government procurement regulations?",
        answer: "Certainly, the system is designed to be fully compliant with all regulations and procedures related to government procurement in the Kingdom of Saudi Arabia."
      }
    },
    stats: { // Old section, can be removed if not used by any other part
      articles: 'System Articles',
      users: 'Active Users',
      accuracy: 'Answer Accuracy',
    },
    contact: { // Old section, can be removed if not used
      title: 'Contact Us',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully',
        error: 'Failed to send message',
        required: 'All fields are required',
        invalidEmail: 'Please enter a valid email'
      }
    },
    footer: {
      loginButton: "Login Now",
      copyright: "Copyright © {year} . All rights reserved.",
    }
  },
  // --- END: NEW AND MERGED LANDING PAGE TRANSLATIONS ---
  search: {
    pageTitle: 'Search Articles',
    placeholder: 'Enter your search keywords...',
    filterByType: 'Filter by Type',
    types: {
      both: 'All Resources',
      system: 'Government Tenders and Procurement System',
      regulation: 'Implementing Regulations'
    },
    noResults: 'No results found for your search.',
    tryAgain: 'Please try different keywords or filters.',
    errorMessage: 'Failed to fetch search results. Please try again.',
    article: 'Article',
    chapter: 'Chapter',
    section: 'Section',
    content: 'Content',
    summary: 'Summary',
    keywords: 'Keywords',
    references: 'References',
    searching: 'Searching...',
    loadingMore: 'Loading more results...',
    filters: {
      title: 'Search Filters',
      clearAll: 'Clear all filters',
      apply: 'Apply Filters'
    }
  },
  admin: {
    title: 'Admin Dashboard',
    login: {
      title: 'Admin Login',
      username: 'Username',
      password: 'Password',
      submit: 'Login',
      error: 'Invalid credentials'
    },
    tabs: {
      contacts: 'Contacts',
      emails: 'Emails'
    },
    contacts: {
      title: 'Contact Submissions',
      date: 'Date',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      export: 'Export CSV',
      noData: 'No contact submissions found',
      error: 'Failed to load contacts'
    },
    emails: {
      title: 'Email Records',
      date: 'Date',
      recipient: 'Recipient',
      subject: 'Subject',
      body: 'Message',
      attachment: 'Attachment',
      export: 'Export CSV',
      noData: 'No email records found',
      error: 'Failed to load emails'
    },
    logout: 'Logout'
  },
  correction: {
    title: 'Text Processor', // Updated title
    subtitlePlaceholder: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed', // Add this key
    inputLabel: 'Enter Text to Correct',
    inputPlaceholder: 'Enter the text you want to edit', // Updated placeholder
    outputLabel: 'Corrected Text',
    correct: 'Correct Text',
    correcting: 'Correcting...',
    enhancing: 'Enhancing...', // Add this key
    error: 'An error occurred while processing the text.', // Updated for generic use
    success: 'Text corrected successfully.',
    enhanceSuccess: 'Text enhanced successfully.', // Add this key
    copiedToClipboard: 'Copied to clipboard!', // Add this key
    copyError: 'Failed to copy.', // Add this key
    copy: 'Copy', // Add this key
    // New keys for the new design
    tabTitleCorrect: 'Text Correction',
    tabTitleTafqit: 'Number to Words',
    enhanceTextButton: 'Enhance Text',
    correctTextButton: 'Correct Text',
    reEnterButton: 'Re-enter Text',
  },
  calculator: {
    mainTitle: 'Explore All Calculation Tools',
    mainSubtitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed',
    tabs: {
      numericalValues: 'Numerical Values', // New main tab
      dates: 'Dates',                   // New main tab
      // Old tabs - kept for reference or if any sub-component still uses them indirectly,
      // but the main UI now uses the two tabs above.
      percentage: 'Percentage',
      vat: 'VAT',
      amount: 'Amount with Percentage',
      tafqit: 'Numbers to Words'
    },
    selectNumericalType: 'Select Numerical Calculation Type',
    selectDateType: 'Select Date Calculation Type',
    selectCalculation: 'Select operation type', // Generic placeholder for select

    subTabs: { // For the dropdowns within main tabs
      percentageChange: 'Percentage Change',
      vatCalculation: 'VAT Calculation',
      amountWithPercentage: 'Amount with Percentage',
      dateConversion: 'Date Conversion',
      dateDifference: 'Date Difference',
      dateDuration: 'Date Duration & End Date',
    },

    // Percentage Calculator (Image 1)
    percentage: {
      title: 'Percentage Calculator', // Old title, kept if used in breadcrumbs or elsewhere
      baseAmount: 'Base Amount',
      newAmount: 'New Amount',
      calculate: 'Calculate Percentage',
      resultLabel: 'Value', // "القيمة" from design image
      result: 'Result' // Generic result if needed
    },

    // VAT Calculator (Image 2)
    vat: {
      title: 'VAT Calculator',
      operation: {
        label: 'Operation Type',
        total: 'Calculate Net & VAT from Total (Incl. VAT)', // Clarified based on common usage
        extract: 'Calculate Total (Incl. VAT) from Net Amount', // Clarified
        amount: 'Calculate VAT Amount from Net Amount' // Clarified
      },
      selectOperationPlaceholder: 'Select VAT operation',
      amountInputLabel: 'Amount', // Generic label for amount input
      rateLabel: 'VAT Rate',
      calculate: 'Calculate VAT',
      results: {
        netAmountLabel: 'Net Amount',       // "القيمة" in design
        vatAmountLabel: 'VAT Value',       // "قيمة الضريبة" in design
        totalAmountLabel: 'Total Amount',   // "المبلغ الكلي" in design
        net: 'Net Amount', // Old keys, kept for compatibility if used
        vat: 'VAT Amount',
        total: 'Total Amount'
      }
    },

    // Amount with Percentage (Image 3)
    amountPercentage: {
      title: 'Amount with Percentage Calculator',
      amountLabel: 'Amount', // "المبلغ"
      percentageLabel: 'Percentage', // "النسبة"
      calculate: 'Calculate',
      results: {
        originalAmountLabel: 'Original Value',   // "القيمة" in design
        adjustmentAmountLabel: 'Adjustment Value',// "قيمة التعديل" in design
        finalAmountLabel: 'Final Value',        // "القيمة النهائية" in design
        original: 'Original Amount', // Old keys
        adjustment: 'Adjustment Amount',
        final: 'Final Amount'
      }
    },

    // Date Calculators
    date: {
      // Date Conversion (Image 4)
      conversion: {
        title: 'Date Conversion', // Old title
        gregorianLabel: 'Gregorian Date', // Old label
        hijriLabel: 'Hijri Date', // Old label
        inputLabelGregorian: 'Gregorian Date', // New: "التاريخ بالميلادي"
        inputLabelHijri: 'Hijri Date',       // New: "التاريخ بالهجري"
        convertToHijri: 'Convert to Hijri',
        convertToGregorian: 'Convert to Gregorian',
        convertActionLabel: 'Convert Dates', // ARIA label for swap button
      },
      // Date Difference (Image 5)
      difference: {
        title: 'Calculate Date Difference',
        start: 'Start Date',
        end: 'End Date',
        calculate: 'Calculate Difference',
        result: 'Date Difference', // Old title for result
        // years, months, days are now under units
      },
      // Date Duration (Image 6)
      duration: {
        title: 'Calculate End Date',
        start: 'Start Date', // Label for start date input
        duration: { // Group label for duration inputs
          label: 'Duration',
          years: 'Years', // Placeholder for years input
          months: 'Months', // Placeholder for months input
          days: 'Days',   // Placeholder for days input
        },
        calculate: 'Calculate End Date',
        resultLabel: 'End Date', // Label for the result display
        result: 'End Date', // Old key
        resultFormat: '{gregorian} (Hijri: {hijri})', // Format for displaying result
        separator: ' and ',
        validation: { // Validation messages
          required: 'At least one duration field (days, months, or years) is required'
        }
      },
      hijriDuration: { // Old, might be merged or removed if not used
        title: 'Calculate Duration in Hijri Calendar',
        start: 'Start Date (Hijri)',
        calculate: 'Calculate End Date',
        result: 'Hijri End Date',
        placeholder: 'Enter date in format: YYYY/MM/DD'
      },
      // Units for display (used by difference and duration results)
      units: {
        year: 'year',
        years: 'years',
        month: 'month',
        months: 'months',
        day: 'day',
        days: 'days'
      },
      // Hijri Specific (shared)
      hijri: { // Old grouping, individual labels preferred now
        label: 'Hijri Date',
        current: 'Current Hijri Date',
        placeholder: 'YYYY/MM/DD', // General Hijri placeholder
        result: 'Gregorian Date'
      },
      gregorian: { // Old grouping
        label: 'Gregorian Date',
        result: 'Hijri Date'
      }
    },

    // Tafqit (Numbers to Words) - Not on this page anymore, but keeping keys
    tafqit: {
      title: 'Numbers to Words',
      amount: 'Amount',
      language: 'Language',
      languages: {
        arabic: 'Arabic',
        english: 'English'
      },
      convert: 'Convert to Words',
      result: 'Result',
      placeholder: 'Enter amount',
      resultPlaceholder: 'Result in words',
    },

    // Common strings for all calculators
    common: {
      enterAmountPlaceholder: 'Enter amount',
      enterPercentagePlaceholder: 'Enter percentage',
      noResultYet: 'Enter values to calculate',
      reset: 'Reset', // For reset buttons
      calculate: 'Calculate', // Generic calculate button if needed
      back: 'Back',
      validation: {
        required: 'This field is required',
        invalidDate: 'Invalid date',
        invalidNumber: 'Invalid number or zero base amount',
        endDateBeforeStart: 'End date must be after start date',
        positiveNumber: 'Number must be positive',
        selectBothDates: 'Please select both start and end dates',
        enterStartDate: 'Please enter start date',
        enterGregorian: 'Please enter Gregorian date',
        enterHijri: 'Please enter Hijri date',
        invalidHijriFormat: 'Invalid Hijri date format (YYYY/MM/DD)',
      }
    }
  },
  templates: {
    title: 'Document Templates',
    // Fields was 'placeholders' in ar.ts, changed to 'fields' for consistency
    fields: 'Required Fields', // Keep or change based on preference
    generate: 'Generate Document',
    back: 'Back to Templates', // This was new
    generation: {
      success: 'Document generated successfully',
      error: 'Error generating document'
    },
    download: {
      docx: 'Download DOCX',
      pdf: 'Download PDF',
      success: 'Document downloaded successfully',
      error: 'Error downloading document'
    },
    email: {
      button: 'Send via Email',
      title: 'Send Document',
      recipient: 'Recipient Email',
      subject: 'Subject',
      body: 'Message',
      send: 'Send Email',
      success: 'Email sent successfully',
      error: 'Error sending email'
    },
    // For solutions mapping if "نظام الطرح" relates to templates
     procurementSystem: {
        title: 'Tender System',
        description: 'A comprehensive collection of government procurement documents.'
    },
    autoCalculated: '(auto-calculated)' // For TemplateForm
  },
  journey: {
    title: 'Learning Journey',
    description: 'Step-by-step learning resources for procurement professionals',
    levels: 'Journey Levels',
    level: 'Level',
    resources: 'Resources',
    levelDescription: 'Level Description',
    noLevels: 'No journey levels found',
    noResources: 'No resources found for this level',
    back: 'Back to Levels',
    viewResource: 'View',
    downloadResource: 'Download',
    resourceDetails: 'Resource Details',
    size: 'Size',
    type: 'Type',
    created: 'Created',
    modified: 'Modified',
    loading: 'Loading...',
    error: 'An error occurred while loading data',
    yourProgress: 'Your Progress',
    previousLevel: 'Previous Level',
    nextLevel: 'Next Level',
    start: 'Start',
    continue: 'Continue',
    backToJourney: 'Back to Journey',
  },
  tenderMapping: {
    title: 'Tender Type Mapping',
    description: 'Find the most suitable tender type based on your project requirements',
    inputs: {
      title: 'Project Details',
      description: 'Select the appropriate options for your project',
      submit: 'Find Tender Type',
      reset: 'Reset Form'
    },
    results: {
      title: 'Recommended Tender Type',
      confidenceHigh: 'Strong Match',
      confidenceMedium: 'Moderate Match',
      confidenceLow: 'Weak Match',
      alternativesTitle: 'Alternative Options',
      attributes: 'Tender Attributes',
      noResult: 'No matching tender type found',
      tryAgain: 'Please try different options'
    },
    saveRule: {
      title: 'Save This Mapping',
      description: 'Save this configuration as a new rule for future reference',
      ruleName: 'Rule Name',
      submit: 'Save Rule',
      success: 'Rule saved successfully',
      error: 'Error saving rule'
    },
    loading: 'Finding the best tender type...',
    error: 'An error occurred while processing your request'
  },
};