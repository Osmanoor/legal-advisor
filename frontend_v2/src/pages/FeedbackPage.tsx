// src/pages/FeedbackPage.tsx

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { FeedbackForm } from '@/features/feedback/components/FeedbackForm';

export default function FeedbackPage() {
  const { t, direction } = useLanguage();

  return (
    <div className="p-4 md:p-6 lg:p-8" dir={direction}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className={`mb-6 md:mb-8 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
          <h1 className="text-2xl font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
            التقييم والملاحظات
          </h1>
          <p className="text-sm text-text-on-light-faint mt-1">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed
          </p>
        </div>

        {/* Main Content */}
        <FeedbackForm />
      </div>
    </div>
  );
}