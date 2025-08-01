// src/components/layouts/AuthLayout.tsx
// Updated for i18n

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoDark from '@/assets/logo-new-dark-name.svg';
import AuthVisual from '/images/auth-visual.png';
import HeroBackground from '/images/hero-background.jpg';
import HeroVectorLeft from '@/assets/vectors/hero-vector-left-login.svg';
import HeroVectorRight from '@/assets/vectors/hero-vector-right-login.svg';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 order-1 lg:order-1 min-h-screen">
        <div className="w-full max-w-md">
          <div className="flex justify-center lg:justify-start mb-8">
            <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[42.9px] w-auto" />
          </div>
          {children}
        </div>
      </div>

      <div className="relative hidden lg:flex lg:h-screen sticky top-0 w-1/2 bg-[#296436] items-start justify-center p-12 order-2 lg:order-2 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0"
          style={{ 
            backgroundImage: `url(${HeroBackground})`,
            backgroundBlendMode: 'luminosity, normal',
            mixBlendMode: 'normal'
          }}
        />
        
        <div 
          className="absolute w-[372.54px] h-[372.54px] rounded-full"
          style={{
            left: '80.16px',
            top: '276.73px',
            background: '#51B749',
            filter: 'blur(109.932px)'
          }}
        />
        
        <img src={HeroVectorRight} alt="" aria-hidden="true" className="absolute -left-[20%] top-[55%] w-[250px] h-[250px] opacity-100 pointer-events-none" />
        <img src={HeroVectorLeft} alt="" aria-hidden="true" className="absolute -right-[5%] top-[0%] w-[250px] h-[250px] opacity-100 pointer-events-none" />

        
        <div className="relative z-10 text-center text-white w-full max-w-lg ">
          <h1 className="text-lg font-bold leading-tight" style={{ fontFamily: 'var(--font-primary-arabic)'}}>
            {t('auth.slogan.title')}
          </h1>
          <p className="text-lg mt-2 opacity-90" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}>
            {t('auth.slogan.subtitle')}
          </p>
          <div className="mt-[-60px] h-[70%] w-full flex items-start justify-center overflow-hidden">
            <img 
              src={AuthVisual} 
              alt={t('auth.slogan.title')} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}