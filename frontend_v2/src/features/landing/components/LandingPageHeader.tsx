// File: src/features/landing/components/LandingPageHeader.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoLight from '@/assets/logo-new-light.svg';
import { Menu, X } from 'lucide-react'; // Import icons for menu toggle
import { cn } from '@/lib/utils'; // Import cn utility

const LANDING_HEADER_SCROLL_THRESHOLD_SOLID = 50;

export const LandingPageHeader = () => {
  const { t, language, direction } = useLanguage();
  const location = useLocation();
  const [useSolidHeroBg, setUseSolidHeroBg] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const headerNavigationItems = [
    { id: 'faq', path: '#faq', labelKey: 'navigation.faq', textAr: 'الأسئلة الشائعة', textEn: 'FAQ' },
    { id: 'reviews', path: '#reviews', labelKey: 'navigation.userReviews', textAr: 'أراء المستخدمين', textEn: 'Reviews' },
    { id: 'features', path: '#features', labelKey: 'navigation.whatSetsUsApart', textAr: 'ما يميزنا', textEn: 'Features' },
    { id: 'solutions', path: '#solutions', labelKey: 'navigation.solutions', textAr: 'حلولنا', textEn: 'Solutions' },
    { id: 'home', path: '#home', labelKey: 'navigation.home', textAr: 'الرئيسية', textEn: 'Home', isBold: true },
  ];

  const isActive = (itemPath: string) => {
    const currentHash = location.hash;
    if (itemPath === '#home') return currentHash === '' || currentHash === '#home';
    return currentHash === itemPath;
  };

  useEffect(() => {
    const handleScrollListener = () => {
      setUseSolidHeroBg(window.scrollY > LANDING_HEADER_SCROLL_THRESHOLD_SOLID);
    };
    window.addEventListener('scroll', handleScrollListener);
    return () => window.removeEventListener('scroll', handleScrollListener);
  }, []);

  // Close mobile menu if window is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);


  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    setIsMenuOpen(false); // Close menu on click
    const targetId = path.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerOffset = 80; // Approximate header height
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      window.history.pushState(null, '', path);
    }
  };

  const headerDynamicStyles: React.CSSProperties = useSolidHeroBg || isMenuOpen ? {
    backgroundImage: "url('/images/hero-background.jpg')",
    backgroundColor: 'var(--color-primary-dark)',
    backgroundBlendMode: "luminosity, normal",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : { backgroundColor: 'transparent' };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3.5 transition-all duration-0",
        (useSolidHeroBg || isMenuOpen) && "shadow-md"
      )}
      style={headerDynamicStyles}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-row-reverse justify-between items-center h-[45px]">
          {/* Logo */}
          <div className={`${direction === 'rtl' ? 'order-3' : 'order-1'}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img src={NewLogoLight} alt={t('procurement.communityName')} className="h-[45px] sm:h-[53.62px] w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-11 ${direction === 'rtl' ? 'order-2 flex-row-reverse' : 'order-2'}`}>
            {headerNavigationItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className={cn(
                  "text-[15px] leading-[18px] transition-colors text-gray-200 hover:text-white",
                  isActive(item.path) && "text-white font-bold",
                  item.isBold && "font-bold text-[18px] leading-[22px]"
                )}
                style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)' }}
              >
                {language === 'ar' ? item.textAr : item.textEn}
              </a>
            ))}
          </nav>
          
          {/* Start Now Button & Mobile Menu Toggle */}
          <div className={`flex items-center gap-4 ${direction === 'rtl' ? 'order-1' : 'order-3'}`}>
            <Link
              to="/chat"
              className="hidden sm:block bg-cta text-text-on-dark hover:bg-primary-light hover:text-primary font-bold text-[15px] leading-[18px] px-10 py-3 rounded-lg transition-colors"
              style={{ fontFamily: language === 'ar' ? 'var(--font-primary-arabic)' : 'var(--font-primary-latin)' }}
            >
              {t('landingPage.hero.startNowButton')}
            </Link>
            <button
              className="lg:hidden text-white z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[77px] bg-primary-dark/95 backdrop-blur-sm flex flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-8">
            {headerNavigationItems.slice().reverse().map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className="text-2xl text-gray-200 hover:text-white font-medium"
              >
                {language === 'ar' ? item.textAr : item.textEn}
              </a>
            ))}
             <Link
              to="/chat"
              className="sm:hidden bg-cta text-text-on-dark hover:bg-primary-light hover:text-primary font-bold text-xl px-10 py-3 rounded-lg transition-colors mt-8"
            >
              {t('landingPage.hero.startNowButton')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};