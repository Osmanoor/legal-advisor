// File: src/features/landing/components/LandingPageFooter.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Twitter, Instagram, Linkedin as LucideLinkedin } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoDark from '@/assets/logo-new-dark.svg';
import { cn } from '@/lib/utils'; // Import cn utility for cleaner class management

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* === TOP SECTION OF FOOTER === */}
        <div
          className={cn(
            // MOBILE (Default): A single, centered column.
            "flex flex-col items-center text-center gap-10",
            // DESKTOP (md and up): A row layout with items aligned to the start.
            "md:flex-row md:justify-between md:items-start",
            direction === 'rtl' ? "md:text-right" : "md:text-left",
            "mb-8 pb-8 border-b border-border-subtle"
          )}
        >
          {/* Logo */}
          <div className="md:order-2"> {/* On desktop, logo is on the right */}
            <Link to="/" className="inline-block">
              <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[70px] md:h-[85.79px] w-auto" />
            </Link>
          </div>
          
          {/* Nav & Button Group */}
          <div
            className={cn(
              // MOBILE: A centered column.
              "flex flex-col items-center gap-8",
              // DESKTOP: A row with items aligned to the start.
              "md:flex-row md:items-start md:gap-16 md:order-1"
            )}
          >
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2.5">
              {footerNavigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-text-on-light-default hover:text-primary-dark text-base md:text-[18px] leading-[22px] font-light"
                  style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)', fontWeight: 300 }}
                >
                  {language === 'ar' ? item.textAr : item.textEn}
                </Link>
              ))}
            </nav>

            {/* Login Button */}
            <Link
              to="/login"
              className="bg-cta hover:bg-cta-hover text-text-on-dark font-normal text-base leading-5 px-8 py-3 rounded-xl transition-colors"
              style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)', fontWeight: 400 }}
            >
              {t('landingPage.footer.loginButton')}
            </Link>
          </div>
        </div>
        
        {/* === BOTTOM SECTION OF FOOTER === */}
        <div className="flex flex-col-reverse items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-cta" fill="currentColor" />
            <p className="text-sm text-text-on-light-header">
              {t('landingPage.footer.copyright', { year: new Date().getFullYear().toString() })}
            </p>
          </div>
          <div className="flex items-center gap-3">
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