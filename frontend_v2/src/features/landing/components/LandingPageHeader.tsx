// src/features/landing/components/LandingPageHeader.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoLight from '@/assets/logo-new-light.svg'; // Assuming light logo for hero
// No dark logo needed here as this header is only for landing page hero

const LANDING_HEADER_SCROLL_THRESHOLD_SOLID = 850; // When to make header solid with hero bg

export const LandingPageHeader = () => {
  const { t, language, direction } = useLanguage();
  const location = useLocation(); // To confirm it's landing page, though this comp is specific
  const [useSolidHeroBg, setUseSolidHeroBg] = useState(false);

  const headerNavigationItems = [
    { path: '/user-reviews', labelKey: 'navigation.userReviews', textAr: 'أراء المستخدمين', textEn: 'Reviews' },
    { path: '/faq', labelKey: 'navigation.faq', textAr: 'الأسئلة الشائعة', textEn: 'FAQ' },
    { path: '/what-sets-us-apart', labelKey: 'navigation.whatSetsUsApart', textAr: 'ما يميزنا', textEn: 'Features' },
    { path: '/solutions', labelKey: 'navigation.solutions', textAr: 'حلولنا', textEn: 'Solutions' },
    { path: '/', labelKey: 'navigation.home', textAr: 'الرئيسية', textEn: 'Home', isBold: true },
  ];
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setUseSolidHeroBg(window.scrollY > LANDING_HEADER_SCROLL_THRESHOLD_SOLID);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerDynamicStyles: React.CSSProperties = useSolidHeroBg ? {
    backgroundImage: "url('/images/hero-background.jpg')",
    backgroundColor: 'var(--color-primary-dark)',
    backgroundBlendMode: "luminosity, normal",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : { backgroundColor: 'transparent' };

  const headerExtraClasses = useSolidHeroBg ? 'shadow-md' : '';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3.5 transition-all duration-300 ${headerExtraClasses}`}
      style={headerDynamicStyles}
    >
      <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-[45px]">
          <div className={`${direction === 'rtl' ? 'order-3' : 'order-1'}`}>
            <Link
              to="/start-now" // This should lead to the dashboard, e.g., /chat or /dashboard
              className="bg-cta hover:bg-cta-hover text-text-on-dark font-bold text-[15px] leading-[18px] px-10 py-3 rounded-lg transition-colors"
              style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)' }}
            >
              {t('landingPage.hero.startNowButton')}
            </Link>
          </div>
          <nav className={`flex items-center gap-11 ${direction === 'rtl' ? 'order-2 flex-row-reverse' : 'order-2'}`}>
            {headerNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[15px] leading-[18px] transition-colors text-gray-200 hover:text-white
                            ${isActive(item.path) ? 'text-white font-bold' : ''}
                            ${item.isBold ? 'font-bold text-[18px] leading-[22px]' : ''}`}
                style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)' }}
              >
                {language === 'ar' ? item.textAr : item.textEn}
              </Link>
            ))}
          </nav>
          <div className={`${direction === 'rtl' ? 'order-1' : 'order-3'}`}>
            <Link to="/" className="flex items-center">
              <img src={NewLogoLight} alt={t('procurement.communityName')} className="h-[53.62px] w-auto" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};