// src/features/landing/components/LandingPageFooter.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Twitter, Instagram, Linkedin as LucideLinkedin } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoDark from '@/assets/logo-new-dark.svg'; // Dark logo for light footer

export const LandingPageFooter = () => {
  const { t, language, direction } = useLanguage();

  const footerNavigationItems = [
    { path: '/', labelKey: 'navigation.home', textAr: 'الرئيسية', textEn: 'Home' },
    { path: '/solutions', labelKey: 'navigation.solutions', textAr: 'حلولنا', textEn: 'Solutions' },
    { path: '/what-sets-us-apart', labelKey: 'navigation.whatSetsUsApart', textAr: 'ما يميزنا', textEn: 'Features' },
    { path: '/user-reviews', labelKey: 'navigation.userReviews', textAr: 'أراء المستخدمين', textEn: 'Reviews' },
    { path: '/faq', labelKey: 'navigation.faq', textAr: 'الأسئلة الشائعة', textEn: 'FAQ' },
  ];

  return (
    <footer className="bg-background-body py-10 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-8 border-b border-border-subtle">
          <div className={`mb-8 md:mb-0 ${direction === 'rtl' ? 'md:order-2 md:text-right' : 'md:order-1 md:text-left'}`}>
            <Link to="/" className="flex items-center mb-4">
              <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[85.79px] w-auto" />
            </Link>
          </div>
          <div className={`flex flex-col sm:flex-row ${direction === 'rtl' ? 'sm:flex-row-reverse md:order-1' : 'md:order-2'} items-start gap-10 md:gap-16`}>
            <nav className={`flex flex-col ${direction === 'rtl' ? 'items-end' : 'items-start'} gap-2.5`}>
              {footerNavigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-text-on-light-default hover:text-primary-dark text-[18px] leading-[22px] font-light"
                  style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)', fontWeight: 300 }}
                >
                  {language === 'ar' ? item.textAr : item.textEn}
                </Link>
              ))}
            </nav>
            <Link
              to="/login" // Or your actual login/signup route
              className="bg-cta hover:bg-cta-hover text-text-on-dark font-normal text-base leading-5 px-8 py-3 rounded-xl transition-colors mt-4 sm:mt-0"
              style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)', fontWeight: 400 }}
            >
              {t('landingPage.footer.loginButton')}
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className={`flex items-center gap-1 ${direction === 'rtl' ? 'sm:order-2' : 'sm:order-1'}`}>
            <Star className="w-4 h-4 text-cta" fill="currentColor" />
            <p className="text-sm text-text-on-light-header">
              {t('landingPage.footer.copyright', { year: new Date().getFullYear().toString() })}
            </p>
          </div>
          <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'sm:order-1' : 'sm:order-2'}`}>
            <a href="#" aria-label="Twitter" className="text-black/50 hover:text-black"><Twitter className="w-[18px] h-[18px]" /></a>
            <span className="text-black/50 text-xs">/</span>
            <a href="#" aria-label="Instagram" className="text-black/50 hover:text-black"><Instagram className="w-[18px] h-[18px]" /></a>
            <span className="text-black/50 text-xs">/</span>
            <a href="#" aria-label="LinkedIn" className="text-black/50 hover:text-black"><LucideLinkedin className="w-[18px] h-[18px]" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};