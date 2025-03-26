import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import path from 'path';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t, language, direction, setLanguage } = useLanguage();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'navigation.home' },
    { path: '/search', label: 'navigation.search' },
    { path: '/chat', label: 'navigation.chat' },
    { path: '/library', label: 'navigation.library' },
    { path: '/calculator', label: 'navigation.calculator' },
    { path: '/correction', label: 'navigation.correction' },
    { path: '/templates', label: 'navigation.templates'},
    { path: '/journey', label: 'navigation.journey'} ,
    { path: '/tender-mapping', label: 'navigation.tenderMapping'} 
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-white" dir={direction}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/"
              className="text-2xl font-black text-indigo-950 hover:text-indigo-800 transition-colors"
            >
              {t('procurement.communityName')}
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-indigo-950'
                      : 'text-indigo-700 hover:text-indigo-950'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-950 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-50 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          {/* Upper Footer */}
          <div className="flex justify-between items-center mb-12">
            <div className="text-sm text-indigo-950">
              © {new Date().getFullYear()} {t('procurement.communityName')}
            </div>
            <div className="text-2xl font-black text-indigo-950">
              {t('procurement.systemName')}
            </div>
            <Link
              to="/chat"
              className="px-6 py-2 bg-indigo-950 text-white rounded-sm text-sm font-medium hover:bg-indigo-900 transition-colors"
            >
              {t('landing.hero.cta')}
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-indigo-200 mb-8" />

          {/* Lower Footer */}
          <div className="flex justify-between items-center">
            {/* Footer Navigation */}
            <nav className="flex gap-8 text-sm text-indigo-950">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="hover:text-indigo-800 transition-colors"
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            {/* Social Links - You can customize these as needed */}
            <div className="flex gap-6">
              <a href="https://www.linkedin.com/in/yousefalmazyad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-950 hover:text-indigo-800 transition-colors"
              >
                LinkedIn
              </a>
              {/* Add more social links as needed */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}