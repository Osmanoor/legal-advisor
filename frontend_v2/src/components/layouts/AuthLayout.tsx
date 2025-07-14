// File: src/components/layouts/AuthLayout.tsx
// @updated
// Corrected order as per user feedback and implemented height fix for the visual pane.

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoDark from '@/assets/logo-new-dark-name.svg';
import AuthVisual from '/images/auth-visual.png';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col lg:flex-row">
      {/* Right Pane (Form Area) - Now correctly ordered first */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 order-1 lg:order-1 min-h-screen">
        <div className="w-full max-w-md">
          <div className="flex justify-center lg:justify-start mb-8">
             <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[42.9px] w-auto" />
          </div>
          {children}
        </div>
      </div>

      {/* Left Pane (Visual Area) - Now correctly ordered second */}
      {/* MODIFICATION: Added lg:h-screen lg:sticky to fix the height issue. */}
      <div className="relative hidden lg:flex lg:h-screen lg:sticky top-0 w-1/2 bg-[#51B749] items-center justify-center p-12 order-2 lg:order-2">
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold leading-tight" style={{ fontFamily: 'var(--font-primary-arabic)'}}>
            {t('auth.slogan.title')}
          </h1>
          <p className="text-lg mt-4 opacity-90" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}>
             {t('auth.slogan.subtitle')}
          </p>
          <img 
            src={AuthVisual} 
            alt={t('auth.slogan.title')} 
            className="max-w-lg mx-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}