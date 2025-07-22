// In src/lib/Client.ts

// ... existing import
import { QueryClient, MutationCache } from '@tanstack/react-query'; // <-- UPDATE THIS IMPORT
import { toast } from 'react-toastify'; // <-- ADD THIS IMPORT
import { AxiosError } from 'axios'; // <-- ADD THIS IMPORT

// Create the global error handler for mutations
const mutationCache = new MutationCache({
  onError: (error) => {
    // Check if it's an Axios error with a response
    if (error instanceof AxiosError && error.response) {
      
      // Specifically handle "Too Many Requests" errors
      if (error.response.status === 429) {
        // Use the error message from our backend decorator, or a fallback
        const message = error.response.data?.error || 'You have reached your daily usage limit for this feature.';
        toast.warn(message); // Use a 'warning' type toast for limits
      }
      
      // You could add handlers for other global errors here too (e.g., 500 server errors)
    }
  },
});


export const queryClient = new QueryClient({
  // --- ADD THE MUTATION CACHE TO THE CLIENT CONFIGURATION ---
  mutationCache: mutationCache,
  // ---
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});