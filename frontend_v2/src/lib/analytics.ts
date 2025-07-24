// src/lib/analytics.ts
import ReactGA from 'react-ga4';

// A union type for our specific event names for better type safety
export type GtagEvent = {
  event: 
    | 'feature_used'
    | 'search'
    | 'sign_up'
    | 'login'
    | 'feedback_submitted'
    | 'contact_form_submitted';
  [key: string]: any; // Allows for additional parameters like feature_name, search_term, etc.
};

export const trackEvent = (params: GtagEvent) => {
  // Ensure GA is initialized before trying to send an event
  if (ReactGA.isInitialized) {
    // Separate the event name from the rest of the parameters
    const { event, ...eventParams } = params;
    
    // Log to console for easy debugging during development
    console.log(`[GA Event] Firing event: `, { name: event, params: eventParams });
    
    // Send the event to Google Analytics
    ReactGA.event(event, eventParams);
  } else {
    console.warn('[GA Event] GA not initialized. Event not tracked:', params);
  }
};