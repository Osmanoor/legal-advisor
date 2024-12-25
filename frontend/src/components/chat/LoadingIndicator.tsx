// LoadingIndicator.tsx
import React from 'react';

interface Props {
  language: 'ar' | 'en';
}

const LoadingIndicator: React.FC<Props> = ({ language }) => {
  const loadingText = language === 'ar' ? 'جاري التحميل...' : 'Loading...';

  return (
    <div className="max-w-[80%] mx-auto mt-4">
      <div className="bg-slate-800/50 border border-slate-700 text-white rounded-2xl px-4 py-2 flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="ml-2">{loadingText}</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;