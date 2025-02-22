// src/components/common/ToastProvider.tsx
import { ToastContainer } from 'react-toastify';
import { useLanguage } from '@/hooks/useLanguage';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
  const { direction } = useLanguage();

  return (
    <ToastContainer
      position={direction === 'rtl' ? 'top-left' : 'top-right'}
      rtl={direction === 'rtl'}
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}