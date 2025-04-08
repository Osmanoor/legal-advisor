// File: src/hooks/usePageTracking.ts
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export function usePageTracking() {
  const location = useLocation();
  // useRef ensures we check initialization status only once per component mount
  const initialized = useRef(ReactGA.isInitialized);
  const firstRun = useRef(true); // Track if this is the first run of the effect

  useEffect(() => {
    // Only run if GA was successfully initialized
    if (!initialized.current) {
      return;
    }

    // --- Handling the initial page view ---
    // ReactGA.initialize() usually sends the first pageview.
    // This check prevents sending it twice on the initial load.
    // If you find during testing that initialize() DOES NOT send the first hit,
    // you might need to remove this 'firstRun' logic and potentially call
    // ReactGA.send(...) unconditionally here on the first run.
    if (firstRun.current) {
      firstRun.current = false;
      console.log(`GA initial page view likely sent by initialize() for: ${location.pathname + location.search}`);
      return; // Don't send manually on first run
    }
    // --- End Initial Page View Handling ---


    // Send pageview event for subsequent route changes
    const pagePath = location.pathname + location.search;
    ReactGA.send({ hitType: 'pageview', page: pagePath, title: document.title }); // Include title if available
    console.log(`GA Pageview tracked for: ${pagePath}`);

  }, [location]); // Dependency array: re-run effect when location changes
}