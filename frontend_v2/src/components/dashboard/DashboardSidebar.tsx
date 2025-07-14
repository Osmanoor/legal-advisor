// src/components/dashboard/DashboardSidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Calculator, Edit3, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoDark from '@/assets/logo-new-dash.svg';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAuthStore } from '@/stores/authStore'; // Import the auth store

const iconMap: { [key: string]: React.ElementType } = {
  chat: MessageSquare,
  calculator: Calculator,
  correction: Edit3,
  templates: FileText,
};

export const DashboardSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { logout } = useAuthStore(); // Get the logout function from the store
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { isDesktop } = useBreakpoint();

  const mainNavItems = [
    { path: '/chat', labelKey: 'navigation.chat', textAr: 'المساعد الذكي', iconName: 'chat' },
    { path: '/calculator', labelKey: 'navigation.calculator', textAr: 'الالة الحاسبة', iconName: 'calculator' },
    { path: '/correction', labelKey: 'navigation.correction', textAr: 'معالج النصوص', iconName: 'correction' },
    { path: '/tender-mapping', labelKey: 'navigation.templates', textAr: 'نظام الطرح', iconName: 'templates' },
  ];

  const secondaryNavItems = [
    { path: '/settings', labelKey: 'navigation.settings', textAr: 'الاعدادات', icon: Settings },
    { path: '/help', labelKey: 'navigation.help', textAr: 'المساعدة', icon: HelpCircle },
    { path: '/logout', labelKey: 'navigation.logout', textAr: 'تسجيل خروج', icon: LogOut },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLinkClick = () => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };
  
  // Handler for the logout action
  const handleLogout = async () => {
    handleLinkClick(); // Close sidebar on mobile
    await logout();
    // The AppLayout's protected route logic will handle the redirect to /login
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
      {/* Logo Area */}
      <div className="h-[86px] flex items-center justify-end px-6 border-b border-border-default shrink-0">
        <Link to="/" onClick={handleLinkClick}>
          <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[42.9px] w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow pt-8 px-6 flex flex-col">
        {/* Main Navigation */}
        <ul className="space-y-4 mb-8">
          {mainNavItems.map(item => {
            const IconComponent = iconMap[item.iconName];
            const active = isActive(item.path);
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
                    {item.textAr}
                  </span>
                  {IconComponent && <IconComponent className={`w-5 h-5 ${active ? 'text-cta' : 'text-gray-400 group-hover:text-gray-500'}`} />}
                  {active && <div className="w-1 h-full bg-cta rounded-l-sm absolute right-0 top-0 bottom-0"></div>}
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="border-gray-200 my-8" />
        
        {/* Secondary Navigation (including Logout) */}
        <ul className="space-y-4">
          {secondaryNavItems.map(item => {
            const IconComponent = item.icon;
            // If the item is the logout link, render a button instead
            if (item.path === '/logout') {
              return (
                <li key={item.path}>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-end gap-3 p-3 h-[40px] w-full rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 group transition-colors"
                  >
                    <span className="font-normal text-lg text-right" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                      {item.textAr}
                    </span>
                    <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                  </button>
                </li>
              );
            }
            // Otherwise, render a normal Link
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className="flex items-center justify-end gap-3 p-3 h-[40px] rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 group transition-colors"
                >
                  <span className="font-normal text-lg text-right" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                    {item.textAr}
                  </span>
                  <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};