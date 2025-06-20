// src/styles/theme/tailwind.config.ts
import type { Config } from 'tailwindcss';
import { theme as customTheme } from './index'; // Import our custom theme

// Utility to convert readonly tuples to mutable tuples
function mutableFontSize(fontSizeObj: typeof customTheme.fontSize) {
  const result: Record<string, any> = {};
  for (const key of Object.keys(fontSizeObj) as Array<keyof typeof customTheme.fontSize>) {
    const value = fontSizeObj[key];
    if (Array.isArray(value)) {
      result[key] = [...value] as any; // Spread to make mutable
    } else {
      result[key] = value;
    }
  }
  return result;
}

const config = {
  content: [
    "./index.html", // Make sure this is correct if your index.html is elsewhere
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: customTheme.colors.primary,
        cta: customTheme.colors.cta,
        'logo-accent': customTheme.colors['logo-accent'],
        background: customTheme.colors.background,
        text: customTheme.colors.text,
        border: customTheme.colors.border,
        success: customTheme.colors.success,
        warning: customTheme.colors.warning,
        error: customTheme.colors.error,
        gray: customTheme.colors.gray, // Overwrites default gray, ensure all shades are defined in index.ts
        white: customTheme.colors.white,
        black: customTheme.colors.black,
        transparent: customTheme.colors.transparent,
        tab: customTheme.colors.tab,
        inputTheme: customTheme.colors.input, 
      },
      spacing: customTheme.spacing,
      fontFamily: {
        sans: customTheme.fontFamily.sans, // Primary font for LTR
        arabic: customTheme.fontFamily.arabic, // Primary font for RTL
        // You can also add them directly if you prefer not to use CSS variables for Tailwind
        // inter: customTheme.fontFamily.inter,
        // 'montserrat-arabic': customTheme.fontFamily['montserrat-arabic'],
      },
      fontSize: mutableFontSize(customTheme.fontSize),
      borderRadius: customTheme.borderRadius,
      boxShadow: {
        ...customTheme.boxShadow,
        'input-shadow': customTheme.colors.input.shadow,
      },
      animation: {
        ...customTheme.animation, // Spread existing animations
        'scroll-logos': 'marquee 60s linear infinite', // Example for logo scroller
      },
      keyframes: { // Define keyframes directly in Tailwind config
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }, // Assuming content is duplicated for seamless loop
        },
        // Add other keyframes if needed
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-background.jpg')", // Ensure this path is correct from public folder
      },
      // If you have very specific blurs or blend modes not covered by Tailwind defaults,
      // you might need plugins or to rely on the custom CSS utilities defined in base.css.
      // For common blurs, Tailwind has `blur-sm`, `blur-md`, etc.
      // Example for a very large blur if needed:
      // blur: {
      //   '110': '110px', // You can define custom blur values
      // }
    },
  },
  plugins: [
    // require('@tailwindcss/typography'), // If you use prose styles
    // require('@tailwindcss/forms'), // If you need enhanced form styling
  ],
} satisfies Config;

export default config;