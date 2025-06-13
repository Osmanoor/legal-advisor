// src/styles/theme/index.ts

// Helper to generate a green palette if needed, or define manually
const generateGreenShades = (baseHex: string) => {
  // This is a very simplistic generator.
  // For production, use a proper color palette generator or define shades manually.
  // Example: baseHex = #296436
  return {
    50: '#f0f7f1', // Lighter
    100: '#d9eadd',
    200: '#c2dfc9',
    300: '#abcfb5',
    400: '#94bf9f',
    500: '#7dafa2', // This might not be #51B749, adjust
    600: baseHex,   // #296436
    700: '#23532e', // Darker
    800: '#1d4225',
    900: '#17311d',
    DEFAULT: baseHex,
  };
};

export const theme = {
  colors: {
    // Brand Colors - NEW GREEN THEME
    primary: { // Main Dark Green
      light: '#A1DDA7', // Lighter shade for hover/accents if needed from #51B749
      DEFAULT: '#296436', // Base dark green from Hero section
      dark: '#1E4A27',  // Darker shade for hover/pressed states
      // Tailwind typical shades (approximated, adjust as needed)
      50: '#EAF7EC',
      100: '#D5EFDA',
      200: '#AADFAC',
      300: '#80CF7E',
      400: '#55BF50', // Closer to #51B749 for mid-tones
      500: '#3E8E48', // A good mid-green
      600: '#296436', // Your specified dark green
      700: '#21502B',
      800: '#193C20',
      900: '#102915',
    },
    cta: { // Call-to-action Green (brighter)
      DEFAULT: '#51B749',
      hover: '#46a040', // Slightly darker for hover
    },
    'logo-accent': '#2BB673', // Green from the logo accents

    // Backgrounds
    background: {
      body: '#FFFFFF', // Default white background
      section: '#FFFFFF', // For most sections
      'section-alt': '#F9F9FD', // For sections like calculator card background
      'hero-overlay': 'rgba(41, 100, 54, 0.8)', // Example for hero image overlay, if needed
      'feature-card': '#296436', // Background for the solution cards
      'faq-active': '#EDFFEC', // Background for active FAQ item
    },

    // Text Colors
    text: {
      'on-dark': '#FFFFFF', // White text on dark backgrounds (hero, feature cards)
      'on-dark-muted': '#E7E7E7', // Muted white text (hero subtitle)
      'on-light-header': '#000000', // Black for main headings on white
      'on-light-muted': '#4C5259',
      'on-light-body': '#2C3131', // Default body text (from testimonial name)
      'on-light-description': '#4C5259', // For descriptions below titles (e.g., solution cards)
      'on-light-subtle': '#706D79', // For less prominent text (e.g., "ما يميزنا" paragraph)
      'on-light-placeholder': '#A9A9A9', // For input placeholders
      'cta-text': '#FFFFFF', // Text on CTA buttons
      'subtle-on-dark': '#E7E7E7',
      'on-light-strong': '#000000', // For titles
      'on-light-faint': '#666F8D',  // For subtitles/placeholders
    },

    // Borders
    border: {
      DEFAULT: '#E3E3E3', // Default border (e.g., testimonial cards)
      subtle: 'rgba(0, 0, 0, 0.1)', // Lighter border (e.g., FAQ items)
      input: '#E3E6EA', // For prompt box input
      'cta-button': '#296436', // Border for the green CTA button in prompt box
      'faq-active': '#51B749', // Border for active FAQ item
    },

    // Semantic Colors (can be kept or adjusted based on new design specifics)
    success: {
      light: '#D1FAE5', // Tailwind green-100
      DEFAULT: '#10B981', // Tailwind green-500
      dark: '#047857',  // Tailwind green-700
    },
    warning: {
      light: '#FEF3C7', // Tailwind amber-100
      DEFAULT: '#F59E0B', // Tailwind amber-500
      dark: '#B45309',  // Tailwind amber-700
    },
    error: {
      light: '#FEE2E2', // Tailwind red-100
      DEFAULT: '#EF4444', // Tailwind red-500
      dark: '#B91C1C',  // Tailwind red-700
    },

    // Gray Scale (Can be simplified if not heavily used, or map to new design specifics)
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB', // Close to #E7E7E7 and #E3E6EA
      300: '#D1D5DB',
      400: '#9CA3AF', // Close to #A9A9A9
      500: '#6B7280', // Close to #706D79 and #626262
      600: '#4B5563', // Close to #4C5259
      700: '#374151',
      800: '#1F2937',
      900: '#111827', // Close to #000000 and #2C3131
    },
    tab: {
      inactiveBg: '#ECFFEA',
      activeBg: '#51B749', // Same as cta.DEFAULT
      inactiveText: '#000000',
      activeText: '#FFFFFF',
    },
    input: {
      text: '#000000',
      placeholder: '#666F8D',
      border: '#E3E6EA', // from CSS for select
      shadow: '0px 1px 3px rgba(25, 33, 61, 0.1)', // from CSS for select
    },
    result: {
      background: '#ECFFEA',
      valueText: '#51B749', // cta.DEFAULT
      labelText: '#000000',
      divider: '#BFE3BC', // from Image 2 line
    },
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  spacing: { // Keep your existing spacing, or adjust if design has a new rhythm
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px (gap in footer nav, FAQ padding)
    3: '0.75rem',     // 12px (testimonial avatar gap)
    4: '1rem',        // 16px (FAQ padding, prompt box items gap)
    5: '1.25rem',
    6: '1.5rem',      // 24px (testimonial/FAQ column gap)
    7: '1.75rem',
    8: '2rem',        // 32px (solution card parent padding, "ما يميزنا" content gap)
    10: '2.5rem',     // 40px (hero top/bottom padding, testimonial section title margin)
    12: '3rem',       // 48px (hero main title bottom margin, "ما يميزنا" section padding)
    15: '3.75rem',    // 60px (header left/right padding)
    16: '4rem',
    20: '5rem',
    24: '6rem',        // 96px
    30: '7.5rem',      // 120px ("حلولنا" title bottom margin, testimonial column outer padding)
    // Add more as needed from CSS, e.g., top: 733px -> approx spacing-184 if 1 unit is 4px
    // It's better to use relative/percentage layouts or flex/grid for large positioning
  },

  fontFamily: {
    // These will reference the CSS variables defined in base.css
    sans: ['var(--font-primary-latin)', 'ui-sans-serif', 'system-ui'],
    arabic: ['var(--font-primary-arabic)', 'ui-sans-serif', 'system-ui'],
    // Direct font names for Tailwind if CSS variables aren't preferred for this
    // inter: ['Inter', 'sans-serif'],
    // 'montserrat-arabic': ['Montserrat-Arabic', 'sans-serif'],
  },

  fontSize: { // Match to design (14px, 15px, 16px, 18px, 22px, 30.4px, 48px)
    xs: ['0.75rem', { lineHeight: '1rem' }],    // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],// 14px (prompt box placeholder)
    base: ['1rem', { lineHeight: '1.5rem' }],  // 16px (hero subtitle, footer copyright)
    lg: ['1.125rem', { lineHeight: '1.75rem' }],// 18px (hero "مستخدم و محبوب", solution desc, FAQ Q)
    xl: ['1.25rem', { lineHeight: '1.75rem' }],// 20px
    '2xl': ['1.375rem', { lineHeight: '2rem' }],// 22px (solution title, header "الرئيسية")
                                                // Design uses 22px font-size, lineHeight 24px or 26px

    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px (approx 30.4px for "اسأل.. وجوابك حاضر!")
                                                // Design: 30.4px, line-height: 38px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1' }],      // 48px (hero title, section titles)
                                                // Design: 48px, line-height: 59px or 26px
    // Specific sizes from design not fitting Tailwind's scale well
    'design-15': ['0.9375rem', { lineHeight: '1.125rem' }], // 15px, 18px line-height (header nav)
    'design-22': ['1.375rem', { lineHeight: '1.5rem' }], // 22px, 24px line-height (solution title)
    'design-30': ['1.9rem', { lineHeight: '2.375rem' }], // 30.4px, 38px line-height ("اسأل..")
    'design-48': ['3rem', { lineHeight: '3.6875rem' }], // 48px, 59px line-height (hero title)
    'design-48-tight': ['3rem', { lineHeight: '1.625rem' }], // 48px, 26px line-height (section titles)
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    DEFAULT: '0.25rem', // 4px (buttons in calc preview)
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px (CTA button in hero prompt)
    xl: '0.75rem',     // 12px (footer CTA, "sticky" cards)
    '2xl': '1rem',     // 16px (hero prompt box wrapper)
    '3xl': '1.25rem',   // 20px (solution cards, FAQ items)
    full: '9999px',    // For circular elements like social icons
    '7.5px': '7.5px', // Specific from design (header CTA)
    '10px': '10px',   // Specific from design (testimonial cards)
  },

  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0px 2px 4px rgba(25, 33, 61, 0.08)', // From prompt box
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    'cta-button': '0px 2px 5px rgba(20, 88, 201, 0.17), inset 0px -2px 0.3px rgba(14, 56, 125, 0.18), inset 0px 2px 1px rgba(255, 255, 255, 0.22)', // From prompt CTA
    'faq-active': '10px 25px 100px rgba(41, 100, 54, 0.25)', // From active FAQ
  },

  animation: { // Keep existing, add marquee if not present
    none: 'none',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    marquee: 'marquee 30s linear infinite', // For logo scroller
  },

  // Add keyframes if needed, though typically done in CSS
  // keyframes: {
  //   marquee: {
  //     '0%': { transform: 'translateX(0%)' },
  //     '100%': { transform: 'translateX(-100%)' },
  //   }
  // }
};