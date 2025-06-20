// File: src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4'; // Import ReactGA
import './index.css';
import App from './App.tsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- Google Analytics Initialization ---
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-')) {
  try {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    console.log(`GA Initialized with ID: ${GA_MEASUREMENT_ID}`);
    // NOTE: ReactGA.initialize *should* automatically send the first pageview.
    // Verify this during testing. If it doesn't, you might need adjustments
    // in the usePageTracking hook.
  } catch (error) {
    console.error('Error initializing Google Analytics:', error);
  }
} else {
  console.warn(
    'GA Measurement ID (VITE_GA_MEASUREMENT_ID) not found or invalid in environment variables. GA will not be initialized.'
  );
}
// --- End GA Initialization ---

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);