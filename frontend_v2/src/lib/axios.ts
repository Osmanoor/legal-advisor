// src/lib/axios.ts
import axios from 'axios';

// The api instance should be simple. It's a tool for making requests.
// State management logic should live in the Zustand store.
export const api = axios.create({
  // The backend API is running on port 8080, not 5173.
  // The vite.config.ts proxy handles rewriting this in development.
  // We use a relative path here so it works correctly in production too.
  baseURL: import.meta.env.VITE_API_URL || '/api', 
  withCredentials: true, // This is crucial. It tells axios to send cookies.
  headers: {
    'Content-Type': 'application/json',
  },
});

// The problematic interceptor is now removed.
// Error handling (like what to do after a 401) will be managed by
// react-query's `onError` callbacks or the `try/catch` blocks
// within the authStore actions, which is a much more robust pattern.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We simply propagate the error. The caller will handle it.
    return Promise.reject(error);
  }
);