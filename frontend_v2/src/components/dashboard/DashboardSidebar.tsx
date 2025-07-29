// src/components/dashboard/DashboardSidebar.tsx
// Updated for i18n

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { MessageSquare, Calculator, Edit3, FileText, Settings, HelpCircle, LogOut, Search, Star } from 'lucide-react';
import NewLogoDark from '@/assets/logo-new-dash.svg';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAuthStore } from '@/stores/authStore';
import { usePermission } from '@/hooks/usePermission'; 
import { Permission } from '@/types/user'; 

const iconMap: { [key: string]: React.ElementType } = {
  chat: MessageSquare,
  search: Search,
  calculator: Calculator,
  correction: Edit3,
  templates: FileText,
  feedback: Star,
};

export const DashboardSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { isDesktop } = useBreakpoint();
  const { canAccess } = usePermission();

  const mainNavItems: { path: string; tKey: string; iconName: string; permission: Permission }[] = [
    { path: '/chat', tKey: 'landingPage.solutions.aiAssistant.title', iconName: 'chat', permission: 'access_chat' },
    { path: '/search', tKey: 'landingPage.solutions.advancedSearch.title', iconName: 'search', permission: 'access_search_tool' },
    { path: '/calculator', tKey: 'landingPage.solutions.calculator.title', iconName: 'calculator', permission: 'access_calculator' },
    { path: '/correction', tKey: 'landingPage.solutions.textCorrection.title', iconName: 'correction', permission: 'access_text_corrector' },
    { path: '/tender-mapping', tKey: 'landingPage.solutions.procurementSystem.title', iconName: 'templates', permission: 'access_report_generator' },
    { path: '/feedback', tKey: 'navigation.feedback', iconName: 'feedback', permission: 'access_feedback' },
  ];

  const secondaryNavItems = [
    { path: '/settings', tKey: 'dashboard.sidebar.settings', icon: Settings },
    { path: '/help', tKey: 'dashboard.sidebar.help', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLinkClick = () => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };
  
  const handleLogout = async () => {
    handleLinkClick();
    await logout();
  };

  return (
    <aside
      className={cn(
        "w-[277px] h-screen bg-white border-l border-border-default flex flex-col fixed right-0 top-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "translate-x-full",
        "lg:translate-x-0"
      )}
      style={{ direction: 'ltr' }}
    >
      <div className="h-[86px] flex items-center justify-end px-6 border-b border-border-default shrink-0">
        <Link to="/" onClick={handleLinkClick}>
          <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[42.9px] w-auto" />
        </Link>
      </div>

      <nav className="flex-grow pt-8 px-6 flex flex-col">
        <ul className="space-y-4 mb-8">
          {mainNavItems.map(item => {
            const IconComponent = iconMap[item.iconName];
            const active = isActive(item.path);
            if (!canAccess(item.permission)) {
                return null;
            }
            return (
              <li key={item.path} className="relative">
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-end gap-3 p-3 h-[40px] font-bold rounded-md transition-colors group
                              ${active ? 'bg-[#F5F8FE] text-cta' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                >
                  <span
                    className={`font-medium text-lg ${active ? 'font-semibold' : 'font-normal'} text-right`}
                    style={{ fontFamily: 'var(--font-primary-arabic)' }}
                  >
                    {t(item.tKey)}
                  </span>
                  {IconComponent && <IconComponent className={`w-5 h-5 ${active ? 'text-cta' : 'text-gray-400 group-hover:text-gray-500'}`} />}
                  {active && <div className="w-1 h-full bg-cta rounded-l-sm absolute right-0 top-0 bottom-0"></div>}
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="border-gray-200 my-8" />
        
        <ul className="space-y-4">
          {secondaryNavItems.map(item => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className="flex items-center justify-end gap-3 p-3 h-[40px] rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 group transition-colors"
                >
                  <span className="font-normal text-lg text-right" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                    {t(item.tKey)}
                  </span>
                  <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
                </Link>
              </li>
            );
          })}
           <li>
              <button
                onClick={handleLogout}
                className="flex items-center justify-end gap-3 p-3 h-[40px] w-full rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 group transition-colors"
              >
                <span className="font-normal text-lg text-right" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                  {t('dashboard.sidebar.logout')}
                </span>
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
              </button>
            </li>
        </ul>
      </nav>
    </aside>
  );
};