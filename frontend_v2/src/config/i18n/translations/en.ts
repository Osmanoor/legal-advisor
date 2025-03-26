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
    correction: 'correction',
    templates: 'Templates',
    journey: 'Learning Journey',
    tenderMapping: 'Tender Mapping',
  },
  procurement: {
    systemName: 'Government Procurement System',
    communityName: 'Government Procurement Community',
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
  // New landing page translations
  landing: {
    hero: {
      title: 'Government Procurement Community',
      subtitle: 'Government Procurement & Competition System',
      description: 'A platform where we place what matters to government procurement employees. It is an unofficial platform but a simple effort from your colleagues. We hope to provide the intended benefit through it, but it does not substitute in any way for referring to the system, regulations, and related circulars.',
      cta: 'Get Started',
      learnMore: 'Learn More',
    },
    search: {
      placeholder: 'Search regulations...',
    },
    features: {
      search: {
        title: 'Advanced Search',
        description: 'Fast and easy search through regulations',
      },
      assistant: {
        title: 'Smart Assistant',
        description: 'Accurate answers for your procurement inquiries',
      },
      library: {
        title: 'Procurement Library',
        description: 'Comprehensive procurement document collection',
      },
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'How can I search the regulations?',
          answer: 'You can use the main search bar or browse through sections and chapters directly',
        },
        {
          question: 'Does this platform suffice as a substitute for referring to the system, regulations, and related circulars?',
          answer: 'No, the platform does not replace referring to the related systems from their official sources. What we provide is merely a helpful tool, nothing more.',
        },
        {
          question: 'How can I download the complete regulation?',
          answer: 'You can download the complete regulation from the procurement library section in PDF format',
        },
      ],
    },
    stats: {
      articles: 'System Articles',
      users: 'Active Users',
      accuracy: 'Answer Accuracy',
    },
    contact: {
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
    }
  },
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
    title: 'Text Correction Tool',
    inputLabel: 'Enter Text to Correct',
    inputPlaceholder: 'Type or paste your text here...',
    outputLabel: 'Corrected Text',
    correct: 'Correct Text',
    correcting: 'Correcting...',
    error: 'An error occurred while correcting the text.',
    success: 'Text corrected successfully.',
  },
  calculator: {
    title: 'Procurement Calculator Tools',
    tabs: {
      percentage: 'Percentage',
      vat: 'VAT',
      amount: 'Amount with Percentage',
      date: 'Dates',
      tafqit: 'Numbers to Words'
    },
    percentage: {
      title: 'Percentage Calculator',
      baseAmount: 'Base Amount',
      newAmount: 'New Amount',
      calculate: 'Calculate Percentage',
      result: 'Result'
    },
    vat: {
      title: 'VAT Calculator',
      operation: {
        label: 'Operation Type',
        total: 'Calculate Total with VAT',
        extract: 'Extract Original Amount from VAT',
        amount: 'Calculate VAT Amount'
      },
      amount: 'Amount',
      rate: 'VAT Rate',
      calculate: 'Calculate',
      results: {
        net: 'Net Amount',
        vat: 'VAT Amount',
        total: 'Total Amount'
      }
    },
    amountPercentage: {
      title: 'Amount with Percentage Calculator',
      amount: 'Amount',
      percentage: 'Percentage',
      calculate: 'Calculate',
      results: {
        original: 'Original Amount',
        adjustment: 'Adjustment Amount',
        final: 'Final Amount'
      }
    },
    date: {
      conversion: {
        title: 'Date Conversion'
      },
      gregorian: {
        label: 'Gregorian Date',
        convert: 'Convert to Hijri',
        result: 'Hijri Date'
      },
      hijri: {
        label: 'Hijri Date',
        convert: 'Convert to Gregorian',
        current: 'Current Hijri Date',
        placeholder: 'Example: 1445/07/29',
        result: 'Gregorian Date'
      },
      difference: {
        title: 'Calculate Date Difference',
        start: 'Start Date',
        end: 'End Date',
        calculate: 'Calculate Difference',
        years: 'Years',
        months: 'Months',
        days: 'Days',
        result: 'Date Difference'
      },
      duration: {
        title: 'Calculate End Date',
        start: 'Start Date',
        duration: {
          label: 'Duration',
          days: 'Days',
          months: 'Months',
          years: 'Years'
        },
        calculate: 'Calculate End Date',
        result: 'End Date',
        resultFormat: '{gregorian} (Hijri: {hijri})',
        separator: ' and ',
        validation: {
          required: 'At least one duration field (days, months, or years) is required'
        }
      },
      hijriDuration: {
        title: 'Calculate Duration in Hijri Calendar',
        start: 'Start Date (Hijri)',
        calculate: 'Calculate End Date',
        result: 'Hijri End Date',
        placeholder: 'Enter date in format: 1445/07/29'
      },
      units: {
        year: 'year',
        years: 'years',
        month: 'month',
        months: 'months',
        day: 'day',
        days: 'days'
      }
    },
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
      placeholder: 'Enter amount'
    },
    common: {
      validation: {
        required: 'This field is required',
        invalidDate: 'Invalid date',
        invalidNumber: 'Invalid number',
        endDateBeforeStart: 'End date must be after start date',
        positiveNumber: 'Number must be positive'
      },
      loading: 'Calculating...',
      error: 'An error occurred',
      reset: 'Reset',
      calculate: 'Calculate',
      back: 'Back'
    }
  },
  templates: {
    title: 'Document Templates',
    fields: 'Required Fields',
    generate: 'Generate Document',
    back: 'Back to Templates',
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
    }
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