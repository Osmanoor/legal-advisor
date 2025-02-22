// src/hooks/useToast.ts
import { toast, ToastOptions } from 'react-toastify';
import { useLanguage } from './useLanguage';

export function useToast() {
  const { direction } = useLanguage();

  const defaultOptions: ToastOptions = {
    position: direction === 'rtl' ? 'top-left' : 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    toast[type](message, defaultOptions);
  };

  return { showToast };
}